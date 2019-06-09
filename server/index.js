//NodeJS Modules

const fs = require('fs'),
      geckos = require('@geckos.io/server').default,
      express = require('express'),
      app = express(),
      http = require('http').Server(app),
      path = require('path'),
      readline = require('readline');

//Load and setup geckos.io

global.io = geckos();
io.addServer(http);

//Unique Modules

global.server = require('./webclash_modules/server');
global.game = require('./webclash_modules/game');
global.items = require('./webclash_modules/items');
global.shop = require('./webclash_modules/shop');
global.npcs = require('./webclash_modules/npcs');
global.actions = require('./webclash_modules/actions');
global.quests = require('./webclash_modules/quests');
global.tiled = require('./webclash_modules/tiled');
global.output = require('./webclash_modules/output');
global.input = require('./webclash_modules/input');
global.storage = require('./webclash_modules/storage');

//Load server settings

global.properties = JSON.parse(fs.readFileSync('properties.json', 'utf-8'));
global.permissions = JSON.parse(fs.readFileSync('permissions.json', 'utf-8'));
global.censored = JSON.parse(fs.readFileSync('censored.json', 'utf-8'));
global.exptable = JSON.parse(fs.readFileSync('exptable.json', 'utf-8'));
global.gameplay = JSON.parse(fs.readFileSync('gameplay.json', 'utf-8'));

//Setup game time

gameplay.dayLength *= 60;
gameplay.nightLength *= 60;

//Setup readline and setup line input

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (text) => {
    let result = input.handleCommand(text);

    if (result === 'wrong')
        output.give('Wrong syntax or the command is not supported.');
});

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
    //Check if player characters are present

    if (properties.playerCharacters.length === 0) {
        output.give('No player characters available.');

        return;
    }

    for (let p = 0; p < properties.playerCharacters.length; p++)
        if (game.characters[properties.playerCharacters[p]] == undefined)
        {
            output.give('Player character \'' + properties.playerCharacters[p] + '\' could not be found!');

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
    //Setup channel interaction

    io.onConnection(server.handleChannel);

    //Listen on specified port

    http.listen(properties.port, function(){
        output.give('WebClash Server is running on *:' + properties.port);
    });

    //Start game loop

    game.startLoop();
}

//Exit handler

let hasSaved = false;
global.exitHandler = function(code) {
    //Check if exit handler has already been executed

    if (hasSaved) {
        output.give('Completed shut down procedure.');

        return;
    }

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
