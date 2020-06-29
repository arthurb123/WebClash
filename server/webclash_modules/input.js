//Input module for WebClash

exports.filterText = function(text)
{
    //Cycle through all censored words

    censored.forEach(function(word)
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

exports.handleCommand = function(text, channel)
{
    try
    {
        //Check if client has permissions if
        //command originated from a client

        let isAdmin = (channel == undefined);

        if (channel != undefined &&
            permissions.admins.indexOf(channel.name) !== -1) 
            isAdmin = true;

        //Split the '/' character if
        //necessary

        let command;

        if (text.indexOf('/') !== -1)
            if (text.indexOf(' ') === -1)
                command = text.substr(1, text.length);
            else
                command = text.substr(1, text.indexOf(' ')-1);
        else
            if (text.indexOf(' ') === -1)
                command = text;
            else
                command = text.substr(0, text.indexOf(' '));

        //Filter out argument(s)

        let args = [];

        let sp = text.indexOf(' ');
        if (sp !== -1) {
            let wt = text.substr(sp+1, text.length-sp);

            args = wt.split(' ');
        }

        //Shorten channel name

        let p;
        
        if (channel != undefined)
            p = channel.name;

        //Check if help command

        if (command === 'help') {
            //Check if origin is game client or server

            //Game client

            if (channel != undefined) {
                //Check if admin and handle
                //acordingly

                if (isAdmin) {
                    server.syncChatMessage(commandsUser, channel);
                    server.syncChatMessage(commandsAdmin, channel);
                }
                else
                    server.syncChatMessage(commandsUser, channel);
            }

            //Server

            else
                output.give(commandsAdmin + '\nNote that some commands are not supported on the server-side.', true);

            return 'success';
        }

        //Check which command applies
        //based on the privileges

        //User commands

        switch (command)
        {
            //Party command
            case 'p':
            case 'party':
                if (channel == undefined)
                    return 'wrong';

                if (args.length === 0)
                    return 'wrong';
                
                if (!parties.sendPartyMessage(
                    p, '<b>' + p + '</b>: ' + this.filterText(args.join(' '))
                ))
                    server.syncChatMessage('You are not in a party.', channel);

                return 'success';
            //Invite to party command
            case 'invite':
                if (channel == undefined)
                    return 'wrong';

                if (args.length === 0)
                    return 'wrong';

                parties.invitePlayer(p, args[0]);

                return 'success';
        }
        
        //Admin commands

        if (isAdmin) {
            switch (command) {
                //OP command
                case 'op':
                    if (args.length == 0)
                        return 'wrong';

                    for (let i = 0; i < permissions.admins.length; i++)
                        if (permissions.admins[i] === args[0])
                            return 'success';

                    permissions.admins.push(args[0]);
                    game.savePermissions();

                    output.give('Opped \'' + args[0] + '\'.');

                    return 'success';
                //DEOP command
                case 'deop':
                    if (args.length == 0)
                        return 'wrong';

                    let a_id = permissions.admins.indexOf(args[0]);
                    if (a_id != -1) {
                        permissions.admins.splice(a_id, 1);

                        output.give('Deopped \'' + args[0] + '\'.');

                        game.savePermissions();
                    }

                    return 'success';
                //Ban command
                case 'ban':
                    if (args.length == 0)
                        return 'wrong';

                    for (let i = 0; i < permissions.banned.length; i++)
                        if (permissions.banned[i] == args[0])
                            return 'success';

                    permissions.banned.push(args[0]);
                    game.savePermissions();

                    game.disconnectPlayer(args[0], true);

                    output.give('Banned \'' + args[0] + '\'.');

                    return 'success';
                //Unban command
                case 'unban':
                    if (args.length == 0)
                        return 'wrong';

                    let b_id = permissions.banned.indexOf(args[0]);
                    if (b_id != -1) {
                        permissions.banned.splice(b_id, 1);

                        output.give('Unbanned \'' + args[0] + '\'.');

                        game.savePermissions();
                    }

                    return 'success';
                //Kill command
                case 'kill':
                    if (args.length == 0)
                        return 'wrong';

                    if (game.players[args[0]])
                        game.killPlayer(args[0], p);
                    else
                        server.syncChatMessage('Player \'' + args[0] + '\' is not available.', channel);

                    return 'success';
                //Show map list command
                case 'showmaps':
                    let msg = 'Available maps:<br>';

                    tiled.maps.forEach(function(map) {
                        msg += '> ' + map.name + '<br>';
                    });

                    if (channel != undefined)
                        server.syncChatMessage(msg, channel);
                    else
                        output.give(msg, true);

                    return 'success';
                //Load map command, requires map name
                case 'loadmap':
                    if (args.length == 0 ||
                        channel == undefined)
                        return 'wrong';

                    game.loadMap(channel, args[0]);

                    return 'success';
                //Load map for player command, requires
                //player name and map name
                case 'sendmap':
                    if (args.length < 2)
                        return 'wrong';

                    let s = server.getChannelWithName(args[0]);
                    if (s !== undefined)
                        game.loadMap(s, args[1]);
                    else
                        server.syncChatMessage('Player \'' + args[0] + '\' is not available.', channel);

                    return 'success';
                //Spawn NPC command
                case 'spawnnpc':
                    if (args.length < 2 ||
                        channel == undefined)
                        return 'wrong';

                    let count = 1;
                    let profile = parseInt(args[1]);

                    if (args.length == 3)
                        count = parseInt(args[2]);

                    let pos = {
                        x: game.players[p].pos.X+game.players[p].character.width/2,
                        y: game.players[p].pos.Y+game.players[p].character.height,
                    };

                    for (let i = 0; i < count; i++)
                        npcs.createEventNPC(
                            game.players[p].map_id,
                            args[0],
                            profile,
                            pos.x,
                            pos.y,
                            undefined,
                            false
                        );

                    return 'success';
                //Set health command
                case 'heal':
                    if (channel == undefined)
                        return 'wrong';

                    game.players[p].health.cur = game.players[p].health.max;
                    server.syncPlayerPartially(p, 'health');

                    game.deltaManaPlayer(p, game.players[p].mana.max);

                    return 'success';
                case 'levelup':
                    if (channel == undefined)
                        return 'wrong';

                    let amount = exptable[game.players[p].level-1]-game.players[p].stats.exp;

                    game.deltaExperiencePlayer(p, amount);

                    return 'success';
                //Give item command
                case 'giveitem':
                    if (channel == undefined)
                        return 'wrong';

                    let item = '';

                    for (let i = 0; i < args.length; i++)
                    {
                        if (i > 0)
                            item += ' ';

                        item += args[i];
                    }

                    items.addPlayerItem(p, item);

                    return 'success';
                //Give currency command
                case 'givecurrency':
                    if (args.length < 1 ||
                        channel == undefined)
                        return 'wrong';

                    game.deltaCurrencyPlayer(p, parseInt(args[0]));

                    return 'success';
                //Give status effect command
                case 'giveeffect':
                    if (args.length < 1 ||
                        channel == undefined)
                        return 'wrong';

                    status.givePlayerStatusEffect(p, channel.name, args[0]);

                    return 'success';
                //Set player variable command
                case 'setvariable':
                    if (args.length < 2             ||
                        channel == undefined        ||
                        typeof args[0] !== 'string')
                        return 'wrong';

                    //Parse the value to a boolean

                    let val = args[1];
                    if (val === 'true' || val === 'false')
                        val = (val === 'true');
                    else {
                        server.syncChatMessage('Variable value should be \'true\' or \'false\'.', channel);
                        return;
                    }

                    //Set the variable value
                    
                    game.setPlayerGlobalVariable(p, args[0], val);
                    server.syncChatMessage('Set the variable \'' + args[0] + '\' to ' + val + '.', channel);

                    return 'success';
                //Change character command
                case 'setcharacter':
                    if (args.length < 1 ||
                        channel == undefined)
                        return 'wrong';

                    let char = args[0];

                    if (game.characters[char] == undefined)
                        return;

                    game.players[p].char_name = char;
                    game.players[p].character = game.characters[game.players[p].char_name];

                    server.syncPlayerPartially(p, 'character', channel, false);
                    server.syncPlayerPartially(p, 'character');

                    return 'success';
                //Change game time command
                case 'settime':
                    if (args.length < 1)
                        return 'wrong';
                    
                    let time = args[0];

                    switch(time) {
                        case 'day':
                            time = 0;
                            break;
                        case 'night':
                            time = gameplay.dayLength;
                            break;
                        default:
                            time = parseInt(time);
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
    }
    catch (err)
    {
        output.giveError('Could not handle command: ', err);
    }

    //Return invalid in case of no found command

    return 'invalid';
}
