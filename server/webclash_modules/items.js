//Items module for WebClash Server

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
            result.currency = item.currency;

            break;
        case 'equipment':
            result.actionIcon = item.actionIcon;

            result.equippable = item.equippable;
            result.equippableAction = item.equippableAction;
            result.equippableSource = item.equippableSource;

            result.stats = item.stats;
            if (item.equippableAction != undefined)
                result.scaling = combat.calculateAverageScalingFromAction(item.equippableAction);

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
        if (err)
            output.giveError('Could not load items: ', err);

        let count = 0;

        files.forEach(file => {
            let item = items.loadItem(location + '/' + file);
            item.name = file.substr(0, file.lastIndexOf('.'));

            if (item.equippableAction !== '')
                item.scaling =combat.getAction(item.equippableAction).scaling;

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
            action =combat.getAction(object.consumableAction);

        if (object.type === 'equipment' &&
            object.equippableAction.length > 0)
            action =combat.getAction(object.equippableAction);

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

    server.syncPlayerInventoryItem(slot, id, game.players[id].channel);

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

    if (item == undefined)
        return false;

    //Check if minimal item level matches player level

    if (item.minLevel !== 0 &&
        game.players[id].level < item.minLevel) {
        //Notify player

        server.syncChatMessage(
            'This item requires you to be level ' + item.minLevel + '.', 
            game.players[id].channel
        );

        return false;
    }

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

        //Delta currency

        game.deltaCurrencyPlayer(id, item.currency);

        //Add action

        if (item.consumableAction.length > 0 &&
            !combat.addPlayerAction(item.consumableAction, id, item.consumableActionUses))
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

            server.syncPlayerInventoryItem(i, id, game.players[id].channel, false);

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
        if (!this.addPlayerItem(id, game.players[id].equipment[equippable])) {
            //Notify player

            server.syncChatMessage(
                'No inventory space available to unequip ' + equippable + '.', 
                game.players[id].channel
            );

            return false;
        }

    //Set equipment equippable of player

    game.players[id].equipment[equippable] = item.name;

    //Equip if action is available

    if (item.equippableAction.length > 0) {
        //Set action at 0 if main

        if (equippable === 'main')
           combat.setPlayerAction(item.equippableAction, 0, id);

        //Set action at 1 if offhand

        if (equippable === 'offhand')
           combat.setPlayerAction(item.equippableAction, 1, id);
    }

    //Calculate new attributes

    game.calculatePlayerStats(id, true);

    //Sync to others

    server.syncPlayerPartially(id, 'equipment', game.players[id].channel, true);

    //Sync equipment to player

    server.syncPlayerEquipmentItem(equippable, id, game.players[id].channel);

    //Return true

    return true;
};

exports.unequipPlayerEquipment = function(id, slot) {
    //Check if player has equipped item

    if (game.players[id].equipment[slot] == undefined)
        return;

    //Get item

    let item = items.getItem(game.players[id].equipment[slot]);

    //Check if valid

    if (item == undefined)
        return;

    //Add item

    if (!items.addPlayerItem(id, game.players[id].equipment[slot]))
        return;

    //Check if equipment has action

    if (item.equippableAction !== undefined)
        if (!combat.removePlayerAction(item.equippableAction, id))
            return;

    //Remove equipped item

    game.players[id].equipment[slot] = undefined;

    //Calculate new stats

    game.calculatePlayerStats(id, true);

    //Sync to others

    server.syncPlayerPartially(id, 'equipment', game.players[id].channel, false);

    //Sync to player

    server.syncPlayerEquipmentItem(slot, id, game.players[id].channel);

    //Return item sound sources

    return item.sounds;
}

exports.getPlayerFreeSlot = function(id)
{
    //Search for a undefined/non-existing slot

    for (let i = 0; i < game.playerConstraints.inventorySize; i++)
        if (game.players[id].inventory[i] == undefined)
            return i;

    //Otherwise return an invalid slot

    return -1;
};

exports.getPlayerFreeSlots = function(id)
{
    //Return the amount of undefined/non-existing slots

    let amount = 0;

    for (let i = 0; i < game.playerConstraints.inventorySize; i++)
        if (game.players[id].inventory[i] == undefined)
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

    items.createMapItem(
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

exports.createMapItem = function(owner, map_id, x, y, name)
{
    //Get item

    let item = this.getConvertedItem(name);

    //Check if valid

    if (item == undefined)
        return;

    //Check if owner should be global or single player

    let ownerName = owner;

    if (ownerName != -1)
        ownerName = game.players[owner].name;

    //Create item array on map
    //if necessary

    if (this.onMap[map_id] == undefined)
        this.onMap[map_id] = [];

    //Add item specific attributes

    item.owner = ownerName;
    item.pos = {
        X: x,
        Y: y + tiled.maps[map_id].tileheight / 2
    };

    //Add item to map

    for (let i = 0; i < this.onMap[map_id].length+1; i++)
        if (this.onMap[map_id][i] == undefined)
        {
            item.id = i;

            this.onMap[map_id][i] = {
                item: item,
                type: 'single', //Single type, should not respawn
                timer: {
                    cur: 0,
                    releaseTime: 30, //30 seconds for item release
                    removeTime: 60   //60 seconds for item removal
                }
            };

            break;
        }

    //Sync across map

    server.syncItem(map_id, item);
};

exports.createMapItemFromProperty = function(map_id, name, rect, checks) {
    //Get item

    let item = this.getConvertedItem(name);

    //Check if valid

    if (item == undefined)
        return;

    //Create item array on map
    //if necessary

    if (this.onMap[map_id] == undefined)
        this.onMap[map_id] = [];

    //Add map item specific attributes

    item.owner = -1;
    item.checks = checks;
    item.pos = {
        X: rect.x + (rect.w == undefined ? 0 : rect.w / 2),
        Y: rect.y + (rect.h == undefined ? 0 : rect.h / 2) + tiled.maps[map_id].tileheight / 2
    };

    //Add item to map

    for (let i = 0; i < this.onMap[map_id].length+1; i++)
        if (this.onMap[map_id][i] == undefined)
        {
            item.id = i;

            this.onMap[map_id][i] = {
                item: item,
                type: 'permanent', //Permanent type, should respawn
                timer: {
                    cur: 0,
                    respawnTime: 60,    //Item respawn time of 60 sec
                    shouldRespawn: false
                }
            };

            break;
        }
};

exports.releaseMapItemsFromOwner = function(map, owner)
{
    //Check if valid

    if (this.onMap[map] == undefined)
        return;

    //Cycle through all items on map

    for (let i = 0; i < this.onMap[map].length; i++)
    {
        if (this.onMap[map][i] == undefined)
            continue;

        if (this.onMap[map][i].item.owner == owner)
        {
            //Set owner to -1

            this.onMap[map][i].item.owner = -1;

            //Sync world item

            server.syncItem(map, this.onMap[map][i].item);
        }
    }
};

exports.releaseMapItemFromOwner = function(map, item)
{
    //Check if valid

    if (this.onMap[map] == undefined)
        return;

    //Set owner to -1

    this.onMap[map][item].item.owner = -1;

    //Sync world item

    server.syncItem(map, this.onMap[map][item].item);
};

exports.pickupItem = function(map, id, item)
{
    //Check if valid

    if (this.onMap[map] == undefined ||
        this.onMap[map][item] == undefined)
        return false;

    //Check owner

    if (this.onMap[map][item].item.owner != -1 &&
        this.onMap[map][item].item.owner !== game.players[id].name)
        return false;

    //If the item is a permanent item, check
    //if it should respawn first to prevent
    //item spamming through some sort of hacking

    if (this.onMap[map][item].type === 'permanent' &&
        this.onMap[map][item].timer.shouldRespawn)
        return false;

    //Attempt to add item

    if (!this.addPlayerItem(id, this.onMap[map][item].item.name))
        return false;

    //Remove item

    this.removeItem(map, item);

    //Return true

    return true;
};

exports.removeItem = function(map, item)
{
    //Check if valid

    if (this.onMap[map] == undefined)
        return;

    //Sync remove item

    server.syncItem(map, {
        id: item,
        remove: true
    });

    //Remove item if it is a single type,
    //indicating it should not respawn

    if (this.onMap[map][item].type === 'single')
        this.onMap[map][item] = undefined;

    //If permanent item, enable respawn timer

    else if (this.onMap[map][item].type === 'permanent')
        this.onMap[map][item].timer.shouldRespawn = true;
};

exports.updateMaps = function(dt)
{
    //Cycle through all maps

    for (let m = 0; m < this.onMap.length; m++)
    {
        //Check if map is valid

        if (this.onMap[m] == undefined)
            continue;

        //Cycle through all items

        for (let i = 0; i < this.onMap[m].length; i++)
        {
            if (this.onMap[m][i] == undefined)
                continue;

            //Single map item

            switch (this.onMap[m][i].type) {
                case 'single':
                    this.onMap[m][i].timer.cur+=dt;

                    //Check if item should be released of it's owner

                    if (this.onMap[m][i].timer.cur >= this.onMap[m][i].timer.releaseTime &&
                        this.onMap[m][i].item.owner != -1)
                        this.releaseMapItemFromOwner(m, i);

                    //Check if item should be removed

                    if (this.onMap[m][i].timer.cur >= this.onMap[m][i].timer.removeTime)
                        this.removeItem(m, i);

                    break;
                case 'permanent':
                    //Check if should respawn

                    if (!this.onMap[m][i].timer.shouldRespawn)
                        continue;

                    //Check if item can be respawned,
                    //if so sync item and reset values

                    if (this.onMap[m][i].timer.cur >= this.onMap[m][i].timer.respawnTime) {
                        this.onMap[m][i].timer.shouldRespawn = false;
                        this.onMap[m][i].timer.cur = 0;

                        server.syncItem(m, this.onMap[m][i].item);
                    }

                    //Otherwise increment timer

                    else
                        this.onMap[m][i].timer.cur+=dt;

                    break;
            }
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
        if (this.onMap[map][i] !== undefined) {
            let item = this.onMap[map][i].item;

            //If a permanent item, check for checks

            if (this.onMap[map][i].type === 'permanent')
                if (!game.checkPlayerForChecks(id, item.checks))
                    continue;

            //Sync item

            server.syncItem(map, item, channel, false);
        }
};
