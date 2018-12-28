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

exports.addPlayer = function(socket)
{
    //Check if socket is valid
    
    if (socket.name == undefined)
        return;
    
    //Grab player stats
    
    let player = databases.stats(socket.name).object();
    player.name = socket.name;
    player.character = this.characters[player.char_name];
    
    //Add player

    let id = this.players.length;
    this.players[id] = player;
    
    //Load current world
    
    this.loadMap(socket, player.map); 
    
    //Sync across server
    
    server.syncPlayer(id, socket, true);
    
    //Sync to player
    
    server.syncPlayer(id, socket, false);
};

exports.removePlayer = function(socket)
{
    //Check if socket is valid
    
    if (socket === undefined || socket.name === undefined)
        return;
    
    //Cycle through all players
    
    for (let i = 0; i < this.players.length; i++)
        if (this.players[i].name == socket.name) {
            server.removePlayer(i, socket);
            
            this.players.splice(i, 1);
            
            break;
        }
};

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