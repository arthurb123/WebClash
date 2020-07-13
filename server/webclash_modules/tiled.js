//Tiled module for WebClash

const colliderZoneSize = 8; //Collider zone size in tiles

exports.maps = [];
exports.maps_properties = [];
exports.maps_collider_zones = [];
exports.maps_dialogs = [];
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
            //Skip metadata files

            if (file.indexOf('.metadata') !== -1)
                return;

            //Load map

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
        let location = 'maps/' + name,
            locationMetadata = 'maps/' + name.substr(0, name.lastIndexOf('.')) + '.metadata.json';

        //Load actual map

        let map = JSON.parse(fs.readFileSync(location, 'utf-8'))
        map.name = name.substr(0, name.lastIndexOf('.'));

        //Load map metadata if possible

        if (fs.existsSync(locationMetadata)) {
            let metadata = JSON.parse(fs.readFileSync(locationMetadata, 'utf-8'));

            //Copy metadata attributes to map

            for (let attr in metadata)
                map[attr] = metadata[attr];
        } else {
            output.give('No metadata found for map "' + name + '", this map has not been loaded.');

            return;
        }

        //Verify metadata for map

        this.verifyMetadata(map);

        //Add map to map collection

        this.maps.push(map);

        //Cache the map

        this.cacheMap(map);
    }
    catch(err)
    {
        output.giveError('Could not load map: ', err);
    }
};

