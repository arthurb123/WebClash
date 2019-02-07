//Actions module for WebClash Server

const fs = require('fs');

exports.collection = [];

exports.updateCooldowns = function() {
    for (let p = 0; p < game.players.length; p++)
        if (game.players[p] != undefined &&
            game.players[p].actions_cooldown != undefined)
            for (let action in game.players[p].actions_cooldown)
            {
                if (game.players[p].actions_cooldown[action] == undefined)
                    continue;
                
                game.players[p].actions_cooldown[action]--;
                
                if (game.players[p].actions_cooldown[action] <= 0)
                    game.players[p].actions_cooldown[action] = undefined;
            }
};

exports.getAction = function(name)
{
    let id = this.getActionIndex(name);
    if (id == -1)
        return;
    
    return this.collection[id];
};

exports.getActionIndex = function(name)
{
    for (let i = 0; i < this.collection.length; i++)
        if (this.collection[i].name === name)
            return i;
    
    return -1;
};

exports.hasPlayerAction = function(name, id)
{
    if (game.players[id] === undefined)
        return false;
    
    for (let a = 0; a < game.players[id].actions.length; a++)
        if (game.players[id].actions[a] != undefined &&
            game.players[id].actions[a].name === name)
            return true;
    
    return false;
};

exports.onCooldownPlayerAction = function(name, id)
{
    if (game.players[id] === undefined)
        return false;
    
    if (game.players[id].actions_cooldown === undefined)
        game.players[id].actions_cooldown = {};
    
    if (game.players[id].actions_cooldown[name] == undefined)
        return false;
    else 
        return true;
};

exports.addPlayerAction = function(name, id, uses)
{
    if (game.players[id] === undefined)
        return false;
    
    let done = false;
    
    for (let a = 2; a < 7; a++)
        if (game.players[id].actions[a] === undefined) {
            game.players[id].actions[a] = {
                name: name   
            };
            
            if (uses !== undefined) {
                game.players[id].actions[a].uses = uses;
                game.players[id].actions[a].max = uses;
            }
            
            done = true;
                
            break;
        }
    
    if (done)
        server.syncPlayerPartially(id, 'actions', game.players[id].socket, false);
    
    return done;
};

exports.setPlayerAction = function(socket, name, position, id)
{
    if (game.players[id] === undefined)
        return false;
    
    game.players[id].actions[position] = {
        name: name
    };
    
    server.syncPlayerPartially(id, 'actions', socket, false);
    
    return true;
};

exports.removePlayerAction = function(socket, name, id)
{
    if (!this.hasPlayerAction(name, id))
        return true;
    
    for (let a = 0; a < game.players[id].actions.length; a++)
        if (game.players[id].actions[a] !== undefined &&
            game.players[id].actions[a].name === name) {
            game.players[id].actions[a] = undefined;
            
            break;
        }
    
    server.syncPlayerPartially(id, 'actions', socket, false);
    
    return true;
};

exports.createPlayerSlotAction = function(action)
{
    let id = this.getActionIndex(action.name);
    
    if (id == -1)
        return;
    
    return {
        name: action.name,
        uses: action.uses,
        max: action.max,
        description: this.collection[id].description,
        cooldown: this.collection[id].cooldown,
        src: this.collection[id].src
    };
};

exports.createPlayerAction = function(name, id)
{
    let a_id = this.getActionIndex(name);
    
    //Check if valid
    
    if (a_id == -1)
        return false;
    
    //Check if player has the action
    
    if (!this.hasPlayerAction(name, id))
        return false;
    
    //Check if the action is on cooldown
    
    if (this.onCooldownPlayerAction(name, id))
        return false;
    
    //Generate action data
    
    let actionData = {
        pos: game.calculateFace(
            game.players[id].pos, 
            game.players[id].character.width,
            game.players[id].character.height,
            game.players[id].direction
        ),
        map: tiled.getMapIndex(game.players[id].map),
        elements: JSON.parse(JSON.stringify(this.collection[a_id].elements))
    };
    
    //Positional correction
    
    if (game.players[id].direction == 1 ||
        game.players[id].direction == 2)
         for (let e = 0; e < actionData.elements.length; e++) {
             let x = actionData.elements[e].x;
             
             actionData.elements[e].x = actionData.elements[e].y;
             actionData.elements[e].y = x+game.players[id].character.height;
             
             if (game.players[id].direction == 1)
                 actionData.elements[e].x = this.collection[a_id].sw-actionData.elements[e].x-actionData.elements[e].w+game.players[id].character.width;
             else 
                 actionData.elements[e].x -= game.players[id].character.width;
         }
    
    if (game.players[id].direction == 3)
        for (let e = 0; e < actionData.elements.length; e++)
             actionData.elements[e].y = this.collection[a_id].sh-actionData.elements[e].y-actionData.elements[e].h+game.players[id].character.height*2;
    
    //Set action data position
    
    actionData.pos.X+=game.players[id].character.width/2-this.collection[a_id].sw/2;
    actionData.pos.Y+=-this.collection[a_id].sh/2-game.players[id].character.height/2;
    
    //Damage NPCs
    
    this.damageNPCs(id, game.players[id].stats.attributes, actionData, this.collection[a_id]);
    
    //Check for healing
    
    if (this.collection[a_id].heal > 0)
        this.healPlayers(actionData, this.collection[a_id].heal);
    
    //Add cooldown to slot
    
    if (game.players[id].actions_cooldown === undefined)
        game.players[id].actions_cooldown = {};
    
    game.players[id].actions_cooldown[name] = this.collection[a_id].cooldown;
    
    //Sync action
    
    server.syncAction(actionData);
    
    //Return true
    
    return true;
};

