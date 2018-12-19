//Output Module for WebClash

exports.give = function(message)
{
    console.log(this._timeFormat() + message);
};

exports._timeFormat = function()
{
    return "WebClash @ " + new Date().toString().substr(16, 8) + " - ";
};