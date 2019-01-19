const ui = {
    initialize: function() {
        this.actionbar.create();
        this.inventory.create();
        this.equipment.create();
        this.chat.create();
        
        lx.Loops(this.floaties.update);
    },
    chat: {
        create: function() {
            if (this.dom !== undefined) {
                if (this.dom.box.parentNode !== undefined &&
                    this.dom.box.parentNode !== null) {
                
                    this.dom.box.parentNode.removeChild(this.dom.box);

                    this.dom = undefined;
                }
            }
            
            view.dom.innerHTML += 
                '<div id="chat_box" class="box" style="position: absolute; top: 100%; left: 35px; margin-top: -235px; width: 340px; height: 180px;">' +
                    '<div id="chat_box_content" class="content" style="overflow-y: auto; height: 155px;"></div>' +
                    '<input id="chat_box_message" type="text" style="width: 262px;"></input>' +
                    '<button onclick="ui.chat.sendMessage()" style="position: relative; left: 2px; height: 20px; width: 70px; padding-top: 2px;">Send</button>' +
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
            
            this.dom.content.innerHTML += '<font style="display: inline;" class="info">' + this.timeformat() + content + '</font><br>';
            
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
    actionbar: {
        create: function() {
            if (this.slots !== undefined)
                return;
                
            view.dom.innerHTML += 
                '<div id="actionbar_box" class="box" style="position: absolute; top: 100%; left: 50%; margin-left: -176px; margin-top: -105px; width: 338px; height: 48px;">' +
                    '<div class="slot" id="actionbar_slot0"></div>' +
                    '<div class="slot" id="actionbar_slot1"></div>' +
                    '<div class="slot" id="actionbar_slot2"></div>' +
                    '<div class="slot" id="actionbar_slot3"></div>' +
                    '<div class="slot" id="actionbar_slot4"></div>' +
                    '<div class="slot" id="actionbar_slot5"></div>' +
                    '<div class="slot" id="actionbar_slot6"></div>' +
                '</div>';

            this.slots = [
                'actionbar_slot0',
                'actionbar_slot1',
                'actionbar_slot2',
                'actionbar_slot3',
                'actionbar_slot4',
                'actionbar_slot5',
                'actionbar_slot6'
            ];
        },
        reload: function() {
            if (this.slots === undefined)
                return;
            
            for (let i = 0; i < this.slots.length; i++) 
                document.getElementById(this.slots[i]).innerHTML = '';
            
            for (let a = 0; a < player.actions.length; a++) {
                if (player.actions[a] == undefined)
                    continue;
                
                let uses = '';
                if (player.actions[a].uses !== undefined)
                    uses = '<font class="info" style="position: absolute; top: 25px; font-size: 10px; text-shadow: 0px 0px 1px rgba(0,0,0,1); width: 100%;">' + player.actions[a].uses + '/' + player.actions[a].max + '</font>';
                
                document.getElementById(this.slots[a]).innerHTML = 
                    '<img src="' + player.actions[a].src + '" style="position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;"/>' + uses;
            }
        }
    },
    equipment: {
        create: function() {
            if (this.slots !== undefined)
                return;
                
            view.dom.innerHTML += 
                '<div id="equipmentbar_box" class="box" style="position: absolute; top: 50%; left: 100%; margin-left: -83px; margin-top: -250px; width: 48px; height: 335px; text-align: center;">' +
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
                
                document.getElementById('equipmentbar_box').innerHTML += '<div class="slot" id="' + this.slots[i] + '" onmouseover="ui.inventory.displayBox(\'' + equippable + '\')" onmousedown="player.unequip(\'' + equippable + '\')" onmouseleave="ui.inventory.removeBox()"></div>';
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
            
            if (player.equipment[equippable] !== undefined || slot == -1) {
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
        getEquippableAtIndex: function(index) {
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
    inventory: {
        size: {
            width: 4,
            height: 5
        },
        create: function() {
            if (this.slots !== undefined)
                return;
            
            this.slots = [];
                
            view.dom.innerHTML += 
                '<div id="inventory_box" class="box" style="position: absolute; top: 100%; left: 100%; margin-left: -230px; margin-top: -315px; width: 195px; height: 260px; text-align: center;">' +
                '</div>';
            
            for (let y = 0; y < this.size.height; y++)
                for (let x = 0; x < this.size.width; x++) {
                    let i = (y*this.size.width+x);
                    
                    document.getElementById('inventory_box').innerHTML += 
                        '<div class="slot" id="inventory_slot' + i + '" onmouseover="ui.inventory.displayBox(' + i + ')" onmousedown="ui.inventory.useItem(' + i + ')" onmouseleave="ui.inventory.removeBox();">' +
                        '</div>';
                    
                    this.slots[i] = 'inventory_slot' + i;
                }
            
            document.getElementById('inventory_box').innerHTML +=
                '<font class="info" style="position: relative; top: 4px; font-size: 11px; color: yellow;">0 Gold</font>';
        },
        reload: function() {
            if (this.slots === undefined)
                return;
            
            for (let i = 0; i < this.slots.length; i++) 
                document.getElementById(this.slots[i]).innerHTML = '';
            
            for (let i = 0; i < player.inventory.length; i++) {
                if (player.inventory[i] === undefined)
                    continue;
                
                this.reloadItem(i);
            }
        },
        reloadItem: function(slot) {
            if (document.getElementById(this.slots[slot]) == undefined)
                return;
            
            if (player.inventory[slot] !== undefined) {
                document.getElementById(this.slots[slot]).innerHTML = 
                    '<img src="' + player.inventory[slot].source + '" style="pointer-events: none; position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;"/>';
                
                document.getElementById(this.slots[slot]).style.border = '1px solid ' + this.getItemColor(player.inventory[slot].rarity);
            }
            else {
                document.getElementById(this.slots[slot]).innerHTML = '';
                
                document.getElementById(this.slots[slot]).style.border = '1px solid gray';
            }
        },
        useItem: function(slot) {
            if (player.inventory[slot] !== undefined) {
                //Send to server
                
                socket.emit('CLIENT_USE_ITEM', player.inventory[slot].name);
                
                //Check if stackable
                
                //...
                
                //Remove box
                
                this.removeBox();
                
                //Remove item
            
                player.inventory[slot] = undefined;

                //Refresh UI (slot)
                
                this.reloadItem(slot);
            }
        },
        displayBox: function(slot) {
            if (player.inventory[slot] === undefined && player.equipment[slot] === undefined)
                return;
            
            //Element
            
            let el = document.getElementById('displayBox');
            
            if (el != undefined)
                return;
            
            //Item
            
            let item = player.inventory[slot];
            
            if (item === undefined) 
                item = player.equipment[slot];
            
            //Color
            
            let color = this.getItemColor(item.rarity);
            let note = '';

            if (item.equippable !== 'none') {
                if (player.equipment[slot] === undefined)
                    note = '(Click to equip)';
                else
                    note = '(Click to unequip)';
            }
            
            //Action
            
            let action = '';
            
            if (item.equippableAction.length > 0) {
                action = '<div class="inner-box" style="width: auto; height: auto; white-space: nowrap; position: relative; top: 4px; margin-bottom: 3px;">' +
                            '<img class="thumb" src="' + item.equippableActionIcon + '" style="display: inline-block; margin: 0px; margin-left: 6px; position: relative; top: 2px;"/>' +
                            '<p class="info" style="font-size: 11px; display: inline-block; margin: 0px; margin-right: 2px; position: relative; top: -3px;">' + item.equippableAction + '</p>' +
                         '</div>'
            }

            //Create displabox
            
            let displayBox = document.createElement('div');

            displayBox.id = 'displayBox';
            displayBox.classList.add('box');
            displayBox.style = 'position: absolute; top: 0px; left: 0px; width: 120px; padding: 10px; padding-bottom: 16px; height: auto; text-align: center;';
            displayBox.innerHTML =
                    '<font class="header" style="font-size: 15px; color: ' + color + ';">' + item.name + '</font><br>' + 
                    action +
                    '<font class="info" style="position: relative; top: 8px;">' + item.description + '</font><br>' +
                    '<font class="info" style="position: relative; top: 10px; font-size: 11px; margin-top: 5px;">' + note + '</font><br>' +
                    '<font class="info" style="position: relative; top: 10px; font-size: 11px; color: yellow;">' + item.value + ' Gold</font><br>';

            //Append
            
            view.dom.appendChild(displayBox);
            
            //Create mouse following

            el = document.getElementById('displayBox');
            
            el.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-el.offsetWidth-8;
            el.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-el.offsetHeight;

            this.displayBoxLoopID = lx.GAME.ADD_LOOPS(function() {
                 el.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-el.offsetWidth-8;
                 el.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-el.offsetHeight;
            });
        },
        removeBox: function() {
            if (document.getElementById('displayBox') == null ||
               this.displayBoxLoopID === undefined)
                return;
            
            lx.ClearLoop(this.displayBoxLoopID);
            
            document.getElementById('displayBox').remove();
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
    floaties: {
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