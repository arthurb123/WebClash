//Actions module for WebClash Server

const fs = require('fs');

exports.collection = [];

exports.projectiles = [];

exports.updateCooldowns = function() {
    for (let p = 0; p < game.players.length; p++)
        if (game.players[p] != undefined &&
            game.players[p].actions_cooldown != undefined)
            for (let action in game.players[p].actions_cooldown)
            {
                if (game.players[p].actions_cooldown[action] == undefined)
                    continue;

                game.players[p].actions_cooldown[action]--;

                if (game.players[p].actions_cooldown[action] <= 0)
                    game.players[p].actions_cooldown[action] = undefined;
            }
};

exports.updateProjectiles = function() {
    for (let m = 0; m < this.projectiles.length; m++)
        if (this.projectiles[m] != undefined)
            for (let p = 0; p < this.projectiles[m].length; p++) {
                if (this.projectiles[m][p] == undefined)
                    continue;

                this.projectiles[m][p].elements[0].x += this.projectiles[m][p].elements[0].projectileSpeed.x;
                this.projectiles[m][p].elements[0].y += this.projectiles[m][p].elements[0].projectileSpeed.y;

                this.projectiles[m][p].distance.x += Math.abs(this.projectiles[m][p].elements[0].projectileSpeed.x);
                this.projectiles[m][p].distance.y += Math.abs(this.projectiles[m][p].elements[0].projectileSpeed.y);

                if (this.projectiles[m][p].distance.x >= this.projectiles[m][p].elements[0].projectileDistance ||
                    this.projectiles[m][p].distance.y >= this.projectiles[m][p].elements[0].projectileDistance) {
                    this.projectiles[m][p] = undefined;

                    continue;
                }

                //Player projectile handling

                if (this.projectiles[m][p].playerOwner != undefined) {
                    if (game.players[this.projectiles[m][p].playerOwner] == undefined)
                        continue;

                    if (this.damageNPCs(
                        this.projectiles[m][p].playerOwner,
                        game.players[this.projectiles[m][p].playerOwner].stats.attributes,
                        this.projectiles[m][p],
                        this.collection[this.projectiles[m][p].a_id]
                    )) {
                        server.removeAction(this.projectiles[m][p].elements[0].p_id, this.projectiles[m][p].map);

                        this.projectiles[m][p] = undefined;

                        continue;
                    }
                }

                //NPC projectile handling

                if (this.projectiles[m][p].npcOwner != undefined) {
                    if (npcs.isTimedOut(this.projectiles[m][p].map, this.projectiles[m][p].npcOwner))
                        continue;

                    if (this.damagePlayers(
                        this.projectiles[m][p].map,
                        npcs.onMap[this.projectiles[m][p].map][this.projectiles[m][p].npcOwner].data.stats,
                        this.projectiles[m][p],
                        this.collection[this.projectiles[m][p].a_id]
                    )) {
                        server.removeAction(this.projectiles[m][p].elements[0].p_id, this.projectiles[m][p].map);

                        this.projectiles[m][p] = undefined;

                        continue;
                    }
                }
            }
};

