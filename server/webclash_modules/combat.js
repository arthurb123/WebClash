//Actions module for WebClash Server

const collection = {};

const playerCasting = {};
const npcCasting = {};

const projectiles = [];
const activeActions = [];

exports.active = {
    players: {},
    update: function() {
        //Check for all players if they
        //are in combat or not

        for (let player in this.players) {
            this.players[player]--;

            if (this.players[player] <= 0)
                delete this.players[player];
        };
    },
    in: function(id) {
        return (this.players[id] != undefined && !game.players[id].killed)
    },
    add: function(id) {
        this.players[id] = this.timeout;
    },
    timeout: 5 //Combat timeout in seconds
};

exports.loadAllActions = function(cb)
{
    let location = 'actions';

    fs.readdir(location, (err, files) => {
        if (err) {
            output.giveError('Could not load actions: ', err);
            return;
        }

        let count = 0;

        files.forEach(file => {
            let action = combat.loadAction(location + '/' + file);
            collection[action.name] = action;

            count++;
        });

        output.give('Loaded ' + count + ' action(s).');

        if (cb !== undefined)
            cb();
    });
};

exports.loadAction = function(location)
{
    try {
        let action = JSON.parse(fs.readFileSync(location, 'utf-8'));

        //Check if the action contains scaling,
        //instead of each element of the action
        //containing scaling - this indicates the
        //action was created using an older version
        //of WebClash.

        if (action.scaling != undefined) {
            output.give(
                'The action "' + action.name + '" was created using an older version of WebClash, ' +
                'please update the action.'
            );

            //Apply scaling to all elements, to
            //have the action still work

            for (let e = 0; e < action.elements.length; e++)
                if (action.elements[e].scaling == undefined)
                    action.elements[e].scaling = action.scaling;
                    
            delete action.scaling;
        }

        return action;
    }
    catch (err)
    {
        output.giveError('Could not load action: ', err);
    }
};

exports.getAction = function(name)
{
    return collection[name];
};

exports.update = function(dt) {
    //Update action cooldowns

    combat.updateCooldowns(dt);

    //Update action casting

    combat.updateCasting(dt);

    //Update actions

    combat.updateActions(dt);

    //Update action projectiles

    combat.updateProjectiles(dt);
}

exports.updateCasting = function(dt) {
    //Check player casting timers

    for (let p in playerCasting) {
        if (playerCasting[p].timer <= 0) {
            //Check if player is still eligible for action creation

            if (playerCasting[p].immediate ||
                playerCasting[p].pos.X === game.players[p].pos.X &&
                playerCasting[p].pos.Y === game.players[p].pos.Y)
                this.createPlayerAction(
                    playerCasting[p].slot, 
                    p, 
                    playerCasting[p].action, 
                    playerCasting[p].target,
                    playerCasting[p].angle,
                    playerCasting[p].pvp
                );

            //Delete casting timer entry for player

            delete playerCasting[p];
        }
        else
            playerCasting[p].timer-=dt;
    };

    //Check NPC casting timers

    for (let map in npcCasting) {
        for (let npc in npcCasting[map]) {
            //Create NPC action when possible

            if (npcCasting[map][npc].timer <= 0) {
                this.createNPCAction(
                    parseInt(map), 
                    parseInt(npc),
                    npcCasting[map][npc].possibleAction,
                    npcCasting[map][npc].action,
                    npcCasting[map][npc].target
                );

                //Delete casting timer entry for NPC

                delete npcCasting[map][npc];
            }
            else
                npcCasting[map][npc].timer-=dt;
        }
    };
};

exports.updateActions = function(dt) {
    //Go over all active actions

    for (let a = 0; a < activeActions.length; a++) {
        //For all active action elements, handle delay

        for (let e = 0; e < activeActions[a].elements.length; e++) {
            //If delay of elements is accounted for, instantiate
            //action element for player or NPC

            if (activeActions[a].elements[e].delay <= 0) {
                //Player element instantiation

                if (activeActions[a].ownerType === 'player')
                    this.instantiatePlayerActionElement(activeActions[a], activeActions[a].elements[e]);

                //NPC element instantiation

                else if (activeActions[a].ownerType === 'npc')
                    this.instantiateNPCActionElement(activeActions[a], activeActions[a].elements[e]);

                //Remove the element from the active actions, to prevent
                //it from instantiating again

                activeActions[a].elements.splice(e, 1);
                e--;
            }
            else
                activeActions[a].elements[e].delay-=dt;
        }
    }
};

