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
    
    this.damageNPCs(game.players[id].stats.attributes, actionData, this.collection[a_id]);
    
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

exports.damageNPCs = function(stats, actionData, action)
{
    for (let e = 0; e < actionData.elements.length; e++)
        for (let n = 0; n < npcs.onMap[actionData.map].length; n++)
        {
            if (npcs.onMap[actionData.map][n].data.type !== 'hostile')
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
                npcs.damageNPC(actionData.map, n, this.calculateDamage(stats, action.scaling));
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
    
    return -total;
    
};