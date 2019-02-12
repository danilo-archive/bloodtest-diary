var id_gen = require("./id_generator");

var date = new Date();

var all = [];

for (var i = 1; i < 1000001; i++) {
    all.push(id_gen.generateUniqueID(date));
    if (i % 10000 === 0) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write((i / 10000) + " %");
    }
}
console.log("\nall generated");
 
console.log("sorting");

var sorted = all.sort();

console.log("sorted");

console.log("comparing:");

var allUnique = true;

for (var i = 0; i < sorted.length - 1; i++) {
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
    console.log("\nAll IDs are unique.");
}
else {
    console.log("\nDuplicates were found!!");
}