exports.updateCooldowns = function(dt) {
    //For all players go over the active action cooldowns

    for (let p in game.players)
        if (game.players[p] != undefined &&
            game.players[p].actions_cooldown != undefined)
            for (let action in game.players[p].actions_cooldown)
            {
                if (game.players[p].actions_cooldown[action] == undefined)
                    continue;

                //Decrement action cooldown for player

                game.players[p].actions_cooldown[action]-=dt;

                //Remove cooldown timer if cooldown is accounted for

                if (game.players[p].actions_cooldown[action] <= 0)
                    delete game.players[p].actions_cooldown[action];
            }
};

exports.updateProjectiles = function(dt) {
    for (let m = 0; m < projectiles.length; m++)
        if (projectiles[m] != undefined)
            for (let p = 0; p < projectiles[m].length; p++) {
                if (projectiles[m][p] == undefined)
                    continue;

                let projectile = projectiles[m][p],
                    element    = projectile.elements[0];

                //Move projectiles

                let xVel = element.projectileSpeed.x * dt;
                let yVel = element.projectileSpeed.y * dt;

                element.x += xVel;
                element.y += yVel;

                projectile.distance.x += Math.abs(xVel);
                projectile.distance.y += Math.abs(yVel);

                if (projectile.distance.x >= element.projectileDistance ||
                    projectile.distance.y >= element.projectileDistance) {
                    projectiles[m].splice(p, 1);
                    p--;

                    continue;
                }

                //Player projectile handling

                if (projectile.playerOwner != undefined) {
                    if (game.players[projectile.playerOwner] == undefined)
                        continue;

                    //Check if NPCs can be damaged

                    if (this.damageNPCs(
                        projectile.playerOwner,
                        projectile,
                        element,
                        collection[projectile.action]
                    )) {
                        server.removeActionElement(element.p_id, projectile.map);

                        projectiles[m].splice(p, 1);
                        p--;

                        continue;
                    }
                }

                //PvP projectile handling

                if (projectile.pvpOwner != undefined) {
                    if (game.players[projectile.pvpOwner] == undefined)
                        continue;

                    //Check if players can be damaged

                    if (this.damagePlayers(
                        game.players[projectile.pvpOwner].stats.attributes,
                        game.players[projectile.pvpOwner].statusEffectsMatrix['damageFactor'],
                        projectile,
                        element,
                        collection[projectile.action],
                        false,
                        projectile.pvpOwner
                    )) {
                        server.removeActionElement(element.p_id, projectile.map);

                        projectiles[m].splice(p, 1);
                        p--;

                        continue;
                    }

                    //And check if NPCs can be damaged

                    if (this.damageNPCs(
                        projectile.pvpOwner,
                        projectile,
                        element,
                        collection[projectile.action]
                    )) {
                        server.removeActionElement(element.p_id, projectile.map);

                        projectiles[m].splice(p, 1);
                        p--;

                        continue;
                    }
                }

                //NPC projectile handling

                if (projectile.npcOwner != undefined) {
                    if (npcs.onMap[projectile.map][projectile.npcOwner] == undefined ||
                        npcs.isTimedOut(projectile.map, projectile.npcOwner))
                        continue;

                    //Check if players can be damaged

                    if (this.damagePlayers(
                        npcs.onMap[projectile.map][projectile.npcOwner].data.stats,
                        npcs.onMap[projectile.map][projectile.npcOwner].statusEffectsMatrix['damageFactor'],
                        projectile,
                        element,
                        collection[projectile.action]
                    )) {
                        server.removeActionElement(element.p_id, projectile.map);

                        projectiles[m].splice(p, 1);
                        p--;

                        continue;
                    }
                }
            }
};

exports.convertActionData = function(actionData, name, angle, pvp)
{
    //Calculate center

    let cx = collection[name].sw / 2;
    let cy = collection[name].sh / 2;

    //Calculate angles

    let cos = Math.cos(angle),
        sin = Math.sin(angle);

    for (let e = 0; e < actionData.elements.length; e++) {
        //Calculate distance to center

        let w = actionData.elements[e].w*actionData.elements[e].scale,
            h = actionData.elements[e].h*actionData.elements[e].scale;

        let dx = actionData.elements[e].y+h/2-cy,
            dy = actionData.elements[e].x+w/2-cx;

        //Rotate around center
        //if no target is necessary

        if (actionData.targetType === 'none') {
            let nx = cos * dx - sin * dy;
            let ny = sin * dx + cos * dy;

            actionData.elements[e].x = nx - w/2;
            actionData.elements[e].y = ny - h/2;
        }
        else {
            actionData.elements[e].x -= cx;
            actionData.elements[e].y -= cy;
        }

        //Calculate projectile direction
        //based on rotation

        if (actionData.elements[e].type === 'projectile') {
            let nx = cos * dx - sin * dy;
            let ny = sin * dx + cos * dy;

            let length = Math.sqrt(nx * nx + ny * ny);
            nx /= length;
            ny /= length;

            let tw = tiled.maps[actionData.map].tileheight,
                th = tiled.maps[actionData.map].tileheight;

            actionData.elements[e].projectileSpeed = {
                x: actionData.elements[e].projectileSpeed * nx,
                y: actionData.elements[e].projectileSpeed * ny
            };

            actionData.elements[e].projectileDistance *= (tw + th) / 2;
        }
    }

    //Set action data sounds

    actionData.sounds = collection[name].sounds;
    actionData.centerPosition = {
        X: actionData.pos.X+cx,
        Y: actionData.pos.Y+cy
    };

    //Set action data action

    actionData.action = name;

    //Set action data PvP

    actionData.pvp = (pvp == undefined ? false : pvp);

    //Return converted data

    return actionData;
};

