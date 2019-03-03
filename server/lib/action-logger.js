/**
 * This module provides some functions for faster 
 * logging of different actions on the DB. 
 * 
 * @author Luka Kralj
 * @version 1.0
 * 
 * @module action-logger
 */

module.exports = {
    logInsert,
    logUpdate,
    logDelete
};

const  mysql = require('mysql');
const db_controller = require('./db_controller/db-controller');
const dateFormat = require('dateformat');

/**
 * Call this to log an insert action.
 *
 * @param {string} username User that has done that action.
 * @param {string} tableName The table that was involved in the action.
 * @param {string} entryID The key of the entry from the previous table that was involved in the action.
 * @param {string} message Optional message that can provide more details about the action.
 */
function logInsert(username, tableName, entryID, message) {
    log("insert", username, tableName, entryID, message);
}

/**
 * Call this to log an update action.
 *
 * @param {string} username User that has done that action.
 * @param {string} tableName The table that was involved in the action.
 * @param {string} entryID The key of the entry from the previous table that was involved in the action.
 * @param {string} message Optional message that can provide more details about the action.
 */
function logUpdate(username, tableName, entryID, message) {
    log("update", username, tableName, entryID, message);
}

/**
 * Call this to log a delete action.
 *
 * @param {string} username User that has done that action.
 * @param {string} tableName The table that was involved in the action.
 * @param {string} entryID The key of the entry from the previous table that was involved in the action.
 * @param {string} message Optional message that can provide more details about the action.
 */
function logDelete(username, tableName, entryID, message) {
    log("delete", username, tableName, entryID, message);
}

/**
 * Helper function to reduce duplication.
 *
 * @param {string} type Type of action taken: insert, update or delete.
 * @param {string} username User that has done that action.
 * @param {string} tableName The table that was involved in the action.
 * @param {string} entryID The key of the entry from the previous table that was involved in the action.
 * @param {string} message Optional message that can provide more details about the action.
 */
function log(type, username, tableName, entryID, message) {
    if (username === undefined || tableName === undefined || entryID === undefined) {
        throw new Error("Invalid use of a logger function.");
    }
    message = (message === undefined) ? "NULL" : message;
    let date = new Date();
    date = dateFormat(date, "yyyymmddHHMMss");

    let sql = "INSERT INTO ActionLog " + 
        "(username, action_timestamp, action_type, table_affected, entry_affected, additional_info)" +
        "VALUES (?, ?, ?, ?, ?, ?)";
    sql = mysql.format(sql, [username, date, type, tableName, entryID, message]);

    let s = "";
    switch (type) {
        case "insert": s =  "inserted"; break;
        case "update": s =  "updated"; break;
        case "delete": s =  "deleted"; break;
        default: throw new Error("Invalid type.");
    }

    db_controller.insertQuery(sql)
    .then((result) => {
        if (result.status === "OK") {
            console.log("Successful log: " + username + " " + s + " " + tableName + "(" + entryID + ").");
        }
        else {
            console.log("===========================");
            console.log("ERROR logging: " + username + " " + s + " " + tableName + "(" + entryID + "):");
            console.log(result.err);
            console.log("===========================");
        }
    });
}
