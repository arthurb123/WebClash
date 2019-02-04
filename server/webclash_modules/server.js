exports.handleSocket = function(socket)
{
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
        
        //Grab entry with username
        
        storage.load('accounts', data.name, function(player) {
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

            if (permissions.banned.indexOf(data.name) != -1)
            {
                callback('banned');
                return;
            }

            //Check if already logged in

            if (game.getPlayerIndex(data.name) != -1)
            {
                callback('loggedin');
                return;
            }

            //Output

            output.give('User \'' + data.name + '\' has logged in.');

            //Set variables

            socket.name = data.name;

            //Request game page

            socket.emit('REQUEST_GAME');
        });
    }); 
    socket.on('CLIENT_REGISTER', function(data, callback) {
        //Check if valid package
        
        if (data === undefined || data.name === undefined)
            return;
        
        //Check profanity
        
        if (input.filterText(data.name).indexOf('*') != -1)
        {
            callback('invalid');
            return;
        }
        
        //Check if account already exists
        
        storage.exists('accounts', data.name, function(is) {
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

            storage.save('accounts', data.name, {
                pass: data.pass
            });

            //Insert and save default stats

            game.savePlayer(data.name);

            //Give output

            output.give('New user \'' + data.name + '\' created.');

            //Set variables

            socket.name = data.name;

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
            output.give('Error while handling player data: ' + err);
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
             
             //Try to create action
             
             let result = actions.createPlayerAction(data, id);
             
             //Callback result
             
             callback(result);
         } 
         catch (err)
         {
             output.give('Could not add player action: ' + err);
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
            x: game.players[id].pos.X-game.players[id].character.width/2,
            y: game.players[id].pos.Y-game.players[id].character.height/2,
            w: game.players[id].character.width*2,
            h: game.players[id].character.height*2
        });
        
        if (!result.near)
            return;
        
        //Check if positioning properties exist
        
        let properties = tiled.getPropertiesFromTile(result.map, result.tile),
            done = false;
        
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
        
        //Send map to player
        
        game.loadMap(socket, data);
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
            
            let output = input.handleCommand(socket, data);
            
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
        
        io.to(tiled.getMapIndex(game.players[id].map)).emit('GAME_CHAT_UPDATE', msg);
    });
    
    socket.on('CLIENT_USE_ITEM', function(data) {
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
        
        items.usePlayerItem(socket, id, data)
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
        
        //Get map index
        
        let map = tiled.getMapIndex(game.players[id].map);
        
        //Create world item
        
        items.createWorldItem(
            -1, 
            map, 
            game.players[id].pos.X+game.players[id].character.width/2, 
            game.players[id].pos.Y+game.players[id].character.height, 
            game.players[id].inventory[data]
        );
        
        //Remove item from player inventory
        //at specific slot
        
        game.players[id].inventory[data] = undefined;
        
        //Sync inventory item
        
        server.syncInventoryItem(data, id, socket, false);
    });
    
    socket.on('CLIENT_UNEQUIP_ITEM', function(data) {
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
        
        //Sync to others
    
        server.syncPlayerPartially(id, 'equipment', socket, true);

        //Sync to player

        server.syncEquipmentItem(data, id, socket, false);
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
        
        if (!items.pickupWorldItem(tiled.getMapIndex(game.players[id].map), id, data))
        {
            //Failure, notify user
        }
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
        
        callback(exptable[game.players[id].level-1]);
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
        case 'stats':
            data.stats = game.players[id].stats;
            break;
        case 'health':
            data.health = game.players[id].health;
            break;
        case 'actions':
            data.actions = game.players[id].actions;
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
    
    let map_id = tiled.getMapIndex(game.players[id].map);
    
    if (socket === undefined) 
        io.to(map_id).emit('GAME_PLAYER_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast) {
            if (socket.name == data.name)
                data.isPlayer = true;
            
            socket.emit('GAME_PLAYER_UPDATE', data);
        }
        else
            socket.broadcast.to(map_id).emit('GAME_PLAYER_UPDATE', data);
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
    
    //Grab map ID
    
    let map_id = tiled.getMapIndex(game.players[id].map);
    
    //Broadcast player removal
    
    socket.broadcast.to(map_id).emit('GAME_PLAYER_UPDATE', { name: socket.name, remove: true });
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
}

//Sync single inventory item function, if socket is undefined it will be globally emitted

exports.syncInventoryItem = function(slot, id, socket, broadcast)
{
    let data = {
        slot: slot
    };
    
    if (game.players[id].inventory[slot] !== undefined)
    {
        data.item = items.getItem(game.players[id].inventory[slot]);

        if (data.item === undefined)
            return;
    }
    else
        data.remove = true;
    
    if (socket === undefined) 
        io.to(data.map).emit('GAME_INVENTORY_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast)
            socket.emit('GAME_INVENTORY_UPDATE', data);
        else
            socket.broadcast.to(data.map).emit('GAME_INVENTORY_UPDATE', data);
    }
}

//Sync single equipment item function, if socket is undefined it will be globally emitted

exports.syncEquipmentItem = function(equippable, id, socket, broadcast)
{
    let data;
    
    if (game.players[id].equipment[equippable] !== undefined) {
        data = items.getItem(game.players[id].equipment[equippable]);

        if (broadcast && data.equippableSource !== '') 
            data = data.equippableSource;

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
