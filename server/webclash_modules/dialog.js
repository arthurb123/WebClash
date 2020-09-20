//Dialog module for WebClash Server

exports.createUnique = function(id, dialogData) {
    try {
        let start = -1;

        //Find the entry dialog element

        for (let i = 0; i < dialogData.length; i++) {
            if (dialogData[i] == undefined)
                continue;
                
            if (dialogData[i].entry) {
                start = i;

                break;
            }
        }

        //If no entry was found, abort

        if (start === -1) {
            output.give("Could not create unique dialog, dialog has no entry.");

            return [];
        }

        //Deepcopy the dialog elements,
        //and start scanning for valid
        //dialog options from the entry

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
    //Recursive method that checks if certain dialog
    //elements are available for the player (id)

    //Check if already inspected

    if (dialogData[itemId].inspected)
        return;

    //Set inspected and grab the dialog data

    dialogData[itemId].inspected = true;
    let current = dialogData[itemId];

    if (current == undefined)
        return;

    //Check if the dialog data is a get
    //variable event, this can be used
    //for variable matching

    if (current.getVariableEvent != undefined) {
        dialogData[itemId] = undefined;

        let next = -1;

        //Match against player variable,
        //based on the result grab the succes
        //or occured option. Success indicating
        //that the player has access, occurred indicating
        //that the player has no access.

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

    //For all options, inspect recursively

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

    switch(dialogEvent.eventType) {
        //Load map event

        case 'LoadMap':
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

            break;
    
        //Give item event

        case 'GiveItem':
            //Check if enough inventory slots are available

            let freeSlots = items.getPlayerFreeSlots(id);
            if (dialogEvent.giveItemEvent.amount > freeSlots) {
                server.syncChatMessage(
                    "You need " + (dialogEvent.giveItemEvent.amount - freeSlots) + " more free inventory slot(s).",
                    channel
                );
                return;
            }

            //Add item(s)

            let done = false;
            for (let a = 0; a < dialogEvent.giveItemEvent.amount; a++) {
                if (items.addPlayerItem(id, dialogEvent.giveItemEvent.item))
                    done = true;
            }

            if (!done)
                return;

            break;

        //Give status effect event

        case 'GiveStatusEffect':
            status.givePlayerStatusEffect(
                id, 
                dialogEvent.giveStatusEffectEvent.caster,
                dialogEvent.giveStatusEffectEvent.hostile,
                dialogEvent.giveStatusEffectEvent.statusEffect
            );

            break;

        //Affect player event

        case 'AffectPlayer':
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

            break;

        //Spawn NPC event

        case 'SpawnNPC':
            //Check if the player already owns event NPC(s)
            //with the same name as the NPC to be spawned

            if (npcs.ownsEventNPC(map, dialogEvent.spawnNpcEvent.name, id))
                return;

            //(Otherwise) Spawn event NPCs for the specified amount

            let pos = {
                x: game.players[id].pos.X+game.players[id].character.width/2,
                y: game.players[id].pos.Y+game.players[id].character.height,
            };

            for (let i = 0; i < dialogEvent.spawnNpcEvent.amount; i++)
                npcs.createEventNPC(
                    map,
                    dialogEvent.spawnNpcEvent.name,
                    dialogEvent.spawnNpcEvent.profile,
                    pos.x,
                    pos.y,
                    id,
                    dialogEvent.spawnNpcEvent.hostile
                );

            break;

        //Turn hostile event

        case 'TurnHostile':
            //Grab target NPC

            let npc = npcs.onMap[map][clientData.owner];

            //Kill original NPC

            npcs.killNPC(map, clientData.owner);

            //Create event NPC

            npcs.createEventNPC(
                map,
                npc.name,
                npc.data.profile,
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

        //Show quest event

        case 'ShowQuest':
            //Send quest information to player,
            //if the quest has not been completed yet
            //or the quest can be repeated

            if (!quests.hasCompleted(id, dialogEvent.showQuestEvent.name) || dialogEvent.repeatable)
                quest = quests.getQuestDialog(dialogEvent.showQuestEvent.name);
            else {
                channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: false, id: clientData.id });

                return;
            }

            break;

        //Show shop event

        case 'ShowShop':
            //Respond to make sure the dialog closes

            channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: true, id: clientData.id });

            //Open shop for the player

            shop.openShop(id, clientData.owner, clientData.id, dialogEvent.showShopEvent);

            break;
    
        //Show bank event

        case 'ShowBank':
            //Respond to make sure the dialog closes

            channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: true, id: clientData.id });

            //Open bank for the player

            banks.openBank(id, dialogEvent.showBankEvent.name);

            break;

        //Advance quest event

        case 'AdvanceQuest':
            //Advance quest objective (provide quest as questOverride,
            //because it is a talk objective)

            let npcName = npcs.onMap[map][clientData.owner].name;
            quests.evaluateQuestObjective(id, 'talk', npcName, clientData.quest);

            //Respond to continue dialog

            channel.emit('CLIENT_DIALOG_EVENT_RESPONSE', { result: false, id: clientData.id });

            break;

        //Set player variable event

        case 'SetVariable':
            //Set player variable

            game.setPlayerGlobalVariable(
                id,
                dialogEvent.setVariableEvent.name,
                dialogEvent.setVariableEvent.value
            );

            break;
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