const chai = require('chai');
const should = chai.should();

const calendar_controller = require('../../../lib/calendar-controller');

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