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
 * Inserts letters into the token so that it is even harder to guess.
 *
 * @param {string} token Token obtained from the timestamp.
 * @returns {string} Token with added letters.
 */
function addLetters(token) {
    let toReturn = "";
    toReturn += randSeq();
    for (let i = 0; i < token.length; i++) {
        toReturn += randSeq();
        toReturn += token.charAt(i);
    }
    toReturn += randSeq();
    return toReturn;
}

/**
 * Generates a random sequence of letters, possibly empty.
 *
 * @param {number} max Maximum length of the string that we want.
 * @returns {string} Random sequence, possibly empty.
 */
function randSeq(max = 3) {
    let toReturn = "";
    const toAdd = randInt(0, max + 1);
    for (let j = 0; j < toAdd; j++) {
        toReturn += randLetter();
    }
    return toReturn;
}

/**
 * Returns a random letter from A-Z or a-z.
 *
 * @returns A random letter.
 */
function randLetter() {
    const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return all.charAt(randInt(0, all.length));
}

/**
 * Generates a unique sequence of numbers and letters that can be used for identification.
 *
 * @returns {string} A unique sequence of numbers and letters (usually around 40 characters long).
 */
function generateToken() {

    const formatted = dateFormat(new Date(), "yyyymmddHHMMssl");
    let toReturn = "";

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
                toReturn = addLetters(formatted + rand);
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
        toReturn = addLetters(formatted + rand);
    }

    return toReturn;
}

/**
 * Generates a unique sequence of numbers and letters that can be used for identification.
 * This generates a longer token than generateToken() which makes it more secure.
 *
 * @returns A unique token.
 */
function generateLoginToken() {
    return randSeq(4) + generateToken() + randSeq(6);
}

module.exports = {
    generateToken,
    generateLoginToken
};