/**
 * The module responsible for all the queries on the database
 * and processing of the data retrieved.
 * @module server
 * @author Mateusz Nowak & Jacopo Madaluni
 * @version 0.0.1
 */


const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const queryController = require('./lib/query-controller.js');
const CONFIG_FILE_PATH = __dirname + '/config/config.json';
const jsonController = require('./lib/json-controller');
const conf = jsonController.getJSON(CONFIG_FILE_PATH);
const port = conf.port;
const authenticator = require("./lib/authenticator.js");

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
    socket.on('authenticate', async (credentials) => {
        console.log(`Authentication request from ${socket.id}`);
        const user = await queryController.getUser(credentials.username);
        const res = authenticator.canLogin(credentials,user.response);
        console.log(`Authentication ${res ? "successful" : "unsuccessful"}`);
        socket.emit('authenticationResponse', res);
    });

    socket.on('getAllPatients', async () => {
        const response = await queryController.getAllPatients();
        console.log({response});
        socket.emit("getAllPatientsResponse", response.response);
    });

    socket.on("getFullPatientInfo", async (patientId) => {
        const response = await queryController.getFullPatientInfo(patientId);
        socket.emit("getFullPatientInfoResponse", response);
    });

    socket.on('getAllTests', async () => {
        const response = await queryController.getAllTests();
        socket.emit("getAllTestsResponse", response);
    });

    socket.on('getTestsOfPatient', async (patientId) => {
        const response = await queryController.getTestsOfPatient(patientId);
        socket.emit('getTestsOfPatientResponse', response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    **/
    socket.on('getAllTestsOnDate', async (date) => {
        const response = await queryController.getAllTestsOnDate(date);
        socket.emit('getAllTestsOnDateResponse',response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    *@param {Boolean} anydayTestsOnly - if unscheduled test to return
    **/
    socket.on('getTestsInWeek',async (date) => {
        const response = await queryController.getTestWithinWeek(date);
        socket.emit('getTestsInWeekResponse', response);
    });

    socket.on('getOverdueTests', async () => {
        //const response = await queryController.getOverdueGroups();
        const response = await queryController.getSortedOverdueWeeks();
        socket.emit('getOverdueTestsResponse', response.response);
    });

    socket.on('requestTestEditing', async (testId) => {

    })

    socket.on('getTestInfo', async (testId) => {
        const response = await queryController.getTestInfo(testId);
        socket.emit("getTestInfoResponse", response);
    });

    socket.on("requestTestEditToken", async (testId) => {
        //
    });

    socket.on("requestPatientEditToken", async (patientId) => {
        const token = await queryController.requestEditing("Patient", patientId);
        socket.emit("requestPatientEditTokenResponse", token);
    });

    // updates of database --------------------------------
    // TODO add endpoints for diary updates

    socket.on("addTest", async (patientId, date, notes, frequency, occurrences) => {
        const test = {patient_no:patientId, due_date:date, notes:notes, frequency:frequency, occurrences:occurrences}
        const response = await queryController.addTest(test);
        if (response.success){
            socket.emit("testAdded", response.response);
            socket.in("main_page").emit("testAdded", response.response)
        }else{
            console.log("error in insert");
        }
    });

    socket.on('testStatusChange', async (testId, newStatus) => {
        const test = {testId: testId, newStatus: newStatus}
        const response = await queryController.changeTestStatus(test);
        // TODO check if change status was successful !
        socket.emit('testStatusChange', testId, newStatus);
        io.in("main_page").emit('testStatusChange', testId, newStatus);
    });

    socket.on("editTest", async (testId, newInfo, token) => {
        const response = await queryController.editTest(testId, newInfo, token);
        if (response.success){
            // broadcast new test
        } else {
            // emit failure to the socket
        }
    });
});


/**
* TODO: Get user data from the database provided the username
*
function getUserInDatabase(username)
{
  return [{id:"1", username:"admin", password:"f0edc3ac2daf24876a782e9864e9596970a8b8717178e705cd70726b92dbfc58c8e8fb27f7082239969496d989ff65d0bb2fcc3bd91c3a0251fa221ca2cd88a5",iterations: 1268 ,salt:"d50dbbbe33c2d3c545051917b6a60ccd577a1a3f1a96dfac95199e7b0de32841"}];
}*/
