//Actions module for WebClash Server

const fs = require('fs');

exports.collection = [];

exports.getActionIndex = function(name)
{
    for (let i = 0; i < this.collection.length; i++)
        if (this.collection[i].name == name)
            return i;
    
    return -1;
};

exports.createPlayerAction = function(name, id)
{
    let a_id = this.getActionIndex(name);
    
    if (a_id == -1)
        return false;
    
    if (game.players[id] === undefined)
        return false;
    
    let actionData = {
        pos: game.calculateFace(
            game.players[id].pos, 
            game.players[id].character.width,
            game.players[id].character.height,
            game.players[id].direction
        ),
        map: tiled.getMapIndex(game.players[id].map),
        elements: this.collection[a_id].elements
    };
    
    actionData.pos.X+=game.players[id].character.width/2-this.collection[a_id].sw/2;
    actionData.pos.Y+=-this.collection[a_id].sh/2-game.players[id].character.height/2;
    
    server.syncAction(actionData);
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