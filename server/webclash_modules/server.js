exports.handleSocket = function(socket)
{
    //Check if direct or external connection

    if (socket.handshake.xdomain) {

        //Check if external connections/clients are allowed

        if (!properties.allowExternalClients) {
            //If not allowed, disconnect socket

            socket.disconnect();

            return;
        }
    }

    //If the connected socket is not playing,
    //send to the landing page (login)

    if (socket.playing == undefined || !socket.playing)
        socket.emit('REQUEST_LANDING');

    //Send client and server name

    socket.emit('UPDATE_CLIENT_NAME', properties.clientName);
    socket.emit('UPDATE_SERVER_NAME', properties.serverName);

    //Disconnect event listener

    socket.on('disconnect', function() {
        if (socket.playing) {
            //Remove player

            game.removePlayer(socket);

            //Output

            output.give('User \'' + socket.name + '\' has logged out.');
        }
    });

    //Socket event listeners

    socket.on('CLIENT_LOGIN', function(data, callback) {
        //Check if valid package

        if (data === undefined || data.name === undefined)
            return;

        //Convert name to string

        let name = data.name.toString();

        //Check if callback is provided

        if (callback == undefined)
            return;

        //Grab entry with username

        storage.load('accounts', name, function(player) {
            if (player === undefined)
            {
                callback('none');
                return;
            }

            //Check if password matches

            if (player.pass != data.pass)
            {
                callback('wrong');
                return;
            }

            //Check if there is place available

            if (properties.maxPlayers != 0 &&
                game.players.length >= properties.maxPlayers)
            {
                callback('full');
                return;
            }

            //Check if banned

            if (permissions.banned.indexOf(name) != -1)
            {
                callback('banned');
                return;
            }

            //Check if already logged in

            if (game.getPlayerIndex(name) != -1)
            {
                callback('loggedin');
                return;
            }

            //Output

            output.give('User \'' + name + '\' has logged in.');

            //Set variables

            socket.name = name;

            //Request game page

            socket.emit('REQUEST_GAME');
        });
    });
    socket.on('CLIENT_REGISTER', function(data, callback) {
        //Check if valid package

        if (data === undefined || data.name === undefined)
            return;

        //Convert name to string

        let name = data.name.toString();

        //Check if callback is provided

        if (callback == undefined)
            return;

        //Check profanity

        if (input.filterText(name).indexOf('*') != -1)
        {
            callback('invalid');
            return;
        }

        //Check if account already exists

        storage.exists('accounts', name, function(is) {
            if (is)
            {
                callback('taken');
                return;
            }

            //Check if there is place available

            if (properties.maxPlayers != 0 &&
                game.players.length >= properties.maxPlayers)
            {
                callback('full');
                return;
            }

            //Insert account

            storage.save('accounts', name, {
                pass: data.pass,
                settings: {
                    audio: {
                      main: 100,
                      music: 75,
                      sound: 50
                    }
                }
            });

            //Insert and save default stats

            game.savePlayer(name);

            //Give output

            output.give('New user \'' + name + '\' created.');

            //Set variables

            socket.name = name;

            //Request game page

            socket.emit('REQUEST_GAME');
        });
    });

    socket.on('CLIENT_JOIN_GAME', function() {
        //Check if client is already playing

        if (socket.playing != undefined && socket.playing)
            return;

        //Add client as player

        game.addPlayer(socket);

        //Send MOTD message

        socket.emit('GAME_CHAT_UPDATE', properties.welcomeMessage);

        //Send game time

        server.syncGameTime(socket);

        //Set playing

        socket.playing = true;
    });

    socket.on('CLIENT_PLAYER_UPDATE', function(data) {
        try {
            //Check if valid player

            if (socket.playing === undefined || !socket.playing)
                return;

            //Get player id

            let id = game.getPlayerIndex(socket.name);

            //Check if valid player id

            if (id == -1)
                return;

            //Check data

            let type = '';

            if (data.moving !== undefined) {
                game.players[id].moving = data.moving;
                type = 'moving';
            }
            if (data.direction !== undefined) {
                game.players[id].direction = data.direction;
                type = 'direction';
            }
            if (data.pos !== undefined) {
                //Check if valid movement

                if (Math.abs(game.players[id].pos.X-data.pos.X) <= game.players[id].character.movement.max*2 &&
                    Math.abs(game.players[id].pos.Y-data.pos.Y) <= game.players[id].character.movement.max*2) {
                    game.players[id].pos.X = Math.round(data.pos.X);
                    game.players[id].pos.Y = Math.round(data.pos.Y);

                    type = 'position';
                } else
                    server.syncPlayerPartially(id, 'position', socket, false);
            }

            //Sync across all

            if (type.length > 0)
                server.syncPlayerPartially(id, type, socket, true);
        }
        catch (err)
        {
            output.giveError('Could not handle player data: ', err);
        }
    });

    socket.on('CLIENT_PLAYER_ACTION', function(data, callback) {
         try
         {
            //Check if valid

            if (socket.name === undefined)
                return;

            let id = game.getPlayerIndex(socket.name);

            if (id == -1)
                 return;

            //Try to create an action based
            //on the map conditions (PvP)

            let result;
            
            if (!tiled.maps[game.players[id].map_id].pvp)
                result = actions.createPlayerAction(data, id);
            else
                result = actions.createPvPAction(data, id);

            //Callback result

            if (callback != undefined)
                callback(result);
         }
         catch (err)
         {
            output.giveError('Could not add player action: ', err);
         }
    });

    socket.on('CLIENT_REQUEST_MAP', function(data) {
        //Check if valid

        if (socket.name === undefined || data === undefined)
            return;

        //Get player index

        let id = game.getPlayerIndex(socket.name),
            next_map = tiled.getMapIndex(data);

        //Check if valid player and if
        //the player is on a different map

        if (id == -1 || next_map == -1 || game.players[id].map == data)
            return;

        //Check if player is near to a loadMap property

        let result = tiled.checkPropertyWithRectangle(game.players[id].map, 'loadMap', {
            x: game.players[id].pos.X,
            y: game.players[id].pos.Y,
            w: game.players[id].character.width,
            h: game.players[id].character.height
        });

        if (!result.near)
            return;

        //Send map to player

        game.loadMap(socket, data);

        //Check if positioning properties exist

        let properties,
            done = false;

        if (result.tile != undefined)
            properties = tiled.getPropertiesFromTile(result.map, result.tile);
        else if (result.object != undefined)
            properties = tiled.getPropertiesFromObject(result.map, result.object);

        if (properties != undefined) {
            for (let p = 0; p < properties.length; p++)
            {
                if (properties[p].name === 'positionX') {
                    game.players[id].pos.X = (properties[p].value-tiled.maps[next_map].width/2+.5)*tiled.maps[next_map].tilewidth-game.players[id].character.width/2;

                    done = true;
                }
                if (properties[p].name === 'positionY') {
                    game.players[id].pos.Y = (properties[p].value-tiled.maps[next_map].height/2)*tiled.maps[next_map].tileheight-game.players[id].character.height/2;

                    done = true;
                }
            }

            if (done)
                server.syncPlayerPartially(id, 'position');
        }
    });

    socket.on('CLIENT_NEW_CHAT', function(data) {
        //Check if valid player

        if (socket.playing === undefined || !socket.playing)
            return;

        //Get player id

        let id = game.getPlayerIndex(socket.name);

        //Check if valid

        if (id == -1)
            return;

        let msg = '';

        //TODO:
        //Check correct length
        //Check if spamming

        //Check if command

        if (data[0] === '/')
        {
            //Check command and handle output

            let output = input.handleCommand(data, socket);

            if (output == 'invalid')
                msg = 'Invalid command.';
            else if (output == 'wrong')
                msg = 'Incorrect command syntax.';
            else
                return;

            socket.emit('GAME_CHAT_UPDATE', msg);

            return;
        }
        else
            msg = '<b>' + socket.name + '</b>: ' + input.filterText(data);

        //Send chat message to all other players

        io.to(game.players[id].map_id).emit('GAME_CHAT_UPDATE', msg);
    });

    socket.on('CLIENT_USE_ITEM', function(data, callback) {
        //Check if valid player

        if (socket.playing === undefined || !socket.playing)
            return;

        //Get player id

        let id = game.getPlayerIndex(socket.name);

        //Check if valid

        if (id == -1)
            return;

        //Check if player has item

        if (!items.hasPlayerItem(id, data))
            return;

        //Use item

        let result = items.usePlayerItem(socket, id, data);

        //Callback

        if (callback != undefined)
            callback(result);
    });

    socket.on('CLIENT_DROP_ITEM', function(data) {
        //Check if valid player

        if (socket.playing === undefined || !socket.playing)
            return;

        //Get player id

        let id = game.getPlayerIndex(socket.name);

        //Check if valid

        if (id == -1)
            return;

        //Check if player has item in slot

        if (game.players[id].inventory[data] == null)
            return;

        //Create world item

        let name = game.players[id].inventory[data];

        items.createWorldItem(
            -1,
            game.players[id].map_id,
            game.players[id].pos.X+game.players[id].character.width/2,
            game.players[id].pos.Y+game.players[id].character.height,
            name
        );

        //Remove item from player inventory
        //at specific slot

        game.players[id].inventory[data] = undefined;

        //Evaluate item for gather objectives

        quests.evaluateQuestObjective(id, 'gather', name);

        //Sync inventory item

        server.syncInventoryItem(data, id, socket);
    });

    socket.on('CLIENT_UNEQUIP_ITEM', function(data, callback) {
        //Check if valid player

        if (socket.playing === undefined || !socket.playing)
            return;

        //Get player id

        let id = game.getPlayerIndex(socket.name);

        //Check if valid

        if (id == -1)
            return;

        //Check if player has equipped item

        if (game.players[id].equipment[data] === undefined)
            return;

        //Get item

        let item = items.getItem(game.players[id].equipment[data]);

        //Check if valid

        if (item === undefined)
            return;

        //Add item

        if (!items.addPlayerItem(socket, id, game.players[id].equipment[data]))
            return;

        //Check if equipment has action

        if (item.equippableAction !== undefined)
            for (let a = 0; a < game.players[id].actions.length; a++)
                if (game.players[id].actions[a] != undefined &&
                    game.players[id].actions[a].name === item.equippableAction)
                    {
                        //Remove equipped action

                        game.players[id].actions[a] = undefined;

                        //Sync to player

                        server.syncPlayerPartially(id, 'actions', socket, false);

                        break;
                    }

        //Remove equipped item

        game.players[id].equipment[data] = undefined;

        //Calculate new stats

        game.calculatePlayerStats(id, true);

        //Sync to others

        server.syncPlayerPartially(id, 'equipment', socket, true);

        //Sync to player

        server.syncEquipmentItem(data, id, socket, false);

        //Callback if provided

        if (callback != undefined)
            callback();
    });

    socket.on('CLIENT_PICKUP_ITEM', function(data) {
        //Check if valid player

        if (socket.playing === undefined || !socket.playing)
            return;

        //Get player id

        let id = game.getPlayerIndex(socket.name);

        //Check if valid

        if (id == -1)
            return;

        //Pick up world item

        if (!items.pickupWorldItem(game.players[id].map_id, id, data))
        {
            //Failure, notify user
        }
    });

    socket.on('CLIENT_SELL_ITEM', function(data, callback) {
        try {
            //Check if valid player

            if (socket.playing === undefined || !socket.playing)
                return;

            //Get player id

            let id = game.getPlayerIndex(socket.name);

            //Check if valid

            if (id == -1)
                return;

            //Try to sell item

            let sold = shop.sellItem(id, data.item, data.npc);

            //Callback

            if (callback != undefined)
                callback(sold);
        }
        catch (err) {
            output.giveError('Could not sell item: ', err);
        }
    });

    socket.on('CLIENT_INTERACT_PROPERTIES', function() {
        //Check if valid player

        if (socket.playing === undefined || !socket.playing)
            return;

        //Get player id

        let id = game.getPlayerIndex(socket.name);

        //Check if valid

        if (id == -1)
            return;

        //Get all properties that the player collided with

        let properties = tiled.getPropertiesWithRectangle(game.players[id].map_id, {
            x: game.players[id].pos.X,
            y: game.players[id].pos.Y,
            w: game.players[id].character.width,
            h: game.players[id].character.height
        });

        //Handle unique properties

        if (properties != undefined) {
            for (let p = 0; p < properties.length; p++)
            {
                //Position X property

                if (properties[p].name === 'positionX')
                    game.setPlayerTilePosition(
                        id,
                        game.players[id].map_id,
                        properties[p].value
                    );

                //Position Y property

                else if (properties[p].name === 'positionY')
                    game.setPlayerTilePosition(
                        id,
                        game.players[id].map_id,
                        undefined,
                        properties[p].value
                    );
            }
        }

    });

    socket.on('CLIENT_DIALOG_EVENT', function(data, callback) {
        try {
            //Check if valid player

            if (socket.playing === undefined || !socket.playing)
                return;

            //Get player id

            let id = game.getPlayerIndex(socket.name);

            //Check if valid

            if (id == -1)
                return;

            //Get map index

            let map = game.players[id].map_id;

            //Setup variables

            let dialogEvent,
                quest;

            //Check if NPC or item dialog

            if (isNaN(data.npc))
            {
                //Item

                dialogEvent = items.getItem(data.npc).dialog[data.id];

                eventName =
                    data.npc.replace(' ', '') +         //Item name to make sure the event can occur
                                                        //with other items (it is called 'npc' but it is the item name)
                    dialogEvent.eventType +             //Event type for uniqueness
                    data.id;                            //Dialog ID for uniqueness
            }
            else
            {
                //NPC

                dialogEvent = npcs.onMap[map][data.npc].data.dialog[data.id];

                eventName =
                    map.toString() +                    //Map to make sure the event can occur on other maps
                    npcs.onMap[map][data.npc].name +    //NPC name for uniqueness
                    dialogEvent.eventType +             //Event type for uniqueness
                    data.id;                            //Dialog ID for uniqueness
            }

            //Check if valid

            if (dialogEvent == undefined ||
                !dialogEvent.isEvent)
                return;

            //Check if the event has already occured

            if (game.getPlayerGlobalVariable(id, eventName) &&
                !dialogEvent.repeatable) {
                //Callback false (occurred)

                if (callback != undefined)
                    callback({ result: false });

                return;
            }

            //Handle events

            //Load map event

            if (dialogEvent.eventType === 'LoadMap') {
                //Get map index

                let new_map = tiled.getMapIndex(dialogEvent.loadMapEvent.map);

                //Check if map is valid

                if (new_map === -1)
                    return;

                //Load map

                game.loadMap(socket, dialogEvent.loadMapEvent.map);

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
                    if (items.addPlayerItem(socket, id, dialogEvent.giveItemEvent.item))
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

                //Gold

                if (!game.deltaGoldPlayer(id, dialogEvent.affectPlayerEvent.goldDifference)) {
                    callback({ result: false });
                    return;
                }
            }

            //Spawn NPC event

            else if (dialogEvent.eventType === 'SpawnNPC') {
                //Spawn event NPCs for the specified amount

                let pos = {
                    x: game.players[id].pos.X+game.players[id].character.width/2,
                    y: game.players[id].pos.Y+game.players[id].character.height,
                };

                for (let i = 0; i < dialogEvent.spawnNPCEvent.amount; i++)
                    npcs.createEventNPC(
                        map,
                        dialogEvent.spawnNPCEvent.name,
                        pos.x,
                        pos.y,
                        id,
                        dialogEvent.spawnNPCEvent.hostile
                    );
            }

            //Turn hostile event

            else if (dialogEvent.eventType === 'TurnHostile') {
                //Grab target NPC

                let npc = npcs.onMap[map][data.npc];

                //Kill original NPC

                npcs.killNPC(map, data.npc);

                //Create event NPC

                npcs.createEventNPC(
                    map,
                    npc.name,
                    npc.pos.X+npc.data.character.width/2,
                    npc.pos.Y+npc.data.character.height,
                    id,
                    true,
                    function() {
                        //On reset, respawn original npc

                        npcs.respawnNPC(map, data.npc);
                    }
                );

                //Callback and return

                callback({ result: true });
                return;
            }

            //Show quest event

            else if (dialogEvent.eventType === 'ShowQuest') {
                //Send quest information to player,
                //if the quest has not been completed yet
                //or the quest can be repeated

                if (!quests.hasCompleted(id, dialogEvent.showQuestEvent.name) || dialogEvent.repeatable)
                    quest = quests.getQuestDialog(dialogEvent.showQuestEvent.name);
                else if (callback != undefined) {
                    callback({ result: false });

                    return;
                }
            }

            //Show shop event

            else if (dialogEvent.eventType === 'ShowShop') {
                //Callback to make sure the dialog closes

                callback({ result: true });

                //Open shop for the player

                shop.openShop(id, data.npc, data.id, dialogEvent.showShopEvent);
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

            //Callback true (success)

            if (callback != undefined)
                callback({ result: true, quest: quest });
        }
        catch (err) {
            output.giveError('Could not handle dialog event: ', err);
        }
    });

    socket.on('CLIENT_ACCEPT_QUEST', function(data, callback) {
        try {
            //Check if valid player

            if (socket.playing === undefined || !socket.playing)
               return;

            //Get player id

            let id = game.getPlayerIndex(socket.name);

            //Check if valid

            if (id == -1)
               return;

            let dialogEvent;

            //Check if NPC or item dialog

            if (isNaN(data.npc))
            {
               //Item

               dialogEvent = items.getItem(data.npc).dialog[data.id];
            }
            else
            {
               //NPC

               dialogEvent = npcs.onMap[game.players[id].map_id][data.npc].data.dialog[data.id];
            }

            //Check if valid

            if (dialogEvent == undefined)
                return;

            //Check if dialog is a quest event

            if (dialogEvent.isEvent && dialogEvent.eventType === 'ShowQuest') {
                //Accept quest with name

                if (!quests.acceptQuest(id, dialogEvent.showQuestEvent.name))
                    return;

                //Callback if possible

                if (callback != undefined)
                    callback(dialogEvent.showQuestEvent.name);
            }
        }
        catch (err) {
            output.giveError('Could not accept quest: ', err);
        }
    });

    socket.on('CLIENT_ABANDON_QUEST', function(data, callback) {
        try {
            //Check if valid player

            if (socket.playing === undefined || !socket.playing)
               return;

            //Get player id

            let id = game.getPlayerIndex(socket.name);

            //Check if valid

            if (id == -1)
               return;

            //Check if quest name/data is valid

            if (data == undefined || !isNaN(data))
                return;

            //Remove quest from player quests

            delete game.players[id].quests[data];

            //Callback if possible

            if (callback != undefined)
                callback();
        }
        catch (err) {
            output.giveError('Could not abandon quest: ', err);
        }
    });

    socket.on('CLIENT_BUY_ITEM', function(data, callback) {
        try {
            //Check if valid player

            if (socket.playing === undefined || !socket.playing)
                return;

            //Get player id

            let id = game.getPlayerIndex(socket.name);

            //Check if valid

            if (id == -1)
               return;

            //Get map index

            let map = game.players[id].map_id;

            //Try to buy item

            let bought = shop.buyItem(
                id,
                data.item,
                data.npc, 
                data.id
            );

            //Callback if bought

            if (callback != undefined)
                callback(bought);
        }
        catch (err) {
            output.giveError('Could not buy shop item: ', err);
        }
    });

    socket.on('CLIENT_REQUEST_DIALOG', function(data, callback) {
        //Check if valid player

        if (socket.playing === undefined || !socket.playing)
            return;

        //Get player id

        let id = game.getPlayerIndex(socket.name);

        //Check if valid

        if (id == -1)
            return;

        //Get map index

        let map = game.players[id].map_id;

        //If in dialog range callback the dialog

        if (npcs.inDialogRange(map, data, game.players[id].pos.X, game.players[id].pos.Y) &&
            callback != undefined)
            callback(npcs.onMap[map][data].data.dialog);
    });

    socket.on('CLIENT_INCREMENT_ATTRIBUTE', function(data) {
        //Check if valid player

        if (socket.playing === undefined || !socket.playing)
            return;

        //Get player id

        let id = game.getPlayerIndex(socket.name);

        //Check if valid

        if (id == -1)
            return;

        //Increment attribute

        game.incrementPlayerAttribute(id, data);
    });

    socket.on('CLIENT_REQUEST_EXP', function(callback) {
         //Check if valid player

        if (socket.playing === undefined || !socket.playing)
            return;

        //Get player id

        let id = game.getPlayerIndex(socket.name);

        //Check if valid

        if (id == -1)
            return;

        //Callback current target xp

        if (callback != undefined)
            callback(exptable[game.players[id].level-1]);
    });

    socket.on('CLIENT_USER_SETTINGS', function(settings) {
         //Check if valid player

         if (socket.playing === undefined || !socket.playing)
             return;

        //Check if valid data

        if (settings == undefined || settings.audio == undefined)
            return;

        //Check and/or format data to make sure
        //players can't save invalid data

        if (settings.audio.main == undefined || isNaN(settings.audio.main) || settings.audio.main < 0 || settings.audio.main > 100)
            settings.audio.main = 100;
        if (settings.audio.music == undefined || isNaN(settings.audio.music) || settings.audio.music < 0 || settings.audio.music > 100)
            settings.music = 100;
        if (settings.audio.sound == undefined || isNaN(settings.audio.sound) || settings.audio.sound < 0 || settings.audio.sound > 100)
            settings.audio.sound = 100;

        //Save user settings

        game.saveUserSettings(socket.name, {
            audio: {
                main: settings.audio.main,
                sound: settings.audio.sound,
                music: settings.audio.music
            }
        });
    });
};

//Sync player partially function, if socket is undefined it will be globally emitted

exports.syncPlayerPartially = function(id, type, socket, broadcast)
{
    let data = {
        name: game.players[id].name
    };

    switch (type)
    {
        case 'position':
            data.pos = game.players[id].pos;
            break;
        case 'moving':
            data.moving = game.players[id].moving;
            break;
        case 'direction':
            data.direction = game.players[id].direction;
            break;
        case 'character':
            data.character = game.players[id].character;
            break;
        case 'level':
            data.level = game.players[id].level;
            break;
        case 'exp':
            data.exp = game.players[id].stats.exp;
            break;
        case 'points':
            data.points = game.players[id].stats.points;
            break;
        case 'attributes':
            data.attributes = game.players[id].attributes;
            break;
        case 'gold':
            data.gold = game.players[id].gold;
            break;
        case 'health':
            data.health = game.players[id].health;
            break;
        case 'mana':
            data.mana = game.players[id].mana;
            break;
        case 'quests':
            data.quests = game.players[id].quests;
            break;
        case 'actions':
            data.actions = [];

            for (let a = 0; a < game.players[id].actions.length; a++) {
                if (game.players[id].actions[a] == undefined)
                    continue;

                data.actions[a] = actions.createPlayerSlotAction(game.players[id].actions[a]);
            }
            break;
        case 'equipment':
            data.equipment = {};

            for (let equipment in game.players[id].equipment) {
                let item = items.getItem(game.players[id].equipment[equipment]);

                if (item === undefined || item.equippableSource.length == 0)
                    continue;

                data.equipment[equipment] = item.equippableSource;
            }

            break;
    }

    if (socket === undefined)
        io.to(game.players[id].map_id).emit('GAME_PLAYER_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast) {
            if (socket.name == data.name)
                data.isPlayer = true;

            socket.emit('GAME_PLAYER_UPDATE', data);
        }
        else
            socket.broadcast.to(game.players[id].map_id).emit('GAME_PLAYER_UPDATE', data);
    }
};

