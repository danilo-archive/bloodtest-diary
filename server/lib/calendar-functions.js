/**
 * Provides a function that calculates a new due date.
 *
 * NB: this controller differs from the one on the client side!
 *
 * @module calendar-functions
 * @author Danilo Del Busso, Luka Kralj
 * @version 1.0
 */
const Holidays = require('date-holidays');
const hd = new Holidays('GB');

/**
 * Get the next date
 * @example <caption>Example usage of getNextDate with X-D notation.</caption>
 * // returns Date object of value 2018-01-04T00:00:00.000Z
 * getNextDate('3-D', new Date(2018, 0 , 1));
 *
 * @param {string} frequency the frequency in the given format
 * @param {date} startingDate the starting date from which to calculate the next date
 */
function getNextDueDate(frequency, startingDate) {
    if (typeof startingDate === 'undefined' ||
        frequency === undefined ||
        frequency === null ||
        frequency.split('-').length != 2 ||
        !(startingDate instanceof Date)) {
        return null;
    }

    const f_value = parseInt(frequency.split('-')[0]); // the '3' in '3-Y'
    if (isNaN(f_value) || !stringIsInteger(frequency.split('-')[0])) {
        return null;
    }
    const f_format = frequency.split('-')[1]; // the 'Y' in '2-Y'
    const date = startingDate;

    switch (f_format) {
        case 'Y':
            {
                date.setFullYear(date.getFullYear() + f_value);
                break;
            }
        case 'W':
            {
                date.setDate(date.getDate() + f_value * 7);
                break;
            }
        case 'D':
            {
                date.setDate(date.getDate() + f_value);
                break;
            }
        default:
            return null;
    }

    while(isHoliday(date) || !isWeekend(date)) {
        date.setDate(date.getDate() + 1);
    }

    return date;
}

/**
 * Check if a date is a holiday in the UK
 * @param {date} date the date to check
 */
function isHoliday(date) {
    return hd.isHoliday(date);
}

/**
 * Check if the date falls on Saturday or Sunday.
 *
 * @param {date} date The date to check.
 * @returns {boolean} True if date is on weekend, false otherwise.
 */
function isWeekend(date) {
    // Sunday -> 0; Saturday -> 6
    return date.getDay() === 0 || date.getDay() === 6;
}

/**
 * Check if given string is an integer
 * @param {string} str
 * @returns {boolean} true if string is an integer
 */
function stringIsInteger(str) {
    const n = Math.floor(Number(str));
    return String(n) === str;
}

module.exports = {
    getNextDueDate
}
