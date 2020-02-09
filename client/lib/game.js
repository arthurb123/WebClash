const game = {
    player: -1,
    players: {},
    npcs: [],
    items: [],
    tilesets: [],
    sprites: [],
    gameTime: {},
    isMobile: false,

    instantiatePlayer: function(name)
    {
        //Instantiate Lynx2D GameObject for player

        player.instantiate(name);

        this.player = name;
    },
    instantiateOther: function(name)
    {
        //Instantiate Lynx2D GameObject for other player

        let go = new lx.GameObject(undefined, 0, 0, 0, 0)
            .Loops(function() {
                //Animate

                animation.animateMoving(this);

                //Handle nameplate

                if (this._nameplate != undefined) {
                    this._nameplate.Position(this.Size().W/2, -Math.floor(this.Size().H/5));
                    if (this._level !== undefined)
                        this._nameplate.Text('lvl ' + this._level + ' - ' + this.name);
                }

                //Handle party

                if (ui.party.inParty(name))
                    this._nameplate.Color('#4099FF');
                else {
                    if ((!tiled.pvp))
                        this._nameplate.Color('whitesmoke');
                    else
                        this._nameplate.Color('#ce1010');
                }

                //Handle casting bar

                if (this._castingBar != undefined)
                    this._castingBar.SIZE.W = this.SIZE.W*lx.GAME.SCALE;

                //Handle healthbar
   
                if (this._health != undefined)
                {
                    if (this._healthbar == undefined) {
                        this._healthbar = new lx.UIProgressBar('black', '#FF4242', 0, -36, this.SIZE.W*lx.GAME.SCALE, 8)
                            .Progress(this._health.cur/this._health.max*100)
                            .Follows(go);
                    } else {
                        this._healthbar.SIZE.W = this.SIZE.W * lx.GAME.SCALE;
                        this._healthbar.Progress(this._health.cur/this._health.max*100);
    
                        if (this._health.cur == this._health.max || !tiled.pvp)
                            this._healthbar.Hide();
                        else if (tiled.pvp)
                            this._healthbar.Show();
                    }
                }
            })
            .PreDraws(function() {
                if (this.SPRITE == undefined)
                    return;

                //Constants for easier readability

                const main = this._equipment.length-1,
                      offhand = this._equipment.length-2;

                //Set and render equipment based on direction

                let equipment = [];

                switch (this._direction) {
                    case 1:
                        equipment.push(this._equipment[main]);
                        break;
                    case 2:
                        equipment.push(this._equipment[offhand]);
                        break;
                }

                for (let i = 0; i < equipment.length; i++) {
                    if (equipment[i] == undefined)
                        continue;

                    equipment[i].CLIP = this.SPRITE.CLIP;
                    
                    lx.DrawSprite(equipment[i], this.POS.X, this.POS.Y);
                }
            })
            .Draws(function() {
                if (this.SPRITE == undefined)
                    return;

                //Constants for easier readability

                const main = this._equipment.length-1,
                      offhand = this._equipment.length-2;

                //Set and render equipment based on direction

                let equipment = [];

                for (let i = 0; i < this._equipment.length-2; i++)
                    equipment.push(this._equipment[i]);

                switch (this._direction) {
                    case 0:
                        equipment.push(this._equipment[main]);
                        equipment.push(this._equipment[offhand]);
                        break;
                    case 1:
                        equipment.push(this._equipment[offhand]);
                        break;
                    case 2:
                        equipment.push(this._equipment[main]);
                        break;
                    case 3:
                        equipment.push(this._equipment[offhand]);
                        equipment.push(this._equipment[main]);
                        break;
                }

                for (let i = 0; i < equipment.length; i++) {
                    if (equipment[i] == undefined)
                        continue;

                    equipment[i].CLIP = this.SPRITE.CLIP;

                    lx.DrawSprite(equipment[i], this.POS.X, this.POS.Y);
                }
            });

        //Set variables

        go.name = name;
        go._moving = false;
        go._direction = 0;
        go._equipment = {};

        //Add nameplate

        go._nameplate = new lx.UIText(name, 0, 0, 14)
            .Alignment('center')
            .Follows(go)
            .Show();

        go._nameplate.SetShadow('rgba(0, 0, 0, .85)', 0, .85);

        //Add casting progress bar

        go._castingBar = new lx.UIProgressBar(
            'rgba(0, 0, 0, .50)',
            'rgba(255, 255, 255, .75)',
            0, -6,
            0, 8
        )
            .Loops(function() {
                this.Progress(this.Progress() + ((1000/60)/this._target) * 100);

                if (this.Progress() >= 100)
                    this.Hide();
            })
            .Follows(go);

        go._castAction = function(targetTime, elapsedTime) {
            //Set progress

            this._castingBar._target = targetTime * (1000/60);
            this._castingBar.Progress(
                elapsedTime / this._castingBar._target * 100
            );

            //Show casting bar

            this._castingBar.Show();
        };

        //Add context menu

        let button = (this.isMobile ? 0 : 2);
        go.OnMouse(button, function() {
            lx.StopMouse(2);

            //Check if isMobile and action has been selected

            if (game.isMobile && ui.actionbar.selectedAction !== -1)
                return;

            //Check if already exists

            if (document.getElementById('player_context_box') != undefined)
                document.getElementById('player_context_box').remove();

            //Show context menu

            let contextBox = document.createElement('div');

            contextBox.id = 'player_context_box';
            contextBox.classList.add('box');
            contextBox.style = 'position: absolute; width: 70px; padding: 4px; height: auto; text-align: center;';
            contextBox.innerHTML =
                    '<button id="player_context_invite" style="width: 90%; height: 20px; font-size: 12px;">Invite</button>';

            //Append

            view.dom.appendChild(contextBox);

            //Set position

            contextBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X + 'px';
            contextBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y + 'px';

            //Set on event handlers

            const remove = function() {
                contextBox.remove();
                lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[button] = false;
            };

            contextBox.addEventListener('mouseleave', function() {
                remove();
            });

            document.getElementById('player_context_invite').addEventListener('click', function() {
                channel.emit('CLIENT_INVITE_TO_PARTY', name);

                remove();
            });
        });

        //Add to players

        this.players[name] = go.Show(3);
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

            if (delta < 0) {
              //Play according sound

              let sound;

              if (health.cur <= 0)
                  sound = audio.getDeathSoundFromTarget(this.players[id]);
              else
                  sound = audio.getHitSoundFromTarget(this.players[id]);

              if (sound != undefined)
                  audio.playSoundAtPosition(sound, this.players[id].Position());

               //Damage floaty

               ui.floaties.damageFloaty(this.players[id], delta);

               //Show damage color overlay

               this.players[id].ShowColorOverlay('rgba(228, 63, 63, 0.46)', 5);

               //Blood particles

               let count = -delta;
               if (count > 10)
                   count = 10;

               this.createBlood(this.players[id], count);
            }
            else if (delta == 0) {
                //Miss floaty

                ui.floaties.missFloaty(this.players[id], delta);
            }
            else if (delta > 0) {
                //Heal floaty

                ui.floaties.healFloaty(this.players[id], delta);

                //Show heal color overlay

                this.players[id].ShowColorOverlay('rgba(128, 239, 59, 0.46)', 5);
            }
        }
        else {
            this.players[id]._health = health;

            //If player set UI health

            if (this.player == id)
                ui.status.setHealth(health.cur, health.max);
        }

        //If this player is in the same party,
        //update player

        if (ui.party.inParty(id))
            ui.party.updatePlayer(id);
    },
    setPlayerMana: function(id, mana)
    {
        let delta = 0;
        if (this.players[id]._mana != undefined)
            delta = -(this.players[id]._mana.cur-mana.cur);

        this.players[id]._mana = mana;

        //If player set UI mana

        if (this.player == id) 
            ui.status.setMana(mana.cur, mana.max);

        //Create mana floaty

        if (delta > 0) {
            //Mana floaty

            ui.floaties.manaFloaty(this.players[id], delta);

            //Show mana color overlay

            this.players[id].ShowColorOverlay('rgba(43, 146, 237, 0.46)', 5);
        }

        //If this player is in the same party,
        //update player

        if (ui.party.inParty(id))
            ui.party.updatePlayer(id);
    },
    setPlayerEquipment: function(id, equipment)
    {
        let result = [];

        let getEquipment = function(equippable) {
            if (equipment[equippable] !== undefined)
                result.push(cache.getSprite(equipment[equippable]));
            else
                result.push(undefined);
        }

        getEquipment('torso');
        getEquipment('hands');
        getEquipment('head');
        getEquipment('feet');
        getEquipment('legs');
        getEquipment('offhand');
        getEquipment('main');

        this.players[id]._equipment = result;
    },
    setPlayerLevel: function(id, level)
    {
        let oldLevel = game.players[id]._level;
        game.players[id]._level = level;

        if (id == game.player)
            ui.profile.reloadLevel(level);

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

        if (id === undefined || 
            this.players[id] == undefined)
            return;

        //Hide target GameObject

        this.players[id]._nameplate.Hide();
        if (this.players[id]._healthbar != undefined)
            this.players[id]._healthbar.Hide();

        this.players[id].Hide();

        //Remove target

        delete this.players[id];

        //Check if party should be checked

        if (ui.party.inParty(id))
            ui.party.updatePlayer(id);
    },
    resetPlayers: function()
    {
        //Cycle through all online players and
        //remove all, except for the player itself

        for (let p in game.players)
            if (p !== this.player)
                this.removePlayer(p);
    },

    instantiateNPC: function(id, name)
    {
        //Instantiate Lynx2D GameObject for NPC.

        let go = new lx.GameObject(undefined, 0, 0, 0, 0)
            .Loops(function() {
                //Animate

                animation.animateMoving(this);

                //Handle nameplate

                if (this._nameplate != undefined) {
                    if (this._nameplate.Position().X === 0)
                      this._nameplate.Position(this.Size().W/2, -12);
    
                    if (this._type === 'friendly')
                        this._nameplate.Color('black');
                    else if (this._type === 'hostile') {
                        if (this._aggressive || this._inCombat)
                            this._nameplate.Color('#FF4242');
                        else if (!this._aggressive && !this._inCombat)
                            this._nameplate.Color('#EBDE57');
                    }
    
                    if (this._stats !== undefined &&
                        this._type === 'hostile')
                        this._nameplate.Text('lvl ' + this._stats.level + ' - ' + this.name);
                }

                //Handle healthbar

                if (this._health != undefined)
                {
                    if (this._healthbar === undefined) {
                        this._healthbar = new lx.UIProgressBar('black', '#FF4242', 0, -36, this.SIZE.W*lx.GAME.SCALE, 8)
                            .Progress(this._health.cur/this._health.max*100)
                            .Follows(go);
                    } else {
                        this._healthbar.SIZE.W = this.SIZE.W * lx.GAME.SCALE;
                        this._healthbar.Progress(this._health.cur/this._health.max*100);
    
                        if (this._health.cur == this._health.max)
                            this._healthbar.Hide();
                        else
                            this._healthbar.Show();
                    }
                }

                //Handle casting bar

                if (this._castingBar != undefined)
                    this._castingBar.SIZE.W = this.SIZE.W*lx.GAME.SCALE;

                //Handle dialog texture
    
                if (this._dialogTexture != undefined)
                    this._dialogTexture.Hide();

                //Handle extra loops
    
                for (let cb = 0; cb < this._loops.length; cb++) 
                    this._loops[cb]();
            })
            .PreDraws(function() {
                if (this.SPRITE == undefined)
                    return;

                //Draw specific NPC equipment if it exists

                if (this._equipment != undefined) {
                    //Draw mains and offhands if necessary

                    if (this._mainHands.length === 0 && this._offHands.length === 0)
                        return;

                    //Set weapons based on NPC direction

                    let weapons = [];

                    switch (this._direction) {
                        case 1:
                            weapons = this._mainHands;
                            break;
                        case 2:
                            weapons = this._offHands;
                            break;
                    }

                    //Draw weapons array

                    for (let w = 0; w < weapons.length; w++) {
                        weapons[w].CLIP = this.Clip();

                        lx.DrawSprite(
                            weapons[w],
                            this.Position().X,
                            this.Position().Y
                        );
                    }
                }
            })
            .Draws(function() {
                if (this.SPRITE == undefined)
                    return;

                //Draw NPC equipment if it exists

                if (this._equipment != undefined) {
                    //Draw all generic equipment

                    for (let e = 0; e < this._equipment.length; e++) {
                        this._equipment[e].CLIP = this.Clip();

                        lx.DrawSprite(
                            this._equipment[e],
                            this.Position().X,
                            this.Position().Y
                        );
                    };

                    //Draw mains and offhands if necessary

                    if (this._mainHands.length === 0 && this._offHands.length === 0)
                        return;

                    //Set weapons based on the NPC direction

                    let weapons = [];

                    switch (this._direction) {
                        case 0:
                            weapons = this._mainHands.concat(this._offHands);
                            break;
                        case 1:
                            weapons = this._offHands;
                            break;
                        case 2:
                            weapons = this._mainHands;
                            break;
                        case 3:
                            weapons = this._offHands.concat(this._mainHands);
                            break;
                    }

                    //Draw weapons array

                    for (let w = 0; w < weapons.length; w++) {
                        weapons[w].CLIP = this.Clip();

                        lx.DrawSprite(
                            weapons[w],
                            this.Position().X,
                            this.Position().Y
                        );
                    }
                }
            });

        //Set properties

        go.name = name;
        go._loops = [];
        go._moving = false;
        go._direction = 0;

        //Create nameplate

        if (name.length > 0) {
            go._nameplate = new lx.UIText(name, 0, 0, 14)
                .Alignment('center')
                .Follows(go)
                .Show();

            go._nameplate.SetShadow('rgba(0,0,0,.85)', 0, .85);
        }

        //Create casting progress bar

        go._castingBar = new lx.UIProgressBar(
            'rgba(0, 0, 0, .50)',
            'rgba(255, 255, 255, .75)',
            0, -6,
            0, 8
        )
            .Loops(function() {
                this.Progress(this.Progress() + ((1000/60)/this._target) * 100);

                if (this.Progress() >= 100)
                    this.Hide();
            })
            .Follows(go);

        go._castAction = function(targetTime, elapsedTime) {
            //Set progress

            this._castingBar._target = targetTime * (1000/60);
            this._castingBar.Progress(
                elapsedTime / this._castingBar._target * 100
            );

            //Show casting bar

            this._castingBar.Show();
        };

        //Add and show NPC

        this.npcs[id] = go.Show(3);
    },
    setNPCType: function(id, type, hasDialog)
    {
        //Set NPC type

        this.npcs[id]._type = type;

        if (type === 'friendly' &&
            hasDialog)
        {
            //Check if dialog texture already exists

            if (this.npcs[id]._dialogTexture != undefined)
                return;

            //Load dialog texture

            cache.getSprite('res/ui/dialog.png', function(sprite) {
                game.npcs[id]._dialogTexture = new lx.UITexture(
                    sprite, 
                    game.npcs[id].Size().W/2, 
                    -sprite.Size().H/2
                ).Follows(game.npcs[id]);
                
                //Check if mobile
    
                if (!game.isMobile) {
                    //Add a mouse hover event to show
                    //and or hide the dialog texture
    
                    game.npcs[id].OnHover(function(data) {
                        //Check if texture is already visible
    
                        if (this._dialogTexture.UI_ID != undefined)
                            return;
    
                        //Get position difference
    
                        let pos = game.players[game.player].POS;
    
                        let dx = Math.abs(pos.X-data.position.X),
                            dy = Math.abs(pos.Y-data.position.Y);
    
                        //Proximity distance in tiles
    
                        let proximity = 2.875;
    
                        //Check if in proximity
    
                        if (dx > tiled.tile.width*proximity ||
                            dy > tiled.tile.height*proximity)
                            return;
    
                        //Show dialog texture
    
                        this._dialogTexture.Show();
                    });
                } else {
                    //Add NPC specific loops that checks if 
                    //the dialog texture should be displayed
    
                    game.npcs[id]._loops[0] = function(data) {
                        //Check if texture is already visible
    
                        if (game.npcs[id]._dialogTexture.UI_ID != undefined)
                            return;
    
                        //Get position difference
    
                        let pos = game.players[game.player].POS,
                            pos1 = game.npcs[id].POS;
    
                        let dx = Math.abs(pos.X-pos1.X),
                            dy = Math.abs(pos.Y-pos1.Y);
    
                        //Proximity distance in tiles
    
                        let proximity = 2.875;
    
                        //Check if in proximity
    
                        if (dx > tiled.tile.width*proximity ||
                            dy > tiled.tile.height*proximity)
                            return;
    
                        //Show dialog texture
    
                        game.npcs[id]._dialogTexture.Show();
                    };
                }
    
                //Give NPC the possibility to engage in dialog
                //through a click event
    
                game.npcs[id].OnMouse(0, function(data) {
                    if (data.state == 0 || 
                        game.npcs[id] == undefined || 
                        game.npcs[id]._type !== 'friendly')
                        return;
    
                    //Stop mouse
    
                    lx.StopMouse(0);
    
                    //Request dialog
    
                    channel.emit('CLIENT_REQUEST_DIALOG', id);
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

            if (delta == 0) {
                //Miss floaty

                ui.floaties.missFloaty(this.npcs[id], delta);

                return;
            }
            if (delta > 0) {
                //Heal floaty

                ui.floaties.healFloaty(this.npcs[id], delta);

                //Show heal color overlay

                this.npcs[id].ShowColorOverlay('rgba(128, 239, 59, 0.46)', 5);

                return;
            }

            //Play according sound

            let sound;

            if (health.cur <= 0)
                sound = audio.getDeathSoundFromTarget(this.npcs[id]);
            else
                sound = audio.getHitSoundFromTarget(this.npcs[id]);

            if (sound != undefined)
                audio.playSoundAtPosition(sound, this.npcs[id].Position());

            //Damage floaty

            ui.floaties.damageFloaty(this.npcs[id], delta);

            //Show damage color overlay

            this.npcs[id].ShowColorOverlay('rgba(228, 63, 63, 0.46)', 5);

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
    setNPCEquipment: function(id, equipment) {
        this.npcs[id]._equipment = [];
        this.npcs[id]._mainHands = [];
        this.npcs[id]._offHands = [];

        for (let e = 0; e < equipment.length; e++) {
            if (equipment[e].type === 'generic')
                this.npcs[id]._equipment.push(new lx.Sprite(equipment[e].source));
            else if (equipment[e].type === 'main')
                this.npcs[id]._mainHands.push(new lx.Sprite(equipment[e].source));
            else if (equipment[e].type === 'offhand')
                this.npcs[id]._offHands.push(new lx.Sprite(equipment[e].source));
        }
    },
    removeNPC: function(id)
    {
        if (this.npcs[id] === undefined)
            return;

        this.npcs[id].Hide();
        if (this.npcs[id]._nameplate != undefined)
            this.npcs[id]._nameplate.Hide();
        if (this.npcs[id]._dialogTexture != undefined)
            this.npcs[id]._dialogTexture.Hide();

        if (this.npcs[id]._healthbar != undefined)
            this.npcs[id]._healthbar.Hide();

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

    orderTargets: function(target1, target2) {
        if (target1 == undefined || 
            target2 == undefined)
            return;

        let onTop = false;

        if (target1.Position().Y+target1.Size().H <
            target2.Position().Y+target2.Size().H)
            onTop = true;

        if (onTop && target1.BUFFER_ID > target2.BUFFER_ID ||
            !onTop && target1.BUFFER_ID < target2.BUFFER_ID)
            lx.GAME.SWITCH_BUFFER_POSITION(
                target1,
                target2
            );
    },

    resetColliders: function()
    {
        if (this.players == undefined ||
            this.player == undefined ||
            this.players[this.player] == undefined ||
            !tiled.loading)
            return;

        if (this.players[this.player].COLLIDER != undefined)
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

        let name = data.name + ' (' + data.value + game.aliases.currency[0].toLowerCase() + ')';

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
            worldItem._nameplate.SetShadow('rgba(0,0,0,.85)', 0, .85);

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
    loadMap: function(request_id)
    {
        //Load map via a GET request

        httpGetAsync('map/' + request_id, function(data) {
            //Check if an error occured

            if (data === 'error') {
                //...

                return;
            }

            //Convert and load map

            tiled.convertAndLoadMap(JSON.parse(data));
        });
    },

    createAction: function(data)
    {
        //Create action elements

        if (data.element.src.length == 0)
            return;

        if (data.element.type == undefined ||
            data.element.type === 'static') {
            //Static action

            cache.getSprite(data.element.src, function(sprite) {
                let sprites = [];

                if (data.element.direction === 'horizontal')
                    sprites = lx.CreateHorizontalTileSheet(sprite, data.element.w, data.element.h);
                if (data.element.direction === 'vertical')
                    sprites = lx.CreateVerticalTileSheet(sprite, data.element.w, data.element.h);

                if (sprites.length == 0)
                    return;

                let action = new lx.Animation(sprites[0], data.element.speed)
                    .Loops(function() {
                    if (tiled.current !== this._map ||
                        tiled.loading)
                        this.Hide();
                    })
                    .Position(
                        data.pos.X+data.element.x,
                        data.pos.Y+data.element.y
                    )
                    .Size(
                        data.element.w*data.element.scale,
                        data.element.h*data.element.scale
                    )
                    .ShowAmount(4, 0);

                action._map = tiled.current;
            });
        }
        else if (data.element.type === 'projectile') {
            //Projectile action

            cache.getSprite(data.element.src, function(sprite) {
                let angle = 0;

                if (data.element.rotates) {
                    if (data.element.projectileSpeed.y != 0 &&
                        data.element.projectileSpeed.x != 0)
                            angle = -Math.atan2(data.element.projectileSpeed.x, data.element.projectileSpeed.y);

                    if (angle == 0) {
                        if (data.element.projectileSpeed.x == 0 &&
                            data.element.projectileSpeed.y < 0)
                            angle = Math.PI;

                        else if (data.element.projectileSpeed.y == 0) {
                            if (data.element.projectileSpeed.x < 0)
                                angle = Math.PI/2;
                            else if (data.element.projectileSpeed.x > 0)
                                angle = -Math.PI/2;
                        }
                    }

                    sprite.Rotation(angle);
                }

                let projectile = new lx.GameObject(
                    sprite,
                    data.pos.X+data.element.x,
                    data.pos.Y+data.element.y,
                    data.element.w*data.element.scale,
                    data.element.h*data.element.scale
                );

                if (data.element.animated) {
                    let sprites = [];

                    if (data.element.direction === 'horizontal')
                        sprites = lx.CreateHorizontalTileSheet(sprite, data.element.w, data.element.h);
                    if (data.element.direction === 'vertical')
                        sprites = lx.CreateVerticalTileSheet(sprite, data.element.w, data.element.h);

                    if (sprites.length != 0) {
                        sprites = sprites[0];

                        for (let s = 0; s < sprites.length; s++) {
                            sprites[s].Rotation(angle);
                            
                            if (sprites[s].SIZE == undefined)
                                sprites[s].SIZE = sprites[s].Size();
                            
                            sprites[s].SIZE.W *= data.element.scale;
                            sprites[s].SIZE.H *= data.element.scale;
                        }

                        projectile.ShowAnimation(new lx.Animation(sprites, data.element.speed));
                    }
                }
                else {
                    projectile.Clip(0, 0, data.element.w, data.element.h);
                }

                projectile
                    .Identifier(data.element.p_id)
                    .Rotation(angle)
                    .MovementDecelerates(false)
                    .Movement(
                        data.element.projectileSpeed.x,
                        data.element.projectileSpeed.y
                    )
                    .Loops(function() {
                        this._distance.x += Math.abs(this.MOVEMENT.VX);
                        this._distance.y += Math.abs(this.MOVEMENT.VY);

                        if (this._distance.x > data.element.projectileDistance ||
                            this._distance.y > data.element.projectileDistance ||
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

        //Force frame for owner

        if (data.ownerType === 'player') 
            animation.forceFrame.start(game.players[data.owner]);
        else 
            animation.forceFrame.start(game.npcs[data.owner]);

        //Play action sound if possible

        if (data.sounds == undefined)
            return;

        let sound = audio.getRandomSound(data.sounds);

        if (sound != undefined)
            audio.playSoundAtPosition(sound, data.centerPosition);
    },
    removeAction: function(id)
    {
        let go = lx.FindGameObjectWithIdentifier(id);

        if (go != undefined)
            go.Hide();
    },
    calculateDamagePerSecond: function(scaling, extra_attributes)
    {
        let total = 0;

        for (let key in player.attributes)
            if (extra_attributes == undefined)
                total += scaling[key] * player.attributes[key] * 10;
            else
                total += scaling[key] * (player.attributes[key]+extra_attributes[key]) * 10;

        return Math.round(total);
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
                    blood.Hide();
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

        if (isMobile) {
            //Append fullscreen functionality
            ui.fullscreen.append();
        }
    },
    update: function() {
        //Order NPCs against NPCs

        for (let i = 0; i < game.npcs.length; i++)
            if (game.npcs[i] != undefined)
                for (let ii = 0; ii < game.npcs.length; ii++)
                    if (game.npcs[ii] != undefined && i !== ii)
                        game.orderTargets(game.npcs[ii], game.npcs[i]);

        //Order players against NPCs

        for (let p in game.players)
            if (game.players[p] != undefined)
                for (let i = 0; i < game.npcs.length; i++)
                    if (game.npcs[i] != undefined)
                        game.orderTargets(game.npcs[i], game.players[p]);

        //Order players against players

        for (let p in game.players)
            if (game.players[p] != undefined)
                for (let p2 in game.players)
                    if (game.players[p2] != undefined && p !== p2)
                        game.orderTargets(game.players[p2], game.players[p]);
    }
};
