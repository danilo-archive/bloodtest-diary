const chai = require('chai');
const should = chai.should();

const calendar_controller = require('../../../src/lib/calendar-controller');

/**
 * Test if the getNextDates works when given strings with the right format
 */
describe("Test working frequency formats", function () {
    it('should return 13 dates, each 1 day apart.', function () {
        const expected = [
            new Date(2018, 0, 2),
            new Date(2018, 0, 3),
            new Date(2018, 0, 4),
            new Date(2018, 0, 5),
            new Date(2018, 0, 6),
            new Date(2018, 0, 7),
            new Date(2018, 0, 8),
            new Date(2018, 0, 9),
            new Date(2018, 0, 10),
            new Date(2018, 0, 11),
            new Date(2018, 0, 12),
            new Date(2018, 0, 13),
            new Date(2018, 0, 14),
            new Date(2018, 0, 15),
            new Date(2018, 0, 16)

        ]

        const result = calendar_controller.getNextDates('1-D:15', new Date(2018, 0, 1));

        arraysOfDatesEqual(result, expected).should.be.true;
    });

    it('should return 15 dates, each 1 year apart. Starting from 1st Jan 2018', function () {
        const expected = [
            new Date(2019, 0, 1),
            new Date(2020, 0, 1),
            new Date(2021, 0, 1),
            new Date(2022, 0, 1),
            new Date(2023, 0, 1),
            new Date(2024, 0, 1),
            new Date(2025, 0, 1),
            new Date(2026, 0, 1),
            new Date(2027, 0, 1),
            new Date(2028, 0, 1),
            new Date(2029, 0, 1),
            new Date(2030, 0, 1),
            new Date(2031, 0, 1),
            new Date(2032, 0, 1),
            new Date(2033, 0, 1)
        ]

        const result = calendar_controller.getNextDates('1-Y:15', new Date(2018, 0, 1));

        arraysOfDatesEqual(result, expected).should.be.true
    });

    it('should return 15 dates, each 1 week apart. Starting from 30th Dec 2018', function () {
        const expected = [
            new Date(2019, 0, 6), //1
            new Date(2019, 0, 13), //2
            new Date(2019, 0, 20), //3
            new Date(2019, 0, 27), //4
            new Date(2019, 1, 3), //5
            new Date(2019, 1, 10), //6
            new Date(2019, 1, 17), //7
            new Date(2019, 1, 24), //8
            new Date(2019, 2, 3), //9
            new Date(2019, 2, 10), //10
            new Date(2019, 2, 17), //11
            new Date(2019, 2, 24), //12
            new Date(2019, 2, 31), //13
            new Date(2019, 3, 7), //14
            new Date(2019, 3, 14) //15
        ]

        const result = calendar_controller.getNextDates('1-W:15', new Date(2018, 11, 30));

        arraysOfDatesEqual(result, expected).should.be.true
    });

    it('should return 1/1/2020 when inputting "1-D:1" on the 31/12/2019', function () {
        const expected = [
            new Date(2020, 0, 1)
        ]
        const result = calendar_controller.getNextDates('1-D:1', new Date(2019, 11, 31));

        arraysOfDatesEqual(result, expected).should.be.true;

    });

    it('should return 7/1/2020 when inputting "1-W:1" on the 31/12/2019', function () {
        const expected = [
            new Date(2020, 0, 7)
        ]
        const result = calendar_controller.getNextDates('1-W:1', new Date(2019, 11, 31));

        arraysOfDatesEqual(result, expected).should.be.true;

    });
});

/**
 * Test if the getNextDates returns null when given strings with the wrong format
 */
describe("Test not frequency formats", function () {
    it('should return null on wrong frequency formats', function () {
        const wrong_formats = [
            '', 'a', '-1', 1, null, 0, true, false, [], '-1', 'ß', '1/0', 0.2,
            'Y-4', 'A-Y', '1-R', '/1-D', '0.5-D', 'L-D', '/1-W', '0.5-W', 'L-W',
            '/1-Y', '0.5-Y', 'L-Y'
        ]
        const wrong_n = ['1[', "s", 3, '', 'a', '-1', 1, null, 0, true, false, [], '-1', 'ß', '1/0', 0.2,
            'Y-4', 'A-Y', '1-R', '/1-D', '0.5-D', 'L-D', '/1-W', '0.5-W', 'L-W',
            '/1-W', '0.5-W', 'L-W'
        ]
        wrong_formats.forEach(format => {
            wrong_n.forEach(frequency => {

                const temp = format;
                format += (":" + frequency);
                const result = calendar_controller.getNextDates(format, new Date(2019, 11, 31));
                result.forEach(d => {
                    should.not.exist(d);
                });
                format = temp;
            });
        });
    });
});

