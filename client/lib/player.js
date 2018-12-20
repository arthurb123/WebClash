const player = {
    instantiate: function(name) {
        let go = new lx.GameObject(undefined, 0, 0, 64, 64);
        
        go.SetTopDownController(.25, .25, 2.5)
          .Loops(player.update)
          .Focus();
        
        go.name = name;
        
        game.players.push(go.Show(2));  
    },
    update: function() {
        if (this.MOVEMENT.VX != 0 || this.MOVEMENT.VY != 0)
            player.sync('movement');
    },
    sync: function(type)
    {
        let data = {};
        
        switch(type)
        {
            case 'movement':
                data.movement = game.players[game.player].Movement();
                break;
            //...
        }
        
        socket.emit('CLIENT_PLAYER_UPDATE', data);
    }
};