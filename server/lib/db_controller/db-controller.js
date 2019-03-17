/**
 * This module enables secure execution of the basic queries. It prevents
 * deleting any entry that some user might be editing at the moment.
 * It also prevents editing the entry if someone else is already editing it.
 * 
 * It does so through token exchange system that gives editing rights to whoever
 * obtains it. The token only works for a particular entry in the database.
 * 
 * Additionally, the functions for critical queries deleteQuery, updateQuery and 
 * requestEditing will never be executed synchronously. This is implemented with an
 * adapted Bakery algorithm.
 * 
 * @author Luka Kralj
 * @version 1.0
 * 
 * @module db-controller
 */

module.exports = {
    selectQuery,
    insertQuery,
    deleteQuery,
    updateQuery,
    requestEditing,
    refreshToken,
    cancelEditing,
    updateAccessToken,
    deleteAccessToken
};

const mysql = require("mysql");
const tokenGenerator = require("./token-generator");
const dateformat = require("dateformat");
const databaseConfig = require("../../config/database");
const Database = require("./Database");

const TOKEN_VALIDITY_MINUTES = 30;

// Needed to ensure that critical queries are never executed concurrently.
let current = 0;
let next = 0;

/**
 * Call this for SELECT queries.
 *
 * @param {string} sql The SQL query.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function selectQuery(sql) {
    return await nonCriticalQuery(sql, "select", async (result) => {
        const rows_ = [];
        for (const key in result) {
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
            affectedRows: result.affectedRows,
            insertId: result.insertId
        }
    })
}

/**
 * Call this for DELETE queries.
 *
 * @param {string} sql The SQL query.
 * @param {string} entryTable Name of the table involved in the query.
 * @param {string} entryID Key of the entry that is being deleted.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function deleteQuery(sql, entryTable, entryID) {
    const waitFor = next;
    next++;
    while (waitFor != current) {
        // waiting for the lock...
        await sleep(1);
    }

    if (!startsWith(sql, "delete") || entryTable === undefined || entryID === undefined) {
        current++;
        throw new Error("Invalid use of deleteQuery.");
    }

    const database = new Database(databaseConfig);
    let response = undefined;
    
    await isValidEntry(database, entryTable, entryID)
    .then(async (isValid) => {
        if (!isValid) {
            response = await getErrResponse("Invalid entry table and entry ID pair.");
        }
    })
    
    if (response !== undefined) {
        database.close();
        current++;
        return response;
    }
    
    await editTokensEntryExists(database, entryTable, entryID)
    .then(async (result) => {
        if (result) {
            response = await getErrResponse("Entry is being modified and cannot be deleted.");
        }
        else {
            // free to delete
            response = await getResult(sql, database, async (result) => {
                return {
                    query: "OK",
                    affectedRows: result.affectedRows
                };
            });
        } 
    });
    
    database.close();
    current++;
    return response;
}

/**
 * Call this for UPDATE queries.
 *
 * @param {string} sql The SQL query.
 * @param {string} entryTable Name of the table involved in the query.
 * @param {string} entryID Key of the entry that is being updated.
 * @param {string} token Token that is used for verifying the edit permissions.
 * @returns {Promise<JSON>} JSON object that contains response data or error message, if the query was unsuccessful.
 */
async function updateQuery(sql, entryTable, entryID, token) {
    const waitFor = next;
    next++;
    while (waitFor != current) {
        // waiting for the lock...
        await sleep(1);
    }

    if (!startsWith(sql, "update") || entryTable === undefined || entryID === undefined || token === undefined) {
        current++;
        throw new Error("Invalid use of updateQuery.");
    }

    const database = new Database(databaseConfig);

    let response = undefined;
    await isValidEntry(database, entryTable, entryID)
    .then(async (isValid) => {
        if (!isValid) {
            response = await getErrResponse("Invalid entry table and entry ID pair.");
        }
    })

    if (response !== undefined) {
        database.close();
        current++;
        return response;
    }

    await editTokensEntryExists(database, entryTable, entryID, token)
    .then(async (result) => {
        if (result) {
             // Token is valid. Execute query:
            response = await getResult(sql, database, async (result) => {
                return {
                    query: "OK",
                    affectedRows: result.affectedRows,
                    changedRows: result.changedRows
                };
            });
        }
        else {
            response = await getErrResponse("Invalid or missing token.");
        }
    });

    if (response.status !== "OK") {
        database.close();
        current++;
        return response;
    }

    // delete token
    let deleteQuery = "DELETE FROM EditTokens WHERE token = ?";
    deleteQuery = mysql.format(deleteQuery, [token]);
    await getResult(deleteQuery, database, async (result) => {
        if (result.affectedRows != 1) {
            console.log(result);
            console.log("ERROR WHEN DELETING A TOKEN (" + token + ")!");
        }
        return result;
    });

    database.close();
    current++;
    return response;
}

/**
 * Request editing for the specific entry.
 *
 * @param {string} entryTable Table that we want to edit.
 * @param {string} entryID ID of the entry in that table that we want to edit.
 * @returns {Promise<JSON>} Response containing the valid token, or error message.
 */
