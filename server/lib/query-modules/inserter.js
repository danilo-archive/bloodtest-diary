const authenticator = require("../authenticator.js");
const actionLogger = require("../action-logger");
const databaseController = require("../db_controller/db-controller.js");
const mysql = require("mysql");

/**
* Add new user to the database
* @param {JSON} - user
* @param {string} actionUsername The user who issued the request.
* Obligatory properties within JSON
* @property username {String}
* @property hashed_password {String}
* @property email {String}
* @property isAdmin {string} "yes" | "no"
* @return {JSON} result of the query - {success:Boolean}
**/
async function addUser(json, actionUsername) {
  const iterations = authenticator.produceIterations();
  const salt = authenticator.produceSalt();
  //Hash password to store it in database (password should be previously hashed with another algorithm on client side)
  const hash = authenticator.produceHash(json.hashed_password, iterations, salt);
  const user = {
    username: json.username,
   isAdmin: json.isAdmin,
   salt: salt,
   iterations: iterations,
   hashed_password: hash,
   recovery_email: json.recovery_email
  }
  const sql = prepareInsertSQL("User",user)
  return await insertQueryDatabase(sql, "User", actionUsername, json.username);
}

/**
 * Add new test to the database
 * @param {JSON} - entry to add
 * @param {string} actionUsername The user who issued the request.
 * Obligatory properties within JSON
 * @property patient_no
 * @property due_date
 * @return {JSON} result of the query - {success:Boolean}
 **/
async function addTest(json, actionUsername) {
    const sql = prepareInsertSQL("Test", json);
    return await insertQueryDatabase(sql, "Test", actionUsername);
}

/**
 * Add new patient to the database
 * @param {JSON} - entry to add
 * @param {string} actionUsername The user who issued the request.
 * Obligatory properties within JSON
 * @property patient_no
 * @property patient_name
 * @property patient_surname
 * @property hospital_id
 * @property carer_id
 * @return {JSON} result of the query - {success:Boolean}
 **/
async function addPatient(json, actionUsername) {
    const sql = prepareInsertSQL("Patient", json);
    return await insertQueryDatabase(
        sql,
        "Patient",
        actionUsername,
        json.patient_no
    );
}

/**
 * Add new Hospital to the database
 * @param {JSON} - entry to add
 * @param {string} actionUsername The user who issued the request.
 * Obligatory properties within JSON
 * @property hospital_email
 * @return {JSON} result of the query - {success:Boolean}
 **/
async function addHospital(json, actionUsername) {
    const sql = prepareInsertSQL("Hospital", json);
    return await insertQueryDatabase(sql, "Hospital", actionUsername);
}

/**
 * Add new carer to the database
 * @param {JSON} - entry to add
 * @param {string} actionUsername The user who issued the request.
 * Obligatory properties within JSON
 * @property carer_email
 * @return {JSON} result of the query - {success:Boolean}
 **/
async function addCarer(json, actionUsername) {
    const sql = prepareInsertSQL("Carer", json);
    return await insertQueryDatabase(sql, "Carer", actionUsername);
}

/**
 * Run INSERT query on the database
 * @param {String} sql - SQL query
 * @param {string} tableName Name of the table which we are inserting into.
 * @param {string} id Specify new entry's ID, unless the ID is auto generated.
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean}
 **/
async function insertQueryDatabase(sql, tableName, actionUsername, id = undefined) {
    const response = await databaseController.insertQuery(sql);
    if (response.status == "OK") {
        id = id === undefined ? response.response.insertId : id;
        actionLogger.logInsert(actionUsername, tableName, id, "Successful.");
        return { success: true, response: { insertId: id } };
    }else if (response.err.type === "SQL Error") {
        actionLogger.logInsert(actionUsername,tableName,"-1","Unsuccessfully tried to execute query: >>" +sql +"<<. SQL Error message: >>" +response.err.sqlMessage +"<<.");
    } else {
        actionLogger.logInsert(actionUsername,tableName,"-1","Unsuccessfully tried to execute query: >>" +sql +"<<. Invalid request error message: >>" +response.err.cause +"<<.");
    }
    return { success: false };
}

/**
 * Prepare INSERT query on the database
 * @param {String} table - Table in which to insert an entry
 * @param {JSON} object -  JSON, which is being entered
 * @return {String} SQL query
 **/
function prepareInsertSQL(table, object) {
    let sql = `INSERT INTO ${table}(`;
    const properties = Object.keys(object);
    for (let i = 0; i < properties.length - 1; i++) {
        sql += `${properties[i]},`;
    }
    sql += `${properties[properties.length - 1]}) Values(`;
    const values = Object.values(object);
    for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === undefined ||
            values[i] === null ||
            values[i].length === 0 ||
            values[i] === "null" ||
            values[i] === "NULL"){

            sql += "NULL,";
        } else {
            sql += `${mysql.escape(values[i])},`;
        }
    }
    if (values[values.length - 1] === undefined ||
        values[values.length - 1] === null ||
        values[values.length - 1].length === 0 ||
        values[values.length - 1] === "null" ||
        values[values.length - 1] === "NULL") {

        sql += `NULL);`;
    } else {
        sql += `${mysql.escape(values[values.length - 1])});`;
    }
    return sql;
}
module.exports = {
//INSERTS
addTest,
addUser,
addPatient,
addHospital,
addCarer,
//Helper functions - just for testing
prepareInsertSQL,
insertQueryDatabase,
}
