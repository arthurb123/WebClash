const player = {
    actions: [],
    inventory: [],
    equipment: {},
    forceFrame: {
        start: function(dir) {
            game.players[game.player]._direction = dir;
            
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
    instantiate: function(name) {
        let go = new lx.GameObject(undefined, 0, 0, 0, 0);
        
        go.Loops(player.update)
          .Draws(player.draws)
          .Focus();
        
        go.name = name;
        go._direction = 0;
        go._moving = false;
        go._facing = false;
        
        game.players.push(go.Show(3));  
        
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
                if (data.state == 0)
                    return;
                
                player.performAction(i+1);
            });
        
        //Request xp target
        
        player.requestExpTarget();
    },
    setCollider: function(collider) {
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
    setMovement: function(movement) {
        game.players[game.player].SetTopDownController(
            movement.acceleration, 
            movement.acceleration, 
            movement.max
        );  
    },
    setActions: function(actions) {
        this.actions = actions;
        
        ui.actionbar.reload();
    },
    setEquipment: function(equipment) {
        if (equipment.remove === undefined || !equipment.remove) {
            this.equipment[equipment.equippable] = equipment;  
            
            if (equipment.equippableSource !== '')
                this.equipment[equipment.equippable]._sprite = new lx.Sprite(equipment.equippableSource);
        } 
        else
            this.equipment[equipment.equippable] = undefined;
    },
    requestExpTarget: function() {
        socket.emit('CLIENT_REQUEST_EXP', function(data) {
            game.players[game.player]._expTarget = data; 
        
            if (game.players[game.player]._stats != undefined)
                ui.status.setExperience(game.players[game.player]._stats.exp, game.players[game.player]._expTarget);
        });
    },
    faceMouse: function() {
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
    performAction: function(slot) {
        //Check if valid
        
        if (player.actions[slot] == undefined)
            return;
        
        //Check if cooldown
        
        if (game.players[game.player].actions_cooldown != undefined &&
            game.players[game.player].actions_cooldown[slot] > 0)
            return;
        
        //Face mouse
        
        player.faceMouse();
        
        //Send action request
            
        socket.emit('CLIENT_PLAYER_ACTION', slot, function(data) {
            if (data && player.actions[slot] != undefined) {
                //Set cooldown
                
                ui.actionbar.setCooldown(slot);
                
                //Decrease usage
                
                if (player.actions[slot].uses !== undefined) {
                    player.actions[slot].uses--;
                    
                    ui.actionbar.reload();
                }
            }
        });
    },
    unequip: function(equippable) {
        if (this.equipment[equippable] === undefined)
            return;
        
        ui.inventory.removeBox();
        
        socket.emit('CLIENT_UNEQUIP_ITEM', equippable);
    },
    update: function() {
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
            
            if (!game.players[game.player]._moving) {
                game.players[game.player]._moving = true;
                
                player.sync('moving');
            }
            
            player.sync('position');
        } else {   
            player.forceFrame.reset();
            
            if (game.players[game.player]._moving) {
                game.players[game.player]._moving = false;
                
                player.sync('moving');
            }
        }
    
        animation.animateMoving(this);
    },
    draws: function() {
        let equipment = [];
        
        if (player.equipment['torso'] !== undefined &&
            player.equipment['torso']._sprite !== undefined)
            equipment.push(player.equipment['hands']._sprite);
        
        if (player.equipment['hands'] !== undefined &&
            player.equipment['hands']._sprite !== undefined)
            equipment.push(player.equipment['hands']._sprite);
        
        if (player.equipment['head'] !== undefined &&
            player.equipment['head']._sprite !== undefined)
            equipment.push(player.equipment['head']._sprite);
        
        if (player.equipment['feet'] !== undefined &&
            player.equipment['feet']._sprite !== undefined)
            equipment.push(player.equipment['feet']._sprite);
        
        if (player.equipment['legs'] !== undefined &&
            player.equipment['legs']._sprite !== undefined)
            equipment.push(player.equipment['legs']._sprite);
        
        if (player.equipment['main'] !== undefined &&
            player.equipment['main']._sprite !== undefined)
            equipment.push(player.equipment['main']._sprite);
        
        if (player.equipment['offhand'] !== undefined &&
            player.equipment['offhand']._sprite !== undefined)
            equipment.push(player.equipment['offhand']._sprite);
        
        for (let i = 0; i < equipment.length; i++) {
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