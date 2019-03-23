/**
 * This module collects all the queries that are dealing with the core data.
 *
 * @author Mateusz Nowak, Luka Kralj
 * @module query-controller
 * @version 1.0
 */
const calendarController = require("./calendar-functions.js");
const authenticator = require("./authenticator.js");
const dateformat = require("dateformat");
const selector = require('./query-modules/selector')
const inserter = require('./query-modules/inserter')
const deleter = require('./query-modules/deleter')
const updater = require('./query-modules/updater')
const tokenConroller = require('./query-modules/token-controller')

/*===============================*
          SELECT QUERIES
 *===============================*/

/**
 * Get the patient given its patient number
 * @param {string} patient_no the patient number
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getPatient(patient_no) {
    return await selector.getPatient(patient_no);
}

/**
 * Get the info of the patient together with the info of eventual carers and hospitals
 * @param {string} patient_no the patient number
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getFullPatientInfo(patient_no) {
    return await selector.getFullPatientInfo(patient_no);
}

/**
 * Get the carer given its carer id
 * @param {string} carerID the carer id
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getCarer(carerID) {
    return await selector.getCarer(carerID);
}

/**
 * Get the hospital given its hospital id
 * @param {string} hospital_id the hospital id
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getHospital(hospital_id) {
    return await selector.getHospital(hospital_id);
}

/**
 * Get all the patients from the database
 * @param {Boolean} isAdult If the records should be displayed for adult users
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getAllPatients(isAdult) {
    return await selector.getAllPatients(isAdult);
}

/**
 * Get user from database
 * @param {String} username - username to retrieve
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getUser(username) {
    return await selector.getUser(username);
}

/**
 * Get all users from database
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getAllUsers() {
    return await selector.getAllUsers();
}

/**
 * Get test from the database
 * @param {String} test_id - id of test
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getTest(test_id) {
    return await selector.getTest(test_id);
}

/**
* Get not completed tests from patient
* @param {String} patientId - id of patient
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getNextTestsOfPatient(patientId) {
    return await selector.getNextTestsOfPatient(patientId)
}

/**
 * Get test info with patient info from the database
 * @param {String} test_id - id of test
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getTestInfo(test_id) {
    return await selector.getTestInfo(test_id);
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
    return await selector.getSortedOverdueWeeks(isAdult)
}

/**
 * Get all tests within the week from the database
 * @param {String} date - any date (from Monday to Friday) within the week to retrieve (format: "YYYY-MM-DD")
 * @param {Boolean} isAdult If the records should be displayed for adult users
 * @return {JSON} result of the query - {success:true/false response:Array/Error}
 **/
async function getTestWithinWeek(date, isAdult) {
    return await selector.getTestWithinWeek(date, isAdult);
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
    return await selector.getOverdueReminderGroups(isAdult);
}

/*===============================*
          UPDATE QUERIES
 *===============================*/

/**
 * Edit test query
 * @param testId The id of the test to be updated
 * @param {JSON} newInfo All the information of the test (new and old)
 * @param token The token that grants edit privileges
 * @param {string} actionUsername The user who issued the request.
 */
async function editTest(testId, newInfo, token, actionUsername) {
    let scheduleNew = false;
    const testInfo = await getTest(testId);
    if (!testInfo.success) {
        return testInfo;
    }
    if (testInfo.response.length == 0) {
        return { success: false, response: "No new tests added - No test found!" };
    }
    if (newInfo.completed_status == "yes" ||newInfo.completed_status == "in review") {
        scheduleNew = true;
        newInfo["completed_date"] = dateformat(new Date(), "yyyymmdd");
    } else {
        newInfo["completed_date"] = "NULL";
    }
    const res = await updater.editTest(testId, newInfo, token, actionUsername)
    if (res.success && scheduleNew &&testInfo.response[0].completed_status == "no") {
        const insertedResponse = await scheduleNextTest(testId, actionUsername);
        if (insertedResponse.success) {
            res.response.new_date = insertedResponse.response.new_date;
            res.response.insertId = insertedResponse.response.insertId;
        }
    }
    return res;
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
    return await updater.editPatient(newInfo, token, actionUsername)
}