exports.getActionElementFrames = function(name) 
{
    //Get action

    let action = this.getAction(name);

    //Setup data

    let data = {
        sw: action.sw,
        sh: action.sh,
        targetType: action.targetType,
        frames: []
    };

    //Format elements

    for (let e = 0; e < action.elements.length; e++)
        data.frames.push({
            x: action.elements[e].x,
            y: action.elements[e].y,
            w: action.elements[e].w,
            h: action.elements[e].h,
            type: action.elements[e].type,
            scale: action.elements[e].scale
        });

    return data;
};

exports.hasPlayerAction = function(name, id)
{
    //Check if player exists

    if (game.players[id] === undefined)
        return false;

    //Check if the player has the action

    for (let a = 0; a < game.players[id].actions.length; a++)
        if (game.players[id].actions[a] != undefined &&
            game.players[id].actions[a].name === name)
            return true;

    return false;
};

exports.onCooldownPlayerAction = function(name, id)
{
    //Check if player exists

    if (game.players[id] === undefined)
        return false;

    //Check if the player has initialized
    //it's action cooldowns

    if (game.players[id].actions_cooldown === undefined)
        game.players[id].actions_cooldown = {};

    //Check if the player has the action
    //on cooldown

    if (game.players[id].actions_cooldown[name] == undefined)
        return false;
    else
        return true;
};

exports.addPlayerAction = function(name, id, uses)
{
    //Check if player exists

    if (game.players[id] === undefined)
        return false;

    //Try to add the action to one of the free slots

    let done = false;
    for (let a = 2; a < 7; a++)
        if (game.players[id].actions[a] == undefined) {
            game.players[id].actions[a] = {
                name: name
            };

            if (uses !== undefined) {
                game.players[id].actions[a].uses = uses;
                game.players[id].actions[a].max = uses;
            }

            done = true;

            server.syncPlayerActionSlot(a, id, game.players[id].channel);

            break;
        }

    return done;
};

exports.setPlayerAction = function(name, position, id)
{
    if (game.players[id] == undefined)
        return false;

    //Set action at position

    game.players[id].actions[position] = {
        name: name
    };

    //Sync to player

    server.syncPlayerPartially(id, 'actions', game.players[id].channel, false);

    return true;
};

exports.removePlayerAction = function(name, id)
{
    //Check if the player has the action

    if (!this.hasPlayerAction(name, id))
        return false;

    //Remove the first found action

    for (let a = 0; a < game.players[id].actions.length; a++)
        if (game.players[id].actions[a] != undefined &&
            game.players[id].actions[a].name === name) {
            game.players[id].actions[a] = undefined;

            break;
        }

    //Sync to player

    server.syncPlayerPartially(id, 'actions', game.players[id].channel);

    return true;
};

exports.calculateAverageScalingFromAction = function(actionName)
{
    if (actionName == undefined || collection[actionName] == undefined)
        return undefined;

    //Keep track of seen amount of stats
    //and the total average

    let recorded = {
        power: 0,
        agility: 0,
        intelligence: 0,
        wisdom: 0,
        vitality: 0,
        toughness: 0
    };

    let scaling = {
        power: 0,
        agility: 0,
        intelligence: 0,
        wisdom: 0,
        vitality: 0,
        toughness: 0
    };

    //Add all scaling, if the scaling is valid

    for (let e = 0; e < collection[actionName].elements.length; e++) {
        let elScaling = collection[actionName].elements[e].scaling;

        for (let key in elScaling)
            if (elScaling[key] !== 0) {
                scaling[key] += elScaling[key];
                recorded[key]++;
            }
    }

    //Average out

    for (let key in scaling)
        if (recorded[key] > 0)
            scaling[key] /= recorded[key];

    return scaling;
}

exports.createPlayerSlotAction = function(action)
{
    //Shorten action name

    let name = action.name;

    //Format data

    return {
        castingTime: collection[name].castingTime,
        cooldown: collection[name].cooldown,
        description: collection[name].description,
        elements: this.getActionElementFrames(name),
        heal: collection[name].heal,
        mana: collection[name].mana,
        max: action.max,
        name: name,
        scaling: this.calculateAverageScalingFromAction(name),
        targetType: collection[name].targetType,
        maxRange: collection[name].maxRange,
        sounds: collection[name].sounds,
        src: collection[name].src,
        uses: action.uses
    }
};

