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
            }, 8000);

            //Try to make a connection

            window['channel'] = geckos({
                url: (properties.address.length > 0 ? properties.address : window.location.protocol + '//' + window.location.hostname),
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

        this.inGame = true;

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
            game.gameTime = data;

            lx.Loops(function() {
                game.gameTime.current++;

                if (game.gameTime.current >= game.gameTime.dayLength+game.gameTime.nightLength)
                    game.gameTime.current = 0;
            });
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

             if (data === undefined || data.name === undefined)
                 return;

             //Check if in-game

             if (!client.inGame)
                 return;

             //Get the id of the player's data

             let id;

             if (data.isPlayer)
                 id = game.player;
             else
                 id = game.getPlayerIndex(data.name);

             //If the player does not yet exist, create it

             if (id == -1 && data.isPlayer) {
                 game.instantiatePlayer(data.name);

                 id = game.player;
             }
             else if (id == -1) {
                 game.instantiateOther(data.name);

                 id = game.players.length-1;
             }

             //Check what data is present

             if (data.remove)
                 game.removePlayer(id);
             if (data.pos !== undefined) {
                 game.players[id].POS = data.pos;

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
             if (data.gold !== undefined) {
                 game.players[id]._gold = data.gold;

                 if (id === game.player)
                     ui.inventory.setGold(data.gold);
             }
             if (data.character !== undefined) {
                 game.players[id].SPRITE = new lx.Sprite(data.character.src);
                 game.players[id].SPRITE.Clip(0, 0, data.character.width, data.character.height);

                 game.players[id].SIZE = game.players[id].SPRITE.Size();

                 if (data.isPlayer)
                 {
                     player.setCollider(data.character.collider);
                     player.setMovement(game.players[id], data.character.movement);
                 }

                 game.players[id]._animation = data.character.animation;
                 game.players[id]._animation.cur = 0;

                 game.players[id]._sounds = data.character.sounds;
             }
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

             //Check if in-game

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
             if (data.health !== undefined)
                 game.setNPCHealth(data.id, data.health);
             if (data.character !== undefined) {
                 game.npcs[data.id].SPRITE = new lx.Sprite(data.character.src);
                 game.npcs[data.id].SPRITE.Clip(0, 0, data.character.width, data.character.height);

                 game.npcs[data.id].SIZE = game.npcs[data.id].SPRITE.Size();

                 game.npcs[data.id]._animation = data.character.animation;
                 game.npcs[data.id]._animation.cur = 0;

                 game.npcs[data.id]._sounds = data.character.sounds;
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
        channel.on('GAME_START_ITEM_DIALOG', function(data) {
            //Check if the recieved data is valid

            if (data === undefined)
                return;

            //Check if in-game

            if (!client.inGame)
                return;

            //Start dialog

            ui.dialog.startDialog(data.name, data.name, data.dialog);
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

        //Response events

        channel.on('CLIENT_PLAYER_ACTION_RESPONSE', function(data) {
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

                //Set cooldown

                for (let a = 0; a < player.actions.length; a++)
                    if (player.actions[a] != undefined &&
                        player.actions[a].name === name)
                        ui.actionbar.setCooldown(a);
            }
        });
        channel.on('CLIENT_USE_ITEM_RESPONSE', function(data) {
            if (data.valid) {
                //Play item sound if possible

                if (data.sounds != undefined) {
                    let sound = audio.getRandomSound(data.sounds);

                    if (sound != undefined)
                       audio.playSound(sound);
                 }

                //Remove box

                ui.inventory.removeBox();

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
                //Enough currency, bought item

                //Reload shop items

                ui.shop.reload();
            } else {
                //Not enough currency

                //...
            }

            ui.shop.emitted = false;
        });
        channel.on('CLIENT_SELL_ITEM_RESPONSE', function(sold) {
            if (sold) {
                //Play gold sound??

                //...

                //Remove box

                ui.inventory.removeBox();

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

            ui.dialog.startDialog(data.npc, game.npcs[data.npc].name, data.dialog);
        });
        channel.on('CLIENT_DIALOG_EVENT_RESPONSE', function(data) {
            //Handle dialog event

            ui.dialog.handleDialogEvent(data);
        });
        channel.on('CLIENT_ACCEPT_QUEST_RESPONSE', function(data) {
            ui.chat.addMessage('Accepted "' + data + '".');
        });
        channel.on('CLIENT_ABANDON_QUEST_RESPONSE', function(data) {
            delete player.quests[data];

            ui.chat.addMessage('Abandoned "' + data + '".');

            ui.journal.reload();
            ui.quests.reload();
        });
        channel.on('CLIENT_REQUEST_EXP_RESPONSE', function(data) {
            player.expTarget = data;

            if (player.exp != undefined)
                ui.status.setExperience(player.exp, player.expTarget);
        });
    }
}
