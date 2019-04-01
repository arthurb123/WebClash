const tiled = {
    loading: false,
    current: '',
    animations: [],
    convertAndLoadMap: function(map)
    {
        //Set loading

        this.loading = true;

        //Temporarily remove the Lynx2D controller target

        lx.CONTEXT.CONTROLLER.TARGET = undefined;

        //Start progress

        cache.progress.start('Loading map...');

        //Change map name

        this.current = map.name;

        //Set new tilewidth and tileheight

        this.tile = {
            width: map.tilewidth,
            height: map.tileheight
        };

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

        //Clear existing map animations

        for (let a = 0; a < this.animations.length; a++)
            this.animations[a].Hide();
        this.animations = [];

        //Cache all tilesets

        cache.cacheTilesets(map.tilesets, function() {
            //Check all tile objects (colliders, properties, animations, etc.)

            tiled.checkObjects(map);

            //Declare necessary variable(s)

            let actualLayer = 0;

            //Update progress

            cache.progress.update('Building map - 0%');

            for (let l = 0; l < map.layers.length; l++) {
                //Update progress

                cache.progress.update('Building map - ' + l/(map.layers.length-1)*100 + '%');

                //Check if visible

                if (!map.layers[l].visible)
                    continue;

                //Check if tilelayer

                if (map.layers[l].type !== 'tilelayer')
                    continue;

                const data = map.layers[l].data,
                      width = map.layers[l].width,
                      height = map.layers[l].height;

                //Create offset width and height

                let offset_width = -map.width*map.tilewidth/2,
                    offset_height = -map.height*map.tileheight/2;

                if (map.layers[l].offsetx !== undefined)
                    offset_width += map.layers[l].offsetx;
                if (map.layers[l].offsety !== undefined)
                    offset_height += map.layers[l].offsety;

                //Prerender/cache layer for easier drawing

                const cachedLayer = tiled.cacheLayer(map, l, offset_width, offset_height);

                //Add drawing loop

                lx.OnLayerDraw(actualLayer, function(gfx) {
                    if (game.player === -1 ||
                        game.players[game.player] == undefined)
                        return;

                    //Calculate clip position

                    let clip = {
                        X: Math.round(game.players[game.player].POS.X+game.players[game.player].SIZE.W/2-offset_width-lx.GetDimensions().width/2),
                        Y: Math.round(game.players[game.player].POS.Y+game.players[game.player].SIZE.H/2-offset_height-lx.GetDimensions().height/2)
                    };

                    //Declare size and pos

                    let size = lx.GetDimensions(),
                        pos = { X: 0, Y: 0 };

                    //Adjust clip to avoid an out-of-bounds clip
                    //Some browsers tend to handle an out-of-bounds clip poorly.

                    //Avoid negative X and Y clip

                    if (clip.X < 0) {
                        pos.X -= clip.X;
                        size.width += clip.X;

                        clip.X = 0;
                    }
                    if (clip.Y < 0) {
                        pos.Y -= clip.Y;
                        size.height += clip.Y;

                        clip.Y = 0;
                    }

                    //Avoid out-of-bounds size

                    if (pos.X == 0 && clip.X+size.width > cachedLayer.width)
                        size.width = cachedLayer.width - clip.X;
                    if (pos.Y == 0 && clip.Y+size.height > cachedLayer.height)
                        size.height = cachedLayer.height - clip.Y;

                    //Draw cached layer

                    gfx.drawImage(
                        cachedLayer,
                        clip.X, clip.Y,
                        size.width, size.height,
                        pos.X, pos.Y,
                        size.width, size.height
                    );
                });

                //Increment actual layer

                actualLayer++;
            }

            //Add world boundary colliders

            tiled.createWorldBoundaries(map);

            //Reset the Lynx2D controller target

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

            //Start BGM

            audio.playBGM(map.bgmSource);

            //Hide progress

            cache.progress.hide();

            //Set loading to false

            tiled.loading = false;
        });
    },
    cacheLayer: function(map, layer_id, offset_width, offset_height)
    {
        //Get layer

        const layer = map.layers[layer_id];

        //Create canvas according to layer size

        let c = document.createElement('canvas');
        c.width = layer.width * map.tilewidth;
        c.height = layer.height * map.tileheight;

        let g = c.getContext('2d');

        //Render all tiles to canvas

        for (let y = 0; y < layer.height; y++)
            for (let x = 0; x < layer.width; x++) {
                //Convert to tile

                let t = y * layer.width + x,
                    actual = layer.data[t];

                //Skip empty tiles

                if (layer.data[t] == 0)
                    continue;

                //Calculate tile position

                tp = {
                    x: t % layer.width * map.tilewidth,
                    y: Math.floor(t / layer.width) * map.tileheight
                };

                //If animated, add animation and continue

                if (map.animatedTiles[actual] != undefined) {
                    let animation = new lx.Animation(map.animatedTiles[actual].sprites);
                    animation.TIMER.FRAMES = map.animatedTiles[actual].frames;

                    animation.Show(
                        layer_id,
                        tp.x+offset_width,
                        tp.y+offset_height,
                        map.animatedTiles[actual].size.w,
                        map.animatedTiles[actual].size.h
                    );

                    this.animations.push(animation);

                    continue;
                };

                //Get corresponding tile sprite

                let sprite;

                for (let i = 0; i < map.tilesets.length; i++)
                    if (layer.data[t] >= map.tilesets[i].firstgid) {
                        sprite = cache.getTileset(map.tilesets[i].image);

                        if (i != 0)
                            actual = layer.data[t] - map.tilesets[i].firstgid + 1;
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
                };

                //Tile clip coordinates artefact prevention

                if (tc.x == -map.tilewidth)
                    tc.x = sprite.Size().W - map.tilewidth;

                //Draw tile

                g.drawImage(
                    sprite.IMG,
                    tc.x, tc.y, map.tilewidth, map.tileheight,
                    tp.x, tp.y, map.tilewidth, map.tileheight
                );
            }

        //Return canvas

        return c;
    },
    checkObjects: function(map)
    {
        //Create animated tiles object

        map.animatedTiles = {};

        //Check all layers

        for (let l = 0; l < map.layers.length; l++) {
             //Check if layer is visible

             if (!map.layers[l].visible)
                 continue;

             const width = map.layers[l].width,
                   height = map.layers[l].height;

              let offset_width = -map.width*map.tilewidth/2,
                  offset_height = -map.height*map.tileheight/2;

             if (map.layers[l].offsetx !== undefined)
                offset_width += map.layers[l].offsetx;
             if (map.layers[l].offsety !== undefined)
                offset_height += map.layers[l].offsety;

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

                    //Check animation

                    this.checkAnimation(map, tileset, data[t]);

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
                                    if (tiled.loading)
                                        return;

                                    cb(go);
                                }
                            });
                        };

                        coll.Solid(false);
                    }
                 }
             }
        }
    },
    checkAnimation: function(map, tileset, id)
    {
        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].id+1 == id) {
                //Make sure animation tile(s) is/are available

                if (tileset.tiles[i].animation === undefined ||
                    map.animatedTiles[id] != undefined)
                    continue;

                let sprites = [],
                    frames = [];

                //Add all animation frames

                for (let f = 0; f < tileset.tiles[i].animation.length; f++) {
                    let frame = tileset.tiles[i].animation[f];
                    frame.tileid++;

                    //Grab tileset sprite

                    let sprite = cache.getTileset(tileset.image);

                    //Check if sprite has a tilewidth specified

                    if (sprite._tilewidth == undefined ||
                        sprite._tilewidth == 0) {
                        sprite._tilewidth = sprite.Size().W/map.tilewidth;
                    }

                    //Calc tile coordinates

                    let tc = {
                        x: (frame.tileid % sprite._tilewidth - 1) * map.tilewidth,
                        y: (Math.ceil(frame.tileid / sprite._tilewidth) -1) * map.tileheight
                    };

                    //Tile clip coordinates artefact prevention

                    if (tc.x == -map.tilewidth)
                        tc.x = sprite.Size().W - map.tilewidth;

                    //Add sprites and frames to end result

                    sprites.push(new lx.Sprite(sprite.IMG.src, tc.x, tc.y, tileset.tilewidth, tileset.tileheight));
                    frames.push(frame.duration * 0.06);
                };

                //Add to the animated tiles available
                //on the map

                map.animatedTiles[id] = {
                    sprites: sprites,
                    frames: frames,
                    size: {
                        w: tileset.tilewidth,
                        h: tileset.tileheight
                    }
                };
            }
        }
    },
    checkCollider: function(tile_position, tileset, id)
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
                            tile_position.x + objects[c].x,
                            tile_position.y + objects[c].y,
                            objects[c].width,
                            objects[c].height,
                            true
                        );
            }
        }
    },
    checkProperties: function(tile_position, tileset, id)
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
                            tile_position.x,
                            tile_position.y,
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
                        cache.progress.start('Loading map...');

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
    createWorldBoundaries: function(map) {
        let offset_width = -map.width*map.tilewidth/2,
            offset_height = -map.height*map.tileheight/2;

        new lx.Collider(offset_width, offset_height-map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.Collider(offset_width-map.tilewidth, offset_height, map.tilewidth, map.height*map.tileheight, true);

        new lx.Collider(offset_width, offset_height+map.height*map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.Collider(offset_width+map.width*map.tilewidth, offset_height, map.tilewidth, map.height*map.tileheight, true);
    }
};