exports.verifyMetadata = function(map) {
    //Check if the amount of layers and
    //map layers are consistent

    let layerAmount = 0;

    for (let l = 0; l < map.layers.length; l++)
        if (map.layers[l].type === 'tilelayer')
            layerAmount++;

    if (map.mapLayers == undefined || layerAmount !== map.mapLayers.length)
        output.give('The amount of layers in map "' + map.name + '" differ from the layers specified in the map settings, updating this is advised.');

    //Other metadata verification checks 

    //...
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
    //Create rectangle array

    let rects = [];

    for (let l = 0; l < map.layers.length; l++) {
        if (!map.layers[l].visible ||
            map.layers[l].type !== 'tilelayer')
            continue;

        //Get map offset width and height
        //and calculate layer offset

        let offset_width = -map.width*map.tilewidth/2,
            offset_height = -map.height*map.tileheight/2;

        if (map.layers[l].offsetx !== undefined)
            offset_width += map.layers[l].offsetx;
        if (map.layers[l].offsety !== undefined)
            offset_height += map.layers[l].offsety;

        //Find all tiles in the layer that correspond to
        //the specified tile identifier (id), add the
        //rectangles of these tiles to the rectangle array

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
};

exports.getMapTileObjectRectangles = function(map, id, object) 
{
    //Get map tile rectangles

    let rects = this.getMapTileRectangles(map, id);

    //For all rectangles, adjust according to the
    //object position and size

    for (let r = 0; r < rects.length; r++)
        rects[r] = {
            x: rects[r].x + object.x,
            y: rects[r].y + object.y,
            w: (object.w == undefined ? 0 : object.w),
            h: (object.h == undefined ? 0 : object.h)
        };

    return rects;
};

exports.cacheMap = function(map)
{
    let id = this.getMapIndex(map.name);

    this.maps_properties[id] = [];
    this.maps_collider_zones[id] = [];
    this.maps_dialogs[id] = {};

    //Check if tilesets exist

    if (map.tilesets === undefined)
        return;

    //Calculate base offset width and height

    let offset_width  = -map.width*map.tilewidth/2,
        offset_height = -map.height*map.tileheight/2;

    //Cache tilesets (tiles and tile specific objects)

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

                //Create properties list

                let properties = [];

                for (let p = 0; p < tileset.tiles[i].properties.length; p++)
                {
                    //Grab the property

                    let property = tileset.tiles[i].properties[p];

                    //Skip check properties

                    if (property.name === 'getVariableTrue' ||
                        property.name === 'getVariableFalse')
                        continue;

                    //Add to properties list

                    properties.push({
                        name: property.name,
                        value: property.value
                    });
                }

                //Add to map properties list

                this.maps_properties[id].push({
                    tile: tileset.tiles[i].id,
                    properties: properties,
                    rectangles: this.getMapTileRectangles(map, actual),
                    checks: checks
                });
            }

            //Check tile specific objects

            if (tileset.tiles[i].objectgroup != undefined)
                for (let o = 0; o < tileset.tiles[i].objectgroup.objects.length; o++) {
                    let obj = tileset.tiles[i].objectgroup.objects[o];

                    //Get checks (if they exist)

                    let checks = this.getPropertyChecks(obj.properties);

                    //Create properties list

                    let properties = [];

                    for (let p = 0; p < obj.properties.length; p++) {
                        //Grab the property

                        let property = obj.properties[p];

                        //Skip check properties

                        if (property.name === 'getVariableTrue' ||
                            property.name === 'getVariableFalse')
                            continue;

                        //Add to properties list

                        properties.push({
                            name: property.name,
                            value: property.value
                        });
                    }

                    //Add to map properties list
                    
                    obj = { 
                        x: obj.x, 
                        y: obj.y, 
                        w: obj.width, 
                        h: obj.height
                    };

                    this.maps_properties[id].push({
                        tile: tileset.tiles[i].id,
                        object: obj,
                        properties: properties,
                        rectangles: this.getMapTileObjectRectangles(map, actual, obj),
                        checks: checks
                    });
                }
        }
    }

    //Cache object layers

    for (let l = 0; l < map.layers.length; l++)
    {
        if (!map.layers[l].visible ||
            map.layers[l].type !== 'objectgroup')
            continue;

        //Get offset width and height

        let layer_offset_width = 0,
            layer_offset_height = 0;
            
        if (map.layers[l].offsetx !== undefined)
            layer_offset_width = map.layers[l].offsetx;
        if (map.layers[l].offsety !== undefined)
            layer_offset_height = map.layers[l].offsety;

        //Cycle through all objects

        for (let o = 0; o < map.layers[l].objects.length; o++)
        {
            const obj = map.layers[l].objects[o];

            //Check properties

            if (obj.properties != undefined) {
                //Get checks (if they exist)

                let checks = this.getPropertyChecks(obj.properties);

                //Create properties list

                let properties = [];

                for (let p = 0; p < obj.properties.length; p++)
                {
                    //Grab the property

                    let property = obj.properties[p];

                    //Skip check properties

                    if (property.name === 'getVariableTrue' ||
                        property.name === 'getVariableFalse')
                        continue;

                    //Add to properties list

                    properties.push({
                        name: property.name,
                        value: property.value
                    });
                }

                //Setup collision rectangle

                let coll = {
                    x: obj.x + offset_width + layer_offset_width,
                    y: obj.y + offset_height + layer_offset_height,
                    w: obj.width,
                    h: obj.height
                };

                //Add to map properties list

                this.maps_properties[id].push({
                    object: { x: obj.x, y: obj.y, w: obj.width, h: obj.height },
                    properties: properties,
                    rectangles: [coll],
                    checks: checks
                });
            }
        }
    }

    //Cache collider zones

    map.colliderZoneWidth  = Math.ceil(map.width  / colliderZoneSize);
    map.colliderZoneHeight = Math.ceil(map.height / colliderZoneSize);

    //TODO: Clean this mess of 200 lines of magic up, 
    //      it is not essential as it only has to happen
    //      once upon startup - but if this is more
    //      efficient it reduces the startup time
    //      significantly. Idea: move from checking
    //      every collider against a zone to creating
    //      all colliders once and moving it into the
    //      correct zone.

    for (let x = 0; x < map.colliderZoneWidth; x++)
        for (let y = 0; y < map.colliderZoneHeight; y++) {
            //Calculate zone positions

            let z_x = x * colliderZoneSize;
            let z_y = y * colliderZoneSize;

            //Create new zone entry

            let zoneId = x * map.colliderZoneHeight + y;
            this.maps_collider_zones[id][zoneId] = {
                x: z_x * map.tilewidth + offset_width,
                y: z_y * map.tileheight + offset_height,
                w: colliderZoneSize * map.tilewidth,
                h: colliderZoneSize * map.tileheight,
                colliders: []
            };

            for (let l = 0; l < map.layers.length; l++)
            {
                if (!map.layers[l].visible ||
                    map.layers[l].type !== 'objectgroup')
                    continue;

                //Get offset width and height

                let layer_offset_width = 0,
                    layer_offset_height = 0;

                if (map.layers[l].offsetx !== undefined)
                    layer_offset_width = map.layers[l].offsetx;
                if (map.layers[l].offsety !== undefined)
                    layer_offset_height = map.layers[l].offsety;

                //Create zone rectangle

                let zone = {
                    x: this.maps_collider_zones[id][zoneId].x + layer_offset_width,
                    y: this.maps_collider_zones[id][zoneId].y + layer_offset_height,
                    w: this.maps_collider_zones[id][zoneId].w,
                    h: this.maps_collider_zones[id][zoneId].h
                };

                //Cycle through all objects

                for (let o = 0; o < map.layers[l].objects.length; o++)
                {
                    const data = map.layers[l].objects[o];

                    //If properties exist, get checks -
                    //and check for other properties

                    let checks = [];

                    if (data.properties != undefined) {
                        //Get checks (if they exist)

                        checks = this.getPropertyChecks(data.properties);

                        //For all properties, check certain properties

                        let valid = true;
                        for (let p = 0; p < data.properties.length; p++)
                        {
                            let property = data.properties[p];

                            //Check if any other property
                            //than checks

                            if (property.name !== 'getVariableTrue' &&
                                property.name !== 'getVariableFalse') {
                                valid = false;
                                break;
                            }
                        }

                        //Check if still valid

                        if (!valid)
                            continue;
                    }

                    //Get collision data

                    let coll = {
                        x: data.x + offset_width + layer_offset_width,
                        y: data.y + offset_height + layer_offset_height,
                        w: data.width,
                        h: data.height
                    };

                    //Check if not a point,
                    //or has no size

                    if (data.width  === 0 ||
                        data.height === 0 ||
                        data.point)
                        continue;
                    
                    //Check if collider falls in the current zone

                    if (!this.checkRectangularCollision(coll, zone))
                        continue;

                    //Add collider to zone

                    this.maps_collider_zones[id][zoneId].colliders.push({
                        collider: coll,
                        checks: checks
                    });
                }

                //Cycle through all tile specific objects

                for (let t = 0; t < map.tilesets.length; t++)
                {
                    let tileset = map.tilesets[t];

                    if (tileset.tiles === undefined)
                        continue;

                    for (let i = 0; i < tileset.tiles.length; i++) {
                        //Check if tile specific objects are available,
                        //if so cycle through all tile specific objects

                        if (tileset.tiles[i].objectgroup == undefined)
                            continue;

                        for (let o = 0; o < tileset.tiles[i].objectgroup.objects.length; o++)
                        {
                            const data = tileset.tiles[i].objectgroup.objects[o];

                            //If properties exist, get checks -
                            //and check for other properties

                            let checks = [];

                            if (data.properties != undefined) {
                                //Get checks (if they exist)

                                checks = this.getPropertyChecks(data.properties);

                                //For all properties, check certain properties

                                let valid = true;
                                for (let p = 0; p < data.properties.length; p++)
                                {
                                    let property = data.properties[p];

                                    //Check if any other property
                                    //than checks

                                    if (property.name !== 'getVariableTrue' &&
                                        property.name !== 'getVariableFalse') {
                                        valid = false;
                                        break;
                                    }
                                }

                                //Check if still valid

                                if (!valid)
                                    continue;
                            }

                            //Get all tile object rectangles

                            let rects = this.getMapTileObjectRectangles(map, actual, data);

                            //For all tile object rectangles, 
                            //attempt to add the zone

                            for (let r = 0; r < rects.length; r++) {
                                //Check if collider falls in the current zone
            
                                if (!this.checkRectangularCollision(rects[r], zone))
                                    continue;
            
                                //Add collider to zone
            
                                this.maps_collider_zones[id][zoneId].colliders.push({
                                    collider: rects[r],
                                    checks: checks
                                });
                            }
                        }
                    }
                }
            }
        }

    //Cache dialog metadata

    if (map.mapDialogs != undefined) {
        for (let d = 0; d < map.mapDialogs.length; d++) 
            this.maps_dialogs[id][map.mapDialogs[d].name] = {
                title: map.mapDialogs[d].title === "" ? map.mapDialogs[d].name : map.mapDialogs[d].title,
                dialog: map.mapDialogs[d].dialog
            };

        //Remove unnecessary map data

        delete map.mapDialogs;
    }

    //Handle design properties

    this.handleMapDesign(id);
};

