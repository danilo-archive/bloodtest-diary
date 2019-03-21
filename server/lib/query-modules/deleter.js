const actionLogger = require("../action-logger");
const selecter = require("./selecter");
const databaseController = require("../db_controller/db-controller.js");
const mysql = require("mysql");

/**
 * Delete Carer entry from database
 *@param {String} carerid - id of a carer to be deleted
 * @param {string} actionUsername The user who issued the request.
 *@return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
 **/
async function deleteCarer(carerid, actionUsername) {
    const sql = prepareDeleteSQL("Carer", "carer_id", carerid);
    return await deleteQueryDatabase("Carer", carerid, sql, actionUsername);
}

/**
 * Delete hospital entry from database
 * @param {String} hospitalid - id of a hospital to be deleted
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
 **/
async function deleteHospital(hospitalid, actionUsername) {
    const sql = prepareDeleteSQL("Hospital", "hospital_id", hospitalid);
    return await deleteQueryDatabase("Hospital", hospitalid, sql, actionUsername);
}

/**
 * Delete Patient from database
 * @param {String} patientid - patient_no of a patient
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
 **/
async function deletePatient(patientid,actionUsername){
  const sql = prepareDeleteSQL("Patient", "patient_no", patientid);
  return await deleteQueryDatabase("Patient", patientid, sql, actionUsername);
}

/**
 * Delete test entry from database
 * @param {String} testid - id of a test to be deleted
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
 **/
async function deleteTest(testid, actionUsername) {
    const sql = prepareDeleteSQL("Test", "test_id", testid);
    return await deleteQueryDatabase("Test", testid, sql, actionUsername);
}

/**
 * Run DELETE query on the database
 * @param {String} table - Table to edit
 * @param {String} id - id to edit
 * @param {String} sql - SQL query
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
 **/
async function deleteQueryDatabase(table, id, sql, actionUsername) {
    let deletedInfo;
    switch (table) {
        case "Test":
            deletedInfo = (await selecter.getTest(id)).response[0];
            break;
        case "Patient":
            deletedInfo = (await selecter.getFullPatientInfo(id)).response[0];
            break;
        case "Hospital":
            deletedInfo = (await selecter.getHospital(id)).response[0];
            break;
        case "Carer":
            deletedInfo = (await selecter.getCarer(id)).response[0];
            break;
    }

    const response = await databaseController.deleteQuery(sql, table, id);
    if (response.status === "OK") {
        actionLogger.logDelete(actionUsername,table,id,"Successful. Deleted data: >>" + JSON.stringify(deletedInfo) + "<<.");
        return { success: true, response: "Entry deleted" };
    } else if (response.err.type === "SQL Error") {
        actionLogger.logDelete(actionUsername,table,id,"Unsuccessfully tried to execute query: >>" +sql +"<<. SQL Error message: >>" +response.err.sqlMessage +"<<.");
    } else {
        actionLogger.logDelete(actionUsername,table,id,"Unsuccessfully tried to execute query: >>" +sql +"<<. Invalid request error message: >>" +response.err.cause +"<<.");
    }
    return { success: false, response: response.err };
}

/**
 * Prepare DELETE query on the database
 * @param {String} table - Table in which to insert an entry
 * @param {String} idProperty - property, that the entry can be identified with
 * @param {String} id - value of idProperty
 * @return {String} SQL query
 **/
function prepareDeleteSQL(table, idProperty, id) {
    const sql = `DELETE FROM ${table} WHERE ${idProperty}=${mysql.escape(id)} LIMIT 1;`;
    return sql;
}

module.exports = {
//DELETE
deleteHospital,
deletePatient,
deleteCarer,
deleteTest,
//Helper functions - for tests only
deleteQueryDatabase,
prepareDeleteSQL
};
