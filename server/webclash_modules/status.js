//Status effects module for WebClash Server

exports.collection = {};

const players = [];
const npcs    = [];

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

exports.givePlayerStatusEffect = function(id, casterName, statusEffectName) {
    try {
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

        //Calculate status effect matrix for the player

        player.statusEffectsMatrix = this.calculateStatusEffectsMatrix(player.statusEffects);

        //Sync the status effect to the affected player

        server.syncPlayerPartially(id, 'statusEffects', player.channel, false);

        //Add player to the watch list

        players.push(id);
    }
    catch (err) {
        output.giveError('Could not give player status effect: ', err);
    }
};

exports.giveNPCStatusEffect = function(map, id, statusEffectName) {
    try {
        //Get the status effect

        let statusEffect = this.collection[statusEffectName];

        //Grab the NPC for easier use

        let npc = npc.onMap[map][id];

        //Set status effect

        npc.statusEffects[statusEffectName] = deepcopy(statusEffect);
        npc.statusEffects[statusEffectName].elapsed = 0;

        //Calculate status effect matrix for the NPC

        npc.statusEffectsMatrix = this.calculateStatusEffectsMatrix(npc.statusEffects);

        //Add NPC to the watchlist

        if (npcs[map] == undefined)
            npcs[map] = [];

        npcs[map].push(id);
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

        for (let p = 0; p < players.length; p++) {
            let id = players[p];
            let player = game.players[id];

            //Check if dead or offline

            if (player == undefined ||
                player.killed) {
                    //Remove from watch list

                    players.splice(p, 1);
                    p--;
                    continue;
                }

            //If tick: handle tick deltas

            if (tick) {
                //Health tick

                let healthTickDelta = player.statusEffectsMatrix['healthTickDelta'];
                if (healthTickDelta !== 0)
                    healthTickDelta < 0 ? game.damagePlayer(id, healthTickDelta) : game.healPlayer(id, healthTickDelta);

                //Mana tick

                let manaTickDelta = player.statusEffectsMatrix['manaTickDelta'];
                if (manaTickDelta !== 0)
                    game.deltaManaPlayer(id, manaTickDelta);
            }

            //Update all status effects

            for (let effect in player.statusEffects) {
                if (effect == undefined ||
                    player.statusEffects[effect] == undefined)
                    continue;

                //Increment elapsed

                player.statusEffects[effect].elapsed+=dt;

                //Check if over duration

                if (player.statusEffects[effect].elapsed >= player.statusEffects[effect].duration) {
                    //Remove the effect

                    delete player.statusEffects[effect];

                    //Calculate new status effect matrix

                    player.statusEffectsMatrix = this.calculateStatusEffectsMatrix(player.statusEffects);

                    //Sync the status effects

                    server.syncPlayerPartially(id, 'statusEffects', player.channel, false);
                }
            }
        }

        //Update status effects for all NPCs

        for (let m = 0; m < npcs.length; m++) {
            for (let n = 0; n < npcs[m].length; n++) {
                let npc = npcs[m][n];

                //Check if dead or offline

                if (npc == undefined ||
                    npc.killed) {
                        //Remove from watch list

                        npcs[m].splice(n, 1);
                        n--;
                        continue;
                    }

                //If tick: handle tick deltas

                if (tick) {
                    //Health tick
                    
                    let healthTickDelta = npc.statusEffectsMatrix['healthTickDelta'];
                    if (healthTickDelta !== 0)
                        healthTickDelta < 0 ? npcs.damageNPC(undefined, m, n, healthTickDelta) : npcs.healNPC(map, id, healthTickDelta);

                    //Mana tick

                    //NPCs do not use mana (yet)...
                }

                //Update all status effects

                for (let effect in npc.statusEffects) {
                    if (effect == undefined ||
                        npc.statusEffects[effect] == undefined)
                        continue;

                    //Increment elapsed

                    npc.statusEffects[effect].elapsed+=dt;

                    //Check if over duration

                    if (npc.statusEffects[effect].elapsed >= npc.statusEffects[effect].duration) {
                        //Remove the effect

                        delete npc.statusEffects[effect];

                        //Calculate new status effect matrix

                        npc.statusEffectsMatrix = this.calculateStatusEffectsMatrix(npc.statusEffects);
                    }
                }
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