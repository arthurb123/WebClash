const player = {
    instantiate: function() {
        game.players.push(
            new lx.GameObject(undefined, 0, 0, 64, 64)
                .SetTopDownController(.25, .25, 2.5)
                .Loops(player.update)
                .Focus()
                .Show(2)
        );  
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