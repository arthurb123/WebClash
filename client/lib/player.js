const player = {
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
          .Focus();
        
        go.name = name;
        go._direction = 0;
        go._moving = false;
        go._facing = false;
        
        game.players.push(go.Show(3));  
        
        //Pretty temporary code
        
        lx.OnMouse(0, function(data) {
            if (data.state == 0)
                return;
            
            player.faceMouse();
            
            socket.emit('CLIENT_PLAYER_ACTION', 'Slash');
            
            lx.StopMouse(0);
        });
        
        //Pretty temporary code
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
    sync: function(type)
    {
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