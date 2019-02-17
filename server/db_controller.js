const mysql = require("mysql");

// https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

let databaseConfig = {
    host: "localhost",
    user: "bloodTestAdmin",
    password: "Blood_admin1",
    database: "BloodTestDB"
};

function startsWith(sql, start) {
    return sql.trim().toLowerCase().startsWith(start.toLowerCase());
}

/**
 * Call this for SELECT and INSERT queries.
 *
 * @param {string} sql The SQL query.
 * @param {function} treatResponse A callback function that is used to parse/label the 
 *                                  response that the query returns, if successful.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function selectQuery(sql) {
    if (!startsWith(sql, "select")) {
        throw new Error("Invalid use of selectQuery.");
    }
    const database = new Database(databaseConfig);
    let result = undefined;
    try {
        result = await database.query(sql);
    }
    catch(err) {
        database.close();
        return getErrResponse("Query failed.");
    }

    let rows = [];
    for (let key in result) {
        rows.push(result[key]);
    }

    database.close();

    return await {
        status: "OK",
        response: rows
    }
}

async function insertQuery(sql) {
    if (!startsWith(sql, "insert")) {
        throw new Error("Invalid use of insertQuery.");
    }
    const database = new Database(databaseConfig);
    let result = undefined;
    try {
        result = await database.query(sql);
    }
    catch(err) {
        database.close();
        return getErrResponse("Query failed.");
    }

    let inserted = result.affectedRows;
    database.close();
    return await {
        status: "OK",
        response: "Successfully inserted " + inserted + " row(s)."
    }
}




/**
 * Generate a JSON error response.
 *
 * @param {string} cause
 * @returns {JSON} Error response.
 */
function getErrResponse(cause) {
    return {
        status: "ERR",
        err: cause
    };
}

/**
 * Call this for UPDATE and DELETE queries.
 *
 * @param {string} sql The SQL query.
 * @param {function} treatResponse A callback function that is used to parse/label the 
 *                                  response that the query returns, if successful.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function criticalQuery(sql, tableName, tableKey, token, treatResult) {

    let result = undefined;
    try {
        let query = "SELECT * FROM TokenControl "
        query += "WHERE token = ? AND table_name = ? AND table_key = ?";

        result = await database.query(query, [token, tableName, tableKey])
    }
    catch(err) {
        database.close();
        return getErrResponse("Query failed.");
    }

    if (result.length != 1) {
        database.close();
        return getErrResponse("Invalid token.");
    }
    // else token is valid

}




selectQuery("SELECT * FROM Patient LIMIT 1").then((response) => {
    console.log("Select was:\n" + JSON.stringify(response));
});

insertQuery("insert into Patient (patient_no, patient_name, patient_surname) values ('k123410', 'Luka', 'Kralj')")
.then((response) => {
    console.log("Insert was:\n" + JSON.stringify(response));
});