/**
 * Edit patient with hospital and carer query
 * @param {JSON} newInfo All the information of the patient/hospital/carer to update
 * @param token The token that grants edit privileges
 * @return {JSON} query result {success:Boolean response:{Response of each query as {success:Boolean response:Array/Error/String} or {} }}
 */
async function editPatientExtended(newInfo, token, actionUsername) {
    const patientResponse = await getPatient(newInfo.patient_no);
    if (!patientResponse.success) {
        return patientResponse;
    }
    const patient = patientResponse.response[0];

    //Separate into carer hospital and patient info
    const updateProperties = sortPatinetProperties(newInfo)
    const carer = updateProperties.carer;
    const hospital = updateProperties.hospital;
    const patientNewInfo = updateProperties.patient;

    let querySuccess = true;
    let carerQueryResponse = {};
    if (Object.keys(carer).length > 0 && token) {
        //Carer added with patient update
        if (patient.carer_id == undefined ||patient.carer_id == null || patient.carer_id == "NULL") {
            carerQueryResponse = await addCarer(carer, actionUsername);
            if(carerQueryResponse.success){
              patientNewInfo["carer_id"] = carerQueryResponse.response.insertId;
            }
        }
        //Database has info on this carer
        else {
            const carerToken = await requestEditing("Carer",patient.carer_id,actionUsername);
            carer["carer_id"] = patient.carer_id;
            carerQueryResponse = await editCarer(carer, carerToken, actionUsername);
        }
    } else if (Object.keys(carer).length == 0 && token && patient.carer_id) {
        carerQueryResponse = await deleteCarer(patient.carer_id, actionUsername);
    }

    let hospitalQueryResponse = {};
    if (Object.keys(hospital).length > 0 && token) {
        //Hospital added with update
        if (patient.hospital_id == undefined || patient.hospital_id == null || patient.hospital_id == "NULL") {
            hospitalQueryResponse = await addHospital(hospital, actionUsername);
            if(hospitalQueryResponse.success){
              patientNewInfo["hospital_id"] = hospitalQueryResponse.response.insertId;
            }
        }
        //Database has info on the hospital
        else {
            const hospitalToken = await requestEditing("Hospital",patient.hospital_id,actionUsername);
            hospital["hospital_id"] = patient.hospital_id;
            hospitalQueryResponse = await editHospital(hospital,hospitalToken,actionUsername);
        }
    } else if (Object.keys(hospital).length == 0 &&token && patient.hospital_id) {
        hospitalQueryResponse = await deleteHospital(patient.hospital_id,actionUsername);
    }

    const patientUpdateResponse = await editPatient(patientNewInfo,token,actionUsername);

    if ((patientUpdateResponse.success === false && typeof patientUpdateResponse.success != "undefined") ||
        (hospitalQueryResponse.success === false && typeof hospitalQueryResponse.success != "undefined") ||
        (carerQueryResponse.success === false && typeof carerQueryResponse.success != "undefined")){
        querySuccess = false;
    }

    return { success: querySuccess,
            response: {
              patientQuery: patientUpdateResponse,
              hospitalQuery: hospitalQueryResponse,
              carerQuery: carerQueryResponse}
          };
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
    return await updater.editHospital(newInfo, token, actionUsername);
}

/**
 * Edit carer query
 * @param {JSON} newInfo All the information of the carer to update
 * @property carer_id {String}
 * @param token The token that grants edit privileges
 * @param {string} actionUsername The user who issued the request.
 */
async function editCarer(newInfo, token, actionUsername) {
    return await updater.editCarer(newInfo, token, actionUsername)
}

/**
 * Edit test due date - drag & drop method
 * @param {String} testId Id of the test to update
 * @param {Date} newDate  new due date
 * @returns result of the query - {success:Boolean response:Array/Error}
 */
