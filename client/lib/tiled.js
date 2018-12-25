const tiled = {
    convertAndLoadMap: function(map) {
        //Remove all (online) players
        
        game.resetPlayers();
        
        //Clear all colliders, except player's
        
        game.resetColliders();
        
        //Clear the OnLayerDraw events
        
        lx.ResetLayerDraw();
        
        //Create colliders
        
        this.checkObjects(map);
        
        //Add OnLayerDraw events based on
        //the map content
    
        for (let l = 0; l < map.layers.length; l++) {
            const data = map.layers[l].data,
                  width = map.layers[l].width,
                  height = map.layers[l].height;
            
            let offset_width = -map.width*map.tilewidth/2,
                offset_height = -map.height*map.tileheight/2;
            
            if (map.layers[l].offsetx !== undefined) offset_width += map.layers[l].offsetx;
            if (map.layers[l].offsety !== undefined) offset_height += map.layers[l].offsety;
            
            lx.OnLayerDraw(l, function(gfx) {
                for (let t = 0; t < data.length; t++)
                {
                    //Skip empty tiles
                    
                    if (data[t] == 0)
                        continue;
                    
                    //Get corresponding tile sprite
                    
                    let sprite;
                    
                    for (let i = 0; i < map.tilesets.length; i++) {
                        const tileset = map.tilesets[i];
                        
                        if (data[t] >= tileset.firstgid) {
                            let s = tileset.image.lastIndexOf('/')+1;
                            
                            sprite = game.getTileset('res/tilesets/' + tileset.image.substr(s, tileset.image.length-s));
                        } else
                            break;
                    }
                    
                    //Check if sprite is valid
                    
                    if (sprite === undefined)
                        continue;
                    
                    //Calculate tile coordinates
                    
                    let tc = {
                        x: (data[t] % Math.round(sprite.Size().W/map.tilewidth) - 1) * map.tilewidth,
                        y: (Math.ceil(data[t] / Math.round(sprite.Size().W/map.tilewidth)) -1) * map.tileheight
                    },
                        tp = {
                        x: t % width * map.tilewidth,
                        y: Math.floor(t / width) * map.tileheight       
                    };
                    
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

                this.checkProperties(tp, tileset, data[t]);
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
                
                const properties = tileset.tiles[i].properties;
                
                for (let p = 0; p < properties.length; p++)
                    this.handleProperty(tile_coordinates, tileset, properties[p]);
            }
        }
    },
    handleProperty: function(tile_coordinates, tileset, property)
    {
        if (property === undefined)
            return;
        
        switch (property.name)
        {
            case "loadMap":
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
                        
                        if (go === game.players[game.player])
                            socket.emit('CLIENT_REQUEST_MAP', property.value);
                    }
                ).Solid(false);
                break;
            case "NPC":
                //Create NPC according to the ID
                break;
        }
    }
};