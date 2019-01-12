const client = {
    inGame: false,
    serverName: '',
    connect: function(cb) {
        //Try to make a connection
        
        window['socket'] = io.connect(
            (properties.address.length > 0 ? (properties.address + ":" + properties.port) : undefined)
        );
        
        //Setup possible server requests
        
        this.setup();
        
        //Callback
        
        cb();
    },
    joinGame: function() {
        if (this.inGame)
        {
            //Clear any cached game elements
            
            game.players = [];
            game.player = -1;
            
            game.tilesets = [];
        }
 
        this.inGame = true;
        
        socket.emit('CLIENT_JOIN_GAME');
    },
    setup: function() {
        socket.on('UPDATE_CLIENT_NAME', function(t) { document.title = t; });
        socket.on('UPDATE_SERVER_NAME', function(t) { client.serverName = t; });
        
        socket.on('REQUEST_LANDING', view.loadLanding);
        socket.on('REQUEST_GAME', view.loadGame);
        
        socket.on('GAME_PLAYER_UPDATE', function (data) {
             //Check if the recieved data is valid
            
             if (data === undefined || data.name === undefined)
                 return;
            
             //Check if in-game
             if (!client.inGame)
                 return;
            
             //Get the id of the player's data
            
             let id;
            
             if (data.isPlayer) 
                 id = game.player;
             else 
                 id = game.getPlayerIndex(data.name);
            
             //If the player does not yet exist, create it
            
             if (id == -1 && data.isPlayer) {
                 game.instantiatePlayer(data.name);
                 
                 id = game.player;
             }
             else if (id == -1) {
                 game.instantiateOther(data.name);
                 
                 id = game.players.length-1;
             }
            
             //Check what data is present
            
             if (data.remove)
                 game.removePlayer(id);
             if (data.pos !== undefined) {
                 game.players[id].POS = data.pos;
                 
                 if (data.isPlayer)
                     game.players[id].Movement(0, 0);
             }
             if (data.moving !== undefined) 
                 game.players[id]._moving = data.moving;
             if (data.direction !== undefined) 
                 game.players[id]._direction = data.direction;
             if (data.level !== undefined)
                 game.players[id]._level = data.level;
             if (data.stats !== undefined)
                 game.players[id]._stats = data.stats;
             if (data.health !== undefined)
                 game.setPlayerHealth(id, data.health);
             if (data.equipment !== undefined)
                 game.setPlayerEquipment(id, data.equipment);
             if (data.actions !== undefined)
                 player.setActions(data.actions);
             if (data.character !== undefined) {
                 game.players[id].SPRITE = new lx.Sprite(data.character.src);
                 game.players[id].SPRITE.Clip(0, 0, data.character.width, data.character.height);
                 
                 game.players[id].SIZE = game.players[id].SPRITE.Size();
                 
                 if (data.isPlayer) 
                 {
                     player.setCollider(data.character.collider);
                     player.setMovement(data.character.movement);
                 }
                 
                 game.players[id]._animation = data.character.animation;
                 game.players[id]._animation.cur = 0;
             }
        });
        socket.on('GAME_MAP_UPDATE', function (data) {
             //Check if data is valid
            
             if (data === undefined)
                 return;
            
             //Check if in-game
            
             if (!client.inGame)
                 return;
            
            //Load map
            
            game.loadMap(data); 
        });
        socket.on('GAME_NPC_UPDATE', function (data) {
            //Check if the recieved data is valid
            
             if (data === undefined)
                 return;
            
             //Check if in-game
            
             if (!client.inGame)
                 return;
            
             //Check if NPC exists, if not instantiate
            
             if (game.npcs[data.id] === undefined && data.name !== undefined)
                 game.instantiateNPC(data.id, data.name);
            
             //Handle data
            
             if (data.remove !== undefined)
                 game.removeNPC(data.id);
             if (data.pos !== undefined)
                 game.npcs[data.id].POS = data.pos;
             if (data.type !== undefined)
                 game.npcs[data.id]._type = data.type;
             if (data.moving !== undefined) 
                 game.npcs[data.id]._moving = data.moving;
             if (data.direction !== undefined) 
                 game.npcs[data.id]._direction = data.direction;
             if (data.stats !== undefined)
                 game.npcs[data.id]._stats = data.stats;
             if (data.health !== undefined)
                 game.setNPCHealth(data.id, data.health);
             if (data.character !== undefined) {
                 game.npcs[data.id].SPRITE = new lx.Sprite(data.character.src);
                 game.npcs[data.id].SPRITE.Clip(0, 0, data.character.width, data.character.height);
                 
                 game.npcs[data.id].SIZE = game.npcs[data.id].SPRITE.Size();
                 
                 game.npcs[data.id]._animation = data.character.animation;
                 game.npcs[data.id]._animation.cur = 0;
             }
        });
        socket.on('GAME_ACTION_UPDATE', function (data) {
            //Check if the recieved data is valid
            
             if (data === undefined)
                 return;
            
             //Check if in-game
            
             if (!client.inGame)
                 return;
            
             //Handle data

             for (let i = 0; i < data.elements.length; i++)
             {
                 if (data.elements[i].src.length == 0)
                     continue;
                 
                 let sprite = new lx.Sprite(data.elements[i].src);
                 
                 let sprites = [];
                 
                 if (data.elements[i].direction === 'horizontal')
                     for (let x = 0; x < sprite.Size().W/data.elements[i].w; x++)
                         sprites.push(new lx.Sprite(data.elements[i].src,
                             x*data.elements[i].w, 
                             0, 
                             data.elements[i].w, 
                             data.elements[i].h
                         ));
                 if (data.elements[i].direction === 'vertical')
                     for (let y = 0; y < sprite.Size().H/data.elements[i].h; y++)
                         sprites.push(new lx.Sprite(data.elements[i].src,
                             0, 
                             y*data.elements[i].h, 
                             data.elements[i].w, 
                             data.elements[i].h
                         ));
                 
                 if (sprites.length == 0)
                     return;
                 
                 new lx.Animation(sprites, data.elements[i].speed).Show(
                     4, 
                     data.pos.X+data.elements[i].x,
                     data.pos.Y+data.elements[i].y,
                     data.elements[i].w,
                     data.elements[i].h,
                     0
                 );
             }
        });
        socket.on('GAME_INVENTORY_UPDATE', function(data) {
            //Check if the recieved data is valid
            
             if (data === undefined)
                 return;
            
             //Check if in-game
            
             if (!client.inGame)
                 return;
            
             //Handle data
            
             player.inventory[data.slot] = data.item;
            
             //Refresh UI (slot)
            
             ui.inventory.reloadItem(data.slot);
        });
        socket.on('GAME_EQUIPMENT_UPDATE', function(data) {
             //Check if the recieved data is valid
            
             if (data === undefined)
                 return;
            
             //Check if in-game
            
             if (!client.inGame)
                 return;

             //Handle data
            
             player.setEquipment(data);
            
             //Refresh UI (slot)
            
             ui.equipment.reloadEquipment(data.equippable);
        });
        socket.on('GAME_CHAT_UPDATE', function (data) {
            ui.chat.addMessage(data);
        })
    }
}