exports.canPlayerPerformAction = function(slot, id, target, name, pvp) {
    //Grab action

    let action = this.getAction(name);

    //Check if already casting the same spell

    if (playerCasting[id] != undefined &&
        playerCasting[id].action === name)
        return false;

    //Check if the action is on cooldown

    if (this.onCooldownPlayerAction(name, id))
        return false;

    //Check if player has the necessary mana

    if (action.mana !== 0)
        if (game.players[id].mana.cur+action.mana < 0)
            return false;

    //Check if player has enough usages

    if (game.players[id].actions[slot].name !== name ||
        game.players[id].actions[slot].uses == undefined &&
        game.players[id].actions[slot].uses <= 0)
        return false;

    //Check if player is in range if
    //the target type is not none

    if (action.targetType !== 'none') {
        let map = game.players[id].map_id;

        //Check player target

        target = this.checkPlayerTarget(id, action.targetType, target, pvp);
        if (target == undefined)
            return false;

        let targetPos = this.getPlayerActionPosition(id, action.targetType, target, pvp);

        let tw = tiled.maps[map].tilewidth;
        let th = tiled.maps[map].tileheight;

        let distance = game.calculateTileDistance(
            game.players[id].pos, 
            targetPos,
            tw,
            th
        );

        if (distance.x > action.maxRange ||
            distance.y > action.maxRange)
            return false;
    }

    return true;
};

exports.performPlayerAction = function(slot, id, target, angle, pvp) {
    try {
        //Check if slot exists

        if (!game.players[id].actions[slot])
            return;

        //Grab action name

        let name = game.players[id].actions[slot].name;

        //Check if player has the action

        if (!this.hasPlayerAction(name, id))
            return false;

        //Check if player can perform the action

        if (!this.canPlayerPerformAction(slot, id, target, name, pvp))
            return false;

        //Start casting

        let castingTime = collection[name].castingTime * game.players[id].statusEffectsMatrix['castingTimeFactor'];
        playerCasting[id] = {
            timer: castingTime,
            immediate: (castingTime === 0),
            pvp: (pvp == undefined ? false : pvp),
            target: target,
            slot: slot,
            action: name,
            angle: angle,
            pos: {
                X: game.players[id].pos.X,
                Y: game.players[id].pos.Y
            }
        };

        return true;
    }
    catch (err) {
        output.giveError('Could not perform player action: ', err);

        return false;
    }
};

exports.performNPCAction = function(possibleAction, map, id, target) {
    try {
        //Start casting

        let name = possibleAction.action;

        if (npcCasting[map] == undefined)
            npcCasting[map] = [];

        let castingTime = collection[name].castingTime * npcs.onMap[map][id].statusEffectsMatrix['castingTimeFactor'];
        npcCasting[map][id] = {
            timer: castingTime,
            immediate: (castingTime === 0),
            possibleAction: possibleAction,
            action: name,
            target: target
        };

        return true;
    }
    catch (err) {
        output.giveError('Could not perform NPC action: ', err);
        return false;
    }
};

exports.cancelPlayerCasting = function(id)
{
    //Check if casting, if so cancel casting

    if (this.isPlayerCasting(id)) {
        delete playerCasting[id];

        //Broadcast cancel cast package

        server.syncPlayerCancelCast(
            id, 
            game.players[id].channel, 
            true
        );
    }
};

exports.isPlayerCasting = function(id) {
    //Check if a player is casting

    return (playerCasting[id] != undefined &&
            !playerCasting[id].immediate);
};

exports.isNPCCasting = function(map, id) {
    //Check if an NPC is casting

    return (npcCasting[map] != undefined &&
            npcCasting[map][id] != undefined &&
            !npcCasting[map][id].immediate);
};

exports.checkPlayerTarget = function(id, targetType, target, pvp) {
    let map = game.players[id].map_id;

    //Check if the target is valid

    switch (true) {
        case targetType === 'hostile' && (typeof target === 'string' && pvp):
        case targetType === 'friendly':
            //Defer to player itself if no target
            //was specified

            if ((target == undefined ||                     //No target available
                typeof target === 'number' ||               //NPC target
                (typeof target === 'string' && pvp          //Player target and PvP zone
                && !parties.isMemberOfParty(id, target)))   //In PvP zone, player target is in the same party 
                && targetType === 'friendly')               //It is a friendly action, in a PvP zone
                target = id;

            if (target == undefined || game.players[target] == undefined)
                return;

            if (game.players[target].map_id !== map ||
                game.players[target].killed) {
                    //Send remove target package
                    
                    game.players[id].channel.emit('GAME_PLAYER_RESET_TARGET');

                    return;
                }
            break;
        case targetType === 'hostile':
            if (target == undefined || typeof target === 'string')
                return;

            if (npcs.onMap[map] == undefined ||
                npcs.onMap[map][target] == undefined ||
                npcs.onMap[map][target].killed) {
                //Send remove target package

                game.players[id].channel.emit('GAME_PLAYER_RESET_TARGET');

                return;
            }
            break;
    }

    return target;
};

