exports.partySize = 6;

exports.collection = {};
exports.nameMap = {};

exports.createParty = function(host_name) {
    //Create party at host name

    this.collection[host_name] = {};

    //Map host name to itself

    this.nameMap[host_name] = host_name;
};

exports.joinParty = function(participant_name) {
    try {
        //Grab the host name

        let host_name = this.nameMap[participant_name];

        if (host_name == undefined)
            return;

        //Check if the party exists and if the
        //participant is indeed an invitee

        if (this.collection[host_name] == undefined ||
            this.collection[host_name][participant_name] !== 'invitee')
            return;

        //Join party at host name

        this.collection[host_name][participant_name] = 'participant';

        //Send notification to all participants (and host)

        for (let key in this.collection[host_name]) {
            if (this.collection[host_name][key] === 'invitee')
                continue;

            if (key === participant_name)
                key = host_name;

            //Send chat message and the new party data

            server.syncChatMessage(participant_name + ' has joined the party.', game.players[key].channel);
        }

        //Send party data to all participants (and host)

        this.updateParty(host_name);
    }
    catch (err) {
        output.giveError('Could not join party: ', err);
    }
};

exports.leaveParty = function(participant_name, reason) {
    try {
        //Map name to get the host name

        let host_name = this.nameMap[participant_name];
        
        if (host_name == undefined)
            return;

        //Check if party exists and if participant
        //is indeed in the party

        if (this.collection[host_name] == undefined)
            return;

        //Check if host owns party and there is only
        //one more member, if so transfer ownership
        //or otherwise disband the party

        let participants = Object.keys(this.collection[host_name]);

        if (participant_name === host_name) {
            let actualParticipants = 0;

            for (let p in participants) 
                if (participants[p] === 'participant')
                    actualParticipants++;

            if (actualParticipants <= 1) {
                //Check if only one or none other
                //participants

                this.disbandParty(host_name);
            }
            else {
                //Otherwise transfer ownership

                for (let p in participants) 
                    if (participants[p] === 'participant') {
                        this.transferPartyHost(p, new_host);

                        break;
                    }
            }

            return;
        }

        //Check if participant is indeed in the party

        if (this.collection[host_name][participant_name] == undefined)
            return;

        //Remove participant from the party

        delete this.collection[host_name][participant_name];

        //Remove participant name mapping

        delete this.nameMap[participant_name];

        //Send reason data to all participants (and host)

        let sendUpdate = false;

        if (reason === 'inparty')
            reason = ' is already in a party.';
        else if (reason === 'declined') {
            reason = ' declined the party invite.';
            sendUpdate = true;
        }
        else if (reason === 'leave') {
            reason = ' has left the party.';
            sendUpdate = true;
        }

        for (let key in this.collection[host_name]) {
            if (this.collection[host_name][key] === 'invitee')
                continue;

            server.syncChatMessage(participant_name + reason, game.players[key].channel);
        }

        server.syncChatMessage(participant_name + reason, game.players[host_name].channel);

        //Send party data to all participants (and host)

        if (sendUpdate)
            this.updateParty(host_name);

        //Check if the party should be disbanded

        if (participants.length-1 <= 0) 
            this.disbandParty(host_name);
    }
    catch (err) {
        output.giveError('Could not leave party: ', err);
    }
};

exports.disbandParty = function(host_name) {
    try {
        let length = Object.keys(this.collection[host_name]).length;

        //Send party disband package to host
        //and all participants

        //Send to all participants

        for (let key in this.collection[host_name]) {
            //Remove name mapping

            delete this.nameMap[key];

            //Send disband package

            game.players[key].channel.emit('GAME_PARTY_DISBAND');

            //If participant, notify

            if (this.collection[host_name][key] === 'invitee')
                continue;

            server.syncChatMessage('The party has been disbanded.', game.players[key].channel);
        }

        //Send party disband package to host

        if (length > 0)
            server.syncChatMessage('The party has been disbanded.', game.players[host_name].channel);

        game.players[host_name].channel.emit('GAME_PARTY_DISBAND');

        //Delete party at host id

        delete this.collection[host_name];

        //Remove host name mapping

        delete this.nameMap[host_name];
    }
    catch(err) {
        output.giveError('Could not disband party: ', err);
    }
};

