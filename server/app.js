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
        let response = await queryController.getAllPatients();
        socket.emit("getAllPatientsResponse", response);
    });

    socket.on('getAllTests', async () => {
        let response = await queryController.getAllTests();
        socket.emit("getAllTestsResponse", response);
    });

    socket.on('getTestsOfPatient', async (patientId) => {
        let response = await queryController.getTestsOfPatient(patientId);
        socket.emit('getTestsOfPatientResponse', response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    **/
    socket.on('getAllTestsOnDate', async (date) => {
        let response = await queryController.getAllTestsOnDate(date);
        socket.emit('getAllTestsOnDateResponse',response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    *@param {Boolean} anydayTestsOnly - if unscheduled test to return
    **/
    socket.on('getTestsInWeek',async (date) => {
        let response = await queryController.getTestWithinWeek(date);
        socket.emit('getTestsInWeekResponse', response);
    });

    socket.on('getOverdueTests', async () => {
        let response = await queryController.getOverdueTests();
        socket.emit('getOverdueTestsResponse', response);
    });

    // updates of database --------------------------------
    // TODO add endpoints for diary updates

    socket.on("addTest", async (patientId, date, frequency) => {
        let response = await queryController.addTest(patientId, date, frequency);
        if (response.success){
            socket.emit("testAdded", response.response);
            socket.in("main_page").emit("testAdded", response.response)
        }else{
            console.log("error in insert");
        }
    });

    socket.on('testStatusChange', async (testId, newStatus) => {
        // TODO change test status, if success, return testId, testDueDate and newStatus
        let response = await queryController.changeTestStatus(testId,newStatus);
        console.log(response);
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
