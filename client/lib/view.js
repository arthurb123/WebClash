const view = {
    dom: document.getElementById('overlay'),
    loadLanding: function() {
        //Load landing page scene
        
        lx.LoadScene(landingScene);
        
        //Set innerHTML
        
        view.dom.innerHTML = 
            '<div id="sceneWindow" class="box" style="text-align: center; position: absolute; top: 50%; left: 50%; width: 200px; height: 220px; margin-left: -100px; margin-top: -110px;">' +
                '<p id="windowTitle" class="header">Login</p><br>' +
                '<p>Username</p>' +
                '<input id="windowName" type="textbox"></input><br>' +
                '<p>Password</p>' +
                '<input id="windowPassword" type="password"></input><br>' +
                '<p id="windowErrorText" style="margin: 10px; height: 20px; color: red; font-size: 11px;"></p>' +
            '</div>';
        
        //Add buttons
        
        let sw = document.getElementById('sceneWindow'),
            b = document.createElement('button');
        
        //Add login button
        
        b.onclick = function() {
            let name = document.getElementById('windowName').value,
                pass = document.getElementById('windowPassword').value;
            
            if (name.length == 0)
            {
                document.getElementById('windowErrorText').innerHTML = 'Enter a valid username';
                return;
            }
            if (pass.length == 0)
            {
                document.getElementById('windowErrorText').innerHTML = 'Enter a valid password';
                return;
            }
            
            socket.emit('CLIENT_LOGIN', { name: name, pass: pass.hashCode() }, function(data) {
                switch (data)
                {
                    case 'none':
                        document.getElementById('windowErrorText').innerHTML = 'Username does not exist';
                        break;
                    case 'full':
                        document.getElementById('windowErrorText').innerHTML = 'The server is full';
                        break;
                    case 'wrong':
                        document.getElementById('windowErrorText').innerHTML = 'Wrong password';
                        break;
                    case 'loggedin':
                        document.getElementById('windowErrorText').innerHTML = 'You are already logged in';
                        break;
                }
            });
        };
        
        b.innerHTML = 'Login';
        sw.appendChild(b);
        
        //Add register button
        
        b = document.createElement('button');
        
        b.onclick = function() {
            let name = document.getElementById('windowName').value,
                pass = document.getElementById('windowPassword').value;
            
            if (name.length == 0)
            {
                document.getElementById('windowErrorText').innerHTML = 'Enter a valid username';
                return;
            }
            if (pass.length == 0)
            {
                document.getElementById('windowErrorText').innerHTML = 'Enter a valid password';
                return;
            }
            
            socket.emit('CLIENT_REGISTER', { name: name, pass: pass.hashCode() }, function(data) {
                switch (data)
                {
                    case 'taken':
                        document.getElementById('windowErrorText').innerHTML = 'Username has been taken';
                        break;
                    case 'full':
                        document.getElementById('windowErrorText').innerHTML = 'The server is full';
                        break;
                }
            });
        };
        
        b.innerHTML = 'Register';
        sw.appendChild(b);
    },
    loadGame: function() {
        //Clear innerHTML
        
        view.dom.innerHTML = '';
        
        //Load game scene
        
        lx.LoadScene(gameScene);
    }
};