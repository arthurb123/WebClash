//NPCs module for WebClash Server

const fs = require('fs');

//Respawn time in seconds

exports.respawnTime = 15;

//Properties

exports.onMap = [];
exports.onTimeOut = [];

exports.sendMap = function(map, socket)
{
    //Check if valid
    
    if (this.onMap[map] === undefined)
        return;
    
    //Cycle through all NPCs and send to socket
    //if the NPC is not on timeout
    
    for (let i = 0; i < this.onMap[map].length; i++)
        if (this.onTimeOut[map] === undefined ||
            this.onTimeOut[map][i] === undefined) 
            server.syncNPC(map, i, socket, false);
}

exports.loadMap = function(map)
{
    //Check if map has (NPC) properties
    
    if (tiled.maps_properties[map] === undefined)
        return;
    
    //Cycle through all properties, and search
    //for the "NPC" value
    
    for (let i = 0; i < tiled.maps_properties[map].length; i++)
        if (tiled.maps_properties[map][i].name == 'NPC') {
            //Check if onMap at map is undefined
            
            if (this.onMap[map] === undefined)
                this.onMap[map] = [];
            
            //Create NPC
            
            this.createNPCs(tiled.maps_properties[map][i], map)
        }
};

exports.updateMaps = function()
{
    //Check if a map contains players,
    //if so update the NPCs
    
    for (let i = 0; i < tiled.maps.length; i++)
        if (io.sockets.adapter.rooms[i] !== undefined &&
            io.sockets.adapter.rooms[i].length > 0)
            this.updateMap(i);
};

exports.updateMap = function(map)
{
    //Check if valid
    
    if (this.onMap[map] === undefined)
        return;
    
    //Cycle through all NPCs and update
    //accordingly
    
    for (let i = 0; i < this.onMap[map].length; i++)
        if (this.onMap[map][i] !== undefined)
            this.updateNPC(map, i);
};

exports.createNPCs = function(npc_property, map_id)
{    
    //Cycle through all dimensions
    
    for (let i = 0; i < npc_property.rectangles.length; i++)
        this.createNPC(map_id, npc_property.value, npc_property.rectangles[i].x, npc_property.rectangles[i].y);
};

exports.createNPC = function(map, name, x, y)
{
    //Get specified NPC
    
    let npc = {
        name: name,
        data: this.loadNPC(name)
    };

    if (npc.data === undefined)
        return;

    //Setup NPC

    npc.id = this.onMap[map].length;

    //Setup NPC Movement

    npc.pos = {
        X: x,
        Y: y
    };
    npc.start_pos = {
        X: x,
        Y: y
    };

    npc.movement = {
        vel: {
            x: 0,
            y: 0
        },
        distance: 0,
        cur: 0,
        standard: this.randomNPCMovementTimeout()
    };
    npc.moving = false;
    npc.direction = 0;

    //Setup NPC Combat

    npc.targets = [];
    npc.target = -1;

    npc.combat_cooldown = {
        actual: [],
        start: function(name, cooldown) {
            this.actual[name] = {
                cur: 0,
                standard: cooldown,
                done: false
            };
        }
    };

    //Add NPC to map

    this.onMap[map].push(npc);
};

exports.loadNPC = function(name)
{
    try 
    {
        let location = 'npcs';
        
        let npc = JSON.parse(fs.readFileSync(location + '/' + name + '.json', 'utf-8'));
        
        npc.character = game.characters[npc.character];
        
        return npc;
    }
    catch(err)
    {
        output.give(err);
    }
};

exports.updateNPC = function(map, id)
{
    try {
        //Check if NPC is on timeout
        
        if (this.isTimedOut(map, id)) {
            this.onTimeOut[map][id]--;
            
            if (this.onTimeOut[map][id] <= 0) {
                this.onTimeOut[map][id] = undefined;
                
                this.respawnNPC(map, id);
            }
            else 
                return;
        }
        
        //Update NPC movement

        this.updateNPCMovement(map, id);

        //Update NPC combat
        
        this.updateNPCCombat(map, id);
    }
    catch (err)
    {
        output.give('Could not update NPC: ' + err);
    }
};

