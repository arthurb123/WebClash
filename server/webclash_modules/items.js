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

exports.addPlayerItem = function(socket, id, name)
{
    //Check if player has enough space
    
    if (game.players[id].inventory.length >= game.playerConstraints.inventory_size)
        return false;
    
    //Get free slot
    
    let slot = this.getPlayerFreeSlot(id);
    
    //Add item
    
    game.players[id].inventory[slot] = name;
    
    //Sync player item
    
    server.syncInventoryItem(slot, id, socket, false);
    
    return true;
};

exports.hasPlayerItem = function(id, name)
{
    //Check if item with name exists
    
    for (let i = 0; i < game.players[id].inventory.length; i++)
        if (game.players[id].inventory[i] === name)
            return true;

    return false;
};

exports.usePlayerItem = function(socket, id, name)
{
    //Get item
    
    let item = this.getItem(name);
    
    //Check if valid
    
    if (item === undefined)
        return;
    
    //Check if piece of equipment
    
    if (item.equippable !== 'none')
    {
        //Set equipment and if it is not possible return
        
        if (!this.setPlayerEquipment(socket, id, item))
            return;
        
        //Remove player item
        
        this.removePlayerItem(id, name);
    }
    
    //Check if consumable, scroll, etc.
    //...
};

exports.removePlayerItem = function(id, name)
{
    //Remove item from inventory
    
    for (let i = 0; i < game.players[id].inventory.length; i++)
        if (game.players[id].inventory[i] === name) {
            game.players[id].inventory[i] = undefined;
            
            break;
        }
};

exports.setPlayerEquipment = function(socket, id, item)
{
    //Get equippable
    
    let equippable = item.equippable;
    
    //Check if equippable already exists,
    //if so add it to the inventory.
    //If this is not possible return.
    
    if (game.players[id].equipment[equippable] !== undefined)
        if (!this.addPlayerItem(socket, id, game.players[id].equipment[equippable]))
            return false;
    
    //Set equipment equippable of player
    
    game.players[id].equipment[equippable] = item.name;
    
    //Sync to others
    
    server.syncPlayerPartially(id, 'equipment', socket, true);
    
    //Return true
    
    return true;
};

exports.getPlayerFreeSlot = function(id)
{
    //Search for a undefined/non-existing slot
    
    for (let i = 0; i < game.players[id].inventory.length; i++)
        if (game.players[id].inventory[i] == undefined)
            return i;
    
    //Otherwise return the length
    
    return game.players[id].inventory.length;
};