exports.handleSocket = function(socket)
{
    //If the connected socket is not playing,
    //send to the landing page (login)
    
    if (socket.playing == undefined || !socket.playing)
        socket.emit('REQUEST_LANDING');
    
    //Send client name
    
    socket.emit('UPDATE_CLIENT_NAME', properties.clientName);
    
    //Disconnect event listener
    
    socket.on('disconnect', function() {
        if (socket.playing) {
            //Remove player
            
            game.removePlayer(socket);
            
            //Output
            
            output.give('User \'' + socket.name + '\' has logged out.');
        }
    });
    
    //Socket event listeners
    
    socket.on('CLIENT_LOGIN', function(data, callback) {
        //Check if valid package
        
        if (data === undefined || data.name === undefined)
            return;
        
        //Grab entry with username
        
        let pass = databases.accounts(data.name).get('pass', undefined);
        
        //Check if username exists
        
        if (pass === undefined)
        {
            callback('none');
            return;
        }
        
        //Check if password matches
        
        if (pass != data.pass)
        {
            callback('wrong');
            return;
        }
        
        //Check if there is place available
        
        if (properties.maxPlayers != 0 &&
            game.players.length >= properties.maxPlayers)
        {
            callback('full');
            return;
        }
        
        //Check if already logged in
        
        if (game.getPlayerIndex(data.name) != -1)
        {
            callback('loggedin');
            return;
        }
        
        //Output
        
        output.give('User \'' + data.name + '\' has logged in.');
        
        //Set variables
        
        socket.name = data.name;
        
        //Request game page
        
        socket.emit('REQUEST_GAME');
    });
    
    socket.on('CLIENT_REGISTER', function(data, callback) {
        //Check if valid package
        
        if (data === undefined || data.name === undefined)
            return;
        
        //Check profanity
        
        if (input.filterText(data.name).indexOf('*') != -1)
        {
            callback('invalid');
            return;
        }
        
        //Check if account already exists
        
        if (databases.accounts(data.name).has('pass'))
        {
            callback('taken');
            return;
        }
        
        //Check if there is place available
        
        if (properties.maxPlayers != 0 &&
            game.players.length >= properties.maxPlayers)
        {
            callback('full');
            return;
        }
        
        //Insert account
        
        databases.accounts(data.name).set('pass', data.pass);
        
        //Insert default stats
        
        databases.stats(data.name).set('map', 0);
        databases.stats(data.name).set('pos', { X: 0, Y: 0 });
        databases.stats(data.name).set('moving', false);
        databases.stats(data.name).set('direction', 0);
        databases.stats(data.name).set('char_name', 'player');

        //Save databases
        
        databases.accounts.save();
        databases.stats.save();
        
        //Ouput
        
        output.give('New user \'' + data.name + '\' created.');
        
        //Set variables
        
        socket.name = data.name;
        
        //Request game page
        
        socket.emit('REQUEST_GAME');
    });
    
    socket.on('CLIENT_JOIN_GAME', function() {
        //Check if client is already playing
        
        if (socket.playing != undefined && socket.playing)
            return;
        
        //Send standard data

        for (let i = 0; i < game.players.length; i++)
            server.syncPlayer(i, socket, false);
        
        //Add client as player
        
        game.addPlayer(socket);
        
        //Send MOTD message
        
        socket.emit('GAME_CHAT_UPDATE', properties.welcomeMessage);

        //Set playing

        socket.playing = true;
    });
    
    socket.on('CLIENT_PLAYER_UPDATE', function(data) {
        //Check if valid player
        
        if (socket.playing === undefined || !socket.playing)
            return;
        
        //Get player id
        
        let id = game.getPlayerIndex(socket.name);
        
        //Check if valid player id
        
        if (id == -1)
            return;
        
        //Check data
        
        let type = '';
        
        if (data.moving !== undefined) {
            game.players[id].moving = data.moving;
            type = 'moving';
        }
        if (data.direction !== undefined) {
            game.players[id].direction = data.direction;
            type = 'direction';
        }
        if (data.pos !== undefined) {
            game.players[id].pos = data.pos;
            type = 'position';
        }
        
        //Sync across all
        
        if (type.length > 0)
            server.syncPlayerPartially(id, type, socket, true);
    });
    
    socket.on('CLIENT_NEW_CHAT', function(data) {
        //Check if valid player
        
        if (socket.playing === undefined || !socket.playing)
            return;
        
        let msg = '';
        
        //TODO:
        //Check correct length
        //Check if spamming
        
        //Check if command
        
        if (data[0] === '/')
        {
            //Check command and handle output
            
            let output = input.handleCommand(socket, data);
            
            if (output === 'invalid')
                msg = 'This command is invalid.';
            else if (output == 'wrong')
                msg = 'Wrong command syntax.';
            else
                return;
        } 
        else
            msg = socket.name + ': ' + input.filterText(data);
        
        //Send chat message to all other players
        
        io.sockets.emit('GAME_CHAT_UPDATE', msg);
    });
};

//Sync player partially function, if socket is undefined it will be globally emitted

exports.syncPlayerPartially = function(id, type, socket, broadcast)
{
    let data = {
        name: game.players[id].name
    };

    switch (type)
    {
        case 'position':
            data.pos = game.players[id].pos;
            break;
        case 'moving':
            data.moving = game.players[id].moving;
            break;
        case 'direction':
            data.direction = game.players[id].direction;
            break;
        case 'character':
            data.character = game.players[id].character;
            break;
    }
    
    if (socket === undefined) 
        io.sockets.emit('GAME_PLAYER_UPDATE', data);
    else {
        if (broadcast === undefined || !broadcast) {
            if (socket.name == data.name)
                data.isPlayer = true;
            
            socket.emit('GAME_PLAYER_UPDATE', data);
        }
        else
            socket.broadcast.emit('GAME_PLAYER_UPDATE', data);
    }
};

//Sync whole player function, if socket is undefined it will be globally emitted

exports.syncPlayer = function(id, socket, broadcast)
{
    this.syncPlayerPartially(id, 'position', socket, broadcast);
    this.syncPlayerPartially(id, 'moving', socket, broadcast);
    this.syncPlayerPartially(id, 'direction', socket, broadcast);
    this.syncPlayerPartially(id, 'character', socket, broadcast);
};

//Sync player remove function, will be broadcast by default

exports.removePlayer = function(id, socket)
{
    //Check if valid
    
    if (socket === undefined || socket.name === undefined)
        return;
    
    //Broadcast player removal
    
    socket.broadcast.emit('GAME_PLAYER_UPDATE', { name: socket.name, remove: true });
}
