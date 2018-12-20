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
        if (!fs.existsSync(name))
            return;

        this.maps.push(JSON.parse(fs.readFileSync(name, 'utf-8')));
    }
    catch(err)
    {
        output.give(err);
        
        return;
    }
};