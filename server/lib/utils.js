/**
 * Utility functions for react and server connect.
 * @module utils
 * @author Jacopo Madaluni
 * @version 0.0.2
 */


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
}

module.exports = {
    formatDate
};
