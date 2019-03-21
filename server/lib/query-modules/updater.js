const actionLogger = require("../action-logger");
const databaseController = require("../db_controller/db-controller.js");
const mysql = require("mysql");
const dateformat = require("dateformat");


/**
 * Edit test query
 * @param testId The id of the test to be updated
 * @param {JSON} newInfo All the information of the test (new and old)
 * @param token The token that grants edit privileges
 * @param {string} actionUsername The user who issued the request.
 */
async function editTest(testId, newInfo, token, actionUsername) {
    const sql = prepareUpdateSQL("Test", newInfo, "test_id");
    return await updateQueryDatabase("Test",testId,sql,token,actionUsername);
}

/**
 * Edit patient query
 * @param {JSON} newInfo All the information of the patient to update
 * Obligatory fields in JSON
 * @property patient_no {String}
 * @param token The token that grants edit privileges
 * @param {string} actionUsername The user who issued the request.
 */
async function editPatient(newInfo, token, actionUsername) {
    const sql = prepareUpdateSQL("Patient", newInfo, "patient_no");
    return await updateQueryDatabase("Patient",newInfo.patient_no,sql,token,actionUsername);
}

/**
 * Edit hospital query
 * @param {JSON} newInfo All the information of the hospital to update
 * Obligatory fields in JSON
 * @property hospital_id {String}
 * @param token The token that grants edit privileges
 * @param {string} actionUsername The user who issued the request.
 */
async function editHospital(newInfo, token, actionUsername) {
    const sql = prepareUpdateSQL("Hospital", newInfo, "hospital_id");
    return await updateQueryDatabase("Hospital",newInfo.hospital_id,sql,token,actionUsername);
}

/**
 * Edit carer query
 * @param {JSON} newInfo All the information of the carer to update
 * @property carer_id {String}
 * @param token The token that grants edit privileges
 * @param {string} actionUsername The user who issued the request.
 */
async function editCarer(newInfo, token, actionUsername) {
    const sql = prepareUpdateSQL("Carer", newInfo, "carer_id");
    return await updateQueryDatabase("Carer",newInfo.carer_id,sql,token,actionUsername);
}

async function changeTestDueDate(testId,token, newDate, actionUsername) {
  newDate = dateformat(newDate, "yyyymmdd");
  const sql = `UPDATE Test SET due_date=${mysql.escape(newDate)} WHERE test_id = ${mysql.escape(testId)};`;
  return await updateQueryDatabase("Test",testId,sql,token,actionUsername);
}

/**
 * Update User in database
 * @param {JSON} json - user
 * @param {string} actionUsername The user who issued the request.
 * Obligatory properties:
 * @property username {String},
 * One of optional properties
 * Optional properties:
 * @property recovery_email {String}
 * @property hashed_password {String}
 * @return {JSON} - {success:Boolean response:Array or Error}
 **/
async function editUser(user, token, actionUsername){
  const sql = prepareUpdateSQL("User",user,"username");
  return await updateQueryDatabase("User", user.username, sql, token, actionUsername);
}

/**
* Change the status of the test in the database
* @param {JSON} test
* @param {string} actionUsername The user who issued the request.
* @property testId {String} - id of a test to change
* @property newStatus {enum: "completed"/"late"/"inReview"} - new status of a test
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function changeTestStatus(test,token,actionUsername) {
  let status;
  let date;
  switch (test.newStatus) {
      case "completed": {
          status = "yes";
          date = `CURDATE()`;
          break;
      }
      case "late": {
          status = "no";
          date = `NULL`;
          break;
      }
      case "inReview": {
          status = "in review";
          date = `CURDATE()`;
          break;
      }
      default:
          return { success: false, response: "NO SUCH UPDATE" };
  }
  const sql = `UPDATE Test SET completed_status=${mysql.escape(status)}, completed_date=${date} WHERE test_id = ${mysql.escape(test.testId)};`;
  return await updateQueryDatabase("Test",test.testId,sql,token,actionUsername);
}

/**
 * Update when the last reminder for this test was sent.
 *
 * @param {string} testId - id of a test to change
 * @param {string} token - The token that grants edit privileges.
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function updateLastReminder(testId, token, actionUsername) {
    let sql = "UPDATE Test SET last_reminder = CURDATE(), reminders_sent = reminders_sent + 1 WHERE test_id= ? ";
    sql = mysql.format(sql, [testId]);
    return await updateQueryDatabase("Test", testId, sql, token, actionUsername);
}

async function changeTestColour(testId, newColour,token, actionUsername) {
  newColour = newColour == null ? "NULL" : mysql.escape(newColour);
  const sql = `UPDATE Test SET test_colour=${newColour} WHERE test_id = ${mysql.escape(testId)};`;
  return await updateQueryDatabase("Test",testId,sql,token,actionUsername);
}

/**
 * Edit patient colour - quick update.
 *
 * @param {String} patientNo Number of the patient to update
 * @param {string} newColour - New colour to be stored.
 * @returns result of the query - {success:Boolean response:Array/Error}
 */
