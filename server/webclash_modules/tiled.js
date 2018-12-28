//Tiled import module for WebClash

const fs = require('fs');

exports.maps = [];
exports.maps_properties = [];

exports.loadAllMaps = function(cb) {
    fs.readdir('maps', (err, files) => {
        let count = 0;
        
        files.forEach(file => {
            tiled.loadMap(file);
            
            count++;
        });
        
        output.give('Loaded ' + count + ' map(s).');
        
        if (cb !== undefined)
            cb();
    });
};

exports.loadMap = function(name) {
    try 
    {
        let location = 'maps/' + name;
        
        let map = JSON.parse(fs.readFileSync(location, 'utf-8'))
        map.name = name.substr(0, name.lastIndexOf('.'));
        
        this.maps.push(map);
        
        this.cacheMapProperties(map);
    }
    catch(err)
    {
        output.give(err);
    }
};

exports.mapWithName = function(name)
{   
    this.maps.forEach(function(map) {
        if (map.name == name)
            return map;
    });
};

exports.getMapIndex = function(name)
{
    for (let i = 0; i < this.maps.length; i++)
        if (this.maps[i].name == name) 
            return i;
    
    return -1;
};

exports.getMapTilePropertyDimensions = function(map, id) 
{
    let dimensions = [];
    
    for (let l = 0; l < map.layers.length; l++) {
         let offset_width = -map.width*map.tilewidth/2,
             offset_height = -map.height*map.tileheight/2;

        if (map.layers[l].offsetx !== undefined) offset_width += map.layers[l].offsetx;
        if (map.layers[l].offsety !== undefined) offset_height += map.layers[l].offsety;  
        
        for (let t = 0; t < map.layers[l].data.length; t++)
            if (map.layers[l].data[t] == id+1)
                dimensions.push({
                    x: t % map.layers[l].width * map.tilewidth + offset_width,
                    y: Math.floor(t / map.layers[l].width) * map.tileheight + offset_height,
                    w: map.tilewidth,
                    h: map.tileheight
                });
    }
    
    return dimensions;
}

exports.cacheMapProperties = function(map)
{
    let id = this.getMapIndex(map.name);
    
    this.maps_properties[id] = [];
    
    if (map.tilesets === undefined)
        return;
    
    for (let t = 0; t < map.tilesets.length; t++)
    {
        let tileset = map.tilesets[t];
        
        if (tileset.tiles === undefined)
            continue;
        
        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].properties === undefined)
                continue;
            
            for (let p = 0; p < tileset.tiles[i].properties.length; p++)
            {
                let property = tileset.tiles[i].properties[p];
                
                this.maps_properties[id].push({
                    name: property.name,
                    value: property.value,
                    dimensions: this.getMapTilePropertyDimensions(map, tileset.tiles[i].id)
                });
            }
        }
    }
    
    npcs.loadMap(id);
};

exports.checkPropertyAtPosition = function(map_name, property_name, pos)
{
    let id = tiled.getMapIndex(map_name);
    
    if (id == -1 ||
        this.maps_properties[id] === undefined ||
        this.maps_properties[id].length == 0)
        return false;
    
    let valid = false;
    
    this.maps_properties[id].forEach(function(property) {
        if (valid)
            return;
        
        if (property.name == property_name)
            property.dimensions.forEach(function(dimension) {
                if (tiled.checkPositionInDimension(dimension, pos.X, pos.Y)) {
                    valid = true;
                    
                    return;
                }
            });
    });
    
    return valid;
};
                                     
exports.checkPositionInDimension = function(dimension, x, y) {
    if (Math.abs(x-dimension.x) <= dimension.w*2 &&
        Math.abs(y-dimension.y) <= dimension.h*2)
        return true;
    
    return false;
};