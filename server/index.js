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
global.tiled = require('./webclash_modules/tiled');
global.output = require('./webclash_modules/output');
global.input = require('./webclash_modules/input');
global.storage = require('./webclash_modules/storage');

//(Setup/load) Server settings

global.properties = JSON.parse(fs.readFileSync('properties.json', 'utf-8'));
global.permissions = JSON.parse(fs.readFileSync('permissions.json', 'utf-8'));

game.loadAllCharacters(function() {
    actions.loadAllActions(function() {
        items.loadAllItems(function() {
            tiled.loadAllMaps(function() {
                startServer();
            });
        });
    });
});

//Setup Express

app.use(express.static(path.resolve(__dirname +  "/../client/")));

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

function exitHandler() {
    //Output
    
    output.give('Shutting down server..');
    
    //Save all players
    
    game.players.forEach(function(player) {
        game.savePlayer(player.name, player); 
    });
}

//On close event listeners

process.on('exit', exitHandler.bind(null, {cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGTERM', exitHandler.bind(null, {exit: true}));