exports.getPlayerActionPosition = function(id, targetType, target, pvp) {
    let map = game.players[id].map_id;

    let pos;
    switch (true) {
        case targetType === 'none':
            pos = {
                X: game.players[id].pos.X + game.players[id].character.width / 2,
                Y: game.players[id].pos.Y + game.players[id].character.height / 2
            };
            break;
        case targetType === 'hostile' && (typeof target === 'string' && pvp):
        case targetType === 'friendly':
            pos = {
                X: game.players[target].pos.X + game.players[target].character.width / 2,
                Y: game.players[target].pos.Y + game.players[target].character.height / 2
            };
            break;
        case targetType === 'hostile':
            pos = {
                X: npcs.onMap[map][target].pos.X + npcs.onMap[map][target].data.character.width / 2,
                Y: npcs.onMap[map][target].pos.Y + npcs.onMap[map][target].data.character.height / 2
            };
            break;
    }

    return pos;
};

exports.createPlayerAction = function(slot, id, name, target, angle, pvp)
{
    try {
        //Check if player still exists

        if (game.players[id] == undefined) 
            return;

        //Get the action and map of the player

        let map = game.players[id].map_id;
        let action = this.getAction(name);

        //Check if the target is valid

        target = this.checkPlayerTarget(id, action.targetType, target, pvp);
        if (target == undefined)
            return;

        //Delta player mana usage

        game.deltaManaPlayer(id, action.mana);

        //Decrement action usage if possible

        if (game.players[id].actions[slot].uses != undefined) {
            game.players[id].actions[slot].uses--;

            if (game.players[id].actions[slot].uses <= 0)
                game.players[id].actions[slot] = undefined;
        }

        //Generate action data

        let actionData = this.convertActionData(
            {
                pos: this.getPlayerActionPosition(id, action.targetType, target, pvp),
                map: map,
                elements: deepcopy(action.elements),
                ownerType: 'player',
                targetType: action.targetType,
                owner: id
            },
            name,
            angle,
            pvp
        );

        //Add to active actions

        activeActions.push(actionData);

        //Add cooldown to slot

        if (game.players[id].actions_cooldown === undefined)
            game.players[id].actions_cooldown = {};

        let cooldown = collection[name].cooldown;
        cooldown *= game.players[id].statusEffectsMatrix['cooldownTimeFactor'];

        game.players[id].actions_cooldown[name] = cooldown;

        //Emit action usage package

        game.players[id].channel.emit('GAME_PLAYER_ACTION_USAGE', slot);

        //Return true

        return true;
    }
    catch (err) {
        output.giveError('Could not create player action: ', err);
        return false;
    }
};

exports.createNPCAction = function(map, id, possibleAction, name, target)
{
    try {
        //Check if NPC still exists

        if (npcs.onMap[map][id] == undefined)
            return false;

        //Get the action

        let action = this.getAction(name);

        //Check if the target is valid

        switch (action.targetType) {
            case 'friendly':
                //Defer to NPC itself if no target
                //was specified

                if (npcs.onMap[map][id].killed)
                    return;
                break;
            case 'hostile':
                if (target == undefined)
                    return;

                if (game.players[target].map_id !== map ||
                    game.players[target].killed)
                    return;
                break;
        }

        //Generate action data

        //Action position is based on the
        //the target type

        let self = {
            X: npcs.onMap[map][id].pos.X + npcs.onMap[map][id].data.character.width / 2,
            Y: npcs.onMap[map][id].pos.Y + npcs.onMap[map][id].data.character.height / 2
        }, pos = self;

        if (action.targetType === 'hostile')
            pos = {
                X: game.players[target].pos.X + game.players[target].character.width / 2,
                Y: game.players[target].pos.Y + game.players[target].character.height / 2
            };

        //Calculate angle towards target

        let targetPos = {
            X: game.players[target].pos.X + game.players[target].character.width / 2,
            Y: game.players[target].pos.Y + game.players[target].character.height / 2
        };
        let delta = {
            dx: targetPos.X - self.X,
            dy: targetPos.Y - self.Y
        };
        let angle = Math.atan2(delta.dy, delta.dx);

        let actionData = this.convertActionData(
            {
                pos: pos,
                map: map,
                elements: deepcopy(action.elements),
                ownerType: 'npc',
                targetType: action.targetType,
                owner: id
            },
            name,
            angle
        );

        //Add to active actions

        activeActions.push(actionData);

        //Set NPC cooldown

        let cooldown = (action.cooldown + possibleAction.extraCooldown);
        cooldown *= npcs.onMap[map][id].statusEffectsMatrix['cooldownTimeFactor'];

        npcs.onMap[map][id].combat_cooldown.start(
            name,
            cooldown
        );
    }
    catch (err) {
        output.giveError('Could not create NPC action: ', err);
        return false;
    }
};

