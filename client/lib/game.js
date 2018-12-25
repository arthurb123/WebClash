const game = {
    player: -1,
    players: [],
    tilesets: [],
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
        
        let go = new lx.GameObject(undefined, 0, 0, 0, 0)
            .Loops(function() {
                animation.animateMoving(go);
                
                if (go._nameplate.Position().X == 0 &&
                    go._nameplate.Position().Y == 0)
                    go._nameplate.Position(go.Size().W/2, -Math.floor(go.Size().H/5));
            });
        
        go.name = name;
        
        go._nameplate = new lx.UIText(name, 0, 0, 14)
            .Alignment('center')
            .Follows(go)
            .Show();
        
        this.players.push(go.Show(2));  
    },
    removePlayer: function(id) {
        //Check if valid
        
        if (id === undefined || this.players[id] === undefined)
            return;
        
        //Hide target GameObject
        
        this.players[id].Hide();
        this.players[id]._nameplate.Hide();
        
        //Get player name
        
        let name = game.players[game.player].name;
        
        //Remove target
        
        this.players.splice(id, 1);
        
        //Reset player ID
        
        this.player = this.getPlayerIndex(name);
    },
    loadMap: function(map) {
        tiled.convertAndLoadMap(map);
        
        //...
    },
    getTileset: function(src) {
        if (this.tilesets[src] === undefined)
            this.tilesets[src] = new lx.Sprite(src);
        
        this.tilesets[src].CLIP = undefined;
        
        return this.tilesets[src];
    },
    initialize: function() {
        //Initialize and start Lynx2D
        
        lx
            .Initialize(document.title)
            .Smoothing(false)
            .Start(60);
    }
};