exports.loadAllActions = function(cb)
{
    let location = 'actions';

    fs.readdir(location, (err, files) => {
        let count = 0;

        files.forEach(file => {
            actions.collection.push(actions.loadAction(location + '/' + file));

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
        output.give(err);
    }
};

exports.getAction = function(name)
{
    let id = this.getActionIndex(name);
    if (id == -1)
        return;

    return this.collection[id];
};

exports.getActionIndex = function(name)
{
    for (let i = 0; i < this.collection.length; i++)
        if (this.collection[i].name === name)
            return i;

    return -1;
};

exports.convertActionData = function(actionData, a_id, direction, character)
{
    //Convert projectiles

    for (let e = 0; e < actionData.elements.length; e++)
        if (actionData.elements[e].type === 'projectile') {
            let dx = actionData.elements[e].x+actionData.elements[e].w/2-this.collection[a_id].sw/2,
                dy = actionData.elements[e].y+actionData.elements[e].h/2-this.collection[a_id].sh/2

            let wl = this.collection[a_id].sw/6,
                hl = this.collection[a_id].sh/6;

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
                actionData.elements[e].projectileDistance * (tiled.maps[actionData.map].tilewidth+tiled.maps[actionData.map].tileheight)/2;
        }

    //Positional correcting

    if (direction == 1 || direction == 2)
         for (let e = 0; e < actionData.elements.length; e++) {
             let x = actionData.elements[e].x;

             actionData.elements[e].x = actionData.elements[e].y;
             actionData.elements[e].y = x+character.height;

             if (direction == 1) {
                 actionData.elements[e].x = this.collection[a_id].sw-actionData.elements[e].x-actionData.elements[e].w+character.width;

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
             actionData.elements[e].y = this.collection[a_id].sh-actionData.elements[e].y-actionData.elements[e].h+character.height*2;

             if (actionData.elements[e].type === 'projectile')
                 actionData.elements[e].projectileSpeed.y *= -1;
        }

    //Set action data position

    actionData.pos.X+=character.width/2-this.collection[a_id].sw/2;
    actionData.pos.Y+=-this.collection[a_id].sh/2-character.height/2;

    //Set action data sounds

    actionData.sounds = this.collection[a_id].sounds;
    actionData.centerPosition = {
        X: actionData.pos.X+this.collection[a_id].sw/2,
        Y: actionData.pos.Y+this.collection[a_id].sh/2
    };

    //Return converted data

    return actionData;
};

exports.hasPlayerAction = function(name, id)
{
    if (game.players[id] === undefined)
        return false;

    for (let a = 0; a < game.players[id].actions.length; a++)
        if (game.players[id].actions[a] != undefined &&
            game.players[id].actions[a].name === name)
            return true;

    return false;
};

exports.onCooldownPlayerAction = function(name, id)
{
    if (game.players[id] === undefined)
        return false;

    if (game.players[id].actions_cooldown === undefined)
        game.players[id].actions_cooldown = {};

    if (game.players[id].actions_cooldown[name] == undefined)
        return false;
    else
        return true;
};

exports.addPlayerAction = function(name, id, uses)
{
    if (game.players[id] === undefined)
        return false;

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

            server.syncActionSlot(a, id, game.players[id].socket);

            break;
        }

    return done;
};

exports.setPlayerAction = function(socket, name, position, id)
{
    if (game.players[id] == undefined)
        return false;

    game.players[id].actions[position] = {
        name: name
    };

    server.syncPlayerPartially(id, 'actions', socket, false);

    return true;
};

exports.removePlayerAction = function(socket, name, id)
{
    if (!this.hasPlayerAction(name, id))
        return true;

    for (let a = 0; a < game.players[id].actions.length; a++)
        if (game.players[id].actions[a] != undefined &&
            game.players[id].actions[a].name === name) {
            game.players[id].actions[a] = undefined;

            break;
        }

    server.syncPlayerPartially(id, 'actions', socket, false);

    return true;
};

exports.createPlayerSlotAction = function(action)
{
    let id = this.getActionIndex(action.name);

    if (id == -1)
        return;

    return {
        name: action.name,
        uses: action.uses,
        max: action.max,
        description: this.collection[id].description,
        cooldown: this.collection[id].cooldown,
        sounds: this.collection[id].sounds,
        src: this.collection[id].src
    };
};

exports.createPlayerAction = function(slot, id)
{
    //Check if action exists at slot

    if (game.players[id].actions[slot] == undefined)
        return;

    let name = game.players[id].actions[slot].name,
        a_id = this.getActionIndex(name);

    //Check if valid

    if (a_id == -1)
        return false;

    //Check if player has the action

    if (!this.hasPlayerAction(name, id))
        return false;

    //Check if the action is on cooldown

    if (this.onCooldownPlayerAction(name, id))
        return false;

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
            map: tiled.getMapIndex(game.players[id].map),
            elements: JSON.parse(JSON.stringify(this.collection[a_id].elements))
        },
        a_id,
        game.players[id].direction,
        game.players[id].character
    );

    //Damage NPCs

    this.damageNPCs(id, game.players[id].attributes, actionData, this.collection[a_id], true);

    //Check for healing

    if (this.collection[a_id].heal > 0)
        this.healPlayers(actionData, this.collection[a_id].heal);

    //Add projectiles

    for (let e = 0; e < actionData.elements.length; e++)
        if (actionData.elements[e].type === 'projectile')
            actionData.elements[e].p_id = this.createPlayerProjectile(id, actionData, e, a_id);

    //Add cooldown to slot

    if (game.players[id].actions_cooldown === undefined)
        game.players[id].actions_cooldown = {};

    game.players[id].actions_cooldown[name] = this.collection[a_id].cooldown;

    //Sync action

    server.syncAction(actionData);

    //Return true

    return true;
};

exports.createNPCAction = function(possibleAction, map, id)
{
    let a_id = this.getActionIndex(possibleAction.action);

    //Check if valid

    if (a_id == -1)
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
            elements: JSON.parse(JSON.stringify(this.collection[a_id].elements))
        },
        a_id,
        npcs.onMap[map][id].direction,
        npcs.onMap[map][id].data.character
    );

    //Damage players

    this.damagePlayers(map, npcs.onMap[map][id].data.stats, actionData, this.collection[a_id], true);

    //Check for healing

    if (this.collection[a_id].heal > 0)
        this.healNPCs(actionData, this.collection[a_id]);

    //Add projectiles

    for (let e = 0; e < actionData.elements.length; e++)
        if (actionData.elements[e].type === 'projectile')
            actionData.elements[e].p_id = this.createNPCProjectile(id, actionData, e, a_id);

    //Sync action

    server.syncAction(actionData);

    //Set NPC cooldown

    npcs.onMap[map][id].combat_cooldown.start(this.collection[a_id].name, this.collection[a_id].cooldown+possibleAction.extraCooldown);
};

