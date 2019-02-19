/**
 * This file contains tests that test the behaviour of tokenGenerator.js
 * 
 * @author Luka Kralj
 * @version 1.0
 * 
 * @module tokenGeneratorTest
 * @see module:tokenGenerator
 */

const expect = require("chai").expect;
const id_gen = require("../../lib/tokenGenerator");

/**
 * Generates and compares 10000 tokens.
 * 
 * @returns {boolean} true if all tokens are unique, false if not.
 */
function testUniqueness() {
    console.log("      Testing uniqueness of 10000 tokens:")
    const all = [];

    for (let i = 1; i < 10001; i++) {
        all.push(id_gen.generateToken());
        if (i % 100 === 0) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write("        " + (i / 100) + " %");
        }
    }
    console.log("\n        all generated");
     
    console.log("        sorting...");
    
    const sorted = all.sort();
    
    console.log("        sorted");
    
    console.log("        comparing...");
    
    let allUnique = true;
    
    for (let i = 0; i < sorted.length - 1; i++) {
        if (i % (sorted.length/100) === 0) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write("        " + (i / sorted.length * 100) + " %");
        }
        
        if (sorted[i] === sorted[i+1]) {
            allUnique = false;
            break;
        }
    }
    
    if (allUnique) {
        console.log("\n        All tokens are unique.");
        return true;
    }
    else {
        console.log("\n        Duplicates were found!!");
        return false;
    }
}

describe("Test token generator:", () => {
    describe("testUniqueness()", () => {

        it("Should return true - all tokens are unique.", (done) => {
            expect(testUniqueness()).to.be.true;
            done();
        });
    });
});
