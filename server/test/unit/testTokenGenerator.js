const expect = require("chai").expect;
const id_gen = require("../../lib/tokenGenerator");

function testUniqueness() {
    console.log("Testing uniqueness of 1M tokens.")
    const all = [];

    for (let i = 1; i < 1000001; i++) {
        all.push(id_gen.generateToken());
        if (i % 10000 === 0) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write((i / 10000) + " %");
        }
    }
    console.log("\nall generated");
     
    console.log("sorting");
    
    const sorted = all.sort();
    
    console.log("sorted");
    
    console.log("comparing:");
    
    let allUnique = true;
    
    for (let i = 0; i < sorted.length - 1; i++) {
        if (i % (sorted.length/100) === 0) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write((i / sorted.length * 100) + " %");
        }
        
        if (sorted[i] === sorted[i+1]) {
            allUnique = false;
            break;
        }
    }
    
    if (allUnique) {
        console.log("\nAll tokens are unique.");
        return true;
    }
    else {
        console.log("\nDuplicates were found!!");
        return false;
    }
}

describe("testUniqueness()", () => {

    // This test will take longer to execute because there are million cases.
    const minutes = 1; // how many minutes is the test allowed to run for

    it("Should return true - all tokens are unique.", (done) => {
        expect(testUniqueness()).to.be.true;
        done();
    }).timeout(minutes*60*1000);
})