//Sync whole player function, if socket is undefined it will be globally emitted

exports.syncPlayer = function(id, socket, broadcast)
{
    this.syncPlayerPartially(id, 'moving', socket, broadcast);
    this.syncPlayerPartially(id, 'position', socket, broadcast);
    this.syncPlayerPartially(id, 'direction', socket, broadcast);
    this.syncPlayerPartially(id, 'character', socket, broadcast);
    this.syncPlayerPartially(id, 'equipment', socket, broadcast);
    this.syncPlayerPartially(id, 'level', socket, broadcast);
};

//Sync player remove function, will be broadcast by default

exports.removePlayer = function(id, socket)
{
    //Check if valid

    if (socket === undefined || socket.name === undefined)
        return;

    //Broadcast player removal

    socket.broadcast.to(game.players[id].map_id).emit('GAME_PLAYER_UPDATE', { name: socket.name, remove: true });
}

//Sync NPC partially function, if socket is undefined it will be globally emitted

exports.syncNPCPartially = function(map, id, type, socket, broadcast)
{
    if (npcs.onMap[map] === undefined || npcs.onMap[map][id] === undefined)
        return;

    let data = {
        id: id,
        name: npcs.onMap[map][id].data.name
    };

    if (!npcs.onMap[map][id].data.showNameplate)
        data.name = '';

    switch (type)
    {
        case 'position':
            data.pos = {
                X: Math.round(npcs.onMap[map][id].pos.X),
                Y: Math.round(npcs.onMap[map][id].pos.Y)
            };
            break;
        case 'moving':
            data.moving = npcs.onMap[map][id].moving;
            break;
        case 'direction':
            data.direction = npcs.onMap[map][id].direction;
            break;
        case 'character':
            data.character = npcs.onMap[map][id].data.character;
            break;
        case 'type':
            data.type = npcs.onMap[map][id].data.type;
            data.hasDialog = !(npcs.onMap[map][id].data.dialog != undefined && npcs.onMap[map][id].data.dialog.length == 0);
            break;
        case 'stats':
            data.stats = npcs.onMap[map][id].data.stats;
            break;
        case 'health':
            data.health = npcs.onMap[map][id].data.health;
            break;
    }

    if (socket === undefined)
        io.to(map).emit('GAME_NPC_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast)
            socket.emit('GAME_NPC_UPDATE', data);
        else
            socket.broadcast.to(map).emit('GAME_NPC_UPDATE', data);
    }
}

