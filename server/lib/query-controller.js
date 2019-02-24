const databaseController = require('./db_controller/db-controller.js');
const tokenGenerator = require('./token-generator.js');

function getTestsDuringTheWeek(date)
{
  var weekDay = new Date(date).getDay();
  //Check if it's Saturday or Sunday and produce Friday instead
  //if(weekDay==6 || weekDay==0)
  //{
//    weekDay=5;
  //}
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
    selectQueryDatabase,
    getTestWithinWeek,
};
