/**
 * This file contains tests that test the behaviour of token-generator.js
 *
 * @author Luka Kralj
 * @version 1.0
 *
 * @module token-generator-test
 * @see module:token-generator
 */

const expect = require("chai").expect;
const calendarController = require('../../../lib/calendar-functions');
const dateformat = require('dateformat');

describe("Test calendar controller:", () => {

    describe("Test with invalid arguments:", () => {
        describe("> 'undefined' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate(undefined, new Date())).to.be.null;
            });
        });
        describe("> 'null' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate(null, new Date())).to.be.null;
            });
        });
        describe("> 'null' (as string) (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("null", new Date())).to.be.null;
            });
        });
        describe("> 'randText' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("randText", new Date())).to.be.null;
            });
        });
        describe("> 'rand-Text' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("rand-Text", new Date())).to.be.null;
            });
        });
        describe("> '' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("", new Date())).to.be.null;
            });
        });
        describe("> '4-D-3' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4-D-3", new Date())).to.be.null;
            });
        });
        describe("> '-D' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("-D", new Date())).to.be.null;
            });
        });
        describe("> '4-' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4-", new Date())).to.be.null;
            });
        });
        describe("> '4--Y' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4--Y", new Date())).to.be.null;
            });
        });
        describe("> '4-5' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4-5", new Date())).to.be.null;
            });
        });
        describe("> '4-M' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4-M", new Date())).to.be.null;
            });
        });
        describe("> '4-five' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("randText", new Date())).to.be.null;
            });
        });
        describe("> '4-d' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("randText", new Date())).to.be.null;
            });
        });
        describe("> '4-y' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("randText", new Date())).to.be.null;
            });
        });
        describe("> '4-w' (& valid date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("randText", new Date())).to.be.null;
            });
        });


        describe("> '4-D' (valid) & empty date):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4-D", "")).to.be.null;
            });
        });
        describe("> '4-D' (valid) & 'undefined'):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4-D", undefined)).to.be.null;
            });
        });
        describe("> '4-D' (valid) & 'null'):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4-D", null)).to.be.null;
            });
        });
        describe("> '4-D' (valid) & 'null' (as string)):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4-D", "null")).to.be.null;
            });
        });
        describe("> '4-D' (valid) & '20190822'):", () => {
            it("Should return null.", () => {
                expect(calendarController.getNextDueDate("4-D", "20190822")).to.be.null;
            });
        });
    });

    describe("Test with valid arguments:", () => {
        describe("> '1-Y' & 12 Mar 2019:", () => {
            it("Should return 14 Mar 2020.", () => {
                const param = new Date("2019-03-12");
                let actual = calendarController.getNextDueDate("1-Y", param);
                actual = dateformat(actual, "yyyymmdd")
                const expected = "20200314";
                expect(actual).to.equal(expected);
            });
        });
        describe("> '1-Y' & 14 Mar 2019 (check Saturday):", () => {
            it("Should return 14 Mar 2020.", () => {
                const param = new Date("2019-03-14");
                let actual = calendarController.getNextDueDate("1-Y", param);
                actual = dateformat(actual, "yyyymmdd")
                const expected = "20200314";
                expect(actual).to.equal(expected);
            });
        });
        describe("> '5-D' & 12 Mar 2019 (check Sunday):", () => {
            it("Should return 19 Mar 2019.", () => {
                const param = new Date("2019-03-12");
                let actual = calendarController.getNextDueDate("5-D", param);
                actual = dateformat(actual, "yyyymmdd")
                const expected = "20190317";
                expect(actual).to.equal(expected);
            });
        });
        describe("> '4-W' & 1 Feb 2019:", () => {
            it("Should return 1 Mar 2019.", () => {
                const param = new Date("2019-02-01");
                let actual = calendarController.getNextDueDate("4-W", param);
                actual = dateformat(actual, "yyyymmdd")
                const expected = "20190302";
                expect(actual).to.equal(expected);
            });
        });
        describe("> '7-D' & 12 Apr 2019 (holiday + weekend + holiday):", () => {
            it("Should return 23 Apr 2019.", () => {
                const param = new Date("2019-04-12");
                let actual = calendarController.getNextDueDate("7-D", param);
                actual = dateformat(actual, "yyyymmdd")
                const expected = "20190420";
                expect(actual).to.equal(expected);
            });
        });
    });
});
