const tiled = {
    loading: false,
    queue: [],
    current: '',
    executeAfterLoad: function(cb, parameter) {
        this.queue.push({
            cb: cb,
            parameter: parameter
        });
    },
    convertAndLoadMap: function(map) {
        //Set loading
        
        this.loading = true;
        
        //Change map name
        
        this.current = map.name;
        
        //Remove all (online) players
        
        game.resetPlayers();
        
        //Remove all NPCs
        
        game.resetNPCs();
        
        //Clear all colliders, except player's
        
        game.resetColliders();
        
        //Clear all world items
        
        game.resetWorldItems();
        
        //Make sure certain player stats are reset
        
        game.resetPlayer();
        
        //Reset loot box
        
        ui.loot.reset();
        
        //Clear the OnLayerDraw events
        
        lx.ResetLayerDraw();
        
        //Create colliders
        
        this.checkObjects(map);
        
        //Create offset width and height
        
        let offset_width = -map.width*map.tilewidth/2,
            offset_height = -map.height*map.tileheight/2;
        
        //Add OnLayerDraw events based on
        //the map content
        
        let actualLayer = 0;
    
        for (let l = 0; l < map.layers.length; l++) {
            //Check if visible
            
            if (!map.layers[l].visible)
                continue;
            
            //Check if tilelayer
            
            if (map.layers[l].type !== 'tilelayer')
                continue;
            
            const data = map.layers[l].data,
                  width = map.layers[l].width,
                  height = map.layers[l].height;
            
            if (map.layers[l].offsetx !== undefined) 
                offset_width += map.layers[l].offsetx;
            if (map.layers[l].offsety !== undefined) 
                offset_height += map.layers[l].offsety;

            lx.OnLayerDraw(actualLayer, function(gfx) {
                if (game.player === -1 ||
                    game.players[game.player] == undefined)
                    return;
                
                let y_line = {
                    start: Math.floor((game.players[game.player].POS.Y-offset_height-lx.GetDimensions().height/2)/map.tileheight),
                    length: lx.GetDimensions().height/map.tileheight+2
                },
                    x_line = {
                    start: Math.floor((game.players[game.player].POS.X-offset_width-lx.GetDimensions().width/2)/map.tilewidth),
                    length: lx.GetDimensions().width/map.tilewidth+2
                };
         
                for (let y = y_line.start; y < y_line.start+y_line.length; y++)
                    for (let x = x_line.start; x < x_line.start+x_line.length; x++) {
                        //Convert to tile
                        
                        let t = y * map.width + x;
                        
                        //Skip empty tiles
                    
                        if (data[t] == 0)
                            continue;

                        //Get corresponding tile sprite

                        let sprite,
                            actual = data[t];

                        for (let i = 0; i < map.tilesets.length; i++)
                            if (data[t] >= map.tilesets[i].firstgid) {
                                sprite = game.getTileset(map.tilesets[i].image);
                                
                                if (i != 0)
                                    actual = data[t] - map.tilesets[i].firstgid + 1;
                            }
                            else
                                break;

                        //Check if sprite is valid

                        if (sprite === undefined)
                            continue;

                        //Check if sprite has a tilewidth specified

                        if (sprite._tilewidth == undefined || 
                            sprite._tilewidth == 0) {
                            sprite._tilewidth = sprite.Size().W/map.tilewidth;
                        }

                        //Calculate tile coordinates

                        let tc = {
                            x: (actual % sprite._tilewidth - 1) * map.tilewidth,
                            y: (Math.ceil(actual / sprite._tilewidth) -1) * map.tileheight
                        },
                            tp = {
                            x: t % width * map.tilewidth,
                            y: Math.floor(t / width) * map.tileheight       
                        };

                        //Tile clip coordinates artefact prevention

                        if (tc.x == -map.tilewidth)
                            tc.x = sprite.Size().W - map.tilewidth;

                        //Draw tile

                        lx.DrawSprite(
                            sprite.Clip(tc.x, tc.y, map.tilewidth, map.tileheight),

                            tp.x+offset_width,
                            tp.y+offset_height, 

                            map.tilewidth,
                            map.tileheight
                        );
                    }
            });
            
            //Increment actual layer
            
            actualLayer++;
        }
        
        //Add world boundary colliders
        
        this.createWorldBoundaries(map, offset_width, offset_height);
        
        //Execute after load queue

        this.queue.forEach(function(cb) {
            cb.cb(cb.parameter); 
        });
        this.queue = [];
        
        //Set loading to false
        
        this.loading = false;
    },
    checkObjects: function(map)
    {        
        let offset_width = -map.width*map.tilewidth/2,
              offset_height = -map.height*map.tileheight/2;

        for (let l = 0; l < map.layers.length; l++) {
             //Check if layer is visible
            
             if (!map.layers[l].visible)
                 continue;

             const width = map.layers[l].width,
                   height = map.layers[l].height;

             if (map.layers[l].offsetx !== undefined) offset_width += map.layers[l].offsetx;
             if (map.layers[l].offsety !== undefined) offset_height += map.layers[l].offsety;

             //Tile layer
            
             if (map.layers[l].type === 'tilelayer') {
                 const data = map.layers[l].data;

                 for (let t = 0; t < data.length; t++)
                 {
                    //Skip empty tiles

                    if (data[t] == 0)
                        continue;

                    //Get corresponding tileset

                    let tileset;

                    for (let i = 0; i < map.tilesets.length; i++) {
                        if (tileset !== undefined && data[t] < tileset.firstgid)
                            break;

                        tileset = map.tilesets[i];
                    }

                    //Check if tileset has objects

                    if (tileset.tiles === undefined)
                        continue;

                    //Calculate tile coordinates

                    let tp = {
                        x: t % width * map.tilewidth + offset_width,
                        y: Math.floor(t / width) * map.tileheight + offset_height     
                    };

                    //Check collider

                    this.checkCollider(tp, tileset, data[t]);

                    //Check properties

                    this.checkProperties(tp, tileset, data[t]);
                 }
             }

             //Object layer
            
             if (map.layers[l].type === 'objectgroup') {
                 const data = map.layers[l].objects;

                 for (let o = 0; o < data.length; o++)
                 {
                    //Check if visible

                     if (!data[o].visible ||
                         data.point ||
                         data[o].width === 0 ||
                         data[o].height === 0)
                         continue;

                    //Create collider with properties
                     
                    const properties = map.layers[l].objects[o].properties,
                          callbacks = [];
                     
                    if (properties != undefined) 
                        for (let p = 0; p < properties.length; p++) {
                            let f = this.handleProperty(properties[p]);

                            if (f !== undefined)
                                callbacks.push(f);
                        }
                     
                    let coll = new lx.Collider(
                        data[o].x+offset_width,
                        data[o].y+offset_height,
                        data[o].width,
                        data[o].height,
                        true
                    );

                    if (callbacks.length > 0) {
                        coll.OnCollide = function(data) {
                            let go = lx.FindGameObjectWithCollider(data.trigger);

                            if (go === undefined)
                                return;

                            callbacks.forEach(function(cb) { 
                                if (cb !== undefined) {
                                    if (!tiled.loading)
                                        cb(go);
                                    else
                                        tiled.executeAfterLoad(cb, go);
                                }
                            });
                        };
                        
                        coll.Solid(false);
                    }
                 }
             }
        }
    },
    checkCollider: function(tile_coordinates, tileset, id)
    {
        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].id+1 == id) {
                if (tileset.tiles[i].objectgroup === undefined ||
                    tileset.tiles[i].objectgroup.objects === undefined)
                    continue;
                
                const objects = tileset.tiles[i].objectgroup.objects;

                for (let c = 0; c < objects.length; c++)
                    if (objects[c].visible)
                        new lx.Collider(
                            tile_coordinates.x + objects[c].x,
                            tile_coordinates.y + objects[c].y,
                            objects[c].width,
                            objects[c].height,
                            true
                        );
            }
        }
    },
    checkProperties: function(tile_coordinates, tileset, id)
    {
        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].id+1 == id) {
                if (tileset.tiles[i].properties === undefined)
                    continue;
                
                const properties = tileset.tiles[i].properties,
                      callbacks = [];
                
                let isMapEvent = false;
                
                for (let p = 0; p < properties.length; p++) {
                    if (properties[p].name === 'loadMap')  
                    {
                        isMapEvent = true;
                        
                        break;
                    }
                }
                
                for (let p = 0; p < properties.length; p++) {
                    if (properties[p].name === 'positionX' || properties[p].name === 'positionY')
                        if (isMapEvent)
                            continue;
                    
                    let f = this.handleProperty(properties[p]);
                    
                    if (f !== undefined)
                        callbacks.push(f);
                }
                
                if (callbacks.length > 0) {
                    if (tileset.tiles[i].objectgroup === undefined)
                        new lx.Collider(
                            tile_coordinates.x,
                            tile_coordinates.y,
                            tileset.tilewidth,
                            tileset.tileheight,
                            true,
                            function(data) {
                                let go = lx.FindGameObjectWithCollider(data.trigger);

                                if (go === undefined)
                                    return;

                                callbacks.forEach(function(cb) { 
                                    if (cb !== undefined) {
                                        if (!tiled.loading)
                                            cb(go);
                                        else
                                            tiled.executeAfterLoad(cb, go);
                                    }
                                });
                            }
                        ).Solid(false);
                    else {
                        //Add callbacks to objectgroup colliders
                    }
                }
            }
        }
    },
    handleProperty: function(property)
    {
        if (property === undefined)
            return;
        
        switch (property.name)
        {
            case "loadMap":
                return function(go) {
                    if (go === game.players[game.player]) {
                        tiled.loading = true;
                        
                        socket.emit('CLIENT_REQUEST_MAP', property.value);
                    }
                };
            case "positionX":
            case "positionY":
                return function(go) {
                    if (go === game.players[game.player])
                        player.propertyInteraction.interact();
                }
        }
    },
    createWorldBoundaries: function(map, offset_width, offset_height) {
        new lx.Collider(offset_width, offset_height-map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.Collider(offset_width-map.tilewidth, offset_height, map.tilewidth, map.height*map.tileheight, true);
        
        new lx.Collider(offset_width, offset_height+map.height*map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.Collider(offset_width+map.width*map.tilewidth, offset_height, map.tilewidth, map.height*map.tileheight, true);
    }
};