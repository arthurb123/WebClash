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

        //Get player

        let p = game.getPlayerIndex(socket.name);

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
                    if (permissions.admins[i] === arguments[0])
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
            //Spawn NPC command
            case 'spawnnpc':
                if (arguments.length < 1)
                    return 'wrong';

                let count = 1;

                if (arguments.length == 2)
                    count = parseInt(arguments[1]);

                let pos = {
                    x: game.players[p].pos.X+game.players[p].character.width/2,
                    y: game.players[p].pos.Y+game.players[p].character.height,
                };

                for (let i = 0; i < count; i++)
                    npcs.createEventNPC(
                        game.players[p].map_id,
                        arguments[0],
                        pos.x,
                        pos.y,
                        undefined,
                        false
                    );

                return 'success';
            //Set health command
            case 'heal':
                game.players[p].health.cur = game.players[p].health.max;

                server.syncPlayerPartially(p, 'health');

                return 'success';
            case 'levelup':
                let amount = exptable[game.players[p].level-1]-game.players[p].stats.exp;

                game.addPlayerExperience(p, amount);

                return 'success';
            //Give item command
            case 'giveitem':
                let item = '';

                for (let i = 0; i < arguments.length; i++)
                {
                    if (i > 0)
                        item += ' ';

                    item += arguments[i];
                }

                items.addPlayerItem(game.players[p].socket, p, item);

                return 'success';
            //Give gold command
            case 'givegold':
                if (arguments.length < 1)
                    return 'wrong';

                game.deltaGoldPlayer(p, parseInt(arguments[0]));

                return 'success';
            //Change character command
            case 'setcharacter':
                if (arguments.length < 1)
                    return 'wrong';

                let char = arguments[0];

                if (game.characters[char] == undefined)
                    return;

                game.players[p].char_name = char;
                game.players[p].character = game.characters[game.players[p].char_name];

                server.syncPlayerPartially(p, 'character', game.players[p].socket, false);
                server.syncPlayerPartially(p, 'character');

                return 'success';
            //Change game time command
            case 'settime':
                if (arguments.length < 1)
                    return 'wrong';
                
                let time = arguments[0];

                if (isNaN(time)) 
                    switch(time) {
                        case 'day':
                            time = 0;
                            break;
                        case 'night':
                            time = gameTime.dayLength;
                            break;
                    }

                game.time.current = time;
                server.syncGameTime();

                return 'success';
            //Shutdown command
            case 'shutdown':
                exitHandler();

                return 'success';
        }
    }
    catch (err)
    {
        output.giveError('Could not handle command: ', err);
    }

    //Return invalid in case of no found command

    return 'invalid';
}
