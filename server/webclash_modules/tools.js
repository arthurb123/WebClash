exports.randomString = function() {
    //Return a random string consisting of characters and numbers

    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};