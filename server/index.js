//NodeJS Modules

const fs = require('fs'),
      express = require('express'),
      app = express(),
      http = require('http').Server(app),
      path = require('path'),
      loki = require('lokijs');

global.io = require('socket.io')(http);

//Unique Modules

global.server = require('./webclash_modules/server');
global.game = require('./webclash_modules/game');
global.output = require('./webclash_modules/output');

//Server Database (Loki)

global.db = new loki('database.json');
db.autoload = true;

//Server Properties

global.properties = JSON.parse(fs.readFileSync('properties.json', 'utf-8'));
global.databases = {
    accounts: db.addCollection('accounts'),
    stats: db.addCollection('stats')
};

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
    
    db.saveDatabase();
}

//On close event listeners

process.on('exit', exitHandler.bind(null, {cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));