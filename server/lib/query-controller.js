const databaseController = require('./db_controller/db-controller.js');
const authenticator = require("./authenticator.js");
const calendarController = require("./calendar-controller.js");
const _ = require("lodash");
const logger = require('./action-logger');
const dateformat = require('dateformat');

/*===============================*
          SELECT QUERIES
 *===============================*/

/**
 * Get the patient given its patient number
 * @param {string} patient_no the patient number
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getPatient(patient_no) {
  const sql = `SELECT * FROM Patient WHERE patient_no = '${patient_no}';`
  return await selectQueryDatabase(sql);
}

/**
 * Get the info of the patient together with the info of eventual carers and hospitals
 * @param {string} patient_no the patient number
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
// TODO to be tested
async function getFullPatientInfo(patient_no){
  const sql = `SELECT * FROM Patient LEFT OUTER JOIN Hospital ON Patient.hospital_id=Hospital.hospital_id LEFT OUTER JOIN Carer ON Patient.carer_id=Carer.carer_id WHERE Patient.patient_no = '${patient_no}';`
  return await selectQueryDatabase(sql);
}

/**
 * Get the carer given its carer id
 * @param {string} carerID the carer id
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getCarer(carerID) {
  const sql = `SELECT * FROM Carer WHERE carer_id = '${carerID}';`
  return await selectQueryDatabase(sql);
}

/**
 * Get the hospital given its hospital id
 * @param {string} hospital_id the hospital id
 * @return {JSON} - {success:Boolean response:Array or Error}
 */
async function getHospital(hospital_id) {
  const sql = `SELECT * FROM Hospital WHERE hospital_id = '${hospital_id}';`
  return await selectQueryDatabase(sql);
}

/**
* Get all the patients from the database
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getAllPatients()
{
  const sql = "Select * From Patient;";
  return await selectQueryDatabase(sql)
}

/**
* Get user from database
* @param {String} username - username to retrieve
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getUser(username)
{
  const sql = `Select * From User Where username='${username}' Limit 1;`;
  return await selectQueryDatabase(sql)
}

/**
* Get all the tests from the database
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getAllTests()
{
  const sql = "Select * From Test ORDER BY due_date ASC;";
  return await selectQueryDatabase(sql)
}

/**
* Get test from the database
* @param {String} test_id - id of test
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getTest(test_id)
{
  const sql = `Select * From Test Where test_id=${test_id};`;
  return await selectQueryDatabase(sql)
}

/**
* Get all the tests from a specific patient from the database
* @param {String} patientId - id of a patient
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getTestsOfPatient(patientId){
  const sql = `Select * From Test Where patient_no = ${patientId};`;
  return await selectQueryDatabase(sql)
}

async function getNextTestsOfPatient(patientId){
    const sql = `SELECT * FROM Test WHERE patient_no = '${patientId}' AND completed_status='no';`;
    return await selectQueryDatabase(sql);
}

/**
* Get all the tests on specific date from the database
* @param {String} date - date (format: "YYYY-MM-DD")
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getAllTestsOnDate(date)
{
  const sql = `Select * From Test Where due_date = '${date}';`;
  return await selectQueryDatabase(sql)
}

/**
* Get test info with patient info from the database
* @param {String} test_id - id of test
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getTestInfo(test_id){
    const sql = `SELECT * FROM Test JOIN Patient ON Patient.patient_no = Test.patient_no WHERE test_id=${test_id}`;
    return await selectQueryDatabase(sql);
}

/**
* Get all the overdue tests from the database plus additional info about time difference
* @return {JSON} result of the query - {success:true/false response:Array{SortedWeek}/Error}
* @typedef {SortedWeek}
* @property  class {String} - monday of the week, format: 'Mon Mar 04 2019 00:00:00 GMT+0000 (GMT)'
* @property  tests {Array[JSON]} - tests within week
**/
async function getSortedOverdueWeeks()
{
  const sql = `Select *, IF(((DAYOFWEEK(due_date)-2) = -1),DATE_ADD(due_date,Interval (-6) Day),DATE_ADD(due_date,Interval (-(DAYOFWEEK(due_date)-2)) Day)) AS Monday
            From Test NATURAL JOIN Patient where completed_date IS NULL AND due_date < CURDATE() AND completed_status='no' ORDER BY due_date ASC;`
  const response = await selectQueryDatabase(sql);
  if(response.success == false)
  {
    return response;
  }
  const groupedTests = _.groupBy(response.response,"Monday");
  const keys = Object.keys(groupedTests);
  let classedTests = [];
  for(let i=0; i<keys.length; i++)
  {
      classedTests=classedTests.concat({class:keys[i], tests:groupedTests[keys[i]]});
  }
  return {success: true , response: classedTests};
}

