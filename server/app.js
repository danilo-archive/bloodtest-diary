/**
 * The module responsible for all the queries on the dataabase
 * and processing of the data retrived.
 * @module server
 * @author Mateusz Nowak & Jacopo Madaluni
 * @version 0.0.1
 */


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const queryController = require('./lib/query-controller.js');
const CONFIG_FILE_PATH = __dirname + '/config/config.json';
const jsonController = require('./lib/json-controller');
const conf = jsonController.getJSON(CONFIG_FILE_PATH);
const port = conf.port;
var authenticator = require("./lib/authenticator.js");

http.listen(port);

// to broadcast in room => io.in("room").emit("change", json);

io.on('connection',function(socket)
{
    console.log(`Socket ${socket.id} connected`);
    socket.emit("connected");

    socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected`);
    });

    socket.on("join", (oldRoom, room, reconnecting=false) => {
        if (reconnecting){
            if (socket.rooms[room] !== undefined){
                return;
            }
        }
        if (oldRoom !== room){
            if (oldRoom !== ""){
                socket.leave(oldRoom);
                console.log(`Socket ${socket.id} left ${oldRoom}`);
            }
            socket.join(room);
            console.log(`Socket ${socket.id} joined ${room}`);
        }
    });

    // TODO remove
    socket.on("testChange", (id, status) => {
        console.log("arrived");
        socket.emit("testStatusChange", id, status);
    });

    /**
    * Login endpoint.
    * @param {username:username, password:password} credentials Hashed json of credentials
    * @return {Boolean} True if credentials are correct
    */
    socket.on('authenticate', (credentials) => {
        console.log(`Authentication request from ${socket.id}`);
        res = authenticator.canLogin(credentials,getUserInDatabase(credentials.username));
        console.log(`Authentication ${res ? "successful" : "unsuccesful"}`);
        socket.emit('authenticationResponse', res);
    });

    socket.on('getAllPatients', async () => {
        let sql = "Select * From Patient;";
        console.log(await queryController.selectQueryDatabase(sql))
        socket.emit("getAllPatientsResponse", await queryController.selectQueryDatabase(sql));
    });

    socket.on('getAllTests', async () => {
        let sql = "Select * From Test;";
        console.log(await queryController.selectQueryDatabase(sql))
        socket.emit("getAllTestsResponse", await queryController.selectQueryDatabase(sql));
    });

    socket.on('getTestsOfPatient', async (patientId) => {
        let sql = `Select * From Test Where patient_no = ${patientId}`;
        // All or unscheduled?
        // sql += " AND completed_status='no';";
        console.log(await queryController.selectQueryDatabase(sql))
        socket.emit('getTestsOfPatientResponse', await queryController.selectQueryDatabase(sql));
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    **/
    socket.on('getAllTestsOnDate', async (date) => {
        let sql = `Select * From Test Where first_due_date = '${date}';`;
        console.log(sql);
        console.log(await queryController.selectQueryDatabase(sql))
        socket.emit('getAllTestsOnDateResponse',await queryController.selectQueryDatabase(sql));
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    *@param {Boolean} anydayTestsOnly - if unscheduled test to return
    **/
    socket.on('getTestsInWeek',async (date,anydayTestsOnly=false) => {
        let response = await queryController.getTestWithinWeek(date);
        socket.emit('getTestsInWeekResponse', response);
    });

    socket.on('getOverdueTests', async () => {
      let sql = `Select * From Test Where first_due_date < CURDATE() AND completed_status='no' `
      let response = await queryController.selectQueryDatabase(sql)
      socket.emit('getOverdueTestsResponse', response);
    });

    // updates of database --------------------------------
    // TODO add endpoints for diary updates

    socket.on('testStatusChange', (testId, newStatus) => {
        // TODO change test status, if success, return testId, testDueDate and newStatus
        socket.emit('testStatusChange', testId, newStatus);
        io.in("main_page").emit('testStatusChange', testId, newStatus);
    });
});




/**
* TODO: Get user data from the database provided the username
**/
function getUserInDatabase(username)
{
  return [{id:"1", username:"admin", password:"f0edc3ac2daf24876a782e9864e9596970a8b8717178e705cd70726b92dbfc58c8e8fb27f7082239969496d989ff65d0bb2fcc3bd91c3a0251fa221ca2cd88a5",iterations: 1268 ,salt:"d50dbbbe33c2d3c545051917b6a60ccd577a1a3f1a96dfac95199e7b0de32841"}];
}