exports.instantiatePlayerActionElement = function(actionData, actionElement) {
    let id = actionData.owner,
        name = actionData.action;

    //Damage NPCs (and players if PvP)

    this.damageNPCs(
        id,
        actionData, 
        actionElement, 
        collection[name], 
        true
    );

    if (actionData.pvp)
        this.damagePlayers(
            game.players[id].attributes,
            game.players[id].statusEffectsMatrix['damageFactor'],
            actionData, actionElement, 
            collection[name], 
            true, 
            id
        );

    //Check for healing

    if (collection[name].heal > 0) {
        if (actionData.pvp) {
            game.healPlayer(id, collection[name].heal);
            this.healPartyPlayers(actionData, actionElement, collection[name].heal, id);
        } else 
            this.healPlayers(actionData, actionElement, collection[name].heal);
    }
    else if (collection[name].heal < 0) {
        let heal = collection[name].heal;
        heal = Math.round(heal * game.players[id].statusEffectsMatrix['damageFactor']);

        game.damagePlayer(id, heal);
    }

    //Add projectile

    if (actionElement.type === 'projectile') {
        if (actionData.pvp)
            actionElement.p_id = this.createPvpProjectile(id, actionData, actionElement);
        else
            actionElement.p_id = this.createPlayerProjectile(id, actionData, actionElement);
    }

    //Sync action

    server.syncActionElement(actionData, actionElement);
};

exports.instantiateNPCActionElement = function(actionData, actionElement) {
    let map = actionData.map,
        id = actionData.owner,
        name = actionData.action;

    //Damage players

    this.damagePlayers(
        npcs.onMap[map][id].data.stats, 
        npcs.onMap[map][id].statusEffectsMatrix['damageFactor'],
        actionData, 
        actionElement, 
        collection[name], 
        true
    );

    //Check for healing

    if (collection[name].heal > 0)
        this.healNPCs(actionData, actionElement, collection[name]);
    else if (collection[name].heal < 0)
        npcs.damageNPC(undefined, actionData.map, id, collection[name].heal);

    //Add projectile

    if (actionElement.type === 'projectile')
        actionElement.p_id = this.createNPCProjectile(id, actionData, actionElement);

    //Sync action

    server.syncActionElement(actionData, actionElement);
};

exports.damageNPCs = function(owner, actionData, actionElement, action, onlyStatic)
{
    try {
        //Check if NPCs on map exist

        if (npcs.onMap[actionData.map] == undefined ||
            npcs.onMap[actionData.map].length == 0)
            return false;

        //Check if only static was provided correctly

        if (onlyStatic == undefined)
            onlyStatic = false;

        //Check if a projectile and only static is allowed

        if (actionElement.type === 'projectile' &&
            onlyStatic)
            return false;

        //Setup action rectangle

        let actionRect = {
            x: actionData.pos.X+actionElement.x,
            y: actionData.pos.Y+actionElement.y,
            w: actionElement.w*actionElement.scale,
            h: actionElement.h*actionElement.scale
        };

        //For all NPCs, check if damaging occurs

        let result = false;
        for (let n = 0; n < npcs.onMap[actionData.map].length; n++)
        {
            //Check if NPC does not exist, is not hostile or is timed out

            if (npcs.onMap[actionData.map][n] == undefined ||
                npcs.onMap[actionData.map][n].data.type !== 'hostile' ||
                npcs.isTimedOut(actionData.map, n))
                continue;

            //Setup NPC rectangle

            let npcRect = {
                x: npcs.onMap[actionData.map][n].pos.X,
                y: npcs.onMap[actionData.map][n].pos.Y,
                w: npcs.onMap[actionData.map][n].data.character.width,
                h: npcs.onMap[actionData.map][n].data.character.height
            };

            //Check for rectangular collision, if this occurs;
            //damage the NPC

            if (tiled.checkRectangularCollision(actionRect, npcRect) &&
                !npcs.isInvisible(owner, n)) {
                //Calculate damage

                let damage = this.calculateDamage(game.players[owner].attributes, actionElement.scaling);

                //Adjust damage based on damage factor

                damage = Math.round(damage * game.players[owner].statusEffectsMatrix['damageFactor']);

                //Damage NPC, if result is true - the NPC
                //has been killed, if not killed try to
                //apply the buff

                if (!npcs.damageNPC(owner, actionData.map, n, damage)) {
                    //If buff is available, apply that buff - 
                    //and the damage is not zero

                    if (actionElement.statusEffect !== '' && damage < 0)
                        status.giveNPCStatusEffect(actionData.map, n, actionElement.statusEffect, owner);
                }

                result = true;
            }
        }

        return result;
    }
    catch (err) {
        output.giveError('Could not damage NPCs: ', err);
        return false;
    }
};

