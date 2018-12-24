const tiled = {
    convertAndLoadMap: function(map) {
        //Clear the OnLayerDraw events
        
        lx.ResetLayerDraw();
        
        //Create colliders
        
        this.checkColliders(map);
        
        //Add OnLayerDraw events based on
        //the map content
        
        const offset_width = -map.width*map.tilewidth/2,
              offset_height = -map.height*map.tileheight/2;
        
        for (let l = 0; l < map.layers.length; l++) {
            const data = map.layers[l].data,
                  width = map.layers[l].width,
                  height = map.layers[l].height;
            
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
    checkColliders: function(map)
    {
         const offset_width = -map.width*map.tilewidth/2,
               offset_height = -map.height*map.tileheight/2;
        
         for (let l = 0; l < map.layers.length; l++) {
            const data = map.layers[l].data,
                  width = map.layers[l].width,
                  height = map.layers[l].height;
             
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
             }
         }
    },
    checkCollider: function(tile_coordinates, tileset, id)
    {
        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].id+1 == id) {
                const objects = tileset.tiles[i].objectgroup.objects;
                
                if (objects === undefined)
                    continue;
                
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
    }
};