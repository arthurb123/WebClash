const game = {
    player: -1,
    players: [],
    npcs: [],
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
                
                if (go._level !== undefined)
                    go._nameplate.Text('lvl ' + go._level + ' - ' + go.name);
            });
        
        go.name = name;
        go._moving = false;
        go._direction = 0;
        
        go._nameplate = new lx.UIText(name, 0, 0, 14)
            .Alignment('center')
            .Follows(go)
            .Show();
        
        go._nameplate.SHADOW = true;
        
        this.players.push(go.Show(2));  
    },
    setPlayerHealth: function(id, health) {
        if (this.players[id]._health !== undefined) {
            let delta = -(this.players[id]._health.cur-health.cur);
            
            if (delta > 0) {
                //Heal floaty
                
                ui.floaties.healFloaty(this.players[id], delta);
                
                return;
            }
            
            //Damage floaty
            
            ui.floaties.damageFloaty(this.players[id], delta);
            
            //Blood particles
            
            let count = -delta;
            if (count > 10)
                count = 10;
            
            for (let i = 0; i < count; i++) {
                let size = 4+Math.round(Math.random()*4);
                
                let blood = new lx.GameObject(
                    new lx.Sprite('res/particles/blood.png'),
                    this.players[id].POS.X+this.players[id].SIZE.W/2,
                    this.players[id].POS.Y+this.players[id].SIZE.H/2,
                    size,
                    size
                );
                
                blood.MaxVelocity(3);
                blood.AddVelocity(Math.round(Math.random()*-3+Math.random()*3), Math.round(Math.random()*-3+Math.random()*3));
                
                blood.Loops(function() {
                    if (blood.Movement().VX == 0 && blood.Movement().VY == 0)
                        blood.Hide();
                });
                
                blood.Show(1+Math.round(Math.random()));
            }
        }
        
        this.players[id]._health = health;
    },
    removePlayer: function(id) 
    {
        //Check if valid
        
        if (id === undefined || this.players[id] === undefined || this.player == id)
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
    resetPlayers: function() {
        //Cycle through all online players and
        //remove all, except for the player itself
        
        for (let i = 0; i < this.players.length; i++)
            if (i != this.player) 
                this.removePlayer(i);
    },
    resetPlayer: function() {
        //Check if the player exists
        
        if (this.player == -1)
            return;
        
        //Reset movement
        
        this.players[this.player].Movement(0, 0);
    },
    
    instantiateNPC: function(id, name) {
        //Instantiate Lynx2D GameObject for NPC
        
        let go = new lx.GameObject(undefined, 0, 0, 0, 0)
            .Loops(function() {
                animation.animateMoving(this);
                
                if (this._nameplate.Position().X == 0 &&
                    this._nameplate.Position().Y == 0)
                    this._nameplate.Position(this.Size().W/2, -Math.floor(this.Size().H/5));
                
                if (this._type == 'friendly')
                    this._nameplate.Color('black');
                else if (this._type == 'hostile')
                    this._nameplate.Color('red');
                
                if (this._stats !== undefined)
                    this._nameplate.Text('lvl ' + this._stats.level + ' - ' + this.name);
                
                if (this._health !== undefined)
                {    
                    if (this._healthbar === undefined) {
                        this._healthbarBack = new lx.UITexture('black', 0, -36, this.SIZE.W, 8).Follows(go);
                        this._healthbar = new lx.UITexture('red', 0, -36, this._health.cur/this._health.max*this.SIZE.W, 8).Follows(go);
                    } else {
                        this._healthbar.SIZE.W = this._health.cur/this._health.max*this.SIZE.W;
                    
                        if (this._health.cur == this._health.max)
                        {
                            this._healthbarBack.Hide();
                            this._healthbar.Hide();
                        } 
                        else 
                        {
                            this._healthbarBack.Show();
                            this._healthbar.Show();
                        }
                    }
                }
            });
        
        go.name = name;
        go._moving = false;
        go._direction = 0;
        
        go._nameplate = new lx.UIText(name, 0, 0, 14)
            .Alignment('center')
            .Follows(go)
            .Show();
        
        go._nameplate.SHADOW = true;
        
        this.npcs[id] = go.Show(2);
    },
    setNPCHealth: function(id, health) {
        if (this.npcs[id]._health !== undefined)
        {
            let delta = -(this.npcs[id]._health.cur-health.cur);
            
            if (delta > 0) {
                //Heal floaty
                
                ui.floaties.healFloaty(this.npcs[id], delta);
                
                return;
            }
            
            //Damage floaty
            
            ui.floaties.damageFloaty(this.npcs[id], delta);
            
            //Blood particles
            
            let count = -delta;
            if (count > 10)
                count = 10;
            
            for (let i = 0; i < count; i++) {
                let size = 4+Math.round(Math.random()*4);
                
                let blood = new lx.GameObject(
                    new lx.Sprite('res/particles/blood.png'),
                    this.npcs[id].POS.X+this.npcs[id].SIZE.W/2,
                    this.npcs[id].POS.Y+this.npcs[id].SIZE.H/2,
                    size,
                    size
                );
                
                blood.MaxVelocity(3);
                blood.AddVelocity(Math.round(Math.random()*-3+Math.random()*3), Math.round(Math.random()*-3+Math.random()*3));
                
                blood.Loops(function() {
                    if (blood.Movement().VX == 0 && blood.Movement().VY == 0)
                        blood.Hide();
                });
                
                blood.Show(1+Math.round(Math.random()));
            }
        }
        
        this.npcs[id]._health = health;
    },
    removeNPC: function(id) {
        if (this.npcs[id] === undefined)
            return;
        
        this.npcs[id].Hide();
        this.npcs[id]._nameplate.Hide();   
        
        if (this.npcs[id]._healthbar !== undefined)
        {
            this.npcs[id]._healthbarBack.Hide();
            this.npcs[id]._healthbar.Hide();
        }
        
        this.npcs[id] = undefined;
    },
    resetNPCs: function() {
        //Cycle through all NPCs and hide them
        
        for (let i = 0; i < this.npcs.length; i++)
            this.removeNPC(i);
        
        //Reset NPCs array
        
        this.npcs = [];
    },
    resetColliders: function() {
        if (this.players === undefined || 
            this.player === undefined ||
            this.players[this.player] === undefined)
            return;
        
        if (this.players[this.player].COLLIDER !== undefined)
        {
            //Save player's collider
        
            const c = this.players[this.player].COLLIDER.Disable();
            
            //Reset colliders
            
            lx.GAME.COLLIDERS = [];
        
            //Apply collider to player

            this.players[this.player].COLLIDER = c.Enable();
        }
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