async function changeTestDueDate(testId, newDate, actionUsername) {
    const token = await requestEditing("Test", testId, actionUsername);
    const res = await updater.changeTestDueDate(testId,token, newDate, actionUsername)
    if (!res.success) {
        res.response = res.response.problem;
    }
    return res;
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
async function editUser(json, token, actionUsername) {
    const response = await getUser(json.username);
    if (!response.success) {
        return response;
    }
    if(response.response.length!=1){
      return {success: false, response: "No user found" }
    }
    const user = {username: json.username}
    if(json.hashed_password){
      const hash = authenticator.produceHash(json.hashed_password, response.response[0].iterations, response.response[0].salt);
      user["hashed_password"] = hash;
    }
    if(json.recovery_email){
      user["recovery_email"] = json.recovery_email;
    }
    if(json.isAdmin){
      user["isAdmin"]=json.isAdmin;
    }
    return await updater.editUser(user, token, actionUsername);
}


/**
* Change the status of the test in the database
* @param {JSON} test
* @param {string} actionUsername The user who issued the request.
* @property testId {String} - id of a test to change
* @property newStatus {enum: "completed"/"late"/"inReview"} - new status of a test
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function changeTestStatus(test, actionUsername) {
    const token = await requestEditing("Test", test.testId, actionUsername);

    const testInfo = await getTest(test.testId);
    if (!testInfo.success) {
        return testInfo;
    }
    if (testInfo.response.length == 0) {
        return { success: false, response: "No new tests added - No test found!" };
    }
    if(test.newStatus!="late" && test.newStatus != "completed" && test.newStatus != "inReview"){
          return { success: false, response: "NO SUCH UPDATE" };
    }
    let scheduleNew = false;
    if (test.newStatus == "completed" || test.newStatus == "inReview"){
        scheduleNew = true;
    }

    const res = await updater.changeTestStatus(test,token,actionUsername)

    if (res.success &&scheduleNew &&testInfo.response[0].completed_status == "no") {
        const insertedResponse = await scheduleNextTest(test.testId,actionUsername);
        if (insertedResponse.success) {
            res.response.new_date = insertedResponse.response.new_date;
            res.response.insertId = insertedResponse.response.insertId;
        }
    }
    return res;
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
    return await updater.updateLastReminder(testId, token, actionUsername)
}

/**
 * Edit test colour - quick update.
 *
 * @param {String} testId Id of the test to update
 * @param {string} newColour - New colour to be stored.
 * @returns result of the query - {success:Boolean response:Array/Error}
 */
async function changeTestColour(testId, newColour, actionUsername) {
    const token = await requestEditing("Test", testId, actionUsername);
    const res = await updater.changeTestColour(testId, newColour,token,actionUsername)
    if (!res.success) {
        res.response = res.response.problem;
    }
    return res;
}

/**
 * Edit patient colour - quick update.
 *
 * @param {String} patientNo Number of the patient to update
 * @param {string} newColour - New colour to be stored.
 * @returns result of the query - {success:Boolean response:Array/Error}
 */
async function changePatientColour(patientNo, newColour, actionUsername) {
    const token = await requestEditing("Patient", patientNo, actionUsername);
    const res = await updater.changePatientColour(patientNo, newColour,token,actionUsername);
    if (!res.success) {
        res.response = res.response.problem;
    }
    return res;
}

/*===============================*
          INSERT QUERIES
 *===============================*/

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
    return await inserter.addUser(json, actionUsername)
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
    return await inserter.addTest(json, actionUsername)
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
    return await inserter.addPatient(json, actionUsername)
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
    return await inserter.addHospital(json, actionUsername)
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
    return await inserter.addCarer(json, actionUsername);
}

/**
 * Add new patient entry to the database with optional carer/hospital
 * @param {JSON} - entry to add
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean response:{insertedId/problem (+ optional fields)}}
 **/
