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

    handleAuthentication = async (responseEmit, accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit(responseEmit, { success:false, errorType:"authentication", response: "Authentication required." });
            return undefined;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            // INVALID TOKEN.
            socket.emit(responseEmit, { success:false, errorType:"authentication", response: "Invalid credentials." });
            return undefined;
        }
        return username;
    }

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

    socket.on("logout", async (accessToken) => {
        if (!accessToken) {
            // REQUIRE TOKEN.
            socket.emit("logoutResponse", { success:false, response: "Authentication required." });
            return;
        }
        const res = await authenticator.logoutUser(accessToken);
        if (!res) {
            // INVALID TOKEN.
            socket.emit("logoutResponse", { success:false, response: "Invalid credentials." });
            return;
        }

        socket.emit("logoutResponse", { success:true, response: "User logged out." });
    });

    socket.on('getAllPatients', async (accessToken) => {
        const username = await handleAuthentication("getAllPatientsResponse", accessToken);
        if (!username){return};

        const response = await queryController.getAllPatients();
        socket.emit("getAllPatientsResponse", {success: true, response: response.response});
    });

    socket.on("getFullPatientInfo", async (patientId, accessToken) => {
        const username = await handleAuthentication("getFullPatientInfoResponse", accessToken);
        if (!username){return};

        const response = await queryController.getFullPatientInfo(patientId);
        socket.emit("getFullPatientInfoResponse", response.response);
    });

    socket.on('getAllTests', async (accessToken) => {
        const username = await handleAuthentication("getAllTestsResponse", accessToken);
        if (!username){return};

        const response = await queryController.getAllTests();
        socket.emit("getAllTestsResponse", response);
    });

    socket.on('getNextTestsOfPatient', async (patientId, accessToken) => {
        const username = await handleAuthentication("getNextTestsOfPatientResponse", accessToken);
        if (!username){return};

        const response = await queryController.getNextTestsOfPatient(patientId);
        socket.emit('getNextTestsOfPatientResponse', response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    **/
    socket.on('getAllTestsOnDate', async (date, accessToken) => {
        const username = await handleAuthentication("getAllTestsOnDateResponse", accessToken);
        if (!username){return};

        const response = await queryController.getAllTestsOnDate(date);
        socket.emit('getAllTestsOnDateResponse',response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    *@param {Boolean} anydayTestsOnly - if unscheduled test to return
    **/
    socket.on('getTestsInWeek',async (date, accessToken) => {
        const username = await handleAuthentication("getTestsInWeekResponse", accessToken);
        if (!username){return};

        const response = await queryController.getTestWithinWeek(date);
        socket.emit('getTestsInWeekResponse', {success: true, response: response.response});
    });

    socket.on('getOverdueTests', async (accessToken) => {
        const username = await handleAuthentication("getOverdueTestsResponse", accessToken);
        if (!username){return};

        //const response = await queryController.getOverdueGroups();
        const response = await queryController.getSortedOverdueWeeks();
        socket.emit('getOverdueTestsResponse', {success: true, response: response.response});
    });

    socket.on('getTestInfo', async (testId, accessToken) => {
        const username = await handleAuthentication("getTestInfoResponse", accessToken);
        if (!username){return};

        const response = await queryController.getTestInfo(testId);
        console.log({response});
        socket.emit("getTestInfoResponse", response);
    });

    socket.on("requestTestEditToken", async (testId, accessToken) => {
        const username = await handleAuthentication("requestTestEditTokenResponse", accessToken);
        if (!username){return};

        const response = await queryController.requestEditing("Test", testId, username);
        socket.emit("requestTestEditTokenResponse", response);

    });

    socket.on("requestPatientEditToken", async (patientId, accessToken) => {
        const username = await handleAuthentication("requestPatientEditTokenResponse", accessToken);
        if (!username){return};

        const token = await queryController.requestEditing("Patient", patientId, username);
        socket.emit("requestPatientEditTokenResponse", token);
    });

    socket.on("discardEditing", async (table, id, token, accessToken) => {
        const username = await handleAuthentication("discardEditingResponse", accessToken);
        if (!username){return};

        const response = await queryController.returnToken(table, id, token, username);
        socket.emit("discardEditingResponse", response);
    });

    // updates of database --------------------------------

    socket.on("addTest", async (patientId, date, notes, frequency, occurrences, accessToken) => {
        const username = await handleAuthentication("addTestResponse", accessToken);
        if (!username){return};

        const test = {patient_no:patientId, due_date:date, notes:notes, frequency:frequency, occurrences:occurrences}
        const response = await queryController.addTest(test, username);
        if (response.success){
            socket.emit("addTestResponse", {success: true});
            io.in("main_page").emit("testAdded")
        }else{
            socket.emit("addTestResponse", {success: false});
            console.log("error in insert");
        }
    });

    socket.on("addPatient", async (newPatient, accessToken) => {
        const username = await handleAuthentication("addPatientResponse", accessToken);
        if (!username){return};

        const response = await queryController.addPatientExtended(newPatient, username);
        if (response.success){
            socket.emit("addPatientResponse", {success: true, response: response.response});
            io.in("patients_page").emit("patientEdited", newPatient.patient_no, newPatient);
        }else{
            socket.emit("addPatientResponse", {success: false});
        }
    });

    socket.on("deletePatient", async (patientId, token, accessToken) => {
        const username = await handleAuthentication("deletePatientResponse", accessToken);
        if (!username){return};

        const response = await queryController.deletePatient(patientId, token, username);
        if (response.success){
            socket.emit("deletePatientResponse", {success: true});
            io.in("patients_page").emit("patientEdited");
        }else{
            socket.emit("deletePatientResponse", {success: false});
        }
    });

    socket.on('testStatusChange', async (testId, newStatus, accessToken) => {
        const username = await handleAuthentication("testStatusChangeResponse", accessToken);
        if (!username){return};

        const test = {testId: testId, newStatus: newStatus}
        const response = await queryController.changeTestStatus(test, username);
        if (response.success){
            socket.emit('testStatusChangeResponse', {success: true, response: response.response});
            io.in("main_page").emit('testStatusChange', testId, newStatus);
        }else{
            socket.emit('testStatusChangeResponse', {success: false});
        }
    });

    socket.on("editTest", async (testId, newInfo, token, accessToken) => {
        const username = await handleAuthentication("editTestResponse", accessToken);
        if (!username){return};

        const response = await queryController.editTest(testId, newInfo, token, username);
        console.log({response});

        if (response.success){
            socket.emit("editTestResponse", {success: true, response: response.response});
            socket.emit("testAdded");
            socket.in("main_page").emit("testAdded");
        } else {
            socket.emit("editTestResponse", {success: false});
        }
    });

    socket.on("changeTestDueDate", async (testId, newDate, accessToken) => {
        const username = await handleAuthentication("changeTestDueDateResponse", accessToken);
        if (!username){return};

        const response = await queryController.changeTestDueDate(testId, newDate, username);
        if (response.success){
            socket.emit("changeTestDueDateResponse", {success: true});
            io.in("main_page").emit("testAdded", response.response);
        }else{
            socket.emit("changeTestDueDateResponse", {success: false});
        }
    });

    socket.on("editPatient", async (patientId, newInfo, token, accessToken) => {
        const username = await handleAuthentication("editPatientResponse", accessToken);
        if (!username){return};

        console.log(token);
        const response = await queryController.editPatientExtended(newInfo, token, username);
        console.log(response);
        if (response.success){
            socket.emit("editPatientResponse", {success: true});
        } else {
            socket.emit("editPatientResponse", response);
        }
        // !important to be here and not in the if statement!
        io.in("patients_page").emit("patientEdited", patientId, newInfo);

    });

    socket.on("unscheduleTest", async (testId, token, accessToken) => {
        const username = await handleAuthentication("unscheduleTestResponse", accessToken);
        if (!username){return};

        const response = await queryController.unscheduleTest(testId, token, username);
        if (response.success){
            socket.emit("unscheduleTestResponse", { success:true });
            io.in("main_page").emit("testAdded");
        }else{
            socket.emit("unscheduleTestResponse", {success:false, message: "Something went wrong"});
        }

    });


});
