const databaseController = require("../db_controller/db-controller.js");
const _ = require("lodash");
const dateformat = require("dateformat");
const mysql = require("mysql");

/**
 * Get the patient given its patient number
 * @param {string} patient_no the patient number
 * @return {JSON} - {success:Boolean response:Array or Error}
 */

 async function getPatient(patient_no) {
  const sql = `SELECT * FROM Patient WHERE patient_no = ${mysql.escape(patient_no)};`;
  return await selectQueryDatabase(sql);
}

/**
 * Get the info of the patient together with the info of eventual carers and hospitals
 * @param {string} patient_no the patient number
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getFullPatientInfo(patient_no) {
    const sql = `SELECT * FROM Patient LEFT OUTER JOIN Hospital ON Patient.hospital_id=Hospital.hospital_id
    LEFT OUTER JOIN Carer ON Patient.carer_id=Carer.carer_id
    WHERE Patient.patient_no = ${mysql.escape(patient_no)};`;
    return await selectQueryDatabase(sql);
}

async function getPatientEditedTests(patientid){
  const sql = `Select test_id From Test Where patient_no = ${mysql.escape(patientid)}
  AND test_id IN (Select table_key From EditTokens Where table_name = "Test");`;
  return await selectQueryDatabase(sql);
}

/**
 * Get the carer given its carer id
 * @param {string} carerID the carer id
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getCarer(carerID) {
    const sql = `SELECT * FROM Carer WHERE carer_id = ${mysql.escape(carerID)};`;
    return await selectQueryDatabase(sql);
}

/**
 * Get the hospital given its hospital id
 * @param {string} hospital_id the hospital id
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getHospital(hospital_id) {
    const sql = `SELECT * FROM Hospital WHERE hospital_id = ${mysql.escape(hospital_id)};`;
    return await selectQueryDatabase(sql);
}

/**
 * Get all the patients from the database
 * @param {Boolean} isAdult If the records should be displayed for adult users
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getAllPatients(isAdult) {
    const adult = isAdult ? "yes" : "no";
    const sql = `Select * From Patient WHERE isAdult='${adult}' ORDER By patient_name,patient_surname`;
    return await selectQueryDatabase(sql);
}

/**
 * Get user from database
 * @param {String} username - username to retrieve
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getUser(username) {
    const sql = `Select * From User Where username=${mysql.escape(username)} Limit 1;`;
    return await selectQueryDatabase(sql);
}

/**
 * Get all users from database
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getAllUsers() {
    const sql = `Select username, isAdmin, recovery_email From User;`;
    return await selectQueryDatabase(sql);
}

/**
 * Get test from the database
 * @param {String} test_id - id of test
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getTest(test_id) {
    const sql = `Select * From Test Where test_id=${mysql.escape(test_id)};`;
    return await selectQueryDatabase(sql);
}

/**
* Get not completed tests from patient
* @param {String} patientId - id of patient
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getNextTestsOfPatient(patientId) {
    const sql = `SELECT * FROM Test WHERE patient_no = ${mysql.escape(
        patientId
    )} AND completed_status='no';`;
    return await selectQueryDatabase(sql);
}

/**
 * Get test info with patient info from the database
 * @param {String} test_id - id of test
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getTestInfo(test_id) {
    const sql = `SELECT * FROM Test JOIN Patient ON Patient.patient_no = Test.patient_no
    WHERE test_id=${mysql.escape(test_id)}`;
    return await selectQueryDatabase(sql);
}

/**
* Get all the overdue tests from the database plus additional info about time difference
* @param {Boolean} isAdult If the records should be displayed for adult users
* @return {JSON} result of the query - {success:true/false response:Array{SortedWeek}/Error}
* @typedef {SortedWeek}
* @property  class {String} - monday of the week, format: 'Mon Mar 04 2019 00:00:00 GMT+0000 (GMT)'
* @property  tests {Array[JSON]} - tests within week
**/
async function getSortedOverdueWeeks(isAdult) {
    const adult = isAdult ? "yes" : "no";
    const sql = `Select *, IF(((DAYOFWEEK(due_date)-2) = -1),DATE_ADD(due_date,Interval (-6) Day),DATE_ADD(due_date,Interval (-(DAYOFWEEK(due_date)-2)) Day)) AS Monday
             From Test NATURAL JOIN Patient where
             ((completed_date IS NULL AND due_date < CURDATE() AND completed_status='no')
             OR (completed_date = CURDATE() AND due_date < CURDATE()))
             AND isAdult='${adult}' ORDER BY due_date,patient_name,patient_surname ASC;`;
    const response = await selectQueryDatabase(sql);
    if (response.success == false) {
        return response;
    }
    const groupedTests = _.groupBy(response.response, "Monday");
    const keys = Object.keys(groupedTests);
    let classedTests = [];
    for (let i = 0; i < keys.length; i++) {
        classedTests = classedTests.concat({ class: keys[i], tests: groupedTests[keys[i]] });
    }
    return { success: true, response: classedTests };
}

