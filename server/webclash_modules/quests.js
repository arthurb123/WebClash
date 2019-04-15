//Quests module for WebClash Server

const fs = require('fs');

exports.collection = [];

exports.loadAllQuests = function(cb)
{
    let location = 'quests';

    fs.readdir(location, (err, files) => {
        let count = 0;

        files.forEach(file => {
            let quest = quests.loadQuest(location + '/' + file);
            quest.name = file.substr(0, file.lastIndexOf('.'));

            if (quest.objectives.length != 0) {
                quests.collection.push(quest);

                count++;
            }
            else
                output.give('Could not load "' + quest.name + '" as it has no objectives.');
        });

        output.give('Loaded ' + count + ' quest(s).');

        if (cb !== undefined)
            cb();
    });
};

exports.loadQuest = function(location)
{
    try {
        return JSON.parse(fs.readFileSync(location, 'utf-8'));
    }
    catch (err)
    {
        output.giveError('Could not load quest: ', err);
    }
};

exports.getQuest = function(name)
{
    let id = this.getQuestIndex(name);
    if (id == -1)
        return;

    return this.collection[id];
};

exports.getQuestIndex = function(name)
{
    for (let i = 0; i < this.collection.length; i++)
        if (this.collection[i].name === name)
            return i;

    return -1;
};

exports.getQuestDialog = function(name)
{
    let quest = JSON.parse(JSON.stringify(this.getQuest(name)));

    if (quest == undefined)
        return;

    //Set description as dialog text,
    //and remove description

    quest.text = quest.description + '<br><i>';
    delete quest.description;

    //Add objectives and rewards to text

    for (let o = 0; o < quest.objectives.length; o++) {
        quest.text += '<br>● ';

        //Kill objective
        if (quest.objectives[o].type === 'kill')
            quest.text += 'Kill ' + quest.objectives[o].killObjective.amount + ' ' + quest.objectives[o].killObjective.npc + (quest.objectives[o].killObjective.amount === 1 ? '' : 's') + '.';

        //Gather objective
        if (quest.objectives[o].type === 'gather')
            quest.text += 'Gather ' + quest.objectives[o].gatherObjective.amount + ' ' + quest.objectives[o].gatherObjective.item + (quest.objectives[o].gatherObjective.amount === 1 ? '' : 's') + '.';
    }

    quest.text += '</i><br><br>Rewards: ' + quest.rewards.experience + ' Exp, ' + quest.rewards.gold + ' Gold';

    //Remove unnecessary properties

    delete quest.rewards;

    return quest;
};

exports.acceptQuest = function(id, name)
{
    //Check if player is valid

    if (game.players[id] == undefined)
        return false;

    //Check if player already has quest

    if (game.players[id].quests[name] != undefined)
        return false;

    //Get quest

    let quest = this.getQuest(name);

    //Check if player matches quest criteria

    if (quest.minLevel > game.players[id].level)
        return false;

    //Accept quest and stuff

    game.players[id].quests[name] = {
        objectives: JSON.parse(JSON.stringify(quest.objectives)),
        id: 0,
        pinned: true
    };

    //Check if conditions can be met

    //Gather conditions

    if (game.players[id].quests[name].objectives[0].type === 'gather')
        this.evaluateQuestObjective(id, 'gather', game.players[id].quests[name].objectives[0].gatherObjective.item);

    //Sync to player

    server.syncPlayerPartially(id, 'quests', game.players[id].socket, false);

    //Return true

    return true;
};

exports.evaluateQuestObjective = function(id, type, target)
{
    //Check if player is valid

    if (game.players[id] == undefined)
        return;

    //Initialize variables

    let sync = false;

    //Check if player has a quest with the matching objective

    for (let quest in game.players[id].quests) {
        let objective = game.players[id].quests[quest].objectives[game.players[id].quests[quest].id];

        //Check if type matches

        if (objective.type === type) {
            //Handle target accordingly for
            //every objective data type

            //Kill objective

            if (objective.killObjective != undefined &&
                objective.killObjective.npc === target) {
                objective.killObjective.cur++;

                sync = true;

                if (objective.killObjective.cur >= objective.killObjective.amount)
                  this.advanceQuest(id, quest);
            }

            //Gather objective

            if (objective.gatherObjective != undefined &&
                objective.gatherObjective.item === target) {
                objective.gatherObjective.cur = items.getPlayerItemAmount(id, objective.gatherObjective.item);

                sync = true;

                if (objective.gatherObjective.cur >= objective.gatherObjective.amount)
                  this.advanceQuest(id, quest);
            }
        }
    }

    //Sync quest(s) to player if necessary

    if (sync)
        server.syncPlayerPartially(id, 'quests', game.players[id].socket, false);
};

exports.resetQuestObjectives = function(id)
{
    //Check if player is valid

    if (game.players[id] == undefined)
        return;

    //Initialize variables

    let sync = false;

    //Go through all quests

    for (let quest in game.players[id].quests) {
        //Get current objective id and objective

        let current = game.players[id].quests[quest].id,
            objective = game.players[id].quests[quest].objectives[current];

        //Check for kill objective reset

        if (objective.type === 'kill' &&
            objective.killObjective != undefined &&
            objective.killObjective.resetOnDeath) {
            objective.killObjective.cur = 0;

            sync = true;
            continue;
        }

        //Other objectives that feature on death reset

        //...
    };

    //Sync quest(s) to player if necessary

    if (sync)
        server.syncPlayerPartially(id, 'quests', game.players[id].socket, false);
};

exports.advanceQuest = function(id, name)
{
    //Check if player has quest

    if (game.players[id].quests[name] == undefined)
        return;

    //Go to next objective if available,
    //otherwise finish quest

    let objectives = this.getQuest(name).objectives,
        o_id = game.players[id].quests[name].id+1;

    if (objectives[o_id] == undefined)
        this.finishQuest(id, name);
    else
        game.players[id].quests[name].id = o_id;
};

exports.finishQuest = function(id, name)
{
    //Check if player has quest

    if (game.players[id].quests[name] == undefined)
        return;

    //Get quest rewards

    let rewards = this.getQuest(name).rewards;

    //Redeem quest rewards

    game.deltaGoldPlayer(id, rewards.gold);
    game.addPlayerExperience(id, rewards.experience);

    //Set quest completed global variable

    game.setPlayerGlobalVariable(id, this.formatQuestName(name), true);

    //Remove quest from player

    delete game.players[id].quests[name];
};

exports.formatQuestName = function(name)
{
    return 'Quest' + name.replace(/[\W_]/g, "");
};

exports.hasCompleted = function(id, name)
{
    let result = game.getPlayerGlobalVariable(id, this.formatQuestName(name));

    if (result == undefined)
        result = false;

    return result;
};
