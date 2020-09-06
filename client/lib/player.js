const player = {
    actions: [],
    inventory: [],
    equipment: {},
    statusEffects: {},
    quests: {},
    inParty: false,

    instantiate: function(name)
    {
        let go = new lx.GameObject(undefined, 0, 0, 0, 0);

        //Set player properties

        go.Loops(player.update)
          .Draws(player.draws)
          .PreDraws(player.preDraws)
          .OnMouse(0, player.onMouse)
          .MovementDecelerates(false)
          .Focus();

        go.name = name;
        go._direction = 0;
        go._moving = false;
        go._facing = false;

        //Set player

        game.players[name] = go.Show(3);

        //Add event handlers if not on mobile

        if (!game.isMobile) {
            //Mouse event handlers

            let holdingLeft = false;
            lx.OnMouse(0, function(data) {
                if (data.state === 0) {
                    holdingLeft = false;
                    return;
                }

                if (ui.dialog.showing   || 
                    ui.profile.showing  || 
                    ui.settings.showing || 
                    ui.journal.showing  ||
                    lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[1])
                    return;

                if (holdingLeft &&
                    ui.actionbar.onCooldown[0] != undefined)
                    return;

                player.performAction(0);
                holdingLeft = true;
            });

            let holdingRight = false;
            lx.OnMouse(2, function(data) {
                if (data.state === 0) {
                    holdingRight = false;
                    return;
                }

                if (ui.dialog.showing   || 
                    ui.profile.showing  || 
                    ui.settings.showing || 
                    ui.journal.showing  ||
                    lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[0])
                    return;

                if (holdingRight &&
                    ui.actionbar.onCooldown[1] != undefined)
                    return;

                player.performAction(1);
                holdingRight = true;
            });

            //Key event handlers

            for (let i = 1; i < 6; i++) {
                let holding = false;
                lx.OnKey(i, function(data) {
                    if (data.state === 0) {
                        holding = false;
                        return;
                    }

                    if (ui.chat.isTyping())
                        return;

                    if (holding &&
                        ui.actionbar.onCooldown[i+1] != undefined)
                        return;

                    player.performAction(i+1);
                    holding = true;
                });
            }
        }
        else {
            //Mobile mouse event handler

            let holding = false;
            lx.OnMouse(0, function(data) {
                if (data.state === 0) {
                    holding = false;
                    return;
                }

                if (ui.dialog.showing   || 
                    ui.profile.showing  || 
                    ui.settings.showing || 
                    ui.journal.showing)
                    return;

                if (ui.actionbar.selectedAction !== -1) {
                    if (holding &&
                        ui.actionbar.onCooldown[ui.actionbar.selectedAction] != undefined)
                        return;

                    player.performAction(ui.actionbar.selectedAction);
                    holding = true;
                }
            });
        }

        //Create casting progress bar

        go._castingBar = new lx.UIProgressBar(
            'rgba(0, 0, 0, .50)',
            'rgba(255, 255, 255, .75)',
            0, -6,
            0, 5
        )
            .Loops(function() {
                this.Progress(this.Progress() + ((1000/60)/this._target) * 100);

                if (this.Progress() >= 100)
                    player.cancelCastAction();
            })
            .Follows(go);

        go._castingIcon = new lx.UITexture(
            'transparent',
            -14,
            -4,
            12,
            12
        )
            .Follows(go._castingBar);

        //Request xp target

        player.requestExpTarget();

        //Calculate status effect matrix by default

        player.statusEffectsMatrix = game.calculateStatusEffectsMatrix(player.statusEffects);

        //Create action element rendering loop

        player.createActionElementRenderingLoop();

        //Check if a camera should be created

        if (properties.lockCamera)
            camera.initialize(go);
    },
    kill: function(deathData) {
        //Attempt to hide the player

        if (game.players[game.player] != undefined)
            game.players[game.player].Hide();

        //Stop input

        lx.StopMouse(0);
        lx.StopMouse(1);

        //Hide all UI

        ui.hide();

        //Format dialog content based 
        //on the recieved death data

        let content = '<p style="font-weight: bold; padding-bottom: 3px;">You Died</p>';

        if (deathData.lostItems)
            content += 'You lost all your items.<br>';
        if (deathData.lostEquipment)
            content += 'You lost all your equipment.<br>';
        if (deathData.lostCurrency != undefined)
            content += 'You lost ' + deathData.lostCurrency + ' ' + game.aliases.currency + '.<br>';
        if (deathData.lostExperience != undefined)
            content += 'You lost ' + deathData.lostExperience + ' experience.<br>';

        //Show custom death dialog

        ui.dialogs.custom(content, ['Respawn'], [function() {
            //Send respawn package to server

            channel.emit('CLIENT_RESPAWN_PLAYER');

            //Show UI

            ui.show();
        }]);
    },
    setTarget: function(go, target) {
        if (player.target === target)
            return false;

        player.target = target;
        player.faceMouse();

        if (go != undefined)
            go.ShowColorOverlay('rgba(255, 255, 255, .5)', 5);

        //Show or hide target UI
        //based on the target

        if (target == undefined)
            this.resetTarget();
        else if (go != undefined)
            ui.target.show(go);

        return true;
    },
    resetTarget: function() {
        delete player.target;

        //Hide target UI

        ui.target.hide();
    },

    forceDirection:
    {
        start: function(dir) {
            let target = game.players[game.player];

            target._direction = dir;
            this.direction = dir;

            this.cur = 0;
        },
        reset: function() {
            this.direction = -1;
        },
        direction: -1,
        cur: 0,
        standard: 12
    },
    faceMouse: function()
    {
        //Calculate center point

        let centerX = lx.GetDimensions().width/2,
            centerY = lx.GetDimensions().height/2;

        if (properties.lockCamera) {
            let pos = game.players[game.player].ScreenPosition();

            centerX = pos.X+game.players[game.player].SIZE.W/2;
            centerY = pos.Y+game.players[game.player].SIZE.H/2;
        }

        //Calculate delta

        let dx = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-centerX,
            dy = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-centerY;

        //Calculate new direction

        let newDirection;
        if (Math.abs(dx) > Math.abs(dy))
            if (dx > 0) 
                newDirection = 2;
            else 
                newDirection = 1;
        else
            if (dy > 0) 
                newDirection = 0;
            else 
                newDirection = 3;

        //Only force new direction if possible

        if (game.players[game.player]._moving ||
            newDirection !== game.players[game.player]._direction) {
            this.forceDirection.start(newDirection);
            this.sync('direction');
        }
    },
    loseFocus: function()
    {
        //Check if the player exists

        if (game.player === -1)
            return;

        //Make sure the player exists
        //in the buffer

        if (game.players[game.player].BUFFER_ID === -1)
            game.players[game.player].Show(3);

        //Reset movement

        game.players[game.player].Movement(0, 0);

        //Reset player target

        player.resetTarget();

        //Remove controller targeting

        lx.CONTEXT.CONTROLLER.TARGET = undefined;
    },
    restoreFocus: function() {
        //Reset the Lynx2D controller target

        lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

        //Create the player action element rendering loop

        player.createActionElementRenderingLoop();
    },
    propertyInteraction:
    {
        cooldown: {
            update: function() {
                if (!this.on)
                    return;

                this.cur++;

                if (this.cur >= this.standard) {
                    this.cur = 0;

                    this.on = false;
                }
            },
            on: false,
            cur: 0,
            standard: 60
        },
        interact: function() {
            if (this.cooldown.on)
                return;

            channel.emit('CLIENT_INTERACT_PROPERTIES');

            this.cooldown.on = true;
        }
    },

    setCollider: function(collider)
    {
        game.players[game.player].ClearCollider();

        game.players[game.player].ApplyCollider(
            new lx.BoxCollider(
                collider.x,
                collider.y,
                collider.width,
                collider.height,
                false
            )
        );
    },
    setMovement: function(go, movement)
    {
        //Set unique movement controller,
        //this is done for each key (WASD).

        lx.CONTEXT.CONTROLLER.TARGET = go;

        [{ k: 'W', v: { x: 0, y: -1 }},
         { k: 'A', v: { x: -1, y: 0 }},
         { k: 'S', v: { x: 0, y: 1 }},
         { k: 'D', v: { x: 1, y: 0 }}]
        .forEach(function(key) {
            lx.ClearKey(key.k);
            lx.OnKey(key.k, function(data) {
                if (lx.CONTEXT.CONTROLLER.TARGET != undefined) {
                    if (data.state === 0) {
                        player.moving = false;

                        if (key.v.x !== 0)
                            lx.CONTEXT.CONTROLLER.TARGET.MOVEMENT.VX = 0;
                        if (key.v.y !== 0)
                            lx.CONTEXT.CONTROLLER.TARGET.MOVEMENT.VY = 0;

                        return;
                    }

                    if (player.casting != undefined)
                        player.cancelCastAction();

                    player.moving = true;

                    let maxVel = movement.max * player.statusEffectsMatrix['movementSpeedFactor'];
                    game.players[game.player].MaxVelocity(maxVel);
    
                    if (ui === undefined || !ui.chat.isTyping())
                        lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(
                            key.v.x*maxVel, 
                            key.v.y*maxVel
                        );
                }
            });
        });
    },
    setEquipment: function(equipment)
    {
        if (equipment.remove === undefined || !equipment.remove) {
            this.equipment[equipment.equippable] = equipment;

            if (equipment.equippableSource !== '')
                this.equipment[equipment.equippable]._sprite = manager.getSprite(equipment.equippableSource);
        }
        else
            this.equipment[equipment.equippable] = undefined;
    },
    setExperience: function(exp)
    {
        if (this.exp != undefined) {
            let delta = 0;

            if (exp > this.exp)
                delta = exp-this.exp;
            else
                delta = this.expTarget-this.exp+exp;

            ui.floaties.experienceFloaty(game.players[game.player], delta);
        }

        this.exp = exp;

        ui.status.setExperience(this.exp, this.expTarget);
    },
    setAttributes: function(attributes)
    {
        this.attributes = attributes;

        ui.profile.reloadAttributes();
    },
    setPoints: function(points)
    {
        this.points = points;

        ui.profile.reloadPoints();
    },
    setQuests: function(quests)
    {
        //Check if quests have been completed

        for (let q in this.quests)
            if (quests[q] == undefined)
                ui.chat.addMessage('Completed "' + q + '"!');

        //Set quests

        this.quests = quests;

        //Reload UI

        ui.quests.reload();
    },
    acceptQuest: function(target, type, id)
    {
        //Send request

        channel.emit('CLIENT_ACCEPT_QUEST', { 
            owner: target, 
            type: type, 
            id: id 
        });
    },
    requestExpTarget: function()
    {
        channel.emit('CLIENT_REQUEST_EXP');
    },

    setActions: function(actions)
    {
        this.actions = actions;

        ui.actionbar.reload();
    },
    castAction: function(slot, elapsedTime) {
        //Apply status effects matrix to the casting time

        let castingTime = this.actions[slot].castingTime;
        castingTime *= this.statusEffectsMatrix['castingTimeFactor'];

        //Check if casting time is immediate

        if (castingTime === 0)
            return;

        //Set currently casting slot

        this.casting = slot;

        //Grab gameobject

        let go = game.players[game.player];

        //Set progress and icon

        go._castingBar._target = castingTime * (1000/60);
        go._castingBar.Progress(
            elapsedTime / go._castingBar._target * 100
        );

        go._castingIcon.SPRITE = manager.getSprite(this.actions[slot].src);

        //Show casting bar

        go._castingBar.Show();
        go._castingIcon.Show();

        //Set UI

        ui.actionbar.setCasting(slot, castingTime);

        //Set casting animation state

        animation.setAnimationState(game.players[game.player], 'casting');
    },
    cancelCastAction: function() {
        if (player.casting == undefined)
            return;

        //remove currently casting slot

        player.casting = undefined;

        //Hide casting bar and icon

        game.players[game.player]._castingBar.Hide();
        game.players[game.player]._castingIcon.Hide();

        //Remove UI

        ui.actionbar.removeCasting(this.casting);

        //Force idle animation state

        animation.setAnimationState(game.players[game.player], 'idle');
    },
    removeAction: function(slot)
    {
        this.actions[slot] = undefined;

        ui.actionbar.reloadAction(slot);
    },
    performAction: function(slot, skipFacing)
    {
        //Check if valid

        if (player.actions[slot] == undefined)
            return;

        //Apply status effects matrix to the casting time

        let castingTime = player.actions[slot].castingTime;
        castingTime *= player.statusEffectsMatrix['castingTimeFactor'];

        //Check if moving and casting is
        //required

        if (player.moving && castingTime > 0)
            return;

        //Check if cooldown and the cooldown
        //is significantly large enough to
        //give the player feedback
        
        if (ui.actionbar.onCooldown[slot] != undefined) {
            ui.floaties.errorFloaty(
                game.players[game.player], 
                player.actions[slot].name + ' is on cooldown.'
            );

            return;
        }

        //Check mana usage

        if (game.players[game.player]._mana.cur + player.actions[slot].mana < 0) {
            ui.floaties.errorFloaty(
                game.players[game.player], 
                'Not enough mana.'
            );

            return;
        }

        //Check if already casting another spell,
        //if so cancel casting - if it is the same
        //spell simply return

        if (player.casting !== slot)
            player.cancelCastAction();
        else if (player.casting === slot)
            return;

        //Check if action requires a target,
        //in this case only if a hostile target
        //is required

        if (player.actions[slot].targetType === 'hostile') {
            if (player.target == undefined) {
                ui.floaties.errorFloaty(
                    game.players[game.player], 
                    'No target selected.'
                );

                return;
            }
        }

        if (player.actions[slot].targetType !== 'none') {
            let targetPos = game.getPlayerActionPosition(player.actions[slot].targetType);

            let pos  = game.players[game.player].Position();
            let size = game.players[game.player].Size();

            if (targetPos == undefined)
                targetPos = { 
                    X: pos.X + size.W / 2,
                    Y: pos.Y + size.H / 2
                };

            let distance = game.calculateTileDistance(
                { 
                    X: pos.X + size.W / 2,
                    Y: pos.Y + size.H / 2
                }, 
                targetPos, 
                tiled.tile.width, 
                tiled.tile.height
            );

            if (distance.x > player.actions[slot].maxRange ||
                distance.y > player.actions[slot].maxRange) {
                ui.floaties.errorFloaty(
                    game.players[game.player], 
                    'Out of range.'
                );

                return;
            }
        }

        //Check if target exists

        if (player.target == undefined && player.actions[slot].targetType !== 'friendly')
            return;

        //Face mouse, if necessary

        if (!skipFacing)
            player.faceMouse();

        //Send action request

        channel.emit('CLIENT_PLAYER_ACTION', {
            slot: slot,
            target: player.target
        });
    },

    setStatusEffects: function(statusEffects) {
        //Set player status effects,
        //check if effects have been
        //added or removed

        for (let effect in statusEffects) {
            if (this.statusEffects[effect] == undefined) {
                //Status effect addition

                this.statusEffects[effect] = statusEffects[effect];

                //Play a possible sound effect,
                //if available

                game.playStatusEffectSoundEffect(
                    statusEffects[effect].sounds,
                    game.npcs[id].Position(),
                    game.npcs[id].Size()
                );
            }
            else {
                //Play a possible sound effect,
                //if available

                if (this.statusEffects[effect].elapsed > statusEffects[effect].elapsed)
                    this.playStatusEffectSoundEffect(
                        statusEffects[effect].sounds,
                        game.npcs[id].Position(),
                        game.npcs[id].Size()
                    );

                //Set elapsed

                this.statusEffects[effect].elapsed = statusEffects[effect].elapsed;
            }
        }

        for (let effect in this.statusEffects) {
            if (this.statusEffects[effect] &&
                statusEffects[effect] == undefined) {
                //Status effect removal

                delete this.statusEffects[effect];
            }
        }

        //Reload UI

        ui.statusEffects.reload();

        //Calculate status effect matrix

        player.statusEffectsMatrix = game.calculateStatusEffectsMatrix(player.statusEffects);
    },

    unequip: function(equippable)
    {
        if (this.equipment[equippable] === undefined)
            return;

        ui.inventory.removeDisplayBox();

        channel.emit('CLIENT_UNEQUIP_ITEM', equippable);
    },
    getEquipmentSprite: function(equippable)
    {
        if (player.equipment[equippable] !== undefined &&
            player.equipment[equippable]._sprite !== undefined)
            return player.equipment[equippable]._sprite;
    },
    getInventorySlot: function(name)
    {
        for (let i = 0; i < this.inventory.length; i++)
            if (this.inventory[i] != undefined &&
                this.inventory[i].name === name)
                return i;
    },

    createActionElementRenderingLoop: function() {
        //Setup action element drawing

        lx.OnLayerDraw(2, () => {
            //Draw action elements, if necessary

            for (let a = 0; a < player.actions.length; a++)
                if (player.actions[a]
                &&  player.actions[a].renderFrames)
                    player.renderActionElements(player.actions[a].elements);
        });
    },
    renderActionElements: function(elements) {
        if (elements == undefined)
            return;

        //Squash factor that determines the
        //circle height squash, this gives
        //the illusion that there is depth

        let squashFactor = .25;

        //Grab target position

        let pos = game.getPlayerActionPosition(elements.targetType);
        if (pos == undefined)
            return;

        for (let f = 0; f < elements.frames.length; f++) {
            let frame = elements.frames[f];

            //Check if cached frame sprite is available

            if (!frame._cachedSprite) {
                let canvas = new lx.Canvas(frame.w * frame.scale, frame.h * frame.scale);

                canvas.Draw((gfx) => {
                    gfx.beginPath();

                    gfx.ellipse(
                        frame.w / 2, 
                        frame.h / 2, 
                        frame.w * frame.scale / 2, 
                        frame.h * frame.scale / 2,
                        Math.PI / 4, 
                        0, 
                        2 * Math.PI
                    );

                    //Draw filling

                    gfx.fillStyle = '#43BFC7';
                    gfx.globalAlpha = .25;
                    gfx.fill();

                    //Draw border

                    gfx.lineWidth = 2;
                    gfx.strokeStyle = '#43BFC7';
                    gfx.globalAlpha = .75;
                    gfx.stroke();
                });

                frame._cachedSprite = new lx.Sprite(canvas);
            }

            let sprite = frame._cachedSprite;

            let x = frame.x;
            let y = frame.y;
            let w = frame.w * frame.scale;
            let h = frame.h * frame.scale;

            //Change position based on player
            //direction, if the target type
            //is none

            if (elements.targetType === 'none') {
                let direction = game.players[game.player]._direction;
                switch (direction) {
                    case 1:
                    case 2:
                        x = frame.y;
                        y = frame.x;

                        if (direction === 1)
                            x = elements.sw - x - w;
                        break;
                    case 3:
                        y = elements.sh - frame.y - h;
                        break;
                }
            }

            //Final translation

            x += pos.X - elements.sw / 2;
            y += pos.Y - elements.sh / 2;

            lx.DrawSprite(
                sprite, 
                x, 
                y + h * squashFactor, 
                sprite.Size().W, 
                sprite.Size().H * (1 - squashFactor)
            );

            //If projectile, draw arrow

            //TODO: Clean this up, use
            //      lx.Draw when implemented

            if (frame.type === 'projectile') {
                lx.CONTEXT.GRAPHICS.save();

                //Get projectile distance

                let scale = lx.Scale();
                let projectileDistance = (tiled.tile.width + tiled.tile.height) / 2 * scale;

                //Get direction unit vector

                let dx = (x + w / 2) - pos.X;
                let dy = (y + h / 2) - pos.Y;

                let len = Math.sqrt(dx * dx + dy * dy);
                dx /= len;
                dy /= len;

                //Calculate end position in screen space

                let screenPos = lx.GAME.TRANSLATE_FROM_FOCUS({ X: x, Y: y });
                let startX = screenPos.X + w * scale / 2 + h * squashFactor;
                let startY = screenPos.Y + h * scale / 2;
                let endX = startX + projectileDistance * dx
                let endY = startY + projectileDistance * dy;

                //Draw arrow

                lx.CONTEXT.GRAPHICS.beginPath();

                lx.CONTEXT.GRAPHICS.moveTo(startX, startY);
                lx.CONTEXT.GRAPHICS.lineTo(endX, endY);

                lx.CONTEXT.GRAPHICS.lineCap = 'round';
                lx.CONTEXT.GRAPHICS.lineWidth = 2 * scale;
                lx.CONTEXT.GRAPHICS.strokeStyle = '#43BFC7';
                lx.CONTEXT.GRAPHICS.globalAlpha = .75;
                lx.CONTEXT.GRAPHICS.stroke();

                lx.CONTEXT.GRAPHICS.restore();
            }
        }
    },

    update: function()
    {
        //Update property interaction

        player.propertyInteraction.cooldown.update();

        //Update casting bar

        this._castingBar.SIZE.W = this.SIZE.W;

        //Update movement

        if (this.MOVEMENT.VX != 0 || this.MOVEMENT.VY != 0) {
            //Cancel casting

            if (player.casting != undefined)
                player.cancelCastAction();

            //Handle movement

            if (player.forceDirection.direction == -1) {
                let oldDir = this._direction;

                if (this.MOVEMENT.VX < 0)
                    this._direction = 1;
                else if (this.MOVEMENT.VX > 0)
                    this._direction = 2;
                else if (this.MOVEMENT.VY > 0)
                    this._direction = 0;
                else if (this.MOVEMENT.VY < 0)
                    this._direction = 3;

                if (oldDir != this._direction)
                    player.sync('direction');
            } else {
                player.forceDirection.cur++;

                if (player.forceDirection.cur >= player.forceDirection.standard)
                    player.forceDirection.reset();
            }

            if (!this._moving) {
                this._moving = true;

                player.sync('moving');
            }

            player.sync('position');
        } else {
            player.forceDirection.reset();

            if (this._moving) {
                this._moving = false;

                player.sync('moving');
            }
        }

        //Animate

        animation.animate(this, player.statusEffectsMatrix);   
    },
    //This gets called before rendering the player
    preDraws: function() 
    {
        //Set and render equipment based on direction

        let equipment = [];

        switch (this._direction) {
            case 1:
                equipment.push(player.getEquipmentSprite('main'));
                break;
            case 2:
                equipment.push(player.getEquipmentSprite('offhand'));
                break;
        }

        for (let i = 0; i < equipment.length; i++) {
            if (equipment[i] == undefined || this.Sprite() == undefined)
                continue;

            equipment[i].CLIP = this.Sprite().CLIP;
            
            lx.DrawSprite(equipment[i], this.POS.X, this.POS.Y);
        }
    },
    //This gets called after rendering the player
    draws: function()
    {
        //Draw all generic equipment

        let equipment = [];

        equipment.push(player.getEquipmentSprite('torso'));
        equipment.push(player.getEquipmentSprite('hands'));
        equipment.push(player.getEquipmentSprite('head'));
        equipment.push(player.getEquipmentSprite('legs'));
        equipment.push(player.getEquipmentSprite('feet'));

        //Set main and offhand equipment based on direction

        switch (this._direction) {
            case 0:
                equipment.push(player.getEquipmentSprite('main'));
                equipment.push(player.getEquipmentSprite('offhand'));
                break;
            case 1:
                equipment.push(player.getEquipmentSprite('offhand'));
                break;
            case 2:
                equipment.push(player.getEquipmentSprite('main'));
                break;
            case 3:
                equipment.push(player.getEquipmentSprite('offhand'));
                equipment.push(player.getEquipmentSprite('main'));
                break;
        }

        //Render all equipment

        for (let i = 0; i < equipment.length; i++) {
            if (equipment[i] == undefined || this.Sprite() == undefined)
                continue;

            equipment[i].CLIP = this.Sprite().CLIP;

            lx.DrawSprite(equipment[i], this.POS.X, this.POS.Y);
        }
    },
    onMouse: function() {
        if (player.setTarget(game.players[game.player], undefined))
            lx.StopMouse(0);
    },

    sync: function(type) {
        let data = {};

        switch(type)
        {
            case 'moving':
                data.moving = game.players[game.player]._moving;
                break;
            case 'position':
                data.pos = game.players[game.player].Position();
                break;
            case 'direction':
                data.direction = game.players[game.player]._direction;
                break;
        }

        channel.emit('CLIENT_PLAYER_UPDATE', data);
    }
};