exports.randomNPCMovementTimeout = function()
{
    return 60 + Math.round(Math.random()*180);
};

exports.updateNPCMovement = function(map, id)
{        
    //Standard NPC movement
    
    if (this.onMap[map][id].target == -1 &&
        this.onMap[map][id].data.movement == 'free')
    {
        //Check movement timeout
        
        if (!this.onMap[map][id].moving &&
            this.onMap[map][id].movement.cur >= this.onMap[map][id].movement.standard) {
            //Reset NPC movement

            this.onMap[map][id].movement.vel.x = 0;
            this.onMap[map][id].movement.vel.y = 0;
            this.onMap[map][id].movement.distance = 0;
            this.onMap[map][id].movement.cur = 0;
            this.onMap[map][id].movement.standard = this.randomNPCMovementTimeout();

            //Set random direction

            this.onMap[map][id].direction = Math.round(Math.random()*3);
            
            //Check range
            
            if (this.onMap[map][id].data.range != 0) 
            {
                //Grab delta
                
                let dx = Math.round((this.onMap[map][id].pos.X-this.onMap[map][id].start_pos.X)/tiled.maps[map].tilewidth);
                let dy = Math.round((this.onMap[map][id].pos.Y-this.onMap[map][id].start_pos.Y)/tiled.maps[map].tileheight);
                
                //Check delta x and y in range
                
                if (dx >= this.onMap[map][id].data.range)
                    this.onMap[map][id].direction = 1;
                else if (dx <= -this.onMap[map][id].data.range)
                    this.onMap[map][id].direction = 2;
                else if (dy >= this.onMap[map][id].data.range)
                    this.onMap[map][id].direction = 3;
                else if (dy <= -this.onMap[map][id].data.range)
                    this.onMap[map][id].direction = 0;
            }

            //Check facing collision
            
            if (!this.checkNPCFacingCollision(map, id)) {
                //Start moving
                
                this.onMap[map][id].moving = true; 
                
                //Sync moving
                
                server.syncNPCPartially(map, id, 'moving');
            }

            //Sync direction

            server.syncNPCPartially(map, id, 'direction');
        }
        else
            this.onMap[map][id].movement.cur++;
    }
    
    //Evaluate movement
    
    if (this.onMap[map][id].moving) {             
        //Evaluate movement 

        switch (this.onMap[map][id].direction)
        {
            case 0:
                if (this.onMap[map][id].movement.vel.y < this.onMap[map][id].data.character.movement.max)
                    this.onMap[map][id].movement.vel.y += this.onMap[map][id].data.character.movement.acceleration;
                break;
            case 1:
                if (this.onMap[map][id].movement.vel.x > -this.onMap[map][id].data.character.movement.max)
                    this.onMap[map][id].movement.vel.x -= this.onMap[map][id].data.character.movement.acceleration;
                break;
            case 2:
                if (this.onMap[map][id].movement.vel.x < this.onMap[map][id].data.character.movement.max)
                    this.onMap[map][id].movement.vel.x += this.onMap[map][id].data.character.movement.acceleration;
                break;
            case 3:
                if (this.onMap[map][id].movement.vel.y > -this.onMap[map][id].data.character.movement.max)
                    this.onMap[map][id].movement.vel.y -= this.onMap[map][id].data.character.movement.acceleration;
                break;
        }

        //Add movement velocity
        this.onMap[map][id].pos.X+=this.onMap[map][id].movement.vel.x;
        this.onMap[map][id].pos.Y+=this.onMap[map][id].movement.vel.y;

        //Check and add distance

        if (Math.abs(this.onMap[map][id].movement.vel.x) > Math.abs(this.onMap[map][id].movement.vel.y)) {
            if (this.onMap[map][id].movement.distance >= tiled.maps[map].tilewidth)
                    this.onMap[map][id].moving = false;
            else 
                this.onMap[map][id].movement.distance += Math.abs(this.onMap[map][id].movement.vel.x);
        }
        else {
            if (this.onMap[map][id].movement.distance >= tiled.maps[map].tileheight)
                    this.onMap[map][id].moving = false;
            else
                this.onMap[map][id].movement.distance += Math.abs(this.onMap[map][id].movement.vel.y);
        }


        //Sync new position

        server.syncNPCPartially(map, id, 'position');

        //If moving is set to false, sync

        if (!this.onMap[map][id].moving)
            server.syncNPCPartially(map, id, 'moving');
    }
};

