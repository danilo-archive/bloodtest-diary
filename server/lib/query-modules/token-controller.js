const actionLogger = require("../action-logger");
const databaseController = require("../db_controller/db-controller.js");

/**
 * Request editing of an entry in table
 * @param {String} table - Table to edit
 * @param {String} id - id to edit
 * @param {string} actionUsername The user who issued the request.
 * @return {String} token
 **/
async function requestEditing(table, id, actionUsername) {
    const data = await databaseController.requestEditing(table, id).then(data => {
        return data;
    });
    // TODO: return token + expiration
    if (data.status == "OK") {
        actionLogger.logOther(actionUsername,table,id,"Request for editing was approved.");
        return data.response.token;
    } else {
        actionLogger.logOther(actionUsername,table,id,"Request for editing was rejected with message: >>" +data.err.cause +"<<.");
        return undefined;
    }
}

/**
 * Cancel editing on an entry
 * @param {String} table - Table of an entry
 * @param {String} id - id value of an entry
 * @param {String} token - token to return
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result - {success:Boolean response:"Token cancelled"/Error}
 **/
async function returnToken(table, id, token, actionUsername) {
    const response = await databaseController.cancelEditing(table, id, token);
    if (response.status === "OK") {
        actionLogger.logOther(actionUsername, table, id, "Successfully released token.");
        return { success: true, response: "Token cancelled" };
    } else if (response.err.type === "SQL Error") {
        actionLogger.logOther(actionUsername,table,id,"Unsuccessfully tried to release token. SQL Error message: >>" +response.err.sqlMessage +"<<.");
    } else {
        actionLogger.logOther(actionUsername,table,id,"Unsuccessfully tried to release token. Invalid request error message: >>" +response.err.cause +"<<.");
    }
    return { success: false, response: response.err };
}

module.exports = {
requestEditing,
returnToken,
};
