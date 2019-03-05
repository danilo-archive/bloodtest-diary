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
  let token = await requestEditing("User",json.username)
  if (!(response.response instanceof Array)){
    return response;
  }
  let user = response.response[0];
  if(user){
    let hash = authenticator.produceHash(json.hashed_password,user.iterations,user.salt);
    let sql = `UPDATE User SET hashed_password='${hash}', WHERE username = ${json.username} LIMIT 1;`;
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

async function getTestInfo(test_no){
    let sql = `SELECT * FROM Test JOIN Patient ON Patient.patient_no = Test.patient_no WHERE test_no='${test_no}'`;
    return await selectQueryDatabase(sql);
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
  let iterations = authenticator.produceIterations();
  let salt = authenticator.produceSalt();
  //Hash password to store it in database (password should be previously hashed with another algorithm on client side)
  let hash = authenticator.produceHash(json.hashed_password,iterations,salt);
  let sql = `INSERT INTO User VALUES(${json.username},${hash},${salt},${iterations},${json.email});`;
  return await insertQueryDatabase(sql);
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
  let sql = prepareInsertSQL('Test',json);
  console.log(sql);
  return await insertQueryDatabase(sql);
}

/**
* Edit test query
* @param testId The id of the test to be updated
* @param {JSON} newInfo All the information of the test (new and old)
* @param token The token that grants edit priviledges
*/
async function editTest(testId, newInfo, token){
    let sql = prepareUpdateSQL("Test",newInfo,"test_id");
    return await updateQueryDatabase("Test",testId,sql,token);
}

/**
* Edit patient query
* @param {JSON} newInfo All the information of the patient to update
* Obligatory fields in JSON
* @property patient_no {String}
* @param token The token that grants edit priviledges
*/
async function editPatient(newInfo, token){
    let sql = prepareUpdateSQL("Patient",newInfo,"patient_no");
    return await updateQueryDatabase("Patient",newInfo.patient_no,sql,token);
}

/**
* Edit hospital query
* @param {JSON} newInfo All the information of the hospital to update
* Obligatory fields in JSON
* @property hospital_id {String}
* @param token The token that grants edit priviledges
*/
async function editHospital(newInfo, token){
    let sql = prepareUpdateSQL("Hospital",newInfo,"hospital_id");
    return await updateQueryDatabase("Hospital",newInfo.hospital_id,sql,token);
}

/**
* Edit carer query
* @param {JSON} newInfo All the information of the carer to update
* @property carer_id {String}
* @param token The token that grants edit priviledges
*/
async function editCarer(newInfo, token){
    let sql = prepareUpdateSQL("Carer",newInfo,"carer_id");
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
  let sql = prepareInsertSQL('Patient',json);
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
  let sql = prepareInsertSQL('Hospital',json);
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
  let sql = prepareInsertSQL('Carer',json);
  return await insertQueryDatabase(sql);
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
  let token = await requestEditing("Test",test.testId);
  switch(test.newStatus)
  {
    case "completed": {status = "yes"; date=`CURDATE()`; break;}
    case "late": {status = "no"; date=`NULL`; break;}
    case "inReview" : {status = "in review"; date=`CURDATE()`; break;}
    default: return {success:false, response: "NO SUCH UPDATE"}
  }
  let sql = `UPDATE Test SET completed_status='${status}', completed_date=${date} WHERE test_id = ${test.testId};`;
  return await updateQueryDatabase("Test",test.testId,sql,token);
}

/**
* Get all tests within the week from the database
* @param {String} date - any date (from Monday to Friday) within the week to retrieve (format: "YYYY-MM-DD")
* @return {JSON} result of the query - {success:true/false response:Array/Error}
**/
async function getTestWithinWeek(date)
{
  let response = await Promise.all(getTestsDuringTheWeek(date))
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
  let weekDay = new Date(date).getDay();
  let daysInWeek=[]
  let sql;
  let i = 0;
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
  let data = [];
  let error = false;
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
  let response = await databaseController.selectQuery(sql).then((queryResponse) =>{
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
  let data = await databaseController.requestEditing(table,id).then( data => {return data;});
  let token = data.response.token
  return token;
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
* Prapare INSERT query on the database
* @param {String} table - Table in which to insert an entry
* @param {JSON} object -  JSON, which is being entered
* @return {String} SQL query
**/
function prepareInsertSQL(table,object)
{
  let sql = `INSERT INTO ${table}(`;
  let properties = Object.keys(object);
  for(let i=0; i<properties.length-1; i++)
  {
    sql += `${properties[i]},`;
  }
  sql += `${properties[properties.length-1]}) Values(`;
  let values = Object.values(object);
  for(let i=0; i<values.length-1; i++)
  {
      sql += `'${values[i]}',`;
  }
  sql += `'${values[values.length-1]}');`
  return sql;
}

/**
* Prapare UPDATE query on the database
* @param {String} table - Table in which to insert an entry
* @param {JSON} object -  JSON, which is being entered
* @param {String} idProperty - property, that the entry can be idenfied with
* @return {String} SQL query
**/
function prepareUpdateSQL(table, object, idProperty)
{
  let sql = `Update ${table} SET `;
  let properties = Object.keys(object);
  let values = Object.values(object);
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
* Prapare UPDATE query on the database
* @param {String} table - Table in which to insert an entry
* @param {String} idProperty - property, that the entry can be idenfied with
* @param {String} id - value of idProperty
* @return {String} SQL query
**/
function prepareDeleteSQL(table, idProperty, id)
{
  let sql = `DELETE FROM ${table} WHERE ${idProperty}='${id}' LIMIT 1`;
  return sql;
}

module.exports = {
    getOverdueTestsExtended,
    getOverdueGroups,
    getUser,
    getAllPatients,
    getAllTests,
    getTestInfo,
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
};
