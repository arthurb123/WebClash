const ui = {
    initialize: function() {
        this.controller.create();
        
        this.actionbar.create();
        this.dialog.create();
        this.loot.create();
        this.inventory.create();
        this.chat.create();
        
        lx.Loops(this.floaties.update);
    },
    controller:
    {
        size: 120,
        create: function() {
            let div = document.createElement('div');
            div.id = 'joypad_border';
            div.style = 'border: 1px solid whitesmoke; border-radius: 50%; position: absolute; top: 100%; left: 100%; width: ' + this.size + 'px; height: ' + this.size + 'px; transform: translate(-100%, -100%); margin-top: -15px; margin-left: -15px; box-shadow: inset 0px 1px 1px rgba(0,0,0,0.45); pointer-events: auto; overflow: hidden;';
            
            let joypad = document.createElement('div');
            joypad.id = 'joypad';
            joypad.style = 'position: absolute; transform: translate(-50%, -50%); background-color: rgba(175, 175, 175, .85); border: 1px solid whitesmoke; border-radius: 50%; width: ' + this.size/3 + 'px; height: ' + this.size/3 + 'px; box-shadow: 0px 1px 1px rgba(0,0,0,0.45);';
            
            div.setAttribute('ontouchstart', 'ui.controller.canFace = true;');
            div.setAttribute('ontouchend', 'ui.controller.face(event);');
            
            joypad.setAttribute('ontouchmove', 'ui.controller.move(event);');
            joypad.setAttribute('ontouchend', 'ui.controller.reset();');
            
            div.appendChild(joypad);
            view.dom.append(div);
            
            this.reset();
        },
        face: function(e) {
            if (!this.canFace)
                return;
            
            let border = document.getElementById('joypad_border');
            
            let delta = {
                x: Math.round(e.touches[0].pageX+border.offsetWidth)-border.offsetLeft,
                y: Math.round(e.touches[0].pageY+border.offsetHeight)-border.offsetTop
            };
            
            if (Math.abs(delta.x) > Math.abs(delta.y)) {
                if (delta.x < this.size/2)
                    player.forceFrame.start(1);
                else if (delta.x > this.size/2)
                    player.forceFrame.start(2);
            }
            else {
                if (delta.y < this.size/2)
                    player.forceFrame.start(3);
                else if (delta.y > this.size/2)
                    player.forceFrame.start(0);
            }
            
            player.sync('direction');
        },
        move: function(e) {
            e.preventDefault();
            this.canFace = false;
            
            let border = document.getElementById('joypad_border'),
                joypad = document.getElementById('joypad');
            
            let delta = {
                x: Math.round(e.touches[0].pageX+border.offsetWidth)-border.offsetLeft,
                y: Math.round(e.touches[0].pageY+border.offsetHeight)-border.offsetTop
            };
            
            let done = false;
            
            if (delta.x >= 0 && delta.x <= border.offsetWidth) {
                joypad.style.left = delta.x + 'px';
                
                done = true;
            }
            if (delta.y >= 0 && delta.y <= border.offsetHeight) {
                joypad.style.top = delta.y + 'px';
                
                done = true;
            }
            
            if (!done)
                return;
            
            this.clearMovementKeys();
            
            if (delta.x < this.size/3)
                lx.CONTEXT.CONTROLLER.KEYS['a'] = true;
            else if (delta.x > this.size*(2/3))
                lx.CONTEXT.CONTROLLER.KEYS['d'] = true;

            if (delta.y < this.size/3)
                lx.CONTEXT.CONTROLLER.KEYS['w'] = true;
            else if (delta.y > this.size*(2/3))
                lx.CONTEXT.CONTROLLER.KEYS['s'] = true;
        },
        reset: function() {
            let el = document.getElementById('joypad');
            
            el.style.top = this.size/2 + 'px';
            el.style.left = this.size/2 + 'px';
            
            this.clearMovementKeys();
        },
        clearMovementKeys: function() {
            lx.CONTEXT.CONTROLLER.KEYS['w'] =
            lx.CONTEXT.CONTROLLER.KEYS['a'] =
            lx.CONTEXT.CONTROLLER.KEYS['s'] =
            lx.CONTEXT.CONTROLLER.KEYS['d'] =
                false;
        }
    },
    fullscreen:
    {
        lastTap: 0,
        append: function() {
            lx.CONTEXT.CANVAS.addEventListener('touchend', function(event) {
                let currentTime = new Date().getTime(),
                    tapLength = currentTime - ui.fullscreen.lastTap;

                if (tapLength < 500 && tapLength > 0) {
                    ui.fullscreen.request();
                    
                    event.preventDefault();
                }
                
                ui.fullscreen.lastTap = currentTime;
            });  
        },
        request: function() {
            let isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
                                 (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
                                 (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
                                 (document.msFullscreenElement && document.msFullscreenElement !== null);
            
            let el = document.documentElement;
            
            if (isInFullScreen)
                return;
            
            let rfs = el.requestFullscreen
                    || el.webkitRequestFullscreen
                    || el.mozRequestFullScreen
                    || el.msRequestFullscreen;
            
            if (typeof rfs != "undefined" && rfs)
                rfs.call(el);
        }
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
                '<div id="chat_box" style="position: absolute; top: 15px; left: 15px; width: 180px; height: 155px;">' +
                    '<input id="chat_box_message" type="text" style="pointer-events: auto; width: 180px;"></input>' +
                    '<div id="chat_box_content" style="position: relative; overflow-y: auto; width: auto; height: auto; max-height: 139px;"></div>' +
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
            
            if (this.cache.length > 8)
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
            return false;
        }
    },
    dialog:
    {
        showing: false,
        create: function() 
        {
            view.dom.innerHTML += 
                '<div id="dialog_box" class="box" style="visibility: hidden; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: auto; min-width: 260px; max-width: 340px; height: auto; text-align: center;">' +
                    '<p id="dialog_box_content" style="white-space: pre-wrap; overflow-y: auto; width: auto; font-size: 14px;"></p>' +
                    '<br>' +
                    '<div id="dialog_box_options" style="position: relative; top: -3px;"></div>' +
                '</div>';
        },
        startDialog: function(name, dialog) 
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
            this.name = name;
            
            this.setDialog(start);
        },
        setDialog: function(id) 
        {
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
            
            let r = '<div id="actionbar_box" style="position: absolute; top: 100%; transform: translate(0, -100%); margin-top: -15px; left: 15px; pointer-events: auto;">';
            
            for (let i = 0; i < 7; i++)
            {
                this.slots[i] = 'actionbar_slot' + i;
                
                let size = 24;
                
                if (i < 2)
                    size = 32;
                
                r += '<div class="slot" style="width: ' + size + 'px; height: ' + size + 'px;" ontouchstart="player.performAction(' + i + ');" id="' + this.slots[i] + '"></div>';
            }
                
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
            
            for (let a = 0; a < player.actions.length; a++) {
                if (player.actions[a] == undefined)
                    continue;
                
                let uses = '', usesContent = '∞';
                if (player.actions[a].uses != undefined)
                    usesContent = player.actions[a].uses + '/' + player.actions[a].max;
                
                uses = '<font class="info" style="position: absolute; top: 100%; margin-top: -15px; margin-left: -6px; font-size: 10px; text-shadow: 0px 0px 1px rgba(0,0,0,1); width: 100%; text-align: right;">' + usesContent + '</font>';
                
                let size = 24;
                
                if (a < 2)
                    size = 32;
                
                document.getElementById(this.slots[a]).innerHTML = 
                    '<img src="' + player.actions[a].src + '" style="position: absolute; top: 4px; left: 4px; width: ' + size + 'px; height: ' + size + 'px;"/>' + uses;
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
                '<div id="inventory_box" style="position: absolute; top: 15px; left: 100%; margin-left: -15px; transform: translate(-100%, 0); width: 45%; height: 64px; pointer-events: auto; overflow: hidden; white-space: nowrap;">' +
                    '<div id="inventory_box_content" style="position: absolute; top: 0px; left: 0px; width: auto; height: auto;  overflow: hidden; white-space: nowrap;" ontouchstart="ui.inventory.oldTouchX = Math.round(event.touches[0].pageX);" ontouchmove="ui.inventory.move(event);"></div>' +
                    '<div id="inventory_box_slider" style="position: absolute; top: 42px; left: 0px; height: 4px; border-radius: 3px; background-color: rgba(175, 175, 175, .85);"></div>' + 
                '</div>';
            
            for (let y = 0; y < this.size.height; y++)
                for (let x = 0; x < this.size.width; x++) {
                    let i = (y*this.size.width+x);
                    
                    document.getElementById('inventory_box_content').innerHTML += 
                        '<div class="slot" style="display: flex-inline; width: 24px; height: 24px;" id="inventory_slot' + i + '" oncontextmenu="ui.inventory.displayContext(' + i + ')" ontouchstart="ui.inventory.useItem(' + i + ')">' +
                        '</div>';
                    
                    this.slots[i] = 'inventory_slot' + i;
                }
            
            /*
            document.getElementById('inventory_box').innerHTML +=
                '<font class="info" style="font-size: 11px; color: yellow;">0 Gold</font>';
                */
            
            this.setSlider();
            
            this.reload();
        },
        move: function(e) {
            if (this.oldTouchX == undefined)
                return;
            
            let x = Math.round(e.touches[0].pageX),
                d = x - this.oldTouchX;
            
            let el = document.getElementById('inventory_box_content'),
                nx = el.offsetLeft + d;
            
            if (nx < -this.size.width*this.size.height*24)
                nx = -this.size.width*this.size.height*24;
            else if (nx > 0)
                nx = 0;
            
            el.style.left = nx + 'px';
            
            this.oldTouchX = x;
            
            this.setSlider();
        },
        setSlider: function() {
            let box = document.getElementById('inventory_box'),
                content = box = document.getElementById('inventory_box_content'),
                slider = document.getElementById('inventory_box_slider');
            
            slider.style.width = (box.offsetWidth/content.offsetWidth*24) + 'px';
            slider.style.left = -(content.offsetLeft / (this.size.width*this.size.height*64) * (box.offsetWidth-slider.offsetWidth)) + 'px';
        },
        reload: function() {
            if (this.slots === undefined)
                return;
            
            for (let i = 0; i < this.slots.length; i++) 
                document.getElementById(this.slots[i]).innerHTML = '';
            
            for (let i = 0; i < this.size.width*this.size.height; i++)
                this.reloadItem(i);
        },
        reloadItem: function(slot) {
            if (document.getElementById(this.slots[slot]) == undefined)
                return;
            
            let indicator = '<font style="font-size: 8px; position: absolute; top: 1px; left: 1px;">' + (slot+1) + '</font>'
            
            if (player.inventory[slot] !== undefined) {
                document.getElementById(this.slots[slot]).innerHTML = 
                    indicator + '<img src="' + player.inventory[slot].source + '" style="pointer-events: none; position: absolute; top: 4px; left: 4px; width: 24px; height: 24px;"/>';
                
                document.getElementById(this.slots[slot]).style.border = '1px solid ' + this.getItemColor(player.inventory[slot].rarity);
            }
            else {
                document.getElementById(this.slots[slot]).innerHTML = indicator;
                
                document.getElementById(this.slots[slot]).style.border = '1px solid gray';
            }
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
            
            let item = player.inventory[slot];
            
            if (item === undefined) 
                item = player.equipment[slot];
            
            //Color
            
            let color = this.getItemColor(item.rarity);
            let note = '';

            if (item.type === 'consumable') 
                note = '(Click to use)';
            
            if (item.type === 'equipment') {
                if (player.equipment[slot] === undefined)
                    note = '(Click to equip)';
                else
                    note = '(Click to unequip)';
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
                    '<font class="info" style="font-size: 10px;">' + type + '</font><br>' +
                    action +
                    '<font class="info" style="position: relative; top: 6px;">' + item.description + '</font><br>' +
                    stats +
                    '<font class="info" style="position: relative; top: 10px; font-size: 11px; margin-top: 5px;">' + note + '</font><br>' +
                    '<font class="info" style="position: relative; top: 10px; font-size: 11px; color: yellow;">' + item.value + ' Gold</font><br>';

            //Append
            
            view.dom.appendChild(displayBox);
            
            //Create mouse following

            displayBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-displayBox.offsetWidth-8 + 'px';
            displayBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-displayBox.offsetHeight + 'px';

            this.displayBoxLoopID = lx.GAME.ADD_LOOPS(function() {
                 displayBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-displayBox.offsetWidth-8 + 'px';
                 displayBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-displayBox.offsetHeight + 'px';
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
    equipment:
    {
        reloadEquipment: function() {
            
        }
    },
    status:
    {
        setHealth: function() {
            
        },
        setMana: function() {

        },
        setExperience: function() {
            
        }
    },
    loot:
    {
        items: [],
        create: function() {
            view.dom.innerHTML += 
                '<div id="loot_box" class="box" style="visibility: hidden; position: absolute; top: 50%; left: 25%; transform: translate(-50%, -50%); width: auto; max-width: 150px; height: auto; text-align: center;">' +
                    '<p class="info" style="font-size: 12px; margin: 3px;">Loot</p>' +
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
                '<div class="slot" id="loot_slot' + data.id + '" style="width: 24px; height: 24px; border: 1px solid ' + ui.inventory.getItemColor(data.rarity) + ';" onclick="ui.loot.pickup(' + data.id + ')">' +
                    '<img src="' + data.source + '" style="pointer-events: none; position: absolute; top: 4px; left: 4px; width: 24px; height: 24px;"/>' +
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
                'red'
            );
            
            t.Follows(target);
            
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
            
            this.add(t, 30);
        },
        healFloaty: function(target, delta)
        {
            let t = new lx.UIText(
                delta,
                Math.random()*target.Size().W,
                Math.random()*target.Size().H,
                14,
                'green'
            );
            
            t.Follows(target);
            
            this.add(t, 30);
        }
    }
};