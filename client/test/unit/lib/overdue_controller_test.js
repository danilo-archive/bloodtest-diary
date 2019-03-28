const chai = require('chai');
const should = chai.should();

const overdue_controller = require('../../../src/lib/overdue-controller');


describe("Test distance between two dates", function() {
    it("should return 0 if the two dates are on the same day", function() {
        overdue_controller.daysBetweenDates(new Date(2019, 01, 03), new Date(2019, 01, 03))
            .should.equal(0);
        overdue_controller.daysBetweenDates(new Date(2012, 12, 01), new Date(2012, 12, 01))
            .should.equal(0);
        overdue_controller.daysBetweenDates(new Date(2019, 01, 28), new Date(2019, 01, 28))
            .should.equal(0);
    });

    it("should return the correct number of days between two well formed dates", function() {
        overdue_controller.daysBetweenDates(new Date(2019, 01, 03), new Date(2019, 01, 04))
            .should.equal(1);
        overdue_controller.daysBetweenDates(new Date(2019, 01, 03), new Date(2019, 01, 05))
            .should.equal(2);
        overdue_controller.daysBetweenDates(new Date(2019, 01, 03), new Date(2019, 01, 10))
            .should.equal(7);
        overdue_controller.daysBetweenDates(new Date(2019, 01, 24), new Date(2019, 08, 25))
            .should.equal(213);
        overdue_controller.daysBetweenDates(new Date(2019, 01, 24), new Date(2019, 08, 25))
            .should.equal(213);
        overdue_controller.daysBetweenDates(new Date(2019, 00, 1), new Date(2019, 11, 30))
            .should.equal(363);
        overdue_controller.daysBetweenDates(new Date(2014, 3, 4), new Date(2019, 06, 28))
            .should.equal(1941);
    });
});

describe("Tests sorting", function() {
    it ("should return the correct sorted list based on how overdue the tests are", function(){
        var tests = [{due_date: new Date(2019, 0, 3)}, {due_date: new Date(2019, 1, 3)},{due_date: new Date(2019, 2, 1)},
                     {due_date: new Date(2019, 0, 1)}, {due_date: new Date(2017, 12, 1)},{due_date: new Date(2019, 1, 20)},
                     {due_date: new Date(2019, 1, 13)}, {due_date: new Date(2019, 1, 4)}, {due_date: new Date(2019, 0, 15)}];

        let result = overdue_controller.sortByOverdueTime(tests, 0, tests.length - 1);
        result[0].due_date.getDate().should.equal(1);
        result[0].due_date.getMonth().should.equal(0);
        result[0].due_date.getFullYear().should.equal(2018);
        result[1].due_date.getDate().should.equal(1);
        result[1].due_date.getMonth().should.equal(0);
        result[1].due_date.getFullYear().should.equal(2019);
        result[2].due_date.getDate().should.equal(3);
        result[2].due_date.getMonth().should.equal(0);
        result[2].due_date.getFullYear().should.equal(2019);
        result[3].due_date.getDate().should.equal(15);
        result[3].due_date.getMonth().should.equal(0);
        result[3].due_date.getFullYear().should.equal(2019);
        result[4].due_date.getDate().should.equal(3);
        result[4].due_date.getMonth().should.equal(1);
        result[4].due_date.getFullYear().should.equal(2019);
        result[5].due_date.getDate().should.equal(4);
        result[5].due_date.getMonth().should.equal(1);
        result[5].due_date.getFullYear().should.equal(2019);
        result[6].due_date.getDate().should.equal(13);
        result[6].due_date.getMonth().should.equal(1);
        result[6].due_date.getFullYear().should.equal(2019);
        result[7].due_date.getDate().should.equal(20);
        result[7].due_date.getMonth().should.equal(1);
        result[7].due_date.getFullYear().should.equal(2019);
        result[8].due_date.getDate().should.equal(1);
        result[8].due_date.getMonth().should.equal(2);
        result[8].due_date.getFullYear().should.equal(2019);
    });
});

