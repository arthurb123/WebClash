const tiled = {
    loading: false,
    current: '',
    animations: [],
    lightHotspots: [],
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

        //Clear existing map light hotspots

        this.lightHotspots = [];

        //Setup map offset

        this.offset = {
            width: -map.width*map.tilewidth/2,
            height: -map.height*map.tileheight/2
        };

        //Cache all tilesets

        cache.cacheTilesets(map.tilesets, function() {
            //Check all tile objects (colliders, properties, animations, etc.)

            tiled.checkObjects(map);

            //Declare necessary variable(s)

            let actualLayer = 0;

            //Update progress

            cache.progress.update('Building map - 0%');

            //Cache and setup rendering of all layers

            for (let l = 0; l < map.layers.length; l++) {
                //Update progress

                cache.progress.update('Building map - ' + (l/(map.layers.length-1)*100).toFixed(0) + '%');

                //Check if visible

                if (!map.layers[l].visible)
                    continue;

                //Check if tilelayer

                if (map.layers[l].type !== 'tilelayer')
                    continue;

                //Create offset width and height

                let offset_width = tiled.offset.width,
                    offset_height = tiled.offset.height;

                if (map.layers[l].offsetx !== undefined)
                    offset_width += map.layers[l].offsetx;
                if (map.layers[l].offsety !== undefined)
                    offset_height += map.layers[l].offsety;

                //Prerender/cache layer for easier drawing

                const cachedLayer = tiled.cacheLayer(map, l);

                //Add drawing loop

                lx.OnLayerDraw(actualLayer, function(gfx) {
                    if (game.player === -1 ||
                        game.players[game.player] == undefined)
                        return;

                    //Calculate screen clip

                    let clip = tiled.calculateScreenClip(
                        cachedLayer.width,
                        cachedLayer.height,
                        offset_width,
                        offset_height
                    );

                    //Draw cached layer

                    gfx.drawImage(
                        cachedLayer,
                        clip.CX, clip.CY,
                        clip.CW, clip.CH,
                        clip.X, clip.Y,
                        clip.CW, clip.CH
                    );
                });

                //Increment actual layer

                actualLayer++;
            }

            //Cache the shadow map and setup the 
            //rendering process if the map demands so

            if (map.showDayNight || map.alwaysDark) {
                //Cache the shadow map of the map

                let shadowMap = tiled.cacheShadowMap(map);

                //Setup rendering process on the
                //highest layer

                lx.OnLayerDraw(actualLayer+1, function(gfx) {
                    if (game.gameTime.current == undefined)
                        return;

                    //Calculate the actual opacity
                    //of the shadow map

                    let opacity = 0,
                        maxOpacity = properties.nightOpacity;

                    if (map.alwaysDark) 
                        opacity = properties.darknessOpacity;
                    else 
                        if (game.gameTime.current <= game.gameTime.dayLength) 
                            opacity = maxOpacity * ((game.gameTime.current-game.gameTime.dayLength/2) / (game.gameTime.dayLength/2));
                        else {
                            let offsetTime = game.gameTime.current-game.gameTime.dayLength;

                            if (offsetTime >= game.gameTime.nightLength/2)
                                opacity = maxOpacity - maxOpacity * ((offsetTime-game.gameTime.nightLength/2) / (game.gameTime.nightLength/2));
                            else
                                opacity = maxOpacity;
                        }

                    //Check if opacity is valid

                    if (opacity <= 0)
                        return;

                    //Calculate screen clip

                    let clip = tiled.calculateScreenClip(
                        shadowMap.width, 
                        shadowMap.height,
                        tiled.offset.width,
                        tiled.offset.height
                    );

                    //Render (clipped) shadow map

                    gfx.save();
                    gfx.globalAlpha = opacity;
                    gfx.drawImage(
                        shadowMap, 
                        clip.CX, clip.CY,
                        clip.CW, clip.CH,
                        clip.X, clip.Y,
                        clip.CW, clip.CH
                    );
                    gfx.restore();
                });
            }

            //Add world boundary colliders

            tiled.createWorldBoundaries(map);

            //Set if map is pvp

            tiled.pvp = map.pvp;

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
    calculateScreenClip: function(mapWidth, mapHeight, offsetWidth, offsetHeight) 
    {
        if (game.player === -1 ||
            game.players[game.player] == undefined)
            return;

        //Calculate clip position

        let size = lx.GetDimensions();

        let clip = {
            X: Math.round(game.players[game.player].POS.X+game.players[game.player].SIZE.W/2-offsetWidth-size.width/2),
            Y: Math.round(game.players[game.player].POS.Y+game.players[game.player].SIZE.H/2-offsetHeight-size.height/2)
        };

        //Declare size and pos

        let pos = { X: 0, Y: 0 };

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

        if (clip.X+size.width > mapWidth)
            size.width = mapWidth - clip.X;
        if (clip.Y+size.height > mapHeight)
            size.height = mapHeight - clip.Y;

        return {
            X: pos.X,
            Y: pos.Y,
            CX: clip.X,
            CY: clip.Y,
            CW: size.width,
            CH: size.height
        };
    },
    cacheLayer: function(map, layer_id)
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

                if (actual == 0)
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
                        tp.x+this.offset.width,
                        tp.y+this.offset.height,
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

             const width = map.layers[l].width;

             //Tile layer

             if (map.layers[l].type === 'tilelayer') {
                 const data = map.layers[l].data;

                 for (let t = 0; t < data.length; t++)
                 {
                    //Skip empty tiles

                    if (data[t] == 0)
                        continue;

                    //Get corresponding tileset

                    let tileset,
                        actual = data[t];

                    for (let i = 0; i < map.tilesets.length; i++) {
                        if (data[t] >= map.tilesets[i].firstgid) {
                            tileset = map.tilesets[i];

                            if (i > 0)
                                actual = data[t] - map.tilesets[i].firstgid + 1;
                        } else
                            break;
                    }

                    //Check if tileset has unique tiles

                    if (tileset.tiles === undefined)
                        continue;

                    //Calculate tile coordinates

                    let tp = {
                        x: t % width * map.tilewidth + this.offset.width,
                        y: Math.floor(t / width) * map.tileheight + this.offset.height
                    };

                    //Check animation

                    this.checkAnimation(map, tileset, data[t], actual);

                    //Check collider

                    this.checkCollider(tp, tileset, data[t], actual);

                    //Check properties

                    this.checkProperties(tp, tileset, data[t], actual);
                 }
             }

             //Object layer

             if (map.layers[l].type === 'objectgroup') {
                 const data = map.layers[l].objects;

                 for (let o = 0; o < data.length; o++)
                 {
                    //Check if visible

                     if (!data[o].visible)
                         continue;

                    //Grab properties and
                    //setup callbacks array

                    const properties = map.layers[l].objects[o].properties,
                          callbacks = [];

                    //Check properties

                    if (properties != undefined) {
                        let isMapEvent = false;

                        //First check if the properties contain a 
                        //load map event, this affects property handling

                        for (let p = 0; p < properties.length; p++) {
                            if (properties[p].name === 'loadMap')
                            {
                                isMapEvent = true;

                                break;
                            }
                        }

                        for (let p = 0; p < properties.length; p++) {
                            //Skip map related events, as these 
                            //are handled by the server upon map change

                            if (properties[p].name === 'positionX' || properties[p].name === 'positionY')
                            if (isMapEvent)
                                continue;

                            //Handle property

                            let f = this.handleProperty(properties[p]);

                            if (f !== undefined)
                                callbacks.push(f);
                        }

                        //Handle design events/light hotspot events

                        this.handleDesign(
                            properties, 
                            data[o].x+this.offset.width, 
                            data[o].y+this.offset.height
                        );
                    }

                    //Check if collider should be created

                    if (data.point ||
                        data[o].width === 0 ||
                        data[o].height === 0)
                        continue;

                    //Create collider

                    let coll = new lx.Collider(
                        data[o].x+this.offset.width,
                        data[o].y+this.offset.height,
                        data[o].width,
                        data[o].height,
                        true
                    );

                    //Append callbacks to collider
                    //if necessary

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
    checkAnimation: function(map, tileset, id, actual)
    {
        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].id+1 === actual) {
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
    checkCollider: function(tile_position, tileset, id, actual)
    {
        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].id+1 == actual) {
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
    checkProperties: function(tile_position, tileset, id, actual)
    {
        //Check all tile properties

        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].id+1 == actual) {
                if (tileset.tiles[i].properties === undefined)
                    continue;

                const properties = tileset.tiles[i].properties,
                      callbacks = [];

                let isMapEvent = false;

                //First check if the properties contain a 
                //load map event, this affects property handling

                for (let p = 0; p < properties.length; p++) {
                    if (properties[p].name === 'loadMap')
                    {
                        isMapEvent = true;

                        break;
                    }
                }

                for (let p = 0; p < properties.length; p++) {
                    //Skip map related events, as these 
                    //are handled by the server upon map change

                    if (properties[p].name === 'positionX' || 
                        properties[p].name === 'positionY')
                        if (isMapEvent)
                            continue;

                    //Handle the property

                    let f = this.handleProperty(properties[p]);

                    //Add the property callback

                    if (f !== undefined)
                        callbacks.push(f);
                }

                //Add all generated callbacks
                //as a collider

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

                //Handle design events/light hotspot events

                this.handleDesign(
                    properties, 
                    tile_position.x, 
                    tile_position.y
                );
            }
        }
    },
    handleProperty: function(property)
    {
        if (property === undefined)
            return;

        switch (property.name)
        {
            //Callback related events

            case "loadMap":
                return function(go) {
                    if (go === game.players[game.player]) {
                        cache.progress.start('Loading map...');

                        tiled.loading = true;

                        channel.emit('CLIENT_REQUEST_MAP', property.value);
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
    handleDesign: function(properties, p_x, p_y)
    {
        //Light hotspot

        let lightHotspotID;

        //Other design variables

        //...

        //Check for design properties

        for (let p = 0; p < properties.length; p++) {
            let property = properties[p];

            switch (property.name) {
                case 'lightHotspot':
                    if (lightHotspotID == undefined)
                        lightHotspotID = this.addLightHotspot(
                            p_x, 
                            p_y
                        );
                    
                    this.lightHotspots[lightHotspotID].size = property.value;
                    break;
                case 'lightHotspotColor':
                    if (lightHotspotID == undefined)
                        lightHotspotID = this.addLightHotspot(
                            p_x, 
                            p_y
                        );
                    
                    this.lightHotspots[lightHotspotID].color = '#' + property.value.substr(3, property.value.length-3);
                    break;
            }
        }
    },
    createWorldBoundaries: function(map) {
        new lx.Collider(this.offset.width, this.offset.height-map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.Collider(this.offset.width-map.tilewidth, this.offset.height, map.tilewidth, map.height*map.tileheight, true);

        new lx.Collider(this.offset.width, this.offset.height+map.height*map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.Collider(this.offset.width+map.width*map.tilewidth, this.offset.height, map.tilewidth, map.height*map.tileheight, true);
    },
    cacheShadowMap: function(map) {
        //Get shading color based on map
        //shading type

        let color = properties.nightColor;

        if (map.alwaysDark)
            color = properties.darknessColor;

        let c = document.createElement('canvas');
        c.width = map.width*map.tilewidth;
        c.height = map.height*map.tileheight;

        let g = c.getContext('2d');

        //Overall shading

        g.fillStyle = color;
        g.globalCompositeOperation = 'source-over';
        g.fillRect(0, 0, c.width, c.height);

        //Blurred map hotspots

        g.globalCompositeOperation = 'destination-out';
        g.filter = 'blur(' + Math.ceil(map.tilewidth/3) + 'px)';

        for (let lhs = 0; lhs < this.lightHotspots.length; lhs++) {
            if (this.lightHotspots[lhs] == undefined)
                continue;

            //Actual light hotspot

            g.globalAlpha = 1;
            g.beginPath();
            g.arc(
                this.lightHotspots[lhs].x, 
                this.lightHotspots[lhs].y, 
                this.lightHotspots[lhs].size*map.tilewidth,
                0, 
                2 * Math.PI
            );
            g.closePath();
            g.fill();

            //Coloring, if specified

            if (this.lightHotspots[lhs].color != undefined) {
                g.globalAlpha = .5;
                g.globalCompositeOperation = 'source-over';
                g.fillStyle = this.lightHotspots[lhs].color;
                g.fill();
            }
        }

        //Return cached shadow canvas

        return c;
    },
    addLightHotspot: function(x, y) {
        let lhs = {
            x: x-this.offset.width,
            y: y-this.offset.height,
            size: 1
        };

        this.lightHotspots.push(lhs);

        return this.lightHotspots.length-1;
    }
};
