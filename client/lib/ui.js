const ui = {
    initialize: function() {
        this.actionbar.create();
        this.inventory.create();
        this.equipment.create();
        this.status.create();
        this.loot.create();
        this.dialog.create();
        this.chat.create();
        
        lx.Loops(this.floaties.update);
    },
    chat: 
    {
        cache: [],
        create: function() {
            if (this.dom !== undefined) {
                if (this.dom.box.parentNode !== undefined &&
                    this.dom.box.parentNode !== null) {
                
                    this.dom.box.parentNode.removeChild(this.dom.box);

                    this.dom = undefined;
                }
            }
            
            view.dom.innerHTML += 
                '<div id="chat_box" class="box" style="position: absolute; top: 100%; left: 30px; transform: translate(0, -100%); margin-top: -30px; width: 340px; height: 182px;">' +
                    '<div id="chat_box_content" class="content" style="overflow-y: auto; height: 155px;"></div>' +
                    '<input id="chat_box_message" type="text" style="width: 263px;"></input>' +
                    '<button onclick="ui.chat.sendMessage()" style="height: 21px; width: 70px; padding-top: 2px; margin: 0px;">Send</button>' +
                '</div>';
            
            this.dom = {
                box: document.getElementById('chat_box'),
                content: document.getElementById('chat_box_content'),
                message: document.getElementById('chat_box_message')
            };
            
            this.dom.message.addEventListener('keydown', function(e) {
                if (e.keyCode == 13)
                    ui.chat.sendMessage();
            });
            
            lx.OnKey(13, function() {
                if (ui.chat.isTyping())
                    return;
                
                ui.chat.dom.message.focus();
            });
        },
        timeformat: function() {
            return '(' + new Date().toString().substr(16, 5) + ') ';
        },
        clear: function() {
            if (this.dom === undefined)
                return;
            
            this.dom.content.innerHTML = '';
        },
        addMessage: function(content) {   
            if (this.dom === undefined)
                return;
            
            this.cache.push('<font style="display: inline;" class="info">' + this.timeformat() + content + '</font><br>');
            
            if (this.cache.length > 16)
                this.cache.splice(0, 1);
            
            this.dom.content.innerHTML = this.cache.join('');
            
            this.dom.content.scrollTo(0, this.dom.content.scrollHeight);
        },
        sendMessage: function() {
            if (this.dom === undefined ||
                this.dom.message.value.length == 0)
                return;
            
            socket.emit('CLIENT_NEW_CHAT', this.dom.message.value);
            
            this.dom.message.value = '';
        },
        isTyping: function() {  
            if (this.dom === undefined)
                return false;
            
            if (document.activeElement === this.dom.message)
                return true;
            
            return false;
        }
    },
    dialog: 
    {
        showing: false,
        create: function() 
        {
            view.dom.innerHTML += 
                '<div id="dialog_box" class="box" style="visibility: hidden; position: absolute; top: 50%; left: 70%; transform: translate(-50%, -50%); width: auto; min-width: 260px; max-width: 340px; height: auto; max-height: 380px; text-align: center; padding: 0px;">' +
                    '<p id="dialog_box_content" style="position: relative; left: 5%; top: 2px; white-space: pre-wrap; overflow-y: auto; overflow-x: hidden; width: 90%; font-size: 14px; margin-bottom: 15px;"></p>' +
                    '<hr style="position: relative; top: -5px; padding: 0px; border: 0; width: 90%; border-bottom: 1px solid whitesmoke;"/>' +
                    '<div id="dialog_box_options" style="position: relative; left: 5%; top: -8px; width: 90%; white-space: pre-wrap;"></div>' +
                '</div>';
        },
        startDialog: function(npc, name, dialog) 
        {
            let start = -1;
            
            for (let i = 0; i < dialog.length; i++)
                    if (dialog[i].entry) {
                        start = i;

                        break;        
                    }
            
            if (start == -1)
                return;
            
            this.cur = dialog;
            this.npc = npc;
            this.name = name;
            
            this.setDialog(start);
        },
        setDialog: function(id) 
        {
            if (this.cur[id].isEvent)
            {
                socket.emit('CLIENT_DIALOG_EVENT', {
                    npc: this.npc,
                    id: id
                }, function(data) {
                    let next = (data ? 0 : 1);
                    
                    if (ui.dialog.cur[id].options[next].next == -1)
                        ui.dialog.hideDialog();
                    else
                        ui.dialog.setDialog(ui.dialog.cur[id].options[next].next);
                });
                
                return;
            }
            
            let contentEl = document.getElementById('dialog_box_content'),
                optionsEl = document.getElementById('dialog_box_options');
            
            contentEl.innerHTML = '<b>' + this.name + '</b><br>';
            
            if (this.cur[id].portrait != undefined)
                contentEl.innerHTML += '<img src="' + this.cur[id].portrait + '" class="portrait"/><br>';
            
            contentEl.innerHTML += this.cur[id].text;
            optionsEl.innerHTML = '';
            
            this.cur[id].options.forEach(function(option) {
                let cb = 'ui.dialog.hideDialog()';
                
                if (option.next != -1)
                    cb = 'ui.dialog.setDialog(' + option.next + ')';
                
                optionsEl.innerHTML += '<button class="link_button" style="margin-left: 0px;" onclick="' + cb + '">[ ' + option.text + ' ]</button>';
            });
            
            document.getElementById('dialog_box').style.visibility = 'visible';
            
            this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                if (data.state == 0)
                    return;
                
                ui.dialog.hideDialog();
                
                lx.StopMouse(0);
            });
        },
        hideDialog: function() {
            document.getElementById('dialog_box').style.visibility = 'hidden';
            
            lx.GAME.CLEAR_EVENT('mousebutton', this.mouse);
        }
    },
    actionbar: 
    {
        cooldowns: [],
        create: function() {
            if (this.slots !== undefined)
                return;
            
            this.slots = [];
            
            let r = '<div id="actionbar_box" class="box" style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, -100%); margin-top: -30px; width: 338px; height: 48px;">';
            
            for (let i = 0; i < 7; i++)
            {
                this.slots[i] = 'actionbar_slot' + i;
                
                r += '<div class="slot" id="' + this.slots[i] + '"></div>';
            }
                
            r += '</div>';
            
            view.dom.innerHTML += r;
        },
        reload: function() {
            if (this.slots === undefined)
                return;
            
            for (let i = 0; i < this.slots.length; i++) {
                if (document.getElementById(this.slots[i]) == undefined)
                    continue;
                
                document.getElementById(this.slots[i]).innerHTML = '';
            }
            
            for (let a = 0; a < 7; a++) {
                let indicator = '<font class="info" style="position: absolute; top: -1px; left: 2px; font-size: 9px; z-index: 1;">';
                
                if (a > 1)
                    indicator += (a-1).toString();
                else 
                    indicator += (a === 0 ? 'LMB' : 'RMB');
                
                indicator += '</font>';
                
                if (player.actions[a] == undefined) {
                    document.getElementById(this.slots[a]).innerHTML = indicator;
                    
                    continue;
                }
                
                let uses = '', usesContent = '∞';
                
                if (player.actions[a].uses != undefined)
                    usesContent = player.actions[a].uses + '/' + player.actions[a].max;
                
                uses = '<font class="info" style="position: absolute; top: 100%; margin-top: -15px; margin-left: -6px; font-size: 10px; width: 100%; text-align: right; color: #333333; z-index: 2">' + usesContent + '</font>';
                
                document.getElementById(this.slots[a]).innerHTML = 
                    indicator + '<img src="' + player.actions[a].src + '" style="position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;" onmouseover="ui.actionbar.displayBox(' + a + ')" onmouseleave="ui.actionbar.removeBox()"/>' + uses;
            }
        },
        setCooldown: function(slot) {
            if (this.slots === undefined)
                return;
            
            //Get slot element
            
            let el = document.getElementById(this.slots[slot]);
            
            //Remove cooldown element, just to be sure
            
            ui.actionbar.removeCooldown(slot);
            
            //Create cooldown element
            
            let cd = document.createElement('div');
            cd.id = this.slots[slot] + '_cooldown';
            cd.classList.add('cooldown');
            
            //Add time label to cooldown element
            
            let cdTime = document.createElement('p');
            
            cdTime.classList.add('info');
            cdTime.style.fontSize = '10px';
            cdTime.style.position = 'relative';
            cdTime.style.top = '9px';
            cdTime.style.left = '4px';

            cd.appendChild(cdTime);
            
            //Append cooldown elements
            
            el.appendChild(cd);
            
            //Add to cooldowns
            
            this.cooldowns[slot] = player.actions[slot].cooldown;
            
            //Create loop
            
            let cdLoopID = lx.GAME.ADD_LOOPS(function() {
                 if (player.actions[slot] == undefined) {
                     ui.actionbar.cooldowns[slot] = undefined;
                     ui.actionbar.removeCooldown(slot);
                     
                     lx.GAME.LOOPS[cdLoopID] = undefined;
                     
                     return;
                 }
                
                 cd.style.width = (ui.actionbar.cooldowns[slot]/player.actions[slot].cooldown)*100 + '%';
                
                 let time = ui.actionbar.cooldowns[slot]/60;
                 if (time > 1)
                     time = Math.round(time);
                 else
                     time = time.toFixed(1);
                
                 cdTime.innerHTML = time + 's';
                
                 if (ui.actionbar.cooldowns[slot] <= 0) {
                     ui.actionbar.cooldowns[slot] = undefined;
                     ui.actionbar.removeCooldown(slot);
                     
                     lx.GAME.LOOPS[cdLoopID] = undefined;
                 } else
                     ui.actionbar.cooldowns[slot]--;
            });
        },
        removeCooldown: function(slot) {
            if (this.slots === undefined)
                return;
            
            let cd = document.getElementById(this.slots[slot] + '_cooldown');
            
            if (cd != undefined)
                cd.remove();
        },
        displayBox: function(slot) {
            if (player.actions[slot] === undefined)
                return;
            
            //Element
            
            let el = document.getElementById('displayBox');
            
            if (el != undefined)
                return;

            //Create displaybox
            
            let displayBox = document.createElement('div');

            displayBox.id = 'displayBox';
            displayBox.classList.add('box');
            displayBox.style = 'position: absolute; top: 0px; left: 0px; width: 120px; padding: 10px; padding-bottom: 12px; height: auto; text-align: center;';
            displayBox.innerHTML =
                    '<font class="header" style="font-size: 15px;">' + player.actions[slot].name + '</font><br>' + 
                    '<font class="info" style="position: relative; top: 6px;">' + player.actions[slot].description + '</font><br>' +
                    '<font class="info" style="position: relative; top: 8px; font-size: 10px;">CD: ' + (player.actions[slot].cooldown/60).toFixed(1) + 's</font>';

            //Append
            
            view.dom.appendChild(displayBox);
            
            //Create mouse following
            
            displayBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-displayBox.offsetWidth/2 + 'px';
            displayBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-displayBox.offsetHeight-12 + 'px';

            this.displayBoxLoopID = lx.GAME.ADD_LOOPS(function() {
                displayBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-displayBox.offsetWidth/2 + 'px';
                displayBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-displayBox.offsetHeight-12 + 'px';
            });
        },
        removeBox: function() {
            if (document.getElementById('displayBox') == null ||
               this.displayBoxLoopID === undefined)
                return;
            
            lx.ClearLoop(this.displayBoxLoopID);
            
            document.getElementById('displayBox').remove();
        }
    },
    equipment: 
    {
        create: function() {
            if (this.slots !== undefined)
                return;
                
            view.dom.innerHTML += 
                '<div id="equipmentbar_box" class="box" style="position: absolute; top: 30px; left: 100%; margin-left: -30px; transform: translate(-100%, 0); width: 336px; height: 46px; text-align: center;">' +
                '</div>';

            this.slots = [
                'equipmentbar_slot0',
                'equipmentbar_slot1',
                'equipmentbar_slot2',
                'equipmentbar_slot3',
                'equipmentbar_slot4',
                'equipmentbar_slot5',
                'equipmentbar_slot6'
            ];
            
            for (let i = 0; i < this.slots.length; i++) {
                let equippable = this.getEquippableAtIndex(i);
                
                document.getElementById('equipmentbar_box').innerHTML += '<div class="slot" id="' + this.slots[i] + '" onmouseover="ui.inventory.displayBox(\'' + equippable + '\')" onclick="player.unequip(\'' + equippable + '\')" onmouseleave="ui.inventory.removeBox()"></div>';
            }
            
            this.reload();
        },
        reload: function() {
            if (this.slots === undefined)
                return;
            
            for (let i = 0; i < this.slots.length; i++) 
                document.getElementById(this.slots[i]).innerHTML = '';
            
            this.reloadEquipment('main');
            this.reloadEquipment('offhand');
            this.reloadEquipment('head');
            this.reloadEquipment('torso');
            this.reloadEquipment('hands');
            this.reloadEquipment('legs');
            this.reloadEquipment('feet');
        },
        reloadEquipment: function(equippable) {
            let slot = this.getEquippableIndex(equippable);
            
            if (slot == -1)
                return;
            
            if (player.equipment[equippable] !== undefined) {
                document.getElementById(this.slots[slot]).innerHTML = 
                    '<img src="' + player.equipment[equippable].source + '" style="pointer-events: none; position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;"/>';
                
                document.getElementById(this.slots[slot]).style.border = '1px solid ' + ui.inventory.getItemColor(player.equipment[equippable].rarity);
            }
            else {
                document.getElementById(this.slots[slot]).innerHTML = '<p style="position: relative; left: -1px; top: 2px; color: black; font-size: 9px; opacity: .65;">' + equippable + '</p>';
                
                document.getElementById(this.slots[slot]).style.border = '1px solid gray';
            }
        },
        getEquippableIndex: function(equippable) {
            switch (equippable)
            {
                case 'head':
                    return 0;
                case 'torso':
                    return 1;
                case 'hands':
                    return 2;
                case 'legs':
                    return 3;
                case 'feet':
                    return 4;
                case 'main':
                    return 5;
                case 'offhand':
                    return 6;
            }
            
            return -1;
        },
        getEquippableAtIndex: function(index) 
        {
            switch (index) {
                case 0:
                    return 'head';
                case 1:
                    return 'torso';
                case 2:
                    return 'hands';
                case 3:
                    return 'legs';
                case 4:
                    return 'feet';
                case 5:
                    return 'main';
                case 6:
                    return 'offhand';
            }
        }
    },
    inventory: 
    {
        size: {
            width: 4,
            height: 5
        },
        create: function() {
            if (this.slots !== undefined)
                return;
            
            this.slots = [];
                
            view.dom.innerHTML += 
                '<div id="inventory_box" class="box" style="position: absolute; top: 100%; left: 100%; margin-left: -30px; margin-top: -30px; transform: translate(-100%, -100%); width: 195px; height: 260px; text-align: center;">' +
                '</div>';
            
            for (let y = 0; y < this.size.height; y++)
                for (let x = 0; x < this.size.width; x++) {
                    let i = (y*this.size.width+x);
                    
                    document.getElementById('inventory_box').innerHTML += 
                        '<div class="slot" id="inventory_slot' + i + '" oncontextmenu="ui.inventory.displayContext(' + i + ')" onmouseover="ui.inventory.displayBox(' + i + ')" onclick="ui.inventory.useItem(' + i + ')" onmouseleave="ui.inventory.removeBox();">' +
                        '</div>';
                    
                    this.slots[i] = 'inventory_slot' + i;
                }
            
            document.getElementById('inventory_box').innerHTML +=
                '<font id="gold_label" class="info" style="font-size: 11px; color: yellow;">0 Gold</font>';
        },
        reload: function() {
            if (this.slots === undefined)
                return;
            
            for (let i = 0; i < this.slots.length; i++) {
                document.getElementById(this.slots[i]).innerHTML = '';
                
                if (player.inventory[i] == undefined)
                    continue;
                
                this.reloadItem(i);
            }
        },
        reloadItem: function(slot) {
            if (document.getElementById(this.slots[slot]) == undefined)
                return;
            
            document.getElementById(this.slots[slot]).style.backgroundColor = '';
            
            if (player.inventory[slot] !== undefined) {
                document.getElementById(this.slots[slot]).innerHTML = 
                    '<img src="' + player.inventory[slot].source + '" style="pointer-events: none; position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;"/>';
                
                document.getElementById(this.slots[slot]).style.border = '1px solid ' + this.getItemColor(player.inventory[slot].rarity);
                
                if (player.inventory[slot].minLevel !== 0 &&
                    player.inventory[slot].minLevel > game.players[game.player]._level)
                    document.getElementById(this.slots[slot]).style.backgroundColor = '#ff6666';
            }
            else {
                document.getElementById(this.slots[slot]).innerHTML = '';
                
                document.getElementById(this.slots[slot]).style.border = '1px solid gray';
            }
        },
        setGold: function(gold) {
            document.getElementById('gold_label').innerHTML = gold + ' Gold';
        },
        useItem: function(slot) {
            if (player.inventory[slot] !== undefined) {
                //Send to server
                
                socket.emit('CLIENT_USE_ITEM', player.inventory[slot].name);
                
                //Remove box
                
                ui.inventory.removeBox();
                
                //Remove context menu
                
                ui.inventory.removeContext();
            }
        },
        dropItem: function(slot) {
            if (player.inventory[slot] !== undefined) {
                //Send to server
                
                socket.emit('CLIENT_DROP_ITEM', slot);
                
                //Remove box
                
                ui.inventory.removeContext();
            }
        },
        displayBox: function(slot) {
            if (player.inventory[slot] === undefined && player.equipment[slot] === undefined)
                return;
            
            //Element
            
            let el = document.getElementById('displayBox'),
                context_el = document.getElementById('contextBox');
            
            if (el != undefined ||
                context_el != undefined)
                return;
            
            //Item
            
            let item = player.inventory[slot],
                isEquipment = false;
            
            if (item === undefined) {
                item = player.equipment[slot];
                
                isEquipment = true;
            }
            
            //Color
            
            let color = this.getItemColor(item.rarity);
            let note = '';

            if (item.minLevel == undefined || 
                item.minLevel === 0 || 
                game.players[game.player]._level >= item.minLevel) {
                if (item.type === 'consumable') 
                    note = '(Click to use)';

                if (item.type === 'equipment') {
                    if (player.equipment[slot] === undefined)
                        note = '(Click to equip)';
                    else
                        note = '(Click to unequip)';
                }  
            }
            
            //Action
            
            let action = '',
                actionName = '';
            
            if (item.type === 'consumable' &&
                item.consumableAction.length > 0) 
                actionName = item.consumableAction;
            if (item.type === 'equipment' &&
                item.equippableAction.length > 0) 
                actionName = item.equippableAction;

            if (actionName !== '')
                action = '<div class="inner-box" style="width: auto; height: auto; white-space: nowrap; position: relative; top: 4px; margin-bottom: 5px;">' +
                            '<img class="thumb" src="' + item.actionIcon + '" style="display: inline-block; margin: 0px; margin-left: 6px; position: relative; top: 2px;"/>' +
                            '<p class="info" style="font-size: 11px; display: inline-block; margin: 0px; margin-right: 2px; position: relative; top: -3px;">' + actionName + '</p>' +
                         '</div>'
            
            //Stats
            
            let stats = '';
            
            if (item.type === 'consumable') {
                if (item.heal > 0)
                    stats += '<p class="info" style="position: relative; top: 8px; font-size: 12px;">+' + item.heal + ' Health</p>';
                if (item.mana > 0)
                    stats += '<p class="info" style="position: relative; top: 8px; font-size: 12px;">+' + item.mana + ' Mana</p>';
                if (item.gold > 0)
                    stats += '<p class="info" style="position: relative; top: 8px; font-size: 12px;">+' + item.gold + ' Gold</p>';
            }
            
            if (item.type === 'equipment' &&
                item.stats != undefined) {
                if (item.stats.power > 0)
                    stats += '<p class="info" style="position: relative; top: 8px; font-size: 12px;">+' + item.stats.power + ' Power</p>';
                if (item.stats.intelligence > 0)
                    stats += '<p class="info" style="position: relative; top: 8px; font-size: 12px;">+' + item.stats.intelligence + ' Intelligence</p>';
                if (item.stats.toughness > 0)
                    stats += '<p class="info" style="position: relative; top: 8px; font-size: 12px;">+' + item.stats.toughness + ' Toughness</p>';
                if (item.stats.vitality > 0)
                    stats += '<p class="info" style="position: relative; top: 8px; font-size: 12px;">+' + item.stats.vitality + ' Vitality</p>';
                if (item.stats.wisdom > 0)
                    stats += '<p class="info" style="position: relative; top: 8px; font-size: 12px;">+' + item.stats.wisdom + ' Wisdom</p>';
                if (item.stats.agility > 0)
                    stats += '<p class="info" style="position: relative; top: 8px; font-size: 12px;">+' + item.stats.agility + ' Agility</p>';
            }
            
            //Item type
            
            let type = item.type;
            
            if (item.type === 'equipment')
                type = item.equippable;

            //Create displaybox
            
            let displayBox = document.createElement('div');

            displayBox.id = 'displayBox';
            displayBox.classList.add('box');
            displayBox.style = 'position: absolute; top: 0px; left: 0px; width: 120px; padding: 10px; padding-bottom: 16px; height: auto; text-align: center;';
            displayBox.innerHTML =
                    '<font class="header" style="font-size: 15px; color: ' + color + ';">' + item.name + '</font><br>' + 
                    '<font class="info" style="font-size: 10px;">' + (item.minLevel > 0 ? ' lvl ' + item.minLevel + ' ' : '') + type + '</font><br>' +
                    action +
                    '<font class="info" style="position: relative; top: 6px;">' + item.description + '</font><br>' +
                    stats +
                    (note !== '' ? '<font class="info" style="position: relative; top: 10px; font-size: 11px; margin-top: 5px;">' + note + '</font><br>' : '') +
                    '<font class="info" style="position: relative; top: 10px; font-size: 11px; color: yellow;">' + item.value + ' Gold</font><br>';

            //Append
            
            view.dom.appendChild(displayBox);
            
            //Create mouse following with the according offset
            
            let offset = {
                x: -displayBox.offsetWidth-8,
                y: -displayBox.offsetHeight
            };
            
            if (isEquipment)
                offset.y = 8;

            displayBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X+offset.x + 'px';
            displayBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y+offset.y + 'px';

            this.displayBoxLoopID = lx.GAME.ADD_LOOPS(function() {
                 displayBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X+offset.x + 'px';
                 displayBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y+offset.y + 'px';
            });
        },
        removeBox: function() {
            if (document.getElementById('displayBox') == null ||
               this.displayBoxLoopID === undefined)
                return;
            
            lx.ClearLoop(this.displayBoxLoopID);
            
            document.getElementById('displayBox').remove();
        },
        displayContext: function(slot) {
            if (player.inventory[slot] === undefined && player.equipment[slot] === undefined)
                return;
            
            //Element
            
            let el = document.getElementById('contextBox');
            
            if (el != undefined)
                this.removeContext();
            
            //Item
            
            let item = player.inventory[slot];
            
            if (item === undefined) 
                item = player.equipment[slot];
            
            //Hide displaybox
            
            this.removeBox();
            
            //Show context menu
            
            let contextBox = document.createElement('div');

            contextBox.id = 'contextBox';
            contextBox.classList.add('box');
            contextBox.style = 'position: absolute; width: 70px; padding: 4px; height: auto; text-align: center;';
            contextBox.innerHTML =
                    '<button style="width: 90%; height: 20px; font-size: 12px;" onclick="ui.inventory.useItem(' + slot + ')">Use</button>' +
                    '<button style="width: 90%; height: 20px; font-size: 12px; margin-top: 5px;" onclick="ui.inventory.dropItem(' + slot + ')">Drop</button>';
            
            //Set on mouse leave event handler
            
            contextBox.setAttribute('onmouseleave', 'ui.inventory.removeContext()');

            //Append
            
            view.dom.appendChild(contextBox);
            
            //Set position
            
            contextBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-contextBox.offsetWidth-8 + 'px';
            contextBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-contextBox.offsetHeight + 'px';
        },
        removeContext: function() {
            if (document.getElementById('contextBox') == null)
                return;
            
            document.getElementById('contextBox').remove();
        },
        getItemColor: function(rarity) {
            let color = 'gray';
                
            switch (rarity)
            {
                case 'common':
                    color = 'silver';
                    break;
                case 'uncommon':
                    color = 'lightgreen';
                    break;
                case 'rare':
                    color = 'dodgerblue';
                    break;
                case 'exotic':
                    color = 'yellow';
                    break;
                case 'legendary':
                    color = 'magenta';
                    break;
            }
            
            return color;
        }
    },
    loot: 
    {
        items: [],
        create: function() {
            view.dom.innerHTML += 
                '<div id="loot_box" class="box" style="visibility: hidden; position: absolute; top: 50%; left: 25%; transform: translate(-50%, -50%); width: auto; max-width: 150px; height: auto; text-align: center;">' +
                    '<p class="info" style="font-size: 14px; margin: 3px;">Loot</p>' +
                    '<div id="loot_box_content" style="text-align: left;"></div>' +
                    '<p class="link" onclick="ui.loot.hide()" style="font-size: 12px; color: red;">Close</p>'
                '</div>';
        },
        reset: function() {
            //Reset loot items
            
            this.items = [];
            
            //Hide loot box
            
            this.hide();
        },
        add: function(data) {
            //Check if item has already been added to the loot box
            
            if (this.items[data.id] !== undefined)
                return;
            
            //Get DOM elements
            
            let el = document.getElementById('loot_box'),
                el_content = document.getElementById('loot_box_content');
            
            //Check if valid
            
            if (el === undefined ||
                el_content === undefined)
                return;
            
            //Set item
            
            this.items[data.id] = data;
            
            //Add to DOM loot box content
            
            el_content.innerHTML += 
                '<div class="slot" id="loot_slot' + data.id + '" style="border: 1px solid ' + ui.inventory.getItemColor(data.rarity) + ';" onclick="ui.loot.pickup(' + data.id + ')">' +
                    '<img src="' + data.source + '" style="pointer-events: none; position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;"/>' +
                '</div>';
            
            //Show loot box
            
            this.show();
        },
        pickup: function(id) {
            //Check if valid
            
            if (this.items[id] === undefined)
                return;
            
            //Emit pickup request
            
            socket.emit('CLIENT_PICKUP_ITEM', id);
        },
        remove: function(id) {
            //Check if valid
            
            if (this.items[id] === undefined)
                return;
            
            //Get DOM elements
            
            let el = document.getElementById('loot_box_content'),
                slot_el = document.getElementById('loot_slot' + id);
            
            //Check if DOM elements are valid
            
            if (el === undefined || 
                slot_el === undefined)
                return;
            
            //Remove slot element
            
            el.removeChild(slot_el);
            
            //Remove possible loot item
            
            this.items[id] = undefined;
            
            //Check if loot box should be hidden
            
            let count = 0;
            for (let i = 0; i < this.items.length; i++)
                if (this.items[i] === undefined)
                    count++;
            
            if (count == this.items.length)
            {
                this.items = [];
                
                this.hide();
            }
        },
        show: function() {
            //Show the loot box if it is available
            
            let el = document.getElementById('loot_box');
            
            if (el === undefined)
                return;
            
            //Set visibility
            
            el.style.visibility = 'visible';
        },
        hide: function() {
            //Hide the loot box if it is available
            
            let el = document.getElementById('loot_box'),
                el_content = document.getElementById('loot_box_content');
            
            if (el === undefined ||
                el_content === undefined)
                return;
            
            //Clear all items
            
            el_content.innerHTML = '';
            
            this.items = [];
            
            //Set visibility
            
            el.style.visibility = 'hidden';
        }
    },
    status: 
    {
       create: function() {
            view.dom.innerHTML += 
                '<div id="status_box" class="box" style="position: absolute; top: 30px; left: 30px; width: 195px; height: 65px;">' +
                    '<div id="status_health_box" class="bar" style="text-align: center;">' +
                        '<div id="status_health" class="bar_content" style="background-color: #E87651; width: 100%;"></div>' +
                        '<p id="status_health_text" class="info" style="position: relative; top: -18px; font-size: 10px;"></p>' +
                    '</div>' + 
                    '<div id="status_mana_box" class="bar" style="text-align: center;">' +
                        '<div id="status_mana" class="bar_content" style="background-color: #2B92ED; width: 100%;"></div>' +
                        '<p id="status_mana_text" class="info" style="position: relative; top: -18px; font-size: 10px;"></p>' +
                    '</div>' + 
                    '<div id="status_exp_box" class="bar" style="text-align: center; height: 9px;">' +
                        '<div id="status_exp" class="bar_content" style="background-color: #BF4CE6; width: 100%;"></div>' +
                        '<p id="status_exp_text" class="info" style="position: relative; top: -17px; font-size: 7px;"></p>' +
                    '</div>' + 
                '</div>';
        },
        setHealth: function(value, max) {
            let el = document.getElementById('status_health'),
                t_el = document.getElementById('status_health_text');
            
            el.style.width = (value/max)*100 + '%';
            
            t_el.innerHTML = value;
        },
        setMana: function(value, max) {
            let el = document.getElementById('status_mana'),
                t_el = document.getElementById('status_mana_text');
            
            el.style.width = (value/max)*100 + '%';
            
            t_el.innerHTML = value;
        },
        setExperience: function(value, max) {
            let el = document.getElementById('status_exp'),
                t_el = document.getElementById('status_exp_text');
            
            el.style.width = (value/max)*100 + '%';
            
            t_el.innerHTML = value;
        }
    },
    floaties: 
    {
        buffer: [],
        add: function(uitext, duration)
        {
            this.buffer.push({
                uitext: uitext.Show(),
                movement: {
                    x: 0,
                    y: -.35,
                    dy: .05
                },
                cur: duration
            });
        },
        update: function()
        {
            for (let i = 0; i < ui.floaties.buffer.length; i++)
            {
                ui.floaties.buffer[i].uitext.Position().X += ui.floaties.buffer[i].movement.x;
                ui.floaties.buffer[i].uitext.Position().Y += ui.floaties.buffer[i].movement.y;
                
                ui.floaties.buffer[i].cur--;
                ui.floaties.buffer[i].movement.y += ui.floaties.buffer[i].movement.dy;
                
                if (ui.floaties.buffer[i].cur <= 0) 
                {
                    ui.floaties.buffer[i].uitext.Hide();
                    
                    ui.floaties.buffer.splice(i, 1);
                }
            }
        },
        damageFloaty: function(target, delta)
        {
            let t = new lx.UIText(
                delta,
                Math.random()*target.Size().W,
                Math.random()*target.Size().H,
                14,
                '#FF4242'
            );
            
            t.Follows(target);
            t.SHADOW = true;
            
            this.add(t, 30);
        },
        missFloaty: function(target, delta)
        {
            let t = new lx.UIText(
                delta,
                Math.random()*target.Size().W,
                Math.random()*target.Size().H,
                14,
                'silver'
            );
            
            t.Follows(target);
            t.SHADOW = true;
            
            this.add(t, 30);
        },
        healFloaty: function(target, delta)
        {
            let t = new lx.UIText(
                delta,
                Math.random()*target.Size().W,
                Math.random()*target.Size().H,
                14,
                '#8cff66'
            );
            
            t.Follows(target);
            t.SHADOW = true;
            
            this.add(t, 30);
        }
    }
};