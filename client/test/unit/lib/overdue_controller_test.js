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
        var tests = [{first_due_date: new Date(2019, 0, 3)}, {first_due_date: new Date(2019, 1, 3)},{first_due_date: new Date(2019, 2, 1)},
                     {first_due_date: new Date(2019, 0, 1)}, {first_due_date: new Date(2017, 12, 1)},{first_due_date: new Date(2019, 1, 20)},
                     {first_due_date: new Date(2019, 1, 13)}, {first_due_date: new Date(2019, 1, 4)}, {first_due_date: new Date(2019, 0, 15)}];

        let result = overdue_controller.sortByOverdueTime(tests, 0, tests.length - 1);
        result[0].first_due_date.getDate().should.equal(1);
        result[0].first_due_date.getMonth().should.equal(0);
        result[0].first_due_date.getFullYear().should.equal(2018);
        result[1].first_due_date.getDate().should.equal(1);
        result[1].first_due_date.getMonth().should.equal(0);
        result[1].first_due_date.getFullYear().should.equal(2019);
        result[2].first_due_date.getDate().should.equal(3);
        result[2].first_due_date.getMonth().should.equal(0);
        result[2].first_due_date.getFullYear().should.equal(2019);
        result[3].first_due_date.getDate().should.equal(15);
        result[3].first_due_date.getMonth().should.equal(0);
        result[3].first_due_date.getFullYear().should.equal(2019);
        result[4].first_due_date.getDate().should.equal(3);
        result[4].first_due_date.getMonth().should.equal(1);
        result[4].first_due_date.getFullYear().should.equal(2019);
        result[5].first_due_date.getDate().should.equal(4);
        result[5].first_due_date.getMonth().should.equal(1);
        result[5].first_due_date.getFullYear().should.equal(2019);
        result[6].first_due_date.getDate().should.equal(13);
        result[6].first_due_date.getMonth().should.equal(1);
        result[6].first_due_date.getFullYear().should.equal(2019);
        result[7].first_due_date.getDate().should.equal(20);
        result[7].first_due_date.getMonth().should.equal(1);
        result[7].first_due_date.getFullYear().should.equal(2019);
        result[8].first_due_date.getDate().should.equal(1);
        result[8].first_due_date.getMonth().should.equal(2);
        result[8].first_due_date.getFullYear().should.equal(2019);
    });
});

describe("Grouping", function (){
    it("shoud correctly group the tests in classes", function (){
        var tests = [{first_due_date: new Date(2019, 0, 3)}, {first_due_date: new Date(2019, 1, 1)},{first_due_date: new Date(2019, 2, 1)},
                     {first_due_date: new Date(2019, 0, 1)}, {first_due_date: new Date(2017, 11, 1)},{first_due_date: new Date(2019, 1, 20)},
                     {first_due_date: new Date(2019, 1, 13)}, {first_due_date: new Date(2019, 1, 4)}, {first_due_date: new Date(2019, 0, 15)}];
        let groups = overdue_controller.testGroup(tests);

        groups[0].class.should.equal("Year+");
        groups[0].tests.length.should.equal(1);
            groups[0].tests[0].first_due_date.getDate().should.equal(1);
            groups[0].tests[0].first_due_date.getMonth().should.equal(11);
            groups[0].tests[0].first_due_date.getFullYear().should.equal(2017);
        groups[1].class.should.equal("6+ months");
        groups[1].tests.length.should.equal(0);

        groups[2].class.should.equal("1-6 months");
        groups[2].tests.length.should.equal(3);
            groups[2].tests[0].first_due_date.getDate().should.equal(1);
            groups[2].tests[0].first_due_date.getMonth().should.equal(0);
            groups[2].tests[0].first_due_date.getFullYear().should.equal(2019);
            groups[2].tests[1].first_due_date.getDate().should.equal(3);
            groups[2].tests[1].first_due_date.getMonth().should.equal(0);
            groups[2].tests[1].first_due_date.getFullYear().should.equal(2019);
            groups[2].tests[2].first_due_date.getDate().should.equal(15);
            groups[2].tests[2].first_due_date.getMonth().should.equal(0);
            groups[2].tests[2].first_due_date.getFullYear().should.equal(2019);

        groups[3].class.should.equal("2-4 weeks");
        groups[3].tests.length.should.equal(3);
            groups[3].tests[0].first_due_date.getDate().should.equal(1);
            groups[3].tests[0].first_due_date.getMonth().should.equal(1);
            groups[3].tests[0].first_due_date.getFullYear().should.equal(2019);
            groups[3].tests[1].first_due_date.getDate().should.equal(4);
            groups[3].tests[1].first_due_date.getMonth().should.equal(1);
            groups[3].tests[1].first_due_date.getFullYear().should.equal(2019);
            groups[3].tests[2].first_due_date.getDate().should.equal(13);
            groups[3].tests[2].first_due_date.getMonth().should.equal(1);
            groups[3].tests[2].first_due_date.getFullYear().should.equal(2019);

        groups[4].class.should.equal("Less than 2 weeks");
        groups[4].tests.length.should.equal(2);
            groups[4].tests[0].first_due_date.getDate().should.equal(20);
            groups[4].tests[0].first_due_date.getMonth().should.equal(1);
            groups[4].tests[0].first_due_date.getFullYear().should.equal(2019);
            groups[4].tests[1].first_due_date.getDate().should.equal(1);
            groups[4].tests[1].first_due_date.getMonth().should.equal(2);
            groups[4].tests[1].first_due_date.getFullYear().should.equal(2019);
    });
});
