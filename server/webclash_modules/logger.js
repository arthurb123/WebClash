//Logger module for WebClash

let saved = [];
let maxSaves = 32;

exports.add = function(content) {
    saved.push(content);

    if (saved.length >= maxSaves)
        saved = this.saved.splice(1, maxSaves-1);
};

exports.save = function(cb) {
    if (saved.length === 0) {
        cb();
        return;
    }

    if (!fs.existsSync('logs'))
        fs.mkdirSync('logs');

    let timestamp = this.getTimeStamp();
    fs.writeFile('logs/' + timestamp + '.txt', saved.concat('\n'), function(err) {
        if (err)
            output.giveError('Could not save logs: ', err);

        output.give("Saved log with " + saved.length + " errors.");
        cb();
    });
};

exports.getTimeStamp = function() {
    let date = new Date();

    let timestamp = '';
    timestamp += date.getDate();
    timestamp += '-' + date.getMonth();
    timestamp += '-' + date.getFullYear();
    timestamp += '-' + date.toString()
                           .substr(16, 8)
                           .replace(':', '')
                           .replace(':', '');

    return timestamp;
};