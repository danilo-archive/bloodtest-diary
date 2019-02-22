/** 
 * Unique token generator.
 * 
 * @author Luka Kralj
 * @version 1.0
 * 
 * @module token-generator
 */

const dateFormat = require("dateformat");

let map = {};

/**
 * Generates a random integer.
 *
 * @param {number} min Lower bound.
 * @param {number} max Upper bound.
 * @returns {number} Random integer.
 */
function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/**
 * Generates a unique sequence of numbers that can be used for identification.
 *
 * @returns {string} A unique sequence of numbers (usually around 20 characters long).
 */
function generateToken() {

    let formatted = dateFormat(new Date(), "yyyymmddHHMMssl");

    if (formatted in map) {
        // Another token requested in the same millisecond.

        let found = false;

        do {
            const rand = randInt(10000, 10000000);
            // Verify that the random number hasn't already been used for this timestamp.
            if (map[formatted].find((element) => {
                return element === rand;
            }) === undefined) {
                found = true;
                map[formatted].push(rand);
                formatted += rand;
            }
        } while (!found);
    }
    else {
        // First instance of token with such timestamp.

        // Since the timestamp always changes - if value is not found it means it's because it's not in the same millisecond.
        // Hence, the previous values in the map will never be repeated again so the map can be deleted.
        map = {}; 
        const rand = randInt(10000, 10000000);
        map[formatted] = [rand];
        formatted += rand;
    }

    return formatted;
}

module.exports = {
    generateToken
}