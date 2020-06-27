const landingScene = new lx.Scene(function() {
    //Landing page (Lynx2D) code goes here

    //Change the background color

    lx.Background('#b4c8e8');

    //Add a title logo

    new lx.Sprite('res/ui/title.png', (logo_sprite) => {
        lx.OnLayerDraw(0, function() {
            lx.DrawSprite(
                logo_sprite,
                lx.GetDimensions().width/2-logo_sprite.Size().W/2,
                lx.GetDimensions().height*.175-logo_sprite.Size().H/2
            );
        });
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

    let form = document.createElement('form');

    let usernameTitle = document.createElement('p');
    usernameTitle.classList.add('info');
    usernameTitle.style = 'font-size: 14px;';
    usernameTitle.innerHTML = 'Username';
    let username = document.createElement('input');
    username.id = 'windowName';
    username.autocomplete = 'username';
    username.maxLength = '16';
    username.type = 'text';
    username.style = 'width: 95%;';

    let passwordTitle = document.createElement('p');
    passwordTitle.classList.add('info');
    passwordTitle.style = 'font-size: 14px;';
    passwordTitle.innerHTML = 'Password';
    let password = document.createElement('input');
    password.id = 'windowPassword';
    password.autocomplete = 'current-password';
    password.maxLength = '16';
    password.type = 'password';
    password.style = 'width: 95%;';

    let loginButton = document.createElement('button');
    loginButton.innerHTML = 'Login';
    let registerButton = document.createElement('button');
    registerButton.innerHTML = 'Register';

    form.appendChild(usernameTitle);
    form.appendChild(username);
    form.appendChild(document.createElement('br'));
    form.appendChild(passwordTitle);
    form.appendChild(password);

    box.addElement(form);
    box.addElement(document.createElement('br'));
    box.addElement(loginButton);
    box.addElement(registerButton);

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

    loginButton.addEventListener('click', function() {
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

    registerButton.addEventListener('click', function() {
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
