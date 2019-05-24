//Output Module for WebClash

exports.give = function(message, filter)
{
    if (filter) {
        let hasBreaks = (message.indexOf('\n') !== -1);

        message = 
            message
                .replaceAll('<br>', (hasBreaks ? '' : '\n'))
                .replaceAll('<i>', '')
                .replaceAll('</i>', '')
                .replaceAll('<b>', '')
                .replaceAll('</b>', '');
    };

    console.log(this._timeFormat() + message);
};

exports.giveError = function(message, err)
{
    let text = message;

    if (err.message)
        text += err.message;
    if (err.stack)
        text += ' (stack: ' + err.stack + ')';

    this.give(text);
};

exports._timeFormat = function()
{
    return "[WebClash @ " + new Date().toString().substr(16, 8) + "] - ";
};

//Prototype(s)

String.prototype.replaceAll = function(search, replacement) {
    let target = this;

    return target.replace(new RegExp(search, 'g'), replacement);
};