//Sync whole NPC function, if socket is undefined it will be globally emitted

exports.syncNPC = function(map, id, socket, broadcast)
{
    this.syncNPCPartially(map, id, 'moving', socket, broadcast);
    this.syncNPCPartially(map, id, 'position', socket, broadcast);
    this.syncNPCPartially(map, id, 'direction', socket, broadcast);
    this.syncNPCPartially(map, id, 'character', socket, broadcast);
    this.syncNPCPartially(map, id, 'type', socket, broadcast);

    //Some NPCs don't have stats, so we dont send it if
    //it is empty

    if (npcs.onMap[map][id].data.stats !== undefined &&
        npcs.onMap[map][id].data.stats !== null) {
        this.syncNPCPartially(map, id, 'stats', socket, broadcast);

        this.syncNPCPartially(map, id, 'health', socket, broadcast);
    }
};

//Remove NPC function, if socket is undefined it will be globally emitted

exports.removeNPC = function(map, id, socket, broadcast)
{
    let data = {
        id: id,
        remove: true
    };

    if (socket === undefined)
        io.to(map).emit('GAME_NPC_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast)
            socket.emit('GAME_NPC_UPDATE', data);
        else
            socket.broadcast.to(map).emit('GAME_NPC_UPDATE', data);
    }
};

