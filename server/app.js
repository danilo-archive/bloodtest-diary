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
const tempActionUsername = "admin"; // temporary until the system is completed


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

    /**
    * Login endpoint.
    * @param {username:username, password:password} credentials Hashed json of credentials
    * @return {Boolean} True if credentials are correct
    */
    socket.on('authenticate', async (credentials) => {
        console.log(`Authentication request from ${socket.id}`);
        const user = await queryController.getUser(credentials.username);
        let res = authenticator.canLogin(credentials,user.response);
        let accessToken = undefined;
        if (res) {
            accessToken = await authenticator.registerNewUsername(credentials.username);
        }
        console.log("access token: " + accessToken); // TODO: return to user
        console.log(`Authentication ${res ? "successful" : "unsuccessful"}`);
        if (res) {
            res = {success:true, accessToken: accessToken};
        }
        else {
            res = {success:false};
        }
        socket.emit('authenticationResponse', res);
    });

    socket.on('getAllPatients', async (accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getAllPatients();
        socket.emit("getAllPatientsResponse", response.response);
    });

    socket.on("getFullPatientInfo", async (patientId, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getFullPatientInfo(patientId);
        socket.emit("getFullPatientInfoResponse", response.response);
    });

    socket.on('getAllTests', async (accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getAllTests();
        socket.emit("getAllTestsResponse", response);
    });

    socket.on('getTestsOfPatient', async (patientId, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getTestsOfPatient(patientId);
        socket.emit('getTestsOfPatientResponse', response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    **/
    socket.on('getAllTestsOnDate', async (date, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getAllTestsOnDate(date);
        socket.emit('getAllTestsOnDateResponse',response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    *@param {Boolean} anydayTestsOnly - if unscheduled test to return
    **/
    socket.on('getTestsInWeek',async (date, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getTestWithinWeek(date);
        socket.emit('getTestsInWeekResponse', response);
    });

    socket.on('getOverdueTests', async (accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        //const response = await queryController.getOverdueGroups();
        const response = await queryController.getSortedOverdueWeeks();
        socket.emit('getOverdueTestsResponse', response.response);
    });

    socket.on('getTestInfo', async (testId, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getTestInfo(testId);
        console.log({response});
        socket.emit("getTestInfoResponse", response);
    });

    socket.on("requestTestEditToken", async (testId, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.requestEditing("Test", testId, tempActionUsername);
        socket.emit("requestTestEditTokenResponse", response);

    });

    socket.on("requestPatientEditToken", async (patientId, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const token = await queryController.requestEditing("Patient", patientId, tempActionUsername);
        console.log("firing");
        socket.emit("requestPatientEditTokenResponse", token);
    });

    socket.on("discardEditing", async (table, id, token, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.returnToken(table, id, token, tempActionUsername);
        socket.emit("discardEditingResponse", response);
    });

    // updates of database --------------------------------
    // TODO add endpoints for diary updates

    socket.on("addTest", async (patientId, date, notes, frequency, occurrences, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const test = {patient_no:patientId, due_date:date, notes:notes, frequency:frequency, occurrences:occurrences}
        const response = await queryController.addTest(test, tempActionUsername);
        if (response.success){
            socket.emit("testAdded", response.response);
            socket.in("main_page").emit("testAdded", response.response)
        }else{
            // TODO: emit response
            console.log("error in insert");
        }
    });

    socket.on('testStatusChange', async (testId, newStatus, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const test = {testId: testId, newStatus: newStatus}
        const response = await queryController.changeTestStatus(test, tempActionUsername);
        // TODO check if change status was successful !
        socket.emit('testStatusChange', testId, newStatus);
        io.in("main_page").emit('testStatusChange', testId, newStatus);
    });

    socket.on("editTest", async (testId, newInfo, token, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.editTest(testId, newInfo, token, tempActionUsername);
        console.log({response});

        if (response.success){
            socket.emit("editTestResponse", response.response);
            socket.in("main_page").emit("editTestResponse", response.response);
        } else {
            // TODO: emit failure to the socket
        }
    });

    socket.on("changeTestDueDate", async (testId, newDate, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        const response = await queryController.changeTestDueDate(testId, newDate, tempActionUsername);
        if (response.success){
            socket.emit("testAdded", response.response);
            io.in("main_page").emit("testAdded", response.response);
        }
    });

    socket.on("editPatient", async (patientId, newInfo, token, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit("getAllPatientsResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        console.log(token);
        const response = await queryController.editPatientExtended(newInfo, token, tempActionUsername);
        console.log(response);
        if (response.success){
            socket.emit("editPatientResponse", {success: true});
        } else {
            socket.emit("editPatientResponse", response);
        }
        io.in("patients_page").emit("patientEdited", patientId, newInfo);

    });
});
