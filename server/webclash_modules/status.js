//Status effects module for WebClash Server

exports.collection = {};

const players = {};
const onMap   = [];

let elapsed = 0;

exports.loadAllStatusEffects = function(cb) {
    let location = 'effects';

    fs.readdir(location, (err, files) => {
        if (err)
            output.giveError('Could not load status effects: ', err);

        let count = 0;

        files.forEach(file => {
            let statusEffect = status.loadStatusEffect(location + '/' + file);
            statusEffect.name = file.substr(0, file.lastIndexOf('.'));

            status.collection[statusEffect.name] = statusEffect;

            count++;
        });

        output.give('Loaded ' + count + ' status effect(s).');

        if (cb !== undefined)
            cb();
    });
};

exports.loadStatusEffect = function(location) {
    try {
        let object = JSON.parse(fs.readFileSync(location, 'utf-8'));

        //Convert duration from milliseconds
        //to update frames

        object.duration = object.duration / (1000 / 60);

        return object;
    }
    catch (err)
    {
        output.giveError('Could not load status effect: ', err);
    }
};

exports.checkPlayer = function(id) {
    //Checks if a player has running
    //status effects and needs to be watched

    if (Object.keys(game.players[id]).length > 0)
        players[id] = true;
};

exports.givePlayerStatusEffect = function(id, casterName, hostile, statusEffectName) {
    try {
        //Check if status effect name is valid

        if (statusEffectName == undefined ||
            statusEffectName === '')
            return;

        //Get the status effect

        let statusEffect = this.collection[statusEffectName];

        //Check if status effect is valid

        if (statusEffect == undefined)
            return;

        //Grab player for easier use

        let player = game.players[id];

        //Check if player is dead or offline

        if (player == undefined ||
            player.killed)
            return;

        //Set status effect

        player.statusEffects[statusEffectName] = deepcopy(statusEffect);
        player.statusEffects[statusEffectName].caster = casterName;
        player.statusEffects[statusEffectName].elapsed = 0;
        player.statusEffects[statusEffectName].hostile = hostile;

        //Calculate status effect matrix for the player

        player.statusEffectsMatrix = this.calculateStatusEffectsMatrix(player.statusEffects);

        //Sync the status effect

        server.syncPlayerPartially(id, 'statusEffects');

        //Add player to the watch list

        players[id] = true;
    }
    catch (err) {
        output.giveError('Could not give player status effect: ', err);
    }
};

exports.giveNPCStatusEffect = function(map, id, statusEffectName, playerOverride) {
    try {
        //Check if status effect name is valid

        if (statusEffectName == undefined ||
            statusEffectName === '')
            return;

        //Get the status effect

        let statusEffect = this.collection[statusEffectName];

        //Check if status effect is valid

        if (statusEffect == undefined)
            return;

        //Grab the NPC for easier use

        let npc = npcs.onMap[map][id];

        //Set status effect

        npc.statusEffects[statusEffectName] = deepcopy(statusEffect);
        npc.statusEffects[statusEffectName].elapsed = 0;
        npc.statusEffects[statusEffectName].playerOwner = playerOverride;

        //Calculate status effect matrix for the NPC

        npc.statusEffectsMatrix = this.calculateStatusEffectsMatrix(npc.statusEffects);

        //Sync the status effect

        server.syncNPCPartially(map, id, 'statusEffects');

        //Add NPC to the watchlist

        if (onMap[map] == undefined)
            onMap[map] = {};

        onMap[map][id] = true;
    }
    catch (err) {
        output.giveError('Could not give NPC status effect: ', err);
    }
};

