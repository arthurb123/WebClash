//Output Module for WebClash

exports.give = function(message)
{
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
