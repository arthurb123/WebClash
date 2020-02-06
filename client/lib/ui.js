const ui = {
    editMode: false,
    boxes: {},

    //Main functions

    initialize: function()
    {
        cache.progress.create();

        //Create UI boxes

        this.actionbar.create();
        this.status.create();
        this.inventory.create();
        this.equipment.create();
        this.quests.create();
        this.chat.create();
        this.party.create();

        this.loot.create();
        this.dialog.create();
        this.shop.create();
        this.profile.create();
        this.journal.create();
        this.settings.create();

        //Add floaties update loop

        lx.Loops(this.floaties.update);

        //Make sure data is being saved

        if (localStorage.getItem('ui_editMode') != undefined) {
            this.editMode = JSON.parse(localStorage.getItem('ui_editMode'));

            document.getElementById('settings_ui_editMode').checked = this.editMode;
        }
        if (localStorage.getItem('ui_boxes') != undefined) {
            this.boxes = JSON.parse(localStorage.getItem('ui_boxes'));

            this.loadBoxes();
        }
    },
    show: function() {
        view.dom.style.visibility = 'visible';
    },
    hide: function() {
        view.dom.style.visibility = 'hidden';
    },
    loadBoxes: function() {
        //Load all boxes and create
        //UI boxes

        for (let box in this.boxes)
            if (this[box] != undefined &&
                this[box].box != undefined)
                this[box].box.set(
                    this.boxes[box].xoff,
                    this.boxes[box].yoff,
                    this.boxes[box].width,
                    this.boxes[box].height,
                    this.boxes[box].anchors
                );
    },
    setBox: function(id, xoff, yoff, width, height, anchors) {
        //Save UI box element to the
        //local storage

        this.boxes[id] = {
            xoff: xoff,
            yoff: yoff,
            width: width,
            height: height,
            anchors: anchors
        };

        localStorage.setItem('ui_boxes', JSON.stringify(this.boxes));
    },

    //UI elements

    chat:
    {
        cache: [],
        create: function() {
            this.box = new UIBox('chat', 'chat_box', 30, lx.GetDimensions().height-222, 340, 182);
            this.box.setMinimumSize(148, 25);

            let boxContent = document.createElement('div');
            boxContent.id = 'chat_box_content';
            boxContent.classList.add('content');
            boxContent.style = 'overflow-y: auto; height: calc(100% - 26px);';

            let boxInput = document.createElement('input');
            boxInput.id = 'chat_box_message';
            boxInput.type = 'text';
            boxInput.style = 'width: calc(75% - 6px);';

            let boxButton = document.createElement('button');
            boxButton.style = 'width: 25%; height: 21px; padding: 0px 1px 0px 1px; margin: 0px;';
            boxButton.innerHTML = 'Send';

            boxButton.addEventListener('click', function() {
                ui.chat.sendMessage();
            });

            this.box.addElement(boxContent);
            this.box.addElement(boxInput);
            this.box.addElement(boxButton);

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

            this.dom.content.clear();
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

            channel.emit('CLIENT_NEW_CHAT', this.dom.message.value);

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
            let box = document.createElement('div');
            box.id = 'dialog_box';
            box.classList.add('box');
            box.style = 'visibility: hidden; position: absolute; top: 50%; left: 70%; transform: translate(-50%, -50%); min-width: 260px; max-width: 340px; max-height: 380px; text-align: center; padding: 0px;';
            
            let content = document.createElement('p');
            content.id = 'dialog_box_content';
            content.style = 'position: relative; left: 5%; top: 2px; white-space: normal; overflow-y: auto; overflow-x: hidden; width: 90%; font-size: 14px; margin-bottom: 15px;';

            let divider = document.createElement('hr');
            divider.style = 'position: relative; top: -5px; padding: 0px; border: 0; width: 90%; border-bottom: 1px solid whitesmoke;';

            let options = document.createElement('div');
            options.id = 'dialog_box_options';
            options.style = 'position: relative; left: 5%; top: -8px; width: 90%; white-space: normal;';

            box.appendChild(content);
            box.appendChild(divider);
            box.appendChild(options);

            view.dom.appendChild(box);
        },
        startDialog: function(owner, type, name, quest, dialog)
        {
            let start = -1;

            for (let i = 0; i < dialog.length; i++)
                if (dialog[i] != undefined && dialog[i].entry) {
                    start = i;

                    break;
                }

            if (start == -1)
                return;

            this.cur = dialog;
            this.owner = owner;
            this.type = type;
            this.name = name;
            this.quest = quest;
            this.items = [];

            this.setDialog(start);

            player.loseFocus();
        },
        setDialog: function(id, name_override)
        {
            //Check if event and handle accordingly

            if (this.cur[id].isEvent)
            {
                channel.emit('CLIENT_DIALOG_EVENT', {
                    owner: this.owner,
                    type: (this.quest == undefined ? this.type : 'quest'),                    
                    quest: this.quest,
                    id: id
                });

                return;
            }

            //Grab element references

            let contentEl = document.getElementById('dialog_box_content'),
                optionsEl = document.getElementById('dialog_box_options');

            //Clear elements

            contentEl.clear();
            optionsEl.clear();

            //Set title/name

            let title = document.createElement('font');
            title.classList.add('info');
            title.style = 'font-weight: bold;';
            title.innerHTML = name_override == undefined ? this.name : name_override;

            contentEl.appendChild(title);

            //Set portrait (if available)

            if (this.cur[id].portrait != undefined) {
                let portrait = document.createElement('img');
                portrait.classList.add('portrait');
                portrait.src = this.cur[id].portrait;
                
                contentEl.appendChild(document.createElement('br'));
                contentEl.appendChild(portrait);
            }

            //Append break

            contentEl.appendChild(document.createElement('br'));
            contentEl.appendChild(document.createElement('br'));

            //Add quest text

            let text = document.createElement('div');
            text.innerHTML = this.cur[id].text;
            contentEl.appendChild(text);

            //Handle options

            this.cur[id].options.forEach(function(option) {
                let cb = '';

                if (!isNaN(option.next)) {
                    //Normal dialog option

                    cb = 'ui.dialog.hideDialog()';

                    if (option.next != -1)
                        cb = 'ui.dialog.setDialog(' + option.next + ')';
                } else {
                    //Quest/unique dialog option

                    if (option.next == 'accept') {
                        let owner = ui.dialog.owner;
                        if (isNaN(owner))
                            owner = '\'' + owner + '\'';

                        cb = 'player.acceptQuest(' + owner + ', \'' + ui.dialog.type + '\', ' + id + ');';
                    }

                    if (option.actual_next == -1)
                        cb += 'ui.dialog.hideDialog()';
                    else
                        cb += 'ui.dialog.setDialog(' + option.actual_next + ');';
                }

                let button = document.createElement('button');
                button.classList.add('link_button');
                button.style = 'margin-left: 0px;';
                button.innerHTML = '[ ' + option.text + ' ]';

                button.addEventListener('click', function() {
                    eval(cb);
                });

                optionsEl.appendChild(button);
            });

            //Set dialog box visibility to visible

            document.getElementById('dialog_box').style.visibility = 'visible';

            //Add mouse handler that removes the dialog box
            //if a click/touch is detected outside of the box

            if (this.mouse == undefined && this.type !== 'item')
                this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                    if (data.state == 0)
                        return;

                    lx.StopMouse(0);

                    ui.dialog.hideDialog();
                });
        },
        hideDialog: function() {
            document.getElementById('dialog_box').style.visibility = 'hidden';

            if (this.mouse != undefined)
                lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);

            this.mouse = undefined;

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];
        },
        handleDialogEvent: function(data) {
            if (data.quest == undefined) {
                //Not a quest, generic event

                let next = (data.result ? 0 : 1);

                if (ui.dialog.cur[data.id].options[next].next == -1)
                    ui.dialog.hideDialog();
                else
                    ui.dialog.setDialog(ui.dialog.cur[data.id].options[next].next);
            } else {
                //Quest event dialog

                if (data.quest.minLevel <= game.players[game.player]._level) {
                    //Accept and decline options if the level req. is met

                    if (player.quests[data.quest.name] == undefined)
                        data.quest.options = [
                            { text: 'Accept', next: 'accept', actual_next: ui.dialog.cur[data.id].options[0].next },
                            { text: 'Decline', next: -1 }
                        ];
                    
                    //If the quest has already been accepted and next
                    //(quest) dialog is available, advance to that dialog

                    else if (ui.dialog.cur[data.id].options[0].next !== -1) {
                        ui.dialog.setDialog(ui.dialog.cur[data.id].options[0].next)

                        return;
                    }

                    //Otherwise add exit option to the quest dialog as
                    //no further action is possible

                    else 
                        data.quest.options = [
                            { text: 'Exit', next: -1 }
                        ];
                } else 
                    data.quest.options = [
                        { text: 'Exit', next: -1 }
                    ];

                //Set current dialog to the recieved quest dialog

                ui.dialog.cur[data.id] = data.quest;

                //Create a custom title for the current dialog

                let minLevel = '';
                if (data.quest.minLevel > 0)
                    minLevel = ' (Lv. ' + data.quest.minLevel + ')';

                //If item rewards are available, convert and add
                //to the dialog text

                if (data.quest.items.length > 0) {
                    //Append a break to the dialog text

                    ui.dialog.cur[data.id].text += '<br>';

                    //Set dialog items

                    this.items = data.quest.items;

                    //Convert and add each item

                    for (let i = 0; i < this.items.length; i++) {
                        let item = this.items[i];

                        ui.dialog.cur[data.id].text +=
                            '<div class="slot" id="dialog_slot' + i + '" style="margin-top: 6px; margin-bottom: 0px; border: 1px solid ' + ui.inventory.getItemColor(item.rarity) + ';" onmouseenter="ui.inventory.displayBox(' + i + ', \'dialog\')" onmouseleave="ui.inventory.removeBox();">' +
                                '<img src="' + item.source + '" style="pointer-events: none; position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;"/>' +
                            '</div>';
                    }
                }

                //Set dialog

                ui.dialog.setDialog(data.id, data.quest.name + minLevel);
            }
        }
    },
    actionbar:
    {
        cooldowns: [],
        create: function() {
            this.slots = [];

            this.box = new UIBox('actionbar', 'actionbar_box', lx.GetDimensions().width/2-169, lx.GetDimensions().height-86, 338, 46);
            this.box.setResizable(false);

            for (let i = 0; i < 7; i++)
            {
                this.slots[i] = 'actionbar_slot' + i;

                let slot = document.createElement('div');
                slot.id = this.slots[i];
                slot.classList.add('slot');
                
                this.box.addElement(slot);

                this.appendActionEventListener(slot, i);
            }
        },
        reload: function() {
            if (this.slots === undefined)
                return;

            for (let i = 0; i < this.slots.length; i++) {
                if (document.getElementById(this.slots[i]) == undefined)
                    continue;

                document.getElementById(this.slots[i]).clear();
            }

            for (let a = 0; a < 7; a++)
                this.reloadAction(a);
        },
        reloadAction: function(a) {
            document.getElementById(this.slots[a]).clear();

            let indicator = document.createElement('font');
            indicator.classList.add('info');
            indicator.style = 'position: absolute; top: -1px; left: 2px; font-size: 9px; z-index: 1;';
            indicator.innerHTML = (a > 1 ? (a-1).toString() : (a === 0 ? 'LMB' : 'RMB'));

            let slot = document.getElementById(this.slots[a]);
            slot.appendChild(indicator);

            if (player.actions[a] == undefined)
                return;
            
            let usesContent = '∞';
            if (player.actions[a].uses != undefined)
                usesContent = player.actions[a].uses + '/' + player.actions[a].max;

            let uses = document.createElement('font');
            uses.classList.add('info');
            uses.style = 'position: absolute; top: 100%; margin-top: -12px; margin-left: -6px; font-size: 10px; text-shadow: 0px 0px 1px rgba(0,0,0,1); width: 100%; color: #333333; z-index: 2; text-align: right;';
            uses.innerHTML = usesContent;

            let actionImg = document.createElement('img');
            actionImg.src = player.actions[a].src;
            actionImg.style = 'position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;';

            slot.appendChild(actionImg);
            slot.appendChild(uses);
        },
        appendActionEventListener: function(slot, a) {
            slot.addEventListener('mouseover', function() {
                ui.actionbar.displayBox(a);
            });
            slot.addEventListener('mouseleave', function() {
                ui.actionbar.removeBox();
            });
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
            if (player.actions[slot] == undefined)
                return;

            //Element

            let el = document.getElementById('displayBox');

            if (el != undefined)
                return;

            //Get DPS

            let dps = game.calculateDamagePerSecond(player.actions[slot].scaling);
            if (dps === 0)
                dps = '-';

            //Heal/mana delta

            let heal = '',
                mana = '';

            if (player.actions[slot].heal !== 0)
                heal = '<font class="info" style="font-size: 10px; margin-top: -3px; display: block;">Health: ' + (player.actions[slot].heal > 0 ? '+' : '') + player.actions[slot].heal + '</font>';
            if (player.actions[slot].mana !== 0)
                mana = '<font class="info" style="font-size: 10px; margin-top: -3px; display: block;">Mana: ' + (player.actions[slot].mana > 0 ? '+' : '') + player.actions[slot].mana + '</font>';

            //Create displaybox

            let displayBox = document.createElement('div');

            displayBox.id = 'displayBox';
            displayBox.classList.add('box');
            displayBox.style = 'position: absolute; top: 0px; left: 0px; width: 120px; padding: 6px; height: auto; text-align: center;';
            displayBox.innerHTML =
                    '<font class="header" style="font-size: 15px;">' + player.actions[slot].name + '</font><br>' +
                    '<font class="info" style="position: relative; top: 6px;">' + player.actions[slot].description + '</font><br>' +
                    '<font class="info" style="margin-top: 10px; font-size: 10px; display: block;">DPS: ' + dps + '</font>' +
                    heal + mana +
                    '<font class="info" style="font-size: 10px; margin-top: -3px; display: block;">CD: ' + (player.actions[slot].cooldown/60).toFixed(1) + 's</font>';

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

            lx.GAME.LOOPS.splice(this.displayBoxLoopID, 1);

            document.getElementById('displayBox').remove();
        }
    },
    equipment:
    {
        create: function() {
            this.box = new UIBox('equipment', 'equipmentbar_box', lx.GetDimensions().width-381, 30, 336, 46);
            this.box.setTextAlign('center');
            this.box.setResizable(false);

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

                let slot = document.createElement('div');
                slot.id = this.slots[i];
                slot.classList.add('slot');

                slot.addEventListener('mouseover', function() {
                    ui.inventory.displayBox(equippable, 'equipment');
                });
                slot.addEventListener('mouseleave', function() {
                    ui.inventory.removeBox();
                });
                slot.addEventListener('click', function() {
                    player.unequip(equippable);
                });

                this.box.addElement(slot);
            }

            this.reload();
        },
        reload: function() {
            if (this.slots === undefined)
                return;

            for (let i = 0; i < this.slots.length; i++)
                document.getElementById(this.slots[i]).clear();

            this.reloadEquipment('main');
            this.reloadEquipment('offhand');
            this.reloadEquipment('head');
            this.reloadEquipment('torso');
            this.reloadEquipment('hands');
            this.reloadEquipment('legs');
            this.reloadEquipment('feet');
        },
        reloadEquipment: function(equippable) {
            let slot = this.getEquippableIndex(equippable),
                slotDOM = document.getElementById(this.slots[slot]);

            if (slotDOM == undefined)
                return;

            slotDOM.clear();

            let indicator = document.createElement('p');
            indicator.style = 'position: relative; left: -1px; top: 2px; color: black; font-size: 9px; opacity: .65;';
            indicator.innerHTML = equippable;

            if (player.equipment[equippable] !== undefined) {
                let equipImg = document.createElement('img');
                equipImg.src = player.equipment[equippable].source;
                equipImg.style = 'pointer-events: none; position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;';

                slotDOM.appendChild(equipImg);

                slotDOM.style.border = '1px solid ' + ui.inventory.getItemColor(player.equipment[equippable].rarity);
            }
            else {
                slotDOM.appendChild(indicator);

                slotDOM.style.border = '1px solid gray';
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
            this.slots = [];

            this.box = new UIBox('inventory', 'inventory_box', lx.GetDimensions().width-240, lx.GetDimensions().height-300, 195, 260);
            this.box.setResizable(false);
            this.box.setTextAlign('center');

            let r = '';

            for (let y = 0; y < this.size.height; y++)
                for (let x = 0; x < this.size.width; x++) {
                    let i = (y*this.size.width+x);

                    let slot = document.createElement('div');
                    slot.id = 'inventory_slot' + i;
                    slot.classList.add('slot');

                    slot.addEventListener('contextmenu', function() {
                        ui.inventory.displayContext(i);
                    });
                    slot.addEventListener('mouseover', function() {
                        ui.inventory.displayBox(i, 'inventory');
                    });
                    slot.addEventListener('mouseleave', function() {
                        ui.inventory.removeBox();
                    });
                    slot.addEventListener('click', function() {
                        ui.inventory.useItem(i);
                    });

                    this.box.addElement(slot);

                    this.slots[i] = 'inventory_slot' + i;
                }

            let gold = document.createElement('p');
            gold.id = 'gold_label';
            gold.classList.add('info');
            gold.style = 'font-size: 11px; color: yellow;';
            gold.innerHTML = '0 Gold';

           this.box.addElement(gold);
        },
        reload: function() {
            if (this.slots === undefined)
                return;

            for (let i = 0; i < this.slots.length; i++) {
                document.getElementById(this.slots[i]).clear();

                if (player.inventory[i] == undefined)
                    continue;

                this.reloadItem(i);
            }
        },
        reloadItem: function(slot) {
            let slotDOM = document.getElementById(this.slots[slot]);

            if (slotDOM == undefined)
                return;

            slotDOM.clear();
            slotDOM.style.backgroundColor = '';

            if (player.inventory[slot] !== undefined) {
                let itemImg = document.createElement('img');
                itemImg.src = player.inventory[slot].source;
                itemImg.style = 'pointer-events: none; position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;';
                
                slotDOM.appendChild(itemImg);
                slotDOM.style.border = '1px solid ' + this.getItemColor(player.inventory[slot].rarity);

                if (player.inventory[slot].minLevel !== 0 &&
                    player.inventory[slot].minLevel > game.players[game.player]._level)
                    slotDOM.style.backgroundColor = '#ff6666';
            }
            else
                slotDOM.style.border = '1px solid gray';
        },
        setGold: function(gold) {
            document.getElementById('gold_label').innerHTML = gold + ' Gold';
        },
        useItem: function(slot) {
            if (player.inventory[slot] !== undefined) {
                //Check if shop is not emitting

                if (ui.shop.emitted)
                    return;

                //Check if in shop, if so try to sell

                if (ui.shop.visible) {
                    ui.shop.sell(player.inventory[slot].name);

                    return;
                }

                //Send to server

                channel.emit('CLIENT_USE_ITEM', player.inventory[slot].name);
            }
        },
        dropItem: function(slot) {
            if (player.inventory[slot] !== undefined) {
                 //Play item sound if possible

                 if (player.inventory[slot].sounds != undefined) {
                    let sound = audio.getRandomSound(player.inventory[slot].sounds);

                    if (sound != undefined)
                       audio.playSound(sound);
                 }

                //Send to server

                channel.emit('CLIENT_DROP_ITEM', slot);

                //Remove box

                ui.inventory.removeContext();
            }
        },
        displayBox: function(slot, slotType) {
            if (slotType === 'inventory' && player.inventory[slot] == undefined ||
                slotType === 'equipment' && player.equipment[slot] == undefined ||
                slotType === 'loot' && ui.loot.items[slot] == undefined ||
                slotType === 'dialog' && ui.dialog.items[slot] == undefined ||
                slotType === 'shop' && ui.shop.items[slot] == undefined)
                return;

            //Element

            let el = document.getElementById('displayBox'),
                context_el = document.getElementById('contextBox');

            if (el != undefined ||
                context_el != undefined)
                return;

            //Item

            let item;

            switch (slotType) {
                case 'inventory':
                    item = player.inventory[slot];
                    break;
                case 'equipment':
                    item = player.equipment[slot];
                    break; 
                case 'loot':
                    item = ui.loot.items[slot];
                    break;
                case 'dialog':
                    item = ui.dialog.items[slot];
                    break;
                case 'shop':
                    item = ui.shop.items[slot];
                    break;
            }

            //Color

            let color = this.getItemColor(item.rarity);
            let note = '';

            if (slotType !== 'shop') {
                if (slotType === 'loot') 
                    note = '(Click to loot)';
                else if (item.minLevel == undefined ||
                        item.minLevel === 0 ||
                        game.players[game.player]._level >= item.minLevel) {
                    if (slotType !== 'dialog') {
                        if (item.type === 'consumable' ||
                            item.type === 'dialog')
                            note = '(Click to ' + (ui.shop.visible ? 'sell' : 'use') + ')';

                        if (item.type === 'equipment') {
                            if (player.equipment[slot] === undefined)
                                note = '(Click to ' + (ui.shop.visible ? 'sell' : 'equip') + ')';
                            else
                                note = '(Click to unequip)';
                        }
                    }
                }
            }

            //Action

            let action = '',
                actionName = '',
                actionDps = '';

            if (item.type === 'consumable' &&
                item.consumableAction.length > 0) {
                actionName = '<b>' + item.consumableAction + '</b>';
                actionDps = '<br>' + item.consumableActionUses + ' Uses';
            }
            if (item.type === 'equipment' &&
                item.equippableAction.length > 0) {
                actionName = '<b>' + item.equippableAction + '</b>';

                if (slotType === 'equipment')
                    actionDps = '<br>DPS: ' + game.calculateDamagePerSecond(item.scaling);
                else
                    actionDps = '<br>DPS: ' + game.calculateDamagePerSecond(item.scaling, item.stats);
            }

            if (actionName !== '')
                action = '<div class="inner-box" style="width: auto; height: auto; position: relative; top: 4px; margin-bottom: 5px; padding: 2px;">' +
                            '<img class="thumb" src="' + item.actionIcon + '" style="display: inline-block; margin-left: -4px;"/>' +
                            '<p class="info" style="text-align: left; font-size: 11px; display: inline-block; margin: 0px; margin-left: 4px; margin-top: -1px;">' + actionName + actionDps + '</p>' +
                         '</div>';

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
            displayBox.style = 'position: absolute; top: 0px; left: 0px; min-width: 120px; max-width: 160px; width: auto; padding: 10px; padding-bottom: 16px; height: auto; text-align: center;';
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

            if (slotType === 'equipment')
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

            lx.GAME.LOOPS.splice(this.displayBoxLoopID, 1);

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
                    '<button id="contextBox_useItem" style="width: 90%; height: 20px; font-size: 12px;">' + (ui.shop.visible ? 'Sell' : 'Use') + '</button>' +
                    '<button id="contextBox_dropItem" style="width: 90%; height: 20px; font-size: 12px; margin-top: 5px;">Drop</button>';

            //Append

            view.dom.appendChild(contextBox);

            //Set position

            contextBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-contextBox.offsetWidth-8 + 'px';
            contextBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y-contextBox.offsetHeight + 'px';

            //Set event handlers

            contextBox.addEventListener('mouseleave', function() {
                ui.inventory.removeContext();
            });

            document.getElementById('contextBox_useItem').addEventListener('click', function() {
                ui.inventory.useItem(slot);
            });
            document.getElementById('contextBox_dropItem').addEventListener('click', function() {
                ui.inventory.dropItem(slot);
            });
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
            let box = document.createElement('div');
            box.id = 'loot_box';
            box.classList.add('box');
            box.style = 'visibility: hidden; position: absolute; top: 50%; left: 25%; transform: translate(-50%, -50%); width: auto; max-width: 144px; height: auto; max-height: 195px; text-align: center;';

            let title = document.createElement('p');
            title.classList.add('info');
            title.style = 'font-size: 14px; margin: 3px;';
            title.innerHTML = 'Loot';

            let content = document.createElement('div');
            content.id = 'loot_box_content';
            content.style = 'text-align: left; overflow-y: auto; width: 100%; height: 100%; max-height: 150px;';

            let hide = document.createElement('p');
            hide.classList.add('link');
            hide.style = 'font-size: 12px; color: #ff3333;';
            hide.innerHTML = 'Close';
            hide.addEventListener('click', function() {
                ui.loot.hide();
            });

            box.appendChild(title);
            box.appendChild(content);
            box.appendChild(hide);

            view.dom.appendChild(box);
        },
        reset: function() {
            //Reset loot items

            this.items = [];

            //Hide (inventory) displaybox

            ui.inventory.removeBox();

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

            //Create loot box slot

            let slot = document.createElement('div');
            slot.id = 'loot_slot' + data.id;
            slot.classList.add('slot');
            slot.style = 'width: 32px; height: 32px; border: 1px solid ' + ui.inventory.getItemColor(data.rarity) + ';';

            let lootImg = document.createElement('img');
            lootImg.src = data.source;
            lootImg.style = 'pointer-events: none; position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;';

            slot.appendChild(lootImg);
            slot.addEventListener('mouseenter', function() {
                ui.inventory.displayBox(data.id, 'loot');
            });
            slot.addEventListener('mouseleave', function() {
                ui.inventory.removeBox();
            });
            slot.addEventListener('click', function() {
                ui.loot.pickup(data.id);
            });

            el_content.appendChild(slot);

            //Show loot box

            this.show();
        },
        pickup: function(id) {
            //Check if valid

            if (this.items[id] === undefined)
                return;

            //Emit pickup request

            channel.emit('CLIENT_PICKUP_ITEM', id);

            //Hide (inventory) displaybox

            ui.inventory.removeBox();
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

            //Remove player item

            this.items[id] = undefined;

            //Remove slot element

            el.removeChild(slot_el);

            //Check if loot box should be hidden

            let count = 0;
            for (let i = 0; i < this.items.length; i++)
                if (this.items[i] === undefined)
                    count++;

            if (count === this.items.length)
                this.reset();
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

            el_content.clear();

            this.items = [];

            //Set visibility

            el.style.visibility = 'hidden';
        }
    },
    status:
    {
       create: function() {
            this.box = new UIBox('status', 'status_box', 30, 30, 200, 84);

            this.box.setMinimumSize(195, 84);
            this.box.setMaximumSize(Infinity, 84);
            this.box.setTextAlign('center');

            const createInnerBar = function(id, color) {
                let inner = document.createElement('div');
                inner.id = id;
                inner.classList.add('bar_content');
                inner.style = 'background-color: ' + color + '; width: 100%;';
                return inner;
            };
            const createInnerText = function(id, isExp) {
                let text = document.createElement('p');
                text.id = id;
                text.classList.add('info');
                if (isExp)
                    text.style = 'transform: translate(0, -75%); margin: 0; font-size: 7px;';
                else
                    text.style = 'transform: translate(0, -80%); margin: 0; font-size: 10px;';
                return text;
            };
            const createBar = function(type, isExp) {
                let bar = document.createElement('div');
                bar.id = 'status_' + type + '_box';
                bar.classList.add('bar');
                bar.style = 'text-align: center;';

                let color = (type === 'health' ? '#E87651' : (type === 'mana' ? '#2B92ED' : '#BF4CE6'));
                bar.appendChild(createInnerBar('status_' + type, color));
                bar.appendChild(createInnerText('status_' + type + '_text', isExp));

                return bar;
            };
            const createLink = function(id, text, horizontalMargin, callback) {
                let link = document.createElement('a');
                link.id = 'status_' + id + '_link';
                link.classList.add('info');
                link.classList.add('link');
                link.innerHTML = text;
                link.style = 'font-size: 11px; margin-left: ' + horizontalMargin + 'px;';
                link.addEventListener('click', function() { callback(); });
                return link;
            };

            this.box.addElement(createBar('health'), false);
            this.box.addElement(createBar('mana'), false);
            this.box.addElement(createBar('exp'), true);

            let links = document.createElement('div');
            links.style = 'padding: 4px;';
            links.appendChild(createLink('profile', 'Show Profile', -6, function() { ui.profile.show(); }));
            links.appendChild(createLink('journal', 'Show Journal', 6, function() { ui.journal.show(); }));

            this.box.addElement(links);
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
    settings:
    {
        visible: false,
        hasChanged: false,
        create: function() {
            let box = document.createElement('div');
            box.id = 'settings_box';
            box.classList.add('box');
            box.style = 'visibility: hidden; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: auto; width: auto; height: auto; text-align: center; padding: 3px;';

            let title = document.createElement('p');
            title.classList.add('info');
            title.style = 'font-size: 16px; padding-bottom: 6px;';
            title.innerHTML = '<b>Settings</b>';

            box.appendChild(title);

            //Audio settings

            {
                let audio = document.createElement('p');
                audio.classList.add('info');
                audio.style = 'font-size: 14px';
                audio.innerHTML = '<b>Audio</b>';

                const createSliderTitle = function(type, text) {
                    let title = document.createElement('p');
                    title.id = 'settings_audio_' + type + 'Volume_text';
                    title.classList.add('info');
                    title.style = 'font-size: 13px; margin: 0px;';
                    title.innerHTML = text;
                    return title;
                };
                const createSliderRange = function(type) {
                    let range = document.createElement('input');
                    range.id = 'settings_audio_' + type + 'Volume';
                    range.type = 'range';
                    range.min = '0';
                    range.max = '100';
                    range.addEventListener('change', function(event) {
                        ui.settings.changeAudioValue(event);
                    });
                    return range;
                };

                box.appendChild(audio);
                box.appendChild(createSliderTitle('main', 'Main '));
                box.appendChild(createSliderRange('main'));
                box.appendChild(createSliderTitle('music', 'Music '));
                box.appendChild(createSliderRange('music'));
                box.appendChild(createSliderTitle('sound', 'Sound '));
                box.appendChild(createSliderRange('sound'));
            }

            //(UI) Edit Mode Settings

            {
                let editMode = document.createElement('p');
                editMode.classList.add('info');
                editMode.style = 'font-size: 14px';
                editMode.innerHTML = '<b>UI</b>';

                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style = 'margin-left: 2px;';

                let checkboxTitle = document.createElement('label');
                checkboxTitle.style = 'position: relative; top: -2px; font-size: 13px; margin: 0px;';
                checkboxTitle.innerHTML = 'Edit Mode';

                let reset = document.createElement('button');
                reset.style = 'font-size: 12px; height: 20px; margin-top: 2px; padding: 1px 6px 1px 6px;';
                reset.innerHTML = 'Reset UI';

                checkbox.addEventListener('click', function() {
                    ui.editMode = document.getElementById('settings_ui_editMode').checked;
    
                    localStorage.setItem("ui_editMode", JSON.stringify(ui.editMode));
                });
                reset.addEventListener('click', function() {
                    ui.chat.box.reset();
                    ui.status.box.reset();
                    ui.inventory.box.reset();
                    ui.quests.box.reset();
                    ui.actionbar.box.reset();
                    ui.equipment.box.reset();
                    ui.party.box.reset();
    
                    ui.boxes = {};
    
                    localStorage.setItem("ui_boxes", JSON.stringify(ui.boxes));
                });
                
                box.appendChild(editMode);
                box.appendChild(checkbox);
                box.appendChild(checkboxTitle);
                box.appendChild(document.createElement('br'));
                box.appendChild(reset);
            }

            let close = document.createElement('p');
            close.classList.add('link');
            close.style = 'font-size: 12px; color: red; padding-top: 4px;';
            close.innerHTML = 'Close';
            close.addEventListener('click', function() {
                ui.settings.hide();
            });

            box.appendChild(close);
            view.dom.appendChild(box);

            lx.OnKey('escape', function() {
                lx.StopKey('escape');

                ui.settings.show();
            });
        },
        loadFromSettings: function(settings) {
            //Audio values

            document.getElementById('settings_audio_mainVolume').value = settings.audio.main;
            document.getElementById('settings_audio_musicVolume').value = settings.audio.music;
            document.getElementById('settings_audio_soundVolume').value = settings.audio.sound;

            this.changeAudioValue({
                target: document.getElementById('settings_audio_musicVolume')
            });
            this.changeAudioValue({
                target: document.getElementById('settings_audio_soundVolume')
            });
            this.changeAudioValue({
                target: document.getElementById('settings_audio_mainVolume')
            });
        },
        changeAudioValue: function(data) {
            let val = Math.round(data.target.value),
                text = document.getElementById(data.target.id+'_text');

            text = text.innerHTML.substr(0, text.innerHTML.indexOf(' '));

            this.hasChanged = true;

            switch (text) {
                case 'Main':
                    audio.setMainVolume(val/100);
                    break;
                case 'Music':
                    audio.setBGMVolume(val/100);
                    break;
                case 'Sound':
                    audio.setSoundVolume(val/100);
                    break;
            }

            document.getElementById(data.target.id+'_text').innerHTML = text + ' (' + val + ')';
        },
        show: function() {
            if (tiled.loading || this.visible) {
                this.hide();

                return;
            }

            ui.profile.hide();
            ui.journal.hide();
            ui.shop.hide();

            player.loseFocus();

            if (this.mouse == undefined)
                this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                    if (data.state == 0)
                        return;

                    lx.StopMouse(0);

                    ui.settings.hide();
                });

            document.getElementById('settings_box').style.visibility = 'visible';

            this.hasChanged = false;
            this.visible = true;
        },
        hide: function() {
            if (!this.visible)
                return;

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

            lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);

            this.mouse = undefined;

            document.getElementById('settings_box').style.visibility = 'hidden';

            this.visible = false;

            if (this.hasChanged)
                channel.emit('CLIENT_USER_SETTINGS', {
                    audio: {
                        main: audio.actualMainVolume*100,
                        music: audio.actualBGMVolume*100,
                        sound: audio.actualSoundVolume*100
                    },
                    ui: {
                        editMode: ui.editMode,
                        boxes: ui.boxes
                    }
                });
        }
    },
    profile:
    {
        attributes: [
            'Power',
            'Agility',
            'Intelligence',
            'Toughness',
            'Vitality',
            'Wisdom'
        ],
        visible: false,
        create: function() {
            let box = document.createElement('div');
            box.id = 'profile_box';
            box.classList.add('box');
            box.style = 'visibility: hidden; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: auto; height: auto; text-align: center; padding: 4px 12px 4px 12px;';

            let title = document.createElement('p');
            title.classList.add('info');
            title.style = 'font-size: 15px; padding-bottom: 6px;';
            title.innerHTML = '<b>Profile</b>';

            let level = document.createElement('p');
            level.id = 'profile_level';
            level.classList.add('info');
            level.style = 'font-size: 14px;';

            let points = document.createElement('p');
            points.id = 'profile_points';
            points.classList.add('info');
            points.style = 'font-size: 12px; padding-bottom: 6px;';

            box.appendChild(title);
            box.appendChild(level);
            box.appendChild(points);

            for (let a = 0; a < this.attributes.length; a++) {
                let stat = document.createElement('p');
                stat.id = 'profile_stat_' + this.attributes[a].toLowerCase();
                stat.classList.add('info');

                box.appendChild(stat);
            }

            let close = document.createElement('p');
            close.classList.add('link');
            close.style = 'font-size: 12px; color: red; padding-top: 4px;';
            close.innerHTML = 'Close';
            close.addEventListener('click', function() {
                ui.profile.hide();
            });

            box.appendChild(close);
            view.dom.appendChild(box);
        },
        reloadLevel: function(level) {
            document.getElementById('profile_level').innerHTML = 'Level ' + level;
        },
        reloadPoints: function() {
            document.getElementById('profile_points').innerHTML = '(Available points: ' + player.points + ')';

            if (player.attributes != undefined)
                this.reloadAttributes();
        },
        reloadAttributes: function() {
            let showButtons = false;

            if (player.points > 0)
                showButtons = true;

            for (let a = 0; a < this.attributes.length; a++)
                this.reloadAttribute(this.attributes[a], showButtons);
        },
        reloadAttribute: function(attribute, show_button) {
            let el = document.getElementById('profile_stat_' + attribute.toLowerCase());

            el.innerHTML = attribute + ': ' + player.attributes[attribute.toLowerCase()];

            if (show_button) {
                let button = document.createElement('button');
                button.style = 'width: 18px; height: 18px; padding: 0px;';
                button.innerHTML = '+';

                button.addEventListener('click', function() {
                    ui.profile.incrementAttribute(attribute.toLowerCase());
                });

                el.appendChild(button);
            }
        },
        incrementAttribute: function(attribute) {
            if (player.points == 0)
                return;

            channel.emit('CLIENT_INCREMENT_ATTRIBUTE', attribute);
        },
        show: function() {
            if (this.visible) {
                this.hide();

                return;
            }

            ui.settings.hide();
            ui.journal.hide();
            ui.shop.hide();

            player.loseFocus();

            if (this.mouse == undefined)
                this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                    if (data.state == 0)
                        return;

                    lx.StopMouse(0);

                    ui.profile.hide();
                });

            document.getElementById('status_profile_link').innerHTML = 'Close Profile';
            document.getElementById('profile_box').style.visibility = 'visible';

            this.visible = true;
        },
        hide: function() {
            if (!this.visible)
                return;

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

            lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);

            this.mouse = undefined;

            document.getElementById('status_profile_link').innerHTML = 'Show Profile';
            document.getElementById('profile_box').style.visibility = 'hidden';

            this.visible = false;
        }
    },
    shop: 
    {
        items: [],
        prices: [],
        visible: false,
        emitted: false,
        create: function() {
            let box = document.createElement('div');
            box.id = 'shop_box';
            box.classList.add('box');
            box.style = 'visibility: hidden; text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 80px; max-width: 20%; min-height: 80px; max-height: 25%; padding: 4px;';

            let title = document.createElement('p');
            title.id = 'shop_name';
            title.classList.add('info');
            title.style = 'font-size: 15px; padding-bottom: 2px;';
            title.innerHTML = '<b>Shop</b>';

            let content = document.createElement('div');
            content.id = 'shop_content';
            content.style = 'overflow-y: auto; padding: 1px;';

            let close = document.createElement('p');
            close.classList.add('link');
            close.style = 'font-size: 12px; color: #ff3333; position: relative; padding-top: 2px;';
            close.innerHTML = 'Close';
            close.addEventListener('click', function() {
                ui.shop.hide();
            });

            box.appendChild(title);
            box.appendChild(content);
            box.appendChild(close);

            view.dom.appendChild(box);
        },
        showShop: function(target, id, shop) {
            this.hide();

            this.target = target;
            this.id = id;

            document.getElementById('shop_content').clear();
            document.getElementById('shop_name').innerHTML = shop.name;

            let items = shop.items;
            for (let i = 0; i < items.length; i++) {
                let item = items[i].item;

                this.items[i] = item;
                this.prices[i] = items[i].price;

                let slot = document.createElement('div');
                slot.id = 'shop_slot' + i;
                slot.style = 'border: 1px solid ' + ui.inventory.getItemColor(item.rarity) + ';';
                slot.classList.add('slot');
                
                let itemImg = document.createElement('img');
                itemImg.src = item.source;
                itemImg.style = 'pointer-events: none; position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;';

                let itemPrice = document.createElement('p');
                itemPrice.classList.add('info');
                itemPrice.style = 'font-size: 9px; position: absolute; top: 100%; left: 2px; transform: translate(0, -110%); color: yellow;';
                itemPrice.innerHTML = items[i].price;

                slot.appendChild(itemImg);
                slot.appendChild(itemPrice);

                slot.addEventListener('click', function() {
                    ui.shop.buy(i);
                });

                document.getElementById('shop_content').appendChild(slot);
            }

            this.reload();

            this.show();
        },
        reload: function() {
            for (let i = 0; i < this.prices.length; i++) 
                if (game.players[game.player]._gold-this.prices[i] < 0)
                    document.getElementById('shop_slot' + i).style.backgroundColor = '#ff6666';
                else
                    document.getElementById('shop_slot' + i).style.backgroundColor = '';
        },
        buy: function(id) {
            if (this.emitted)
                return;

            this.emitted = true;

            channel.emit('CLIENT_BUY_ITEM', { npc: this.target, id: this.id, item: id });
        },
        sell: function(name) {
            if (this.emitted)
                return;

            this.emitted = true;

            channel.emit('CLIENT_SELL_ITEM', { npc: this.target, item: name });
        },
        show: function() {
            if (this.visible) {
                this.hide();

                return;
            }

            ui.profile.hide();
            ui.settings.hide();
            ui.journal.hide();

            player.loseFocus();

            if (this.mouse == undefined)
                this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                    if (data.state == 0)
                        return;

                    lx.StopMouse(0);

                    ui.shop.hide();
                });

            document.getElementById('shop_box').style.visibility = 'visible';

            this.visible = true;
        },
        hide: function() {
            if (!this.visible)
                return;

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

            lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);

            this.mouse = undefined;

            document.getElementById('shop_box').style.visibility = 'hidden';

            this.visible = false;
        }
    },
    journal:
    {
        create: function() {
            let box = document.createElement('div');
            box.id = 'journal_box';
            box.classList.add('box');
            box.style = 'text-align: center; visibility: hidden; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: auto; height: auto; max-height: 260px; overflow-y: auto; padding: 4px 12px 4px 12px;';

            view.dom.appendChild(box);
        },
        reload: function() {
            let box = document.getElementById('journal_box');
            let done = false;

            let title = document.createElement('p');
            title.classList.add('info');
            title.style = 'font-size: 15px; padding-bottom: 6px; text-align: center; font-weight: bold;';
            title.innerHTML = 'Journal';

            box.clear();
            box.appendChild(title);

            for (let quest in player.quests) {
                box.appendChild(ui.quests.generateQuestDom(quest, player.quests[quest], true));

                done = true;
            }

            if (!done) {
                let notice = document.createElement('p');
                notice.classList.add('info');
                notice.innerHTML = 'No quests available.';
                box.appendChild(notice);
            }

            let close = document.createElement('p');
            close.classList.add('link');
            close.style = 'font-size: 12px; color: red; padding-top: 4px;';
            close.innerHTML = 'Close';
            close.addEventListener('click', function() {
                ui.journal.hide();
            });
            box.appendChild(close);
        },
        show: function() {
            if (this.visible) {
                this.hide();

                return;
            }

            this.reload();

            ui.profile.hide();
            ui.settings.hide();
            ui.shop.hide();

            player.loseFocus();

            if (this.mouse == undefined)
                this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                    if (data.state == 0)
                        return;

                    lx.StopMouse(0);

                    ui.journal.hide();
                });

            document.getElementById('status_journal_link').innerHTML = 'Close Journal';
            document.getElementById('journal_box').style.visibility = 'visible';

            this.visible = true;
        },
        hide: function() {
            if (!this.visible)
                return;

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

            lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);

            this.mouse = undefined;

            document.getElementById('status_journal_link').innerHTML = 'Show Journal';
            document.getElementById('journal_box').style.visibility = 'hidden';

            this.visible = false;
        },
        track: function(name) {
            player.quests[name].pinned = !player.quests[name].pinned;

            ui.quests.reload();
            this.reload();
        },
        abandon: function(name) {
            channel.emit('CLIENT_ABANDON_QUEST', name);
        }
    },
    quests:
    {
        max_pinned: 3,
        create: function() {
            this.box = new UIBox('quests', 'quests_box', lx.GetDimensions().width-165, lx.GetDimensions().height/2-100, 120, undefined);
            this.box.setResizable(false);
            this.box.setTextAlign('center');

            this.box.hide();
        },
        generateQuestDom: function(name, quest, full) {
            //Get references and setup variables

            let result = document.createElement('div'),
                progress = '',
                objectives = quest.objectives;

            //If quest is not finished, get (completed) objectives

            if (!quest.finished)
                for (let i = 0; i <= quest.id; i++) {
                    let objective = objectives[i],
                        objective_result = '';

                    switch (objective.type) {
                        case 'kill':
                            objective = objective.killObjective;
                            objective_result = objective.cur + '/' + objective.amount + ' ' + objective.npc + (objective.amount === 1 ? '' : 's');
                            break;
                        case 'gather':
                            objective = objective.gatherObjective;
                            objective_result = objective.cur + '/' + objective.amount + ' ' + objective.item + (objective.amount === 1 ? '' : 's');
                            break;
                        case 'talk':
                            objective = objective.talkObjective;
                            objective_result = 'Talk to ' + objective.npc + '.';
                    }

                    if (i != quest.id)
                        objective_result = '<del>' + objective_result + '</del><br>';

                    progress += objective_result;
                }

            //Dynamically determine necessary padding

            let padding = '2px 6px 2px 6px;';

            if (full)
                padding = '2px 14px 2px 14px;';

            //Setup result DOM

            result.id = 'quests_content';
            result.classList.add('content');
            result.style = 'width: auto; height: auto; padding: ' + padding;

            //Add name

            result.innerHTML +=
                    '<p class="info"><b>' + name + '</b></p>';

            //Add progress if it exists

            if (progress.length > 0)
                result.innerHTML += 
                    '<p class="info" style="font-size: 11px;">' + progress + '</p>';

            //If quest is finished, add complete button

            if (quest.finished) {
                let complete_button = document.createElement('button');
                complete_button.style = 'font-size: 12px; width: 90%; height: 20px; margin-bottom: 4px;';
                complete_button.innerHTML = 'Finish';

                complete_button.addEventListener('click', function() {
                    channel.emit('CLIENT_FINISH_QUEST', name);
                });

                result.appendChild(complete_button);
            }

            //If quest is journal entry (full), act accordingly

            if (full) {
                result.innerHTML +=
                    '<hr style="padding: 0px; border: 0; width: 90%; border-bottom: 1px solid whitesmoke; margin: 2px;"/>';

                //Tracking option

                let tracking_option_name = 'Track';

                if (quest.pinned)
                    tracking_option_name = 'Untrack';

                let tracking_option = document.createElement('a');
                tracking_option.style = 'font-size: 11px; color: #4dff4d; padding: 2px;';
                tracking_option.classList.add('link');

                tracking_option.innerHTML = tracking_option_name;

                tracking_option.addEventListener('click', function() {
                    ui.journal.track(name);
                });

                if (this.pinned < this.max_pinned || quest.pinned)
                    result.appendChild(tracking_option);

                //Abandon option

                let abandon_option = document.createElement('a');
                abandon_option.style = 'font-size: 11px; color: #ff3333; padding: 2px;';
                abandon_option.classList.add('link');
                abandon_option.innerHTML = 'Abandon';

                abandon_option.addEventListener('click', function() {
                    ui.journal.abandon(name);
                });

                result.appendChild(abandon_option);
            }

            return result;
        },
        reload: function() {
            document.getElementById('quests_box').clear();

            this.pinned = 0;

            for (let quest in player.quests) {
                if (!player.quests[quest].pinned || this.pinned >= this.max_pinned) {
                    player.quests[quest].pinned = false;
                    continue;
                }

                this.pinned++;

                document.getElementById('quests_box').appendChild(this.generateQuestDom(quest, player.quests[quest], false));
            }

            if (this.pinned === 0)
                document.getElementById('quests_box').style.visibility = 'hidden';
            else
                document.getElementById('quests_box').style.visibility = 'visible';
        }
    },
    party: {
        participants: {},
        create: function() {
            //Create box

            this.box = new UIBox('party', 'party_box', 30, 140, 140, undefined);
            this.box.setResizable(false);

            this.box.element.style.textAlign = 'center';
            this.box.setTextAlign('left');

            this.box.hide();

            //Add leave button

            let leave = document.createElement('a');
            leave.classList.add('link');
            leave.classList.add('colorError');
            leave.style = 'font-size: 12px; padding-top: 2px;'
            leave.innerHTML = 'Leave Party';

            leave.addEventListener('click', function() {
                channel.emit('CLIENT_LEAVE_PARTY', 'leave');

                player.inParty = false;

                ui.party.box.hide();
            });

            this.box.element.appendChild(leave);
        },
        load: function(data) {
            if (data.participants[game.player] === 'invitee')
                return;

            this.host = data.host;
            this.participants = data.participants;

            delete this.participants[game.player];

            this.box.clear();

            //Load data from players

            for (let p in this.participants)
                this.loadPlayer(p);     

            if (this.host !== game.player)
                this.loadPlayer(this.host);

            //Show box

            this.box.show();
        },  
        loadPlayer: function(name) {
            if (document.getElementById('party_' + name) != undefined)
            document.getElementById('party_' + name).remove();

            //Generate content

            let content = '<p class="info">In different map</p>',
                level = '';

            if (this.participants[name] === 'invitee')
                content = '<p class="info">Has been invited</p>';
            else if (game.players[name] != undefined) {
                content =
                    '<div id="party_' + name + '_health_box" class="smaller_bar" style="text-align: center; width: 100%">' +
                        '<div id="party_' + name + '_health" class="bar_content" style="background-color: #E87651; width: 100%;"></div>' +
                    '</div>' +
                    '<div id="party_' + name + '_mana_box" class="smaller_bar" style="text-align: center; width: 100%;">' +
                        '<div id="party_' + name + '_mana" class="bar_content" style="background-color: #2B92ED; width: 100%;"></div>' +
                    '</div>';

                level = ' (' + game.players[name]._level + ')';
            }

            let box = document.createElement('div');
            box.id = 'party_' + name;
            box.classList.add('content');
            box.style = 'padding-left: 8px; padding-right: 8px; padding-bottom: 8px;';

            let player = document.createElement('p');
            player.classList.add('info');
            player.style = 'font-weight: bold; font-size: 12px;';
            player.innerHTML = name + level;

            box.addElement(player);
            box.addElement(new DOMParser().parseFromString(content, 'text/xml'));

            this.box.addElement(box);

            if (game.players[name] != undefined)
                this.updatePlayer(name);
        },
        updatePlayer: function(name) {
            if (game.players[name] == undefined) 
                this.loadPlayer(name);
            else if (name === this.host ||
                    this.participants[name] === 'participant') {
                if (document.getElementById('party_' + name + '_health') == undefined ||
                    document.getElementById('party_' + name + '_mana') == undefined) {
                    this.loadPlayer(name);

                    return;
                }

                let health = game.players[name]._health,
                    mana = game.players[name]._mana;

                if (health != undefined)
                    document.getElementById('party_' + name + '_health').style.width = (health.cur/health.max*100) + '%';
                if (mana != undefined)
                    document.getElementById('party_' + name + '_mana').style.width = (mana.cur/mana.max*100) + '%';
            }
        },
        inParty: function(name) {
            if (!player.inParty)
                return false;

            return (this.participants[name] === 'participant' || this.host === name && game.player !== name);
        },  
        hide: function() {
            this.host = undefined;
            this.participants = {}

            this.box.hide();
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
                    x: (Math.random()-Math.random())*.35,
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
                ui.floaties.buffer[i].uitext.Position(
                    ui.floaties.buffer[i].uitext.Position().X+ui.floaties.buffer[i].movement.x,
                    ui.floaties.buffer[i].uitext.Position().Y+ui.floaties.buffer[i].movement.y
                );
                
                ui.floaties.buffer[i].cur--;
                ui.floaties.buffer[i].movement.y += ui.floaties.buffer[i].movement.dy;

                if (ui.floaties.buffer[i].cur <= 0)
                {
                    ui.floaties.buffer[i].uitext.Hide();

                    ui.floaties.buffer.splice(i, 1);
                }
            }
        },
        experienceFloaty: function(target, delta)
        {
            let t = new lx.UIText(
                delta,
                Math.random()*target.Size().W,
                Math.random()*target.Size().H,
                15,
                '#BF4CE6'
            );

            t.Follows(target);
            t.Alignment('center');
            t.SHADOW = true;

            this.add(t, 32);
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
            t.Alignment('center');
            t.SHADOW = true;

            this.add(t, 32);
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
            t.Alignment('center');
            t.SHADOW = true;

            this.add(t, 32);
        },
        healFloaty: function(target, delta)
        {
            let t = new lx.UIText(
                delta,
                Math.random()*target.Size().W,
                Math.random()*target.Size().H,
                15,
                '#8cff66'
            );

            t.Follows(target);
            t.Alignment('center');
            t.SHADOW = true;

            this.add(t, 32);
        },
        manaFloaty: function(target, delta)
        {
            let t = new lx.UIText(
                delta,
                Math.random()*target.Size().W,
                Math.random()*target.Size().H,
                15,
                '#2B92ED'
            );

            t.Follows(target);
            t.Alignment('center');
            t.SHADOW = true;

            this.add(t, 32);
        }
    },

    //UI dialogs

    dialogs: {
        custom: function(content, options, callbacks) {
            let name = options[0].toLowerCase();
            for (let o = 1; o < options.length; o++)
                name += options[o];

            let id = 'dialog_' + name + '_box';

            if (document.getElementById(id) != undefined)
                return;

            let box = new UIBox(
                'dialog_' + name, 
                id, 
                lx.GetDimensions().width/2-120, 
                lx.GetDimensions().height/2-40, 
                240, 
                undefined, 
                true
            );
            box.setResizable(false);
            box.setMovable(false);
            box.setTextAlign('center');
            box.saves = false;

            let body = document.createElement('p');
            body.classList.add('info');
            body.style = 'padding: 0px 3px 3px 3px;';
            body.innerHTML = content;

            box.addElement(body);

            for (let option = 0; option < options.length; option++) {
                let button = document.createElement('button');
                button.style = 'height: 22px;';
                button.innerHTML = options[option];

                button.addEventListener('click', function() {
                    box.destroy();

                    if (callbacks[option] != undefined)
                        callbacks[option]();
                });

                box.addElement(button);
            }
        },
        ok: function(content, callback) {
            this.custom(content, ['Ok'], [callback]);
        },
        confirm: function(content, callback) {
            this.custom(content, ['Confirm'], [callback]);
        },
        yesNo: function(content, callback) {
            this.custom(content, ['Yes', 'No'], [function() { callback(true); }, function() { callback(false); }])
        }
    }
};
