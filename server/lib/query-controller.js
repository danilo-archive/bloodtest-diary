const databaseController = require('./db_controller/db-controller.js');
const tokenGenerator = require('./token-generator.js');

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
  //Get how many days to Sunday
  //day = 7 -  weekDay;
  //sql = `Select * From Test Join Patient on Test.patient_no=Patient.patient_no Where first_due_date = DATE_ADD('${date}', INTERVAL ${day} DAY);`;
  //daysInWeek.push(databaseController.selectQuery(sql));
  return daysInWeek;
}

async function changeTestStatus(testId, newStatus)
{
  console.log("STATUS:" + newStatus);
  var token = await databaseController.requestEditing("Test", testId).then( data => {
    if(data.response.token){
      return data.response.token
    }
    else{
      return data;
    }
  });
  console.log(token);
  if(token!=undefined)
  {
    switch(newStatus)
    {
      case "completed": {status = "yes"; date=`CURDATE()`; break;}
      case "late": {status = "no"; date=`NULL`; break;}
    }
    let sql = `UPDATE Test SET completed_status='${status}', completed_date=${date} WHERE test_id = ${testId};`;
    console.log(sql);
    return {success:true , response: await databaseController.updateQuery(sql, "Test", testId, token).then(data => {return data.response})}
  }
  else {
    return {success:false, response: data.response}
  }
}

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

async function getTestWithinWeek(date)
{
  var response = await Promise.all(getTestsDuringTheWeek(date)).then(days => {return checkMultipleQueriesStatus(days)}).then(data => {return data})
  return response;
}

module.exports = {
    changeTestStatus,
    selectQueryDatabase,
    getTestWithinWeek,
};
