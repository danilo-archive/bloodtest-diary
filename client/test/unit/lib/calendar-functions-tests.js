const calendar = require("../../../src/lib/calendar-functions.js");
const expect = require("chai").expect;

//positive tests
describe("getCalendar()", () => {
    const DESCRIPTION = 0;
    const DATE = 1;
    const CALENDAR = 2;
    const mockDatesAndCalendars = [
        ["June should be represented correctly","2019-6",
            [[27,28,29,30,31,1,2],
            [3,4,5,6,7,8,9],
            [10,11,12,13,14,15,16],
            [17,18,19,20,21,22,23],
            [24,25,26,27,28,29,30],
            [1,2,3,4,5,6,7]]],
        ["A month with date ending on Sunday should include one more line\n"+
         "entirely dedicated to the next month","2019-3",
            [[25,26,27,28,1,2,3],
            [4,5,6,7,8,9,10],
            [11,12,13,14,15,16,17],
            [18,19,20,21,22,23,24],
            [25,26,27,28,29,30,31],
            [1,2,3,4,5,6,7]]],
        ["January should be represented correctly","2017-1",
            [[26,27,28,29,30,31,1],
            [2,3,4,5,6,7,8],
            [9,10,11,12,13,14,15],
            [16,17,18,19,20,21,22],
            [23,24,25,26,27,28,29],
            [30,31,1,2,3,4,5]]],
        ["February from a leap year should be represented correctly","2016-2",
            [[1,2,3,4,5,6,7],
            [8,9,10,11,12,13,14],
            [15,16,17,18,19,20,21],
            [22,23,24,25,26,27,28],
            [29,1,2,3,4,5,6]]]
    ];
    mockDatesAndCalendars.forEach(test => {
        it(test[DESCRIPTION], () => {
            const result = JSON.stringify(calendar.getCalendar(new Date(test[DATE])));
            const expected = JSON.stringify(test[CALENDAR]);
            expect(result).to.equal(expected);
        });
    });
});

//negative tests
describe("getCalendar()", () => {
    const DESCRIPTION = 0;
    const DATE = 1;
    const CALENDAR = 2;
    const mockDatesAndCalendars = [
        ["Leap year respect the 400years rule","2000-2",
            [[31,1,2,3,4,5,6],
            [7,8,9,10,11,12,13],
            [14,15,16,17,18,19,20],
            [21,22,23,24,25,26,27],
            [28,30,31,1,2,3,4]]],
        ["A month with date starting on Sunday should include \n"+
         "the previous days up to Sunday","1998-12",
            [[1,2,3,4,5],
            [6,7,8,9,10,11,12],
            [13,14,15,16,17,18,19],
            [20,21,22,23,24,25,26],
            [27,28,29,30,31,1,2]]],
        ["Month 0 should not exist","2017-0",
                !undefined]
    ];
    mockDatesAndCalendars.forEach(test => {
        it(test[DESCRIPTION], () => {
            const result = JSON.stringify(calendar.getCalendar(new Date(test[DATE])));
            const expected = JSON.stringify(test[CALENDAR]);
            expect(result).not.to.equal(expected);
        });
    });
});

//positive tests
describe("isSelected()", () => {
    const DESCRIPTION = 0;
    const PARAMETERS = 1;
    const mockSelection = [
        ["Selecting a day in the current month should select it",
            [true, "2019-3-1", new Date("Mar 07 2019 00:00:00 GMT+0000 (Greenwich Mean Time)"), 1]],
        ["Selecting a day in the previous month should select it",
            [false, "2019-1-30", new Date("Feb 07 2019 20:20:20 GMT+0000 (Greenwich Mean Time)"), 30]],
        ["Selecting a day in the next month should select it",
            [false, "2021-4-1", new Date("Mar 07 2021 23:59:59 GMT+0000 (Greenwich Mean Time)"), 1]],
        ["Selecting a day in January from December should select it",
            [false, "2021-1-1", new Date("Dec 07 2020 12:30:11 GMT+0000 (Greenwich Mean Time)"), 1]],
        ["Selecting a day in December from January should select it",
            [false, "1999-12-31", new Date("Jan 01 2000 17:59:11 GMT+0000 (Greenwich Mean Time)"), 31]]
            
    ];
    mockSelection.forEach(test => {
        it(test[DESCRIPTION],() => {
            const result = calendar.isSelected(...test[PARAMETERS]);
            expect(result).to.equal(true);
        });
    });
});

//negative tests
describe("isSelected()", () => {
    const DESCRIPTION = 0;
    const PARAMETERS = 1;
    const mockSelection = [
        ["Selecting a day in a month should not select the same day from the previous month as well",
            [true, "2019-3-28", new Date("Feb 01 2019 00:00:00 GMT+0000 (Greenwich Mean Time)"), 28]],
        ["Selecting a day in a month should not select the same day from the next month as well",
            [true, "2019-3-1", new Date("May 01 2019 00:00:00 GMT+0000 (Greenwich Mean Time)"), 1]],
        ["Selecting a day in December from January should only select it from the right year",
            [false, "2018-12-31", new Date("Jan 01 2018 00:00:00 GMT+0000 (Greenwich Mean Time)"), 31]],
        ["Selecting a day in January from December should only select it from the right year",
            [false, "2019-1-1", new Date("Dec 01 2019 00:00:00 GMT+0000 (Greenwich Mean Time)"), 1]],
        ["Selecting a day in the current month and year should not select the same day in the same " +
         "month but in future years as well",
            [true, "2018-12-20", new Date("Dec 01 2019 00:00:00 GMT+0000 (Greenwich Mean Time)"), 20]]
            
    ];
    mockSelection.forEach(test => {
        it(test[DESCRIPTION],() => {
            const result = calendar.isSelected(...test[PARAMETERS]);
            expect(result).to.equal(false);
        });
    });
});