exports.handleMapDesign = function(map)
{
    //Cycle through all properties

    for (let p = 0; p < this.maps_properties[map].length; p++) {
        let property = this.maps_properties[map][p];

        for (let r = 0; r < property.rectangles.length; r++) {
            //Simplify current rectangle

            let rect = property.rectangles[r];

            //Switch on property names

            for (let i = 0; i < property.properties.length; i++) {
                switch (property.properties[i].name) {
                    //Item design property

                    case 'item':
                        items.createMapItem(
                            map, 
                            rect.x+rect.w/2,
                            rect.y+rect.h/2,
                            property.properties[i].value
                        );
                        break;
                    
                    //NPC design property

                    case 'NPC':
                        npcs.createNPCs(
                            property.properties[i].value, 
                            property.rectangles, 
                            property.checks, 
                            map
                        );
                        break;

                    //Other design properties

                    //...
                }
            }
        }
    }
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

exports.checkPropertyWithRectangle = function(map, property_name, property_value, rectangle)
{
    //Setup data

    let data = {
        near: false
    };

    //Check if the map is valid, and map
    //properties exist - otherwise return
    //the default data

    if (map == -1 ||
        this.maps_properties[map] == undefined ||
        this.maps_properties[map].length == 0)
        return data;

    //Go over all map properties, when a property with
    //the matching name and value is found we check if
    //a collision occurs - this indicates if the property
    //is within the rectangle

    for (let p = 0; p < this.maps_properties[map].length; p++) {
        for (let i = 0; i < this.maps_properties[map][p].properties.length; i++) {
            //Grab the property

            let property = this.maps_properties[map][p].properties[i];

            //Check if the name and value match

            if (property.name  !== property_name ||
                property.value !== property_value)
                continue;

            //Check if a collision occurs with any rectangle

            for (let r = 0; r < this.maps_properties[map][p].rectangles.length; r++)
                if (this.checkRectangularCollision(this.maps_properties[map][p].rectangles[r], rectangle))
                {
                    //Set near to true and append
                    //any necessary information

                    data.near = true;
                    data.tile = this.maps_properties[map][p].tile;
                    data.object = this.maps_properties[map][p].object;

                    //Return the data

                    return data;
                }
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

    let result = [];

    for (let p = 0; p < this.maps_properties[map].length; p++)
        for (let r = 0; r < this.maps_properties[map][p].rectangles.length; r++) 
            if (this.checkRectangularCollision(this.maps_properties[map][p].rectangles[r], rectangle))
                result.concat(this.maps_properties[map][p].properties);

    return result;
}

exports.getPropertiesFromTile = function(map, tile)
{
    if (this.maps_properties[map] == undefined)
        return [];

    for (let p = 0; p < this.maps_properties[map].length; p++)
        if (this.maps_properties[map][p].objects == undefined &&
            this.maps_properties[map][p].tile == tile) 
            return this.maps_properties[map][p].properties;

    return [];
};

exports.getPropertiesFromTileObject = function(map, tile, object) 
{
    if (this.maps_properties[map] == undefined)
        return [];

    for (let p = 0; p < this.maps_properties[map].length; p++)
        if (this.maps_properties[map][p].tile == tile &&
            this.maps_properties[map][p].object == object)
            return this.maps_properties[map][p].properties;

    return [];
};

exports.getPropertiesFromObject = function(map, object)
{
    if (this.maps_properties[map] == undefined)
        return [];

    for (let p = 0; p < this.maps_properties[map].length; p++)
        if (this.maps_properties[map][p].tile == undefined &&
            this.maps_properties[map][p].object == object) 
            return this.maps_properties[map][p].properties;

    return [];
};

exports.parseCollisionZones = function(map) 
{
    let colliders = [];

    //Go over all collider zones and add
    //the colliders to the list

    for (let zone = 0; zone < this.maps_collider_zones[map].length; zone++) 
        for (let coll = 0; coll < this.maps_collider_zones[map][zone].colliders.length; coll++)
            colliders.push(this.maps_collider_zones[map][zone].colliders[coll]);

    //Return the collider list

    return colliders;
};

exports.getPlayerColliders = function(id, map)
{
    //Parse the collision zones

    let colliders = this.parseCollisionZones(map);
    let playerColliders = [];

    //For all colliders, check if the player meets the checks

    for (let c = 0; c < colliders.length; c++) {
        //Skip any invalid colliders

        if (colliders[c] == undefined)
            continue;

        //If not eligible (false result), skip the collider.

        if (!game.checkPlayerForChecks(id, colliders[c].checks))
            continue;

        //Add to player colliders

        playerColliders.push(colliders[c].collider);
    }

    return playerColliders;
};

exports.findCollisionZone = function(map, rectangle)
{
    //Grab the map

    let m = this.maps[map];

    //Get the tile position of the rectangle

    let tx = Math.round((rectangle.x + m.width  * m.tilewidth  / 2) / m.tilewidth);
    let ty = Math.round((rectangle.y + m.height * m.tileheight / 2) / m.tileheight);

    //Estimate the collider zone through zone size
    //rounding

    let zx = Math.floor(tx / colliderZoneSize);
    let zy = Math.floor(ty / colliderZoneSize);

    //Check if bounds have been exceeded,
    //return invalid zone

    if (zx < 0                    ||
        zy < 0                    ||
        zx >= m.colliderZoneWidth ||
        zy >= m.colliderZoneHeight)
        return -1;

    //Calculate the zone

    let z = zx * m.colliderZoneHeight + zy;

    //Return the zone

    return z;
};

exports.checkCollisionWithRectangle = function(map, rectangle, playerOverride)
{
    try {
        //Check if the map does not exist or the map has no collider zones

        if (map === -1 ||
            this.maps_collider_zones[map] == undefined)
            return false;

        //Grab the current collider zone

        let zone = this.findCollisionZone(map, rectangle);

        //Check if the zone is invalid

        if (zone === -1)
            return true;

        //For all colliders in the zone, check if the target collides with any

        let colliders = this.maps_collider_zones[map][zone].colliders;
        for (let c = 0; c < colliders.length; c++) {
            //Skip any invalid colliders

            if (colliders[c] == undefined)
                continue;

            //If player override (identifier) is specified,
            //check player against the collider checks.
            //If not eligible (false result), skip the collider.

            if (playerOverride != undefined)
                if (!game.checkPlayerForChecks(playerOverride, colliders[c].checks))
                    continue;

            //Check for collision

            if (this.checkRectangularCollision(colliders[c].collider, rectangle))
                return true;
        }

        //No collision with any colliders in the target's zone

        return false;
    }
    catch (err) {
        output.giveError('Could not handle map collision: ', err);

        return false;
    }
};

exports.checkRectangleInMap = function(map, rect)
{
    //Calculate main map boundary

    let boundary = {
        x: -this.maps[map].width*this.maps[map].tilewidth/2,
        y: -this.maps[map].height*this.maps[map].tileheight/2,
        w: this.maps[map].width*this.maps[map].tilewidth,
        h: this.maps[map].height*this.maps[map].tileheight
    };

    //Check if in the boundary

    return this.checkRectangularCollision(boundary, rect);
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

        //If external clients are allowed, make sure
        //to allow CORS access across the domain.
        //Otherwise map loading won't be possible
        //for external clients.

        if (properties.allowExternalClients)
            res.header('Access-Control-Allow-Origin', '*');

        //Send custom tailored map for player,
        //if it is valid

        let playerMap = tiled.createPlayerMap(player_id, map_id);

        if (playerMap == undefined) {
            output.give('Could not send player map as it was invalid.');

            return;
        }

        res.send(playerMap);
    }
    catch (err) {
        //Give error and respond to client with error

        output.giveError('Could not handle map request: ', err);

        res.send('error');
    }
};

exports.createPlayerMap = function(id, map_id) {
    try {
        //Setup data containers

        let properties = [];
        let skipTiles = {};

        //Setup list of properties that are not
        //necessary to be send to the clientside

        const skipProperties = {
            //Design properties
            'NPC': true,
            'item': true,

            //Event properties
            'positionX': true,
            'positionY': true,

            //Check properties
            'getVariableTrue': true,
            'getVariableFalse': true
        };

        //Go over all properties, if the checks apply
        //or are not required - add to the properties list.
        //Make sure to skip unnecessary properties.

        for (let i = 0; i < this.maps_properties[map_id].length; i++) {
            let filteredProperties = [];
            let valid = true;

            //Go over all checks

            for (let c = 0; c < this.maps_properties[map_id][i].checks.length; c++) {
                //Shorten reference

                let property = this.maps_properties[map_id][i];
                
                //Grab check

                let check = property.checks[c];

                //Get the variable result (true or false)

                let result = game.getPlayerGlobalVariable(id, check.name);

                //If invalid, set valid to false and break

                if (!result) {
                    //Check if a tile property,
                    //if so then this tile should
                    //be skipped completely

                    if (property.tile != undefined &&
                        property.object == undefined)
                        skipTiles[property.tile] = true;
                    
                    valid = false;
                    break;
                }
            }

            //Check if valid, if so go over all
            //properties of the map property

            if (!valid)
                continue;

            for (let p = 0; p < this.maps_properties[map_id][i].properties.length; p++) {
                let property = this.maps_properties[map_id][i].properties[p];

                //Check if the property should be skipped

                if (skipProperties[property.name])
                    continue;

                //Add to the filtered properties list

                filteredProperties.push(property);
            }

            //Check if the filtered properties are
            //empty, if so continue

            if (filteredProperties.length === 0)
                continue;

            //Create a unique map property
            //housing the filtered properties
            //and add this to the properties list

            let map_property = deepcopy(this.maps_properties[map_id][i]);
            map_property.properties = filteredProperties;

            //The checks are unnecessary, so these
            //can be removed

            delete map_property.checks;

            properties.push(map_property);
        }

        //Return the map with the filtered properties
        //and a parsed list of all colliders

        return {
            skipTiles: skipTiles,
            colliders: this.getPlayerColliders(id, map_id),
            properties: properties,
            map: this.maps[map_id]
        };
    }
    catch (err) {
        //Give error and respond to client with error

        output.giveError('Could not create player map: ', err);
    }
};

exports.inDialogRange = function(player, map, dialogName) {
    //Check if map properties exist

    if (this.maps_properties[map].length === 0)
        return false;

    //Proximity distance in tiles

    let proximity = 3;
    
    //Create player rectangle

    let rect = {
        x: game.players[player].pos.X, 
        y: game.players[player].pos.Y,
        w: game.players[player].character.width,
        h: game.players[player].character.width
    };

    rect.x -= (proximity/2)*this.maps[map].tilewidth;
    rect.y -= (proximity/2)*this.maps[map].tileheight;
    rect.w += proximity*this.maps[map].tilewidth;
    rect.h += proximity*this.maps[map].tileheight;

    //Check property with rectangle

    let result = this.checkPropertyWithRectangle(
        map, 
        'mapDialogue', 
        dialogName, 
        rect
    );

    //Return near

    return result.near;
};