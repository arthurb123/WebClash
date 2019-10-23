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

exports.getConvertedItem = function(name)
{
    let item = this.getItem(name);

    if (item == undefined)
        return;

    //Grab the basic item info

    let result = {
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        description: item.description,
        source: item.source,
        value: item.value,
        minLevel: item.minLevel,
        sounds: item.sounds
    };

    //Set necessary properties
    //based on item type

    switch (item.type) {
        case 'consumable':
            result.actionIcon = item.actionIcon;

            result.consumableAction = item.consumableAction;
            result.consumableActionUses = item.consumableActionUses;

            result.heal = item.heal;
            result.mana = item.mana;
            result.gold = item.gold;
            break;
        case 'equipment':
            result.actionIcon = item.actionIcon;

            result.equippable = item.equippable;
            result.equippableAction = item.equippableAction;
            result.equippableSource = item.equippableSource;

            result.stats = item.stats;
            result.scaling = item.scaling;
            break;
        case 'dialog':
            result.dialog = item.dialog;
            result.consumableDialog = item.consumableDialog;
            break;
    };

    return result;
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

            if (item.equippableAction !== '')
                item.scaling = actions.getAction(item.equippableAction).scaling;

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

        //Create action icon if equippable or consumable action exists

        let action;

        if (object.type === 'consumable' &&
            object.consumableAction.length > 0)
            action = actions.getAction(object.consumableAction);

        if (object.type === 'equipment' &&
            object.equippableAction.length > 0)
            action = actions.getAction(object.equippableAction);

        if (action !== undefined)
            object.actionIcon = action.src;

        //Return object

        return object;
    }
    catch (err)
    {
        output.giveError('Could not load item: ', err);
    }
};

