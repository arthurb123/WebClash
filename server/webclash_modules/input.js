//Input module for WebClash

const fs = require('fs');

exports.filterText = function(text)
{
    //Cycle through all censored words
    
    permissions.censoredWords.forEach(function(word) 
    {
        //While a word persists in the text, replace it
        //with the '*' character
        
        while (text.toLowerCase().indexOf(word) != -1) 
        {
            let sp = text.toLowerCase().indexOf(word);
            
            let replacement = '';
            for (let i = 0; i < word.length; i++)
                replacement += '*';
            
            text = text.substr(0, sp) + replacement + text.substr(sp + replacement.length);
        }
    });
    
    //Return filtered text
    
    return text;
}

exports.handleCommand = function(socket, text)
{
    try 
    {
        //Check if client has permissions
        
        if (permissions.admins.indexOf(socket.name) == -1)
            return 'success';
        
        //Split the '/' character
        
        let command = '';
        
        if (text.indexOf(' ') == -1) 
            command = text.substr(1, text.length);
        else
            command = text.substr(1, text.indexOf(' ')-1);

        //Filter out argument(s)
        
        let arguments = [];

        let sp = text.indexOf(' ');
        if (sp != -1) {
            let wt = text.substr(sp+1, text.length-sp);
            
            arguments = wt.split(' ');
        }

        //Check which command applies
        
        switch (command)
        {
            //Help command
            case 'help':
                fs.readFile('commands.txt', 'utf8', function(err, data) {
                    if (err) throw err;
                    socket.emit('GAME_CHAT_UPDATE', data);
                });
                
                return 'success';
            //OP command
            case 'op':
                if (arguments.length == 0)
                    return 'wrong';
                
                for (let i = 0; i < permissions.admins.length; i++)
                    if (permissions.admins[i] == arguments[0])
                        return 'success';
                
                permissions.admins.push(arguments[0]);
                game.savePermissions();
                
                return 'success';
            //DEOP command
            case 'deop':
                if (arguments.length == 0)
                    return 'wrong';
                
                let a_id = permissions.admins.indexOf(arguments[0]);
                if (a_id != -1) {
                    permissions.admins.splice(a_id, 1);
                    
                    game.savePermissions();
                }
                
                return 'success';
            //Ban command
            case 'ban':
                if (arguments.length == 0)
                    return 'wrong';
                
                for (let i = 0; i < permissions.banned.length; i++)
                    if (permissions.banned[i] == arguments[0])
                        return 'success';
                
                permissions.banned.push(arguments[0]);
                game.savePermissions();
                
                return 'success';
            //Unban command
            case 'unban':
                if (arguments.length == 0)
                    return 'wrong';
                
                let b_id = permissions.banned.indexOf(arguments[0]);
                if (b_id != -1) {
                    permissions.banned.splice(b_id, 1);
                    
                    game.savePermissions();
                }
                
                return 'success';
            //Show map list command
            case 'showmaps':
                let msg = 'Available maps:<br>';
                
                tiled.maps.forEach(function(map) {
                    msg += '> ' + map.name + '<br>';
                });
                
                socket.emit('GAME_CHAT_UPDATE', msg);
                
                return 'success';
            //Load map command, requires map name
            case 'loadmap':
                if (arguments.length == 0)
                    return 'wrong';
                
                game.loadMap(socket, arguments[0]);
                
                return 'success';
            //Load map for player command, requires
            //player name and map name
            case 'sendmap':
                if (arguments.length < 2)
                    return 'wrong';
                
                let s = server.getSocketWithName(arguments[0]);
                if (s !== undefined)
                    game.loadMap(s, arguments[1]);
                
                return 'success';
        }
    }
    catch (err)
    {
        output.give('Exception while handling command: ' + err);
    }
    
    //Return invalid in case of no found command
    
    return 'invalid';
}