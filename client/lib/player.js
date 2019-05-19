const player = {
    actions: [],
    inventory: [],
    equipment: {},
    quests: {},
    forceFrame:
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
    loseFocus: function()
    {
        game.players[game.player].Movement(0, 0);

        lx.CONTEXT.CONTROLLER.TARGET = undefined;
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

            socket.emit('CLIENT_INTERACT_PROPERTIES');

            this.cooldown.on = true;
        }
    },
    instantiate: function(name)
    {
        let go = new lx.GameObject(undefined, 0, 0, 0, 0);

        go.Loops(player.update)
          .Draws(player.draws)
          .MovementDecelerates(false)
          .Focus();

        go.name = name;
        go._direction = 0;
        go._moving = false;
        go._facing = false;

        game.players.push(go.Show(3));

        //Add event handlers if not on mobile

        if (!game.isMobile) {
            //Mouse event handlers

            lx.OnMouse(0, function(data) {
                if (data.state == 0)
                    return;

                player.performAction(0);
            });
            lx.OnMouse(2, function(data) {
                if (data.state == 0)
                    return;

                player.performAction(1);
            });

            //Key event handlers

            for (let i = 1; i < 6; i++)
                lx.OnKey(i, function(data) {
                    if (data.state == 0 || 
                        ui.chat.isTyping())
                        return;

                    player.performAction(i+1);
                });
        }

        //Request xp target

        player.requestExpTarget();
    },
    setCollider: function(collider)
    {
        game.players[game.player].ClearCollider();

        game.players[game.player].ApplyCollider(
            new lx.Collider(
                collider.x,
                collider.y,
                collider.width,
                collider.height,
                false
            )
        );
    },
    setMovement: function(movement)
    {
        //Set unique movement controller,
        //this is done for each key (WASD).

        lx.CONTEXT.CONTROLLER.TARGET = this;

        [{ k: 'W', v: { x: 0, y: -1 }},
         { k: 'A', v: { x: -1, y: 0 }},
         { k: 'S', v: { x: 0, y: 1 }},
         { k: 'D', v: { x: 1, y: 0 }}]
        .forEach(function(key) {
            lx.ClearKey(key.k);
            lx.OnKey(key.k, function(data) {
                if (lx.CONTEXT.CONTROLLER.TARGET != undefined) {
                    if (data.state === 0) {
                        if (key.v.x !== 0)
                            lx.CONTEXT.CONTROLLER.TARGET.MOVEMENT.VX = 0;
                        if (key.v.y !== 0)
                            lx.CONTEXT.CONTROLLER.TARGET.MOVEMENT.VY = 0;
                        return;
                    }
    
                    if (ui === undefined || !ui.chat.isTyping())
                        lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(
                            key.v.x*movement.max, 
                            key.v.y*movement.max
                        );
                }
            });
        });

        game.players[game.player].MaxVelocity(movement.max);
    },
    setActions: function(actions)
    {
        this.actions = actions;

        ui.actionbar.reload();
    },
    removeAction: function(slot)
    {
        this.actions[slot] = undefined;

        ui.actionbar.reloadAction(slot);
    },
    setEquipment: function(equipment)
    {
        if (equipment.remove === undefined || !equipment.remove) {
            this.equipment[equipment.equippable] = equipment;

            if (equipment.equippableSource !== '')
                this.equipment[equipment.equippable]._sprite = cache.getSprite(equipment.equippableSource);
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
    acceptQuest: function(target, id)
    {
        //Send request

        socket.emit('CLIENT_ACCEPT_QUEST', { npc: target, id: id }, function(name) {
            ui.chat.addMessage('Accepted "' + name + '".');
        });
    },
    requestExpTarget: function()
    {
        socket.emit('CLIENT_REQUEST_EXP', function(data) {
            player.expTarget = data;

            if (player.exp != undefined)
                ui.status.setExperience(player.exp, player.expTarget);
        });
    },
    faceMouse: function()
    {
        let dx = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-lx.GetDimensions().width/2,
            dy = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-lx.GetDimensions().height/2;

        if (Math.abs(dx) > Math.abs(dy))
            if (dx > 0) this.forceFrame.start(2);
            else this.forceFrame.start(1);
        else
            if (dy > 0) this.forceFrame.start(0);
            else this.forceFrame.start(3);

        this.sync('direction');
    },
    performAction: function(slot)
    {
        //Check if valid

        if (player.actions[slot] == undefined)
            return;

        //Check if cooldown

        if (game.players[game.player].actions_cooldown != undefined &&
            game.players[game.player].actions_cooldown[slot] > 0)
            return;

        //Face mouse

        if (!game.isMobile)
            player.faceMouse();

        //Send action request

        socket.emit('CLIENT_PLAYER_ACTION', slot, function(data) {
            if (data && player.actions[slot] != undefined) {
                //Action name

                let name = player.actions[slot].name;

                //Decrease usage

                if (player.actions[slot].uses !== undefined) {
                    player.actions[slot].uses--;

                    if (player.actions[slot].uses <= 0)
                        player.removeAction(slot);
                    else
                        ui.actionbar.reloadAction(slot);
                }

                //Set cooldown

                for (let a = 0; a < player.actions.length; a++)
                    if (player.actions[a] != undefined &&
                        player.actions[a].name === name)
                        ui.actionbar.setCooldown(a);
            }
        });
    },
    unequip: function(equippable)
    {
        if (this.equipment[equippable] === undefined)
            return;

        ui.inventory.removeBox();

        let sounds = this.equipment[equippable].sounds;

        socket.emit('CLIENT_UNEQUIP_ITEM', equippable, function() {
            //Play item sound if possible

            if (sounds != undefined) {
                let sound = audio.getRandomSound(sounds);

                if (sound != undefined)
                   audio.playSound(sound);
            }
        });
    },
    getEquipmentSprite: function(equippable)
    {
        if (player.equipment[equippable] !== undefined &&
            player.equipment[equippable]._sprite !== undefined)
            return player.equipment[equippable]._sprite;
    },

    update: function()
    {
        player.propertyInteraction.cooldown.update();

        this.POS.X = Math.round(this.POS.X);
        this.POS.Y = Math.round(this.POS.Y);

        if (this.MOVEMENT.VX != 0 || this.MOVEMENT.VY != 0) {
            if (player.forceFrame.direction == -1) {
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
                player.forceFrame.cur++;

                if (player.forceFrame.cur >= player.forceFrame.standard)
                    player.forceFrame.reset();
            }

            if (!this._moving) {
                this._moving = true;

                player.sync('moving');
            }

            player.sync('position');
        } else {
            player.forceFrame.reset();

            if (this._moving) {
                this._moving = false;

                player.sync('moving');
            }
        }

        animation.animateMoving(this);
    },
    draws: function()
    {
        let equipment = [];

        equipment.push(player.getEquipmentSprite('torso'));
        equipment.push(player.getEquipmentSprite('hands'));
        equipment.push(player.getEquipmentSprite('head'));
        equipment.push(player.getEquipmentSprite('legs'));
        equipment.push(player.getEquipmentSprite('feet'));

        if (this._direction == 1 || this._direction == 0) {
            equipment.push(player.getEquipmentSprite('main'));
            equipment.push(player.getEquipmentSprite('offhand'));
        }
        else if (this._direction == 2 || this._direction == 3) {
            equipment.push(player.getEquipmentSprite('offhand'));
            equipment.push(player.getEquipmentSprite('main'));
        }

        for (let i = 0; i < equipment.length; i++) {
            if (equipment[i] == undefined)
                continue;

            equipment[i].CLIP = this.SPRITE.CLIP;

            lx.DrawSprite(equipment[i], this.POS.X, this.POS.Y, this.POS.W, this.POS.H);
        }
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

        socket.emit('CLIENT_PLAYER_UPDATE', data);
    }
};