async function requestEditing(entryTable, entryID) {
    const waitFor = next;
    next++;
    while (waitFor != current) {
        // waiting for the lock...
        await sleep(1);
    }

    if (entryTable === undefined || entryID === undefined) {
        current++;
        throw new Error("Invalid use of requestEditing.");
    }

    const database = new Database(databaseConfig);

    let response = undefined;

    await isValidEntry(database, entryTable, entryID)
    .then(async (isValid) => {
        if (!isValid) {
            response = await getErrResponse("Invalid entry table and entry ID pair.");
        }
    })

    if (response !== undefined) {
        database.close();
        current++;
        return response;
    }

    await editTokensEntryExists(database, entryTable, entryID)
    .then(async (result) => {
        if (result) {
            response = await getErrResponse("Entry is being modified and cannot be edited.");
        }
        else {
            response = getSuccessfulResponse(null);
        } 
    });

    if (response.status !== "OK") {
        database.close();
        current++;
        return response;
    }

    // entry is not being edited, generate token, store it and return it
    const token_ = tokenGenerator.generateToken();
    const nowDate = new Date();
    nowDate.setMinutes(nowDate.getMinutes() + TOKEN_VALIDITY_MINUTES);
    const expires = dateformat(nowDate, "yyyymmddHHMMss");
    const insertQuery = mysql.format("INSERT INTO EditTokens VALUES (?, ?, ?, ?)", 
                                        [token_, entryTable, entryID, expires]);

    response = await getResult(insertQuery, database, () => {
        return {
            token: token_,
            expires: dateformat(nowDate, "yyyy-mm-dd HH:MM:ss")
        };
    });

    database.close();
    current++;
    return response;
}

/**
 * Call this to refresh the current token. This will generate a new token
 * with a new expiration time. If the token is invalid, an error
 * message will be returned.
 *
 * @param {string} entryTable Name of the table that we are editing.
 * @param {string} entryID Key of the entry that we are editing
 * @param {string} token Token that is used for verifying the edit permissions.
 * @returns {Promise<JSON>} JSON object that contains response data or error message.
 */
async function refreshToken(entryTable, entryID, token) {
    if (entryTable === undefined || entryID === undefined || token === undefined) {
        throw new Error("Invalid use of refreshToken.");
    }

    const database = new Database(databaseConfig);

    let response = undefined;
    await editTokensEntryExists(database, entryTable, entryID, token)
    .then(async (result) => {
        if (result) {
            // Token is valid. Update it.
            const sql = mysql.format("DELETE FROM EditTokens WHERE token = ?", [token]); 
            await getResult(sql, database, (result) => {
                return result;
            });

            const token_ = tokenGenerator.generateToken();
            const nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes() + TOKEN_VALIDITY_MINUTES);
            const expires = dateformat(nowDate, "yyyymmddHHMMss");
            const insertQuery = mysql.format("INSERT INTO EditTokens VALUES (?, ?, ?, ?)", 
                                                [token_, entryTable, entryID, expires]);

            response = await getResult(insertQuery, database, () => {
                return {
                    token: token_,
                    expires: dateformat(nowDate, "yyyy-mm-dd HH:MM:ss")
                };
            });
        }
        else {
            response = await getErrResponse("Invalid token.");
        }
    });

    database.close();
    return response;
}

/**
 * Call this to delete the current token. This will allow other users
 * to edit this entry. If the token is invalid, an error
 * message will be returned.
 *
 * @param {string} entryTable Name of the table that we are editing.
 * @param {string} entryID Key of the entry that we are editing
 * @param {string} token Token that is used for verifying the edit permissions.
 * @returns {Promise<JSON>} JSON object that contains response data or error message.
 */
async function cancelEditing(entryTable, entryID, token) {
    if (entryTable === undefined || entryID === undefined || token === undefined) {
        throw new Error("Invalid use of cancelEditing.");
    }
    const database = new Database(databaseConfig);
    let response = undefined;
    await editTokensEntryExists(database, entryTable, entryID, token)
    .then(async (result) => {
        if (result) {
            // Token is valid. Delete it.
            const sql = mysql.format("DELETE FROM EditTokens WHERE token = ?", [token]); 
            await getResult(sql, database, (result) => {
                return result;
            });

            response = getSuccessfulResponse("Editing successfully cancelled.")
        }
        else {
            response = await getErrResponse("Invalid token.");
        }
    });

    database.close();
    return response;
}

/**
 * Updates the expiration of an access token specified.
 *
 * @param {string} accessToken - Access token we are editing.
 * @param {Date} newExpiration New expiration for this token.
 * @returns {Promise<JSON>} JSON object that contains response data or error message.
 */
async function updateAccessToken(accessToken, newExpiration) {
    let sql = "UPDATE AccessTokens SET expiration = ? WHERE token = ?";
    sql = mysql.format(sql, [dateformat(newExpiration, "yyyymmddHHMMss"), accessToken]);
    const database = new Database(databaseConfig);
    const res = await getResult(sql, database, () => {
        return {status:"OK"};
    });
    database.close();
    if (res.status !== "OK") {
        console.log("Could not update access token expiration in the DB.");
    }
    return res;
}

