//Banks module for WebClash

const cache = {};
const maxLifetime = 60; //Max lifetime in seconds

const bankingPositions = {};

const loadBank = function(id, cb) {
    //Check if cache entry exists

    if (cache[id] != undefined) {
        cb(cache[id].bank);
        return;
    }

    //Load bank from storage

    storage.load('banks', id, function(bank) {
        cache[id] = {
            bank: bank,
            lifetime: 0
        };

        cb(bank);
    });
};

const saveBank = function(id, bank) {
    //Set cache

    cache[id] = {
        bank: bank,
        lifetime: 0
    };

    //Save bank to storage

    storage.save('banks', id, bank);
};

const convertBankToItems = function(bank) {
    try {
        //Convert bank items to actual items

        let bankItems = [];
        for (let item in bank)
            bankItems.push({
                item: items.getItem(item),
                amount: bank[item]
            });

        return bankItems;
    }
    catch (err) {
        output.giveError('Could not convert bank: ', err);
    }
};

exports.updateCache = function() {
    try {
        //Check lifetime of each cached bank

        for (let player in cache) {
            cache[player].lifetime++;

            //Exceeds max lifetime, clear cache

            if (cache[player].lifetime >= maxLifetime)
                delete cache[player];
        }
    }
    catch (err) {
        output.giveError('Could not update bank cache: ', err);
    }
};

exports.openBank = function(id, bankName) {
    //Set banking position

    bankingPositions[id] = {
        X: game.players[id].pos.X,
        Y: game.players[id].pos.Y
    };

    //Load bank

    loadBank(id, function(bank) {
        //Send open bank package to player

        game.players[id].channel.emit('GAME_OPEN_BANK', {
            name: bankName,
            bank: convertBankToItems(bank)
        });
    });
};

exports.addItem = function(id, item, cb) {
    //Check if banking position is equal to the
    //player's position

    if (game.players[id].pos.X !== bankingPositions[id].X ||
        game.players[id].pos.Y !== bankingPositions[id].Y) {
        cb(false, undefined);
        return;
    }

    //Add item to bank

    loadBank(id, function(bank) {
        //Check if item already exists, if so increment amount;
        //Otherwise add new entry with amount of 1

        if (bank[item] != undefined)
            bank[item]++;
        else
            bank[item] = 1;

        //Save the bank

        saveBank(id, bank);

        //Callback success and new bank

        if (cb != undefined)
            cb(true, convertBankToItems(bank));
    });
};

exports.removeItem = function(id, item, cb) {
    //Check if banking position is equal to the
    //player's position

    if (game.players[id].pos.X !== bankingPositions[id].X ||
        game.players[id].pos.Y !== bankingPositions[id].Y) {
        cb(false, undefined);
        return;
    }

    //Remove item from bank

    loadBank(id, function(bank) {
        let removed = false;

        //Remove item amount, if amount reaches zero;
        //remove entry entirely

        if (bank[item] != undefined) {
            bank[item]--;

            if (bank[item] <= 0)
                delete bank[item];

            removed = true;
        }

        //If a removal occurred, save bank

        if (removed)
            saveBank(id, bank);

        //Callback success and (new) bank

        if (cb != undefined)
            cb(removed, convertBankToItems(bank));
    });
};