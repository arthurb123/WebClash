const game = {
    player: -1,
    players: [],
    getPlayerIndex: function(name) {
        //Grab the player index by checking for the player name
        
        for (let i = 0; i < this.players.length; i++)
            if (this.players[i].name == name) return i;
        
        return -1;
    },
    instantiatePlayer: function() {
        //Instantiate Lynx2D GameObject for player
        
        this.players.push(
            new lx.GameObject(undefined, 0, 0, 64, 64)
                .SetTopDownController(.25, .25, 2.5)
                .Focus()
                .Show(2)
        );  
        
        this.player = this.players.length-1;
    },
    instantiateOther: function() {
        //Instantiate Lynx2D GameObject for other player
        
        this.players.push(
            new lx.GameObject(undefined, 0, 0, 64, 64)
                .Show(2)
        );  
    },
    initialize: function() {
        //Initialize and start Lynx2D
        
        lx.Initialize(document.title);
        lx.Start(60);
    }
};