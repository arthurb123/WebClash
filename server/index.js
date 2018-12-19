//NodeJS Modules

const fs = require('fs'),
      express = require('express'),
      app = express(),
      http = require('http').Server(app),
      path = require('path'),
      io = require('socket.io')(http),
      loki = require('lokijs');

//Unique Modules

const server = require('./webclash_modules/server');

global.output = require('./webclash_modules/output');

//Server Database (Loki)

global.db = new loki('database.json');
db.autoload = true;

//Server Properties

global.properties = JSON.parse(fs.readFileSync('properties.json', 'utf-8'));
global.databases = {
    accounts: db.addCollection('accounts')
};

//Setup Express

app.use(express.static(path.resolve(__dirname +  "/../client/")));

//Listen on specified port

http.listen(properties.port, function(){
    output.give('WebClash Server is running on *:' + properties.port);
});

//Handle socket interaction

io.on('connection', server.handleSocket);