exports.invitePlayer = function(host_name, invitee_name) {
    try {
        //Check if the host and invitee name is different

        if (host_name === invitee_name)
            return;

        //Check if the invited player is online/exists

        if (game.players[invitee_name] == undefined) {
            server.syncChatMessage(invitee_name + ' is not online.', game.players[host_name].channel);

            return;
        }

        //Check if the player is eligible to invite players
        //(no party yet, or the owner of a party)

        let name = this.nameMap[host_name];

        if (name != undefined && name != host_name) {
            if (this.collection[name][host_name] === 'participant')
                server.syncChatMessage('Only party owners can invite others.', game.players[host_name].channel);
            else
                server.syncChatMessage('You already have a pending invitation.', game.players[host_name].channel);

            return;
        }

        //Check if invitee already is conflicted with collection
        //(having been invited, or the host/member of a party)

        if (this.nameMap[invitee_name] != undefined) {
            let other_host = this.nameMap[invitee_name];

            if (this.collection[other_host] == undefined)
                return;

            //Host or participant of a party

            if (other_host === invitee_name ||
                this.collection[other_host][invitee_name] === 'participant')
                server.syncChatMessage(invitee_name + ' is already in a party.', game.players[host_name].channel);

            //Pending invite

            else if (this.collection[other_host][invitee_name] === 'invitee')
                server.syncChatMessage(invitee_name + ' already has a pending party invitation.', game.players[host_name].channel);

            return;
        }

        //Create party if necessary

        if (this.collection[host_name] == undefined)
            this.createParty(host_name);

        //Also make sure to not exceed the max party size

        else if (Object.keys(this.collection[host_name]).length >= this.partySize) {
            if (game.players[host_name] != undefined)
                server.syncChatMessage('Maximum party size reached.', game.players[host_name].channel);

            return;
        }

        //Add temporary entry to party

        this.collection[host_name][invitee_name] = 'invitee';

        //Add to party name map

        this.nameMap[invitee_name] = host_name;

        if (game.players[invitee_name] != undefined)
            game.players[invitee_name].channel.emit('GAME_PARTY_INVITE', host_name);

        //Send party update package to all
        //participants and host except invitee

        this.updatePartyExcept(host_name, invitee_name);
    }
    catch (err) {
        output.giveError('Could not invite to party: ', err);
    }
};

exports.transferPartyHost = function(host_name, participant_name) {
    try {
        //Transfer party data to participant

        this.collection[participant_name] = this.collection[host_name];

        //Change party name mapping and notify

        for (let key in this.collection[participant_name]) {
            if (this.collection[participant_name][key] === 'invitee')
                continue;

            server.syncChatMessage('Party ownership transferred to ' + participant_name + '.', game.players[key].channel);

            this.nameMap[key] = participant_name;
        }

        //Delete party at host name

        delete this.collection[host_name];

        //Delete name mapping at host name

        delete this.nameMap[host_name];

        //Update

        this.updateParty(participant_name);
    }
    catch (err) {
        output.giveError('Could not transfer party host: ', err);
    }
};

exports.updateParty = function(host_name) {
    //Send to all participants

    for (let key in this.collection[host_name]) {
        if (this.collection[host_name][key] === 'invitee')
            continue;

        game.players[key].channel.emit('GAME_PARTY_UPDATE', {
            host: host_name,
            participants: this.collection[host_name]
        });
    }

    //Send to host

    game.players[host_name].channel.emit('GAME_PARTY_UPDATE', {
        host: host_name,
        participants: this.collection[host_name]
    });
};

exports.updatePartyExcept = function(host_name, participant_name) {
    //Send to all participants and host except

    for (let key in this.collection[host_name]) {
        if (key === participant_name)
            key = host_name;

        if (key !== host_name &&
            this.collection[host_name][key] === 'invitee')
            continue;

        game.players[key].channel.emit('GAME_PARTY_UPDATE', {
            host: host_name,
            participants: this.collection[host_name]
        });
    }
};

exports.inParty = function(name) {
    let host_name = this.nameMap[name];

    if (host_name == undefined)
        return false;

    return (this.collection[host_name][name] === 'participant' || name === host_name);
};

exports.getPartyMembers = function(name) {
    let result = {};

    result[this.nameMap[name]] = 'participant';

    for (let key in this.collection[this.nameMap[name]]) 
        result[key] = this.collection[this.nameMap[name]][key];

    return result;
};

exports.sendPartyMessage = function(name, message) {
    if (this.inParty(name)) {
        let members = this.getPartyMembers(name);

        //Go through all party members

        for (let p in members) {
            if (members[p] === 'invitee')
                continue;

            //Add styling to the message

            message = '<span class="colorParty">' + message + '</span>';

            //Send chat message to party member

            server.syncChatMessage(message, game.players[p].channel);
        }

        return true;
    }

    return false;
};