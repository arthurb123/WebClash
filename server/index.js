//NodeJS Modules

const fs = require('fs'),
      express = require('express'),
      app = express(),
      http = require('http').Server(app),
      path = require('path');

global.io = require('socket.io')(http);

//Unique Modules

global.server = require('./webclash_modules/server');
global.game = require('./webclash_modules/game');
global.items = require('./webclash_modules/items');
global.npcs = require('./webclash_modules/npcs');
global.actions = require('./webclash_modules/actions');
global.quests = require('./webclash_modules/quests');
global.tiled = require('./webclash_modules/tiled');
global.output = require('./webclash_modules/output');
global.input = require('./webclash_modules/input');
global.storage = require('./webclash_modules/storage');

//(Setup/load) Server settings

global.properties = JSON.parse(fs.readFileSync('properties.json', 'utf-8'));
global.permissions = JSON.parse(fs.readFileSync('permissions.json', 'utf-8'));
global.exptable = JSON.parse(fs.readFileSync('exptable.json', 'utf-8'));

//Setup Express

app.use(express.static(path.resolve(__dirname +  "/../client/")));

//Load all game data, and if successful start server

game.loadAllCharacters(function() {
    actions.loadAllActions(function() {
        items.loadAllItems(function() {
            quests.loadAllQuests(function() {
                tiled.loadAllMaps(function() {
                    //First check if the properties are valid

                    checkProperties(function() {
                        //Start server

                        startServer();
                    });
                });
            });
        });
    });
});

//Check properties function

function checkProperties(cb) {
    //Check if player character is present

    if (game.characters[properties.playerCharacter] == undefined)
    {
        output.give('Player character could not be found!');

        return;
    }

    //Check if starting map is present

    if (tiled.getMapIndex(properties.startingMap) === -1)
    {
        output.give('Starting map could not be found!');

        return;
    }

    cb();
}

//Start server function

function startServer() {
    //Listen on specified port

    http.listen(properties.port, function(){
        output.give('WebClash Server is running on *:' + properties.port);
    });

    //Handle socket interaction

    io.on('connection', server.handleSocket);

    //Start game loop

    game.startLoop();
}

//Exit handler

let hasSaved = false;
global.exitHandler = function() {
    //Check if exit handler has already been executed

    if (hasSaved)
        return;

    //Output

    output.give('Shutting down server..');

    //Check if there are players that need to be saved

    if (game.players.length === 0) {
        hasSaved = true;

        process.exit();

        return;
    }

    //Save all players

    game.saveAllPlayers(function() {
        hasSaved = true;

        process.exit();
    });
}

//On close event listeners

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
