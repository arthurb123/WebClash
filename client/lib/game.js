const game = {
    player: -1,
    players: [],
    npcs: [],
    items: [],
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
            })
            .Draws(function() {
                for (let i = 0; i < go._equipment.length; i++)
                {
                    if (go._equipment[i] === undefined)
                        continue;
                    
                    go._equipment[i].CLIP = go.SPRITE.CLIP;
                    
                    lx.DrawSprite(go._equipment[i], go.Position().X, go.Position().Y, go.Size().W, go.Size().H)
                }
            });
        
        go.name = name;
        go._moving = false;
        go._direction = 0;
        go._equipment = {};
        
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
            
            this.players[id]._health = health;
            
            if (delta == 0) {
                //Miss floaty
                
                ui.floaties.missFloaty(this.players[id], delta);
                
                return;
            }
            else if (delta > 0) {
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
                    this.players[id].POS.X+Math.round(Math.random()*this.players[id].SIZE.W),
                    this.players[id].POS.Y+this.players[id].SIZE.H-4-Math.round(Math.random()*6),
                    size,
                    size
                );
                
                blood._timer = {
                    cur: 0,
                    standard: 60
                };
                
                blood.Loops(function() {
                    if (this._timer.cur >= this._timer.standard)
                    {
                        this._timer.cur = 0;
                        
                        blood.Hide();
                    } 
                    else
                        this._timer.cur++;
                });
                
                blood.Show(1);
            }
        }
        else
            this.players[id]._health = health;
    },
    setPlayerEquipment: function(id, equipment)
    {
        let result = [];
        
        if (equipment['torso'] !== undefined)
            result.push(new lx.Sprite(equipment['torso']));
        if (equipment['hands'] !== undefined)
            result.push(new lx.Sprite(equipment['hands']));
        if (equipment['head'] !== undefined)
            result.push(new lx.Sprite(equipment['head']));
        if (equipment['feet'] !== undefined)
            result.push(new lx.Sprite(equipment['feet']));
        if (equipment['legs'] !== undefined)
            result.push(new lx.Sprite(equipment['legs']));
        if (equipment['offhand'] !== undefined)
            result.push(new lx.Sprite(equipment['offhand']));
        if (equipment['main'] !== undefined)
            result.push(new lx.Sprite(equipment['main']));
        
        this.players[id]._equipment = result;
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
        if (this.npcs[id] != undefined &&
            this.npcs[id]._health !== undefined)
        {
            let delta = -(this.npcs[id]._health.cur-health.cur);
            
            this.npcs[id]._health = health;
            
            if (delta > 0) {
                //Heal floaty
                
                ui.floaties.healFloaty(this.npcs[id], delta);
                
                return;
            }
            
            //Damage floaty
            
            ui.floaties.damageFloaty(this.npcs[id], delta);
            
            //Check if valid
            
            if(this.npcs[id] == undefined)
                return;
            
            //Blood particles
            
            let count = -delta;
            if (count > 10)
                count = 10;
            
            for (let i = 0; i < count; i++) {
                if(this.npcs[id] == undefined)
                    return;
                
                let size = 4+Math.round(Math.random()*4);
                
                let blood = new lx.GameObject(
                    new lx.Sprite('res/particles/blood.png'),
                    this.npcs[id].POS.X+Math.round(Math.random()*this.npcs[id].SIZE.W),
                    this.npcs[id].POS.Y+this.npcs[id].SIZE.H-4-Math.round(Math.random()*6),
                    size,
                    size
                );
                
                blood._timer = {
                    cur: 0,
                    standard: 60
                };
                
                blood.Loops(function() {
                    if (this._timer.cur >= this._timer.standard)
                    {
                        this._timer.cur = 0;
                        
                        blood.Hide();
                    } 
                    else
                        this._timer.cur++;
                });
                
                blood.Show(1);
            }
        }
        else if (this.npcs[id] != undefined)
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
    createWorldItem: function(data) {
        //Check if valid
        
        if (data == undefined)
            return;
        
        //Check if world item should be removed
        
        if (data.remove)
        {
            //Remove world item
            
            this.removeWorldItem(data.id);
            
            //Remove from loot box
            
            ui.loot.remove(data.id);

            return;
        }
        
        //Create item name
        
        let name = data.name + ' (' + data.value + 'g)';
        
        //Check if world item already exists
        
        if (this.items[data.id] != undefined)
        {                  
            //Update nameplate

            if (data.owner == -1)
                this.items[data.id]._nameplate.Text(name);
            
            //Set new owner
            
            this.items[data.id]._owner = data.owner;

            return;
        }
        
        //Check how many items exist at position
        
        let dy = -12;
        
        for (let i = 0; i < this.items.length; i++)
            if (this.items[i] != undefined &&
                this.items[i].POS.X == data.pos.X &&
                this.items[i].POS.Y == data.pos.Y)
                    dy -= 13;
        
        //Create item sprite
        
        let sprite = new lx.Sprite(data.source);
        
        //Create lynx gameobject
        
        let worldItem = new lx.GameObject(
            sprite,
            data.pos.X,
            data.pos.Y,
            sprite.Size().W,
            sprite.Size().H
        );
        
        //Add name label
        
        worldItem._nameplate = new lx.UIText(name, worldItem.Size().W/2, dy, 12, ui.inventory.getItemColor(data.rarity));
        worldItem._nameplate.SHADOW = true;
        
        //Set owner
        
        worldItem._owner = data.owner;
        
        //Create collider
        
        worldItem.CreateCollider(true, function(coll_data) {
            //Check if player
            
            if (game.players[game.player].COLLIDER !== coll_data.trigger)
                return;
            
            //Check if player is owner
            
            if (game.items[data.id]._owner != -1 &&
                game.players[game.player].name !== game.items[data.id]._owner)
                return;
            
            //Check if player is moving
            
            if (game.players[game.player].MOVEMENT.VX == 0 &&
                game.players[game.player].MOVEMENT.VY == 0)
                return;
            
            //Add to loot window
            
            ui.loot.add(data);
        });
        
        worldItem.COLLIDER.Solid(false);
        
        //Check owner
        
        if (data.owner != -1 &&
            this.players[this.player] != undefined &&
            this.players[this.player].name !== data.owner)
            worldItem._nameplate.Text('*' + name);
        
        worldItem._nameplate
            .Alignment('center')
            .Follows(worldItem)
            .Show();
        
        //Add to items
        
        this.items[data.id] = worldItem;
        
        //Show world item
        
        this.items[data.id].Show(1);
    },
    resetWorldItems: function() {
        //Cycle through all items and hide
        
        for (let i = 0; i < this.items.length; i++)
            this.removeWorldItem(i);
        
        //Reset to empty array
        
        this.items = [];
    },
    removeWorldItem: function(id) {
        //If item exists remove it
        
        if (this.items[id] != undefined) {
            this.items[id]._nameplate.Hide();
            this.items[id].Hide();
            
            this.items[id] = undefined;
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