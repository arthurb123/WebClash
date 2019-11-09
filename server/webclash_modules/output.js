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

    console.log(this.getTimeStamp() + message);
};

exports.giveError = function(message, err)
{
    let text = message;

    if (err.stack)
        text += err.stack;
    else if (err.message)
        text += err.message;

    logger.add(text);
    this.give(text);
};

exports.getTimeStamp = function()
{
    return "[WebClash @ " + new Date().toString().substr(16, 8) + "] - ";
};
