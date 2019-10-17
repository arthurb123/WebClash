const landingScene = new lx.Scene(function() {
    //Landing page (Lynx2D) code goes here

    //Change the background color

    lx.Background('#b4c8e8');

    //Add a title logo

    let logo_sprite = new lx.Sprite('res/ui/title.png');

    lx.OnLayerDraw(0, function() {
        lx.DrawSprite(
            logo_sprite,
            lx.GetDimensions().width/2-logo_sprite.Size().W/2,
            lx.GetDimensions().height*.175-logo_sprite.Size().H/2
        );
    });

    //Add a server name text and
    //add a loop thats keeps updating
    //the text in case of new package

    new lx.UIText('Connected to -', lx.GetDimensions().width/2, lx.GetDimensions().height-20, 11, '#3d3d3d')
        .Loops(function() {
            this.Text('Connected to ' + client.serverName);
            this.Position(lx.GetDimensions().width/2, lx.GetDimensions().height-20);
        })
        .Alignment('center')
        .Show();

    //Create a login/register box
    //using an UIBox

    let box = new UIBox(undefined, 'sceneWindow', lx.GetDimensions().width/2-96, lx.GetDimensions().height/2-72, 180, 144);
    box.setTextAlign('center');
    box.setMovable(false);
    box.setResizable(false);
    box.saves = false;

    box.setContent(
        '<form>' +
            '<p class="info" style="font-size: 14px;">Username</p>' +
            '<input id="windowName" autocomplete="username" maxlength="16" type="text" style="width: 95%;"></input><br>' +
            '<p class="info" style="font-size: 14px;">Password</p>' +
            '<input id="windowPassword" autocomplete="current-password" type="password" style="width: 95%;"></input>' +
        '</form>' +
        '<br>' +
        '<button id="windowLogin">Login</button>' +
        '<button id="windowRegister">Register</button>'
    );

    //Setup a output function that shows
    //and hides the login/register box
    //before and after every output

    const giveMessage = function(content) {
        box.hide();

        //Use an OK dialog

        ui.dialogs.ok(content, function() {
            box.show();
        });
    };

    //Add login submission event

    document.getElementById('windowLogin').addEventListener('click', function() {
        let name = document.getElementById('windowName').value,
            pass = document.getElementById('windowPassword').value;

        if (name.length == 0)
        {
            giveMessage('Enter a valid username');
            return;
        }
        if (pass.length == 0)
        {
            giveMessage('Enter a valid password');
            return;
        }

        //Send and handle login package

        channel.emit('CLIENT_LOGIN', { name: name, pass: pass.hashCode() });

        channel.on('CLIENT_LOGIN_RESPONSE', function(data) {
            switch (data)
            {
                case 'none':
                case 'wrong':
                    giveMessage('Wrong username or password');
                    break;
                case 'full':
                    giveMessage('The server is full');
                    break;
                case 'loggedin':
                    giveMessage('You are already logged in');
                    break;
                case 'banned':
                    giveMessage('You have been banned');
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
            giveMessage('Enter a valid username');
            return;
        }
        if (pass.length == 0)
        {
            giveMessage('Enter a valid password');
            return;
        }

        //Send and handle register package

        channel.emit('CLIENT_REGISTER', { name: name, pass: pass.hashCode() });

        channel.on('CLIENT_REGISTER_RESPONSE', function(data) {
            switch (data)
            {
                case 'invalid':
                    giveMessage('Username not allowed');
                    break;
                case 'taken':
                    giveMessage('Username has been taken');
                    break;
                case 'full':
                    giveMessage('The server is full');
                    break;
            }
        });
    });

    //Focus username textbox

    document.getElementById('windowName').focus();
});
