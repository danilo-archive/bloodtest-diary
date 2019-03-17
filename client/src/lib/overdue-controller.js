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
    //console.log({date1, date2, distance});
    return distance;
}

// TODO to be tested
function weeksBetweenDates(date1, date2){
    return Math.floor(daysBetweenDates(date1, date2))/7;
}
// TODO to be tested
function monthsBetweenDates(date1, date2){
    return Math.floor(daysBetweenDates(date1, date2)/30);
}
// TODO to be tested
function yearsBetweenDates(date1, date2){
    return Math.floor(daysBetweenDates(date1, date2)/365);
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


/**
* Groups the list of tests based on whether they spent 1 year+, months,
* or weeks overdue.
* @param {List[Date]} tests The list of overdue tests
* @return {List[JSON]} A list of groups with the relative list of tests.
*/
function group(tests, testDay=undefined){
    //TODO do be tested
    const today = testDay ? testDay : new Date();
    let sortedTests = sortByOverdueTime(tests, 0, tests.length - 1);
    let groups = [{class: "Year+", tests: []}, {class: "6+ months", tests: []},{class: "1-6 months", tests: []},
                  {class: "2-4 weeks", tests: []}, {class: "Less than 2 weeks", tests: []}];

    var i = 0;
    while (i < sortedTests.length && yearsBetweenDates(sortedTests[i].due_date, today) > 0){
        groups[0].tests = groups[0].tests.concat(sortedTests[i]);
        i++;
    }
    while (i < sortedTests.length && monthsBetweenDates(sortedTests[i].due_date, today) > 6){
        groups[1].tests = groups[1].tests.concat(sortedTests[i]);
        i++;
    }
    while (i < sortedTests.length && monthsBetweenDates(sortedTests[i].due_date, today) >= 1){
        groups[2].tests = groups[2].tests.concat(sortedTests[i]);
        i++;
    }
    while (i < sortedTests.length && weeksBetweenDates(sortedTests[i].due_date, today) >= 2){
        groups[3].tests = groups[3].tests.concat(sortedTests[i]);
        i++;
    }
    while (i < sortedTests.length){
        groups[4].tests = groups[4].tests.concat(sortedTests[i]);
        i++;
    }
    return groups;
}

function getNumberOfTestsInGroup(group){
    var length = 0;
    console.log({group})
    for(var i = 0 ; i < group.length ; i++){
        length += group[i].tests.length;
    }
    return length;
}

function testGroup(tests){
    let today = new Date(2019, 2, 1);
    return group(tests, today);
}


module.exports = {
    daysBetweenDates,
    sortByOverdueTime,
    group,
    getNumberOfTestsInGroup,
    testGroup
}
