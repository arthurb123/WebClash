const game = {
    player: -1,
    players: [],
    getPlayerIndex: function(name) {
        //Grab the player index by checking for the player name
        
        for (let i = 0; i < this.players.length; i++)
            if (this.players[i].name == name) return i;
        
        return -1;
    },
    instantiatePlayer: function(name) {
        //Instantiate Lynx2D GameObject for player
        
        player.instantiate(name);
        
        this.player = this.players.length-1;
    },
    instantiateOther: function(name) {
        //Instantiate Lynx2D GameObject for other player
        
        let go = new lx.GameObject(undefined, 0, 0, 64, 64);
        
        go.name = name;
        
        this.players.push(go.Show(2));  
    },
    initialize: function() {
        //Initialize and start Lynx2D
        
        lx.Initialize(document.title);
        lx.Start(60);
    }
};