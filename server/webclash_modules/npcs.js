//NPCs module for WebClash Server

//Respawn time in seconds

exports.respawnTime = 15;

//Out of combat reset time in seconds

exports.outOfCombatTime = 8;

//Properties

exports.mapPopulation = [];

exports.onMap = [];
exports.onTimeOut = [];

exports.playerInvisibleNPCs = {};

exports.sendMap = function(id)
{
    let map = game.players[id].map_id,
        channel = game.players[id].channel;

    //Check if valid

    if (this.onMap[map] === undefined)
        return;

    //(Re)set player invisible NPC collection

    this.playerInvisibleNPCs[id] = {};

    //Cycle through all NPCs and send to channel
    //if the NPC is not on timeout
    //Also create invisible NPC collection for the
    //respective player based on their checks

    for (let i = 0; i < this.onMap[map].length; i++) {
        if (this.onMap[map][i] == undefined)
            continue;

        //Check if checks are met (if they exist)
        //and add to invisible NPC collection

        let valid = true;

        if (this.onMap[map][i].checks != undefined) 
            for (let ii = 0; ii < this.onMap[map][i].checks.length; ii++) {
                let check = this.onMap[map][i].checks[ii],
                    result = game.getPlayerGlobalVariable(id, check.name);

                if (result == undefined) 
                    result = false;

                if (result !== check.value) {
                    valid = false;
                    break;
                }
            }

        if (!valid) {
            this.playerInvisibleNPCs[id][i] = true;

            continue;
        }

        //Check on timeout

        if (this.onTimeOut[map] != undefined &&
            this.onTimeOut[map][i] != undefined)
            continue;
        
        //Send NPC

        server.syncNPC(map, i, channel);
    };
};

exports.updateMaps = function(dt)
{
    //Check if a map contains players,
    //if so update the NPCs

    for (let i = 0; i < tiled.maps.length; i++)
        if (this.mapPopulation[i] !== undefined &&
            this.mapPopulation[i] > 0)
            this.updateMap(i, dt);
};

exports.updateMap = function(map, dt)
{
    //Check if valid

    if (this.onMap[map] === undefined)
        return;

    //Cycle through all NPCs and update
    //accordingly

    for (let i = 0; i < this.onMap[map].length; i++)
        if (this.onMap[map][i] != undefined &&
            this.onMap[map][i].data != undefined)
            this.updateNPC(map, i, dt);
};

exports.createNPCFromProperty = function(map_id, name, rectangle, checks) {
    //Calculate NPC position

    let pos = {
        x: rectangle.x,
        y: rectangle.y
    };

    //Center NPC position if a width
    //and height of the property exist

    if (rectangle.w != undefined)
        pos.x += rectangle.w/2;
    if (rectangle.h != undefined)
        pos.y += rectangle.h/2;

    //Extract name and profile

    let profile = 0;
    let hashId  = name.indexOf('#');

    if (hashId !== -1) {
        profile = parseInt(name.substr(hashId+1, name.length-1));
        name    = name.substr(0, hashId);
    } else
        output.give('Created the NPC \'' + name + '\' without a specified profile, defaults to profile #0.');

    //Create NPC

    let npc = this.createNPC(map_id, name, profile, pos.x, pos.y, false);

    //Set checks on the newly created NPC

    this.onMap[map_id][npc].checks = checks;
};

exports.createNPC = function(map_id, name, profile, x, y, isEvent)
{
    //Check if onMap at map is undefined

    if (this.onMap[map_id] === undefined)
        this.onMap[map_id] = [];

    //Check if population at map is undefined

    if (this.mapPopulation[map_id] == undefined)
        this.mapPopulation[map_id] = 0;

    //Setup specified NPC

    let npc = {
        name: name,
        data: this.loadNPC(name, profile),
        isEvent: isEvent
    };

    if (npc.data === undefined) {
        output.give('Could not create NPC \'' + name + '\' with profile #' + profile);

        return -1;
    }

    //Setup NPC

    for (let n = 0; n < this.onMap[map_id].length+1; n++)
        if (this.onMap[map_id][n] == undefined) {
            npc.id = n;

            break;
        };

    //Setup NPC status effects container

    npc.statusEffects = {};

    //Calculate NPC status effect matrix

    npc.statusEffectsMatrix = status.calculateStatusEffectsMatrix(npc.statusEffects);

    //Setup NPC Movement

    npc.pos = {
        X: x-npc.data.character.width/2,
        Y: y-npc.data.character.height
    };
    npc.start_pos = {
        X: npc.pos.X,
        Y: npc.pos.Y
    };

    npc.movement = {
        vel: {
            x: 0,
            y: 0
        },
        distance: 0,
        cur: 0,
        standard: this.randomNPCMovementTimeout(
            npc.data.character.movement.max,
            npc.statusEffectsMatrix
        )
    };
    npc.moving = false;

    if (npc.data.movement === 'static')
        npc.direction = npc.data.facing;
    else
        npc.direction = 0;

    //Setup NPC Combat

    npc.targets = {};
    npc.target = -1;
    npc.outOfCombatTime = 0;

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

    //Orden set actions from high to low range

    npc.data.actions.sort(
        (b, a) => (a.range > b.range) ? 1 : ((b.range > a.range) ? -1 : 0)
    );

    //Add NPC to map

    this.onMap[map_id][npc.id] = npc;

    return npc.id;
};