exports.damageNPCs = function(owner, stats, actionData, action, onlyStatic)
{
    if (npcs.onMap[actionData.map] == undefined ||
        npcs.onMap[actionData.map].length == 0)
        return false;

    if (onlyStatic == undefined)
        onlyStatic = false;

    let result = false;

    for (let e = 0; e < actionData.elements.length; e++) {
        if (actionData.elements[e].type === 'projectile' &&
            onlyStatic)
            continue;

        for (let n = 0; n < npcs.onMap[actionData.map].length; n++)
        {
            if (npcs.onMap[actionData.map][n] == undefined ||
                npcs.onMap[actionData.map][n] == undefined ||
                npcs.onMap[actionData.map][n].data.type !== 'hostile' ||
                npcs.isTimedOut(actionData.map, n))
                continue;

            let actionRect = {
                x: actionData.pos.X+actionData.elements[e].x,
                y: actionData.pos.Y+actionData.elements[e].y,
                w: actionData.elements[e].w,
                h: actionData.elements[e].h
            };

            let npcRect = {
                x: npcs.onMap[actionData.map][n].pos.X,
                y: npcs.onMap[actionData.map][n].pos.Y,
                w: npcs.onMap[actionData.map][n].data.character.width,
                h: npcs.onMap[actionData.map][n].data.character.height
            };

            if (tiled.checkRectangularCollision(actionRect, npcRect)) {
                npcs.damageNPC(owner, actionData.map, n, this.calculateDamage(stats, action.scaling));

                result = true;
            }
        }
    }

    return result;
};

exports.healNPCs = function(actionData, action)
{
    if (npcs.onMap[actionData.map] == undefined ||
        npcs.onMap[actionData.map].length == 0)
        return;

    for (let e = 0; e < actionData.elements.length; e++)
        for (let n = 0; n < npcs.onMap[actionData.map].length; n++)
        {
            if (npcs.onMap[actionData.map][n] == undefined ||
                npcs.onMap[actionData.map][n].data.type !== 'hostile' ||
                npcs.isTimedOut(actionData.map, n))
                continue;

            let actionRect = {
                x: actionData.pos.X+actionData.elements[e].x,
                y: actionData.pos.Y+actionData.elements[e].y,
                w: actionData.elements[e].w,
                h: actionData.elements[e].h
            };

            let npcRect = {
                x: npcs.onMap[actionData.map][n].pos.X,
                y: npcs.onMap[actionData.map][n].pos.Y,
                w: npcs.onMap[actionData.map][n].data.character.width,
                h: npcs.onMap[actionData.map][n].data.character.height
            };

            if (tiled.checkRectangularCollision(actionRect, npcRect))
            {
                npcs.onMap[actionData.map][n].data.health.cur += action.heal;

                if (npcs.onMap[actionData.map][n].data.health.cur >= npcs.onMap[actionData.map][n].data.health.max)
                    npcs.onMap[actionData.map][n].data.health.cur = npcs.onMap[actionData.map][n].data.health.max;

                server.syncNPCPartially(actionData.map, n, 'health');
            }
        }
};

