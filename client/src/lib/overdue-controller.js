/**
 * Controller functions to handle overdue tests
 * @module overdue-controller
 * @author Jacopo Madaluni
 * @version 0.0.1
 */

/**
* @param {Date} date1
* @param {Date} date2
* @return {Int} The number of days in between.
*/
function daysBetweenDates(date1, date2){
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    date1 = new Date(date1);
    date2 = new Date(date2);
    let distance =  Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));
    return distance;
}

/**
* Returns a sorted list in descending order based on
* how much time each test has been overdue for.
* @param {List} tests The list of overdue tests
* @return {List} A sorted version of the imput list
*/
function sortByOverdueTime(tests, left, right){
    var i = left;
    var j = right;
    var tmp;
    var pivot = tests[Math.floor((left + right) / 2)];
    var today = new Date();
    while (i <= j){
        while (daysBetweenDates(tests[i].due_date, today) > daysBetweenDates(pivot.due_date, today)){
            i++;
        }
        while (daysBetweenDates(tests[j].due_date, today) < daysBetweenDates(pivot.due_date, today)){
            j--;
        }
        if (i <= j){
            tmp = tests[i];
            tests[i] = tests[j];
            tests[j] = tmp;
            i++;
            j--;
        }
    }
    if (left < j){
        sortByOverdueTime(tests, left, j);
    }
    if (i < right){
        sortByOverdueTime(tests, i, right);
    }
    return tests;
}


function getNumberOfTestsInGroup(group){
    var length = 0;
    for(var i = 0 ; i < group.length ; i++){
        length += group[i].tests.length;
    }
    return length;
}



module.exports = {
    daysBetweenDates,
    sortByOverdueTime,
    getNumberOfTestsInGroup
}
