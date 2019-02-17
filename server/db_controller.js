const mysql = require("mysql");

/**
 * Promisify mysql.
 * Source: https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
 *
 * @class Database
 */
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
        this.connection.beginTransaction();
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
        this.connection.commit();
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

const databaseConfig = {
    host: "localhost",
    user: "bloodTestAdmin",
    password: "Blood_admin1",
    database: "BloodTestDB"
};

/**
 * Shorthand function for comparing the start of a string. Leading spaces
 * and capitalisation are ignored.
 *
 * @param {string} toCheck A string the start of which we want to check.
 * @param {string} compareTo A string that should appear at the start of the toCheck.
 * @returns {boolean} True if toCheck starts with compareTo, false otherwise.
 */
function startsWith(toCheck, compareTo) {
    return toCheck.trim().toLowerCase().startsWith(compareTo.toLowerCase());
}

/**
 * Call this for SELECT queries.
 *
 * @param {string} sql The SQL query.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function selectQuery(sql) {
    return await nonCriticalQuery(sql, "select", async (result) => {
        let rows_ = [];
        for (let key in result) {
            rows_.push(result[key]);
        }
        return {
            query: "OK",
            rows: rows_
        }
    });
}

/**
 * Call this for INSERT queries.
 *
 * @param {string} sql The SQL query.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function insertQuery(sql) {
    return await nonCriticalQuery(sql, "insert", async (result) => {
        return await {
            query: "OK",
            affectedRows: result.affectedRows
        }
    })
}

/**
 * A helper function for insertQuery and selectQuery.
 *
 * @param {string} sql The SQL query.
 * @param {string} type "select" or "insert"
 * @param {function} treatResponse This function is called to format the query response, if 
 *                                  the query was successful.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function nonCriticalQuery(sql, type, treatResponse) {
    if (!startsWith(sql, type)) {
        await Promise.reject("Invalid use of " + type + "Query.");
    }
    const database = new Database(databaseConfig);
    let result = undefined;
    try {
        result = await database.query(sql);
    }
    catch(err) {
        const errResponse = getSQLErrorResponse(err);
        database.close();
        return errResponse;
    }

    const treated = await treatResponse(result);
    database.close();

    return await getSuccessfulResponse(treated);
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
 * Formats the error response to give some information about the query error
 * (type, code, error number, SQL message).
 *
 * @param {Error} err Error thrown by the database query function.
 * @returns {JSON} Formatted error response.
 */
function getSQLErrorResponse(err) {
    return getErrResponse({
        type: "SQL Error",
        code: err.code,
        errno: err.errno,
        sqlMessage: err.sqlMessage
    });
}

/**
 * Formats a successful response. Enables all responses to follow the same format.
 *
 * @param {JSON} response Preformatted query-specific response.
 * @returns {JSON} A formatted response.
 */
function getSuccessfulResponse(response_) {
    return {
        status: "OK",
        response: response_
    }
}

/**
 * Call this for DELETE queries.
 *
 * @param {string} sql The SQL query.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function deleteQuery(sql, entryTable, entryID) {
    if (!startsWith(sql, "delete")) {
        await Promise.reject("Invalid use of deleteQuery.");
    }

    const database = new Database(databaseConfig);

    let tokenQuery = "SELECT * FROM TokenControl "
    tokenQuery += "WHERE table_name = ? AND table_key = ?";
    tokenQuery = mysql.format(tokenQuery, [entryTable, entryID]);

    let queryResult = undefined;
    try {
        queryResult = await database.query(tokenQuery);
    }
    catch(err) {
        const errResponse = getSQLErrorResponse(err);
        database.close();
        return errResponse;
    }
    
    if (queryResult.length == 1) {
        database.close();
        return getErrResponse("Entry is being modified and cannot be deleted.");
    }

    // free to delete

    let result = undefined;
    try {
        result = await database.query(sql);
    }
    catch(err) {
        const errResponse = getSQLErrorResponse(err);
        database.close();
        return errResponse;
    }

    const response = {
        query: "OK",
        affectedRows: result.affectedRows
    }
    database.close();
    return await getSuccessfulResponse(response);
}


/**
 * Call this for DELETE queries.
 *
 * @param {string} sql The SQL query.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function updateQuery(sql, entryTable, entryID, token) {
    if (!startsWith(sql, "update")) {
        await Promise.reject("Invalid use of updateQuery.");
    }

    const database = new Database(databaseConfig);

    let tokenQuery = "SELECT * FROM TokenControl "
    tokenQuery += "WHERE token = ? AND table_name = ? AND table_key = ?";
    tokenQuery = mysql.format(tokenQuery, [token, entryTable, entryID]);

    let queryResult = undefined;
    try {
        queryResult = await database.query(tokenQuery);
    }
    catch(err) {
        const errResponse = getSQLErrorResponse(err);
        database.close();
        return errResponse;
    }
    
    if (queryResult.length != 1) {
        database.close();
        return getErrResponse("Invalid token.");
    }

    // Token is valid. Execute query:

    let result = undefined;
    try {
        result = await database.query(sql);
    }
    catch(err) {
        const errResponse = getSQLErrorResponse(err);
        database.close();
        return errResponse;
    }

    const response = {
        query: "OK",
        affectedRows: result.affectedRows
    };

    // delete token
    const deleteQuery = "DELETE FROM TokenControl WHERE token = ?";
    let deleteResult = undefined;
    try {
        deleteResult = await database.query(deleteQuery, [token]);
    }
    catch(err) {
        console.log("ERROR WHEN DELETING A TOKEN (" + token + "):");
        console.log(JSON.stringify(getSQLErrorResponse(err)));
    }
    if (deleteResult.affectedRows != 1) {
        console.log("ERROR WHEN DELETING A TOKEN (" + token + ")!");
    }
    

    database.close();
    return await getSuccessfulResponse(response);
}









selectQuery("SELECT * FROM Patient LIMIT 1").then((response) => {
    console.log("Select was:\n    " + JSON.stringify(response));
});


insertQuery("insert into Patient (patient_no, patient_name, patient_surname) values ('lukakralj', 'Luka', 'Kralj')")
.then((response) => {
    console.log("Insert was:\n    " + JSON.stringify(response));
});

deleteQuery("DELETE FROM Patient WHERE patient_no = 'lukakralj'", "Patient", "lukakralj").then((response) => {
    console.log("Delete was:\n    " + JSON.stringify(response));
});

updateQuery("UPDATE Patient SET patient_name = 'Luka - modified' WHERE patient_no = 'lukakralj'", "Patient", "lukakralj", "token").then((response) => {
    console.log("Update was:\n    " + JSON.stringify(response));
})