/**
* Get all tests within the week from the database
* @param {String} date - any date (from Monday to Friday) within the week to retrieve (format: "YYYY-MM-DD")
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getTestWithinWeek(date)
{
  const dateString = dateformat(date, "yyyy-mm-dd");
  const response = await Promise.all(getTestsDuringTheWeek(dateString))
                              .then(days => {return checkMultipleQueriesStatus(days)})
                              .then(data => {return data})
  return response;
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
async function editTest(testId, newInfo,token, actionUsername){
    let scheduleNew = false;
    if(newInfo.completed_status == "yes" || newInfo.completed_status == "in review")
    {
      scheduleNew = true;
      newInfo['completed_date'] = dateformat(new Date(), "yyyymmdd");
    }
    else{
      newInfo['completed_date'] = 'NULL';
    }
    const sql = prepareUpdateSQL("Test",newInfo,"test_id");
    const res = await updateQueryDatabase("Test",testId,sql,token, actionUsername);

    if (res.success && scheduleNew) {
       const insertedResponse = await scheduleNextTest(testId, actionUsername);
       if(insertedResponse.response){
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
async function editPatient(newInfo, token, actionUsername){
    const sql = prepareUpdateSQL("Patient",newInfo,"patient_no");
    return await updateQueryDatabase("Patient",newInfo.patient_no,sql,token, actionUsername);
}

/**
* Edit patient with hospital and carer query
* @param {JSON} newInfo All the information of the patient/hospital/carer to update
* @param token The token that grants edit privileges
* @return {JSON} query result {success:Boolean response:{Response of each query as {success:Boolean response:Array/Error/String} or {} }}
*/
async function editPatientExtended(newInfo,token, actionUsername)
{
  const patientResponse = await getPatient(newInfo.patient_no);
  if(!patientResponse.success){
    return patientResponse;
  }
  const patient = patientResponse.response[0];

  //Separate into carer hospital and patient info
  const updateProperties = Object.keys(newInfo);
  const carer = {};
  const hospital = {};
  const patientNewInfo={};
  let querySuccess = true;
  for(let i=0; i<updateProperties.length; i++)
   {
     if((updateProperties[i].startsWith('carer') || updateProperties[i] == 'relationship') && newInfo[updateProperties[i]])
     {
       carer[updateProperties[i]] = newInfo[updateProperties[i]];
     }
     if((updateProperties[i].startsWith('hospital')) && newInfo[updateProperties[i]])
     {
       hospital[updateProperties[i]] = newInfo[updateProperties[i]];
     }
     if((updateProperties[i].startsWith('patient') || updateProperties[i] == 'additional_info') && newInfo[updateProperties[i]])
     {
       patientNewInfo[updateProperties[i]] = newInfo[updateProperties[i]];
     }
   }
  let carerQueryResponse = {};
  if(Object.keys(carer).length>0 && token)
  {
    //Carer added with patient update
    if(patient.carer_id==null){
      carerQueryResponse = await addCarer(carer, actionUsername)
      patientNewInfo['carer_id'] = carerQueryResponse.response.insertId;
    }
    //Database has info on this carer
    else{
      const carerToken = await requestEditing("Carer",patient.carer_id, actionUsername);
      carer["carer_id"] = patient.carer_id;
      carerQueryResponse = await editCarer(carer,carerToken, actionUsername);
    }
  }
  else if(Object.keys(carer).length == 0 && token && patient.carer_id)
  {
    carerQueryResponse = await deleteCarer(patient.carer_id, actionUsername);
  }

  let  hospitalQueryResponse = {}
  if(Object.keys(hospital).length>0 && token)
  {
    //Hospital added with update
    if(patient.hospital_id==null){
      hospitalQueryResponse = await addHospital(hospital, actionUsername)
      patientNewInfo['hospital_id'] = hospitalQueryResponse.response.insertId;
    }
    //Database has info on the hospital
    else{
      const hospitalToken = await requestEditing("Hospital",patient.hospital_id, actionUsername);
      hospital["hospital_id"] = patient.hospital_id;
      hospitalQueryResponse = await editHospital(hospital,hospitalToken, actionUsername);
    }
  }
  else if(Object.keys(hospital).length == 0 && token && patient.hospital_id)
  {
    hospitalQueryResponse = await deleteHospital(patient.hospital_id, actionUsername);
  }

  const patientUpdateResponse = await editPatient(patientNewInfo,token, actionUsername);

  if((patientUpdateResponse.success===false && typeof patientUpdateResponse.success != 'undefined') ||
    (hospitalQueryResponse.success===false  && typeof hospitalQueryResponse.success != 'undefined') ||
    (carerQueryResponse.success===false && typeof carerQueryResponse.success != 'undefined')){
    querySuccess = false;
  }

  return {success: querySuccess, response: {
    patientQuery: patientUpdateResponse,
    hospitalQuery: hospitalQueryResponse,
    carerQuery: carerQueryResponse
  }}
}

