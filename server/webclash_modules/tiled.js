//Tiled import module for WebClash

const fs = require('fs');

exports.maps = [];

exports.loadAllMaps = function() {
    fs.readdir('maps', (err, files) => {
      files.forEach(file => {
          tiled.loadMap(file);
      });
    });
};

exports.loadMap = function(name) {
    try 
    {
        let location = 'maps/' + name;
        
        let map = JSON.parse(fs.readFileSync(location, 'utf-8'))
        map.name = name.substr(0, name.lastIndexOf('.'));
        
        this.maps.push(map);
    }
    catch(err)
    {
        output.give(err);
    }
};

exports.mapWithName = function(name)
{   
    this.maps.forEach(function(map) {
        if (map.name == name)
            return map;
    });
};