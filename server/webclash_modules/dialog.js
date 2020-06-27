exports.createUnique = function(id, dialogData) {
    try {
        let start = -1;

        for (let i = 0; i < dialogData.length; i++) {
            if (dialogData[i] == undefined)
                continue;
                
            if (dialogData[i].entry) {
                start = i;

                break;
            }
        }

        if (start === -1) {
            output.give("Could not create unique dialog, dialog has no entry.");

            return [];
        }

        let result = deepcopy(dialogData);

        this.inspectItem(id, start, result);

        return result;
    }
    catch (err) {
        output.giveError("Could not create unique dialog: ", err);

        return [];
    }
};

exports.inspectItem = function(id, itemId, dialogData) {
    if (dialogData[itemId].inspected)
        return;

    dialogData[itemId].inspected = true;
    let current = dialogData[itemId];

    if (current == undefined)
        return;

    if (current.getVariableEvent != undefined) {
        dialogData[itemId] = undefined;

        let next = -1;

        if (game.getPlayerGlobalVariable(id, current.getVariableEvent.name))
            next = current.options[0].next;
        else
            next = current.options[1].next;

        if (next !== -1) {
            dialogData[next].entry = current.entry;

            dialog.inspectItem(id, next, dialogData);
        }

        return;
    }

    current.options.forEach(function(option) {
        if (option.next === -1)
            return;

        let next = dialogData[option.next];

        if (next.getVariableEvent != undefined) {
            dialogData[option.next] = undefined;

            if (game.getPlayerGlobalVariable(id, next.getVariableEvent.name))
                option.next = next.options[0].next;
            else
                option.next = next.options[1].next;
            
            dialogData[option.next].entry = next.entry;
        }

        dialog.inspectItem(id, option.next, dialogData);
    });
};

exports.handleEvents = function(id, channel, dialogEvent, clientData) {
    let quest,
        map = game.players[id].map_id;

    //Handle events

    //Load map event

    if (dialogEvent.eventType === 'LoadMap') {
        //Get map index

        let new_map = tiled.getMapIndex(dialogEvent.loadMapEvent.map);

        //Check if map is valid

        if (new_map === -1)
            return;

        //Load map

        game.loadMap(channel, dialogEvent.loadMapEvent.map);

        //Set position

        game.setPlayerTilePosition(
            id,
            new_map,
            dialogEvent.loadMapEvent.positionX,
            dialogEvent.loadMapEvent.positionY
        );
    }

    //Give item event

    else if (dialogEvent.eventType === 'GiveItem') {
        //Add item(s)

        let done = false;

        for (let a = 0; a < dialogEvent.giveItemEvent.amount; a++) {
            if (items.addPlayerItem(id, dialogEvent.giveItemEvent.item))
                done = true;
        }

        if (!done)
            return;
    }

    //Affect player event

    else if (dialogEvent.eventType === 'AffectPlayer') {
        //Add differences

        //Health

        if (dialogEvent.affectPlayerEvent.healthDifference > 0)
            game.healPlayer(id, dialogEvent.affectPlayerEvent.healthDifference);
        else if (dialogEvent.affectPlayerEvent.healthDifference < 0)
            game.damagePlayer(id, dialogEvent.affectPlayerEvent.healthDifference);

        //Mana

        game.deltaManaPlayer(id, dialogEvent.affectPlayerEvent.manaDifference);

        //Currency

        if (!game.deltaCurrencyPlayer(id, dialogEvent.affectPlayerEvent.currencyDifference)) {
            channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: false, id: clientData.id });
            return;
        }
    }

    //Spawn NPC event

    else if (dialogEvent.eventType === 'SpawnNPC') {
        //Check if the player already owns event NPC(s)
        //with the same name as the NPC to be spawned

        if (npcs.ownsEventNPC(map, dialogEvent.spawnNPCEvent.name, id))
            return;

        //(Otherwise) Spawn event NPCs for the specified amount

        let pos = {
            x: game.players[id].pos.X+game.players[id].character.width/2,
            y: game.players[id].pos.Y+game.players[id].character.height,
        };

        for (let i = 0; i < dialogEvent.spawnNPCEvent.amount; i++)
            npcs.createEventNPC(
                map,
                dialogEvent.spawnNPCEvent.name,
                dialogEvent.spawnNPCEvent.profile,
                pos.x,
                pos.y,
                id,
                dialogEvent.spawnNPCEvent.hostile
            );
    }

    //Turn hostile event

    else if (dialogEvent.eventType === 'TurnHostile') {
        //Grab target NPC

        let npc = npcs.onMap[map][clientData.owner];

        //Kill original NPC

        npcs.killNPC(map, clientData.owner);

        //Create event NPC

        npcs.createEventNPC(
            map,
            npc.name,
            npc.profile,
            npc.pos.X+npc.data.character.width/2,
            npc.pos.Y+npc.data.character.height,
            id,
            true,
            function() {
                //On reset, respawn original npc

                npcs.respawnNPC(map, clientData.owner);
            }
        );

        //Respond and return

        channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: true, id: clientData.id });
        
        return;
    }

    //Show quest event

    else if (dialogEvent.eventType === 'ShowQuest') {
        //Send quest information to player,
        //if the quest has not been completed yet
        //or the quest can be repeated

        if (!quests.hasCompleted(id, dialogEvent.showQuestEvent.name) || dialogEvent.repeatable)
            quest = quests.getQuestDialog(dialogEvent.showQuestEvent.name);
        else {
            channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: false, id: clientData.id });

            return;
        }
    }

    //Show shop event

    else if (dialogEvent.eventType === 'ShowShop') {
        //Respond to make sure the dialog closes

        channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: true, id: clientData.id });

        //Open shop for the player

        shop.openShop(id, clientData.owner, clientData.id, dialogEvent.showShopEvent);
    }
    
    //Show bank event

    else if (dialogEvent.eventType === 'ShowBank') {
        //Respond to make sure the dialog closes

        channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: true, id: clientData.id });

        //Open bank for the player

        banks.openBank(id, dialogEvent.showBankEvent.name);
    }

    //Advance quest event

    else if (dialogEvent.eventType === 'AdvanceQuest') {
        //Advance quest objective (provide quest as questOverride,
        //because it is a talk objective)

        let npcName = npcs.onMap[map][clientData.owner].name;
        quests.evaluateQuestObjective(id, 'talk', npcName, clientData.quest);

        //Respond to continue dialog

        channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: false, id: clientData.id });
    }

    //Set player variable event

    else if (dialogEvent.eventType === 'SetVariable') {
        //Set player variable

        game.setPlayerGlobalVariable(
            id,
            dialogEvent.setVariableEvent.name,
            dialogEvent.setVariableEvent.value
        );
    }

    //Check if event is repeatable,
    //if not set a player global variable

    if (!dialogEvent.repeatable && dialogEvent.eventType !== 'ShowQuest') {
        game.setPlayerGlobalVariable(
            id,
            eventName,
            true
        );
    }

    //Respond true (success)

    channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: true, quest: quest, id: clientData.id });
};