/**
* Edit hospital query
* @param {JSON} newInfo All the information of the hospital to update
* Obligatory fields in JSON
* @property hospital_id {String}
* @param token The token that grants edit privileges
* @param {string} actionUsername The user who issued the request.
*/
async function editHospital(newInfo, token, actionUsername){
    const sql = prepareUpdateSQL("Hospital",newInfo,"hospital_id");
    return await updateQueryDatabase("Hospital",newInfo.hospital_id,sql,token, actionUsername);
}

/**
* Edit carer query
* @param {JSON} newInfo All the information of the carer to update
* @property carer_id {String}
* @param token The token that grants edit privileges
* @param {string} actionUsername The user who issued the request.
*/
async function editCarer(newInfo, token, actionUsername){
    const sql = prepareUpdateSQL("Carer",newInfo,"carer_id");
    return await updateQueryDatabase("Carer",newInfo.carer_id,sql,token, actionUsername);
}

/**
* Edit test due date - drag & drop method
* @param {String} testId Id of the test to update
* @param {Date} newDate  new due date
* @returns result of the query - {success:Boolean response:Array/Error}
*/
async function changeTestDueDate(testId, newDate, actionUsername){
    const token = await requestEditing("Test",testId, actionUsername);
    newDate = dateformat(newDate, "yyyymmdd");

    const sql = `UPDATE Test SET due_date='${newDate}' WHERE test_id = ${testId};`;
    const res = await updateQueryDatabase("Test",testId,sql,token, actionUsername);
    if (!res.success) {
      res.response = res.response.problem;
    }
    return res;
}

/**
* Update password of an user
* @param {JSON} json - user
* @param {string} actionUsername The user who issued the request.
* Obligatory properties:
* @property username {String}
* @property hashed_password {String}
* @return {JSON} - {success:Boolean response:Array or Error}
**/
async function updatePassword(json, actionUsername)
{
  const response = await getUser(json.username);
  const token = await requestEditing("User",json.username, actionUsername)
  if (!response.success){
    return response;
  }
  const user = response.response[0];
  if(user){
    const hash = authenticator.produceHash(json.hashed_password,user.iterations,user.salt);
    const sql = `UPDATE User SET hashed_password='${hash}', WHERE username = ${json.username} LIMIT 1;`;
    return await updateQueryDatabase("User",json.username,sql,token, actionUsername);
  }
  else{
    return {success:false , response:"No user found"}
  }
}