async function addPatientExtended(patientInfo, actionUsername) {
    const properties = sortPatinetProperties(patientInfo)
    const carer = properties.carer;
    const hospital = properties.hospital;
    const patient = properties.patient;

    let carerInsertResponse = {};
    //Try to add any data
    if (Object.keys(carer).length > 0) {
        carerInsertResponse = await addCarer(carer, actionUsername);
        if (carerInsertResponse.success) {
            patient["carer_id"] = carerInsertResponse.response.insertId;
        }
    } else {
        patient["carer_id"] = "NULL";
    }

    let hospitalInsertResponse = {};
    //Try to add any data
    if (Object.keys(hospital).length > 0) {
        hospitalInsertResponse = await addHospital(hospital, actionUsername);
        if (hospitalInsertResponse.success) {
            patient["hospital_id"] = hospitalInsertResponse.response.insertId;
        }
    } else {
        patient["hospital_id"] = "NULL";
    }
    //Hospital query failed but carer was inserted
    if (patient.carer_id && !patient.hospital_id) {
        let success = true;
        if (patient.carer_id != "NULL") {
            const deleteResponse = await deleteCarer(patient.carer_id,actionUsername);
            if (!deleteResponse.success) {
                success = false;
            }
        }
        return { success: false, response: { problem: "Incorrect data for hospital", delete:success}};
    }

    //Carer query failed but hospital was inserted
    if (patient.hospital_id && !patient.carer_id) {
        let success = true;
        if (patient.hospital_id != "NULL") {
            const deleteResponse = await deleteHospital(patient.hospital_id,actionUsername);
            if (!deleteResponse.success) {
                success = false;
            }
        }
        return { success: false, response: { problem: "Incorrect data for carer", delete: success}};
    }

    //Both added correctly
    if (patient.hospital_id && patient.carer_id) {
        const patientInsertResponse = await addPatient(patient, actionUsername);
        if (patientInsertResponse.success) {
            return { success: true, response: { insertedId: patient.patient_no } };
        }
        //Query to insert patient failed
        else {
            let carer = true;
            let hospital = true;
            if (patient.carer_id != "NULL") {
                const deleteResponse = await deleteCarer(patient.carer_id,actionUsername);
                if (!deleteResponse.success) {
                    carer = false;
                }
            }
            if (patient.hospital_id != "NULL") {
                const deleteResponse = await deleteHospital(patient.hospital_id,actionUsername);
                if (!deleteResponse.success) {
                    hospital = false;
                }
            }
            return {success: false, response: {problem: "Problem on patient insert",carer: carer,hospital: hospital}};
        }
    }
    else {
        return {success: false, response: { problem: "Incorrect data for carer and hospital"}};
    }
}
/*===============================*
          DELETE QUERIES
 *===============================*/

/**
 * Delete Carer entry from database
 *@param {String} carerid - id of a carer to be deleted
 * @param {string} actionUsername The user who issued the request.
 *@return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
 **/
async function deleteCarer(carerid, actionUsername) {
    return await deleter.deleteCarer(carerid, actionUsername)
}

/**
 * Delete hospital entry from database
 * @param {String} hospitalid - id of a hospital to be deleted
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
 **/
async function deleteHospital(hospitalid, actionUsername) {
    return await deleter.deleteHospital(hospitalid, actionUsername);
}

/**
 * Delete Patient and cancel the patient edit token
 * @param {String} patientid - patient_no of a patient
 * @param {String} token - token to be returned with query
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
 **/
async function deletePatient(patientid, token, actionUsername) {
    const check = await checkIfPatientsTestsAreEdited(patientid);
    if (check === true) {
        return { success: false, response: "Someone is editing the test" };
    }
    if (check === false) {
        //Try returning token
        const tokenResponse = await returnToken("Patient",patientid,token,actionUsername);
        if (!tokenResponse.success) {
            return tokenResponse;
        }
        //Patient with tests can be deleted
        return await deleter.deletePatient(patientid,actionUsername)
    }
    //Error on the check
    return check;
}

/**
 * Delete test entry from database
 * @param {String} testid - id of a test to be deleted
 * @param {string} actionUsername The user who issued the request.
 * @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
 **/
async function deleteTest(testid, actionUsername) {
    return await deleter.deleteTest(testid, actionUsername);
}

/**
 * Unschedule test
 * @param testid {String} - id of the test to delete
 * @param token {String} - token to realease with the unscheduling
 * @param actionUsername {String} - username that triggered the action
 **/
async function unscheduleTest(testid, token, actionUsername) {
    const tokenRealeaseResponse = await returnToken("Test",testid,token,actionUsername);
    if (!tokenRealeaseResponse.success) {
        return tokenRealeaseResponse;
    }
    return await deleteTest(testid, actionUsername);
}
/*===============================*
      HELPER FUNCTIONS BELOW:
 *===============================*/

