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
            lx.GetDimensions().height*.175-logo_sprite.Size().H/2
        );
    });

    //Draw server name text and
    //add a loop thats keeps updating
    //the text in case of new package

    let server_name = new lx.UIText('Connected to: -', lx.GetDimensions().width/2, lx.GetDimensions().height-20, 11, '#3d3d3d')
        .Loops(function() {
            this.Text('Connected to: ' + client.serverName);
            this.Position(lx.GetDimensions().width/2, lx.GetDimensions().height-20);
        })
        .Alignment('center')
        .Show();


    //Set innerHTML

    view.dom.innerHTML =
        '<div id="sceneWindow" class="box" style="text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 180px; height: auto; padding-bottom: 10px;">' +
            '<form>' +
                '<p class="info" style="font-size: 14px;">Username</p>' +
                '<input id="windowName" autocomplete="username" maxlength="16" type="text" style="width: 95%;"></input><br>' +
                '<p class="info" style="font-size: 14px;">Password</p>' +
                '<input id="windowPassword" autocomplete="current-password" type="password" style="width: 95%;"></input>' +
            '</form>' +
            '<p id="windowErrorText" style="margin: 6px; height: 18px; color: #ff4d4d; font-size: 11px;"></p>' +
            '<button id="windowLogin">Login</button>' +
            '<button id="windowRegister">Register</button>' +
        '</div>';

    //Add login submission event

    document.getElementById('windowLogin').addEventListener('click', function() {
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

        //Handle login package

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
                case 'banned':
                    document.getElementById('windowErrorText').innerHTML = 'You have been banned';
                    break;
            }
        });
    });

    //Add register event

    document.getElementById('windowRegister').addEventListener('click', function() {
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

        //Handle register package

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
    });

    //Focus username textbox

    document.getElementById('windowName').focus();
});