/**
* Change the status of the test in the database
* @param {JSON} test
* @param {string} actionUsername The user who issued the request.
* @property testId {String} - id of a test to change
* @property newStatus {enum: "completed"/"late"/"inReview"} - new status of a test
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function changeTestStatus(test, actionUsername)
{
  const token = await requestEditing("Test",test.testId, actionUsername);
  let status;
  let date;
  // TODO: first check if it can edit. If edit successful then schedule a new one.
  let scheduleNew = false;
  switch(test.newStatus)
  {
    case "completed": {status = "yes"; date=`CURDATE()`;scheduleNew = true; break;}
    case "late": {status = "no"; date=`NULL`; break;}
    case "inReview" : {status = "in review"; date=`CURDATE()`; scheduleNew = true; break;}
    default: return {success:false, response: "NO SUCH UPDATE"}
  }
  const sql = `UPDATE Test SET completed_status='${status}', completed_date=${date} WHERE test_id = ${test.testId};`;
  const res = await updateQueryDatabase("Test",test.testId,sql,token, actionUsername);

  if (res.success && scheduleNew) {
    const insertedResponse = await scheduleNextTest(test.testId, actionUsername);
    if(insertedResponse.response){
      res.response.new_date = insertedResponse.response.new_date;
      res.response.insertId = insertedResponse.response.insertId;
    }
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
* @return {JSON} result of the query - {success:Boolean}
**/
async function addUser(json, actionUsername)
{
  const iterations = authenticator.produceIterations();
  const salt = authenticator.produceSalt();
  //Hash password to store it in database (password should be previously hashed with another algorithm on client side)
  const hash = authenticator.produceHash(json.hashed_password,iterations,salt);
  const sql = `INSERT INTO User VALUES(${json.username},${hash},${salt},${iterations},${json.email});`;
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
async function addTest(json, actionUsername)
{
  const sql = prepareInsertSQL('Test',json);
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
async function addPatient(json, actionUsername)
{
  const sql = prepareInsertSQL('Patient',json);
  return await insertQueryDatabase(sql, "Patient", actionUsername, json.patient_no);
}

/**
* Add new Hospital to the database
* @param {JSON} - entry to add
* @param {string} actionUsername The user who issued the request.
* Obligatory properties within JSON
* @property hospital_email
* @return {JSON} result of the query - {success:Boolean}
**/
async function addHospital(json, actionUsername)
{
  const sql = prepareInsertSQL('Hospital',json);
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
async function addCarer(json, actionUsername)
{
  const sql = prepareInsertSQL('Carer',json);
  return await insertQueryDatabase(sql, "Carer", actionUsername);
}

/**
* Add new patient entry to the database with optional carer/hospital
* @param {JSON} - entry to add
* @param {string} actionUsername The user who issued the request.
* @return {JSON} result of the query - {success:Boolean response:{insertedId/problem (+ optional fields)}}
**/
async function addPatientExtended(patientInfo,actionUsername)
{
  const insertProperties = Object.keys(patientInfo);
  const carer = {};
  const hospital = {};
  const patient = {};
  for(let i=0; i<insertProperties.length; i++)
  {
     if((insertProperties[i].startsWith('carer') || insertProperties[i] == 'relationship') && patientInfo[insertProperties[i]])
     {
       carer[insertProperties[i]] = patientInfo[insertProperties[i]];
     }
     if((insertProperties[i].startsWith('hospital')) && patientInfo[insertProperties[i]])
     {
       hospital[insertProperties[i]] = patientInfo[insertProperties[i]];
     }
     if((insertProperties[i].startsWith('patient') || insertProperties[i] == 'additional_info') && patientInfo[insertProperties[i]])
     {
       patient[insertProperties[i]] = patientInfo[insertProperties[i]];
     }
  }

  let carerInsertResponse = {};
  //Try to add any data
  if(Object.keys(carer).length>0){
    carerInsertResponse = await addCarer(carer,actionUsername)
    if(carerInsertResponse.success){
      patient["carer_id"]=carerInsertResponse.response.insertId;
    }
  }
  else{
    patient["carer_id"]="NULL";
  }

  let hospitalInsertResponse = {};
  //Try to add any data
  if(Object.keys(hospital).length>0){
    hospitalInsertResponse = await addHospital(hospital,actionUsername)
    if(hospitalInsertResponse.success){
      patient["hospital_id"]=hospitalInsertResponse.response.insertId;
    }
  }
  else{
    patient["hospital_id"]="NULL";
  }

  //Both queries failed
  if(!patient.hospital_id && !patient.carer_id){
    return {success: false, response:{problem:"Incorrect data for carer and hospital"}}
  }
  //Hospital query failed but carer was inserted
  if(patient.carer_id&&!patient.hospital_id)
  {
    let success = true;
    if(patient.carer_id!="NULL"){
      const deleteResponse = await deleteCarer(patient.carer_id,actionUsername)
      if(!deleteResponse.success){
        success = false;
      }
    }
    return {success: false, response:{problem:"Incorrect data for hospital", delete:success}}
  }

  //Carer query failed but hospital was inserted
  if(patient.hospital_id && !patient.carer_id){
    let success = true;
    if(patient.hospital_id!="NULL"){
      const deleteResponse = await deleteHospital(patient.hospital_id,actionUsername)
      if(!deleteResponse.success){
        success = false;
      }
    }
    return {success: false, response:{problem:"Incorrect data for carer", delete:success}}
  }

  //Both added correctly
  if(patient.hospital_id && patient.carer_id){
    const  patientInsertResponse = await addPatient(patient,actionUsername)
    if(patientInsertResponse.success){
      return {success: true, response:{insertedId:patient.patient_no}}
    }
    //Query to insert patient failed
    else{
      let carer = true;
      let hospital = true;
      if(patient.carer_id!="NULL"){
        const deleteResponse = await deleteCarer(patient.carer_id,actionUsername)
        if(!deleteResponse.success){
          carer = false;
        }
      }
      if(patient.hospital_id!="NULL"){
        const deleteResponse = await deleteHospital(patient.hospital_id,actionUsername)
        if(!deleteResponse.success){
          hospital = false;
        }
      }
      return{success:false,
        response:{problem:"Problem on patient insert", carer: carer, hospital: hospital}}
    }
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
async function deleteCarer(carerid, actionUsername)
{
  const sql = prepareDeleteSQL("Carer","carer_id",carerid);
  return await deleteQueryDatabase("Carer",carerid,sql, actionUsername);
}

/**
* Delete hospital entry from database
* @param {String} hospitalid - id of a hospital to be deleted
* @param {string} actionUsername The user who issued the request.
* @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
**/
async function deleteHospital(hospitalid, actionUsername)
{
  const sql = prepareDeleteSQL("Hospital","hospital_id",hospitalid);
  return await deleteQueryDatabase("Hospital",hospitalid,sql, actionUsername);
}

/**
* Delete Patient and cancel the patient edit token
* @param {String} patientid - patient_no of a patient
* @param {String} token - token to be returned with query
* @param {string} actionUsername The user who issued the request.
* @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
**/
async function deletePatient(patientid, token, actionUsername){
  const check = await checkIfPatientsTestsAreEdited(patientid)
  if(check===true){
    return {success:false, response:"Someone is editing the test"}
  }
  if(check===false){
    //Try returning token
    const tokenResponse = await returnToken("Patient", patientid, token, actionUsername);
    if(!tokenResponse.success){
      return tokenResponse;
    }
    //Patient with tests can be deleted
    const sql = prepareDeleteSQL("Patient","patient_no",patientid)
    return await deleteQueryDatabase("Patient",patientid,sql,actionUsername)
  }
  //Error on the check
  return check
}

/**
* Delete test entry from database
* @param {String} testid - id of a test to be deleted
* @param {string} actionUsername The user who issued the request.
* @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
**/
async function deleteTest(testid, actionUsername){
  const sql = prepareDeleteSQL("Test","test_id",testid);
  return await deleteQueryDatabase("Test",testid,sql, actionUsername);
}

/**
* Unschedule test
* @param testid {String} - id of the test to delete
* @param token {String} - token to realease with the unscheduling
* @param actionUsername {String} - username that triggered the action
**/
async function unscheduleTest(testid,token,actionUsername)
{
  const tokenRealeaseResponse = await returnToken("Test", testid, token, actionUsername);
  if(!tokenRealeaseResponse.success){
    return tokenRealeaseResponse;
  }
  const testDeletionResponse = await deleteTest(testid, actionUsername);
  return testDeletionResponse;
}
/*===============================*
      HELPER FUNCTIONS BELOW:
 *===============================*/

/**
* Check if test are edited within the TokenControl database
* @return {Boolean} {false - If no tests are edited (no tokens)}
* @return {Boolean} {true - If tests are edited (tokens in table)}
* @return {JSON} {Error response}
**/
async function checkIfPatientsTestsAreEdited(patientid){
  const sql = `Select test_id From Test Where patient_no = '${patientid}' AND test_id IN (Select table_key From TokenControl Where table_name = "Test");`;
  const response = await selectQueryDatabase(sql);
  if(response.success && response.response.length==0){
    return false;
  }
  if(response.success && response.response.length>0){
    return true;
  }
  return response;
}

/**
* Produce multiple queries on the database to retrieve test within the week
* @param {String} date - date in the week to retrieve tests (format: "YYYY-MM-DD")
* @return {Array} array of queries to run
**/
function getTestsDuringTheWeek(date)
{
  const weekDay = new Date(date).getDay();
  const daysInWeek=[]
  let sql;
  let i = 0;
  while(i<5)
  {
    const day = -1*(weekDay - 1) + i;
    sql = `Select * From Test Join Patient on Test.patient_no=Patient.patient_no Where due_date = DATE_ADD('${date}', INTERVAL ${day} DAY);`;
    daysInWeek.push(databaseController.selectQuery(sql));
    i++;
  }
  const day = -1*(weekDay - 1) + i;
  sql = `Select * From Test Join Patient on Test.patient_no=Patient.patient_no Where due_date = DATE_ADD('${date}', INTERVAL ${day} DAY) OR due_date = DATE_ADD('${date}', INTERVAL ${day+1} DAY);`;
  daysInWeek.push(databaseController.selectQuery(sql));
  return daysInWeek;
}

/**
* Get next due date of a test in "YYYY-MM-DD" format; relative to today
* @param frequency {String} - frequency of the test as stored in database
* @return {String} - next due date in "YYYY-MM-DD" format
**/
function getNextDueDate(frequency, completed_date)
{
  const nextDate = calendarController.getNextDueDate(frequency,new Date(completed_date));
  return dateformat(new Date(nextDate), "yyyymmdd")
}

/**
* Schedule next blood test based on information in database and/or new information provided
* New information have priority over stored in database (new info > database info)
* @param testId {String} - id of a string from which to take the info
* @param {string} actionUsername The user who issued the request.
* @param newInfo {JSON} - (optional) new info to add into database with new test
* @return {JSON} - result of query {success:true/false reply:(optional;when no new entry inserted due to finished range of tests)}
**/
async function scheduleNextTest(testId, actionUsername)
{
  const response = await getTest(testId);
  const test = response.response[0];
  // occurrences needs to be more than 1. if there is only one occurrence it does not need to be repeated.
  // also frequency needs to be defined (not null)
  if(test.frequency !== null && test.occurrences > 1){
    const newTest = {
      patient_no: test.patient_no,
      frequency: test.frequency,
      due_date: getNextDueDate(test.frequency, test.completed_date), // use completed_date that is stored in the DB instead of creating a new one on the go
      occurrences:(test.occurrences-1), // newInfo.occurrences shouldn't be decremented by 1 as it is decided in advance
      notes:test.notes
    }
    const response = await addTest(newTest, actionUsername);
    if(response.success){
      response.response["new_date"] = newTest.due_date;
    }
    return response;
  }
  return {success: true, reply: "No new tests"};
}
/**
* Run multiple queries on the database
* @param {Array} queries - array of queries to run
* @return {JSON} result of the query - {success:true/false response:Array/String}
**/
function checkMultipleQueriesStatus(queries)
{
  const data = [];
  let error = false;
  queries.forEach(query=>{
    if(query.status==="OK"){
      data.push(query.response.rows)
    }
    else {
      error = true;
    }
  })
  if (error) {
    return { success: false, response: "One query failed" };
  }
  return { success: true, response: data };
}

/**
* Run SELECT query on the database
* @param {String} sql - SQL query
* @return {JSON} result of the query - {success:Boolean response:Array/Error}
**/
async function selectQueryDatabase(sql)
{
  const response = await databaseController.selectQuery(sql).then((queryResponse) =>{
    if(queryResponse.status==="OK"){
      const data = queryResponse.response.rows;
      return {success:true, response:data}
    }
    else {
      return { success: false, response: queryResponse.err }
    }
  });
  return response;
}

/**
* Run INSERT query on the database
* @param {String} sql - SQL query
* @param {string} tableName Name of the table which we are inserting into.
* @param {string} id Specify new entry's ID, unless the ID is auto generated.
* @param {string} actionUsername The user who issued the request.
* @return {JSON} result of the query - {success:Boolean}
**/
async function insertQueryDatabase(sql, tableName, actionUsername, id = undefined)
{
  const response = await databaseController.insertQuery(sql);
  if (response.status == "OK"){
      id = (id === undefined) ? response.response.insertId : id;
      logger.logInsert(actionUsername, tableName, id, "Successful.");
      return {success: true, response: {insertId: id}};
  }else {
      if (response.err.type === "SQL Error") {
        logger.logInsert(actionUsername, tableName, "-1",
        "Unsuccessfully tried to execute query: >>" + sql + "<<. SQL Error message: >>" + response.err.sqlMessage + "<<.");
      }
      else {
        logger.logInsert(actionUsername, tableName, "-1",
        "Unsuccessfully tried to execute query: >>" + sql + "<<. Invalid request error message: >>" + response.err.cause + "<<.");
      }
      return {success: false};
  }
}

/**
* Request editing of an entry in table
* @param {String} table - Table to edit
* @param {String} id - id to edit
* @param {string} actionUsername The user who issued the request.
* @return {String} token
**/
async function requestEditing(table, id, actionUsername)
{
  const data = await databaseController.requestEditing(table,id).then( data => {return data;});
  // TODO: return token + expiration
  if (data.status == "OK"){
    logger.logOther(actionUsername, table, id, "Request for editing was approved.");
    return data.response.token;
  }else {
      logger.logOther(actionUsername, table, id,
        "Request for editing was rejected with message: >>" + data.err.cause + "<<.");
      return undefined;
  }
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
async function updateQueryDatabase(table,id,sql,token, actionUsername)
{
  if(token)
  {
      const response = await databaseController.updateQuery(sql, table, id, token);
      if(response.status === "OK"){
        logger.logUpdate(actionUsername, table, id, "Successful.");
        return {success:true , response: response.response};
      }
      else{
        if (response.err.type === "SQL Error") {
          logger.logUpdate(actionUsername, table, id,
          "Unsuccessfully tried to execute query: >>" + sql + "<<. SQL Error message: >>" + response.err.sqlMessage + "<<.");
        }
        else {
          logger.logUpdate(actionUsername, table, id,
          "Unsuccessfully tried to execute query: >>" + sql + "<<. Invalid request error message: >>" + response.err.cause + "<<.");
        }
        return {success:false , response: response.err};
      }
  }
  else {
    return {success:false, response: {problem:"Token in use/No token defined"} };
  }
}

/**
* Run DELETE query on the database
* @param {String} table - Table to edit
* @param {String} id - id to edit
* @param {String} sql - SQL query
* @param {string} actionUsername The user who issued the request.
* @return {JSON} result of the query - {success:Boolean response:"Entry deleted"/Error}
**/
async function deleteQueryDatabase(table,id,sql, actionUsername)
{
    const response = await databaseController.deleteQuery(sql,table,id)
    if(response.status === "OK"){
      logger.logDelete(actionUsername, table, id, "Successful.");
      return {success:true, response: "Entry deleted"}
    }
    else{
      if (response.err.type === "SQL Error") {
        logger.logDelete(actionUsername, table, id,
        "Unsuccessfully tried to execute query: >>" + sql + "<<. SQL Error message: >>" + response.err.sqlMessage + "<<.");
      }
      else {
        logger.logDelete(actionUsername, table, id,
        "Unsuccessfully tried to execute query: >>" + sql + "<<. Invalid request error message: >>" + response.err.cause + "<<.");
      }
      return {success:false , response: response.err}
    }
}

/**
* Prepare INSERT query on the database
* @param {String} table - Table in which to insert an entry
* @param {JSON} object -  JSON, which is being entered
* @return {String} SQL query
**/
function prepareInsertSQL(table,object)
{
  let sql = `INSERT INTO ${table}(`;
  const properties = Object.keys(object);
  for(let i=0; i<properties.length-1; i++)
  {
    sql += `${properties[i]},`;
  }
  sql += `${properties[properties.length-1]}) Values(`;
  const values = Object.values(object);
  for(let i=0; i<values.length-1; i++)
  {
    if(values[i]!='NULL'){
      sql += `'${values[i]}',`;
    }
    else{
      sql += `${values[i]},`;
    }
  }
  if(values[values.length-1]!='NULL'){
      sql += `'${values[values.length-1]}');`
  }
  else{
      sql += `${values[values.length-1]});`
  }
  return sql;
}

/**
* Prepare UPDATE query on the database
* @param {String} table - Table in which to insert an entry
* @param {JSON} object -  JSON, which is being entered
* @param {String} idProperty - property, that the entry can be identified with
* @return {String} SQL query
**/
function prepareUpdateSQL(table, object, idProperty)
{
  let sql = `Update ${table} SET `;
  const properties = Object.keys(object);
  const values = Object.values(object);
  let pos;
  for(let i=0; i<properties.length; i++)
  {
    if(properties[i]!= idProperty){
      if(values[i]!="NULL"){
        sql += `${properties[i]} = '${values[i]}', `;
      }
      else{
        sql += `${properties[i]} = NULL, `;
      }
    }
    else{
      pos = i;
    }
  }
  //delete ", " from sql query
  sql = sql.substr(0,sql.length-2);
  sql += ` WHERE ${idProperty} = '${values[pos]}';`
  return sql;
}

/**
* Prepare DELETE query on the database
* @param {String} table - Table in which to insert an entry
* @param {String} idProperty - property, that the entry can be identified with
* @param {String} id - value of idProperty
* @return {String} SQL query
**/
function prepareDeleteSQL(table, idProperty, id)
{
  // TODO: add logging in delete
  const sql = `DELETE FROM ${table} WHERE ${idProperty}='${id}' LIMIT 1;`;
  return sql;
}

/**
* Cancel editing on an entry
* @param {String} table - Table of an entry
* @param {String} id - id value of an entry
* @param {String} token - token to return
* @param {string} actionUsername The user who issued the request.
* @return {JSON} result - {success:Boolean response:"Token cancelled"/Error}
**/
async function returnToken(table, id, token, actionUsername)
{
  const response =  await databaseController.cancelEditing(table, id, token);
  if(response.status === "OK"){
    logger.logOther(actionUsername, table, id, "Successfully released token.");
    return {success:true, response:"Token cancelled"};
  }
  else{
    if (response.err.type === "SQL Error") {
      logger.logOther(actionUsername, table, id,
      "Unsuccessfully tried to release token. SQL Error message: >>" + response.err.sqlMessage + "<<.");
    }
    else {
      logger.logOther(actionUsername, table, id,
      "Unsuccessfully tried to release token. Invalid request error message: >>" + response.err.cause + "<<.");
    }
    return {success:false, response: response.err};
  }
}

module.exports = {
  //SELECTS
    getPatient,
    getTest,
    getHospital,
    getCarer,
    getUser,
    getAllPatients,
    getFullPatientInfo,
    getAllTests,
    getTestInfo,
    getTestsOfPatient,
    getNextTestsOfPatient,
    getAllTestsOnDate,
    getTestWithinWeek,
    getSortedOverdueWeeks,
  //INSERTS
    addTest,
    addUser,
    addPatient,
    addHospital,
    addPatientExtended,
    addCarer,
  //UPDATES
    updatePassword,
    changeTestStatus,
    changeTestDueDate,
    editTest,
    editPatient,
    editPatientExtended,
    editCarer,
    editHospital,
  //DELETE
    deleteHospital,
    deletePatient,
    deleteCarer,
    unscheduleTest,
    deleteTest,
  //TOKEN CONTROL
    requestEditing,
    returnToken
};
