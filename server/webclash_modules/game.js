//Game module for WebClash

const fs = require('fs');

exports.players = [];
exports.characters = [];

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
    
    this.players.push(player);
    
    //Sync across server
    
    server.syncPlayer(this.players.length-1, socket, true);
    
    //Sync to player
    
    server.syncPlayer(this.players.length-1, socket, false);
    
    //Load current world
    
    this.loadMap(socket, player.map); 
};

exports.removePlayer = function(socket)
{
    //Check if socket is valid
    
    if (socket === undefined || socket.name === undefined)
        return;
    
    //Cycle through all players
    
    for (let i = 0; i < this.players.length; i++)
        if (this.players[i].name == socket.name) {
            this.players.splice(i, 1);
            
            break;
        }
    
    //Notify others
    
    server.removePlayer(this.players.length-1, socket);
};

exports.getPlayerIndex = function(name)
{
    for (let i = 0; i < this.players.length; i++)
        if (this.players[i].name == name)
            return i;
    
    return -1;
};

exports.loadMap = function(socket, id)
{
    //Check if valid
    
    if (tiled.maps[id] === undefined)
        return;
    
    //Send the corresponding map
    
    socket.emit('GAME_MAP_UPDATE', tiled.maps[id]);
};

exports.loadAllCharacters = function()
{
    let location = 'characters';
    
    fs.readdir(location, (err, files) => {
      files.forEach(file => {
          game.characters[file.substr(0, file.lastIndexOf('.'))] = game.loadCharacter(location + '/' + file);
      });
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