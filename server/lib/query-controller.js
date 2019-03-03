const databaseController = require('./db_controller/db-controller.js');
const utils = require("./utils.js");
const authenticator = require("./authenticator.js")

/**
* Get all the patients from the database
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getAllPatients()
{
  let sql = "Select * From Patient;";
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
  let response = await getUser(json.username);
  if (!(response.response instanceof Array)){
    return response;
  }
  let user = response.response[0];
  if(user){
    var hash = authenticator.produceHash(json.hashed_password,user.iterations,user.salt);
    let sql = `UPDATE User SET hashed_password='${hash}', WHERE username = ${json.username} LIMIT 1;`;
    return await updateQueryDatabase("User",json.username,sql);
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
  let sql = `Select * From User Where username='${username}' Limit 1;`;
  return await selectQueryDatabase(sql)
}

/**
* Get all the tests from the database
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getAllTests()
{
  let sql = "Select * From Test ORDER BY due_date ASC;";
  return await selectQueryDatabase(sql)
}

/**
* Get all the tests from a specific patient from the database
* @param {String} patientId - id of a patient
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getTestsOfPatient(patientId){
  let sql = `Select * From Test Where patient_no = ${patientId}`;
  return await selectQueryDatabase(sql)
}

/**
* Get all the tests on specific date from the database
* @param {String} date - date (format: "YYYY-MM-DD")
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getAllTestsOnDate(date)
{
  let sql = `Select * From Test Where due_date = '${date}';`;
  return await selectQueryDatabase(sql)
}

/**
* Get all the overdue tests from the database
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getOverdueTests()
{
  let sql = `Select * From Test Join Patient On Patient.patient_no=Test.patient_no Where completed_date IS NULL AND due_date < CURDATE() AND completed_status='no' ORDER BY due_date ASC;`;
  return await selectQueryDatabase(sql);
}

/**
* Get all the overdue tests from the database plus additional info about time difference
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getOverdueTestsExtended()
{
  let sql = `Select *, DATEDIFF(CURDATE(),due_date) AS difference From Test NATURAL JOIN Patient where completed_date IS NULL AND due_date < CURDATE() AND completed_status='no' ORDER BY due_date ASC;`;
  return await selectQueryDatabase(sql);
}

/**
* Get all the overdue tests from the database separated within groups
* @return {Array of JSON} result of the query - [{class:String test:Array}]
**/
async function getOverdueGroups()
{
      const today = new Date();
      let tests = await getOverdueTestsExtended();
      let sortedTests = tests.success ? tests.response : [];
      let groups = [{class: "Year+", tests: []}, {class: "6+ months", tests: []},{class: "1-6 months", tests: []},
                    {class: "2-4 weeks", tests: []}, {class: "Less than 2 weeks", tests: []}];

      var i = 0;
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
  var iterations = authenticator.produceIterations();
  var salt = authenticator.produceSalt();
  //Hash password to store it in database (password should be previously hashed with another algorithm on client side)
  var hash = authenticator.produceHash(json.hashed_password,iterations,salt);
  let sql = `INSERT INTO User VALUES(${json.username},${hash},${salt},${iterations},${json.email});`;
  return await insertQueryDatabase(sql);
}

//TODO:Delete when changed to JSON one
async function addTest(patient_no, date, notes, frequency, occurrences=1)
{
    var json = {patient_no:patient_no, due_date:date, notes:notes, frequency:frequency, occurrences:occurrences};
    return await addTestJSON(json)
}

/**
* Add new test to the database
* @param {JSON} - entry to add
* Obligatory properties within JSON
* @property patient_no
* @property due_date
* @return {JSON} result of the query - {success:Boolean}
**/
//TODO:Delete JSON from name
async function addTestJSON(json)
{
  var sql = prepareInsertSQL('Test',json);
  return await insertQueryDatabase(sql);
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
  var sql = prepareInsertSQL('Patient',json);
  return await insertQueryDatabase(sql);
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
  var sql = prepareInsertSQL('Hospital',json);
  return await insertQueryDatabase(sql);
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
  var sql = prepareInsertSQL('Carer',json);
  return await insertQueryDatabase(sql);
}

//TODO: delete when json can be passed
async function changeTestStatus(testId, newStatus)
{
    var test = {testId: testId, newStatus: newStatus}
    return await changeTestStatusJSON(test)
}

