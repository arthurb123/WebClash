//NodeJS Modules

const fs = require('fs'),
      express = require('express'),
      app = express(),
      http = require('http').Server(app),
      path = require('path'),
      db = require('origindb');

global.io = require('socket.io')(http);

//Unique Modules

global.server = require('./webclash_modules/server');
global.game = require('./webclash_modules/game');
global.tiled = require('./webclash_modules/tiled');
global.output = require('./webclash_modules/output');

//(Setup/load) Server Properties

global.properties = JSON.parse(fs.readFileSync('properties.json', 'utf-8'));

global.databases = {
    accounts: db('data/accounts'),
    stats: db('data/stats')
};

tiled.loadAllMaps();

//Setup Express

app.use(express.static(path.resolve(__dirname +  "/../client/")));

//Listen on specified port

http.listen(properties.port, function(){
    output.give('WebClash Server is running on *:' + properties.port);
});

//Handle socket interaction

io.on('connection', server.handleSocket);

//Exit handler

function exitHandler() {
    //Output
    
    output.give('Shutting down server..');
    
    //Save database
    
    databases.accounts.save();
    databases.stats.save();
}

//On close event listeners

process.on('exit', exitHandler.bind(null, {cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));