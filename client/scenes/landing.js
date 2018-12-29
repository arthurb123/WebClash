const landingScene = new lx.Scene(function() {
    //Landing page (Lynx2D) code goes here 
    
    //Change the background color
    
    lx.Background('#b4c8e8');
    
    //Draw title logo
    
    let logo_sprite = new lx.Sprite('res/ui/title.png');
    
    lx.OnLayerDraw(0, function() {
        lx.DrawSprite(
            logo_sprite,
            lx.GetDimensions().width/2-logo_sprite.Size().W/2,
            lx.GetDimensions().height*.2-logo_sprite.Size().H/2
        );
    });
    
    //Set innerHTML
        
    view.dom.innerHTML = 
        '<div id="sceneWindow" class="box" style="text-align: center; position: absolute; top: 50%; left: 50%; width: 180px; height: 220px; margin-left: -96px; margin-top: -110px;">' +
            '<p id="windowTitle" class="header">Login</p><br>' +
            '<p>Username</p>' +
            '<input id="windowName" type="text"></input><br>' +
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
                case 'invalid':
                    document.getElementById('windowErrorText').innerHTML = 'Username not allowed';
                    break;
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
    
    //Focus username textbox
    
    document.getElementById('windowName').focus();
});