exports.addPlayerItem = function(id, name)
{
    //Get free slot

    let slot = this.getPlayerFreeSlot(id);

    //Check if slot is valid

    if (slot == -1)
        return false;

    //Check if item is valid

    let item = this.getItemIndex(name);

    if (item == -1)
        return false;

    //Add item

    game.players[id].inventory[slot] = name;

    //Evaluate item for gather objectives

    quests.evaluateQuestObjective(id, 'gather', name);

    //Sync player item

    server.syncInventoryItem(slot, id, game.players[id].channel);

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

exports.getPlayerItemAmount = function(id, name)
{
    //See how many items player has with name

    let amount = 0;

    for (let i = 0; i < game.players[id].inventory.length; i++)
        if (game.players[id].inventory[i] === name)
            amount++;

    //Return amount

    return amount;
};

exports.usePlayerItem = function(id, name)
{
    //Get item

    let item = this.getItem(name);

    //Check if valid

    if (item === undefined)
        return false;

    //Check if minimal item level matches player level

    if (item.minLevel !== 0 &&
        game.players[id].level < item.minLevel)
        return false;

    //Check if piece of equipment

    if (item.type === 'equipment')
    {
        //Check if the item differs from the equipped item

        if (game.players[id].equipment[item.equippable] !== undefined &&
            game.players[id].equipment[item.equippable] === name)
            return false;

        //Set equipment and if it is not possible return

        if (!this.setPlayerEquipment(id, item))
            return false;

        //Remove player item

        this.removePlayerItem(id, name);
    }

    //Check if consumable

    if (item.type === 'consumable')
    {
        //Delta heal and mana

        game.healPlayer(id, item.heal);
        game.deltaManaPlayer(id, item.mana);

        //Delta gold

        game.deltaGoldPlayer(id, item.gold);

        //Add action

        if (item.consumableAction.length > 0 &&
            !actions.addPlayerAction(item.consumableAction, id, item.consumableActionUses))
            return false;

        //Remove player item

        this.removePlayerItem(id, name);
    }

    //Check if dialog

    if (item.type === 'dialog')
    {
        //Start dialog

        server.syncItemDialog(id, item.name, item.dialog);

        //Consume item if necessary

        if (item.consumableDialog)
            this.removePlayerItem(id, name);
    }

    return true;
};

exports.removePlayerItem = function(id, name)
{
    //Remove item from inventory

    for (let i = 0; i < game.players[id].inventory.length; i++)
        if (game.players[id].inventory[i] === name) {
            //Remove element

            game.players[id].inventory[i] = undefined;

            //Evaluate item for gather objectives

            quests.evaluateQuestObjective(id, 'gather', name);

            //Sync to player

            server.syncInventoryItem(i, id, game.players[id].channel, false);

            break;
        }
};

exports.setPlayerEquipment = function(id, item)
{
    //Get equippable

    let equippable = item.equippable;

    //Check if equippable already exists,
    //if so add it to the inventory.
    //If this is not possible return.

    if (game.players[id].equipment[equippable] !== undefined)
        if (!this.addPlayerItem(id, game.players[id].equipment[equippable]))
            return false;

    //Set equipment equippable of player

    game.players[id].equipment[equippable] = item.name;

    //Equip if action is available

    if (item.equippableAction.length > 0) {
        //Set action at 0 if main

        if (equippable === 'main')
            actions.setPlayerAction(item.equippableAction, 0, id);

        //Set action at 1 if offhand

        if (equippable === 'offhand')
            actions.setPlayerAction(item.equippableAction, 1, id);
    }

    //Calculate new attributes

    game.calculatePlayerStats(id, true);

    //Sync to others

    server.syncPlayerPartially(id, 'equipment', game.players[id].channel, true);

    //Sync equipment to player

    server.syncEquipmentItem(equippable, id, game.players[id].channel, false);

    //Return true

    return true;
};

exports.unequipPlayerEquipment = function(id, slot) {
    //Check if player has equipped item

    if (game.players[id].equipment[slot] === undefined)
        return;

    //Get item

    let item = items.getItem(game.players[id].equipment[slot]);

    //Check if valid

    if (item === undefined)
        return;

    //Add item

    if (!items.addPlayerItem(id, game.players[id].equipment[slot]))
        return;

    //Check if equipment has action

    if (item.equippableAction !== undefined)
        for (let a = 0; a < game.players[id].actions.length; a++)
            if (game.players[id].actions[a] != undefined &&
                game.players[id].actions[a].name === item.equippableAction)
                {
                    //Remove equipped action

                    game.players[id].actions[a] = undefined;

                    //Sync to player

                    server.syncPlayerPartially(id, 'actions', game.players[id].channel, false);

                    break;
                }

    //Remove equipped item

    game.players[id].equipment[slot] = undefined;

    //Calculate new stats

    game.calculatePlayerStats(id, true);

    //Sync to others

    server.syncPlayerPartially(id, 'equipment', game.players[id].channel, true);

    //Sync to player

    server.syncEquipmentItem(slot, id, game.players[id].channel, false);

    //Return item sound sources

    return item.sounds;
}

exports.getPlayerFreeSlot = function(id)
{
    //Search for a undefined/non-existing slot

    for (let i = 0; i < game.playerConstraints.inventorySize; i++)
        if (game.players[id].inventory[i] == null)
            return i;

    //Otherwise return an invalid slot

    return -1;
};

exports.getPlayerFreeSlots = function(id)
{
    //Return the amount of undefined/non-existing slots

    let amount = 0;

    for (let i = 0; i < game.playerConstraints.inventorySize; i++)
        if (game.players[id].inventory[i] == null)
            amount++;

    //Return the amount

    return amount;
};

exports.dropPlayerItem = function(id, slot, ownerOverride) {
    //Check if player has item in slot,
    //otherwise check if it is equipment

    let isEquipment = false;

    if (game.players[id].inventory[slot] == undefined) 
        if (game.players[id].equipment[slot] != undefined)
            isEquipment = true;
        else
            return false;

    //Create world item

    let name;
    
    if (isEquipment)
        name = game.players[id].equipment[slot];
    else
        name = game.players[id].inventory[slot];

    items.createWorldItem(
        (ownerOverride == undefined ? -1 : ownerOverride),
        game.players[id].map_id,
        game.players[id].pos.X+game.players[id].character.width/2,
        game.players[id].pos.Y+game.players[id].character.height,
        name
    );

    //Remove item from player inventory
    //or equipment at specific slot and
    //sync to the player or everyone

    if (isEquipment) 
        this.unequipPlayerEquipment(id, slot);
    
    this.removePlayerItem(id, name);

    return true;
};

exports.createWorldItem = function(owner, map, x, y, name)
{
    //Get item

    let item = this.getItem(name);

    //Check if valid

    if (item == undefined)
        return;

    //Check if owner should be global or single player

    let ownerName = owner;

    if (ownerName != -1)
        ownerName = game.players[owner].name;

    //Create world item on map

    if (this.onMap[map] == undefined)
        this.onMap[map] = [];

    //Get converted item and add
    //world item specific attributes

    let worldItem = this.getConvertedItem(name);
    worldItem.owner = ownerName;
    worldItem.pos = {
        X: x,
        Y: y
    };

    //Add world item to map

    for (let i = 0; i < this.onMap[map].length+1; i++)
        if (this.onMap[map][i] == undefined)
        {
            worldItem.id = i;

            this.onMap[map][i] = {
                item: worldItem,
                timer: {
                    cur: 0,
                    releaseTime: 30, //30 seconds for item release
                    removeTime: 60   //60 seconds for item removal
                }
            };

            break;
        }

    //Sync across map

    server.syncWorldItem(map, worldItem);
};

exports.releaseWorldItemsFromOwner = function(map, owner)
{
    //Check if valid

    if (this.onMap[map] == undefined)
        return;

    //Cycle through all items on map

    for (let i = 0; i < this.onMap[map].length; i++)
    {
        if (this.onMap[map][i] === undefined)
            continue;

        if (this.onMap[map][i].item.owner == owner)
        {
            //Set owner to -1

            this.onMap[map][i].item.owner = -1;

            //Sync world item

            server.syncWorldItem(map, this.onMap[map][i].item);
        }
    }
};

exports.releaseWorldItemFromOwner = function(map, item)
{
    //Check if valid

    if (this.onMap[map] === undefined)
        return;

    //Set owner to -1

    this.onMap[map][item].item.owner = -1;

    //Sync world item

    server.syncWorldItem(map, this.onMap[map][item].item);
};

exports.pickupWorldItem = function(map, id, item)
{
    //Check if valid

    if (this.onMap[map] === undefined ||
        this.onMap[map][item] === undefined)
        return false;

    //Check owner

    if (this.onMap[map][item].item.owner != -1 &&
        this.onMap[map][item].item.owner !== game.players[id].name)
        return false;

    //Attempt to add item

    if (!this.addPlayerItem(id, this.onMap[map][item].item.name))
        return false;

    //Remove world item

    this.removeWorldItem(map, item);

    //Return true

    return true;
};

exports.removeWorldItem = function(map, item)
{
    //Check if valid

    if (this.onMap[map] === undefined)
        return;

    //Set as remove object

    this.onMap[map][item].item = {
        id: item,
        remove: true
    };

    //Sync world item

    server.syncWorldItem(map, this.onMap[map][item].item);

    //Remove world item

    this.onMap[map][item] = undefined;
};

exports.updateMaps = function()
{
    //Cycle through all maps

    for (let m = 0; m < this.onMap.length; m++)
    {
        //Check if map is valid

        if (this.onMap[m] === undefined)
            continue;

        //Cycle through all items

        for (let i = 0; i < this.onMap[m].length; i++)
        {
            if (this.onMap[m][i] === undefined)
                continue;

            this.onMap[m][i].timer.cur++;

            //Check if item should be released of it's owner

            if (this.onMap[m][i].timer.cur >= this.onMap[m][i].timer.releaseTime &&
                this.onMap[m][i].item.owner != -1)
                this.releaseWorldItemFromOwner(m, i);

            //Check if item should be removed

            if (this.onMap[m][i].timer.cur >= this.onMap[m][i].timer.removeTime)
                this.removeWorldItem(m, i);
        }
    }
};

exports.sendMap = function(id)
{
    let map = game.players[id].map_id,
        channel = game.players[id].channel;

    //Check if valid

    if (this.onMap[map] == undefined ||
        this.onMap[map].length == 0)
        return;

    //Send all items in map

    for (let i = 0; i < this.onMap[map].length; i++)
        if (this.onMap[map][i] !== undefined)
            server.syncWorldItem(map, this.onMap[map][i].item, channel, false);
};
