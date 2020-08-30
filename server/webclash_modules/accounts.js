//Accounts module for WebClash

const loginTimeout = {
    maxAttempts: properties.maxLoginAttempts,
    duration: properties.loginTimeout,

    attempts: {},
    timedout: {},

    addAttempt: function(name) {
        if (this.maxAttempts <= 0)
            return true;

        if (this.timedout[name] != undefined)
            return false;

        if (this.attempts[name] != undefined) {
            if (this.attempts[name] >= this.maxAttempts) {
                this.timeout(name);
                return false;
            }
        }
        else
            this.attempts[name] = 0;

        this.attempts[name]++;

        return true;
    },
    timeout: function(name) {
        delete this.attempts[name];
        this.timedout[name] = 0;
    },
    clearTimeout: function(name) {
        delete this.attempts[name];
        delete this.timedout[name];
    },
    update: function() {
        for (let p in this.timedout) {
            this.timedout[p]++;

            if (this.timedout[p] >= this.duration)
                this.clearTimeout(p);
        }
    }
};
setInterval(loginTimeout.update, 1000*60);

exports.login = function(channel, username, password) {
    try {
        //Check if username is valid

        if (!username.match("^[a-zA-Z0-9]*$")) {
            channel.emit('CLIENT_LOGIN_RESPONSE', 'invalid');
            return;
        }

        //Check if timed out

        if (loginTimeout.timedout[username] != undefined) {
            channel.emit('CLIENT_LOGIN_RESPONSE', 'timedout');
            return;
        }

        //Grab entry with username

        storage.load('accounts', username, function(player) {
            if (player === undefined)
            {
                channel.emit('CLIENT_LOGIN_RESPONSE', 'wrong');
                return;
            }

            //Check if password matches

            {
                //Grab password or salted password,
                //if available

                let pswd = password;
                if (player.salt != undefined)
                    pswd = sha256(password + player.salt);

                if (pswd !== player.pass)
                {
                    if (!loginTimeout.addAttempt(username))
                        channel.emit('CLIENT_LOGIN_RESPONSE', 'timedout');
                    else
                        channel.emit('CLIENT_LOGIN_RESPONSE', 'wrong');

                    return;
                }
            }

            //Check if there is place available

            if (properties.maxPlayers != 0 &&
                game.playerCount >= properties.maxPlayers)
            {
                channel.emit('CLIENT_LOGIN_RESPONSE', 'full');
                return;
            }

            //Check if banned

            if (permissions.banned.indexOf(username) != -1)
            {
                channel.emit('CLIENT_LOGIN_RESPONSE', 'banned');
                return;
            }

            //Check if already logged in

            if (game.players[username] != undefined)
            {
                //If so, log other person out and login
                //This can also be blocked using
                //channel.emit('CLIENT_LOGIN_RESPONSE', 'loggedin');
                //However this is necessary to protect against
                //account blocking when in-combat and logging out.

                game.disconnectPlayer(username, false);

                //Output

                output.give('User \'' + username + '\' has relogged.');
            }
            else
            {
                //Output

                output.give('User \'' + username + '\' has logged in.');
            }

            //Clear timeout

            loginTimeout.clearTimeout(username);

            //Set variables

            channel.name = username;

            //Request the respective page,
            //based on if the account has
            //created a character

            if (player.created)
                channel.emit('REQUEST_GAME');
            else
                channel.emit('REQUEST_CREATION', game.getPlayerCharacters());
        });
    }
    catch (err) {
        output.giveError('Could not handle login: ', err);
        channel.emit('CLIENT_LOGIN_RESPONSE', 'error');
    }
};

exports.register = function(channel, username, password) {
    try {
        //Check profanity and illegal characters

        if (input.filterText(username).indexOf('*') != -1 ||
            !username.match("^[a-zA-Z0-9]*$"))
        {
            channel.emit('CLIENT_REGISTER_RESPONSE', 'invalid');
            return;
        }

        //Check if account already exists

        storage.exists('accounts', username, function(exists) {
            if (exists)
            {
                channel.emit('CLIENT_REGISTER_RESPONSE', 'taken');
                return;
            }

            //Check if there is place available

            if (properties.maxPlayers != 0 &&
                game.playerCount >= properties.maxPlayers)
            {
                channel.emit('CLIENT_REGISTER_RESPONSE', 'full');
                return;
            }

            //Create salt

            const salt = crand(160, 36);

            //Insert account

            storage.save(
                'accounts',
                username,
                {
                    pass: sha256(password + salt),
                    salt: salt,
                    created: false,
                    settings: {
                        audio: {
                            main: 50,
                            music: 50,
                            sound: 50
                        }
                    }
                }, 
                function() {
                    //Create bank

                    storage.save('banks', username, {});

                    //Insert and save default stats

                    game.savePlayer(username, undefined, function() {
                        //Give output

                        output.give('New user \'' + username + '\' created.');

                        //Set variables

                        channel.name = username;

                        //Request character creation page

                        channel.emit('REQUEST_CREATION', game.getPlayerCharacters());
                    });
                }
            );
        });
    }
    catch (err) {
        output.giveError('Could not handle registration: ', err);
        channel.emit('CLIENT_REGISTER_RESPONSE', 'error');
    }
};