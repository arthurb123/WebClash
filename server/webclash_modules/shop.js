//Shop module for WebClash Server

const shoppingPositions = {};

exports.openShop = function(player, owner, target, showShopEvent) {
    //Set shopping position

    shoppingPositions[player] = {
        X: game.players[player].pos.X,
        Y: game.players[player].pos.Y
    };

    //Convert shop items if necessary,
    //this only happens once in the entire runtime.

    if (!showShopEvent.converted) {
        let shop = [];

        for (let i = 0; i < showShopEvent.items.length; i++)
            shop.push({
                item: items.getConvertedItem(showShopEvent.items[i].item),
                price: showShopEvent.items[i].price
            });

        showShopEvent.items = shop;
        showShopEvent.converted = true;
    }

    //Open shop on client with the
    //converted shop items

    game.players[player].channel.emit('GAME_OPEN_SHOP', {
        target: owner,
        id: target,
        shop: showShopEvent
    });
};

exports.buyItem = function(player, item, owner, dialogId) {
    //Check if shopping position is equal to the
    //player's position

    if (game.players[player].pos.X !== shoppingPositions[player].X ||
        game.players[player].pos.Y !== shoppingPositions[player].Y) 
        return false;

    //Setup necessary variables

    let map = game.players[player].map_id,
        target;

    //Check if NPC or item dialog

    //Item
    if (isNaN(owner))
        target = items.getItem(owner).dialog[dialogId];

    //NPC
    else
        target = npcs.onMap[map][owner].data.dialog[dialogId];

    //Check if target is valid and
    //a show shop event

    if (target == undefined ||
        !target.isEvent ||
        target.showShopEvent == undefined)
        return false;

    //Get shop items from target

    let shop = target.showShopEvent.items;

    //Check if item that needs to be bought
    //is valid

    if (shop[item] == undefined)
        return false;

    //Check if the player has enough currency

    if (game.players[player].currency-shop[item].price < 0) 
        return false;

    //Add item to the player inventory

    if (items.addPlayerItem(player, shop[item].item.name)) {
        //Subtract currency from player, because item
        //has been added successfully!

        game.deltaCurrencyPlayer(player, -shop[item].price);

        //Return successful

        return true;
    }
};

exports.sellItem = function(player, item, owner) {
    //Check if shopping position is equal to the
    //player's position

    if (game.players[player].pos.X !== shoppingPositions[player].X ||
        game.players[player].pos.Y !== shoppingPositions[player].Y) 
        return false;

    //Check if player has item

    if (!items.hasPlayerItem(player, item))
        return false;

    //Grab map

    let map = game.players[player].map_id;

    //Check if NPC or item dialog exists

    //Item
    if (isNaN(owner))
        if (items.getItem(owner).dialog == undefined ||
            items.getItem(owner).dialog.length === 0 ||
            owner === item) //Check to not sell the item through which selling is happening!
            return false;

    //NPC
    else 
        if (npcs.onMap[map][owner].data.dialog == undefined ||
            npcs.onMap[map][owner].data.dialog.length === 0)
            return false;

    //Grab item and check if valid
    //sellable item

    item = items.getItem(item);

    if (item.value == undefined ||
        item.value <= 0 ||
        item.type === 'quest')
        return false;

    //Sell item for it's currency value

    game.deltaCurrencyPlayer(player, item.value);

    //Remove from inventory

    items.removePlayerItem(player, item.name);

    //Return successful

    return true;
};