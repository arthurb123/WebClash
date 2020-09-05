const tiled = {
    loading: false,
    current: '',
    animations: [],
    lightHotspots: [],
    dialogs: [],

    convertAndLoadMap: function(data)
    {
        //Shorten map reference

        const map = data.map;
        map._properties = data.properties;
        map._colliders = data.colliders;
        map._skipTiles = data.skipTiles;

        //Set loading

        this.loading = true;

        //Let the player lose focus

        player.loseFocus();

        //Start progress

        manager.progress.start('Building map...');

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

        //Reset loot box

        ui.loot.reset();

        //Clear the OnLayerDraw events

        lx.ResetLayerDraw();

        //Clear existing map animations

        for (let a = 0; a < this.animations.length; a++)
            this.animations[a].Hide();

        this.animations = [];

        //Clear existing map dialogs

        for (let d = 0; d < this.dialogs.length; d++)
            this.dialogs[d].Hide();

        this.dialogs = [];

        //Clear existing map light hotspots

        this.lightHotspots = [];

        //Setup map offset and size

        this.size = {
            width: map.width*map.tilewidth,
            height: map.height*map.tileheight
        };
        this.offset = {
            width: -this.size.width/2,
            height: -this.size.height/2
        };

        //Handle properties

        tiled.handleProperties(map);

        //Handle colliders

        tiled.handleColliders(map);

        //Cache all tilesets

        manager.cacheTilesets(map.tilesets, function() {
            //Find animations

            tiled.findAnimations(map);

            //Update progress

            manager.progress.update('Building map - 0%');

            //Create base and hovering cached canvases

            let baseCanvas = new lx.Canvas(
                map.width * map.tilewidth, 
                map.height * map.tileheight
            );
            let hoverCanvas = new lx.Canvas(
                map.width * map.tilewidth, 
                map.height * map.tileheight
            );

            //Cache and setup rendering of all layers

            for (let l = 0; l < map.mapLayers.length; l++) {
                //Update progress

                manager.progress.update('Building map - ' + (l/(map.layers.length-1)*100).toFixed(0) + '%');

                //Grab the layer

                const layer = tiled.getLayerWithName(map, map.mapLayers[l].name);

                //Check if layer exists and is visible

                if (layer == undefined || !layer.visible)
                    continue;

                //Create offset width and height

                let offset_width = 0,
                    offset_height = 0;

                if (layer.offsetx !== undefined)
                    offset_width += layer.offsetx;
                if (layer.offsety !== undefined)
                    offset_height += layer.offsety;

                //Prerender/manager layer for easier drawing

                const cachedLayer = tiled.cacheLayer(map, l, offset_width, offset_height),
                      cachedLayerSprite = new lx.Sprite(cachedLayer);

                //Draw the cached layer to either the base
                //or hover canvas, based on it's hover setting

                if (!map.mapLayers[l].hover)
                    baseCanvas.DrawSprite(cachedLayerSprite, offset_width, offset_height);
                else
                    hoverCanvas.DrawSprite(cachedLayerSprite, offset_width, offset_height);
            }

            //Create the sprites and drawing functions 
            //for the base and hover canvases

            let baseCanvasSprite = new lx.Sprite(baseCanvas),
                hoverCanvasSprite = new lx.Sprite(hoverCanvas);

            lx.OnLayerDraw(0, function() {
                if (game.player === -1 ||
                    game.players[game.player] == undefined)
                    return;

                //Draw cached layer sprite

                lx.DrawSprite(
                    baseCanvasSprite,
                    tiled.offset.width,
                    tiled.offset.height
                );
            });

            lx.OnLayerDraw(3, function() {
                if (game.player === -1 ||
                    game.players[game.player] == undefined)
                    return;

                //Draw cached layer sprite

                lx.DrawSprite(
                    hoverCanvasSprite,
                    tiled.offset.width,
                    tiled.offset.height
                );
            });

            //Cache the shadow map and setup the 
            //rendering process if the map demands so

            if (map.showDayNight || map.alwaysDark) {
                //Cache the shadow map of the map

                let shadowMap = tiled.cacheShadowMap(map),
                    shadowMapSprite = new lx.Sprite(shadowMap);

                //Setup rendering process on the
                //highest layer

                lx.OnLayerDraw(4, function() {
                    if (game.gameTime.current == undefined)
                        return;

                    //Calculate the actual opacity
                    //of the shadow map using the
                    //game time

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

                    shadowMapSprite.Opacity(opacity);

                    lx.DrawSprite(
                        shadowMapSprite,
                        tiled.offset.width,
                        tiled.offset.height
                    );
                });
            }

            //Add world boundary colliders

            tiled.createWorldBoundaries(map);

            //Set if map is pvp

            tiled.pvp = map.pvp;

            //Restore player focus

            player.restoreFocus();

            //Start BGM

            audio.playBGM(map.bgmSource);

            //Set new progress

            manager.progress.start('Joining map..');

            //Send map content request

            channel.emit('CLIENT_REQUEST_MAP_CONTENT');
        });
    },

    getLayerWithName: function(map, layer_name) {
        //Cycle through all map layers until
        //the corresponding map was found

        for (let l = 0; l < map.layers.length; l++) {
            if (map.layers[l].name === layer_name)
                return map.layers[l];
        }
    },
    getMapTileRectangles: function(map, id)
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
    },
    getMapTileObjectRectangles: function(map, id, object) 
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
    },

    cacheLayer: function(map, layer_id, offset_width, offset_height)
    {
        //Get layer

        const layer = map.layers[layer_id];

        //Create canvas according to layer size

        let c = new lx.Canvas(
            layer.width * map.tilewidth, 
            layer.height * map.tileheight
        );

        //Render all tiles to canvas

        for (let y = 0; y < layer.height; y++)
            for (let x = 0; x < layer.width; x++) {
                //Convert to tile

                let t = y * layer.width + x,
                    actual = layer.data[t];

                //Skip empty tiles

                if (actual == 0)
                    continue;

                //Check if tile should be skipped

                if (map._skipTiles[actual-1])
                    continue;

                //Calculate tile position

                let tp = {
                    x: t % layer.width * map.tilewidth,
                    y: Math.floor(t / layer.width) * map.tileheight
                };

                //If animated, add animation and continue

                if (map._animatedTiles[actual] != undefined) {
                    let animation = new lx.Animation(map._animatedTiles[actual].sprites);
                    animation.TIMER.FRAMES = map._animatedTiles[actual].frames;

                    //Tiled uses a height offset for animations bigger
                    //than the tile height, this needs to be compensated for

                    let heightOffset = -(map._animatedTiles[actual].size.h-map.tileheight);

                    //Set animation properties and show

                    let layer = map.mapLayers[layer_id].hover ? 4 : layer_id;
                    animation
                        .Position(
                            tp.x+this.offset.width+offset_width,
                            tp.y+this.offset.height+offset_height+heightOffset
                        )
                        .Size(
                            map._animatedTiles[actual].size.w,
                            map._animatedTiles[actual].size.h
                        )
                        .Show(layer);

                    //Add to animations

                    this.animations.push(animation);

                    continue;
                };

                //Get corresponding tileset and tileset sprite

                let sprite, tileset;

                for (let i = 0; i < map.tilesets.length; i++)
                    if (layer.data[t] >= map.tilesets[i].firstgid) {
                        tileset = map.tilesets[i];
                        sprite = manager.getTileset(tileset.image);

                        if (i != 0)
                            actual = layer.data[t] - tileset.firstgid + 1;
                    }
                    else
                        break;

                //Check if sprite is valid

                if (sprite == undefined)
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

                c.DrawSprite(
                    sprite.Clip(tc.x, tc.y, map.tilewidth, map.tileheight),
                    tp.x, tp.y, map.tilewidth, map.tileheight
                );
            }

        //Return canvas

        return c;
    },
    cacheShadowMap: function(map) {
        //Get shading color based on map
        //shading type

        let color = properties.nightColor;

        if (map.alwaysDark)
            color = properties.darknessColor;

        let c = new lx.Canvas(
            map.width*map.tilewidth,
            map.height*map.tileheight
        );

        //Draw shadow map

        c.Draw(function(g) {
            //Overall shading

            g.fillStyle = color;
            g.globalCompositeOperation = 'source-over';
            g.fillRect(0, 0, c.Size().W, c.Size().H);

            //First create cutouts for all light
            //hotspots

            g.globalCompositeOperation = 'destination-out';
            for (let lhs = 0; lhs < tiled.lightHotspots.length; lhs++) {
                if (tiled.lightHotspots[lhs] == undefined)
                    continue;

                //Save

                g.save();

                //Create hotspot path

                g.beginPath();
                g.arc(
                    tiled.lightHotspots[lhs].x, 
                    tiled.lightHotspots[lhs].y, 
                    tiled.lightHotspots[lhs].size*map.tilewidth,
                    0, 
                    2 * Math.PI
                );
                g.closePath();
                
                //Fill
    
                g.fill();

                //Restore

                g.restore();
            }

            //Draw coloring for all applicable
            //light hotspots

            g.globalCompositeOperation = 'source-over';
            for (let lhs = 0; lhs < tiled.lightHotspots.length; lhs++) {
                if (tiled.lightHotspots[lhs] == undefined ||
                    tiled.lightHotspots[lhs].color == undefined)
                    continue;

                //Save

                g.save();

                //Change opacity and
                //set fill style

                g.globalAlpha = .5;
                g.fillStyle = tiled.lightHotspots[lhs].color;

                //Create hotspot path

                g.beginPath();
                g.arc(
                    tiled.lightHotspots[lhs].x, 
                    tiled.lightHotspots[lhs].y, 
                    tiled.lightHotspots[lhs].size*map.tilewidth,
                    0, 
                    2 * Math.PI
                );
                g.closePath();
                
                //Fill
    
                g.fill();

                //Restore

                g.restore();
            }
        });

        //Blur canvas

        stackBlurCanvasRGBA(
            c.CANVAS,
            24
        );

        //Return cached shadow canvas

        return c;
    },
    
    findAnimations: function(map) {
        //Create animated tiles object

        map._animatedTiles = {};

        //Go over all tilesets

        for (let l = 0; l < map.layers.length; l++) {
            //Check if layer is visible

            if (!map.layers[l].visible)
                continue;

            //Check if a tile layer

            if (map.layers[l].type === 'tilelayer') {
                const data = map.layers[l].data;

                for (let t = 0; t < data.length; t++)
                {
                   //Skip empty tiles

                   if (data[t] === 0)
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

                   //Check animation

                   this.checkAnimation(
                       map, 
                       tileset,
                       data[t], 
                       actual, 
                       map.layers[l].opacity
                    );
                }
            }
        }
    },
    checkAnimation: function(map, tileset, id, actual, opacity)
    {
        for (let i = 0; i < tileset.tiles.length; i++) {
            if (tileset.tiles[i].id+1 === actual) {
                //Make sure animation tile(s) is/are available

                if (tileset.tiles[i].animation === undefined ||
                    map._animatedTiles[id] != undefined)
                    continue;

                //Make sure the tile does not have to be skipped

                if (map._skipTiles[actual-1])
                    continue;

                //Setup containers

                let sprites = [],
                    frames = [];

                //Add all animation frames

                for (let f = 0; f < tileset.tiles[i].animation.length; f++) {
                    let frame = tileset.tiles[i].animation[f];
                    frame.tileid++;

                    //Grab tileset sprite

                    let sprite = manager.getTileset(tileset.image);

                    //Check if sprite has a tilewidth specified

                    if (sprite._tilewidth == undefined ||
                        sprite._tilewidth == 0) {
                        sprite._tilewidth = sprite.Size().W/tileset.tilewidth;
                    }

                    //Calc tile coordinates

                    let tc = {
                        x: (frame.tileid % sprite._tilewidth - 1) * tileset.tilewidth,
                        y: (Math.ceil(frame.tileid / sprite._tilewidth) -1) * tileset.tileheight
                    };

                    //Tile clip coordinates artefact prevention

                    if (tc.x < 0)
                        tc.x = sprite.Size().W + tc.x;
                    if (tc.y < 0)
                        tc.y = sprite.Size().H + tc.y;

                    //Add sprites and frames to end result

                    let actualSprite = new lx.Sprite(sprite.IMG.src, tc.x, tc.y, tileset.tilewidth, tileset.tileheight);
                    actualSprite.Opacity((opacity != undefined ? opacity : 1));

                    sprites.push(actualSprite);
                    frames.push(frame.duration * 0.06);
                };

                //Add to the animated tiles available
                //on the map

                map._animatedTiles[id] = {
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

    handleProperties: function(map) {
        //Handle event properties

        this.handleEventProperties(map);

        //Handle design properties

        this.handleDesignProperties(map);
    },
    handleColliders: function(map) {
        //Go over all colliders and
        //create box colliders

        for (let c = 0; c < map._colliders.length; c++) {
            let coll = map._colliders[c];

            new lx.BoxCollider(
                coll.x,
                coll.y,
                coll.w,
                coll.h,
                true
            );
        }
    },

    handleEventProperties: function(map)
    {
        if (map._properties === undefined)
            return;

        //Go over all map properties

        for (let i = 0; i < map._properties.length; i++) {
            let properties = map._properties[i].properties;

            let hasLoadMapEvent = false;
            let callbacks = [];

            //First check if the properties contain a 
            //load map event, this affects property handling

            for (let p = 0; p < properties.length; p++)
                if (properties[p].name === 'loadMap')
                {
                    hasLoadMapEvent = true;

                    break;
                }

            //Go over all properties and handle
            //event properties accordingly

            for (let p = 0; p < properties.length; p++) {
                //Skip positioning related events if there
                //already is a load map event present, as
                //positioning events are handled by the 
                //server upon map change

                if (properties[p].name === 'positionX' || 
                    properties[p].name === 'positionY')
                    if (hasLoadMapEvent)
                        continue;

                //Generate a event property callback
                //for the property

                let cb = this.generateEventPropertyCallback(properties[p]);

                //Add the property callback

                if (cb != undefined)
                    callbacks.push(cb);
            }

            //Add all generated callbacks as
            //as a collider for all rectangles, 
            //if there are valid event callbacks 
            //available

            if (callbacks.length === 0)
                continue;

            //Grab or calculate the rectangles based
            //on the presence of a tile and object
            //identifier

            let rectangles = map._properties[i].rectangles;

            if (map._properties[i].tile   != undefined &&
                map._properties[i].object == undefined)
            {
                rectangles = this.getMapTileRectangles(
                    map, 
                    map._properties[i].tile
                );
            }
            else if (map._properties[i].tile   != undefined &&
                     map._properties[i].object != undefined)
            {
                rectangles = this.getMapTileObjectRectangles(
                    map,
                    map._properties[i].tile,
                    map._properties[i].object
                );
            }

            for (let r = 0; r < rectangles.length; r++) {
                let rect = rectangles[r];

                new lx.BoxCollider(
                    rect.x,
                    rect.y,
                    rect.w,
                    rect.h,
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
            }
        }
    },
    generateEventPropertyCallback: function(property) {
        switch (property.name)
        {
            //Load map event

            case "loadMap":
                return function(go) {
                    if (go === game.players[game.player]) {
                        if (!tiled.loading) {
                            //Set tiled loading to true

                            tiled.loading = true;

                            //Start manager progress

                            manager.progress.start('Loading map...');

                            //Emit request map package

                            channel.emit('CLIENT_REQUEST_MAP', property.value);
                        }
                    }
                };

            //Positioning events

            case "positionX":
            case "positionY":
                return function(go) {
                    if (go === game.players[game.player])
                        player.propertyInteraction.interact();
                };
        };
    },

    handleDesignProperties: function(map)
    {
        //Go over all map properties

        for (let i = 0; i < map._properties.length; i++) {
            let properties = map._properties[i].properties;

            //Grab or calculate the rectangles based
            //on the presence of a tile and object
            //identifier

            let rectangles = map._properties[i].rectangles;

            if (map._properties[i].tile   != undefined &&
                map._properties[i].object == undefined)
            {
                rectangles = this.getMapTileRectangles(
                    map, 
                    map._properties[i].tile
                );
            }
            else if (map._properties[i].tile   != undefined &&
                     map._properties[i].object != undefined)
            {
                rectangles = this.getMapTileObjectRectangles(
                    map,
                    map._properties[i].tile,
                    map._properties[i].object
                );
            }

            //Check for design properties for
            //all rectangles

            for (let r = 0; r < rectangles.length; r++) {
                let rect = rectangles[r];

                //Design variables

                let lightHotspotID;

                //Check for design properties

                for (let p = 0; p < properties.length; p++) {
                    let property = properties[p];

                    switch (property.name) {
                        //Light hotspots and coloring

                        case 'lightHotspot':
                            if (lightHotspotID == undefined)
                                lightHotspotID = this.addLightHotspot(
                                    rect.x+rect.w/2, 
                                    rect.y+rect.h/2
                                );
                            
                            this.lightHotspots[lightHotspotID].size = property.value;
                            break;
                        case 'lightHotspotColor':
                            if (lightHotspotID == undefined)
                                lightHotspotID = this.addLightHotspot(
                                    rect.x+rect.w/2,
                                    rect.y+rect.h/2
                                );
                            
                            this.lightHotspots[lightHotspotID].color = '#' + property.value.substr(3, property.value.length-3);
                            break;

                        //Map dialog

                        case 'mapDialogue':
                            //Create dialog GO

                            let dialog = new lx.GameObject(
                                undefined,
                                rect.x, 
                                rect.y,
                                rect.w,
                                rect.h
                            ).Show(3);

                            //Give dialog texture

                            game.giveDialogTexture(dialog, function() {
                                //Request dialog

                                channel.emit('CLIENT_REQUEST_MAP_DIALOG', property.value);
                            });

                            //Add to dialogs

                            this.dialogs.push(dialog);

                            break;
                    }
                }
            }
        }
    },
    addLightHotspot: function(x, y) {
        let lhs = {
            x: x-this.offset.width,
            y: y-this.offset.height,
            size: 1
        };

        this.lightHotspots.push(lhs);

        return this.lightHotspots.length-1;
    },

    createWorldBoundaries: function(map) {
        new lx.BoxCollider(this.offset.width, this.offset.height-map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.BoxCollider(this.offset.width-map.tilewidth, this.offset.height, map.tilewidth, map.height*map.tileheight, true);

        new lx.BoxCollider(this.offset.width, this.offset.height+map.height*map.tileheight, map.width*map.tilewidth, map.tileheight, true);
        new lx.BoxCollider(this.offset.width+map.width*map.tilewidth, this.offset.height, map.tilewidth, map.height*map.tileheight, true);
    }
};
