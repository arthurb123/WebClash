const player = {
    instantiate: function(name) {
        let go = new lx.GameObject(undefined, 0, 0, 64, 64);
        
        go.SetTopDownController(.25, .25, 2.5)
          .Loops(player.update)
          .Focus();
        
        go.name = name;
        go._direction = 0;
        
        game.players.push(go.Show(2));  
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
            
            player.sync('movement');
            player.sync('position');
        }
        
        animation.animateMoving(this);
    },
    sync: function(type)
    {
        let data = {};
        
        switch(type)
        {
            case 'movement':
                data.movement = game.players[game.player].Movement();
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