/**
* Change the status of the test in the database
* @param {JSON} test
* @property testId {String} - id of a test to change
* @property newStatus {enum: "completed"/"late"} - new status of a test
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
//TODO: delete JSON from name
async function changeTestStatusJSON(test)
{
  switch(test.newStatus)
  {
    case "completed": {status = "yes"; date=`CURDATE()`; break;}
    case "late": {status = "no"; date=`NULL`; break;}
    default: return {success:false, response: "NO SUCH UPDATE"}
  }
  let sql = `UPDATE Test SET completed_status='${status}', completed_date=${date} WHERE test_id = ${test.testId};`;
  return await updateQueryDatabase("Test", test.testId,sql);
}

/**
* Get all tests within the week from the database
* @param {String} date - any date (from Monday to Friday) within the week to retrieve (format: "YYYY-MM-DD")
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getTestWithinWeek(date)
{
  var response = await Promise.all(getTestsDuringTheWeek(date))
                              .then(days => {return checkMultipleQueriesStatus(days)})
                              .then(data => {return data})
  return response;
}

//=====================================
//  HELPER FUNCTIONS BELOW:
//=====================================

/**
* Produce multiple gueries on the database to retrieve test within the week
* @param {String} date - date in the week to retrieve tests (format: "YYYY-MM-DD")
* @return {Array} array of queries to run
**/
function getTestsDuringTheWeek(date)
{
  var weekDay = new Date(date).getDay();
  var daysInWeek=[]
  var sql;
  var i = 0;
  while(i<5)
  {
    day = -1*(weekDay - 1) + i;
    sql = `Select * From Test Join Patient on Test.patient_no=Patient.patient_no Where due_date = DATE_ADD('${date}', INTERVAL ${day} DAY);`;
    daysInWeek.push(databaseController.selectQuery(sql));
    i++;
  }
  day = -1*(weekDay - 1) + i;
  sql = `Select * From Test Join Patient on Test.patient_no=Patient.patient_no Where due_date = DATE_ADD('${date}', INTERVAL ${day} DAY) OR due_date = DATE_ADD('${date}', INTERVAL ${day+1} DAY);`;
  daysInWeek.push(databaseController.selectQuery(sql));
  return daysInWeek;
}

/**
* Run multiple gueries on the database
* @param {Array} queries - array of queries to run
* @return {JSON} result of the query - {success:true/false response:Array/String}
**/
function checkMultipleQueriesStatus(queries)
{
  var data = [];
  var error = false;
  queries.forEach(query=>{
    if(query.status==="OK"){
      data.push(query.response.rows)
    }
    else
    {
      error = true;
    }
  })
  if(error)
  {
    return {success:false, response:"One query failed"};
  }
  return {success:true, response:data};
}

/**
* Run SELECT query on the database
* @param {String} sql - SQL query
* @return {JSON} result of the query - {success:Boolean response:Array/Error}
**/
async function selectQueryDatabase(sql)
{
  var response = await databaseController.selectQuery(sql).then((queryResponse) =>{
    if(queryResponse.status==="OK"){
      data = queryResponse.response.rows;
      return {success:true, response:data}
    }
    else{
      return {success:false, response:queryResponse.err}
    }
  });
  return response;
}

/**
* Run INSERT query on the database
* @param {String} sql - SQL query
* @return {JSON} result of the query - {success:Boolean}
**/
async function insertQueryDatabase(sql)
{
  let response = await databaseController.insertQuery(sql);
  if (response.status == "OK"){
      return {success: true};
  }else {
      return {success: false};
  }
}

/**
* Request edititng of an entry in table
* @param {String} table - Table to edit
* @param {String} id - id to edit
* @return {String} token
**/
async function requestEditing(table, id)
{
  var data = await databaseController.requestEditing(table,id).then( data => {return data;});
  var token = data.response.token
  return token;
}

/**
* Run UPDATE query on the database
* @param {String} table - Table to edit
* @param {String} id - id to edit
* @param {String} sql - SQL query
* @return {JSON} result of the query - {success:Boolean response:Array/Error}
**/
async function updateQueryDatabase(table,id,sql)
{
  var token = await requestEditing(table,id);
  if(token!=undefined)
  {
    let response = await databaseController.updateQuery(sql, table, id, token)
    if(response.status==="OK"){
      return {success:true , response: response.response}
    }
    else{
      return {success:false , response: response.err}
    }
  }
  else {
    return {success:false, response: {problem:"Token in use"} };
  }
}

/**
* Run UPDATE query on the database
* @param {String} table - Table in which to insert an entry
* @param {JSON} object -  JSON, which is being entried
* @return {String} SQL query
**/
function prepareInsertSQL(table,object)
{
  var sql = `INSERT INTO ${table}(`;
  var properties = Object.keys(object);
  for(var i=0; i<properties.length-1; i++)
  {
    sql += `${properties[i]},`;
  }
  sql += `${properties[properties.length-1]}) Values(`;
  var values = Object.values(object);
  for(var i=0; i<values.length-1; i++)
  {
      sql += `'${values[i]}',`;
  }
  sql += `'${values[values.length-1]}');`
  return sql;
}

module.exports = {
    getOverdueTestsExtended,
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
};