exports.updateStatusEffects = function(dt) {
    try {
        //Check if tick should occur

        let tick = (elapsed >= 60);

        //Update status effects for all players

        for (let id in players) {
            //Grab data

            let player = game.players[id];

            //Check if offline

            if (player == undefined) {
                //Remove from watch list

                delete players[id];
                continue;
            }

            //Check if dead

            if (player.killed)
                continue;

            //Update all status effects

            for (let effect in player.statusEffects) {
                if (effect == undefined ||
                    player.statusEffects[effect] == undefined)
                    continue;

                //Grab status effect

                let statusEffect = player.statusEffects[effect];

                //Check if over duration

                if (statusEffect.elapsed >= statusEffect.duration) {
                    //Remove the effect

                    delete player.statusEffects[effect];

                    //Calculate new status effect matrix

                    player.statusEffectsMatrix = this.calculateStatusEffectsMatrix(player.statusEffects);

                    //Sync the status effects

                    server.syncPlayerPartially(id, 'statusEffects');

                    //Continue

                    continue;
                }

                //Increment elapsed

                statusEffect.elapsed += dt;

                //If tick: handle tick deltas

                if (tick) {
                    //Health tick

                    let healthTickDelta = statusEffect.effects['healthTickDelta'];
                    if (healthTickDelta !== 0)
                        healthTickDelta < 0 
                            ? game.damagePlayer(id, healthTickDelta) 
                            : game.healPlayer(id, healthTickDelta);

                    //Mana tick

                    let manaTickDelta = statusEffect.effects['manaTickDelta'];
                    if (manaTickDelta !== 0)
                        game.deltaManaPlayer(id, manaTickDelta);
                }
            }

            //Check if the player has no status effects left

            if (Object.keys(player.statusEffects).length === 0) {
                //Remove player from watch list

                delete players[id];
            }
        }

        //Update status effects for all NPCs

        for (let m = 0; m < onMap.length; m++)
            for (let n in onMap[m]) {
                //Grab data

                let npc = npcs.onMap[m][n];

                //Check if offline

                if (npc == undefined) {
                    //Remove from watch list

                    delete onMap[m][n];
                    continue;
                }

                //Check if dead

                if (npc.killed)
                    continue;

                //Update all status effects

                for (let effect in npc.statusEffects) {
                    if (effect == undefined ||
                        npc.statusEffects[effect] == undefined)
                        continue;

                    //Grab status effect

                    let statusEffect = npc.statusEffects[effect];

                    //Check if over duration

                    if (statusEffect.elapsed >= statusEffect.duration) {
                        //Remove the effect

                        delete npc.statusEffects[effect];

                        //Calculate new status effect matrix

                        npc.statusEffectsMatrix = this.calculateStatusEffectsMatrix(npc.statusEffects);

                        //Sync the status effects

                        server.syncNPCPartially(m, n, 'statusEffects');

                        //Continue

                        continue;
                    }
                    
                    //Increment elapsed

                    statusEffect.elapsed += dt;

                    //If tick: handle tick deltas

                    if (tick) {
                        //Health tick
                        
                        let healthTickDelta = statusEffect.effects['healthTickDelta'];
                        if (healthTickDelta !== 0)
                            healthTickDelta < 0 
                                ? npcs.damageNPC(statusEffect.playerOwner, m, n, healthTickDelta) 
                                : npcs.healNPC(m, n, healthTickDelta);

                        //Mana tick

                        //TODO: NPCs do not use mana yet...
                    }
                }

                //Check if the NPC has no status effects left

                if (Object.keys(npc.statusEffects).length === 0) {
                    //Remove NPC from watch list

                    delete onMap[m][n];
                }
            }

        //Handle elapsed

        if (tick)
            elapsed = 0;
        else
            elapsed+=dt;
    }
    catch (err) {
        output.giveError('Could not update status effects: ', err);
    }
};


exports.calculateStatusEffectsMatrix = function(statusEffects) {
    try {
        //Setup base matrix

        let matrix = {
            healthTickDelta: 0,
            manaTickDelta: 0,
            itemFindFactor: 1.0,
            experienceGainFactor: 1.0,
            damageFactor: 1.0,
            movementSpeedFactor: 1.0,
            castingTimeFactor: 1.0,
            cooldownTimeFactor: 1.0
        };

        for (let se in statusEffects) {
            let effects = statusEffects[se].effects;

            //Normal numerical values (delta ticks)

            matrix['healthTickDelta'] += effects['healthTickDelta'];
            matrix['manaTickDelta']   += effects['manaTickDelta'];

            //Procentual changes (multiplication factors)

            matrix['itemFindFactor']       += effects['itemFindFactor']       - 1;
            matrix['experienceGainFactor'] += effects['experienceGainFactor'] - 1;
            matrix['damageFactor']         += effects['damageFactor']         - 1;
            matrix['movementSpeedFactor']  += effects['movementSpeedFactor']  - 1;
            matrix['castingTimeFactor']    += effects['castingTimeFactor']    - 1;
            matrix['cooldownTimeFactor']   += effects['cooldownTimeFactor']   - 1;
        }

        return matrix;
    }
    catch (err) {
        output.giveError('Could not calculate status effect matrix: ', err);
    }
};