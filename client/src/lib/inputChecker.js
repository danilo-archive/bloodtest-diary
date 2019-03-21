/**
 * Purpose of functions below is to verify if given input matches some criteria.
 * For instance if email has valid type such as "anystring@anystring.anystring".
 * 
 * @author Jakub Cerven
 */

const intRegex = /^\+?(0|[1-9]\d*)$/;
const characterRegex = /^[a-zA-Z]+$/;
//TODO : maybe add more sophisticated regular expression
const emailRegex = /\S+@\S+\.\S+/;



/**
 * Checks if input is empty or undefined
 * @param input Some string value
 * @returns {boolean}
 */
function emptyCheck(input) {
    return input === "" || input === undefined || input === null;
}

/**
 * Checks if input contains only numbers
 * @param input String of some value
 * @returns {boolean} Match with regular expression
 */
function integerCheck(input) {
    return intRegex.test(input);
}

/**
 * Checks if input contains only characters
 * @param input String of some value
 * @returns {boolean} Match with regular expression
 */
function characterCheck(input) {
    return characterRegex.test(input);
}

/**
 * Checks if input is an email address or empty
 * This is not a complete check some invalid emails will still return true
 * @param input String of some value
 * @returns {boolean} Match with regular expression
 */

function emailCheck(input) {
    if (emptyCheck(input)) {
        return true;
    }
    return emailRegex.test(input);
}

module.exports = {emptyCheck, integerCheck, characterCheck, emailCheck};