exports.createEventNPC = function(map, name, profile, x, y, owner, hostile, resetCallback)
{
    let npc_id = this.createNPC(map, name, profile, x, y, true);

    //Check if valid

    if (npc_id === -1)
        return;

    //Set aggressivity based on if hostile

    this.onMap[map][npc_id].data.aggressive = hostile;

    //Convert type according to if hostile

    if (hostile) {
        this.onMap[map][npc_id].data.type = 'hostile';
        this.onMap[map][npc_id].data.movement = 'free';
    }

    //Create event specific stuff

    this.onMap[map][npc_id].owner = owner;
    this.onMap[map][npc_id].resetCallback = resetCallback;

    server.syncNPC(map, npc_id);

    //Movement callback

    let cb = function() {
        if (npcs.onMap[map][npc_id].preventAttack &&
            npcs.collidesWithOtherNPC(map, npc_id)) {

            npcs.randomNPCMovement(map, npc_id, cb, true);

            npcs.onMap[map][npc_id].start_pos = {
                X: npcs.onMap[map][npc_id].pos.X,
                Y: npcs.onMap[map][npc_id].pos.Y
            };

            return;
        }
        else if (hostile) 
            npcs.onMap[map][npc_id].preventAttack = false;

        npcs.onMap[map][npc_id].movementCallback = undefined;
    };

    //If not friendly, handle accordingly

    if (this.onMap[map][npc_id].data.type !== 'friendly') {
        if (hostile) {
            this.onMap[map][npc_id].targets[owner] = 1;
            this.onMap[map][npc_id].target = owner;
        }

        this.onMap[map][npc_id].preventAttack = true;
    }

    //Start with a random movement and provide
    //the movement callback

    npcs.randomNPCMovement(map, npc_id, cb);
};

exports.ownsEventNPC = function(map, name, player) {
    //Go through all NPCs on map and
    //check if the player owns event NPCs
    //If this is the case, return true

    for (let n = 0; n < this.onMap[map].length; n++)
        if (this.onMap[map][n] != undefined &&
            this.onMap[map][n].isEvent &&
            this.onMap[map][n].name === name &&
            this.onMap[map][n].owner === player)
            return true;

    //Otherwise return false

    return false;
};

exports.loadNPC = function(name, profile)
{
    try
    {
        let npc = JSON.parse(fs.readFileSync('npcs/' + name + '.json', 'utf-8'));

        //Check if the specified profile is valid

        if (npc.profiles[profile] == undefined) {
            output.give('Tried to load the NPC \'' + name + '\' with an invalid profile #' + profile);

            return;
        }

        //Append the profile properties to the NPC itself,
        //and delete the profiles array

        npc = Object.assign(npc.profiles[profile], npc);
        delete npc.profiles;

        //Assign the profile identifier

        npc.profile = profile;

        //Replace the character identifier with the
        //actual character

        npc.character = game.characters[npc.character];

        return npc;
    }
    catch(err)
    {
        output.giveError('Could not load NPC \'' + name + '\' with profile #' + profile + ': ', err);
    }
};

exports.updateNPC = function(map, id, dt)
{
    try {
        //Check if NPC is on timeout

        if (this.isTimedOut(map, id)) {
            this.onTimeOut[map][id]-=dt;

            if (this.onTimeOut[map][id] <= 0) {
                this.onTimeOut[map][id] = undefined;

                this.respawnNPC(map, id);
            }
        }

        //Check if NPC is killed

        if (this.onMap[map][id].killed)
            return;

        //Update NPC movement

        this.updateNPCMovement(map, id, dt);

        //Update NPC combat

        this.updateNPCCombat(map, id, dt);
    }
    catch (err)
    {
        output.giveError('Could not update NPC: ', err);
    }
};

