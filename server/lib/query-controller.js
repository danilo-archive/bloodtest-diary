const databaseController = require('./db_controller/db-controller.js');
const utils = require("./utils.js");

/**
* Get all the patients from the database
* @return {JSON} result of the query
**/
async function getAllPatients()
{
  let sql = "Select * From Patient;";
  return await selectQueryDatabase(sql)
}

/**
*Get all the tests from the database
* @return {JSON} result of the query
**/
async function getAllTests()
{
  let sql = "Select * From Test;";
  return await selectQueryDatabase(sql)
}

/**
* Get all the tests from a specific patient from the database
* @param {String} patientId - id of a patient
* @return {JSON} result of the query
**/
async function getTestsOfPatient(patientId){
  let sql = `Select * From Test Where patient_no = ${patientId}`;
  return await selectQueryDatabase(sql)
}

/**
* Get all the tests on specific date from the database
* @param {String} date - date (format: "YYYY-MM-DD")
* @return {JSON} result of the query
**/
async function getAllTestsOnDate(date)
{
  let sql = `Select * From Test Where first_due_date = '${date}';`;
  return await selectQueryDatabase(sql)
}

/**
* Get all the overdue tests from the database
* @return {JSON} result of the query
**/
async function getOverdueTests()
{
  let sql = `Select * From Test Join Patient On Patient.patient_no=Test.patient_no Where first_due_date < CURDATE() AND completed_status='no' `;
  return await selectQueryDatabase(sql);
}


async function addTest(patient_no, date, notes, frequency){
    let today = utils.formatDate(new Date());
    date = utils.formatDate(new Date(date));
    let values = ``;
    console.log({today, date});
    let sql =`INSERT INTO Test (patient_no, added, first_due_date, frequency, lab_id, completed_status, completed_date, notes) VALUES (${patient_no}, ${today}, ${date}, 'weekly', 1, 'in review', NULL, '${notes}');`;
    console.log(sql);
    let response = await databaseController.insertQuery(sql);
    console.log(response);
    if (response.status == "OK"){
        return {success: true};
    }else {
        return {success: false};
    }
}

/**
* Change the status of the test in the database
* @param {String} testId - id of a test to change
* @param {String} newStatus - new status of a test {enum: "completed"/"late"}
* @return {JSON} result of the query
**/
async function changeTestStatus(testId, newStatus)
{
  //console.log("STATUS:" + newStatus);
  var data = await databaseController.requestEditing("Test", testId).then( data => {return data;});
  var token = data.response.token
  //console.log(token);
  if(token!=undefined)
  {
    switch(newStatus)
    {
      case "completed": {status = "yes"; date=`CURDATE()`; break;}
      case "late": {status = "no"; date=`NULL`; break;}
      default: return {success:false, response: data.response}
    }
    let sql = `UPDATE Test SET completed_status='${status}', completed_date=${date} WHERE test_id = ${testId};`;
    //console.log(sql);
    return {success:true , response: await databaseController.updateQuery(sql, "Test", testId, token).then(result => {return result.response})}
  }
  else {
    return {success:false, response: data.response}
  }
}

/**
* Get all tests within the week from the database
* @param {String} date - any date (from Monday to Friday) within the week to retrieve (format: "YYYY-MM-DD")
* @return {JSON} result of the query
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
  for(var i=0;i<6;i++)
  {
    day = -1*(weekDay - 1) + i;
    sql = `Select * From Test Join Patient on Test.patient_no=Patient.patient_no Where first_due_date = DATE_ADD('${date}', INTERVAL ${day} DAY);`;
    daysInWeek.push(databaseController.selectQuery(sql));
  }
  return daysInWeek;
}

/**
* Run multiple gueries on the database
* @param {Array} queries - array of queries to run
* @return {Array} if no error: array of the results of the query
* @return {JSON} if error: result of the faulty query
**/
function checkMultipleQueriesStatus(queries)
{
  var data = [];
  queries.forEach(query=>{
    if(query.status==="OK"){
      data.push(query.response.rows)
    }
    else{
      return {success:false, response:query.err}
    }
  })
  return {success:true, response:data};
}

/**
* Run SELECT query on the database
* @param {String} sql - SQL query
* @return {JSON} result of the query
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


module.exports = {
    getAllPatients,
    getAllTests,
    getTestsOfPatient,
    getAllTestsOnDate,
    getOverdueTests,
    addTest,
    changeTestStatus,
    getTestWithinWeek,
};