//Sync whole action function, if socket is undefined it will be globally emitted

exports.syncAction = function(data, socket, broadcast)
{
    if (socket === undefined)
        io.to(data.map).emit('GAME_ACTION_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast)
            socket.emit('GAME_ACTION_UPDATE', data);
        else
            socket.broadcast.to(data.map).emit('GAME_ACTION_UPDATE', data);
    }
};

//Remove Action function, if socket is undefined it will be globally emitted

exports.removeAction = function(id, map, socket, broadcast)
{
    let data = {
        remove: true,
        id: id
    };

    if (socket === undefined)
        io.to(map).emit('GAME_ACTION_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast)
            socket.emit('GAME_ACTION_UPDATE', data);
        else
            socket.broadcast.to(map).emit('GAME_ACTION_UPDATE', data);
    }
};

//Sync single action slot (for specific player) function

exports.syncActionSlot = function(slot, id, socket)
{
    let data = {
        slot: slot
    };

    if (game.players[id].actions[slot] != undefined)
    {
        data.action = actions.createPlayerSlotAction(game.players[id].actions[slot]);

        if (data.action === undefined)
            return;
    }
    else
        data.remove = true;

    socket.emit('GAME_ACTION_SLOT', data);
};

//Sync single inventory item (for specific player) function

