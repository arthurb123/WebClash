const ui = {
    initialize: function() {
        this.controller.create();
        
        this.actionbar.create();
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
            
            div.setAttribute('ontouchstart', 'ui.controller.face(event);');
            
            joypad.setAttribute('ontouchmove', 'ui.controller.move(event);');
            joypad.setAttribute('ontouchend', 'ui.controller.reset();');
            
            div.appendChild(joypad);
            view.dom.append(div);
            
            this.reset();
        },
        face: function(e) {
            let border = document.getElementById('joypad_border'),
                joypad = document.getElementById('joypad');
            
            let delta = {
                x: Math.round(e.touches[0].pageX+border.offsetWidth)-border.offsetLeft,
                y: Math.round(e.touches[0].pageY+border.offsetHeight)-border.offsetTop
            };
            
            if (delta.x < this.size/2)
                player.forceFrame.start(1);
            else if (delta.x > this.size/2)
                player.forceFrame.start(2);
            
            if (delta.y < this.size/2)
                player.forceFrame.start(3);
            else if (delta.y > this.size/2)
                player.forceFrame.start(0);
        },
        move: function(e) {
            e.preventDefault();
            
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
                
                r += '<div class="slot" style="width: 24px; height: 24px;" ontouchstart="player.performAction(' + i + ');" id="' + this.slots[i] + '"></div>';
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
                
                document.getElementById(this.slots[a]).innerHTML = 
                    '<img src="' + player.actions[a].src + '" style="position: absolute; top: 4px; left: 4px; width: 24px; height: 24px;"/>' + uses;
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
        reloadItem: function() {
            
        }
    },
    equipment:
    {
        
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
        reset: function() {
            
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