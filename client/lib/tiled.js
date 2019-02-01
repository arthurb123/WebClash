const tiled = {
    loading: false,
    queue: [],
    executeAfterLoad: function(cb, parameter) {
        this.queue.push({
            cb: cb,
            parameter: parameter
        });
    },
    convertAndLoadMap: function(map) {
        //Set loading
        
        this.loading = true;
        
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
    
        for (let l = 0; l < map.layers.length; l++) {
            const data = map.layers[l].data,
                  width = map.layers[l].width,
                  height = map.layers[l].height;
            
            if (map.layers[l].offsetx !== undefined) 
                offset_width += map.layers[l].offsetx;
            if (map.layers[l].offsety !== undefined) 
                offset_height += map.layers[l].offsety;
            
            lx.OnLayerDraw(l, function(gfx) {
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

                        let sprite;

                        for (let i = 0; i < map.tilesets.length; i++)
                            if (data[t] >= map.tilesets[i].firstgid)
                                sprite = game.getTileset(map.tilesets[i].image);
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
                            x: (data[t] % sprite._tilewidth - 1) * map.tilewidth,
                            y: (Math.ceil(data[t] / sprite._tilewidth) -1) * map.tileheight
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
        }
        
        //Add world boundary colliders
        
        this.createWorldBoundaries(map, offset_width, offset_height);
        
        //Execute after load queue

        this.queue.forEach(function(cb) {
            cb.cb(cb.parameter, offset_width, offset_height); 
        });
        this.queue = [];
        
        //Set loading to false
        
        this.loading = false;
    },
    checkObjects: function(map)
    {        
         for (let l = 0; l < map.layers.length; l++) {
             const data = map.layers[l].data,
                   width = map.layers[l].width,
                   height = map.layers[l].height;
             
             let offset_width = -map.width*map.tilewidth/2,
                 offset_height = -map.height*map.tileheight/2;
             
             if (map.layers[l].offsetx !== undefined) offset_width += map.layers[l].offsetx;
             if (map.layers[l].offsety !== undefined) offset_height += map.layers[l].offsety;
             
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

                this.checkProperties(tp, offset_width, offset_height, tileset, data[t]);
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
    checkProperties: function(tile_coordinates, offset_width, offset_height, tileset, id)
    {
        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].id+1 == id) {
                if (tileset.tiles[i].properties === undefined)
                    continue;
                
                const properties = tileset.tiles[i].properties,
                      callbacks = [];
                
                for (let p = 0; p < properties.length; p++) {
                    let f = this.handleProperty(properties[p], tileset, offset_width, offset_height);
                    
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
    handleProperty: function(property, tileset, offset_width, offset_height)
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
                return function(go, ow, oh) {
                    if (go === game.players[game.player])
                    {
                        if (ow === undefined)
                            ow = offset_width;
                        
                        go.POS.X = Math.floor(property.value*tileset.tilewidth+ow);
                        player.sync('position');
                    }
                };
            case "positionY":
                return function(go, ow, oh) {
                    if (go === game.players[game.player])
                    {
                        if (oh === undefined)
                            oh = offset_height;
                        
                        go.POS.Y = Math.floor(property.value*tileset.tileheight+oh)-go.Size().H/2;
                        player.sync('position');
                    }
                };
        }
    },
    createWorldBoundaries: function(map, offset_width, offset_height) {
        new lx.Collider(offset_width, offset_height-map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.Collider(offset_width-map.tilewidth, offset_height, map.tilewidth, map.height*map.tileheight, true);
        
        new lx.Collider(offset_width, offset_height+map.height*map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.Collider(offset_width+map.width*map.tilewidth, offset_height, map.tilewidth, map.height*map.tileheight, true);
    }
};