async function changePatientColour(patientNo, newColour,token,actionUsername) {
    newColour = newColour == null ? "NULL" : mysql.escape(newColour);
    const sql = `UPDATE Patient SET patient_colour=${newColour} WHERE patient_no = ${mysql.escape(patientNo)};`;
    return await updateQueryDatabase("Patient",patientNo,sql,token,actionUsername);
}

/**
 * Prepare UPDATE query on the database
 * @param {String} table - Table in which to insert an entry
 * @param {JSON} object -  JSON, which is being entered
 * @param {String} idProperty - property, that the entry can be identified with
 * @return {String} SQL query
 **/
function prepareUpdateSQL(table, object, idProperty) {
    let sql = `Update ${table} SET `;
    const properties = Object.keys(object);
    const values = Object.values(object);
    let pos;
    for (let i = 0; i < properties.length; i++) {
        if (properties[i] != idProperty) {
            if (values[i] === undefined || values[i] === null || values[i].length === 0 ||
                values[i] === "null" || values[i] === "NULL") {
                sql += `${properties[i]} = NULL, `;
            } else {
                sql += `${properties[i]} = ${mysql.escape(values[i])}, `;
            }
        } else {
            pos = i;
        }
    }
    //delete ", " from sql query
    sql = sql.substr(0, sql.length - 2);
    if (values[pos] === null || values[pos] === undefined || values[pos].length === 0 ||
        values[pos] === "null" || values[pos] === "NULL") {
        sql += ` WHERE ${idProperty} = NULL;`;
    } else {
        sql += ` WHERE ${idProperty} = ${mysql.escape(values[pos])};`;
    }
    //For debug:
    //logger.debug(sql);
    return sql;
}

/**
 * Run UPDATE query on the database
 * @param {String} table - Table to edit
 * @param {String} id - id to edit
 * @param {String} sql - SQL query
 * @param {string} token - token to access entry
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean response:Array/Error}
 **/
async function updateQueryDatabase(table, id, sql, token, actionUsername) {
    if (token) {
        const response = await databaseController.updateQuery(sql,table,id,token);
        if (response.status === "OK") {
            actionLogger.logUpdate(actionUsername, table, id, "Successful.");
            return { success: true, response: response.response };
        } else if (response.err.type === "SQL Error") {
            actionLogger.logUpdate(actionUsername,table,id,"Unsuccessfully tried to execute query: >>" +sql +"<<. SQL Error message: >>" +response.err.sqlMessage +"<<.");
        } else {
            actionLogger.logUpdate(actionUsername,table,id,"Unsuccessfully tried to execute query: >>" +sql +"<<. Invalid request error message: >>" +response.err.cause +"<<.");
        }
        return { success: false, response: response.err };
    }
    return {
        success: false,
        response: { problem: "Token in use/No token defined" }
    };
}

module.exports = {
  //UPDATES
  editTest,
  editCarer,
  editHospital,
  editPatient,
  updateLastReminder,
  changeTestStatus,
  changeTestDueDate,
  changeTestColour,
  changePatientColour,
  editUser,
  //Helper functions - for tests only
  updateQueryDatabase,
  prepareUpdateSQL,
}