exports.damagePlayers = function(map, stats, actionData, action, onlyStatic)
{
    let done = false;

    if (onlyStatic == undefined)
        onlyStatic = false;

    for (let e = 0; e < actionData.elements.length; e++) {
        if (actionData.elements[e].type === 'projectile' &&
            onlyStatic)
            continue;

        for (let p = 0; p < game.players.length; p++)
        {
            if (game.players[p] == undefined ||
                tiled.getMapIndex(game.players[p].map) != actionData.map)
                continue;

            let actionRect = {
                x: actionData.pos.X+actionData.elements[e].x,
                y: actionData.pos.Y+actionData.elements[e].y,
                w: actionData.elements[e].w,
                h: actionData.elements[e].h
            };

            let playerRect = {
                x: game.players[p].pos.X,
                y: game.players[p].pos.Y,
                w: game.players[p].character.width,
                h: game.players[p].character.height
            };

            if (tiled.checkRectangularCollision(actionRect, playerRect)) {
                if (game.damagePlayer(p, this.calculateDamage(stats, action.scaling)))
                    npcs.removeNPCTargets(map, p);

                done = true;
            }
        }
    }

    return done;
}

exports.healPlayers = function(actionData, heal)
{
    for (let e = 0; e < actionData.elements.length; e++)
        for (let p = 0; p < game.players.length; p++)
        {
            if (game.players[p] == undefined ||
                tiled.getMapIndex(game.players[p].map) != actionData.map)
                continue;

            let actionRect = {
                x: actionData.pos.X+actionData.elements[e].x,
                y: actionData.pos.Y+actionData.elements[e].y,
                w: actionData.elements[e].w,
                h: actionData.elements[e].h
            };

            let playerRect = {
                x: game.players[p].pos.X,
                y: game.players[p].pos.Y,
                w: game.players[p].character.width,
                h: game.players[p].character.height
            };

            if (tiled.checkRectangularCollision(actionRect, playerRect))
                game.healPlayer(p, heal);
        }
};

exports.createProjectile = function(type, id, actionData, e_id, a_id)
{
    let projectileData = actionData.elements[e_id],
        p_id = -1;

    //Check if projectiles on map exist

    if (this.projectiles[actionData.map] == undefined)
        this.projectiles[actionData.map] = [];

    //Fill an empty spot with the new projectile

    for (let p = 0; p < this.projectiles[actionData.map].length+1; p++) {
        if (this.projectiles[actionData.map][p] == undefined) {
            //Hard copy the action data and set the projectile as an element

            this.projectiles[actionData.map][p] = {
                pos: actionData.pos,
                map: actionData.map,
                elements: [actionData.elements[e_id]]
            };

            //Set action id

            this.projectiles[actionData.map][p].a_id = a_id;

            //Switch the owner type

            switch (type) {
                case 'player':
                    this.projectiles[actionData.map][p].playerOwner = id;
                    break;
                case 'npc':
                    this.projectiles[actionData.map][p].npcOwner = id;
                    break;
            };

            //Set the empty distance

            this.projectiles[actionData.map][p].distance = {
                x: 0,
                y: 0
            };

            p_id = p;

            break;
        }
    }

    return p_id;
};

exports.createPlayerProjectile = function(id, actionData, e_id, a_id)
{
    return this.createProjectile('player', id, actionData, e_id, a_id)
};

exports.createNPCProjectile = function(id, actionData, e_id, a_id)
{
    return this.createProjectile('npc', id, actionData, e_id, a_id)
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