exports.randomNPCMovementTimeout = function(movementSpeed, statusEffectsMatrix)
{
    let randomInterval = 60 + Math.round(Math.random() * 180);
    let intervalFactor = movementSpeed * statusEffectsMatrix['movementSpeedFactor'];

    return Math.round(randomInterval / intervalFactor);
};

exports.randomNPCMovement = function(map, id, cb)
{
    if (this.onMap[map][id].moving)
        return;

    let dir = Math.round(Math.random()*3);

    this.onMap[map][id].direction = dir;

    if (!this.checkNPCFacingCollision(map, id)) {
        //Add callback if defined

        this.onMap[map][id].movementCallback = cb;

        //Start moving

        this.onMap[map][id].movement.vel.x = 0;
        this.onMap[map][id].movement.vel.y = 0;
        this.onMap[map][id].movement.distance = 0;
        this.onMap[map][id].moving = true;

        //Sync moving

        server.syncNPCPartially(map, id, 'moving');
        server.syncNPCPartially(map, id, 'direction');
    } else
        cb();
};

exports.updateNPCMovement = function(map, id, dt)
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
            this.onMap[map][id].movement.standard = this.randomNPCMovementTimeout(
                this.onMap[map][id].data.character.movement.max,
                this.onMap[map][id].statusEffectsMatrix
            );

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
            this.onMap[map][id].movement.cur+=dt;
    }

    //Evaluate movement

    if (this.onMap[map][id].moving) {
        //Evaluate movement

        let maxSpeed = this.onMap[map][id].data.character.movement.max;
        maxSpeed *= this.onMap[map][id].statusEffectsMatrix['movementSpeedFactor'];
        switch (this.onMap[map][id].direction)
        {
            case 0:
                this.onMap[map][id].movement.vel.y = maxSpeed;
                break;
            case 1:
                this.onMap[map][id].movement.vel.x = -maxSpeed;
                break;
            case 2:
                this.onMap[map][id].movement.vel.x = maxSpeed;
                break;
            case 3:
                this.onMap[map][id].movement.vel.y = -maxSpeed;
                break;
        }

        //Adjust movement velocities using the delta time

        this.onMap[map][id].movement.vel.x *= dt;
        this.onMap[map][id].movement.vel.y *= dt;

        //Add movement velocity

        this.onMap[map][id].pos.X += this.onMap[map][id].movement.vel.x;
        this.onMap[map][id].pos.Y += this.onMap[map][id].movement.vel.y;

        //Check and add distance

        if (Math.abs(this.onMap[map][id].movement.vel.x) > Math.abs(this.onMap[map][id].movement.vel.y)) {
            if (this.onMap[map][id].movement.distance >= tiled.maps[map].tilewidth) {
                if (this.onMap[map][id].target === -1 && Math.random() <= .25)
                    this.onMap[map][id].movement.cur = this.onMap[map][id].movement.standard;
                    
                this.onMap[map][id].moving = false;
            }
            else
                this.onMap[map][id].movement.distance += Math.abs(this.onMap[map][id].movement.vel.x);
        }
        else {
            if (this.onMap[map][id].movement.distance >= tiled.maps[map].tileheight) {
                if (this.onMap[map][id].target === -1 && Math.random() <= .25)
                    this.onMap[map][id].movement.cur = this.onMap[map][id].movement.standard;

                this.onMap[map][id].moving = false;
            }
            else
                this.onMap[map][id].movement.distance += Math.abs(this.onMap[map][id].movement.vel.y);
        }

        //Sync new position

        server.syncNPCPartially(map, id, 'position');

        //If moving is set to false, sync

        if (!this.onMap[map][id].moving) {
            server.syncNPCPartially(map, id, 'moving');

            if (this.onMap[map][id].movementCallback != undefined)
                this.onMap[map][id].movementCallback();
        }
    }
};

