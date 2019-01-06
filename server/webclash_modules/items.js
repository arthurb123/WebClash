//Items module for WebClash Server

const fs = require('fs');

exports.collection = [];

exports.getItem = function(name)
{
    let id = this.getItemIndex(name);
    if (id == -1)
        return;
    
    return this.collection[id];
};

exports.getItemIndex = function(name)
{
    for (let i = 0; i < this.collection.length; i++)
        if (this.collection[i].name == name)
            return i;
    
    return -1;
};


exports.loadAllItems = function(cb)
{
    let location = 'items';
    
    fs.readdir(location, (err, files) => {
        let count = 0;
        
        files.forEach(file => {
            let item = items.loadItem(location + '/' + file);
            item.name = file.substr(0, file.lastIndexOf('.'));
            
            items.collection.push(item);
            
            count++;
        });
        
        output.give('Loaded ' + count + ' item(s).');
        
        if (cb !== undefined)
            cb();
    });
};

exports.loadItem = function(location)
{
    try {
        return JSON.parse(fs.readFileSync(location, 'utf-8'));
    }
    catch (err)
    {
        output.give(err);
    }
};
