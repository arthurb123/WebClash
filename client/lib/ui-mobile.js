const ui = {
    //Main functions

    initialize: function()
    {
        manager.progress.create();

        this.controller.create();

        this.actionbar.create();
        this.loot.create();
        this.inventory.create();
        this.statusEffects.create();
        this.equipment.create();
        this.status.create();
        this.target.create();
        this.settings.create();
        this.profile.create();
        this.journal.create();
        this.shop.create();
        this.bank.create();
        this.chat.create();
        this.party.create();
        this.dialog.create();

        lx.Loops(this.floaties.update);
    },
    show: function() {
        view.dom.style.visibility = 'visible';
    },
    hide: function() {
        view.dom.style.visibility = 'hidden';
    },
    setBox: function() {
        //No saving capabilities are necessary on mobile

        return;
    },

    //UI elements

    controller:
    {
        size: 120,
        create: function() {
            let div = document.createElement('div');
            div.id = 'joystick_border';
            div.style = 'border: 1px solid whitesmoke; border-radius: 50%; position: absolute; top: 100%; left: 100%; width: ' + this.size + 'px; height: ' + this.size + 'px; transform: translate(-100%, -100%); margin-top: -15px; margin-left: -15px; box-shadow: inset 0px 1px 1px rgba(0,0,0,0.45); pointer-events: auto; overflow: hidden;';

            let joystick = document.createElement('div');
            joystick.id = 'joystick';
            joystick.style = 'position: absolute; transform: translate(-50%, -50%); background-color: rgba(175, 175, 175, .85); border: 1px solid whitesmoke; border-radius: 50%; width: ' + this.size/3 + 'px; height: ' + this.size/3 + 'px; box-shadow: 0px 1px 1px rgba(0,0,0,0.45);';

            div.addEventListener('touchend', function(event) {
                ui.controller.canFace = true;
                ui.controller.face(event);
                ui.controller.canFace = false;
            }, { passive: false });

            joystick.addEventListener('touchmove', function(event) {
                ui.controller.move(event);
            }, { passive: false });
            joystick.addEventListener('touchend', function() {
                ui.controller.reset();
            }, { passive: false });

            div.appendChild(joystick);
            view.dom.append(div);

            this.reset();
        },
        face: function(e) {
            if (!this.canFace)
                return;

            let border = document.getElementById('joystick_border');

            let delta = {
                x: Math.round(e.changedTouches[0].pageX+border.offsetWidth/2)-border.offsetLeft,
                y: Math.round(e.changedTouches[0].pageY+border.offsetHeight/2)-border.offsetTop
            };

            if (Math.abs(delta.x) > Math.abs(delta.y)) {
                if (delta.x < 0)
                    player.forceDirection.start(1);
                else if (delta.x > 0)
                    player.forceDirection.start(2);
            }
            else {
                if (delta.y < 0)
                    player.forceDirection.start(3);
                else if (delta.y > 0)
                    player.forceDirection.start(0);
            }

            player.sync('direction');
        },
        move: function(e) {
            e.preventDefault();
            this.canFace = false;

            let border = document.getElementById('joystick_border'),
                joystick = document.getElementById('joystick');

            let delta = {
                x: Math.round(e.touches[0].pageX+border.offsetWidth)-border.offsetLeft,
                y: Math.round(e.touches[0].pageY+border.offsetHeight)-border.offsetTop
            };

            let done = false;

            if (delta.x >= 0 && delta.x <= border.offsetWidth) {
                joystick.style.left = delta.x + 'px';

                done = true;
            }
            if (delta.y >= 0 && delta.y <= border.offsetHeight) {
                joystick.style.top = delta.y + 'px';

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
            let el = document.getElementById('joystick');

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

            if (game.players[game.player] != undefined)
                game.players[game.player].Movement(0, 0);
        }
    },
    fullscreen:
    {
        append: function() {
            lx.CONTEXT.CANVAS.addEventListener('touchend', function(event) {
                if (event.touches.length < 2)
                    return;

                ui.fullscreen.request();
                event.preventDefault();
            }, { passive: false });
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
        manager: [],
        create: function() {
            let box = document.createElement('div');
            box.id = 'chat_box';
            box.style = 'position: absolute; top: 15px; left: 15px; width: 180px; height: 155px; pointer-events: auto;';

            let boxInput = document.createElement('input');
            boxInput.id = 'chat_box_message';
            boxInput.type = 'text';
            boxInput.style = 'width: 180px;';

            let boxContent = document.createElement('div');
            boxContent.id = 'chat_box_content';
            boxContent.style = 'position: relative; overflow-y: auto; word-break: break-word; width: auto; height: auto; max-height: 139px;';

            box.appendChild(boxInput);
            box.appendChild(boxContent);
            view.dom.appendChild(box);

            this.dom = {
                box: box,
                content: boxContent,
                message: boxInput
            };

            boxInput.addEventListener('keydown', function(e) {
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

            this.manager.push('<font style="display: inline;" class="info">' + this.timeformat() + content + '</font><br>');

            if (this.manager.length > 12)
                this.manager.splice(0, 1);

            this.dom.content.innerHTML = this.manager.join('');

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
            return false;
        }
    },
    dialog:
    {
        visible: false,
        create: function()
        {
            let box = document.createElement('div');
            box.id = 'dialog_box';
            box.classList.add('box');
            box.style = 'visibility: hidden; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: auto; min-width: 260px; max-width: 340px; height: auto; max-height: 100%; text-align: center; padding: 0px;';
            
            let content = document.createElement('p');
            content.id = 'dialog_box_content';
            content.style = 'position: relative; left: 5%; top: 2px; white-space: pre-line; word-break: break-word; overflow-y: hidden; overflow-x: hidden; width: 90%; font-size: 14px; margin-bottom: 15px;';

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

            ui.profile.hide();
            ui.settings.hide();
            ui.journal.hide();
            ui.shop.hide();
            ui.bank.hide();

            this.visible = true;
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

            //Set display based on quest or normal
            //dialog panel

            if (this.cur[id].minLevel != undefined)  //Quest panel
                contentEl.style.display = 'inherit';
            else //Normal dialog panel
                contentEl.style.display = 'flex';

            //Create portrait div

            let widthMargin = 12;
            let portraitDiv = document.createElement('div');

            if (this.cur[id].minLevel == undefined) { //Normal dialog panel
                portraitDiv.style.marginTop = 'auto';
                portraitDiv.style.marginBottom = 'auto';
                portraitDiv.style.marginRight = widthMargin + 'px';
                portraitDiv.style.height = '100%';
            }

            //Set title/name

            let title = document.createElement('font');
            title.classList.add('info');
            title.style = 'font-weight: bold; font-size: 14px;';
            title.innerHTML = name_override == undefined ? this.name : name_override;

            portraitDiv.appendChild(title);
            portraitDiv.appendChild(document.createElement('br'));

            //Set portrait (if available)

            if (this.cur[id].portrait != undefined) {
                let portrait = document.createElement('img');
                portrait.classList.add('portrait');
                portrait.src = this.cur[id].portrait;
                
                portraitDiv.appendChild(portrait);
            }

            //Append portrait to content

            contentEl.appendChild(portraitDiv);

            //Append break

            contentEl.appendChild(document.createElement('br'));

            //Set dialog text

            let text = document.createElement('div');
            text.style.height = '100%';
            text.style.overflowX = 'hidden';
            text.style.overflowY = 'auto';
            contentEl.appendChild(text);

            if (this.cur[id].minLevel != undefined) { //Quest panel
                text.style.textAlign = 'center';
                text.innerHTML = this.cur[id].text;
            }
            else {                                    //Normal dialog panel
                text.style.textAlign = 'left';
                this.setDialogText(
                    text, 
                    this.cur[id].text, 
                    widthMargin
                );
            }

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
                button.style = 'margin-left: 0px; font-size: 13px;';
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
        setDialogText(target, text, widthMargin) {
            switch (properties.dialogTextMode) {
                case 'immediate':
                    target.innerHTML = text;
                    break;

                case 'steps':
                    //Get post size of all text and
                    //apply to the text container target

                    target.style.visibility = 'hidden';
                    target.innerHTML = text;
                    target.style.height = getComputedStyle(target).height;
                    target.style.width  = parseInt(getComputedStyle(target).width) + widthMargin*2 + 'px';

                    //Reset

                    target.innerHTML = '';
                    target.style.visibility = 'inherit';

                    //Grab DOM elements from text

                    let domElements = [];
                    let domParser = new DOMParser();
                    for (let c = 0; c < text.length; c++) {
                        //Check if valid opening DOM tag

                        if (text[c] !== '<' || 
                            text[c] === '<' && c+1 < text.length && text[c+1] === '/')
                            continue;

                        //Check if opening bracket of the closing tag is present

                        let tagCloseOpen = text.indexOf('</', c+1);
                        if (tagCloseOpen === -1)
                            continue;

                        //Check fi the closing bracket of the closing tag is present

                        let tagCloseClose = text.indexOf('>', tagCloseOpen);
                        if (tagCloseClose === -1)
                            continue;

                        //Try to parse as DOM element

                        let length = tagCloseClose - c + 1;
                        let stringToParse = text.substr(c, length);
                        try {
                            domElements[c] = {
                                element: domParser.parseFromString(stringToParse, 'text/html').body.firstChild,
                                length: length
                            };
                        }
                        catch (err) {
                            console.log('Failed to parse DOM element found in dialog "' + stringToParse + '": ' + err);
                        }
                    }

                    //Setup character timer

                    let char = 0;
                    let timer = setInterval(() => {
                        if (!this.visible || char >= text.length) {
                            clearInterval(timer);
                            return;
                        }

                        //Check if DOM element is available,
                        //if so append element and increment step
                        //with the length of the trimmed DOM element

                        if (domElements[char] != undefined) {
                            target.appendChild(domElements[char].element);

                            char += domElements[char].length;
                        } 

                        //Otherwise fill string with step

                        else {
                            target.innerHTML += text[char];

                            char++;
                        }
                    }, 25);
                    break;
            }
        },
        hideDialog: function() {
            if (!this.visible)
                return;

            document.getElementById('dialog_box').style.visibility = 'hidden';

            if (this.mouse != undefined)
                lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);

            this.mouse = undefined;

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

            this.visible = false;
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
                            '<div class="slot" id="dialog_slot' + i + '" style="margin-top: 6px; margin-bottom: 0px; border: 1px solid ' + ui.inventory.getItemColor(item.rarity) + ';">' +
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
        onCooldown: [],
        loops: [],
        selectedAction: 0,
        standardOpacity: '.875',
        create: function() {
            this.slots = [];

            let box = document.createElement('div');
            box.id = 'actionbar_box';
            box.style = 'position: absolute; top: 100%; transform: translate(0, -100%); margin-top: -15px; left: 15px; pointer-events: auto;';

            for (let i = 0; i < 7; i++)
            {
                this.slots[i] = 'actionbar_slot' + i;

                let size = 24;

                if (i < 2)
                    size = 32;

                let slot = document.createElement('div');
                slot.id = this.slots[i];
                slot.classList.add('slot');
                slot.style = 'opacity: .75; width: ' + size + 'px; height: ' + size + 'px;';
                
                box.appendChild(slot);

                this.appendActionEventListener(slot, i);
            }

            view.dom.appendChild(box);

            lx.Loops(function() {
                if (player.actions[ui.actionbar.selectedAction] == undefined) {
                    let slot = ui.actionbar.slots[ui.actionbar.selectedAction];
                    let element = document.getElementById(slot);

                    if (element != undefined) {
                        document.getElementById(slot).style.border = '';
                        document.getElementById(slot).style.opacity = ui.actionbar.standardOpacity;
                    }

                    ui.actionbar.selectedAction = -1;
                }

                for (let l = 0; l < ui.actionbar.loops.length; l++)
                    if (ui.actionbar.loops[l])
                        ui.actionbar.loops[l]();
            });

            this.reload();
        },
        reload: function() {
            if (this.slots === undefined)
                return;

            for (let i = 0; i < this.slots.length; i++) {
                let slot = document.getElementById(this.slots[i]);

                if (slot == undefined)
                    continue;

                slot.clear();

                if (player.actions[i] != undefined)
                    this.reloadAction(i);
            }
        },
        reloadAction: function(a) {
            let slot = document.getElementById(this.slots[a]);

            slot.clear();

            if (player.actions[a] == undefined)
                return;
            
            let usesContent = '∞';
            if (player.actions[a].uses != undefined)
                usesContent = player.actions[a].uses + '/' + player.actions[a].max;

            let uses = document.createElement('font');
            uses.classList.add('info');
            uses.style = 'position: absolute; top: 100%; margin-top: -12px; margin-left: -6px; font-size: 10px; text-shadow: 0px 0px 1px rgba(0,0,0,1); width: 100%; text-align: right;';
            uses.innerHTML = usesContent;

            let size = 24;
            if (a < 2)
                size = 32;

            let actionImg = document.createElement('img');
            actionImg.src = player.actions[a].src;
            actionImg.style = 'position: absolute; top: 4px; left: 4px; width: ' + size + 'px; height: ' + size + 'px;';

            slot.appendChild(actionImg);
            slot.appendChild(uses);
        },
        appendActionEventListener: function(slot, a) {
            slot.addEventListener('touchend', function() {
                if (player.actions[a] == undefined)
                    return;

                if (ui.actionbar.selectedAction === a)
                    ui.actionbar.selectedAction = -1;
                else {
                    if (ui.actionbar.selectedAction !== -1) {
                        let oldSlot = ui.actionbar.slots[ui.actionbar.selectedAction];
                        oldSlot = document.getElementById(oldSlot);

                        oldSlot.style.border = '';
                        oldSlot.style.opacity = ui.actionbar.standardOpacity;
                    }

                    if (player.actions[ui.actionbar.selectedAction])
                        delete player.actions[a].renderFrames;

                    ui.actionbar.selectedAction = a;
                    player.actions[a].renderFrames = true;

                    setTimeout(() => {
                        delete player.actions[a].renderFrames;
                    }, 1000);
                }

                slot.style.border =
                    (ui.actionbar.selectedAction === a ? '1px solid whitesmoke' : '');
                slot.style.opacity =
                    (ui.actionbar.selectedAction === a ? '1' : ui.actionbar.standardOpacity);
            }, { passive: false });
        },
        addLoops: function(cb) {
            for (let l = 0; l < this.loops.length+1; l++)
                if (this.loops[l] == undefined) {
                    this.loops[l] = cb;
                    return l;
                }
        },
        setCooldown: function(slot, cooldownTime) {
            if (this.slots === undefined)
                return;

            //Get slot element

            let el = document.getElementById(this.slots[slot]);

            //Remove cooldown and casting element, just to be sure

            ui.actionbar.removeCooldown(slot);
            ui.actionbar.removeCasting(slot);

            //Create cooldown element

            let cd = document.createElement('div');
            cd.id = this.slots[slot] + '_cooldown';
            cd.classList.add('cooldown');

            //Add time label to cooldown element

            let cdTime = document.createElement('p');

            cdTime.classList.add('info');
            cdTime.style.fontSize = '10px';
            cdTime.style.position = 'relative';

            if (slot < 2)
                cdTime.style.top = '10px';
            else
                cdTime.style.top = '6px';
            cdTime.style.left = '4px';

            cd.appendChild(cdTime);

            //Append cooldown elements

            el.appendChild(cd);

            //Set on cooldown

            this.onCooldown[slot] = cooldownTime;

            let cdLoopID = this.addLoops(function() {
                 if (player.actions[slot] == undefined) {
                    ui.actionbar.removeCooldown(slot);
                    delete ui.actionbar.onCooldown[slot];

                    ui.actionbar.loops[cdLoopID] = undefined;

                    return;
                 }

                 cd.style.width = (ui.actionbar.onCooldown[slot]/cooldownTime)*100 + '%';

                 let time = ui.actionbar.onCooldown[slot]/60;
                 if (time > 1)
                    time = Math.round(time);
                 else
                    time = time.toFixed(1);

                 cdTime.innerHTML = time + 's';

                 if (ui.actionbar.onCooldown[slot] <= 0) {
                    ui.actionbar.removeCooldown(slot);
                    delete ui.actionbar.onCooldown[slot];

                    ui.actionbar.loops[cdLoopID] = undefined;
                 } else
                    ui.actionbar.onCooldown[slot]--;
            });
        },
        removeCooldown: function(slot) {
            if (this.slots === undefined)
                return;

            let cd = document.getElementById(this.slots[slot] + '_cooldown');

            if (cd != undefined)
                cd.remove();
        },
        setCasting: function(slot, castingTime) {
            if (this.slots === undefined)
                return;

            //Get slot element

            let el = document.getElementById(this.slots[slot]);

            //Remove casting and cooldown element, just to be sure

            ui.actionbar.removeCooldown(slot);
            ui.actionbar.removeCasting(slot);

            //Create cooldown element

            let c = document.createElement('div');
            c.id = this.slots[slot] + '_casting';
            c.classList.add('cooldown');

            //Add time label to cooldown element

            let cTime = document.createElement('p');

            cTime.classList.add('info');
            cTime.style.fontSize = '10px';
            cTime.style.position = 'relative';

            if (slot < 2)
                cTime.style.top = '10px';
            else
                cTime.style.top = '6px';
            cTime.style.left = '4px';

            c.appendChild(cTime);

            //Append cooldown elements

            el.appendChild(c);

            //Setup casting loop

            let remaining = castingTime;

            let cLoopID = this.addLoops(function() {
                if (player.moving || player.actions[slot] == undefined) {
                    ui.actionbar.removeCasting(slot);

                    ui.actionbar.loops[cLoopID] = undefined;

                    return;
                }

                c.style.width = (100 - (remaining/castingTime)*100) + '%';

                let time = (castingTime - remaining)/60;
                if (time > 1)
                    time = Math.round(time);
                else
                    time = time.toFixed(1);

                cTime.innerHTML = time + 's';

                if (remaining <= 0) {
                    ui.actionbar.removeCasting(slot);

                    ui.actionbar.loops[cLoopID] = undefined;
                } else
                    remaining--;
            });
        },
        removeCasting: function(slot) {
            if (this.slots === undefined)
                return;

            let c = document.getElementById(this.slots[slot] + '_casting');

            if (c != undefined)
                c.remove();
        }
    },
    inventory:
    {
        showingContext: false,
        size: {
            width: 4,
            height: 5
        },
        create: function() {
            this.slots = [];

            let box = document.createElement('div');
            box.id = 'inventory_box';
            box.style = 'position: absolute; top: 15px; left: 100%; margin-left: -15px; transform: translate(-100%, 0); width: 45%; height: 48px; pointer-events: auto; overflow-x: auto; white-space: nowrap;';

            let content = document.createElement('div');
            content.id = 'inventory_box_content';
            content.style = 'position: absolute; top: 0px; left: 0px; width: auto; height: auto; white-space: nowrap;';

            content.addEventListener('touchmove', function() {
                ui.inventory.move();
            }, { passive: false });
            content.addEventListener('touchend', function() {
                ui.inventory.removeDisplayBox();
            }, { passive: false });

            for (let i = 0; i < this.size.width*this.size.height; i++) {
                let slot = document.createElement('div');
                slot.id = 'inventory_slot' + i;
                slot.classList.add('slot');
                slot.style = 'display: flex-inline; width: 24px; height: 24px;';

                slot.addEventListener('contextmenu', function() {
                    ui.inventory.displayContext(i);
                });
                slot.addEventListener('touchend', function() {
                    ui.inventory.useItem(i);
                }, { passive: false });
                
                content.appendChild(slot);
                this.slots[i] = 'inventory_slot' + i;
            }

            box.appendChild(content);
            view.dom.appendChild(box);

            let currency = document.createElement('p');
            currency.id = 'currency_label';
            currency.classList.add('info');
            currency.style = 'font-size: 11px; color: yellow; position: absolute; left: 100%; top: 62px; margin-left: -20px; transform: translate(-100%, 0); width: auto; text-align: right; white-space: nowrap;';
            currency.innerHTML = '0 ' + game.aliases.currency;

            view.dom.appendChild(currency);

            this.reload();
        },
        move: function() {
            let content = document.getElementById('inventory_box_content'),
                box = document.getElementById('inventory_box');

            let currentItem = Math.round(-box.scrollLeft / (box.offsetWidth-content.offsetWidth) * (this.size.width*this.size.height));
            if (currentItem > this.size.width*this.size.height-1)
                currentItem = this.size.width*this.size.height-1;

            this.showDisplayBox(currentItem, box.offsetLeft-box.offsetWidth, box.offsetTop+40);
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

            let indicator = document.createElement('font');
            indicator.style = 'font-size: 8px; position: absolute; top: 1px; left: 1px;';
            indicator.innerHTML = slot+1;

            slotDOM.style.backgroundColor = '';

            if (player.inventory[slot] !== undefined) {
                let itemImg = document.createElement('img');
                itemImg.src = player.inventory[slot].source;
                itemImg.style = 'pointer-events: none; position: absolute; top: 4px; left: 4px; width: 24px; height: 24px;';
                
                slotDOM.appendChild(indicator);
                slotDOM.appendChild(itemImg);
                slotDOM.style.border = '1px solid ' + this.getItemColor(player.inventory[slot].rarity);

                if (player.inventory[slot].minLevel !== 0 &&
                    player.inventory[slot].minLevel > game.players[game.player]._level)
                    slotDOM.style.backgroundColor = '#ff6666';
            }
            else {
                slotDOM.appendChild(indicator);

                slotDOM.style.border = '1px solid gray';
            }
        },
        setCurrency: function(currency) {
            document.getElementById('currency_label').innerHTML = currency + ' ' + game.aliases.currency;
        },
        useItem: function(slot) {
            if (player.inventory[slot] !== undefined &&
                !this.showingContext) {
                //Check if shop is not emitting

                if (ui.shop.emitted)
                    return;

                //Check if in shop, if so try to sell

                if (ui.shop.visible) {
                    ui.shop.sell(player.inventory[slot].name);

                    return;
                }

                //Check if in bank, if so try to deposit

                if (ui.bank.visible) {
                    ui.bank.deposit(player.inventory[slot].name);

                    return;
                }

                //Send to server

                channel.emit('CLIENT_USE_ITEM', player.inventory[slot].name);
            }
        },
        dropItem: function(slot) {
            const drop = () => {
                //Play item sound if possible

                if (player.inventory[slot].sounds != undefined) {
                    let sound = audio.getRandomSound(player.inventory[slot].sounds);

                    if (sound != undefined)
                    audio.playSound(sound);
                }

                //Send to server

                channel.emit('CLIENT_DROP_ITEM', slot);
            };

            if (player.inventory[slot] !== undefined) {
                if (player.inventory[slot].type === 'quest') 
                    ui.dialogs.yesNo("Dropping a quest item will destroy it, do you want to destroy the item?", (result) => {
                        if (result)
                            drop();
                    });
                else
                    drop();

                //Remove box

                ui.inventory.removeContext();
            }
        },
        showDisplayBox: function(slot, x, y) {
            //Element

            let el = document.getElementById('displayBox'),
                context_el = document.getElementById('contextBox');

            if (el != undefined ||
                context_el != undefined) {
                if (el._slot !== slot)
                    this.removeDisplayBox();
                else
                    return;
            }

            //Check if valid

            if (player.inventory[slot] === undefined && player.equipment[slot] === undefined)
                return;

            //Item

            let item = player.inventory[slot],
                isEquipment = false;

            if (item === undefined) {
                item = player.equipment[slot];

                isEquipment = true;
            }

            //Highlight slot

            if (item.minLevel > game.players[game.player]._level)
                document.getElementById(this.slots[slot]).style.backgroundColor = '#ffb3b3';
            else
                document.getElementById(this.slots[slot]).style.backgroundColor = 'rgba(215, 215, 215, .85)';

            //Color

            let color = this.getItemColor(item.rarity);
            let note = '';

            if (ui.shop.visible && item.type !== 'quest')
                note = '(Click to sell)';
            else if (ui.bank.visible)
                note = '(Click to deposit)';
            else if (item.minLevel == undefined ||
                    item.minLevel === 0 ||
                    game.players[game.player]._level >= item.minLevel) {
                if (item.type === 'consumable' || item.type === 'dialog')
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

                if (isEquipment)
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
                    stats += '<p class="info" style="font-size: 11px;">+' + item.heal + ' Health</p>';
                if (item.mana > 0)
                    stats += '<p class="info" style="font-size: 11px;">+' + item.mana + ' Mana</p>';
                if (item.currency > 0)
                    stats += '<p class="info" style="font-size: 11px;">+' + item.currency + ' ' + game.aliases.currency + '</p>';
            }

            if (item.type === 'equipment' &&
                item.stats != undefined) {
                if (item.stats.power > 0)
                    stats += '<p class="info" style="font-size: 11px;">+' + item.stats.power + ' ' + game.aliases.power + '</p>';
                if (item.stats.intelligence > 0)
                    stats += '<p class="info" style="font-size: 11px;">+' + item.stats.intelligence + ' ' + game.aliases.intelligence + '</p>';
                if (item.stats.toughness > 0)
                    stats += '<p class="info" style="font-size: 11px;">+' + item.stats.toughness + ' ' + game.aliases.toughness + '</p>';
                if (item.stats.vitality > 0)
                    stats += '<p class="info" style="font-size: 11px;">+' + item.stats.vitality + ' ' + game.aliases.vitality + '</p>';
                if (item.stats.wisdom > 0)
                    stats += '<p class="info" style="font-size: 11px;">+' + item.stats.wisdom + ' ' + game.aliases.wisdom + '</p>';
                if (item.stats.agility > 0)
                    stats += '<p class="info" style="font-size: 11px;">+' + item.stats.agility + ' ' + game.aliases.agility +'</p>';
            }

            if (stats !== '')
                stats = '<div style="position: relative; top: 8px;">' + stats + '</div>';

            //Item type

            let type = item.type;

            if (item.type === 'equipment')
                type = item.equippable;

            //Create displaybox

            let displayBox = document.createElement('div');

            displayBox.id = 'displayBox';
            displayBox.classList.add('box');
            displayBox.style = 'position: absolute; top: ' + y + 'px; left: ' + x + 'px; min-width: 120px; max-width: 160px; width: auto; padding: 4px; padding-bottom: 8px; height: auto; text-align: center;';
            displayBox.innerHTML =
                    '<font class="header" style="font-size: 14px; color: ' + color + ';">' + item.name + '</font><br>' +
                    '<font class="info" style="font-size: 10px;">' + (item.type !== 'quest' ? (item.minLevel > 0 ? ' lvl ' + item.minLevel + ' ' : '') : '') + type + '</font>' +
                    action +
                    '<font class="info" style="position: relative; top: 6px;">' + item.description + '</font><br>' +
                    stats +
                    (note !== '' ? '<font class="info" style="position: relative; top: 10px; font-size: 11px; margin-top: 5px;">' + note + '</font><br>' : '') +
                    (item.type !== 'quest' ? '<font class="info" style="position: relative; top: 10px; font-size: 10px; color: yellow;">' + item.value + ' ' + game.aliases.currency + '</font><br>' : '');

            displayBox._slot = slot;
            displayBox._minLevel = item.minLevel;

            //Append

            view.dom.appendChild(displayBox);
        },
        removeDisplayBox: function() {
            let el = document.getElementById('displayBox');

            if (el == null)
                return;

            if (el._minLevel > game.players[game.player]._level)
                document.getElementById(this.slots[el._slot]).style.backgroundColor = '#ff6666';
            else
                document.getElementById(this.slots[el._slot]).style.backgroundColor = 'rgba(175, 175, 175, .85)';

            el.remove();
        },
        displayContext: function(slot) {
            if (player.inventory[slot] === undefined && player.equipment[slot] === undefined)
                return;

            //Set context boolean to true

            this.showingContext = true;

            //Element

            let el = document.getElementById('contextBox');

            if (el != undefined)
                this.removeContext();

            //Item

            let item = player.inventory[slot];

            if (item === undefined)
                item = player.equipment[slot];

            //Hide displaybox

            this.removeDisplayBox();

            //Show context menu

            let contextBox = document.createElement('div');

            contextBox.id = 'contextBox';
            contextBox.classList.add('box');
            contextBox.style = 'position: absolute; width: 70px; padding: 4px; height: auto; text-align: center;';
            contextBox.innerHTML =
                    '<button id="contextBox_useItem" style="width: 90%; height: 20px; font-size: 12px;" >Use</button>' +
                    '<button id="contextBox_dropItem" style="width: 90%; height: 20px; font-size: 12px; margin-top: 5px;">Drop</button>';

            //Append

            view.dom.appendChild(contextBox);

            //Set position

            contextBox.style.left = lx.CONTEXT.CONTROLLER.MOUSE.POS.X-contextBox.offsetWidth/2 + 'px';
            contextBox.style.top = lx.CONTEXT.CONTROLLER.MOUSE.POS.Y+8 + 'px';

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

            //Set context boolean to true

            this.showingContext = false;

            //Remove context

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
        create: function() {
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
                slot.style = 'display: flex-inline; width: 24px; height: 24px;';

                slot.addEventListener('touchend', function() {
                    player.unequip(equippable);
                }, { passive: false });

                document.getElementById('inventory_box_content').appendChild(slot);
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
            indicator.style = 'position: absolute; left: 2px; top: 2px; color: #373737; opacity: .85; font-size: 7px; width: 100%; margin: 0px;';
            indicator.innerHTML = equippable;

            if (player.equipment[equippable] !== undefined) {
                let equipImg = document.createElement('img');
                equipImg.src = player.equipment[equippable].source;
                equipImg.style = 'pointer-events: none; position: absolute; top: 4px; left: 4px; width: 24px; height: 24px;';

                slotDOM.appendChild(indicator);
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
    status:
    {
        create: function() {
            const createInnerBar = function(id, color) {
                let inner = document.createElement('div');
                inner.id = id;
                inner.classList.add('bar_content');
                inner.style = 'background-color: ' + color + '; width: 100%;';
                return inner;
            };
            const createInnerText = function(id) {
                let text = document.createElement('p');
                text.id = id;
                text.classList.add('info');
                text.style = 'transform: translate(0, -90%); margin: 0; font-size: 9px;';
                return text;
            };
            const createBar = function(type) {
                let bar = document.createElement('div');
                bar.id = 'status_' + type + '_box';
                bar.classList.add('bar');
                bar.style = 'text-align: center; height: 9px; margin-top: 2px;';

                let color = (type === 'health' ? '#E87651' : (type === 'mana' ? '#2B92ED' : '#BF4CE6'));
                bar.appendChild(createInnerBar('status_' + type, color));
                bar.appendChild(createInnerText('status_' + type + '_text'));

                return bar;
            };
            const createLink = function(text, callback) {
                let link = document.createElement('a');
                link.classList.add('link');
                link.innerHTML = text;
                link.style = 'font-size: 10px; margin: 0px 7px 0px 7px;';
                link.addEventListener('click', function() { callback(); });
                return link;
            };

            let box = document.createElement('div');
            box.id = 'status_box';
            box.style = 'position: absolute; top: 100%; left: 100%; margin-top: -56px; margin-left: -' + (ui.controller.size+30) + 'px; transform: translate(-100%, -100%); width: 20%; height: auto;';

            box.appendChild(createBar('health'));
            box.appendChild(createBar('mana'));
            box.appendChild(createBar('exp'));

            let links = document.createElement('div');
            links.style = 'transform: translate(-50%, 0); position: absolute; left: 50%; pointer-events: auto;';
            links.appendChild(createLink('Profile', function() { ui.profile.show(); }));
            links.appendChild(createLink('Journal', function() { ui.journal.show(); }));
            links.appendChild(document.createElement('br'));
            links.appendChild(createLink(game.aliases.party, function() { ui.party.show(); }));
            links.appendChild(createLink('Settings', function() { ui.settings.show(); }));

            box.appendChild(links);
            view.dom.appendChild(box);
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
    target:
    {
        visible: false,
        create: function() {
            this.box = document.createElement('div');
            this.box.id = 'status_box';
            this.box.style = 
                'text-align: center; position: absolute; top: 50%; left: 100%;' +
                'margin-left: -10px; margin-top: -10px; transform: translate(-100%, -50%);' +
                'width: 10%; height: auto;';

            view.dom.appendChild(this.box);

            //Setup loop

            lx.Loops(() => {
                if (this.loop != undefined)
                    this.loop();
            });

            //Hide box by default

            this.box.style.visibility = 'hidden';
        },
        createContents: function(go) {
            this.box.clear();

            //Bar creation methods

            const createName = function(type) {
                let name = document.createElement('p');
                name.id = 'target_name';
                name.classList.add('info');
                name.style.fontSize = '12px';

                switch (true) {
                    case type === 'hostile' || type === 'friendly' && tiled.pvp:
                        name.style.color = '#E87651';
                        break;
                    case type === 'friendly':
                        name.style.color = 'whitesmoke';
                        break;
                }

                return name;
            };
            const createInnerBar = function(id, color) {
                let inner = document.createElement('div');
                inner.id = id;
                inner.classList.add('bar_content');
                inner.style = 'background-color: ' + color + '; width: 100%;';
                return inner;
            };
            const createInnerText = function(id) {
                let text = document.createElement('p');
                text.id = id;
                text.classList.add('info');
                text.style = 'transform: translate(0, -80%); margin: 0; font-size: 9px;';
                return text;
            };
            const createBar = function(type) {
                let bar = document.createElement('div');
                bar.id = 'target_' + type + '_box';
                bar.classList.add('bar');
                bar.style = 'text-align: center; height: 9px; margin-top: 2px;';

                let color = type === 'health' ? '#E87651' : '#2B92ED';
                bar.appendChild(createInnerBar('target_' + type, color));
                bar.appendChild(createInnerText('target_' + type + '_text'));

                return bar;
            };

            //Add name

            this.box.appendChild(createName(go._type), false);
            this.setName(
                go.name + " (lvl " + 
                (typeof player.target === 'string' ? go._level : go._stats.level) + 
                ")"
            );

            //Add health

            this.box.appendChild(createBar('health'), false);
            this.setHealth(go._health.cur, go._health.max);

            //Add mana

            if (go._mana != undefined) {
                this.box.appendChild(createBar('mana'), false);
                this.setMana(go._mana.cur, go._mana.max);
            }

            //Create loop method

            this.loop = () => {
                if (go == undefined || go._health.cur <= 0) {
                    ui.target.hide();
                    return;
                }

                ui.target.setHealth(go._health.cur, go._health.max);
                if (go._mana != undefined)
                    ui.target.setMana(go._mana.cur, go._mana.max);
            };
        },
        setName: function(name) {
            let el = document.getElementById('target_name');

            el.innerHTML = name;
        },
        setHealth: function(value, max) {
            let el = document.getElementById('target_health'),
                t_el = document.getElementById('target_health_text');

            el.style.width = (value/max)*100 + '%';

            t_el.innerHTML = value;
        },
        setMana: function(value, max) {
            let el = document.getElementById('target_mana'),
                t_el = document.getElementById('target_mana_text');

            el.style.width = (value/max)*100 + '%';

            t_el.innerHTML = value;
        },
        show: function(go) {
            this.createContents(go);

            this.box.style.visibility = 'visible';
        },
        hide: function() {
            delete this.loop;

            this.box.style.visibility = 'hidden';
        }
    },
    loot:
    {
        items: [],
        create: function() {
            let box = document.createElement('div');
            box.id = 'loot_box';
            box.classList.add('box');
            box.style = 'visibility: hidden; position: absolute; top: 50%; left: 25%; transform: translate(-50%, -50%); width: auto; max-width: 120px; height: auto; max-height: 195px; text-align: center;';

            let title = document.createElement('p');
            title.classList.add('info');
            title.style = 'font-size: 12px; margin: 2px;';
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
            slot.style = 'width: 24px; height: 24px; border: 1px solid ' + ui.inventory.getItemColor(data.rarity) + ';';

            let lootImg = document.createElement('img');
            lootImg.src = data.source;
            lootImg.style = 'pointer-events: none; position: absolute; top: 4px; left: 4px; width: 24px; height: 24px;';

            slot.appendChild(lootImg);
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
    settings:
    {
        visible: false,
        hasChanged: false,
        create: function() {
            let box = document.createElement('div');
            box.id = 'settings_box';
            box.classList.add('box');
            box.style = 'visibility: hidden; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: auto; width: auto; height: auto; text-align: center; padding: 0px;';

            let title = document.createElement('p');
            title.classList.add('info');
            title.style = 'font-size: 14px; padding-bottom: 6px;';
            title.innerHTML = '<b>Settings</b>';

            box.appendChild(title);

            //Audio settings

            {
                let audio = document.createElement('p');
                audio.classList.add('info');
                audio.style = 'font-size: 13px';
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

            let close = document.createElement('p');
            close.classList.add('link');
            close.style = 'font-size: 12px; color: red; padding-top: 3px;';
            close.innerHTML = 'Close';
            close.addEventListener('click', function() {
                ui.settings.hide();
            });

            box.appendChild(close);
            view.dom.appendChild(box);
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
            if (tiled.loading || this.visible || ui.dialog.visible) {
                this.hide();

                return;
            }

            ui.profile.hide();
            ui.journal.hide();
            ui.shop.hide();
            ui.party.hide();
            ui.bank.hide();

            lx.CONTEXT.CONTROLLER.TARGET = undefined;

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

            document.getElementById('settings_box').style.visibility = 'hidden';

            this.mouse = undefined;
            this.visible = false;

            if (this.hasChanged)
                channel.emit('CLIENT_USER_SETTINGS', {
                    audio: {
                        main: audio.actualMainVolume*100,
                        music: audio.actualBGMVolume*100,
                        sound: audio.actualSoundVolume*100
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
            title.style = 'font-size: 14px; padding-bottom: 6px;';
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

            el.innerHTML = game.aliases[attribute.toLowerCase()] + ': ' + player.attributes[attribute.toLowerCase()];

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
            if (this.visible || ui.dialog.visible) {
                this.hide();

                return;
            }

            ui.settings.hide();
            ui.journal.hide();
            ui.shop.hide();
            ui.party.hide();
            ui.bank.hide();

            lx.CONTEXT.CONTROLLER.TARGET = undefined;

            if (this.mouse == undefined)
                this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                    if (data.state == 0)
                        return;

                    lx.StopMouse(0);

                    ui.profile.hide();
                });

            document.getElementById('profile_box').style.visibility = 'visible';

            this.visible = true;
        },
        hide: function() {
            if (!this.visible)
                return;

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

            lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);

            this.mouse = undefined;

            document.getElementById('profile_box').style.visibility = 'hidden';

            this.visible = false;
        }
    },
    shop: {
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
            title.style = 'font-size: 14px; padding-bottom: 2px; font-weight: bold;';
            title.innerHTML = 'Shop';

            let content = document.createElement('div');
            content.id = 'shop_content';
            content.style = 'overflow-y: auto; padding: 1px;';

            let close = document.createElement('p');
            close.classList.add('link');
            close.style = 'font-size: 12px; color: #ff3333; position: relative; top: -4px;';
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
                slot.style = 'border: 1px solid ' + ui.inventory.getItemColor(item.rarity) + '; width: 24px; height: 24px;';
                slot.classList.add('slot');
                
                let itemImg = document.createElement('img');
                itemImg.src = item.source;
                itemImg.style = 'pointer-events: none; position: absolute; top: 4px; left: 4px; width: 24px; height: 24px;';

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
                if (game.players[game.player]._currency-this.prices[i] < 0)
                    document.getElementById('shop_slot' + i).style.backgroundColor = '#ff6666';
                else
                    document.getElementById('shop_slot' + i).style.backgroundColor = '';
        },
        buy: function(id) {
            if (this.emitted || this.target == undefined)
                return;

            this.emitted = true;

            channel.emit('CLIENT_BUY_ITEM', { npc: this.target, id: this.id, item: id });
        },
        sell: function(name) {
            if (this.emitted || this.target == undefined)
                return;

            this.emitted = true;

            channel.emit('CLIENT_SELL_ITEM', { npc: this.target, item: name });
        },
        show: function() {
            if (this.visible || ui.dialog.visible) {
                this.hide();

                return;
            }

            ui.profile.hide();
            ui.settings.hide();
            ui.journal.hide();
            ui.party.hide();
            ui.bank.hide();

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
    bank:
    {
        emitted: false,
        visible: false,
        items: {},
        create: function() {
            let box = document.createElement('div');
            box.id = 'bank_box';
            box.classList.add('box');
            box.style = 'visibility: hidden; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: auto; max-width: 240px; height: auto; max-height: 220px; text-align: center;';

            let title = document.createElement('p');
            title.id = 'bank_box_name';
            title.classList.add('info');
            title.style = 'font-size: 14px; margin: 3px; font-weight: bold;';
            title.innerHTML = 'Bank';

            let content = document.createElement('div');
            content.id = 'bank_box_content';
            content.style = 'text-align: left; overflow-y: auto; width: 100%; height: 100%; max-height: 200px;';

            let hide = document.createElement('p');
            hide.classList.add('link');
            hide.style = 'font-size: 12px; color: #ff3333;';
            hide.innerHTML = 'Close';
            hide.addEventListener('click', function() {
                ui.bank.hide();
            });

            box.appendChild(title);
            box.appendChild(content);
            box.appendChild(hide);

            view.dom.appendChild(box);
        },
        add: function(data) {
            //Check if item has already been added to the bank box

            if (this.items[data.item.name] != undefined)
                return;

            //Get DOM elements

            let el = document.getElementById('bank_box'),
                el_content = document.getElementById('bank_box_content');

            //Check if valid

            if (el === undefined ||
                el_content === undefined)
                return;

            //Set item

            this.items[data.item.name] = data;

            //Create bank box slot

            let slot = document.createElement('div');
            slot.id = 'bank_slot' + data.item.name;
            slot.classList.add('slot');
            slot.style = 'width: 24px; height: 24px; border: 1px solid ' + ui.inventory.getItemColor(data.item.rarity) + ';';

            let itemImg = document.createElement('img');
            itemImg.src = data.item.source;
            itemImg.style = 'pointer-events: none; position: absolute; top: 4px; left: 4px; width: 24px; height: 24px;';

            let amount = document.createElement('p');
            amount.classList.add('info');
            amount.style = 'font-size: 9px; position: absolute; top: 100%; left: 2px; transform: translate(0, -110%);';
            amount.innerHTML = data.amount;

            slot.appendChild(itemImg);
            slot.appendChild(amount);

            slot.addEventListener('click', function() {
                ui.bank.withdraw(data.item.name);
            });

            el_content.appendChild(slot);
        },
        showBank: function(name, data) {
            //Check if valid

            if (data == undefined || name == undefined)
                return;

            //Set bank name

            document.getElementById('bank_box_name').innerHTML = name;

            //Reload with data

            this.reload(data);

            //Show bank

            this.show();
        },
        reload: function(data) {
            //Clear content

            document.getElementById('bank_box_content').clear();
            
            //Clear items

            this.items = {};

            //Add items

            if (data.length === 0) {
                let empty = document.createElement('p');
                empty.classList.add('info');
                empty.style = 'text-align: center; font-size: 12px;';
                empty.innerHTML = 'Bank is empty.';

                document.getElementById('bank_box_content').appendChild(empty);
            }
            else
                for (let i = 0; i < data.length; i++)
                    this.add(data[i]);
        },
        deposit: function(name) {
            //Check if emitted

            if (this.emitted)
                return;

            //Emit withdraw request

            channel.emit('CLIENT_BANK_ADD_ITEM', name);

            //Set emitted

            this.emitted = true;

            //Hide (inventory) displaybox

            ui.inventory.removeDisplayBox();
        },
        withdraw: function(name) {
            //Check if valid

            if (this.items[name] == undefined)
                return;

            //Check if emitted

            if (this.emitted)
                return;

            //Emit withdraw request

            channel.emit('CLIENT_BANK_REMOVE_ITEM', name);

            //Set emitted

            this.emitted = true;

            //Hide (inventory) displaybox

            ui.inventory.removeDisplayBox();
        },
        show: function() {
            //Check if already visible

            if (this.visible) {
                this.hide();

                return;
            }

            //Hide other windows

            ui.profile.hide();
            ui.settings.hide();
            ui.journal.hide();
            ui.shop.hide();
            ui.dialog.hideDialog();

            //Lose focus

            player.loseFocus();

            //Add mouse handler

            if (this.mouse == undefined)
                this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                    if (data.state == 0)
                        return;

                    lx.StopMouse(0);

                    ui.bank.hide();
                });

            //Set visible

            document.getElementById('bank_box').style.visibility = 'visible';

            this.visible = true;
        },
        hide: function() {
            //Check if truly visible

            if (!this.visible)
                return;

            //Restore target and clear mouse event

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

            lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);
            this.mouse = undefined;

            //Set hidden

            document.getElementById('bank_box').style.visibility = 'hidden';
            this.visible = false;
        }
    },
    journal:
    {
        create: function() {
            let box = document.createElement('div');
            box.id = 'journal_box';
            box.classList.add('box');
            box.style = 'text-align: center; visibility: hidden; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: auto; height: auto; max-height: 240px; overflow-y: auto;';

            view.dom.appendChild(box);
        },
        reload: function() {
            let box = document.getElementById('journal_box');
            let done = false;

            let title = document.createElement('p');
            title.classList.add('info');
            title.style = 'font-size: 14px; padding-bottom: 6px; text-align: center; font-weight: bold;';
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
            if (this.visible || ui.dialog.visible) {
                this.hide();

                return;
            }

            this.reload();

            ui.profile.hide();
            ui.settings.hide();
            ui.shop.hide();
            ui.party.hide();
            ui.bank.hide();

            lx.CONTEXT.CONTROLLER.TARGET = undefined;

            if (this.mouse == undefined)
                this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                    if (data.state == 0)
                        return;

                    lx.StopMouse(0);

                    ui.journal.hide();
                });

            document.getElementById('journal_box').style.visibility = 'visible';

            this.visible = true;
        },
        hide: function() {
            if (!this.visible)
                return;

            lx.CONTEXT.CONTROLLER.TARGET = game.players[game.player];

            lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);

            this.mouse = undefined;

            document.getElementById('journal_box').style.visibility = 'hidden';

            this.visible = false;
        },
        abandon: function(name) {
            channel.emit('CLIENT_ABANDON_QUEST', name);
        }
    },
    quests:
    {
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
                            objective_result = 'Kill ' + objective.cur + '/' + objective.amount + ' ' + objective.npc + (objective.amount === 1 ? '' : 's') + '.';
                            break;
                        case 'gather':
                            objective = objective.gatherObjective;
                            if (objective.cur < objective.amount ||
                                !objective.turnIn)
                                objective_result = 
                                    'Gather ' + objective.cur + '/' + objective.amount + ' ' + objective.item + (objective.amount === 1 ? '' : 's');
                            else if (objective.turnIn)
                                objective_result = 
                                    'Turn-in ' + objective.item + ' at ' + objective.turnInTarget + '.';
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
            //...
        }
    },
    statusEffects:
    {
        loops: [],
        create: function() {
            this.box = new UIBox('status_effects', 'status_effects_box', 228, 10, undefined, undefined);
            this.box.setResizable(false);
            this.box.setTextAlign('center');

            this.box.element.style.backgroundColor = 'transparent';
            this.box.element.style.maxWidth = '144px';
            this.box.element.style.padding = '2px';
            this.box.content.style.display  = 'flex';
            this.box.content.style.flexWrap = 'wrap';

            lx.Loops(() => {
                for (let l = 0; l < this.loops.length; l++)
                    if (this.loops[l])
                        this.loops[l]();
            });

            this.box.hide();
        },
        reload: function() {
            this.box.clear();
            this.loops = [];

            let effects = 0;
            for (let effect in player.statusEffects) {
                let border = player.statusEffects[effect].hostile ? 'red' : 'lightgreen';

                let slot = document.createElement('div');
                slot.id = 'status_effect_' + effect.toLowerCase();
                slot.classList.add('slot');
                slot.style = 'cursor: default; width: 24px; height: 24px; border: 1px solid ' + border + ';';
                
                let img = document.createElement('img');
                img.src = player.statusEffects[effect].icon;
                img.style = 'width: 24px; height: 24px;';

                slot.appendChild(img);

                this.createTimer(slot, player.statusEffects[effect]);
                this.box.addElement(slot);

                effects++;
            }

            if (effects > 0)
                this.box.show();
            else
                this.box.hide();
        },
        createTimer: function(slot, statusEffect) {
            let elapsed  = statusEffect.elapsed;
            let duration = statusEffect.duration;

            //Create countdown element

            let cd = document.createElement('div');
            cd.id = slot.id + '_countdown';
            cd.classList.add('cooldown');

            //Add time label to countdown element

            let cdTime = document.createElement('p');

            cdTime.classList.add('info');
            cdTime.style.fontSize = '10px';
            cdTime.style.position = 'relative';
            cdTime.style.top = '4px';
            cdTime.style.left = '4px';

            cd.appendChild(cdTime);

            //Append countdown element

            slot.appendChild(cd);

            //Setup countdown loop

            let loopsId = this.loops.length;
            this.loops.push(function() {
                let remaining = duration - elapsed;

                //Check if finished

                if (remaining <= 0) {
                    slot.remove();

                    if (loopsId != undefined)
                        delete ui.statusEffects.loops[loopsId];
                    
                    return;
                }

                //Adjust countdown width

                cd.style.width = (remaining/duration)*100 + '%';

                //Get real time left

                let time = remaining/60;
                if (time > 1)
                    time = Math.round(time);
                else
                    time = time.toFixed(1);

                //Change countdown time text

                cdTime.innerHTML = time + 's';

                //Increment elapsed

                elapsed++;
            });
        }
    },
    party: {
        participants: {},
        create: function() {
            //Create box

            this.box = new UIBox('party', 'party_box', lx.GetDimensions().width/2-70, lx.GetDimensions().height/2-70, 140, undefined);
            this.box.setResizable(false);
            this.box.setMovable(false);

            this.box.element.style.textAlign = 'center';

            this.box.content.style.maxHeight = '140px';
            this.box.content.style.overflowY = 'auto';

            this.box.setTextAlign('left');

            this.box.saves = false;

            this.box.hide();

            //Add leave button

            let leave = document.createElement('a');
            leave.classList.add('link');
            leave.classList.add('colorError');
            leave.style.fontSize = '12px';
            leave.style.top = '2px';

            leave.innerHTML = 'Leave ' + game.aliases.party;

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

            //Reposition box

            this.box.position = {
                x: lx.GetDimensions().width/2-70,
                y: lx.GetDimensions().height/2-parseInt(getComputedStyle(this.box.element).height)/2
            };
            this.box.reposition();

            //Show box

            this.show(true);
        },  
        loadPlayer: function(name) {
            if (document.getElementById('party_' + name) != undefined)
                document.getElementById('party_' + name).remove();

            //Generate content

            let content = document.createElement('p');
            content.classList.add('info');
            content.innerHTML = 'In different map';

            if (this.participants[name] === 'invitee')
                content.innerHTML = 'Has been invited';
            else if (game.players[name] != undefined) {
                content = document.createElement('div');

                const createBar = (id, color) => {
                    let barBox = document.createElement('div');
                    barBox.id = 'party_' + name + '_' + id + '_box';
                    barBox.classList.add('smaller_bar');
                    barBox.style = 'text-align: center; width: 100%';

                    let innerBar = document.createElement('div');
                    innerBar.id = 'party_' + name + '_' + id;
                    innerBar.classList.add('bar_content');
                    innerBar.style = 'background-color: ' + color + '; width: 100%;';

                    barBox.appendChild(innerBar);
                    return barBox;
                };

                content.appendChild(createBar('health', '#E87651'));
                content.appendChild(createBar('mana', '#2B92ED'));

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

            box.appendChild(player);
            box.appendChild(content);

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
        hide: function(dontReset) {
            if (!dontReset) {
                this.host = undefined;
                this.participants = {}
            }

            this.box.hide();

            lx.GAME.CLEAR_EVENT('mousebutton', 0, this.mouse);
            this.mouse = undefined;
        },
        show: function(forceShow) {
            if (this.box.visible && !forceShow || ui.dialog.visible) {
                this.hide(true);

                return;
            }

            if (!player.inParty) {
                ui.dialogs.ok("You are currently not in a " + game.aliases.party.toLowerCase());

                return;
            }

            ui.profile.hide();
            ui.settings.hide();
            ui.shop.hide();
            ui.journal.hide();
            ui.bank.hide();

            if (this.mouse == undefined) 
                this.mouse = lx.GAME.ADD_EVENT('mousebutton', 0, function(data) {
                    if (data.state == 0)
                        return;

                    lx.StopMouse(0);

                    ui.party.hide(true);
                });

            this.box.show();
        }
    },
    floaties:
    {
        buffer: [],
        error: {
            movement: {
                y: 0,
                sy: -.35,
                dy: .05
            }
        },
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
            //Regular floaties

            for (let i = 0; i < ui.floaties.buffer.length; i++)
            {
                ui.floaties.buffer[i].uitext.Move(
                    ui.floaties.buffer[i].movement.x,
                    ui.floaties.buffer[i].movement.y
                );
                
                ui.floaties.buffer[i].cur--;
                ui.floaties.buffer[i].movement.y += ui.floaties.buffer[i].movement.dy;

                if (ui.floaties.buffer[i].cur <= 0)
                {
                    ui.floaties.buffer[i].uitext.Hide();

                    ui.floaties.buffer.splice(i, 1);
                }
            }

            //Error floaty

            if (ui.floaties.error.uitext != undefined) {
                ui.floaties.error.uitext.Move(
                    0,
                    ui.floaties.error.movement.y
                );
                
                ui.floaties.error.cur--;
                ui.floaties.error.movement.y += ui.floaties.error.movement.dy;

                if (ui.floaties.error.cur <= 0)
                {
                    ui.floaties.error.uitext.Hide();
                    delete ui.floaties.error.uitext;
                }
            }
        },
        errorFloaty: function(target, text)
        {
            if (this.error.uitext != undefined)
                return;

            let t = new lx.UIText(
                text,
                target.Size().W/2,
                target.Size().H/2,
                12,
                '#FF4242'
            );

            t.Follows(target);
            t.Alignment('center');
            t.SetShadow('rgba(0,0,0,.625)', 0, 2);

            this.error.uitext = t.Show();
            this.error.movement.y = this.error.movement.sy;
            this.error.cur = 32;
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
            t.SetShadow('rgba(0,0,0,.625)', 0, 2);

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
            t.SetShadow('rgba(0,0,0,.625)', 0, 2);

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
            t.SetShadow('rgba(0,0,0,.625)', 0, 2);

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
            t.SetShadow('rgba(0,0,0,.625)', 0, 2);

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
            t.SetShadow('rgba(0,0,0,.625)', 0, 2);

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
            body.style = 'padding-bottom: 6px;';
            body.innerHTML = content;

            box.addElement(body);

            for (let option = 0; option < options.length; option++) {
                let button = document.createElement('button');
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