exports.updateNPCCombat = function(map, id, dt)
{
    //Check if attacking should be prevented

    if (this.onMap[map][id].preventAttack)
        return;

    //Check if casting

    if (combat.isNPCCasting(map, id))
        return;

    //Check if out of combat for too long

    if (this.onMap[map][id].outOfCombatTime >= this.outOfCombatTime*60) {
        //Reset target and owner if event

        if (this.onMap[map][id].isEvent) {
            this.onMap[map][id].target = -1;
            this.onMap[map][id].owner = -1;
        } else
            //Set new NPC target except

            this.setNPCTargetExcept(map, id, this.onMap[map][id].target);

        //Reset out of combat time

        this.onMap[map][id].outOfCombatTime = 0;

        //Broadcast in combat package

        server.syncNPCPartially(map, id, 'inCombat');
    }

    //Check if target exists

    if (this.onMap[map][id].target === -1) {
        //If event NPC, despawn

        if (this.onMap[map][id].isEvent &&
            this.onMap[map][id].owner != undefined) {
            //Check if it is the owner that died,
            //or if the owner changed maps

            if (this.onMap[map][id].targets[this.onMap[map][id].owner] == undefined ||
                this.onMap[map][id].targets[this.onMap[map][id].owner] == 0 ||
                game.players[this.onMap[map][id].owner].map !== tiled.maps[map].name) {
                    //Remove all targets from event NPC

                    this.onMap[map][id].targets = [];

                    //Call reset callback if provided

                    if (this.onMap[map][id].resetCallback != undefined)
                        this.onMap[map][id].resetCallback();

                    //Kill NPC

                    this.killNPC(map, id);
                }

            //Otherwise reset target to the owner

            else
                this.onMap[map][id].target = this.onMap[map][id].owner;

            return;
        }

        //Regenerate if necessary

        this.regenerateNPC(map, id);

        //Reset all targets

        this.onMap[map][id].targets = [];

        //If aggressive, check if a player is in range

        if (this.onMap[map][id].data.aggressive) {
            //Get the current room with the map ID,
            //this way we can go over all players on the map

            for (let p in rooms.get(map)) {
                //Check if on same map

                if (game.players[p].map_id !== map)
                    continue;

                //Calculate the centered positions;

                let ppos = {
                    X: game.players[p].pos.X+game.players[p].character.width/2,
                    Y: game.players[p].pos.Y+game.players[p].character.height/2
                };
            
                let npos = {
                    X: this.onMap[map][id].pos.X+this.onMap[map][id].data.character.width/2,
                    Y: this.onMap[map][id].pos.Y+this.onMap[map][id].data.character.height/2
                };

                //Calculate the tile distance

                let { x, y } = game.calculateTileDistance(
                    ppos, 
                    npos, 
                    tiled.maps[map].tilewidth,
                    tiled.maps[map].tileheight
                );

                //Check if in attack range

                if (x <= this.onMap[map][id].data.attackRange &&
                    y <= this.onMap[map][id].data.attackRange) {
                        //Set target to that player and break

                        this.onMap[map][id].target = p;
                        break;
                    }
            }
        }

        return;
    }

    //Check if target is still on the same map.

    if (game.players[this.onMap[map][id].target] == undefined ||
        game.players[this.onMap[map][id].target].map_id !== map)
    {
        //Set new target except

        this.setNPCTargetExcept(map, id, this.onMap[map][id].target);

        return;
    }

    //Update cooldown

    let cooldowns = this.onMap[map][id].combat_cooldown.actual;
    for (let key in cooldowns) {
        if (cooldowns[key].done)
            continue;

        cooldowns[key].cur+=dt;

        if (cooldowns[key].cur >= cooldowns[key].standard)
            cooldowns[key].done = true;
    };

    //Calculate distance to target

    let ppos = {
        X: game.players[this.onMap[map][id].target].pos.X+game.players[this.onMap[map][id].target].character.width/2,
        Y: game.players[this.onMap[map][id].target].pos.Y+game.players[this.onMap[map][id].target].character.height/2
    };

    let npos = {
        X: this.onMap[map][id].pos.X+this.onMap[map][id].data.character.width/2,
        Y: this.onMap[map][id].pos.Y+this.onMap[map][id].data.character.height/2
    };

    if (this.onMap[map].direction == 0)
        npos.Y += this.onMap[map][id].data.character.height;
    else if (this.onMap[map].direction == 2)
        npos.X += this.onMap[map][id].data.character.width;

    let dx = Math.round((ppos.X-npos.X)/tiled.maps[map].tilewidth),
        dy = Math.round((ppos.Y-npos.Y)/tiled.maps[map].tileheight);

    //Check which ability is not on cooldown

    let nextAction = -1;

    for (let i = 0; i < this.onMap[map][id].data.actions.length; i++) {
        if (cooldowns[this.onMap[map][id].data.actions[i].action] != undefined &&
           !cooldowns[this.onMap[map][id].data.actions[i].action].done)
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
    else if (!this.onMap[map][id].moving &&
             this.onMap[map][id].data.movement !== 'static')
    {
        //Invalid attack position, adjust position (start moving)

        //Set direction based on player position

        if (dx < 0)
            this.onMap[map][id].direction = 1;
        else
            this.onMap[map][id].direction = 2;

        //Check facing collision

        if (!this.checkNPCFacingCollision(map, id)) {
            //Start moving

            this.onMap[map][id].moving = true;
            this.onMap[map][id].distance = 0;
            this.onMap[map][id].movement.vel.y = 0;

            //Sync moving

            server.syncNPCPartially(map, id, 'moving');

            //Set next action to -1

            nextAction = -1;
        } else {
            //If facing collision failed, try the other axis

            if (dx < 0)
                this.onMap[map][id].direction = 0;
            else
                this.onMap[map][id].direction = 3;

            if (!this.checkNPCFacingCollision(map, id)) {
                //Start moving

                this.onMap[map][id].moving = true;
                this.onMap[map][id].distance = 0;
                this.onMap[map][id].movement.vel.x = 0;

                //Sync moving

                server.syncNPCPartially(map, id, 'moving');

                //Set next action to -1

                nextAction = -1;
            }
        }
    }

    //Sync direction

    server.syncNPCPartially(map, id, 'direction');

    //If action is valid, check if in range

    if (nextAction != -1)
    {
        //Increment out of combat time

        this.onMap[map][id].outOfCombatTime+=dt;

        //Check if in range

        if (this.onMap[map][id].data.actions[nextAction].range != 0)
            if (Math.abs(dx) > this.onMap[map][id].data.actions[nextAction].range ||
                Math.abs(dy) > this.onMap[map][id].data.actions[nextAction].range) {
                //Check if already moving

                if (this.onMap[map][id].moving ||
                    this.onMap[map][id].data.movement === 'static')
                    return;

                //Check facing collision

                if (!this.checkNPCFacingCollision(map, id)) {
                    //Start moving

                    this.onMap[map][id].moving = true;
                    
                    //Reset NPC movement

                    this.onMap[map][id].movement.distance = 0;
                    this.onMap[map][id].movement.vel.x = 0;
                    this.onMap[map][id].movement.vel.y = 0;

                    //Sync moving

                    server.syncNPCPartially(map, id, 'moving');
                }

                return;
            }
    }
    else
        return;

    //Perform action

    let actionData = this.onMap[map][id].data.actions[nextAction];

    if (combat.performNPCAction(
        actionData,
        map,
        id,
        this.onMap[map][id].target
    )) {
        //Grab the actual action

        let action = combat.getAction(actionData.action);

        //Sync casting time

        let castingTime = action.castingTime;
        castingTime *= this.onMap[map][id].statusEffectsMatrix["castingTimeFactor"];
        
        server.syncNPCActionCast(
            map, 
            id,
            action.src,
            castingTime
        );
    }

    //Reset out of combat time

    this.onMap[map][id].outOfCombatTime = 0;
};

exports.checkNPCFacingCollision = function(map, id)
{
    //Calculate facing position of NPC

    let pos = game.calculateFace(
        this.onMap[map][id].pos, 
        tiled.maps[map].tilewidth, 
        tiled.maps[map].tileheight, 
        this.onMap[map][id].direction
    );

    //Setup delta overestimation factor,
    //this smoothes out collisions and
    //prevents NPCs from getting stuck in
    //unique scenarios

    let deltaFactor = 1.15;

    //Calculate position delta

    let delta = {
        x: (pos.X-this.onMap[map][id].pos.X) * deltaFactor,
        y: (pos.Y-this.onMap[map][id].pos.Y) * deltaFactor
    };

    //Setup NPC rectangle

    let rect = {
        x: this.onMap[map][id].pos.X+this.onMap[map][id].data.character.collider.x,
        y: this.onMap[map][id].pos.Y+this.onMap[map][id].data.character.collider.y,
        w: this.onMap[map][id].data.character.collider.width,
        h: this.onMap[map][id].data.character.collider.height
    };

    //Based on delta change rectangle

    if (delta.x < 0) {
        rect.x += delta.x;
        rect.w -= delta.x;
    }
    else 
        rect.w += delta.x;

    if (delta.y < 0) {
        rect.y += delta.y;
        rect.h -= delta.y;
    }
    else
        rect.h += delta.y;

    //Check if outside map

    if (!tiled.checkRectangleInMap(map, rect))
        return true;

    //Check collision inside map
    //if the NPC should collide
    //within maps

    let collidesWithinMap = this.onMap[map][id].data.collidesWithinMap;

    if (collidesWithinMap == undefined || collidesWithinMap)
        if (tiled.checkCollisionWithRectangle(map, rect))
            return true;

    return false;
};

exports.collidesWithOtherNPC = function(map, id)
{
    //Check if valid

    if (this.onMap[map] === undefined ||
        this.onMap[map][id] === undefined ||
        this.isTimedOut(map, id))
        return;

    //Setup rectangle of NPC

    let rect = {
        x: this.onMap[map][id].pos.X,
        y: this.onMap[map][id].pos.Y+this.onMap[map][id].data.character.height/2,
        w: this.onMap[map][id].data.character.width,
        h: this.onMap[map][id].data.character.height/2
    };

    //Check if collides with all other NPCs on map

    for (let n = 0; n < this.onMap[map].length; n++) {
        if (n === id || this.onMap[map][n] == undefined)
            continue;

        //Setup rectangle of other NPC

        let otherRect = {
            x: this.onMap[map][n].pos.X,
            y: this.onMap[map][n].pos.Y+this.onMap[map][n].data.character.height/2,
            w: this.onMap[map][n].data.character.width,
            h: this.onMap[map][n].data.character.height/2
        };

        //Check collision

        if (tiled.checkRectangularCollision(rect, otherRect))
            return true;
    }

    return false;
};

exports.regenerateNPC = function(map, id)
{
    //Check if valid

    if (this.onMap[map] === undefined ||
        this.onMap[map][id] === undefined ||
        this.isTimedOut(map, id))
        return;

    //Check if the previous second is invalid

    let done = false;

    //Regenerate health if necessary

    if (this.onMap[map][id].data.health.cur < this.onMap[map][id].data.health.max) {
        this.onMap[map][id].data.health.cur = this.onMap[map][id].data.health.max;

        done = true;
    }

    //Check if data should be synced

    if (done)
        server.syncNPCPartially(map, id, 'health');
};

exports.damageNPC = function(owner, map, id, delta)
{
    //Check if valid

    if (this.onMap[map] === undefined ||
        this.onMap[map][id] === undefined ||
        this.isTimedOut(map, id))
        return false;

    //Subtract toughness from damage

    if (this.onMap[map][id].data.stats.toughness > 0)
        delta += this.onMap[map][id].data.stats.toughness-1;

    if (delta >= 0)
        delta = 0;

    //Add delta accordingly

    this.onMap[map][id].data.health.cur += delta;

    if (this.onMap[map][id].data.health.cur < 0)
        this.onMap[map][id].data.health.cur = 0;

    //Update NPC targets

    if (owner != undefined && owner !== id) {
        if (this.onMap[map][id].targets[owner] == undefined)
            this.onMap[map][id].targets[owner] = 0

        this.onMap[map][id].targets[owner] -= delta;
    }

    //Set prevent attack to false

    this.onMap[map][id].preventAttack = false;

    //If damage was done, reset out of combat time

    if (delta < 0) 
        this.onMap[map][id].outOfCombatTime = 0;

    //Make sure we update the target

    if (owner !== id)
        this.setNPCTarget(map, id, owner);

    //Sync health

    server.syncNPCPartially(map, id, 'health');

    //Check if health is equal to 0 - if so kill

    if (this.onMap[map][id].data.health.cur <= 0) {
        this.killNPC(map, id);

        return true;
    }

    return false;
};

exports.healNPC = function(map, id, delta) {
    //Check if the NPC exists

    if (this.onMap[map] == undefined ||
        this.onMap[map][id] == undefined)
        return;

    //Heal with delta

    this.onMap[map][id].data.health.cur += delta;

    //Make sure not to overheal

    if (this.onMap[map][id].data.health.cur >= this.onMap[map][id].data.health.max)
        this.onMap[map][id].data.health.cur = this.onMap[map][id].data.health.max;

    //Sync health

    server.syncNPCPartially(map, id, 'health');
};

exports.setNPCTarget = function(map, id, owner)
{
    //Check if valid

    if (this.onMap[map] === undefined ||
        this.onMap[map][id] === undefined ||
        this.isTimedOut(map, id))
        return;

    //Make sure the owner is not the current target

    if (owner != undefined &&
        this.onMap[map][id].target == owner &&
        this.onMap[map][id].targets[owner] != undefined)
        return;

    //Get target with highest priority (damage)

    let newTarget = -1,
        highestDamage = 0;

    for (let i in this.onMap[map][id].targets)
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

    if (newTarget === this.onMap[map][id].target)
        return;

    //Set new target

    this.onMap[map][id].target = newTarget;

    //Broadcast inCombat

    server.syncNPCPartially(map, id, 'inCombat');
};

exports.setNPCTargetExcept = function(map, id, except) {
    //Check if valid

    if (this.onMap[map] === undefined ||
        this.onMap[map][id] === undefined ||
        this.isTimedOut(map, id))
        return;

    //Remove the except target from the NPCs target list

    delete this.onMap[map][id].targets[except];

    //Set new NPC target

    this.setNPCTarget(map, id);
};

exports.removeNPCTargets = function(target, splice)
{
    //Get map

    let map = game.players[target].map_id;

    //Check if NPCs exist on map

    if (this.onMap[map] == undefined)
        return;

    //Cycle through all NPCs on map

    for (let i = 0; i < this.onMap[map].length; i++) {
        //Check if valid

        if (this.onMap[map][i] == undefined)
            continue;

        //If not a hostile NPC, continue

        if (this.onMap[map][i].type === 'friendly')
            continue;

        if (this.onMap[map][i].targets[target] != undefined) {
            //Set damage done to zero

            if (splice)
                delete this.onMap[map][i].targets[target];
            else
                this.onMap[map][i].targets[target] = 0;

            //Refresh targets

            this.setNPCTarget(map, i);
        }
    }
};

exports.killNPC = function(map, id)
{
    //Check if map has time outs to prevent
    //errors from occuring

    if (this.onTimeOut[map] === undefined)
        this.onTimeOut[map] = [];

    //Evaluate rewards (exp and loot) if hostile

    if (this.onMap[map][id].data.type === 'hostile') {
        //Evaluate loot table

        this.evaluateLootTable(map, id);

        //Distribute exp

        this.distributeExperience(map, id);
    }

    //Sync remove NPC

    server.removeNPC(map, id);

    //Remove all NPC status effects

    this.onMap[map][id].statusEffects = {};

    //Calculate NPC status effect matrix

    this.onMap[map][id].statusEffectsMatrix = 
        status.calculateStatusEffectsMatrix(this.onMap[map][id].statusEffects);

    //Set NPC to killed

    this.onMap[map][id].killed = true;

    //Add to timeout (if the NPC is not an event)

    if (!this.onMap[map][id].isEvent) {
        //Give respawn time if hostile

        if (this.onMap[map][id].data.type === 'hostile')
            this.onTimeOut[map][id] = this.respawnTime*60;
    }
    else {
        if (this.onMap[map][id].resetCallback != undefined)
            this.onMap[map][id].resetCallback();

        this.onMap[map][id] = undefined;
    }
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

    this.onMap[map][id].targets = {};
    this.onMap[map][id].target = -1;

    //Reset out of combat time

    this.onMap[map][id].outOfCombatTime = 0;

    //Set NPC to not killed

    this.onMap[map][id].killed = false;

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

exports.isInvisible = function(player, npc) {
    if (this.playerInvisibleNPCs[player] == undefined ||
        !this.playerInvisibleNPCs[player][npc])
        return false;

    return true;
};

exports.evaluateLootTable = function(map, id)
{
    //Check if loot table exists

    if (this.onMap[map][id].data.items === undefined ||
        this.onMap[map][id].data.items.length == 0)
        return;

    //Check if target (still) exists

    if (this.onMap[map][id].target == -1)
        return;

    //Setup looters array

    let looters = [];

    //Check if target is in party
    //and loot is enabled for all party
    //members

    if (gameplay.partyBenefits.everyoneGetsLoot &&
        parties.inParty(this.onMap[map][id].target)) {
        let members = parties.getPartyMembers(this.onMap[map][id].target);

        for (let m in members)
            if (members[m] === 'participant' &&
                game.players[m].map_id === map)
                looters.push(m);
    } else
        looters[0] = this.onMap[map][id].target;

    //Loop through loot table

    let lootTable = this.onMap[map][id].data.items;
    for (let l = 0; l < looters.length; l++) 
        for (let i = 0; i < lootTable.length; i++)
        {
            //Check if the item is a quest item,
            //if so check if the player has the
            //necessary quest

            let item = items.getItem(lootTable[i].item);
            if (item.type === 'quest')
                if (!quests.hasPlayerQuest(looters[l], item.quest))
                    continue;
                    
            //Create chance

            let chance = Math.random();
            let dropChance = 1 / lootTable[i].dropChance;

            //Adjust drop chance using status effect matrix

            dropChance *= game.players[looters[l]].statusEffectsMatrix['itemFindFactor'];

            //Evaluate chance against drop rate

            if (chance <= dropChance)
            {
                //Create world item

                items.createMapItem(
                    looters[l],
                    map,
                    this.onMap[map][id].pos.X+this.onMap[map][id].data.character.width/2,
                    this.onMap[map][id].pos.Y+this.onMap[map][id].data.character.height,
                    lootTable[i].item
                );
            }
        }
};

exports.distributeExperience = function(map, id)
{
    //Check if the NPC only had one target

    if (Object.keys(this.onMap[map][id].targets).length === 1) {
        let gainers = [];

        //If so check if player is in party
        //and setup the gainers array

        if (parties.inParty(this.onMap[map][id].target)) {
            let members = parties.getPartyMembers(this.onMap[map][id].target);

            for (let m in members)
                if (members[m] === 'participant')
                    gainers.push(m);
        } else
            gainers[0] = this.onMap[map][id].target;

        //Handle experience distribution and evaluation
        //of quest objectives accordingly

        for (let g = 0; g < gainers.length; g++) { 
            //Add experience

            if (gameplay.partyBenefits.evenlyShareExperience || g === 0)
                game.deltaExperiencePlayer(gainers[g], this.onMap[map][id].data.stats.exp);

            //Evaluate kill quest objectives for all gainers

            quests.evaluateQuestObjective(gainers[g], 'kill', this.onMap[map][id].name);
        }

        return;
    }

    //Cycle through all targets/participants

    let partiesToEvaluate = {};

    for (let p in this.onMap[map][id].targets) {
        if (this.onMap[map][id].targets[p] == undefined)
            continue;

        //Give players a share of the total experience,
        //this is calculated based on the amount of damage done.

        let xp = Math.round(this.onMap[map][id].targets[p]/this.onMap[map][id].data.health.max*this.onMap[map][id].data.stats.exp);

        if (xp == null || xp < 0)
            xp = 0;

        //Check if evenly sharing of experience is enabled
        //and the player is in a party

        if (gameplay.partyBenefits.evenlyShareExperience &&
            parties.inParty(p)) {
            //Check if on same map 

            if (game.players[p].map_id !== map)
                continue;

            //Check if party entry exists

            if (partiesToEvaluate[parties.nameMap[p]] == undefined)
                partiesToEvaluate[parties.nameMap[p]] = 0;

            //Add recieved exp

            partiesToEvaluate[parties.nameMap[p]] += xp;

            continue;
        }

        //Give amount of xp

        game.deltaExperiencePlayer(p, xp);

        //Evaluate for kill quest objectives

        quests.evaluateQuestObjective(p, 'kill', this.onMap[map][id].name);
    }

    //Check if proceeding is possible

    if (!gameplay.partyBenefits.evenlyShareExperience)
        return;

    //Cycle through all parties that
    //have to be evaluated, this is for
    //evenly sharing of experience

    for (let p in partiesToEvaluate) {
        //Get members and amount of participants

        let members = parties.getPartyMembers(p),
            size = 1;

        for (let m in members) 
            if (members[m] === 'participant' &&
                game.players[m].map_id === map)
                size++;

        //Calculate shared even amount of xp

        let sharedXp = Math.ceil(partiesToEvaluate[p] / size);

        //Distribute experience and evaluate
        //kill quest objectives

        for (let m in members) 
            if (members[m] === 'participant' &&
                game.players[m].map_id === map) {
                //Give shared xp

                game.deltaExperiencePlayer(m, sharedXp);

                //Evaluate for kill quest objectives

                quests.evaluateQuestObjective(p, 'kill', this.onMap[map][id].name);
            }
    }
};
