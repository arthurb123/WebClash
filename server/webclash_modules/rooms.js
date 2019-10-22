const gameRooms = {};

exports.get = function(room) {
    //Get the (game)room

    if (gameRooms[room] == undefined)
        return {};

    return gameRooms[room];
};

exports.join = function(room, channel) {
    //Check if room exists

    if (gameRooms[room] == undefined)
        gameRooms[room] = {};

    //Add to (game)room

    gameRooms[room][channel.name] = channel;

    //Let channel join room

    channel.join(room);
};

exports.leave = function(channel) {
    //Check if in room

    if (channel._roomId == undefined)
        return;

    //Remove from (game)room

    delete gameRooms[channel._roomId][channel.name];

    //Let channel leave room

    channel.leave();
};