var id_gen = require("./id_generator");

var date = new Date();

var all = [];

for (var i = 0; i < 1000000; i++) {
    all.push(id_gen.generateUniqueID(date));
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

if (all.length === all.filter(onlyUnique).length) {
    console.log("All IDs are unique.");
}
else {
    console.log("Duplicates were found!!");
}
