const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "bloodTestAdmin",
    password: "Blood_admin1",
    database: "BloodTestDB"
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
    const sql = "SELECT * FROM Patient LIMIT 5";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result);
    });
});

