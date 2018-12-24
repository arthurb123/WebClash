const ui = {
    initialize: function() {
        this.chat.create();  
    },
    chat: {
        create: function() {
            if (this.dom !== undefined) {
                if (this.dom.box.parentNode === undefined)
                    return;
                
                this.dom.box.parentNode.removeChild(this.dom.box);
                
                this.dom = undefined;
            }
            
            view.dom.innerHTML += 
                '<div id="chat_box" class="box" style="position: absolute; top: 100%; left: 35px; margin-top: -235px; width: 340px; height: 180px;">' +
                    '<div id="chat_box_content" class="content" style="overflow-y: auto; height: 155px;"></div>' +
                    '<input id="chat_box_message" type="text" style="width: 262px;"></textbox>' +
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
        },
        timeformat: function() {
            return '[' + new Date().toString().substr(16, 5) + '] ';
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
        }
    }  
};