exports.healNPCs = function(actionData, actionElement, action)
{
    try {
        //Check if NPCs on map exist

        if (npcs.onMap[actionData.map] == undefined ||
            npcs.onMap[actionData.map].length == 0)
            return;

        //Setup action rectangle

        let actionRect = {
            x: actionData.pos.X+actionElement.x,
            y: actionData.pos.Y+actionElement.y,
            w: actionElement.w*actionElement.scale,
            h: actionElement.h*actionElement.scale
        };

        //For all NPCs, try healing

        for (let n = 0; n < npcs.onMap[actionData.map].length; n++)
        {
            //Check if NPC does not exist, is not hostile or
            //is timed out

            if (npcs.onMap[actionData.map][n] == undefined ||
                npcs.onMap[actionData.map][n].data.type !== 'hostile' ||
                npcs.isTimedOut(actionData.map, n))
                continue;

            //Setup NPC rectangle

            let npcRect = {
                x: npcs.onMap[actionData.map][n].pos.X,
                y: npcs.onMap[actionData.map][n].pos.Y,
                w: npcs.onMap[actionData.map][n].data.character.width,
                h: npcs.onMap[actionData.map][n].data.character.height
            };

            //Check for rectangular collision, if so;
            //heal the NPC

            if (tiled.checkRectangularCollision(actionRect, npcRect)) {
                //Heal NPC

                npcs.healNPC(actionData.map, n, action.heal);

                //If buff is available, apply that buff

                if (actionElement.statusEffect !== '')
                    status.giveNPCStatusEffect(actionData.map, n, actionElement.statusEffect);
            }
        }
    }
    catch (err) {
        output.giveError('Could not heal NPCs: ', err);
    }
};

exports.damagePlayers = function(stats, damageFactor, actionData, actionElement, action, onlyStatic, except)
{
    try {
        //Make sure only static is provided correctly

        if (onlyStatic == undefined)
            onlyStatic = false;

        //If a projectile and only static is allowed, skip

        if (actionElement.type === 'projectile' &&
            onlyStatic)
            return false;

        //Check if the action is undefined

        if (action == undefined)
            return false;

        //Except indicates a pvp action,
        //if the except player is in a party
        //the players who are also in that party
        //will not be damaged

        let members = {};

        if (parties.inParty(except))
            members = parties.getPartyMembers(except);

        //Setup action rectangle

        let actionRect = {
            x: actionData.pos.X+actionElement.x,
            y: actionData.pos.Y+actionElement.y,
            w: actionElement.w*actionElement.scale,
            h: actionElement.h*actionElement.scale
        };

        //Get all players on the same map

        let done = false;
        for (let p in rooms.get(actionData.map))
        {
            //Make sure that the player exists, is on the same map
            //as the action and is not a part of the party of
            //the action owner

            if (game.players[p] == undefined ||
                game.players[p].map_id != actionData.map ||
                members[p] === 'participant' ||
                p === except)
                continue;

            //Setup player rectangle

            let playerRect = {
                x: game.players[p].pos.X,
                y: game.players[p].pos.Y,
                w: game.players[p].character.width,
                h: game.players[p].character.height
            };

            //Check for rectangular collision, if so;
            //damage the player and set to in-combat

            if (tiled.checkRectangularCollision(actionRect, playerRect)) {
                //Set in-combat

                this.active.add(p);

                //Calculate damage

                let damage = this.calculateDamage(stats, actionElement.scaling);

                //Adjust damage based on status effect matrix

                damage = Math.round(damage * damageFactor);

                //Damage player

                if (!game.damagePlayer(p, damage, except)) {
                    //If buff is available, apply that buff - 
                    //and the attack did not miss

                    if (actionElement.statusEffect !== '' && damage < 0) {
                        let owner = actionData.owner;
                        if (actionData.ownerType === 'npc')
                            owner = npcs.onMap[actionData.map][owner].name;

                        status.givePlayerStatusEffect(p, owner, true, actionElement.statusEffect);
                    }
                }

                done = true;
            }
        }

        return done;
    }
    catch (err) {
        output.giveError('Could not damage player(s): ', err);

        return false;
    }
}

