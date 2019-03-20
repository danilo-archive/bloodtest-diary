const chai = require('chai');
const should = chai.should();

const InputChecker= require("../../../src/lib/inputChecker");

describe("Test empty check", function () {
    it("should return true", function () {
       InputChecker.emptyCheck("").should.equal(true);
       InputChecker.emptyCheck(undefined).should.equal(true);
       InputChecker.emptyCheck(null).should.equal(true);
       InputChecker.emptyCheck().should.equal(true);
    });

    it("should return false", function () {
        InputChecker.emptyCheck(" ").should.equal(false);
        InputChecker.emptyCheck("null").should.equal(false);
        InputChecker.emptyCheck("undefined").should.equal(false);
        InputChecker.emptyCheck("Some test value").should.equal(false);
    });
});

describe("Test integer check", function () {
    it("should return true", function () {
       InputChecker.integerCheck("1234").should.equal(true);
       InputChecker.integerCheck("0").should.equal(true);
    });
    it("should return false", function () {
        InputChecker.integerCheck("-11").should.equal(false);
        InputChecker.integerCheck().should.equal(false);
        InputChecker.integerCheck("definitely not number").should.equal(false);
        InputChecker.integerCheck("012124").should.equal(false);
        InputChecker.integerCheck("+-*/4").should.equal(false);
    });
});

describe("Test character check", function () {
    it("should return true", function () {
        InputChecker.characterCheck("abc").should.equal(true);
        InputChecker.characterCheck("RandomText").should.equal(true);
    });
    it("should return false", function () {
        InputChecker.characterCheck("423").should.equal(false);
        InputChecker.characterCheck("*-/*a").should.equal(false);
        InputChecker.characterCheck("Test with spaces").should.equal(false);
    });
});

describe("Test email check", function () {
    it("should return true", function () {
        InputChecker.emailCheck("something@something.something").should.equal(true);
        InputChecker.emailCheck("123something123@123.123").should.equal(true);
    });
    it("should return false", function () {
        InputChecker.emailCheck("some test value").should.equal(false);
        InputChecker.emailCheck("some.test@value").should.equal(false);
        InputChecker.emailCheck("123@@@@value").should.equal(false);
    })
});