exports.updateNPCCombat = function(map, id)
{
    //Check if valid
    
    if (this.onMap[map] === undefined ||
        this.onMap[map][id] === undefined || 
        this.isTimedOut(map, id))
        return;
    
    //Check if target exists
    
    if (this.onMap[map][id].target == -1) {
        //Regenerate if necessary
        
        return;
    }
    
    //Check if target is still on the same map
    
    if (game.players[this.onMap[map][id].target].map !== tiled.maps[map].name)
    {
        //Reset target
        
        this.onMap[map][id].target = -1;
        
        return;
    }
    
    //Update cooldown
    
    for (let key in this.onMap[map][id].combat_cooldown.actual) {
        if (this.onMap[map][id].combat_cooldown.actual[key].done)
            continue;
        
        this.onMap[map][id].combat_cooldown.actual[key].cur++;

        if (this.onMap[map][id].combat_cooldown.actual[key].cur >= this.onMap[map][id].combat_cooldown.actual[key].standard)
            this.onMap[map][id].combat_cooldown.actual[key].done = true;
    };
    
    //Calculate distance to target
    
    let dx = Math.round((game.players[this.onMap[map][id].target].pos.X-this.onMap[map][id].pos.X)/tiled.maps[map].tilewidth),
        dy = Math.round((game.players[this.onMap[map][id].target].pos.Y-this.onMap[map][id].pos.Y)/tiled.maps[map].tileheight);
    
    //Check which ability is in range
    
    let nextAction = -1;
    
    for (let i = 0; i < this.onMap[map][id].data.actions.length; i++)
        if (this.onMap[map][id].data.actions[i].range == 0 ||
            Math.abs(dx) <= this.onMap[map][id].data.actions[i].range &&
            Math.abs(dy) <= this.onMap[map][id].data.actions[i].range)
            {
                //Check action cooldown
                
                if (this.onMap[map][id].combat_cooldown.actual[this.onMap[map][id].data.actions[i].action] != undefined &&
                    !this.onMap[map][id].combat_cooldown.actual[this.onMap[map][id].data.actions[i].action].done)
                    continue;
                
                nextAction = i;
                
                break;
            }
    
    //Adjust NPC direction
    
    if (Math.abs(dx) > Math.abs(dy))
    {
        //Horizontal attack
        
        if (dx < 0)
            this.onMap[map][id].direction = 1;
        else if (dx > 0)
            this.onMap[map][id].direction = 2;
        
        //Reset verical movement
        
        this.onMap[map][id].movement.vel.y = 0;
    }
    else if (Math.abs(dx) < Math.abs(dy))
    {
        //Vertical attack
        
        if (dy < 0)
            this.onMap[map][id].direction = 3;
        else if (dy > 0)
            this.onMap[map][id].direction = 0;
        
        //Reset horizontal movement
        
        this.onMap[map][id].movement.vel.x = 0;
    }
    else if (!this.onMap[map][id].moving)
    {
        //Invalid attack position, adjust position (start moving)
        
        //Reset NPC movement

        this.onMap[map][id].movement.distance = 0;

        //Set direction based on player position

        if (dx < 0)
            this.onMap[map][id].direction = 1;
        else 
            this.onMap[map][id].direction = 2;
        
        //Check facing collision

        if (!this.checkNPCFacingCollision(map, id)) {
            //Start moving

            this.onMap[map][id].moving = true; 

            //Sync moving

            server.syncNPCPartially(map, id, 'moving');
        }
    }
    
    //Sync direction
    
    server.syncNPCPartially(map, id, 'direction');
    
    //Check if next action is valid,
    //otherwise start moving in direction
    
    if (nextAction == -1) 
    {
        //Check if already moving
        
        if (this.onMap[map][id].moving)
            return;
        
        //Reset NPC movement

        this.onMap[map][id].movement.distance = 0;
        
        //Check facing collision

        if (!this.checkNPCFacingCollision(map, id)) {
            //Start moving

            this.onMap[map][id].moving = true; 

            //Sync moving

            server.syncNPCPartially(map, id, 'moving');
        }
        
        return;
    }
    
    //Reset moving if necessary
    
    if (this.onMap[map][id].moving) {
        //Reset
        
        this.onMap[map][id].moving = false;
    
        //Sync moving

        server.syncNPCPartially(map, id, 'moving');
    }
    
    //Perform action
    
    actions.createNPCAction(
        this.onMap[map][id].data.actions[nextAction], 
        map,
        id
    );
};

