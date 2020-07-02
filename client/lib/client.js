const client = {
    inGame: false,
    serverName: '',
    connect: function(cb) {
        try {
            //Set timeout

            let timeOut = setInterval(function() {
                //Clear timeout interval

                clearInterval(timeOut);

                //Set status text

                document.getElementById('status_text').innerHTML = 'Server is not available';
            }, 12000);

            //Generate address and full address

            let protocol = window.location.protocol;
            if (protocol === 'file:')
                protocol = 'http:';

            let hostname = window.location.hostname;
            if (hostname === '')
                hostname = 'localhost';

            this.address = (properties.address.length > 0 ? properties.address : protocol + '//' + hostname);
            this.fullAddress = this.address + ':' + properties.port + '/';

            //Try to make a connection

            window['channel'] = geckos({
                url: this.address,
                port: properties.port 
            });
            
            //Set on connect callback

            channel.onConnect(function(err) {
                //Clear timeout interval

                clearInterval(timeOut);

                //Check if connection is valid

                if (err) {
                    document.getElementById('status_text').innerHTML = err;

                    return;
                }

                //Setup possible server requests

                client.setup();

                //Callback

                cb();
            });
        }
        catch (err)
        {
            console.log('Could not connect to server:' + err);
        }
    },
    joinGame: function() {
        if (this.inGame)
        {
            //Clear any cached game elements

            game.players = [];
            game.player = -1;

            game.tilesets = [];
        }

        //Set in-game to true

        this.inGame = true;

        //Set tiled loading to true to
        //prevent unwanted incoming syncs

        tiled.loading = true;

        //Show progress view

        manager.progress.start('Joining game...');

        //Send join game package

        channel.emit('CLIENT_JOIN_GAME');
    },
    setup: function() {
        //Setup on exit logout event

        window.onbeforeunload = function() {
            channel.emit('CLIENT_LOGOUT');

            return null;
        };

        //Disconnection listener

        channel.onDisconnect(function() {
            window.location.reload();
        });

        //General events

        channel.on('UPDATE_CLIENT_NAME', function(t) { 
            document.title = t; 
        });
        channel.on('UPDATE_SERVER_NAME', function(t) { 
            client.serverName = t; 
        });

        //Issue events

        channel.on('REQUEST_LANDING', view.loadLanding);
        channel.on('REQUEST_CREATION', view.loadCreation);
        channel.on('REQUEST_GAME', view.loadGame);

        //Game update events

        channel.on('GAME_SERVER_TIME', function(data) {
            //Setup game time

            game.gameTime = {
                dayLength: data.dayLength,
                nightLength: data.nightLength,
                current: data.current,
                loopExists: (game.gameTime == undefined ? false : game.gameTime.loopExists)
            };
            game.gameTime.prevTick = Date.now();

            //If game time loop does not exist yet,
            //create it (once).

            if (!game.gameTime.loopExists) {
                game.gameTime.loopExists = true;
                lx.Loops(function() {
                    //Get game time tick delta

                    let tickTime = Date.now();
                    game.gameTime.current += (tickTime - game.gameTime.prevTick) / (1000/60);
                    game.gameTime.prevTick = tickTime;

                    //Check if the game time exceeds the max time

                    if (game.gameTime.current >= game.gameTime.dayLength+game.gameTime.nightLength)
                        game.gameTime.current = 0;
                });
            }
        }); 
        channel.on('GAME_USER_SETTINGS', function (data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;

            //Handle settings

            ui.settings.loadFromSettings(data);
        });
        channel.on('GAME_PLAYER_UPDATE', function (data) {
            //Check if the recieved data is valid

            if (data == undefined || data.name == undefined)
                return;

            //Check if in-game or loading map

            if (!client.inGame)
                return;

            //Get the id of the player's data

            let id;

            if (data.isPlayer)
                id = game.player;
            else
                id = data.name;

            //If the player does not yet exist, create it

            if (game.players[id] == undefined) {
                if (data.isPlayer) {
                    game.instantiatePlayer(data.name);

                    id = game.player;
                }
                else {
                    game.instantiateOther(data.name);

                    id = data.name;
                }
            }

            //Check what data is present
            if (data.remove) 
                game.removePlayer(id);
            if (data.pos !== undefined) {
                game.players[id].POS = data.pos;

            //If player make sure to stop movement
            if (data.isPlayer)
                game.players[id].Movement(0, 0);
            }
            if (data.moving !== undefined)
                game.players[id]._moving = data.moving;
            if (data.direction !== undefined)
                game.players[id]._direction = data.direction;
            if (data.level !== undefined)
                game.setPlayerLevel(id, data.level);
            if (data.exp !== undefined)
                player.setExperience(data.exp);
            if (data.points !== undefined)
                player.setPoints(data.points);
            if (data.attributes !== undefined)
                player.setAttributes(data.attributes);
            if (data.health !== undefined)
                game.setPlayerHealth(id, data.health);
            if (data.mana !== undefined)
                game.setPlayerMana(id, data.mana);
            if (data.equipment !== undefined)
                game.setPlayerEquipment(id, data.equipment);
            if (data.actions !== undefined)
                player.setActions(data.actions);
            if (data.quests !== undefined)
                player.setQuests(data.quests);
            if (data.currency !== undefined) {
                game.players[id]._currency = data.currency;

                if (id === game.player)
                    ui.inventory.setCurrency(data.currency);
            }
            if (data.statusEffects !== undefined) {
                if (id === game.player)
                    player.setStatusEffects(data.statusEffects);
                else
                    game.setPlayerStatusEffects(id, data.statusEffects);
            }
            if (data.character !== undefined) {
                manager.getSprite(data.character.src, function (sprite) {
                    game.players[id].Sprite(sprite);
                    game.players[id].Sprite().Clip(0, 0, data.character.width, data.character.height);

                    game.players[id].SIZE = game.players[id].Sprite().Size();

                    if (data.isPlayer)
                    {
                        player.setCollider(data.character.collider);
                        player.setMovement(game.players[id], data.character.movement);
                    }

                    game.players[id]._animation = data.character.animation;
                    game.players[id]._animation.cur = 0;

                    game.players[id]._sounds = data.character.sounds;

                    game.players[id]._damageParticles = {
                        exists: data.character.damageParticles,
                        src: data.character.particleSrc
                    };
                });
            }
        });
        channel.on('GAME_PLAYER_KILLED', function (data) {
            //Check if data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;

            //Kill player with data

            player.kill(data);
        });
        channel.on('GAME_MAP_UPDATE', function (data) {
             //Check if data is valid

             if (data === undefined)
                 return;

             //Check if in-game

             if (!client.inGame)
                 return;

            //Load map

            game.loadMap(data);
        });
        channel.on('GAME_NPC_UPDATE', function (data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game or loading map

            if (!client.inGame)
                return;

            //Check if NPC exists, if not instantiate

            if (game.npcs[data.id] === undefined && data.name !== undefined)
                game.instantiateNPC(data.id, data.name);

            //Handle data

            if (data.remove !== undefined)
                game.removeNPC(data.id);
            if (data.pos !== undefined)
                game.npcs[data.id].POS = data.pos;
            if (data.type !== undefined)
                game.setNPCType(data.id, data.type, data.hasDialog);
            if (data.moving !== undefined)
                game.npcs[data.id]._moving = data.moving;
            if (data.direction !== undefined)
                game.npcs[data.id]._direction = data.direction;
            if (data.stats !== undefined)
                game.npcs[data.id]._stats = data.stats;
            if (data.equipment !== undefined)
                game.setNPCEquipment(data.id, data.equipment);
            if (data.health !== undefined)
                game.setNPCHealth(data.id, data.health);
            if (data.aggressive !== undefined)
                game.npcs[data.id]._aggressive = data.aggressive;
            if (data.inCombat != undefined)
                game.npcs[data.id]._inCombat = data.inCombat;
            if (data.statusEffects !== undefined)
                game.setNPCStatusEffects(data.id, data.statusEffects);
            if (data.character !== undefined) {
                manager.getSprite(data.character.src, function(sprite) {
                    game.npcs[data.id].Sprite(sprite);
                    game.npcs[data.id].Sprite().Clip(0, 0, data.character.width, data.character.height);
    
                    game.npcs[data.id].SIZE = game.npcs[data.id].Sprite().Size();
    
                    game.npcs[data.id]._animation = data.character.animation;
                    game.npcs[data.id]._animation.cur = 0;
    
                    game.npcs[data.id]._sounds = data.character.sounds;

                    game.npcs[data.id]._damageParticles = {
                        exists: data.character.damageParticles,
                        src: data.character.particleSrc
                    };
                });
            }
        });
        channel.on('GAME_ACTION_UPDATE', function (data) {
            //Check if the recieved data is valid

             if (data === undefined)
                 return;

             //Check if in-game

             if (!client.inGame)
                 return;

             //Check if removal package

             if (data.remove != undefined &&
                 data.remove) {
                 game.removeAction(data.id);

                 return;
             }

             //Handle data

             game.createAction(data);
        });
        channel.on('GAME_ACTION_SLOT', function(data) {
            //Check if the recieved data is valid

             if (data === undefined)
                 return;

             //Check if in-game

             if (!client.inGame)
                 return;

             //Handle data

             if (data.remove)
                player.actions[data.slot] = undefined;
             else
                player.actions[data.slot] = data.action;

             //Refresh UI (slot)

             ui.actionbar.reloadAction(data.slot);
        });
        channel.on('GAME_INVENTORY_UPDATE', function(data) {
             //Check if the recieved data is valid

             if (data === undefined)
                 return;

             //Check if in-game

             if (!client.inGame)
                 return;

             //Handle data

             if (data.remove)
                player.inventory[data.slot] = undefined;
             else
                player.inventory[data.slot] = data.item;

             //Refresh UI (slot)

             ui.inventory.reloadItem(data.slot);
        });
        channel.on('GAME_EQUIPMENT_UPDATE', function(data) {
             //Check if the recieved data is valid

             if (data === undefined)
                 return;

             //Check if in-game

             if (!client.inGame)
                 return;

             //Handle data

             player.setEquipment(data);

             //Refresh UI (slot)

             ui.equipment.reloadEquipment(data.equippable);
        });
        channel.on('GAME_WORLD_ITEM_UPDATE', function(data) {
             //Check if the recieved data is valid

             if (data === undefined)
                 return;

             //Check if in-game

             if (!client.inGame)
                 return;

             //Handle data

             game.createWorldItem(data);
        });
        channel.on('GAME_CHAT_UPDATE', function (data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;

            //Add chat message

            ui.chat.addMessage(data);
        });
        channel.on('GAME_OPEN_SHOP', function (data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;

            //Open shop UI

            ui.shop.showShop(data.target, data.id, data.shop);
        });
        channel.on('GAME_OPEN_BANK', function(data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;

            //Open bank UI

            ui.bank.showBank(data.name, data.bank);
        });
        channel.on('GAME_BANK_UPDATE', function(data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;

            //Reload bank UI

            ui.bank.reload(data);

            //Set emitted to false

            ui.bank.emitted = false;
        });
        channel.on('GAME_PARTY_INVITE', function(data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;

            //Check if player is in party

            if (player.inParty) {
                //Send back to server; already in party

                channel.emit('CLIENT_LEAVE_PARTY', 'inparty');

                return;
            }

            //Create invite dialog

            ui.dialogs.yesNo('Do you want to join ' + data + '\'s ' + game.aliases.party.toLowerCase() + '?', function(result) {
                if (result) 
                    channel.emit('CLIENT_JOIN_PARTY');
                else 
                    channel.emit('CLIENT_LEAVE_PARTY', 'declined');
            });
        });
        channel.on('GAME_PARTY_UPDATE', function(data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;
            
            //Set in party

            player.inParty = true;

            //Handle data

            ui.party.load(data);
        });
        channel.on('GAME_PARTY_DISBAND', function() {
            //Check if in-game

            if (!client.inGame)
                return;

            //Set in party to false

            player.inParty = false;

            //Reset party UI

            ui.party.hide();
        });
        channel.on('GAME_START_ITEM_DIALOG', function(data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;

            //Start dialog

            ui.dialog.startDialog(data.name, 'item', data.name, data.quest, data.dialog);
        });
        channel.on('GAME_MAP_FINISHED', function() {
            //Hide progress

            manager.progress.hide();

            //Set loading to false

            tiled.loading = false;
        });
        channel.on('GAME_PLAYER_RESPAWN', function() {
            if (game.player == undefined ||
                game.players[game.player] == undefined)
                return;
                
            game.players[game.player].Show(3);
        });
        channel.on('GAME_PLAYER_CAST_ACTION', function(data) {
            if (player.actions[data.slot] != undefined) {
                //Calculate elapsed time

                let elapsed = Date.now() - data.beginTime;

                //Begin casting

                player.castAction(data.slot, elapsed);
            }
        });
        channel.on('GAME_OTHER_PLAYER_CAST_ACTION', function(data) {
            if (game.players[data.player] != undefined) {
                //Calculate elapsed time

                let elapsed = Date.now() - data.beginTime;

                //Begin casting 

                game.players[data.player]._castAction(
                    data.targetTime,
                    data.icon,
                    elapsed
                );
            }
        });
        channel.on('GAME_OTHER_PLAYER_CANCELLED_CAST', function(data) {
            //Cancel casting

            if (game.players[data] != undefined) {
                game.players[data]._castingBar.Hide();
                game.players[data]._castingIcon.Hide();
            }

        });
        channel.on('GAME_NPC_CAST_ACTION', function(data) {
            if (game.npcs[data.npc] != undefined) {
                //Calculate elapsed time

                let elapsed = Date.now() - data.beginTime;

                //Begin casting 

                game.npcs[data.npc]._castAction(
                    data.targetTime, 
                    data.icon,
                    elapsed
                );
            }
        });
        channel.on('GAME_PLAYER_ACTION_USAGE', function(data) {
            if (player.actions[data] != undefined) {
                //Action name

                let name = player.actions[data].name;

                //Decrease usage

                if (player.actions[data].uses !== undefined) {
                    player.actions[data].uses--;

                    if (player.actions[data].uses <= 0)
                        player.removeAction(data);
                    else
                        ui.actionbar.reloadAction(data);
                }

                //Set cooldown, we use a small timeout for this
                //to make sure the cooldown UI creation does
                //not get caught in the crossfire of the
                //reload action used above

                setTimeout(() => {
                    for (let a = 0; a < player.actions.length; a++)
                        if (player.actions[a] != undefined &&
                            player.actions[a].name === name) {
                                let cooldownTime = player.actions[a].cooldown;
                                cooldownTime *= player.statusEffectsMatrix['cooldownTimeFactor'];

                                ui.actionbar.setCooldown(a, cooldownTime);
                            }
                }, 50);
            }
        });

        //Response events

        channel.on('CLIENT_USE_ITEM_RESPONSE', function(data) {
            if (data.valid) {
                //Play item sound if possible

                if (data.sounds != undefined) {
                    let sound = audio.getRandomSound(data.sounds);

                    if (sound != undefined)
                       audio.playSound(sound);
                 }

                //Remove box

                ui.inventory.removeDisplayBox();

                //Remove context menu

                ui.inventory.removeContext();
            }
        });
        channel.on('CLIENT_UNEQUIP_ITEM_RESPONSE', function(sounds) {
            //Play item sound if possible

            if (sounds != undefined) {
                let sound = audio.getRandomSound(sounds);

                if (sound != undefined)
                audio.playSound(sound);
            }
        });
        channel.on('CLIENT_BUY_ITEM_RESPONSE', function(bought) {
            if (bought) {
                //Enough currency, bought item;
                //Thus reload shop items

                ui.shop.reload();
            } else {
                //Not enough currency

                ui.chat.addMessage('You do not have enough ' + game.aliases.currency.toLowerCase() + '.');
            }

            ui.shop.emitted = false;
        });
        channel.on('CLIENT_SELL_ITEM_RESPONSE', function(sold) {
            if (sold) {
                //Play currency sound??

                //...

                //Remove box

                ui.inventory.removeDisplayBox();

                //Remove context menu

                ui.inventory.removeContext();

                //Reload shop items

                ui.shop.reload();
            } else {
                //Item is unsellable/could not be sold

                //...
            }

            ui.shop.emitted = false;
        });
        channel.on('CLIENT_REQUEST_DIALOG_RESPONSE', function(data) {
            //Check if data is valid
                
            if (!data.dialog)
                return;

            //Start dialog

            ui.dialog.startDialog(data.npc, 'npc', game.npcs[data.npc].name, data.quest, data.dialog);
        });
        channel.on('CLIENT_REQUEST_MAP_DIALOG_RESPONSE', function(data) {
            //Check if data is valid
                
            if (!data.dialog)
                return;

            //Start dialog

            ui.dialog.startDialog(data.name, 'map', data.title, data.quest, data.dialog);
        });
        channel.on('CLIENT_DIALOG_EVENT_RESPONSE', function(data) {
            //Handle dialog event

            ui.dialog.handleDialogEvent(data);
        });
        channel.on('CLIENT_ACCEPT_QUEST_RESPONSE', function(data) {
            //Add chat message

            ui.chat.addMessage('Accepted "' + data + '".');
        });
        channel.on('CLIENT_ABANDON_QUEST_RESPONSE', function(data) {
            //Delete current quest

            delete player.quests[data];

            //Add chat message

            ui.chat.addMessage('Abandoned "' + data + '".');

            //Reload UI

            ui.journal.reload();
            ui.quests.reload();
        });
        channel.on('CLIENT_REQUEST_EXP_RESPONSE', function(data) {
            //Set experience data and UI

            player.expTarget = data;
            if (player.exp != undefined)
                ui.status.setExperience(player.exp, player.expTarget);
        });
        channel.on('CLIENT_REQUEST_ALIASES_RESPONSE', function(data) {
            game.aliases = data;
        });
    }
}
