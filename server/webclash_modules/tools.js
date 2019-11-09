//Unique methods

exports.randomString = function() {
    //Return a random string consisting of characters and numbers

    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

//Prototype(s)

String.prototype.replaceAll = function(search, replacement) {
    let target = this;

    return target.replace(new RegExp(search, 'g'), replacement);
};