exports.checkNPCFacingCollision = function(map, id)
{
    let pos = game.calculateFace(this.onMap[map][id].pos, tiled.maps[map].tilewidth, tiled.maps[map].tileheight, this.onMap[map][id].direction);
    
    let rect = {
        x: pos.X,
        y: pos.Y,
        w: tiled.maps[map].tilewidth,
        h: tiled.maps[map].tileheight
    };
    
    //Check if outside map
    
    if (!tiled.checkRectangleInMap(map, rect))
        return true;
    
    //Check collision inside map
    
    if (tiled.checkCollisionWithRectangle(tiled.maps[map].name, rect))
        return true;
    
    return false;
};

exports.damageNPC = function(owner, map, id, delta)
{
    //Check if valid
    
    if (this.onMap[map] === undefined ||
        this.onMap[map][id] === undefined || 
        this.isTimedOut(map, id))
        return;
    
    //Add delta accordingly
    
    this.onMap[map][id].data.health.cur+=delta;
    
    if (this.onMap[map][id].data.health.cur < 0)
        this.onMap[map][id].data.health.cur = 0;
    
    //Update NPC targets
    
    if (this.onMap[map][id].targets[owner] == undefined)
        this.onMap[map][id].targets[owner] = 0
        
    this.onMap[map][id].targets[owner] -= delta;
    
    //Make sure we update the target
    
    this.setNPCTarget(map, id, owner);

    //Sync health
    
    server.syncNPCPartially(map, id, 'health');
    
    //Check if health is equal to 0 - if so kill
    
    if (this.onMap[map][id].data.health.cur <= 0)
        this.killNPC(map, id);
};

exports.setNPCTarget = function(map, id, owner)
{
    //Check if valid
    
    if (this.onMap[map] === undefined ||
        this.onMap[map][id] === undefined ||
        this.isTimedOut(map, id))
        return;
    
    //Make sure the owner is not the current target
    
    if (this.onMap[map][id].target == owner)
        return;
    
    //Get target with highest priority (damage)
    
    let newTarget = -1,
        highestDamage = 0;
    
    for (let i = 0; i < this.onMap[map][id].targets.length; i++) 
    {
        if (this.onMap[map][id].targets[i] == undefined)
            continue; 
    
        if (this.onMap[map][id].targets[i] > highestDamage)
        {
            newTarget = i;
            highestDamage = this.onMap[map][id].targets[i];
        }
    }
    
    //Check if target has changed
    
    if (newTarget == this.onMap[map][id].target)
        return;
    
    //Save old target
    
    let old = this.onMap[map][id].target;
    
    //Set new target
    
    this.onMap[map][id].target = newTarget;
};

