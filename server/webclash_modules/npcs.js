//NPCs module for WebClash Server

const fs = require('fs');

exports.onMap = [];

exports.cache = [];

exports.loadMap = function(id)
{
    //Check if map has (NPC) properties
    
    if (tiled.maps_properties[id] === undefined)
        return;
    
    //Cycle through all properties, and search
    //for the "NPC" value
    
    for (let i = 0; i < tiled.maps_properties[id].length; i++)
        if (tiled.maps_properties[id][i].name == 'NPC')
            this.createNPC(tiled.maps_properties[id][i], id)
};

exports.createNPC = function(npc_property, map_id)
{
    //Create array
    
    this.onMap[map_id] = [];
    
    //Cycle through all dimensions
    
    for (let i = 0; i < npc_property.dimensions.length; i++)
    {
        //Get specified NPC
    
        let npc = this.loadNPC(npc_property.value);
        
        if (npc === undefined)
            continue;
        
        npc.pos = {
            X: npc_property.dimensions[i].x,
            Y: npc_property.dimensions[i].y
        };
        
        this.onMap[map_id].push(npc);
    }
};

exports.loadNPC = function(name)
{
    try 
    {
        if (this.cache[name] !== undefined)
            return this.cache[name];
        
        let location = 'npcs/' + name + '.json';
        
        this.cache[name] = JSON.parse(fs.readFileSync(location, 'utf-8'));
    }
    catch(err)
    {
        output.give(err);
    }
    
    return this.cache[name];
}

