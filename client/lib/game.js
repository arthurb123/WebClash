const game = {
    player: -1,
    players: [],
    npcs: [],
    items: [],
    tilesets: [],
    sprites: [],
    isMobile: false,
    
    getPlayerIndex: function(name) 
    {
        //Grab the player index by checking for the player name
        
        for (let i = 0; i < this.players.length; i++)
            if (this.players[i].name == name) return i;
        
        return -1;
    },
    instantiatePlayer: function(name) 
    {
        //Instantiate Lynx2D GameObject for player
        
        player.instantiate(name);
        
        this.player = this.players.length-1;
    },
    instantiateOther: function(name) 
    {
        //Instantiate Lynx2D GameObject for other player
        
        let go = new lx.GameObject(undefined, 0, 0, 0, 0)
            .Loops(function() {
                animation.animateMoving(go);
                
                if (go._nameplate.Position().X == 0 &&
                    go._nameplate.Position().Y == 0)
                    go._nameplate.Position(go.Size().W/2, -Math.floor(go.Size().H/5));
                
                if (go._level !== undefined)
                    go._nameplate.Text('lvl ' + go._level + ' - ' + go.name);
            })
            .Draws(function() {
                for (let i = 0; i < go._equipment.length; i++)
                {
                    if (go._equipment[i] === undefined)
                        continue;
                    
                    go._equipment[i].CLIP = go.SPRITE.CLIP;
                    
                    lx.DrawSprite(go._equipment[i], go.Position().X, go.Position().Y, go.Size().W, go.Size().H)
                }
            });
        
        go.name = name;
        go._moving = false;
        go._direction = 0;
        go._equipment = {};
        
        go._nameplate = new lx.UIText(name, 0, 0, 14)
            .Alignment('center')
            .Follows(go)
            .Show();
        
        go._nameplate.SHADOW = true;
        
        this.players.push(go.Show(3));  
    },
    setPlayerHealth: function(id, health) 
    {
        if (this.players[id]._health !== undefined) {
            let delta = -(this.players[id]._health.cur-health.cur);
            
            this.players[id]._health.cur = health.cur;
        
            //If player set UI health
                
            if (this.player == id)
                ui.status.setHealth(health.cur, health.max);
            
            //Check if max health has changed
            
            if (health.max !== this.players[id]._health.max) {
                this.players[id]._health.max = health.max;
                
                return;
            }
            
            if (delta == 0) {
                //Miss floaty
                
                ui.floaties.missFloaty(this.players[id], delta);
                
                return;
            }
            else if (delta > 0) {
                //Heal floaty
                
                ui.floaties.healFloaty(this.players[id], delta);
                
                return;
            }
            
            //Damage floaty
            
            ui.floaties.damageFloaty(this.players[id], delta);
            
            //Blood particles
            
            let count = -delta;
            if (count > 10)
                count = 10;
            
            this.createBlood(this.players[id], count);
        }
        else {
            this.players[id]._health = health;
                 
            //If player set UI health
                
            if (this.player == id)
                ui.status.setHealth(health.cur, health.max);
        }
    },
    setPlayerMana: function(id, mana) 
    {
        this.players[id]._mana = mana;

        //If player set UI mana

        if (this.player == id)
            ui.status.setMana(mana.cur, mana.max);
    },
    setPlayerEquipment: function(id, equipment)
    {
        let result = [];
        
        if (equipment['torso'] !== undefined)
            result.push(new lx.Sprite(equipment['torso']));
        if (equipment['hands'] !== undefined)
            result.push(new lx.Sprite(equipment['hands']));
        if (equipment['head'] !== undefined)
            result.push(new lx.Sprite(equipment['head']));
        if (equipment['feet'] !== undefined)
            result.push(new lx.Sprite(equipment['feet']));
        if (equipment['legs'] !== undefined)
            result.push(new lx.Sprite(equipment['legs']));
        if (equipment['offhand'] !== undefined)
            result.push(new lx.Sprite(equipment['offhand']));
        if (equipment['main'] !== undefined)
            result.push(new lx.Sprite(equipment['main']));
        
        this.players[id]._equipment = result;
    },
    setPlayerStats: function(id, stats) 
    {
        this.players[id]._stats = stats;
        
        if (id == game.player)
            ui.status.setExperience(this.players[id]._stats.exp, this.players[id]._expTarget);
    },
    setPlayerLevel: function(id, level)
    {
        let oldLevel = game.players[id]._level;
        game.players[id]._level = level; 
        
        if (id == game.player &&
            oldLevel != undefined &&
            level != oldLevel) {
            player.requestExpTarget();
            
            ui.inventory.reload();
            
            ui.chat.addMessage('You are now level ' + level + '!');
        }
    },
    removePlayer: function(id) 
    {
        //Check if valid
        
        if (id === undefined || this.players[id] == undefined)
            return;
        
        //Hide target GameObject
        
        this.players[id]._nameplate.Hide();
        this.players[id].Hide();
        
        //Get player name
        
        let name = game.players[game.player].name;
        
        //Remove target
        
        this.players.splice(id, 1);
        
        //Reset player ID
        
        this.player = this.getPlayerIndex(name);
    },
    resetPlayers: function() 
    {
        //Cycle through all online players and
        //remove all, except for the player itself
        
        for (let i = this.players.length-1; i >= 0; i--)
            if (i !== this.player) 
                this.removePlayer(i);
    },
    resetPlayer: function() 
    {
        //Check if the player exists
        
        if (this.player == -1)
            return;
        
        //Reset movement
        
        this.players[this.player].Movement(0, 0);
    },
    
    instantiateNPC: function(id, name) 
    {
        //Instantiate Lynx2D GameObject for NPC
        
        let go = new lx.GameObject(undefined, 0, 0, 0, 0)
            .Loops(function() {
                animation.animateMoving(this);
                
                if (this._nameplate.Position().X == 0 &&
                    this._nameplate.Position().Y == 0)
                    this._nameplate.Position(this.Size().W/2, -Math.floor(this.Size().H/5));
                
                if (this._type === 'friendly') 
                    this._nameplate.Color('black');
                else if (this._type === 'hostile')
                    this._nameplate.Color('#FF4242');
                
                if (this._stats !== undefined)
                    this._nameplate.Text('lvl ' + this._stats.level + ' - ' + this.name);
                
                if (this._health !== undefined)
                {    
                    if (this._healthbar === undefined) {
                        this._healthbarBack = new lx.UITexture('black', 0, -36, this.SIZE.W, 8).Follows(go);
                        this._healthbar = new lx.UITexture('#FF4242', 0, -36, this._health.cur/this._health.max*this.SIZE.W, 8).Follows(go);
                    } else {
                        this._healthbar.SIZE.W = this._health.cur/this._health.max*this.SIZE.W;
                    
                        if (this._health.cur == this._health.max)
                        {
                            this._healthbarBack.Hide();
                            this._healthbar.Hide();
                        } 
                        else 
                        {
                            this._healthbarBack.Show();
                            this._healthbar.Show();
                        }
                    }
                }
            });
        
        go.name = name;
        
        go._moving = false;
        go._direction = 0;
        
        go._nameplate = new lx.UIText(name, 0, 0, 14)
            .Alignment('center')
            .Follows(go)
            .Show();
        
        go._nameplate.SHADOW = true;
        
        this.npcs[id] = go.Show(3);
    },
    setNPCType: function(id, type, hasDialog) 
    {
        //Set NPC type
        
        this.npcs[id]._type = type;
        
        if (type === 'friendly' &&
            hasDialog) 
        {
            //Check if mobile
            
            if (!this.isMobile) {
                
                //Add a mouse hover draw event to draw
                //the dialog option when in range

                this.npcs[id].OnHoverDraw(function(data) {

                    //Get position difference

                    let pos = game.players[game.player].POS;

                    let dx = Math.abs(pos.X-data.position.X),
                        dy = Math.abs(pos.Y-data.position.Y);

                    //Proximity distance in tiles

                    let proximity = 3;

                    //Check if in proximity

                    if (dx > tiled.tile.width*proximity ||
                        dy > tiled.tile.height*proximity)
                        return;

                    //Draw dialog sprite

                    let sprite = game.getSprite('res/ui/dialog.png');

                    lx.DrawSprite(
                        sprite,
                        data.position.X+data.size.W/2,
                        data.position.Y-sprite.Size().H/2
                    );
                });
            } else {
                
                //Add NPC specific draws that checks if the dialog
                //button should be displayed
                
                this.npcs[id].Draws(function(data) {
                    //Get position difference

                    let pos = game.players[game.player].POS;

                    let dx = Math.abs(pos.X-data.position.X),
                        dy = Math.abs(pos.Y-data.position.Y);

                    //Proximity distance in tiles

                    let proximity = 3;

                    //Check if in proximity

                    if (dx > tiled.tile.width*proximity ||
                        dy > tiled.tile.height*proximity)
                        return;

                    //Draw dialog sprite

                    let sprite = game.getSprite('res/ui/dialog.png');

                    lx.DrawSprite(
                        sprite,
                        data.position.X+data.size.W/2,
                        data.position.Y-sprite.Size().H/2
                    );
                });
            }
            
            //Give NPC the possibility to engage in dialog
            //through a click event
            
            this.npcs[id].OnMouse(0, function(data) {
                if (data.state == 0)
                     return;
                
                //Stop mouse
                
                lx.StopMouse(0);
                
                //Request dialog
                
                socket.emit('CLIENT_REQUEST_DIALOG', id, function(data) {
                    //Check if data is valid

                    if (data == undefined ||
                        !data)
                        return;

                    //Start dialog

                    ui.dialog.startDialog(id, game.npcs[id].name, data);
                });
            }); 
            
        }
    },
    setNPCHealth: function(id, health) 
    {
        if (this.npcs[id] != undefined &&
            this.npcs[id]._health !== undefined)
        {
            let delta = -(this.npcs[id]._health.cur-health.cur);
            
            this.npcs[id]._health = health;
            
            if (delta > 0) {
                //Heal floaty
                
                ui.floaties.healFloaty(this.npcs[id], delta);
                
                return;
            }
            
            //Damage floaty
            
            ui.floaties.damageFloaty(this.npcs[id], delta);
            
            //Check if valid
            
            if(this.npcs[id] == undefined)
                return;
            
            //Blood particles
            
            let count = -delta;
            if (count > 10)
                count = 10;
            
            this.createBlood(this.npcs[id], count);
        }
        else if (this.npcs[id] != undefined)
            this.npcs[id]._health = health;
    },
    removeNPC: function(id) 
    {
        if (this.npcs[id] === undefined)
            return;
        
        this.npcs[id].Hide();
        this.npcs[id]._nameplate.Hide();   
        
        if (this.npcs[id]._healthbar !== undefined)
        {
            this.npcs[id]._healthbarBack.Hide();
            this.npcs[id]._healthbar.Hide();
        }
        
        this.npcs[id] = undefined;
    },
    resetNPCs: function() 
    {
        //Cycle through all NPCs and hide them
        
        for (let i = 0; i < this.npcs.length; i++)
            this.removeNPC(i);
        
        //Reset NPCs array
        
        this.npcs = [];
    },
    resetColliders: function() 
    {
        if (this.players === undefined || 
            this.player === undefined ||
            this.players[this.player] === undefined)
            return;
        
        if (this.players[this.player].COLLIDER !== undefined)
        {
            //Save player's collider
        
            const c = this.players[this.player].COLLIDER.Disable();
            
            //Reset colliders
            
            lx.GAME.COLLIDERS = [];
        
            //Apply collider to player

            this.players[this.player].COLLIDER = c.Enable();
        }
    },
    createWorldItem: function(data) 
    {
        //Check if valid
        
        if (data == undefined)
            return;
        
        //Check if world item should be removed
        
        if (data.remove)
        {
            //Remove world item
            
            this.removeWorldItem(data.id);
            
            //Remove from loot box
            
            ui.loot.remove(data.id);

            return;
        }
        
        //Create item name
        
        let name = data.name + ' (' + data.value + 'g)';
        
        //Check if world item already exists
        
        if (this.items[data.id] != undefined)
        {                  
            //Update nameplate

            if (data.owner == -1)
                this.items[data.id]._nameplate.Text(name);
            
            //Set new owner
            
            this.items[data.id]._owner = data.owner;

            return;
        }
        
        //Create item sprite
        
        let sprite = new lx.Sprite(data.source, undefined, undefined, undefined, undefined, function() {
            //Create lynx gameobject
        
            let worldItem = new lx.GameObject(
                sprite,
                data.pos.X-sprite.Size().W/2,
                data.pos.Y-sprite.Size().H,
                sprite.Size().W,
                sprite.Size().H
            );

            //Check how many items exist at position

            let dy = -12;

            for (let i = 0; i < game.items.length; i++)
                if (game.items[i] != undefined &&
                    game.items[i].POS.X == worldItem.POS.X &&
                    game.items[i].POS.Y == worldItem.POS.Y)
                        dy -= 13;

            //Add name label

            worldItem._nameplate = new lx.UIText(name, worldItem.Size().W/2, dy, 12, ui.inventory.getItemColor(data.rarity));
            worldItem._nameplate.SHADOW = true;

            //Set owner

            worldItem._owner = data.owner;

            //Create collider

            worldItem.CreateCollider(true, function(coll_data) {
                //Check if player

                if (game.players[game.player].COLLIDER !== coll_data.trigger)
                    return;

                //Check if player is owner

                if (game.items[data.id]._owner != -1 &&
                    game.players[game.player].name !== game.items[data.id]._owner)
                    return;

                //Check if player is moving

                if (game.players[game.player].MOVEMENT.VX == 0 &&
                    game.players[game.player].MOVEMENT.VY == 0)
                    return;

                //Add to loot window

                ui.loot.add(data);
            });

            worldItem.COLLIDER.Solid(false);

            //Check owner

            if (data.owner != -1 &&
                game.players[game.player] != undefined &&
                game.players[game.player].name !== data.owner)
                worldItem._nameplate.Text('*' + name);

            worldItem._nameplate
                .Alignment('center')
                .Follows(worldItem)
                .Show();

            //Add to items

            game.items[data.id] = worldItem;

            //Show world item

            game.items[data.id].Show(2);
        });
    },
    resetWorldItems: function() 
    {
        //Cycle through all items and hide
        
        for (let i = 0; i < this.items.length; i++)
            this.removeWorldItem(i);
        
        //Reset to empty array
        
        this.items = [];
    },
    removeWorldItem: function(id) 
    {
        //If item exists remove it
        
        if (this.items[id] != undefined) {
            this.items[id]._nameplate.Hide();
            this.items[id].Hide();
            
            this.items[id] = undefined;
        }
    },
    loadMap: function(map) 
    {
        tiled.convertAndLoadMap(map);
        
        //...
    },
    getSprite: function(src)
    {
        if (this.sprites[src] === undefined)
            this.sprites[src] = new lx.Sprite(src);
        
        this.sprites[src].CLIP = undefined;
        
        return this.sprites[src]; 
    },
    getTileset: function(src, cb) 
    {
        if (this.tilesets[src] === undefined) {
            let s = src.lastIndexOf('/')+1;
            
            if (cb == undefined)
                this.tilesets[src] = new lx.Sprite('res/tilesets/' + src.substr(s, src.length-s));
            else
                this.tilesets[src] = new lx.Sprite('res/tilesets/' + src.substr(s, src.length-s), undefined, undefined, undefined, undefined, cb);
        }
        
        this.tilesets[src].CLIP = undefined;
        
        if (cb != undefined)
            cb();
        
        return this.tilesets[src];
    },
    
    createAction: function(data)
    {
        for (let i = 0; i < data.elements.length; i++)
         {
             if (data.elements[i].src.length == 0)
                 continue;

             if (data.elements[i].type == undefined ||
                 data.elements[i].type === 'static') {
                 let sprite = new lx.Sprite(data.elements[i].src, undefined, undefined, undefined, undefined,
                     function() {
                         let sprites = [];

                         if (data.elements[i].direction === 'horizontal')
                             for (let x = 0; x < sprite.Size().W/data.elements[i].w; x++)
                                 sprites.push(new lx.Sprite(data.elements[i].src,
                                     x*data.elements[i].w, 
                                     0, 
                                     data.elements[i].w, 
                                     data.elements[i].h
                                 ));
                         if (data.elements[i].direction === 'vertical')
                             for (let y = 0; y < sprite.Size().H/data.elements[i].h; y++)
                                 sprites.push(new lx.Sprite(data.elements[i].src,
                                     0, 
                                     y*data.elements[i].h, 
                                     data.elements[i].w, 
                                     data.elements[i].h
                                 ));

                         if (sprites.length == 0)
                             return;

                         let action = new lx.Animation(sprites, data.elements[i].speed)
                             .Loops(function() {
                                if (tiled.current !== this._map ||
                                    tiled.loading)
                                    this.Hide();
                             })
                             .Show(
                             4, 
                             data.pos.X+data.elements[i].x,
                             data.pos.Y+data.elements[i].y,
                             data.elements[i].w,
                             data.elements[i].h,
                             0
                         );
                     
                     action._map = tiled.current;
                 });
             }
             else if (data.elements[i].type === 'projectile') {
                 let sprite = new lx.Sprite(data.elements[i].src, undefined, undefined, undefined, undefined,
                     function() {
                        let angle = 0;
                     
                        if (data.elements[i].projectileSpeed.y != 0 &&
                            data.elements[i].projectileSpeed.x != 0)
                                angle = -Math.atan2(data.elements[i].projectileSpeed.x, data.elements[i].projectileSpeed.y);

                        if (angle == 0) {
                            if (data.elements[i].projectileSpeed.x == 0 &&
                                data.elements[i].projectileSpeed.y < 0)
                                angle = Math.PI;
                            
                            else if (data.elements[i].projectileSpeed.y == 0) {
                                if (data.elements[i].projectileSpeed.x < 0)
                                    angle = Math.PI/2;
                                else if (data.elements[i].projectileSpeed.x > 0)
                                    angle = -Math.PI/2;
                            }
                        }
                     
                        let projectile = new lx.GameObject(
                            sprite, 
                            data.pos.X+data.elements[i].x,
                            data.pos.Y+data.elements[i].y,
                            data.elements[i].w,
                            data.elements[i].h
                        )
                        .Identifier(data.elements[i].p_id)
                        .Rotation(angle)
                        .MovementDecelerates(false)
                        .Movement(
                            data.elements[i].projectileSpeed.x, 
                            data.elements[i].projectileSpeed.y
                        )
                        .Loops(function() {
                            this._distance.x += Math.abs(this.MOVEMENT.VX);
                            this._distance.y += Math.abs(this.MOVEMENT.VY);
                            
                            if (this._distance.x > data.elements[i].projectileDistance ||
                                this._distance.y > data.elements[i].projectileDistance ||
                                tiled.current !== this._map ||
                                tiled.loading)
                                this.Hide();
                        })
                        .Show(4);
                     
                        projectile._distance = { 
                            x: 0,
                            y: 0
                        };
                        projectile._map = tiled.current;
                 });
             }
         }
    },
    removeAction: function(id) {
        let go = lx.FindGameObjectWithIdentifier(id);
        
        if (go != undefined)
            go.Hide();
    },
    
    createBlood: function(target, count)
    {
        if (target == undefined)
            return;
        
        for (let i = 0; i < count; i++) {
            let size = 4+Math.round(Math.random()*4);

            let blood = new lx.GameObject(
                new lx.Sprite('res/particles/blood.png'),
                target.POS.X+Math.round(Math.random()*target.SIZE.W),
                target.POS.Y+target.SIZE.H-4-Math.round(Math.random()*6),
                size,
                size
            );

            blood._timer = {
                cur: 0,
                standard: 60
            };

            blood.Loops(function() {
                if (this._timer.cur >= this._timer.standard)
                {
                    this._timer.cur = 0;

                    blood.Hide();
                } 
                else
                    this._timer.cur++;
            });

            blood.Show(2);
        }  
    },
    
    initialize: function(isMobile) 
    {
        //Check if Lynx2D is already running
        
        if (lx.GAME.RUNNING)
            window.location.reload(true);
        
        //Initialize and start Lynx2D
        
        lx
            .Initialize(document.title)
            .Smoothing(false)
            .Start(60);
        
        //Check if is mobile
        
        this.isMobile = isMobile;
        
        if (isMobile)
            ui.fullscreen.append();
    }
};