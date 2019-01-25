//Items module for WebClash Server

const fs = require('fs');

exports.collection = [];
exports.onMap = [];

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
        if (this.collection[i].name === name)
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
        //Create object
        
        let object = JSON.parse(fs.readFileSync(location, 'utf-8'));
        
        //Create equippable icon if equippable action exists
        
        if (object.equippableAction.length > 0)
        {
            let action = actions.getAction(object.equippableAction);
            
            if (action !== undefined)
                object.equippableActionIcon = action.src;
        }
        //Return object
        
        return object;
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
    
    //Equip if action is available
    
    if (item.equippableAction.length > 0) {
        //Set action at 0 if main
        
        if (equippable === 'main')
            actions.setPlayerAction(socket, item.equippableAction, 0, id);
    }
    
    //Sync to others
    
    server.syncPlayerPartially(id, 'equipment', socket, true);
    
    //Sync to player
    
    server.syncEquipmentItem(equippable, id, socket, false);
    
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

exports.createWorldItem = function(owner, map, x, y, name)
{
    //Get item
    
    let item = this.getItem(name);
    
    //Check if valid
    
    if (item == undefined)
        return;
    
    //Create world item on map
    
    if (this.onMap[map] == undefined)
        this.onMap[map] = [];
    
    let worldItem = {
        name: name,
        pos: {
            X: x,
            Y: y
        },
        size: {
            W: tiled.maps[map].tilewidth,
            H: tiled.maps[map].tileheight
        },
        source: item.source,
        rarity: item.rarity,
        value: item.value
    };
    
    //Add world item to map
    
    let id = this.onMap[map].length;
    
    this.onMap[map].push({
        owner: owner,
        item: worldItem
    });

    //Sync across map
    
    server.syncWorldItem(map, this.onMap[map][id].item);
    
    //Create timer 
    
    //...
};

exports.sendMap = function(map, socket)
{
    //Check if valid
    
    if (this.onMap[map] == undefined ||
        this.onMap[map].length == 0)
        return;
    
    //Send all items in map
    
    for (let i = 0; i < this.onMap[map].length; i++)
        server.syncWorldItem(map, this.onMap[map][i].item, socket, false);
};