exports.createNPCAction = function(possibleAction, map, id)
{
    let a_id = this.getActionIndex(possibleAction.action);
    
    //Check if valid
    
    if (a_id == -1)
        return false;
    
    //Generate action data
    
    let actionData = {
        pos: game.calculateFace(
            npcs.onMap[map][id].pos, 
            npcs.onMap[map][id].data.character.width,
            npcs.onMap[map][id].data.character.height,
            npcs.onMap[map][id].direction
        ),
        map: map,
        elements: JSON.parse(JSON.stringify(this.collection[a_id].elements))
    };
    
    //Positional correction
    
    if (npcs.onMap[map][id].direction == 1 ||
        npcs.onMap[map][id].direction == 2)
         for (let e = 0; e < actionData.elements.length; e++) {
             let x = actionData.elements[e].x;
             
             actionData.elements[e].x = actionData.elements[e].y;
             actionData.elements[e].y = x+npcs.onMap[map][id].data.character.height;
             
             if (npcs.onMap[map][id].direction == 1)
                 actionData.elements[e].x = this.collection[a_id].sw-actionData.elements[e].x-actionData.elements[e].w+npcs.onMap[map][id].data.character.width;
             else 
                 actionData.elements[e].x -= npcs.onMap[map][id].data.character.width;
         }
    
    if (npcs.onMap[map][id].direction == 3)
        for (let e = 0; e < actionData.elements.length; e++)
             actionData.elements[e].y = this.collection[a_id].sh-actionData.elements[e].y-actionData.elements[e].h+npcs.onMap[map][id].data.character.height*2;
    
    //Set action data position
    
    actionData.pos.X+=npcs.onMap[map][id].data.character.width/2-this.collection[a_id].sw/2;
    actionData.pos.Y+=-this.collection[a_id].sh/2-npcs.onMap[map][id].data.character.height/2;
    
    //Damage players
    
    this.damagePlayers(npcs.onMap[map][id].data.stats, actionData, this.collection[a_id]);
    
    //Check for healing
    
    this.healNPCs(npcs.onMap[map][id].data.stats, actionData, this.collection[a_id]);
    
    //Sync action
    
    server.syncAction(actionData);
    
    //Set NPC cooldown
    
    npcs.onMap[map][id].combat_cooldown.start(this.collection[a_id].cooldown+possibleAction.extraCooldown);
};

exports.loadAllActions = function(cb)
{
    let location = 'actions';
    
    fs.readdir(location, (err, files) => {
        let count = 0;
        
        files.forEach(file => {
            actions.collection.push(actions.loadAction(location + '/' + file));
            
            count++;
        });
        
        output.give('Loaded ' + count + ' action(s).');
        
        if (cb !== undefined)
            cb();
    });
};

exports.loadAction = function(location)
{
    try {
        return JSON.parse(fs.readFileSync(location, 'utf-8'));
    }
    catch (err)
    {
        output.give(err);
    }
};

