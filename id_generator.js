const dateFormat = require("dateformat");


var dict = {};

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports.generateUniqueID = function(date) {

    var formated = dateFormat(date, "yyyymmddHHMMssl");

    if (formated in dict) {
        var found = false;
        var randomise = false;
        do {
            var rand = randInt(10000, 10000000, randomise);
            if (dict[formated].find((element) => {
                return element === rand;
            }) === undefined) {
                found = true;
                dict[formated].push(rand);
                formated += rand;
            }
        } while (!found);
    }
    else {
        // Since the timestamp always changes - if value is not found it means it's because it's not in the same millisecond.
        // Hence, the previous value in the map will never be repeated again.
        dict = {}; 
        var rand = randInt(10000, 10000000);
        dict[formated] = [rand];
        formated += rand;
    }

    return formated;
}