exports.syncInventoryItem = function(slot, id, socket)
{
    let data = {
        slot: slot
    };

    if (game.players[id].inventory[slot] !== undefined)
    {
        data.item = items.getConvertedItem(game.players[id].inventory[slot]);

        if (data.item === undefined)
            return;
    }
    else
        data.remove = true;

    socket.emit('GAME_INVENTORY_UPDATE', data);
}

//Sync single equipment item function, if socket is undefined it will be globally emitted

exports.syncEquipmentItem = function(equippable, id, socket, broadcast)
{
    let data;

    if (game.players[id].equipment[equippable] !== undefined) {
        data = items.getConvertedItem(game.players[id].equipment[equippable]);

        if (data === undefined)
            return;
    } else
        data = {
            equippable: equippable,
            remove: true
        };

    if (socket === undefined)
        io.to(data.map).emit('GAME_EQUIPMENT_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast)
            socket.emit('GAME_EQUIPMENT_UPDATE', data);
        else
            socket.broadcast.to(data.map).emit('GAME_EQUIPMENT_UPDATE', data);
    }
}

//Sync single world item function, if socket is undefined it will be globally emitted

exports.syncWorldItem = function(map, data, socket, broadcast)
{
    if (socket === undefined)
        io.to(map).emit('GAME_WORLD_ITEM_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast)
            socket.emit('GAME_WORLD_ITEM_UPDATE', data);
        else
            socket.broadcast.to(map).emit('GAME_WORLD_ITEM_UPDATE', data);
    }
};

//Sync item dialog to client, which immediately opens up the dialog on the clientside

exports.syncItemDialog = function(id, itemName, dialog)
{
    let data = {
        dialog: dialog,
        name: itemName
    };

    game.players[id].socket.emit('GAME_START_ITEM_DIALOG', data);
};

//Sync game time function, if socket is undefined it will be globally emitted

exports.syncGameTime = function(socket)
{
    let time = gameTime;
    time.current = game.time.current;
    
    if (socket === undefined)
        io.emit('GAME_SERVER_TIME', time);
    else
        socket.emit('GAME_SERVER_TIME', time);
};

//Get socket with name function

exports.getSocketWithName = function(name)
{
    //Loop through all sockets until socket
    //with the same name is found

    for (let socketId in io.sockets.sockets) {
        if (io.sockets.sockets[socketId] !== undefined &&
            io.sockets.sockets[socketId].name == name)
            return io.sockets.sockets[socketId];
    }
};
