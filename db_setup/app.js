const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "bloodTestAdmin",
    password: "Blood_admin1",
    database: "BloodTestDB"
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
    var sql = "SELECT * FROM Patient LIMIT 5";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result);
    });
});

