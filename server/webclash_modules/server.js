exports.handleSocket = function(socket)
{
    //If the connected socket is not playing,
    //send to the landing page (login)
    
    if (socket.playing == undefined || !socket.playing)
        socket.emit('REQUEST_LANDING_PAGE');
    
    //Send client name
    
    socket.emit('UPDATE_CLIENT_NAME', properties.clientName);
    
    //Socket event listeners
    
    socket.on('CLIENT_LOGIN', function(data, callback) {
        //Grab entry with username
        
        let user = databases.accounts.findOne({ name: data.name });
        
        //Check if username exists
        
        if (user === null)
        {
            callback('none');
            return;
        }
        
        //Check if password matches
        
        if (user.pass != data.pass)
        {
            callback('wrong');
            return;
        }
        
        //Output
        
        output.give('User \'' + data.name + '\' has logged in.');
        
        //Callback
        
        callback();
    });
    
    socket.on('CLIENT_REGISTER', function(data, callback) {
        //Check if username has been taken
        
        if (databases.accounts.findOne({ name: data.name }) != null)
        {
            callback('taken');
            return;
        }
        
        //Insert account
        
        databases.accounts.insert({
            name: data.name,
            pass: data.pass
        });
        
        //Save database
        
        db.saveDatabase();
        
        //Ouput
        
        output.give('New user \'' + data.name + '\' created.');
        
        //Callback
        
        callback();
    });
};