exports.removeNPCTargets = function(map, target, splice)
{
    //Cycle through all NPCs on map
    
    for (let i = 0; i < this.onMap[map].length; i++) {
        //If not a hostile NPC, continue
        
        if (this.onMap[map][i].type === 'friendly')
            continue;
        
        if (this.onMap[map][i].targets[target] != undefined) {
            //Set damage done to zero
            
            if (splice)
                this.onMap[map][i].targets.splice(target, 1);
            else
                this.onMap[map][i].targets[target] = 0;
            
            //Refresh targets
    
            this.setNPCTarget(map, i);
        }
    }
};

exports.killNPC = function(map, id)
{
    //Check if valid
    
    if (this.onTimeOut[map] === undefined)
        this.onTimeOut[map] = [];
    
    //Evaluate loot table
    
    this.evaluateLootTable(map, id);
    
    //Distribute exp
    
    this.distributeExperience(map, id);
    
    //Add to timeout
    
    this.onTimeOut[map][id] = this.respawnTime*60;
    
    //Sync remove NPC
    
    server.removeNPC(map, id);
};

exports.respawnNPC = function(map, id)
{
    //Reset position
    
    this.onMap[map][id].pos = {
        X: this.onMap[map][id].start_pos.X,
        Y: this.onMap[map][id].start_pos.Y
    };
    
    //Reset health to max
    
    this.onMap[map][id].data.health.cur = this.onMap[map][id].data.health.max;
    
    //Reset possible targets and target
    
    this.onMap[map][id].targets = [];
    this.onMap[map][id].target = -1;
    
    //Sync NPC across server
    
    server.syncNPC(map, id);
};

exports.isTimedOut = function(map, id)
{
    //Check if NPC is on timeout - meaning that it has died and needs to be respawned
    
    if (this.onTimeOut[map] !== undefined && this.onTimeOut[map][id] !== undefined)
        return true;
    
    return false;
};

exports.inDialogRange = function(map, id, x, y)
{
    //Check if NPC exists and has a valid dialog
        
    if (this.onMap[map][id] == undefined ||
        this.onMap[map][id].data.dialog == undefined)
        return false;

    //Get position difference

    let dx = Math.abs(x-this.onMap[map][id].pos.X),
        dy = Math.abs(y-this.onMap[map][id].pos.Y);

    //Proximity distance in tiles

    let proximity = 3;

    //Return proximity result

    return (dx <= tiled.maps[map].tilewidth*proximity && dy <= tiled.maps[map].tileheight*proximity);
};

exports.evaluateLootTable = function(map, id)
{
    //Check if loot table exists
    
    if (this.onMap[map][id].data.items === undefined ||
        this.onMap[map][id].data.items.length == 0)
        return;
    
    //Check if target (still) exists
    
    if (this.onMap[map][id].target == -1 ||
        game.players[this.onMap[map][id].target] == undefined)
        this.setNPCTarget(map, id);
    
    //Loop through loot table
    
    for (let i = 0; i < this.onMap[map][id].data.items.length; i++)
    {
        //Create chance
        
        let chance = Math.random();
        
        //Evaluate chance against drop rate
        
        if (chance <= 1/this.onMap[map][id].data.items[i].dropChance)
        {
            //Create world item
            
            items.createWorldItem(
                this.onMap[map][id].target,
                map,
                this.onMap[map][id].pos.X+this.onMap[map][id].data.character.width/2,
                this.onMap[map][id].pos.Y+this.onMap[map][id].data.character.height,
                this.onMap[map][id].data.items[i].item
            );
        }
    }
};

exports.distributeExperience = function(map, id)
{
    //Cycle through all targets/participants

    for (let p = 0; p < this.onMap[map][id].targets.length; p++) {
        if (this.onMap[map][id].targets[p] == undefined)
            continue;
        
        let xp = Math.round(this.onMap[map][id].targets[p]/this.onMap[map][id].data.health.max*this.onMap[map][id].data.stats.exp);
        
        if (xp == null || xp < 0)
            xp = 0;
        
        game.addPlayerExperience(p, xp);
    }
};