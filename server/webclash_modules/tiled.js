//Tiled module for WebClash

const fs = require('fs');

exports.maps = [];
exports.maps_properties = [];
exports.maps_colliders = [];

exports.loadAllMaps = function(cb) 
{
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

exports.loadMap = function(name) 
{
    try 
    {
        let location = 'maps/' + name;
        
        let map = JSON.parse(fs.readFileSync(location, 'utf-8'))
        map.name = name.substr(0, name.lastIndexOf('.'));
        
        this.maps.push(map);
        
        this.cacheMap(map);
    }
    catch(err)
    {
        output.give(err);
    }
};

exports.mapWithName = function(name)
{   
    for (let i = 0; i < this.maps.length; i++)
        if (this.maps[i].name === name) 
            return this.maps[i];
};

exports.getMapIndex = function(name)
{
    for (let i = 0; i < this.maps.length; i++)
        if (this.maps[i].name === name) 
            return i;
    
    return -1;
};

exports.getMapType = function(name)
{
    for (let i = 0; i < this.maps.length; i++)
        if (this.maps[i].name === name) { 
            if (this.maps[i].mapType == undefined)
                this.maps[i].mapType = 'protected';
            
            return this.maps[i].mapType;
        }
};

exports.getMapTileRectangles = function(map, id) 
{
    let rects = [];
    
    let offset_width = -map.width*map.tilewidth/2,
        offset_height = -map.height*map.tileheight/2;
    
    for (let l = 0; l < map.layers.length; l++) {
        if (!map.layers[l].visible ||
            map.layers[l].type !== 'tilelayer')
            continue;
        
        if (map.layers[l].offsetx !== undefined) offset_width += map.layers[l].offsetx;
        if (map.layers[l].offsety !== undefined) offset_height += map.layers[l].offsety;  
        
        for (let t = 0; t < map.layers[l].data.length; t++)
            if (map.layers[l].data[t] == id+1)
                rects.push({
                    x: (t % map.layers[l].width) * map.tilewidth + offset_width,
                    y: Math.floor(t / map.layers[l].width) * map.tileheight + offset_height,
                    w: map.tilewidth,
                    h: map.tileheight
                });
    }
    
    return rects;
}

exports.cacheMap = function(map)
{
    let id = this.getMapIndex(map.name);
    
    this.maps_properties[id] = [];
    this.maps_colliders[id] = [];
    
    if (map.tilesets === undefined)
        return;
    
    //Cache tilesets
    
    for (let t = 0; t < map.tilesets.length; t++)
    {
        let tileset = map.tilesets[t];
        
        if (tileset.tiles === undefined)
            continue;
        
        for (let i = 0; i < tileset.tiles.length; i++) {
            //Check properties
            
            if (tileset.tiles[i].properties !== undefined)
                for (let p = 0; p < tileset.tiles[i].properties.length; p++)
                {
                    let property = tileset.tiles[i].properties[p];

                    this.maps_properties[id].push({
                        tile: tileset.tiles[i].id,
                        name: property.name,
                        value: property.value,
                        rectangles: this.getMapTileRectangles(map, tileset.tiles[i].id)
                    });
                }
            
            //Check colliders
            
            if (tileset.tiles[i].objectgroup !== undefined)
                this.maps_colliders[id].push(this.getMapTileRectangles(map, tileset.tiles[i].id));
        }
    }
    
    //Cache object layers
    
    for (let l = 0; l < map.layers.length; l++)
    {
        if (!map.layers[l].visible ||
            map.layers[l].type !== 'objectgroup')
            continue;
        
        //TEMPORARY: Get offset width and height
            
        let offset_width = -map.width*map.tilewidth/2,
            offset_height = -map.height*map.tileheight/2;

        if (map.layers[l].offsetx !== undefined) offset_width += map.layers[l].offsetx;
        if (map.layers[l].offsety !== undefined) offset_height += map.layers[l].offsety;  
        
        //Cycle through all objects
        
        for (let o = 0; o < map.layers[l].objects.length; o++)
        {
            const data = map.layers[l].objects[o];
            
            //Get collision data
            
            let coll = {
                x: data.x+offset_width,
                y: data.y+offset_height,
                w: data.width,
                h: data.height
            };
            
            //Check properties
            
            if (data.properties !== undefined)
                for (let p = 0; p < data.properties.length; p++)
                {
                    let property = data.properties[p];

                    this.maps_properties[id].push({
                        object: o,
                        name: property.name,
                        value: property.value,
                        rectangles: [coll]
                    });
                }

            //Check if not a point
            
            if (data.width === 0 ||
                data.height === 0 ||
                data.point)
                continue;
            
            //Add collider
            
            this.maps_colliders[id].push([coll]);
        }
    }
    
    //Load NPCs
    
    npcs.loadMap(id);
};

exports.checkPropertyWithRectangle = function(map_name, property_name, rectangle)
{
    let id = this.getMapIndex(map_name),
        data = {
            near: false
        };
    
    if (id == -1 ||
        this.maps_properties[id] === undefined ||
        this.maps_properties[id].length == 0)
        return data;
    
    data.map = id;
    
    for (let p = 0; p < this.maps_properties[id].length; p++) {
        if (this.maps_properties[id][p].name !== property_name)
            continue;
        
        for (let r = 0; r < this.maps_properties[id][p].rectangles.length; r++)
            if (this.checkRectangularCollision(this.maps_properties[id][p].rectangles[r], rectangle)) 
            {
                data.near = true;
                data.tile = this.maps_properties[id][p].tile;
                data.object = this.maps_properties[id][p].object;
                
                break;
            }
    }
    
    return data;
};

exports.getPropertiesWithRectangle = function(id, rectangle) 
{
    if (id == -1 ||
        this.maps_properties[id] === undefined ||
        this.maps_properties[id].length == 0)
        return [];
    
    for (let p = 0; p < this.maps_properties[id].length; p++)
        for (let r = 0; r < this.maps_properties[id][p].rectangles.length; r++)
            if (this.checkRectangularCollision(this.maps_properties[id][p].rectangles[r], rectangle)) 
                return this.maps_properties[id];
    
    return [];
}

exports.getPropertiesFromTile = function(map, tile)
{
    let result = [];
    
    if (this.maps_properties[map] == undefined)
        return result;
    
    for (let p = 0; p < this.maps_properties[map].length; p++) {
        if (this.maps_properties[map][p].tile == tile)
            result.push({
                name: this.maps_properties[map][p].name,
                value: this.maps_properties[map][p].value
            });
    }
    
    return result;
};

exports.getPropertiesFromObject = function(map, object)
{
    let result = [];
    
    if (this.maps_properties[map] == undefined)
        return result;
    
    for (let p = 0; p < this.maps_properties[map].length; p++) {
        if (this.maps_properties[map][p].object == object)
            result.push({
                name: this.maps_properties[map][p].name,
                value: this.maps_properties[map][p].value
            });
    }
    
    return result;
};

exports.checkCollisionWithRectangle = function(map_name, rectangle)
{
    let id = this.getMapIndex(map_name);
    
    if (id == -1 ||
        this.maps_colliders[id] === undefined)
        return false;
    
    for (let c = 0; c < this.maps_colliders[id].length; c++) {
        if (this.maps_colliders[id][c] === undefined)
            continue;
        
        for (let r = 0; r < this.maps_colliders[id][c].length; r++)
            if (this.checkRectangularCollision(this.maps_colliders[id][c][r], rectangle)) 
                    return true;
    }
    
    return false;
};

exports.checkRectangleInMap = function(id, rect) 
{
    for (let l = 0; l < this.maps[id].layers.length; l++) {
        let map = {
            x: -this.maps[id].width*this.maps[id].tilewidth/2,
            y: -this.maps[id].height*this.maps[id].tileheight/2,
            w: this.maps[id].width*this.maps[id].tilewidth,
            h: this.maps[id].height*this.maps[id].tileheight
        };
        
        if (this.maps[id].layers[l].offsetx !== undefined) map.x += this.maps[id].layers[l].offsetx;
        if (this.maps[id].layers[l].offsety !== undefined) map.y += this.maps[id].layers[l].offsety;  
        
        if (!this.checkRectangularCollision(map, rect))
            return false;
    }
    
    return true;
};

exports.checkRectangularCollision = function(rect1, rect2) 
{
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.h + rect1.y > rect2.y)
        return true;
    
    return false;
};