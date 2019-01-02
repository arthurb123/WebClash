//Game module for WebClash

const fs = require('fs');

exports.players = [];
exports.characters = [];

exports.startLoop = function() {
    setInterval(function() {
        
        //Update NPCs
        
        npcs.updateMaps();
        
    }, 1000/60);
};

exports.savePermissions = function () {
    fs.writeFile('permissions.json', JSON.stringify(permissions, null, 1), 'utf8');
};

exports.addPlayer = function(socket)
{
    //Check if socket is valid
    
    if (socket.name === undefined)
        return;
    
    //Grab player stats and continue
    
    fs.readFile('data/stats/' + socket.name + '.json', 'utf-8', function(err, player) {
        if (err) {
            output.give('Could not load player stats: ' + err);
            
            return;
        }
        
        player = JSON.parse(player);
        player.name = socket.name;
        player.character = game.characters[player.char_name];

        //Add player

        let id = game.players.length;
        game.players[id] = player;

        //Load current world

        game.loadMap(socket, player.map); 

        //Sync across server

        server.syncPlayer(id, socket, true);

        //Sync to player

        server.syncPlayer(id, socket, false);
        server.syncPlayerPartially(id, 'stats', socket, false);
        server.syncPlayerPartially(id, 'health', socket, false); 
    });
};

exports.removePlayer = function(socket)
{
    //Check if socket is valid
    
    if (socket === undefined || socket.name === undefined)
        return;
    
    //Cycle through all players
    
    for (let i = 0; i < this.players.length; i++)
        if (this.players[i].name == socket.name) {
            //Remove from clients
            
            server.removePlayer(i, socket);
            
            //Save player
            
            this.savePlayer(socket.name, this.players[i]);
            
            //Remove player entry
            
            this.players.splice(i, 1);
            
            break;
        }
};

exports.savePlayer = function(name, data, cb)
{
    let player = data;
    
    if (player === undefined)
        player = {
            char_name: 'player',
            map: tiled.maps[0].name,
            pos: { X: 0, Y: 0 },
            moving: false,
            direction: 0,
            health: { cur: 100, max: 100 },
            level: 1,
            stats: {
                exp: 0,
                attributes: {
                    power: 1,
                    toughness: 1,
                    vitality: 1,
                    agility: 1,
                    intelligence: 1,
                    wisdom: 1
                }
            }
        };
    
    let temp = databases.stats(name).object();
    
    temp.map = player.map;
    temp.char_name = player.char_name;
    temp.pos = player.pos;
    temp.moving = player.moving;
    temp.direction = player.direction;
    temp.health = player.health;
    temp.level = player.level;
    temp.stats = player.stats;
    
    if (cb !== undefined)
        databases.stats.save(cb);
    else
        databases.stats.save();
}

exports.getPlayerIndex = function(name)
{
    for (let i = 0; i < this.players.length; i++)
        if (this.players[i].name == name)
            return i;
    
    return -1;
};

exports.sendPlayers = function(socket)
{
    //Check if valid
    
    if (socket === undefined || socket.name === undefined)
        return;
    
    //Get player id
    
    let id = this.getPlayerIndex(socket.name);
    
    //Check if valid player
    
    if (id == -1)
        return;
    
    //Send all players in the same map
    
    for (let i = 0; i < this.players.length; i++)
            if (i != id && this.players[id].map == this.players[i].map) 
                server.syncPlayer(i, socket, false);
}

exports.loadMap = function(socket, map)
{
    //Check if valid
    
    if (socket.name === undefined)
        return;
    
    //Get map ID
    
    let map_id = tiled.getMapIndex(map);
    
    //Check if valid
    
    if (map_id == -1 || tiled.maps[map_id] === undefined) {
        output.give('Map with name \'' + map + '\' does not exist.');
        
        return;
    }
    
    //Get player ID
    
    let id = this.getPlayerIndex(socket.name);
    if (id == -1)
        return;
    
    //Remove player from others on the
    //same map
    
    server.removePlayer(id, socket);
    
    //Leave old room, if it is available
    
    socket.leave(tiled.getMapIndex(game.players[id].map));
    
    //Set new map
    
    this.players[id].map = map;
    
    //Join map specific room
    
    socket.join(map_id);
    
    //Send the corresponding map
    
    socket.emit('GAME_MAP_UPDATE', tiled.maps[map_id]);
    
    //Send player to all players in the same map
    
    server.syncPlayer(id, socket, true);
    
    //Send all players in the same map
    
    this.sendPlayers(socket);
    
    //Send all NPCs in the same map
    
    npcs.sendMap(map_id, socket);
};

exports.loadAllCharacters = function(cb)
{
    let location = 'characters';
    
    fs.readdir(location, (err, files) => {
        let count = 0;
        
        files.forEach(file => {
            game.characters[file.substr(0, file.lastIndexOf('.'))] = game.loadCharacter(location + '/' + file);
            
            count++;
        });
        
        output.give('Loaded ' + count + ' character(s).');
        
        if (cb !== undefined)
            cb();
    });
};

exports.loadCharacter = function(location)
{
    try {
        return JSON.parse(fs.readFileSync(location, 'utf-8'));
    }
    catch (err)
    {
        output.give(err);
    }
};

exports.calculateFace = function(pos, width, height, direction)
{
    let point = {
        X: pos.X,
        Y: pos.Y
    };
    
    //Get supposed pos based on direction
    
    switch (direction)
    {
        case 0:
            point.Y += height;
            break;
        case 1:
            point.X -= width;
            break;
        case 2:
            point.X += width;
            break;
        case 3:
            point.Y -= height;
            break;
    };
    
    return point;
};