describe("Test week handling", function() {
    const testDays = [ (new Date(2019, 01, 20)), (new Date(2019, 02, 1)), (new Date(2019, 05, 20))];
    it ("Should return the correct monday date given any date", function(){
        let results = [];
        testDays.forEach( day => {
            let monday = calendar_controller.getMondayOfWeek(day);
            results = results.concat(monday);
        });

        results[0].getDate().should.equal(18);
        results[0].getMonth().should.equal(01);
        results[0].getFullYear().should.equal(2019);
        results[1].getDate().should.equal(25);
        results[1].getMonth().should.equal(01);
        results[1].getFullYear().should.equal(2019);
        results[2].getDate().should.equal(17);
        results[2].getMonth().should.equal(05);
        results[2].getFullYear().should.equal(2019);

    });

    it ("Should return the correct previous week given a well formed week", function() {

        const weekTest1 = [(new Date(2019, 01, 25)), (new Date(2019, 01, 26)), (new Date(2019, 01, 27)),
                           (new Date(2019, 01, 28)), (new Date(2019, 02, 1))];
        const weekTest2 = [(new Date(2019, 02, 25)), (new Date(2019, 02, 26)), (new Date(2019, 02, 27)),
                           (new Date(2019, 02, 28)), (new Date(2019, 02, 29))];

        var result1 = [];
        calendar_controller.getPreviousWeek(weekTest1).forEach(day => {
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            result1 = result1.concat(day);
        });

        result1[0].getDate().should.equal(18);
        result1[0].getMonth().should.equal(1);
        result1[0].getFullYear().should.equal(2019);
        result1[1].getDate().should.equal(19);
        result1[1].getMonth().should.equal(1);
        result1[1].getFullYear().should.equal(2019);
        result1[2].getDate().should.equal(20);
        result1[2].getMonth().should.equal(1);
        result1[2].getFullYear().should.equal(2019);
        result1[3].getDate().should.equal(21);
        result1[3].getMonth().should.equal(1);
        result1[3].getFullYear().should.equal(2019);
        result1[4].getDate().should.equal(22);
        result1[4].getMonth().should.equal(1);
        result1[4].getFullYear().should.equal(2019);

        var result2 = [];
        calendar_controller.getPreviousWeek(weekTest2).forEach(day => {
            day =  new Date(day.getFullYear(), day.getMonth(), day.getDate());
            result2 = result2.concat(day);
        });

        result2[0].getDate().should.equal(18);
        result2[0].getMonth().should.equal(2);
        result2[0].getFullYear().should.equal(2019);
        result2[1].getDate().should.equal(19);
        result2[1].getMonth().should.equal(2);
        result2[1].getFullYear().should.equal(2019);
        result2[2].getDate().should.equal(20);
        result2[2].getMonth().should.equal(2);
        result2[2].getFullYear().should.equal(2019);
        result2[3].getDate().should.equal(21);
        result2[3].getMonth().should.equal(2);
        result2[3].getFullYear().should.equal(2019);
        result2[4].getDate().should.equal(22);
        result2[4].getMonth().should.equal(2);
        result2[4].getFullYear().should.equal(2019);

    });

    it ("Should return the correct next week given a well formed week", function() {
        const weekTest3 = [(new Date(2019, 01, 25)), (new Date(2019, 01, 26)), (new Date(2019, 01, 27)),
                           (new Date(2019, 01, 28)), (new Date(2019, 02, 1))];

        var result3 = [];
        calendar_controller.getNextWeek(weekTest3).forEach(day => {
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            result3 = result3.concat(day);
        });

        result3[0].getDate().should.equal(4);
        result3[0].getMonth().should.equal(2);
        result3[0].getFullYear().should.equal(2019);
        result3[1].getDate().should.equal(5);
        result3[1].getMonth().should.equal(2);
        result3[1].getFullYear().should.equal(2019);
        result3[2].getDate().should.equal(6);
        result3[2].getMonth().should.equal(2);
        result3[2].getFullYear().should.equal(2019);
        result3[3].getDate().should.equal(7);
        result3[3].getMonth().should.equal(2);
        result3[3].getFullYear().should.equal(2019);
        result3[4].getDate().should.equal(8);
        result3[4].getMonth().should.equal(2);
        result3[4].getFullYear().should.equal(2019);

        const weekTest4 = [(new Date(2019, 02, 25)), (new Date(2019, 02, 26)), (new Date(2019, 02, 27)),
                           (new Date(2019, 02, 28)), (new Date(2019, 02, 29))];

        var result4 = []
        calendar_controller.getNextWeek(weekTest4).forEach(day => {
            day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            result4 = result4.concat(day);
        });

        result4[0].getDate().should.equal(1);
        result4[0].getMonth().should.equal(3);
        result4[0].getFullYear().should.equal(2019);
        result4[1].getDate().should.equal(2);
        result4[1].getMonth().should.equal(3);
        result4[1].getFullYear().should.equal(2019);
        result4[2].getDate().should.equal(3);
        result4[2].getMonth().should.equal(3);
        result4[2].getFullYear().should.equal(2019);
        result4[3].getDate().should.equal(4);
        result4[3].getMonth().should.equal(3);
        result4[3].getFullYear().should.equal(2019);
        result4[4].getDate().should.equal(5);
        result4[4].getMonth().should.equal(3);
        result4[4].getFullYear().should.equal(2019);
    });

});

/**
 * Check if two arrays containing dates have
 * the same values
 * @param {array1} _arr1
 * @param {array2} _arr2
 */
function arraysOfDatesEqual(_arr1, _arr2) {

    if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length)
        return false;

    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();

    for (let i = 0; i < arr1.length; i++) {

        if (arr1[i].getDate() != arr2[i].getDate())
            return false;
        if (arr1[i].getMonth() != arr2[i].getMonth())
            return false;
        if (arr1[i].getFullYear() != arr2[i].getFullYear())
            return false;

    }

    return true;

}
