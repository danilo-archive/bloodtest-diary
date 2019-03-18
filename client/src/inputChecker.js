/**
 * This class purpose is to verify if given string matches some criteria.
 * For instance if email has valid type such as "anystring@anystring.anystring".
 */

const intRegex = /^\d+$/;
const characterRegex = /^[a-zA-Z]+$/;
//TODO : maybe add more sophisticated regular expression
const emailRegex = /\S+@\S+\.\S+/;
//TODO : maybe use external library
const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;


class InputChecker {

    /**
     * Checks if input is empty or undefined
     * @param input Some string value
     * @returns {boolean}
     */
    static emptyCheck(input) {
        return input === "" || input === undefined || input === null;
    }

    /**
     * Checks if input contains only numbers
     * @param input String of some value
     * @returns {boolean} Match with regular expression
     */
    static integerCheck(input) {
        return intRegex.test(input);
    }

    /**
     * Checks if input contains only characters
     * @param input String of some value
     * @returns {boolean} Match with regular expression
     */
    static characterCheck(input) {
        return characterRegex.test(input);
    }

    /**
     * Checks if input is an email address or empty
     * This is not a complete check some invalid emails will still return true
     * @param input String of some value
     * @returns {boolean} Match with regular expression
     */

    static emailCheck(input) {
        if (this.emptyCheck(input)) {
            return true;
        }
        return emailRegex.test(input);
    }

    /**
     * Checks if input is a phone number or empty
     * @param input String of some value
     * @returns {boolean} Match with regular expression
     */

    static phoneCheck(input) {
        if (this.emptyCheck(input)) {
            return true;
        }
        return phoneRegex.test(input);
    }
}

export default InputChecker;