//Actions module for WebClash Server

const collection = {};

const playerCasting = {};
const npcCasting = {};

const projectiles = [];
const activeActions = [];

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
            let action = actions.loadAction(location + '/' + file);
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
        return JSON.parse(fs.readFileSync(location, 'utf-8'));
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

exports.combat = {
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
                    npcCasting[map][npc].action
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

exports.convertActionData = function(actionData, name, direction, character, pvp)
{
    //Convert projectiles

    for (let e = 0; e < actionData.elements.length; e++)
        if (actionData.elements[e].type === 'projectile') {
            let w = actionData.elements[e].w*actionData.elements[e].scale,
                h = actionData.elements[e].h*actionData.elements[e].scale;

            let dx = actionData.elements[e].x+w/2-collection[name].sw/2,
                dy = actionData.elements[e].y+h/2-collection[name].sh/2

            let wl = collection[name].sw/6,
                hl = collection[name].sh/6;

            if (dx > wl)
                dx = wl;
            else if (dx < -wl)
                dx = -wl;

            if (dy > hl)
                dy = hl;
            else if (dy < -hl)
                dy = -hl;

            actionData.elements[e].projectileSpeed = {
                x: dx/wl*actionData.elements[e].projectileSpeed,
                y: dy/hl*actionData.elements[e].projectileSpeed
            };

            actionData.elements[e].projectileDistance =
                actionData.elements[e].projectileDistance * 
                (tiled.maps[actionData.map].tilewidth + tiled.maps[actionData.map].tileheight)/2;
        }

    //Positional correcting

    if (direction == 1 || direction == 2)
         for (let e = 0; e < actionData.elements.length; e++) {
            let w = actionData.elements[e].w*actionData.elements[e].scale;

             let x = actionData.elements[e].x;

             actionData.elements[e].x = actionData.elements[e].y;
             actionData.elements[e].y = x+character.height;

             if (direction == 1) {
                 actionData.elements[e].x = collection[name].sw-actionData.elements[e].x-w+character.width;

                 if (actionData.elements[e].type === 'projectile') {
                     let y = actionData.elements[e].projectileSpeed.y;

                     actionData.elements[e].projectileSpeed.y = actionData.elements[e].projectileSpeed.x;
                     actionData.elements[e].projectileSpeed.x = -y;
                 }
             }
             else {
                 actionData.elements[e].x -= character.width;

                 if (actionData.elements[e].type === 'projectile') {
                     let y = actionData.elements[e].projectileSpeed.y;

                     actionData.elements[e].projectileSpeed.y = actionData.elements[e].projectileSpeed.x;
                     actionData.elements[e].projectileSpeed.x = y;
                 }
             }
         }

    if (direction == 3)
        for (let e = 0; e < actionData.elements.length; e++) {
            let h = actionData.elements[e].h*actionData.elements[e].scale;

             actionData.elements[e].y = collection[name].sh-actionData.elements[e].y-h+character.height*2;

             if (actionData.elements[e].type === 'projectile')
                 actionData.elements[e].projectileSpeed.y *= -1;
        }

    //Set action data position

    actionData.pos.X += character.width/2-collection[name].sw/2;
    actionData.pos.Y += -collection[name].sh/2-character.height/2;

    //Set action data sounds

    actionData.sounds = collection[name].sounds;
    actionData.centerPosition = {
        X: actionData.pos.X+collection[name].sw/2,
        Y: actionData.pos.Y+collection[name].sh/2
    };

    //Set action data action

    actionData.action = name;

    //Set action data PvP

    actionData.pvp = (pvp == undefined ? false : pvp);

    //Return converted data

    return actionData;
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

            server.syncActionSlot(a, id, game.players[id].channel);

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

exports.createPlayerSlotAction = function(action)
{
    //Shorten action name

    let name = action.name;

    //Format data

    return {
        name: action.name,
        uses: action.uses,
        max: action.max,
        description: collection[name].description,
        cooldown: collection[name].cooldown,
        castingTime: collection[name].castingTime,
        scaling: collection[name].scaling,
        sounds: collection[name].sounds,
        heal: collection[name].heal,
        mana: collection[name].mana,
        src: collection[name].src
    };
};

exports.canPlayerPerformAction = function(slot, id, name) {
    //Check if already casting the same spell

    if (playerCasting[id] != undefined &&
        playerCasting[id].action === name)
        return false;

    //Check if the action is on cooldown

    if (this.onCooldownPlayerAction(name, id))
        return false;

    //Check if player has the necessary mana

    if (collection[name].mana !== 0)
        if (game.players[id].mana.cur+collection[name].mana < 0)
            return false;

    //Check if player has enough usages

    if (game.players[id].actions[slot].name !== name ||
        game.players[id].actions[slot].uses == undefined &&
        game.players[id].actions[slot].uses <= 0)
        return false;

    return true;
};

exports.performPlayerAction = function(slot, id, pvp) {
    try {
        //Grab action name

        let name = game.players[id].actions[slot].name;

        //Check if player has the action

        if (!this.hasPlayerAction(name, id))
            return false;

        //Check if player can perform the action

        if (!this.canPlayerPerformAction(slot, id, name))
            return false;

        //Start casting

        let castingTime = collection[name].castingTime * game.players[id].statusEffectsMatrix['castingTimeFactor'];
        playerCasting[id] = {
            pvp: (pvp == undefined ? false : pvp),
            timer: castingTime,
            immediate: (castingTime === 0),
            slot: slot,
            action: name,
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

exports.performNPCAction = function(possibleAction, map, id) {
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
            action: name
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

exports.createPlayerAction = function(slot, id, name, pvp)
{
    try {
        //Check if player still exists

        if (game.players[id] == undefined) 
            return;

        //Delta player mana usage

        game.deltaManaPlayer(id, collection[name].mana);

        //Decrement action usage if possible

        if (game.players[id].actions[slot].uses != undefined) {
            game.players[id].actions[slot].uses--;

            if (game.players[id].actions[slot].uses <= 0)
                game.players[id].actions[slot] = undefined;
        }

        //Generate action data

        let actionData = this.convertActionData(
            {
                pos: game.calculateFace(
                    game.players[id].pos,
                    game.players[id].character.width,
                    game.players[id].character.height,
                    game.players[id].direction
                ),
                map: game.players[id].map_id,
                elements: deepcopy(collection[name].elements),
                ownerType: 'player',
                owner: id
            },
            name,
            game.players[id].direction,
            game.players[id].character,
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

exports.createNPCAction = function(map, id, possibleAction, name)
{
    try {
        //Check if NPC still exists

        if (npcs.onMap[map][id] == undefined)
            return false;

        //Generate action data

        let actionData = this.convertActionData(
            {
                pos: game.calculateFace(
                    npcs.onMap[map][id].pos,
                    npcs.onMap[map][id].data.character.width,
                    npcs.onMap[map][id].data.character.height,
                    npcs.onMap[map][id].direction
                ),
                map: map,
                elements: deepcopy(collection[name].elements),
                ownerType: 'npc',
                owner: id
            },
            name,
            npcs.onMap[map][id].direction,
            npcs.onMap[map][id].data.character
        );

        //Add to active actions

        activeActions.push(actionData);

        //Set NPC cooldown

        let cooldown = (collection[name].cooldown + possibleAction.extraCooldown);
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

                let damage = this.calculateDamage(game.players[owner].attributes, action.scaling);

                //Adjust damage based on damage factor

                damage = Math.round(damage * game.players[owner].statusEffectsMatrix['damageFactor']);

                //Damage NPC

                npcs.damageNPC(owner, actionData.map, n, damage);

                //If buff is available, apply that buff - 
                //and the damage is not zero

                if (actionElement.statusEffect !== '' && damage < 0)
                    status.giveNPCStatusEffect(actionData.map, n, actionElement.statusEffect, owner);

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

                this.combat.add(p);

                //Calculate damage

                let damage = this.calculateDamage(stats, action.scaling);

                //Adjust damage based on status effect matrix

                damage = Math.round(damage * damageFactor);

                //Damage player

                game.damagePlayer(p, damage, except);

                //If buff is available, apply that buff - 
                //and the attack did not miss

                if (actionElement.statusEffect !== '' && damage < 0) {
                    let owner = actionData.owner;
                    if (actionData.ownerType === 'npc')
                        owner = npcs.onMap[actionData.map][owner].name;

                    status.givePlayerStatusEffect(p, owner, true, actionElement.statusEffect);
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
