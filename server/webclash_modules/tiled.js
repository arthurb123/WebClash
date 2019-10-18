//Tiled module for WebClash

const fs = require('fs');

exports.maps = [];
exports.maps_properties = [];
exports.maps_colliders = [];

exports.map_requests = {};

exports.loadAllMaps = function(cb)
{
    fs.readdir('maps', (err, files) => {
        if (err) {
            output.giveError('Could not load maps: ', err);
            return;
        }

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
        output.giveError('Could not load map: ', err);
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

    for (let l = 0; l < map.layers.length; l++) {
        if (!map.layers[l].visible ||
            map.layers[l].type !== 'tilelayer')
            continue;

        let offset_width = -map.width*map.tilewidth/2,
            offset_height = -map.height*map.tileheight/2;

        if (map.layers[l].offsetx !== undefined)
            offset_width += map.layers[l].offsetx;
        if (map.layers[l].offsety !== undefined)
            offset_height += map.layers[l].offsety;

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
            //Calculate actual

            let actual = tileset.tiles[i].id;
            if (t > 0)
                actual = tileset.tiles[i].id + map.tilesets[t].firstgid - 1;

            //Check properties

            if (tileset.tiles[i].properties != undefined) {
                //Get checks (if they exist)

                let checks = this.getPropertyChecks(tileset.tiles[i].properties);

                //Create properties

                for (let p = 0; p < tileset.tiles[i].properties.length; p++)
                {
                    let property = tileset.tiles[i].properties[p];

                    this.maps_properties[id].push({
                        tile: tileset.tiles[i].id,
                        name: property.name,
                        value: property.value,
                        rectangles: this.getMapTileRectangles(map, actual),
                        checks: checks
                    });
                }
            }

            //Check colliders

            if (tileset.tiles[i].objectgroup !== undefined)
                this.maps_colliders[id].push(this.getMapTileRectangles(map, actual));
        }
    }

    //Cache object layers

    for (let l = 0; l < map.layers.length; l++)
    {
        if (!map.layers[l].visible ||
            map.layers[l].type !== 'objectgroup')
            continue;

        //Get offset width and height

        let offset_width = -map.width*map.tilewidth/2,
            offset_height = -map.height*map.tileheight/2;

        if (map.layers[l].offsetx !== undefined)
            offset_width += map.layers[l].offsetx;
        if (map.layers[l].offsety !== undefined)
            offset_height += map.layers[l].offsety;

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

            if (data.properties != undefined) {
                //Get checks (if they exist)

                let checks = this.getPropertyChecks(data.properties);

                //Create properties

                for (let p = 0; p < data.properties.length; p++)
                {
                    let property = data.properties[p];

                    this.maps_properties[id].push({
                        object: o,
                        name: property.name,
                        value: property.value,
                        rectangles: [coll],
                        checks: checks
                    });
                }
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

exports.getPropertyChecks = function(properties) {
    let checks = [];

    for (let p = 0; p < properties.length; p++)
    {
        let property = properties[p];

        //Check for get variable checks

        if (property.name === 'getVariableTrue')
            checks.push({
                name: property.value,
                value: true
            });
        if (property.name === 'getVariableFalse')
            checks.push({
                name: property.value,
                value: false
            });
    }

    return checks;
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

exports.getPropertiesWithRectangle = function(map, rectangle)
{
    if (map == -1 ||
        this.maps_properties[map] === undefined ||
        this.maps_properties[map].length == 0)
        return [];

    for (let p = 0; p < this.maps_properties[map].length; p++)
        for (let r = 0; r < this.maps_properties[map][p].rectangles.length; r++)
            if (this.checkRectangularCollision(this.maps_properties[map][p].rectangles[r], rectangle))
                return this.maps_properties[map];

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

exports.checkCollisionWithRectangle = function(map, rectangle)
{
    if (map === -1 ||
        this.maps_colliders[map] == undefined)
        return false;

    for (let c = 0; c < this.maps_colliders[map].length; c++) {
        if (this.maps_colliders[map][c] == undefined)
            continue;

        for (let r = 0; r < this.maps_colliders[map][c].length; r++)
            if (this.checkRectangularCollision(this.maps_colliders[map][c][r], rectangle))
                    return true;
    }

    return false;
};

exports.checkRectangleInMap = function(map, rect)
{
    for (let l = 0; l < this.maps[map].layers.length; l++) {
        let boundaries = {
            x: -this.maps[map].width*this.maps[map].tilewidth/2,
            y: -this.maps[map].height*this.maps[map].tileheight/2,
            w: this.maps[map].width*this.maps[map].tilewidth,
            h: this.maps[map].height*this.maps[map].tileheight
        };

        if (this.maps[map].layers[l].offsetx != undefined) 
            boundaries.x += this.maps[map].layers[l].offsetx;
        if (this.maps[map].layers[l].offsety != undefined) 
            boundaries.y += this.maps[map].layers[l].offsety;

        if (!this.checkRectangularCollision(boundaries, rect))
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

exports.generateRequestIdentifier = function(map_id, player_id) {
    //Generate a valid identifier

    let request_id = tools.randomString();

    while (this.map_requests[request_id] != undefined)
        request_id = tools.randomString();

    //Set player id at request id

    this.map_requests[request_id] = {
        player_id: player_id,
        map_id: map_id
    }

    //Return the generated request id

    return request_id;
};

exports.requestMap = function(req, res) {
    try {
        let request_id = req.params.request_id;

        //Check if paramaters are valid

        if (request_id == undefined ||
            tiled.map_requests[request_id] == undefined) {
            res.send('error');
            return;
        }

        //Get player id and map id and delete entry

        let player_id = tiled.map_requests[request_id].player_id,
            map_id    = tiled.map_requests[request_id].map_id;

        delete tiled.map_requests[request_id];

        //Send custom tailored map for player

        res.send(tiled.createPlayerMap(player_id, map_id));
    }
    catch (err) {
        //Give error and respond to client with error

        output.giveError('Could not handle map request: ', err);

        res.send('error');
    }
};

exports.createPlayerMap = function(id, map_id) {
    let vars = {};

    //Get all needed global variables

    for (let i = 0; i < this.maps_properties[map_id].length; i++)
        for (let ii = 0; ii < this.maps_properties[map_id][i].checks.length; ii++) {
            let check = this.maps_properties[map_id][i].checks[ii];

            if (vars[check.name] == undefined) {
                let result = game.getPlayerGlobalVariable(id, check.name);
                if (result == undefined)
                    result = false;

                vars[check.name] = result;
            }
        }

    //Return the map with the checks

    return {
        vars: vars,
        map: this.maps[map_id]
    };
};