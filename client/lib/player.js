const player = {
    instantiate: function(name) {
        let go = new lx.GameObject(undefined, 0, 0, 0, 0);
        
        go.SetTopDownController(.25, .25, 2.5)
          .Loops(player.update)
          .Focus();
        
        go.name = name;
        go._direction = 0;
        go._moving = false;
        
        game.players.push(go.Show(3));  
    },
    createCollider: function() {
        if (game.players[game.player] === undefined)
            return;
            
        let go = game.players[game.player];
        
        game.players[game.player].ApplyCollider(new lx.Collider(
            go.Size().W*.2875, 
            go.Size().H*.5, 
            go.Size().W*.425, 
            go.Size().H*.5, 
            false
        ));  
    },
    update: function() {
        if (this.MOVEMENT.VX != 0 || this.MOVEMENT.VY != 0) {
            var oldDir = this._direction;
            
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
            
            if (!game.players[game.player]._moving) {
                game.players[game.player]._moving = true;
                
                player.sync('moving');
            }
            
            player.sync('position');
        } else {         
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