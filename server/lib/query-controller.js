const databaseController = require('./db_controller/db-controller.js');
const authenticator = require("./authenticator.js");
const calendarController = require("./calendar-controller.js");
const _ = require("lodash");
const logger = require('./action-logger');
const dateformat = require('dateformat');

// TODO: REPLACE ALL "admin" WITH ACTUAL USERNAMES IN ACTION LOGGING!

/**
 * Get the patient given its patient number
 * @param {string} patient_no the patient number
 */
async function getPatient(patient_no) {
  const sql = `SELECT * FROM Patient WHERE patient_no = '${patient_no}';`
  return await selectQueryDatabase(sql);
}

/**
 * Get the carer given its carer id
 * @param {string} carerID the carer id
 */
async function getCarer(carerID) {
  const sql = `SELECT * FROM Carer WHERE carer_id = '${carerID}';`
  return await selectQueryDatabase(sql);
}

/**
 * Get the hospital given its hospital id
 * @param {string} hospital_id the hospital id
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
* Update password of an user
* @param {JSON} json - user
* Obligatory properties:
* @property username {String}
* @property hashed_password {String}
* @return {JSON} - {success:Boolean response:Array or Error}
**/
async function updatePassword(json)
{
  const response = await getUser(json.username);
  const token = await requestEditing("User",json.username)
  if (!response.success){
    return response;
  }
  const user = response.response[0];
  if(user){
    const hash = authenticator.produceHash(json.hashed_password,user.iterations,user.salt);
    const sql = `UPDATE User SET hashed_password='${hash}', WHERE username = ${json.username} LIMIT 1;`;
    return await updateQueryDatabase("User",json.username,sql,token);
  }
  else{
    return {success:false , response:"No user found"}
  }
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
  const sql = `Select * From Test Where patient_no = ${patientId}`;
  return await selectQueryDatabase(sql)
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
* Get all the overdue tests from the database
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getOverdueTests()
{
  const sql = `Select * From Test Join Patient On Patient.patient_no=Test.patient_no Where completed_date IS NULL AND due_date < CURDATE() AND completed_status='no' ORDER BY due_date ASC;`;
  return await selectQueryDatabase(sql);
}

/**
* Get all the overdue tests from the database plus additional info about time difference
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getOverdueTestsExtended()
{
  const sql = `Select *, DATEDIFF(CURDATE(),due_date) AS difference From Test NATURAL JOIN Patient where completed_date IS NULL AND due_date < CURDATE() AND completed_status='no' ORDER BY due_date ASC;`;
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
* Get all the overdue tests from the database separated within groups
* @return {Array of JSON} result of the query - [{class:String test:Array}]
**/
async function getOverdueGroups()
{
      const tests = await getOverdueTestsExtended();
      const sortedTests = tests.success ? tests.response : [];
      const groups = [{class: "Year+", tests: []}, {class: "6+ months", tests: []},{class: "1-6 months", tests: []},
                    {class: "2-4 weeks", tests: []}, {class: "Less than 2 weeks", tests: []}];
      let i = 0;
      while (i < sortedTests.length && (Math.floor(sortedTests[i].difference - 365)) >= 0){
          groups[0].tests = groups[0].tests.concat(sortedTests[i]);
          i++;
      }
      while (i < sortedTests.length && (Math.floor(sortedTests[i].difference - 365/2)) >= 0){
          groups[1].tests = groups[1].tests.concat(sortedTests[i]);
          i++;
      }
      while (i < sortedTests.length && (Math.floor(sortedTests[i].difference - 30)) >= 0){
          groups[2].tests = groups[2].tests.concat(sortedTests[i]);
          i++;
      }
      while (i < sortedTests.length && (Math.floor(sortedTests[i].difference - 14)) >= 0){
          groups[3].tests = groups[3].tests.concat(sortedTests[i]);
          i++;
      }
      while (i < sortedTests.length){
          groups[4].tests = groups[4].tests.concat(sortedTests[i]);
          i++;
      }
      return groups;
}

/**
* Add new user to the database
* @param {JSON} - user
* Obligatory properties within JSON
* @property username {String}
* @property hashed_password {String}
* @property email {String}
* @return {JSON} result of the query - {success:Boolean}
**/
async function addUser(json)
{
  const iterations = authenticator.produceIterations();
  const salt = authenticator.produceSalt();
  //Hash password to store it in database (password should be previously hashed with another algorithm on client side)
  const hash = authenticator.produceHash(json.hashed_password,iterations,salt);
  const sql = `INSERT INTO User VALUES(${json.username},${hash},${salt},${iterations},${json.email});`;
  return await insertQueryDatabase(sql, "User", json.username);
}

/**
* Add new test to the database
* @param {JSON} - entry to add
* Obligatory properties within JSON
* @property patient_no
* @property due_date
* @return {JSON} result of the query - {success:Boolean}
**/
async function addTest(json)
{
  const sql = prepareInsertSQL('Test',json);
  return await insertQueryDatabase(sql, "Test");
}

/**
* Edit test query
* @param testId The id of the test to be updated
* @param {JSON} newInfo All the information of the test (new and old)
* @param token The token that grants edit privileges
*/
async function editTest(testId, newInfo,token){
    // TODO: first check if it can edit. If edit successful then schedule a new one.
    let scheduleNew = false;
    if(newInfo.completed_status == "yes" || newInfo.completed_status == "in review")
    {
      scheduleNew = true;
      newInfo['completed_date'] = dateformat(new Date(), "yyyymmdd");
    }
    const sql = prepareUpdateSQL("Test",newInfo,"test_id");
    const res = await updateQueryDatabase("Test",testId,sql,token);

    if (res.success && scheduleNew) {
      await scheduleNextTest(testId,newInfo);
    }
    return res;
}
/**
* Edit patient query
* @param {JSON} newInfo All the information of the patient to update
* Obligatory fields in JSON
* @property patient_no {String}
* @param token The token that grants edit privileges
*/
async function editPatient(newInfo, token){
    const sql = prepareUpdateSQL("Patient",newInfo,"patient_no");
    return await updateQueryDatabase("Patient",newInfo.patient_no,sql,token);
}

/**
* Edit hospital query
* @param {JSON} newInfo All the information of the hospital to update
* Obligatory fields in JSON
* @property hospital_id {String}
* @param token The token that grants edit privileges
*/
async function editHospital(newInfo, token){
    const sql = prepareUpdateSQL("Hospital",newInfo,"hospital_id");
    return await updateQueryDatabase("Hospital",newInfo.hospital_id,sql,token);
}

/**
* Edit carer query
* @param {JSON} newInfo All the information of the carer to update
* @property carer_id {String}
* @param token The token that grants edit privileges
*/
async function editCarer(newInfo, token){
    const sql = prepareUpdateSQL("Carer",newInfo,"carer_id");
    return await updateQueryDatabase("Carer",newInfo.carer_id,sql,token);
}

/**
* Add new patient to the database
* @param {JSON} - entry to add
* Obligatory properties within JSON
* @property patient_no
* @property patient_name
* @property patient_surname
* @property hospital_id
* @property carer_id
* @return {JSON} result of the query - {success:Boolean}
**/
async function addPatient(json)
{
  const sql = prepareInsertSQL('Patient',json);
  return await insertQueryDatabase(sql, "Patient", json.patient_no);
}

/**
* Add new Hospital to the database
* @param {JSON} - entry to add
* Obligatory properties within JSON
* @property hospital_email
* @return {JSON} result of the query - {success:Boolean}
**/
async function addHospital(json)
{
  const sql = prepareInsertSQL('Hospital',json);
  return await insertQueryDatabase(sql, "Hospital");
}

/**
* Add new carer to the database
* @param {JSON} - entry to add
* Obligatory properties within JSON
* @property carer_email
* @return {JSON} result of the query - {success:Boolean}
**/
async function addCarer(json)
{
  const sql = prepareInsertSQL('Carer',json);
  return await insertQueryDatabase(sql, "Carer");
}


/**
* Change the status of the test in the database
* @param {JSON} test
* @property testId {String} - id of a test to change
* @property newStatus {enum: "completed"/"late"/"inReview"} - new status of a test
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function changeTestStatus(test)
{
  const token = await requestEditing("Test",test.testId);
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
  const res = await updateQueryDatabase("Test",test.testId,sql,token);

  if (res.success && scheduleNew) {
    await scheduleNextTest(test.testId);
  }
  return res;
}

/**
* Get all tests within the week from the database
* @param {String} date - any date (from Monday to Friday) within the week to retrieve (format: "YYYY-MM-DD")
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getTestWithinWeek(date)
{
  const response = await Promise.all(getTestsDuringTheWeek(date))
                              .then(days => {return checkMultipleQueriesStatus(days)})
                              .then(data => {return data})
  return response;
}

//=====================================
//  HELPER FUNCTIONS BELOW:
//=====================================

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
* @returns {String} - next due date in "YYYY-MM-DD" format
**/
function getNextDueDate(frequency, completed_date)
{
  const dateInZoneFormat = calendarController.getNextDate(frequency,new Date(completed_date));
  return dateformat(new Date(dateInZoneFormat), "yyyymmdd")
}

/**
* Schedule next blood test based on information in database and/or new information provided
* New information have priority over stored in database (new info > database info)
* @param testId {String} - id of a string from which to take the info
* @param newInfo {JSON} - (optional) new info to add into database with new test
* @returns {JSON} - result of query {success:true/false reply:(optional;when no new entry inserted due to finished range of tests)}
**/
async function scheduleNextTest(testId,newInfo={})
{
  const response = await getTest(testId);
  const test = response.response[0];
  // TODO: needs to be more than 1. if there is only one occurrence it does not need to be repeated.
  // also frequency needs to be defined (not null)
  if(test.frequency !== null && test.occurrences > 1){
    const newTest = {
      patient_no: (!newInfo.patient_no) ? test.patient_no : newInfo.patient_no,
      frequency:(!newInfo.frequency) ? test.frequency : newInfo.frequency,
      due_date: (!newInfo.due_date) ? getNextDueDate(test.frequency, test.completed_date) : newInfo.due_date, // TODO: use completed_date that is stored in the DB instead of creating a new one on the go
      occurrences: (!newInfo.occurrences) ? (test.occurrences-1) : (newInfo.occurrences), // TODO: newInfo.occurrences shouldn't be decremented by 1 as it is decided in advance
      notes: (!newInfo.notes) ? test.notes : newInfo.notes
    }
    return await addTest(newTest);
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
* @return {JSON} result of the query - {success:Boolean}
**/
async function insertQueryDatabase(sql, tableName, id = undefined)
{
  const response = await databaseController.insertQuery(sql);
  if (response.status == "OK"){
      id = (id === undefined) ? response.response.insertId : id;
      logger.logInsert("admin", tableName, id, "Successful.");
      return {success: true, insertId: id};
  }else {
      if (response.err.type === "SQL Error") {
        logger.logInsert("admin", tableName, "-1",
        "Unsuccessfully tried to execute query: START>>>" + sql + "<<<END. SQL Error message: START>>>" + response.err.sqlMessage + "<<<END.");
      }
      else {
        logger.logInsert("admin", tableName, "-1",
        "Unsuccessfully tried to execute query: START>>>" + sql + "<<<END. Invalid request error message: START>>>" + response.err.cause + "<<<END.");
      }
      return {success: false};
  }
}

/**
* Request editing of an entry in table
* @param {String} table - Table to edit
* @param {String} id - id to edit
* @return {String} token
**/
async function requestEditing(table, id)
{
  const data = await databaseController.requestEditing(table,id).then( data => {return data;});

  // TODO: return token + expiration
  if (data.status == "OK"){
    logger.logOther("admin", table, id, "Request for editing was approved.");
    return data.response.token;
  }else {

      logger.logOther("admin", table, id,
        "Request for editing was rejected with message: START>>>" + data.err.cause + "<<<END.");
        return undefined;
  }
}

/**
* Run UPDATE query on the database
* @param {String} table - Table to edit
* @param {String} id - id to edit
* @param {String} sql - SQL query
* @return {JSON} result of the query - {success:Boolean response:Array/Error}
**/
async function updateQueryDatabase(table,id,sql,token)
{
  if(token)
  {
      const response = await databaseController.updateQuery(sql, table, id, token);
      if(response.status === "OK"){
        logger.logUpdate("admin", table, id, "Successful.");
        return {success:true , response: response.response}
      }
      else{
        if (response.err.type === "SQL Error") {
          logger.logUpdate("admin", table, id,
          "Unsuccessfully tried to execute query: START>>>" + sql + "<<<END. SQL Error message: START>>>" + response.err.sqlMessage + "<<<END.");
        }
        else {
          logger.logUpdate("admin", table, id,
          "Unsuccessfully tried to execute query: START>>>" + sql + "<<<END. Invalid request error message: START>>>" + response.err.cause + "<<<END.");
        }
        return {success:false , response: response.err}
      }
  }
  else {
    return {success:false, response: {problem:"Token in use/No token defined"} };
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
      sql += `'${values[i]}',`;
  }
  sql += `'${values[values.length-1]}');`
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
      sql += `${properties[i]} = '${values[i]}', `;
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
* Prepare UPDATE query on the database
* @param {String} table - Table in which to insert an entry
* @param {String} idProperty - property, that the entry can be identified with
* @param {String} id - value of idProperty
* @return {String} SQL query
**/
function prepareDeleteSQL(table, idProperty, id)
{
  // TODO: add logging in delete
  const sql = `DELETE FROM ${table} WHERE ${idProperty}='${id}' LIMIT 1`;
  return sql;
}

module.exports = {
    getOverdueTestsExtended,
    getCarer,
    getPatient,
    getHospital,
    getOverdueGroups,
    getUser,
    getAllPatients,
    getAllTests,
    getTestsOfPatient,
    getAllTestsOnDate,
    getOverdueTests,
    getTestWithinWeek,
    addTest,
    addUser,
    addPatient,
    addHospital,
    addCarer,
    updatePassword,
    changeTestStatus,
    editTest,
    editPatient,
    editCarer,
    editHospital,
    getSortedOverdueWeeks,
};
