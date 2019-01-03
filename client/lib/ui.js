const ui = {
    initialize: function() {
        this.actionbar.create();
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
                document.getElementById('actionbar_slot0'),
                document.getElementById('actionbar_slot1'),
                document.getElementById('actionbar_slot2'),
                document.getElementById('actionbar_slot3'),
                document.getElementById('actionbar_slot4'),
                document.getElementById('actionbar_slot5'),
                document.getElementById('actionbar_slot6')
            ];
        },
        reload: function() {
            if (this.slots === undefined)
                return;
            
            for (let i = 0; i < this.slots.length; i++) 
                this.slots[i].innerHTML = '';
            
            for (let i = 0; i < player.actions.length; i++) {
                if (player.actions[i] === undefined)
                    continue;
                
                let uses = '';
                if (player.actions[i].uses !== undefined)
                    uses = '<font class="info" style="position: absolute; top: 25px; font-size: 10px; text-shadow: 0px 0px 1px rgba(0,0,0,1); width: 100%;">' + player.actions[i].uses + '/' + player.actions[i].max + '</font>';
                
                this.slots[i].innerHTML = 
                    '<img src="' + player.actions[i].src + '" style="position: absolute; top: 4px; left: 4px; width: 32px; height: 32px;"/>' + uses;
            }
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