/**
 * Deletes the access token specified.
 *
 * @param {string} accessToken - Access token we are editing.
 * @returns {Promise<JSON>} JSON object that contains response data or error message.
 */
async function deleteAccessToken(accessToken) {
    let sql = "DELETE FROM AccessTokens WHERE token = ?";
    sql = mysql.format(sql, [accessToken]);
    const database = new Database(databaseConfig);
    const res = await getResult(sql, database, () => {
        return {status:"OK"};
    });
    database.close();
    if (res.status !== "OK") {
        console.log("Could not delete access token in the DB.");
    }
    return res;
}

//=====================================
//  HELPER FUNCTIONS BELOW:
//=====================================

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
        throw new Error("Invalid use of " + type + "Query.");
    }
    const database = new Database(databaseConfig);
    const response = await getResult(sql, database, treatResponse);
    database.close();

    return response;
}

/**
 * Helper function that executes the query.
 *
 * @param {string} sql Query to execute.
 * @param {Database} database Database object to execute the query on.
 * @param {function} treatResponse Decide how the response of a successful query is modified.
 * @returns {JSON} Result of the query or error response, if query unsuccessful.
 */
async function getResult(sql, database, treatResponse) {
    let result = undefined;
    try {
        result = await database.query(sql);
    }
    catch(err) {
        const errResponse = await getSQLErrorResponse(err);
        return errResponse;
    }
    const treated = await treatResponse(result);
    return await getSuccessfulResponse(treated);
}

/**
 * Generate a JSON error response.
 *
 * @param {string} cause
 * @returns {JSON} Error response.
 */
function getErrResponse(cause_) {
    return {
        status: "ERR",
        err: {
            type: "Invalid request.",
            cause: cause_
        }
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
    return {
        status: "ERR",
        err: {
            type: "SQL Error",
            code: err.code,
            errno: err.errno,
            sqlMessage: err.sqlMessage
        }
    };
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
 * Check if the entry with the given parameters exists in the EditTokens table.
 *
 * @param {Database} database
 * @param {string} entryTable
 * @param {string} entryID
 * @param {string} token
 * @returns {Promise<boolean>} True if such entry exists, false if not.
 */
async function editTokensEntryExists(database, entryTable, entryID, token) {
    if (database === undefined || entryTable === undefined || entryID === undefined) {
        return await Promise.reject("Invalid use of entryExists.");
    }

    let tokenQuery = "SELECT * FROM EditTokens "
    tokenQuery += "WHERE table_name = ? AND table_key = ?";
    const options = [entryTable, entryID];
    if (token !== undefined) {
        tokenQuery += " AND token = ?";
        options.push(token);
    }
    tokenQuery = mysql.format(tokenQuery, options);

    const queryResult = await getResult(tokenQuery, database, async (result) => {
        if (result.length == 1) {
            const expires = new Date(result[0].expiration);
            if ((expires - new Date()) <= 0) {
                // Token has expired.
                
                let delQuery = "DELETE FROM EditTokens "
                delQuery += "WHERE table_name = ? AND table_key = ?";
                const options = [entryTable, entryID];
                if (token !== undefined) {
                    delQuery += " AND token = ?";
                    options.push(token);
                }
                delQuery = mysql.format(delQuery, options);
                
                await getResult(delQuery, database, async (result) => {
                    if (result.affectedRows != 1) {
                        console.log("=====================");
                        console.log(result);
                        console.log("ERROR WHEN DELETING A TOKEN (" + entryTable + ", " + entryID + ")!");
                        console.log("=====================");
                    }
                    return result;
                });
                
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    });

    if (queryResult.status !== "OK") {
        return false;
    }
    return queryResult.response;
}

/**
 * Checks if the table name and table ID pair actually represent some
 * valid database entry.
 *
 * @param {Database} database
 * @param {string} entryTable
 * @param {string} entryID
 * @returns {Promise<boolean>} True if entry exists, false if not.
 */
async function isValidEntry(database, entryTable, entryID) {
    let primaryKey = undefined;
    switch(entryTable) {
        case "Hospital": primaryKey = "hospital_id"; break;
        case "Patient": primaryKey = "patient_no"; break;
        case "Carer": primaryKey = "carer_id"; break;
        case "Test": primaryKey = "test_id"; break;
        case "User": primaryKey = "username"; break;
    }
    if (primaryKey === undefined) {
        return false;
    }
    
    let sql = "SELECT * FROM " + entryTable + " WHERE " + primaryKey + " = ?";
    sql = mysql.format(sql, [entryID]);
    const response = await getResult(sql, database, (result) => {
        if (result.length > 0) {
            return true;
        }
        else {
            return false;
        }
    });
    
    return response.response;
}

/**
 * Await for this function to pause execution for a certain time.
 *
 * @param {number} ms Time in milliseconds
 * @returns {Promise}
 */
function sleep(ms){
    return new Promise((resolve) => {
        setTimeout(resolve,ms);
    });
}