/**
 * Check if test are edited within the EditTokens database
 * @return {Boolean} {false - If no tests are edited (no tokens)}
 * @return {Boolean} {true - If tests are edited (tokens in table)}
 * @return {JSON} {Error response}
 **/
async function checkIfPatientsTestsAreEdited(patientid) {
    const response = await selector.getPatientEditedTests(patientid);
    if (response.success && response.response.length == 0) {
        return false;
    }
    if (response.success && response.response.length > 0) {
        return true;
    }
    return response;
}

/**
 * Get next due date of a test in "YYYY-MM-DD" format; relative to today
 * @param frequency {String} - frequency of the test as stored in database
 * @return {String} - next due date in "YYYY-MM-DD" format
 **/
function getNextDueDate(frequency, completed_date) {
    const nextDate = calendarController.getNextDueDate(frequency,new Date(completed_date));
    return dateformat(new Date(nextDate), "yyyymmdd");
}

/**
 * Schedule next blood test based on information in database and/or new information provided
 * New information have priority over stored in database (new info > database info)
 * @param testId {String} - id of a string from which to take the info
 * @param {string} actionUsername The user who issued the request.
 * @param newInfo {JSON} - (optional) new info to add into database with new test
 * @return {JSON} - result of query {success:true/false reply:(optional;when no new entry inserted due to finished range of tests)}
 **/
async function scheduleNextTest(testId, actionUsername) {
    const response = await getTest(testId);
    const test = response.response[0];
    if (test.frequency !== null && test.occurrences > 1) {
        const newTest = {
            patient_no: test.patient_no,
            frequency: test.frequency,
            due_date: getNextDueDate(test.frequency, test.completed_date),
            occurrences: test.occurrences - 1,
            notes: test.notes,
            test_colour: test.test_colour
        };
        const response = await addTest(newTest, actionUsername);
        if (response.success) {
            response.response["new_date"] = newTest.due_date;
        }
        return response;
    }
    return { success: true, response: "No new tests" };
}

/**
 * Request editing of an entry in table
 * @param {String} table - Table to edit
 * @param {String} id - id to edit
 * @param {string} actionUsername The user who issued the request.
 * @return {String} token
 **/
async function requestEditing(table, id, actionUsername) {
    return await tokenConroller.requestEditing(table, id, actionUsername);
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
    return await tokenConroller.returnToken(table, id, token, actionUsername)
}

/**
* Sort patient properties into patient,carer and hospital information
* @param {JSON} patientInfo - information to be sorted
* @return {JSON} Sorted information: {patient: hospital: carer:}
**/
function sortPatinetProperties(patientInfo)
{
  const objectProperties = Object.keys(patientInfo);
  const patient = {};
  const carer = {};
  const hospital = {};
  for (let i = 0; i < objectProperties.length; i++){
      if (objectProperties[i].startsWith("carer") || objectProperties[i] == "relationship") {
          carer[objectProperties[i]] = patientInfo[objectProperties[i]];
      }
      if (objectProperties[i].startsWith("hospital")) {
          hospital[objectProperties[i]] = patientInfo[objectProperties[i]];
      }
      if (objectProperties[i].startsWith("patient") ||objectProperties[i] == "additional_info") {
          patient[objectProperties[i]] = patientInfo[objectProperties[i]];
      }
  }
  return {patient: patient, carer:carer, hospital:hospital}
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
    //INSERTS
    addTest,
    addUser,
    addPatient,
    addHospital,
    addPatientExtended,
    addCarer,
    //UPDATES
    editTest,
    editCarer,
    editHospital,
    editPatient,
    editPatientExtended,
    updateLastReminder,
    changeTestStatus,
    changeTestDueDate,
    changeTestColour,
    changePatientColour,
    editUser,
    //DELETE
    deleteHospital,
    deletePatient,
    deleteCarer,
    unscheduleTest,
    deleteTest,
    //TOKEN CONTROL
    requestEditing,
    returnToken,
    //Helper functions - for tests only
    sortPatinetProperties,
    scheduleNextTest,
    checkIfPatientsTestsAreEdited,
    getNextDueDate,
};
