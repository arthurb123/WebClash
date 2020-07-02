//Load the WebClash output module, this
//module is necessary for safe require

global.output = require('./webclash_modules/output');

//Safe module require method

const safeRequire = (name) => {
    try 
    {
        return require(name);
    }
    catch (err) 
    {
        output.give('Could not load node module "' + name + '"!');
        output.give('Try installing the dependencies by running install_dependencies.bat or running \'npm install package.json\' in the console.');
        output.give('Completed shut down procedure.');
        process.exit();
    }
};

//Safely load NodeJS Modules

const geckos   = safeRequire('@geckos.io/server').default,
      express  = safeRequire('express'),
      app      = express(),
      http     = safeRequire('http').Server(app),
      path     = safeRequire('path'),
      readline = safeRequire('readline');
    
global.fs       = safeRequire('fs');
global.deepcopy = safeRequire('deepcopy');

//Load server settings

global.properties   = JSON.parse(fs.readFileSync('properties.json', 'utf-8'));
global.permissions  = JSON.parse(fs.readFileSync('permissions.json', 'utf-8'));
global.censored     = JSON.parse(fs.readFileSync('censored.json', 'utf-8'));
global.exptable     = JSON.parse(fs.readFileSync('exptable.json', 'utf-8'));
global.gameplay     = JSON.parse(fs.readFileSync('gameplay.json', 'utf-8'));

//Load commands text files

global.commandsAdmin = fs.readFileSync('commandsAdmin.txt', 'utf-8').toString();
global.commandsUser  = fs.readFileSync('commandsUser.txt', 'utf-8').toString();

//Convert game time to usable format

gameplay.dayLength   *= 60;
gameplay.nightLength *= 60;

//Load WebClash modules

global.server   = require('./webclash_modules/server');
global.game     = require('./webclash_modules/game');
global.rooms    = require('./webclash_modules/rooms');
global.parties  = require('./webclash_modules/parties');
global.banks    = require('./webclash_modules/banks');
global.dialog   = require('./webclash_modules/dialog');
global.items    = require('./webclash_modules/items');
global.shop     = require('./webclash_modules/shop');
global.npcs     = require('./webclash_modules/npcs');
global.actions  = require('./webclash_modules/actions');
global.quests   = require('./webclash_modules/quests');
global.status   = require('./webclash_modules/status');
global.tiled    = require('./webclash_modules/tiled');
global.logger   = require('./webclash_modules/logger');
global.input    = require('./webclash_modules/input');
global.storage  = require('./webclash_modules/storage');
global.tools    = require('./webclash_modules/tools');
global.plugins  = require('./webclash_modules/plugins');

//Load and setup geckos.io

global.io = geckos({
    cors: properties.accessAddress !== '' ? { origin: properties.accessAddress } : undefined
});
io.addServer(http);

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

//Check properties function

function checkProperties(cb) {
    //Check if player characters are present

    if (properties.playerCharacters.length === 0) {
        output.give('No player characters available.');

        process.exit();
    }

    for (let p = 0; p < properties.playerCharacters.length; p++)
        if (game.characters[properties.playerCharacters[p]] == undefined)
        {
            output.give('Player character \'' + properties.playerCharacters[p] + '\' could not be found!');

            process.exit();
        }

    //Check if starting map is present

    if (tiled.getMapIndex(properties.startingMap) === -1)
    {
        output.give('Starting map could not be found!');

        process.exit();
    }

    //Check if the client location is valid

    let clientLocation = __dirname + '/' + properties.clientLocation;
    if (!fs.existsSync(clientLocation))
    {   
        output.give('The client location \'' + clientLocation + '\' is invalid!');

        process.exit();
    }

    //Callback

    cb();
}

//Start server function

function startServer() {
    //Setup Express

    app.use('/', express.static(path.resolve(__dirname + '/' + properties.clientLocation)));
    app.get('/map/:request_id', tiled.requestMap);

    //Setup channel interaction

    io.onConnection(server.handleChannel);

    //Listen on specified port

    http.listen(properties.port, function(){
        output.give('Server is running on *:' + properties.port);
    });

    //Start game loop

    game.startLoop();
}

//Load all game data, and if successful start server

game.loadAllCharacters(function() {
    status.loadAllStatusEffects(function() {
        actions.loadAllActions(function() {
            items.loadAllItems(function() {
                quests.loadAllQuests(function() {
                    tiled.loadAllMaps(function() {
                        //First check if the properties are valid

                        checkProperties(function() {
                            //Load plugins

                            plugins.load();

                            //Start server

                            startServer();
                        });
                    });
                });
            });
        });
    });
});

//Exit handler

let hasSaved = false;
global.exitHandler = function() {
    //Check if exit handler has already been executed

    if (hasSaved) {
        output.give('Completed shut down procedure.');

        return;
    }

    //Output

    output.give('Shutting down server..');

    //Check if there are players that need to be saved

    if (game.playerCount === 0) {
        hasSaved = true;

        process.exit();
    }

    //Save log

    logger.save(function() {
        //Save all players

        game.saveAllPlayers(function() {
            hasSaved = true;

            process.exit();
        });
    });
}

//On close event listeners

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('uncaughtException', function(err) {
    output.giveError('Server crashed: ', err);
    exitHandler();
});