/**
 * Get all tests within the week from the database
 * @param {String} date - any date (from Monday to Friday) within the week to retrieve (format: "YYYY-MM-DD")
 * @param {Boolean} isAdult If the records should be displayed for adult users
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getTestWithinWeek(date, isAdult) {
    const dateString = dateformat(date, "yyyy-mm-dd");
    const response = await Promise.all(getTestsDuringTheWeek(dateString, isAdult))
        .then(days => {
            return checkMultipleQueriesStatus(days);
        })
        .then(data => {
            return data;
        });
    return response;
}

/**
 * Returns overdue tests that are separated into two groups. One group are the tests that haven't been
 * sent a reminder. The other group are the tests that have already been sent a reminder.
 * Response includes some basic info about the test.
 *
 * @param {Boolean} isAdult If the records should be displayed for adult users
 * @returns {JSON} {
 *    success: true|false,
 *    response: {
 *        notReminded: [{
 *          test_id:
 *          due_date:
 *          patient_no:
 *          patient_name:
 *          patient_surname:
 *        }, ...]
 *        reminded: [{
 *          test_id:
 *          due_date:
 *          patient_no:
 *          patient_name:
 *          patient_surname:
 *          last_reminder:
 *          reminders_sent:
 *        }, ...]
 *    }
 *  }
 */
async function getOverdueReminderGroups(isAdult) {
    const adult = isAdult ? "yes" : "no";
    const sql = `Select test_id, due_date, patient_no, patient_name, patient_surname, last_reminder, reminders_sent, isAdult
            From Test NATURAL JOIN Patient
            where completed_date IS NULL AND due_date < CURDATE() AND completed_status='no' AND isAdult='${adult}' ORDER BY last_reminder, due_date,patient_name,patient_surname ASC;`;

    const res = await selectQueryDatabase(sql);

    if (!res.success) {
        return res;
    }

    const overdue = res.response;
    const notReminded = [];
    const reminded = [];

    for (let i = 0; i < overdue.length; i++) {
        if (overdue[i].reminders_sent === 0) {
            notReminded.push(overdue[i]);
        } else {
            reminded.push(overdue[i]);
        }
    }

    return {
        success: true,
        response: { notReminded: notReminded, reminded: reminded }
    };
}

/**
* Run SELECT query on the database
* @param {String} sql - SQL query
* @return {JSON} result of the query - {success:Boolean response:Array/Error}
**/
async function selectQueryDatabase(sql) {
    const response = await databaseController
         .selectQuery(sql)
        .then(queryResponse => {
             if (queryResponse.status === "OK") {
                 const data = queryResponse.response.rows;
                 return { success: true, response: data };
             } else {
                 return { success: false, response: queryResponse.err };
             }
         });
     return response;
}

/**
 * Produce multiple queries on the database to retrieve test within the week
 * @param {String} date - date in the week to retrieve tests (format: "YYYY-MM-DD")
 * @param {Boolean} isAdult If the records should be displayed for adult users
 * @return {Array} array of queries to run
 **/
function getTestsDuringTheWeek(date, isAdult) {
    const adult = isAdult ? "yes" : "no";
    const dateObject = new Date(date);
    const weekDay = dateObject.getDay();
    const daysInWeek = [];
    let sql;
    let i = 0;
    while (i < 5) {
        const day = -1 * (weekDay - 1) + i;
        sql = `Select * From Test Join Patient on Test.patient_no=Patient.patient_no Where due_date = DATE_ADD(${mysql.escape(
            date
        )}, INTERVAL ${mysql.escape(day)} DAY) AND isAdult='${adult}' ORDER BY patient_name,patient_surname;`;
        daysInWeek.push(databaseController.selectQuery(sql));
        i++;
    }
    const day = -1 * (weekDay - 1) + i;
    sql = `Select * From Test Join Patient on Test.patient_no=Patient.patient_no Where (due_date = DATE_ADD(${mysql.escape(
        date
    )}, INTERVAL ${mysql.escape(day)} DAY) OR due_date = DATE_ADD(${mysql.escape(
        date
    )}, INTERVAL ${mysql.escape(day + 1)} DAY)) AND isAdult='${adult}' ORDER BY patient_name,patient_surname;`;
    daysInWeek.push(databaseController.selectQuery(sql));
    return daysInWeek;
}

/**
 * Run multiple queries on the database
 * @param {Array} queries - array of queries to run
 * @return {JSON} result of the query - {success:true/false response:Array/String}
 **/
function checkMultipleQueriesStatus(queries) {
    const data = [];
    let error = false;
    queries.forEach(query => {
        if (query.status === "OK") {
            data.push(query.response.rows);
        } else {
            error = true;
        }
    });
    if (error) {
        return { success: false, response: "One query failed" };
    }
    return { success: true, response: data };
}

module.exports = {
    //SELECTS
    getPatient,
    getTest,
    getHospital,
    getCarer,
    getUser,
    getAllUsers,
    getAllPatients,
    getFullPatientInfo,
    getTestInfo,
    getNextTestsOfPatient,
    getTestWithinWeek,
    getSortedOverdueWeeks,
    getOverdueReminderGroups,
    getPatientEditedTests,
    //Helper functions - for tests only
    selectQueryDatabase
  }