exports.healPlayers = function(actionData, actionElement, heal)
{
    try {
        //Setup the action rectangle

        let actionRect = {
            x: actionData.pos.X+actionElement.x,
            y: actionData.pos.Y+actionElement.y,
            w: actionElement.w*actionElement.scale,
            h: actionElement.h*actionElement.scale
        };

        for (let p in game.players)
        {
            //Check if player exists, and is on
            //the same map

            if (game.players[p] == undefined ||
                game.players[p].map_id != actionData.map)
                continue;

            //Setup player rectangle

            let playerRect = {
                x: game.players[p].pos.X,
                y: game.players[p].pos.Y,
                w: game.players[p].character.width,
                h: game.players[p].character.height
            };

            //Check for rectangular collision, if so;
            //heal the player

            if (tiled.checkRectangularCollision(actionRect, playerRect)) {
                //Heal the player

                game.healPlayer(p, heal);

                //If buff is available, apply that buff

                if (actionElement.statusEffect !== '') {
                    let owner = actionData.owner;
                    if (actionData.ownerType === 'npc')
                        owner = npcs.onMap[actionData.map][owner].name;

                    status.givePlayerStatusEffect(p, owner, false, actionElement.statusEffect);
                }
            }
        }
    }
    catch (err) {
        output.giveError('Could not heal players: ', err);
    }
};

exports.healPartyPlayers = function(actionData, actionElement, heal, owner) 
{
    try {
        //Check if the owner is in a party

        if (!parties.inParty(owner))
            return;

        //Setup the action rectangle

        let actionRect = {
            x: actionData.pos.X+actionElement.x,
            y: actionData.pos.Y+actionElement.y,
            w: actionElement.w*actionElement.scale,
            h: actionElement.h*actionElement.scale
        };

        //For all party members, check if healing
        //is possible

        for (let p in parties.getPartyMembers(owner))
        {
            //Check if the player actually exists,
            //and is on the same map as the action

            if (game.players[p] == undefined ||
                game.players[p].map_id != actionData.map)
                continue;

            //Setup player rectangle

            let playerRect = {
                x: game.players[p].pos.X,
                y: game.players[p].pos.Y,
                w: game.players[p].character.width,
                h: game.players[p].character.height
            };

            //Check for rectangular collision, if so;
            //heal the player

            if (tiled.checkRectangularCollision(actionRect, playerRect)) {
                //Heal the player

                game.healPlayer(p, heal);

                //If buff is available, apply that buff

                if (actionElement.statusEffect !== '')
                    status.givePlayerStatusEffect(p, owner, false, actionElement.statusEffect);
            }
        }
    }
    catch (err) {
        output.giveError('Could not heal party players: ', err);
    }
};

exports.createProjectile = function(type, id, actionData, actionElement)
{
    try {
        let p_id;

        //deepcopy the element

        let element = deepcopy(actionElement);

        //Check if projectiles on map exist

        if (projectiles[actionData.map] == undefined)
            projectiles[actionData.map] = [];

        //Fill an empty spot with the new projectile

        for (let p = 0; p < projectiles[actionData.map].length+1; p++) {
            if (projectiles[actionData.map][p] == undefined) {
                //Set projectile id

                element.p_id = p;

                //Hard copy the action data and set the projectile as an element

                projectiles[actionData.map][p] = {
                    pos: actionData.pos,
                    map: actionData.map,
                    elements: [element]
                };

                //Set action id

                projectiles[actionData.map][p].action = actionData.action;

                //Set the owner identifier according
                //to it's type

                projectiles[actionData.map][p][type + 'Owner'] = id;

                //Set the empty distance

                projectiles[actionData.map][p].distance = {
                    x: 0,
                    y: 0
                };

                p_id = p;
                break;
            }
        }

        return p_id;
    }
    catch (err) {
        output.giveError('Could not create projectile: ', err);
        return;
    }
};

exports.createPlayerProjectile = function(id, actionData, actionElement)
{
    return this.createProjectile('player', id, actionData, actionElement)
};

exports.createPvpProjectile = function(id, actionData, actionElement)
{
    return this.createProjectile('pvp', id, actionData, actionElement)
};

exports.createNPCProjectile = function(id, actionData, actionElement)
{
    return this.createProjectile('npc', id, actionData, actionElement)
};

exports.calculateDamage = function(stats, scaling)
{
    let total = 0;

    total += 10*stats.power*scaling.power;
    total += 10*stats.agility*scaling.agility;
    total += 10*stats.wisdom*scaling.wisdom;
    total += 10*stats.intelligence*scaling.intelligence;
    total += 10*stats.toughness*scaling.toughness;
    total += 10*stats.vitality*scaling.vitality;

    return -Math.round(Math.random()*total);
};
