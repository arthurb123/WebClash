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
        
        let go = new lx.GameObject(undefined, 0, 0, 64, 64);
        
        go.name = name;
        
        this.players.push(go.Show(2));  
    },
    removePlayer: function(id) {
        //Check if valid
        
        if (id === undefined || this.players[id] === undefined)
            return;
        
        //Hide target GameObject
        
        this.players[id].Hide();
        
        //Remove target
        
        this.players.splice(id, 1);
    },
    loadMap: function(map) {
        //Clear the OnLayerDraw events
        
        lx.ResetLayerDraw();
        
        //Add OnLayerDraw events based on
        //the map content
        
        for (let l = 0; l < map.layers.length; l++) {
            const data = map.layers[l].data,
                  width = map.layers[l].width,
                  height = map.layers[l].height;
            
            lx.OnLayerDraw(l, function(gfx) {
                for (let t = 0; t < data.length; t++)
                {
                    //Skip empty tiles
                    
                    if (data[t] == 0)
                        continue;
                    
                    //Get corresponding tile sprite
                    
                    let sprite;
                    
                    for (let i = 0; i < map.tilesets.length; i++) {
                        const tileset = map.tilesets[i];
                        
                        if (data[t] >= tileset.firstgid) {
                            let s = tileset.source.lastIndexOf('/')+1;
                            
                            sprite = game.getTileset('res/tilesets/' + tileset.source.substr(s, tileset.source.lastIndexOf('.')-s) + '.png');
                        }
                    }
                    
                    //Check if sprite is valid
                    
                    if (sprite === undefined)
                        continue;
                    
                    //Calculate tile coordinates
                    
                    let tc = {
                        x: (data[t] % Math.round(sprite.Size().W/map.tilewidth) - 1) * map.tilewidth,
                        y: (Math.ceil(data[t] / Math.round(sprite.Size().W/map.tilewidth)) -1) * map.tileheight
                    },
                        tp = {
                        x: (t % width - 1) * map.tilewidth,
                        y: Math.floor(t / width) * map.tileheight       
                    };
                    
                    //Draw tile
                    
                    lx.DrawSprite(
                        sprite.Clip(tc.x, tc.y, map.tilewidth, map.tileheight),
                        
                        tp.x,
                        tp.y, 
                        
                        map.tilewidth,
                        map.tileheight
                    );
                }
            });
        }
    },
    getTileset: function(src) {
        if (this.tilesets[src] === undefined)
            this.tilesets[src] = new lx.Sprite(src);
        
        this.tilesets[src].CLIP = undefined;
        
        return this.tilesets[src];
    },
    initialize: function() {
        //Initialize and start Lynx2D
        
        lx.Initialize(document.title);
        lx.Start(60);
    }
};