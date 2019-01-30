//Storage module for WebClash Server

const fs = require('fs');

exports.load = function(dir, name, cb) {
    this.exists(dir, name, function(is) {
        try {
            if (is)
                fs.readFile('data/' + dir + '/' + name + '.json', 'utf8', function (err, data) {
                    try {
                        if (err) {
                            output.give('Could not load JSON: '+ err);

                            return;
                        }

                        cb(JSON.parse(data));
                    }
                    catch (err)
                    {
                        output.give('Could not load JSON: '+ err);
                    }
                });
            else
                cb(undefined);
        }
        catch (err)
        {
            output.give('Could not load JSON: '+ err);
        }
    });
};

exports.exists = function(dir, name, cb) {
    try {
        fs.stat('data/' + dir + '/' + name + '.json', function(err, stat) {
            if(err == null)
                cb(true);
            else if (err.code === 'ENOENT')
                cb(false);
            else
                output.give('Could not check if JSON exists: ' + err);
        });
    }
    catch (err)
    {
        output.give('Could not check if JSON exists: ' + err);
    }
};

exports.save = async function(dir, name, data, cb) {
    try 
    {
        await fs.writeFile('data/' + dir + '/' + name + '.json', JSON.stringify(data, null, 1), 'utf8', function(err) {
            if (err)
                throw err;
            else if (cb !== undefined)
                cb();
        });
    }
    catch (err)
    {
        output.give('Could not save JSON: ' + err);
    }
};