exports.damageNPCs = function(owner, stats, actionData, action)
{
    if (npcs.onMap[actionData.map] == undefined ||
        npcs.onMap[actionData.map].length == 0)
        return;
    
    for (let e = 0; e < actionData.elements.length; e++)
        for (let n = 0; n < npcs.onMap[actionData.map].length; n++)
        {   
            if (npcs.onMap[actionData.map][n].data.type !== 'hostile' ||
                npcs.isTimedOut(actionData.map, n))
                continue;

            let actionRect = {
                x: actionData.pos.X+actionData.elements[e].x,
                y: actionData.pos.Y+actionData.elements[e].y,
                w: actionData.elements[e].w,
                h: actionData.elements[e].h
            };
            
            let npcRect = {
                x: npcs.onMap[actionData.map][n].pos.X,
                y: npcs.onMap[actionData.map][n].pos.Y,
                w: npcs.onMap[actionData.map][n].data.character.width,
                h: npcs.onMap[actionData.map][n].data.character.height
            };

            if (tiled.checkRectangularCollision(actionRect, npcRect)) 
                npcs.damageNPC(owner, actionData.map, n, this.calculateDamage(stats, action.scaling));
        }
};

exports.healNPCs = function(actionData, action)
{
    if (npcs.onMap[actionData.map] == undefined ||
        npcs.onMap[actionData.map].length == 0)
        return;
    
    for (let e = 0; e < actionData.elements.length; e++)
        for (let n = 0; n < npcs.onMap[actionData.map].length; n++)
        {   
            if (npcs.onMap[actionData.map][n].data.type !== 'hostile' ||
                npcs.isTimedOut(actionData.map, n))
                continue;

            let actionRect = {
                x: actionData.pos.X+actionData.elements[e].x,
                y: actionData.pos.Y+actionData.elements[e].y,
                w: actionData.elements[e].w,
                h: actionData.elements[e].h
            };
            
            let npcRect = {
                x: npcs.onMap[actionData.map][n].pos.X,
                y: npcs.onMap[actionData.map][n].pos.Y,
                w: npcs.onMap[actionData.map][n].data.character.width,
                h: npcs.onMap[actionData.map][n].data.character.height
            };

            if (tiled.checkRectangularCollision(actionRect, npcRect)) 
            {
                npcs.onMap[actionData.map][n].health.cur += action.heal;
                
                if (npcs.onMap[actionData.map][n].health.cur >= npcs.onMap[actionData.map][n].health.max)
                    npcs.onMap[actionData.map][n].health.cur = npcs.onMap[actionData.map][n].health.max;
                
                server.syncNPCPartially(map, n, 'health');
            }
        }
};

exports.damagePlayers = function(stats, actionData, action)
{
    for (let e = 0; e < actionData.elements.length; e++)
        for (let p = 0; p < game.players.length; p++)
        {
            if (tiled.getMapIndex(game.players[p].map) != actionData.map)
                continue;
            
            let actionRect = {
                x: actionData.pos.X+actionData.elements[e].x,
                y: actionData.pos.Y+actionData.elements[e].y,
                w: actionData.elements[e].w,
                h: actionData.elements[e].h
            };
            
            let playerRect = {
                x: game.players[p].pos.X,
                y: game.players[p].pos.Y,
                w: game.players[p].character.width,
                h: game.players[p].character.height
            };
            
            if (tiled.checkRectangularCollision(actionRect, playerRect)) 
                game.damagePlayer(p, this.calculateDamage(stats, action.scaling));
        }
}

exports.healPlayers = function(actionData, action)
{
    for (let e = 0; e < actionData.elements.length; e++)
        for (let p = 0; p < game.players.length; p++)
        {
            if (tiled.getMapIndex(game.players[p].map) != actionData.map)
                continue;
            
            let actionRect = {
                x: actionData.pos.X+actionData.elements[e].x,
                y: actionData.pos.Y+actionData.elements[e].y,
                w: actionData.elements[e].w,
                h: actionData.elements[e].h
            };
            
            let playerRect = {
                x: game.players[p].pos.X,
                y: game.players[p].pos.Y,
                w: game.players[p].character.width,
                h: game.players[p].character.height
            };
            
            if (tiled.checkRectangularCollision(actionRect, playerRect)) 
            {
                game.players[p].health.cur += action.heal;
                
                if (game.players[p].health.cur >= game.players[p].health.max)
                    game.players[p].health.cur = game.players[p].health.max;
                
                server.syncPlayerPartially(p, 'health');
            }
        }
};

exports.calculateDamage = function(stats, scaling)
{
    let total = 0;
    
    total += 10*stats.power*scaling.power;
    total += 10*stats.agility*scaling.agility;
    total += 10*stats.wisdom*scaling.wisdom;
    total += 10*stats.intelligence*scaling.intelligence;
    total += 10*stats.toughness*scaling.toughness;
    total += 10*stats.vitality*scaling.vitality;
    
    return -Math.round(Math.random()*total);
    
};