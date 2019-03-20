/**
 * The module responsible for all the queries on the database
 * and processing of the data retrieved.
 * @module server
 * @author Mateusz Nowak, Jacopo Madaluni, Luka Kralj
 * @version 0.0.1
 */

//the logger has to be required before anything else so that the right output file path is specified 
const logger = require('./lib/logger')
logger.changeOption("outputFilePath", __dirname + "/logs")

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const queryController = require('./lib/query-controller.js');
const CONFIG_FILE_PATH = __dirname + '/config/config.json';
const jsonController = require('./lib/json-parser');
const conf = jsonController.getJSON(CONFIG_FILE_PATH);
const port = conf.port;
const authenticator = require("./lib/authenticator.js");
const email_controller = require('./lib/email/email-controller');

http.listen(port);

// to broadcast in room => io.in("room").emit("change", json);

io.on('connection',function(socket)
{

    // ==============
    // CONNECTIVITY
    // ==============

    logger.info(`Socket ${socket.id} connected`);
    socket.emit("connected");

    socket.on("disconnect", () => {
        logger.info(`Socket ${socket.id} disconnected`);
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
                logger.info(`Socket ${socket.id} left ${oldRoom}`);
            }
            socket.join(room);
            logger.info(`Socket ${socket.id} joined ${room}`);
        }
    });

    // ==============
    // AUTHENTICATION
    // ==============

    /**
    * Login endpoint.
    * @param {username:username, password:password} credentials Hashed json of credentials
    * @return {Boolean} True if credentials are correct
    */
    socket.on('authenticate', async (credentials) => {
        logger.info(`Authentication request from ${socket.id}`);
        const user = await queryController.getUser(credentials.username);
        let res = authenticator.canLogin(credentials,user.response);
        let accessToken = undefined;
        if (res) {
            accessToken = await authenticator.registerNewUsername(credentials.username);
        }
        logger.info("access token: " + accessToken); // TODO: return to user
        logger.info(`Authentication ${res ? "successful" : "unsuccessful"}`);
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

    // ==============
    // GETTERS
    // ==============

    socket.on('getAllPatients', async (accessToken,isAdult=true) => {
        if (!accessToken) {
            socket.emit("getAllPatientsResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("getAllPatientsResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getAllPatients(isAdult);
        socket.emit("getAllPatientsResponse", {success: true, response: response.response});
    });

    socket.on("getFullPatientInfo", async (patientId, accessToken) => {
        if (!accessToken) {
            socket.emit("getFullPatientInfoResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("getFullPatientInfoResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getFullPatientInfo(patientId);
        socket.emit("getFullPatientInfoResponse", {success: true, response: response.response});
    });


    socket.on('getNextTestsOfPatient', async (patientId, accessToken) => {
        if (!accessToken) {
            socket.emit("getNextTestsOfPatientResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("getNextTestsOfPatientResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getNextTestsOfPatient(patientId);
        socket.emit('getNextTestsOfPatientResponse', response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    *@param {Boolean} anydayTestsOnly - if unscheduled test to return
    **/
    //TODO: PASS "isAdult" VARIABLE (BOOLEAN) FROM THE UI
    socket.on('getTestsInWeek',async (date, accessToken,isAdult=true) => {
        if (!accessToken) {
            socket.emit("getTestsInWeekResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("getTestsInWeekResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getTestWithinWeek(date,isAdult);
        socket.emit('getTestsInWeekResponse', {success: true, response: response.response});
    });

    //TODO: PASS "isAdult" VARIABLE (BOOLEAN) FROM THE UI
    socket.on('getOverdueTests', async (accessToken,isAdult=true) => {
        if (!accessToken) {
            socket.emit("getOverdueTestsResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("getOverdueTestsResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        //const response = await queryController.getOverdueGroups();
        const response = await queryController.getSortedOverdueWeeks(isAdult);
        socket.emit('getOverdueTestsResponse', {success: true, response: response.response});
    });

    socket.on('getTestInfo', async (testId, accessToken) => {
        if (!accessToken) {
            socket.emit("getTestInfoResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("getTestInfoResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getTestInfo(testId);
        socket.emit("getTestInfoResponse", response);
    });

    //TODO: PASS "isAdult" VARIABLE (BOOLEAN) FROM THE UI
    socket.on('getOverdueReminderGroups', async (accessToken,isAdult=true) => {
        if (!accessToken) {
            socket.emit("getOverdueReminderGroupsResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("getOverdueReminderGroupsResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.getOverdueReminderGroups(isAdult);
        socket.emit("getOverdueReminderGroupsResponse", response);
    });

    // ==============
    // ADDING
    // ==============

    socket.on("addTest", async (patientId, date, notes, frequency, occurrences, accessToken) => {
        if (!accessToken) {
            socket.emit("addTestResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("addTestResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const test = {patient_no:patientId, due_date:date, notes:notes, frequency:frequency, occurrences:occurrences}
        const response = await queryController.addTest(test, username);
        if (response.success){
            socket.emit("addTestResponse", {success: true});
            io.in("main_page").emit("testAdded")
        }else{
            socket.emit("addTestResponse", {success: false});
            logger.info("error in insert");
        }
    });

    socket.on("addPatient", async (newPatient, accessToken) => {
        if (!accessToken) {
            socket.emit("addPatientResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("addPatientResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.addPatientExtended(newPatient, username);
        if (response.success){
            socket.emit("addPatientResponse", {success: true, response: response.response});
            io.in("patients_page").emit("patientEdited", newPatient.patient_no, newPatient);
        }else{
            socket.emit("addPatientResponse", {success: false});
        }
    });

    // ==============
    // EDIT TOKEN EXCHANGE
    // ==============

    socket.on("requestTestEditToken", async (testId, accessToken) => {
        if (!accessToken) {
            socket.emit("requestTestEditTokenResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("requestTestEditTokenResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.requestEditing("Test", testId, username);
        socket.emit("requestTestEditTokenResponse", {success: true, token: response});

    });

    socket.on("requestPatientEditToken", async (patientId, accessToken) => {
        if (!accessToken) {
            socket.emit("requestPatientEditTokenResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("requestPatientEditTokenResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const token = await queryController.requestEditing("Patient", patientId, username);
        socket.emit("requestPatientEditTokenResponse", {success: true, token: token});
    });

    socket.on("discardEditing", async (table, id, token, accessToken) => {
        if (!accessToken) {
            socket.emit("discardEditingResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("discardEditingResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.returnToken(table, id, token, username);
        socket.emit("discardEditingResponse", response);
    });

    // ==============
    // DELETING
    // ==============

    socket.on("deletePatient", async (patientId, token, accessToken) => {
        if (!accessToken) {
            socket.emit("deletePatientResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("deletePatientResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.deletePatient(patientId, token, username);
        if (response.success){
            socket.emit("deletePatientResponse", {success: true});
            io.in("patients_page").emit("patientEdited");
        }else{
            socket.emit("deletePatientResponse", {success: false});
        }
    });

    socket.on("unscheduleTest", async (testId, token, accessToken) => {
        if (!accessToken) {
            socket.emit("unscheduleTestResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("unscheduleTestResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.unscheduleTest(testId, token, username);
        if (response.success){
            socket.emit("unscheduleTestResponse", { success:true });
            io.in("main_page").emit("testAdded");
        }else{
            socket.emit("unscheduleTestResponse", {success:false, message: "Something went wrong"});
        }

    });

    // ==============
    // UPDATING
    // ==============

    socket.on('testStatusChange', async (testId, newStatus, accessToken) => {
        if (!accessToken) {
            socket.emit("testStatusChangeResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("testStatusChangeResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const test = {testId: testId, newStatus: newStatus}
        const response = await queryController.changeTestStatus(test, username);
        if (response.success){
            socket.emit('testStatusChangeResponse', {success: true, response: response.response});
            io.in("main_page").emit('testAdded');
        }else{
            socket.emit('testStatusChangeResponse', {success: false});
        }
    });

    socket.on("editTest", async (testId, newInfo, token, accessToken) => {
        if (!accessToken) {
            socket.emit("editTestResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("editTestResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.editTest(testId, newInfo, token, username);
        logger.info({response});

        if (response.success){
            socket.emit("editTestResponse", {success: true, response: response.response});
            //socket.emit("testAdded");
            io.in("main_page").emit("testAdded");
        } else {
            socket.emit("editTestResponse", {success: false});
        }
    });

    socket.on("changeTestDueDate", async (testId, newDate, accessToken) => {
        if (!accessToken) {
            socket.emit("changeTestDueDateResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("changeTestDueDateResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.changeTestDueDate(testId, newDate, username);
        if (response.success){
            socket.emit("changeTestDueDateResponse", {success: true});
            io.in("main_page").emit("testAdded");
        }else{
            socket.emit("changeTestDueDateResponse", {success: false});
        }
    });

    socket.on("editPatient", async (patientId, newInfo, token, accessToken) => {
        if (!accessToken) {
            socket.emit("editPatientResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("editPatientResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        logger.info(token);
        const response = await queryController.editPatientExtended(newInfo, token, username);
        logger.info(response);
        if (response.success){
            socket.emit("editPatientResponse", {success: true});
        } else {
            socket.emit("editPatientResponse", response);
        }
        // !important to be here and not in the if statement!
        io.in("patients_page").emit("patientEdited", patientId, newInfo);

    });

    socket.on("changeTestColour", async (testId, newColour, accessToken) => {
        if (!accessToken) {
            socket.emit("changeTestColourResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("changeTestColourResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.changeTestColour(testId, newColour, username);
        if (response.success){
            socket.emit("changeTestColourResponse", {success: true});
            io.in("main_page").emit("testAdded");
        }else{
            socket.emit("changeTestColourResponse", {success: false});
        }
    });

    socket.on("changePatientColour", async (patientNo, newColour, accessToken) => {
        if (!accessToken) {
            socket.emit("changePatientColourResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("changePatientColourResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.changePatientColour(patientNo, newColour, username);
        logger.info(response)
        if (response.success){
            socket.emit("changePatientColourResponse", {success: true});
            io.in("main_page").emit("testAdded");
        }else{
            socket.emit("changePatientColourResponse", {success: false});
        }
    });

    // ==============
    // OTHER
    // ==============

     //TODO: ADD CLIENT CONNECTION HERE
    //PARAMETER - (STRING) USERNAME TO CHANGE PASSWORD
    socket.on('passwordRecoverRequest', async (username) => {
        const passwordResponse = await email_controller.recoverPassword(username);
        socket.emit('passwordRecoverResponse', passwordResponse);
    });

    socket.on('sendOverdueReminders', async (testID, accessToken) => {
        logger.debug("ovedue called");
        if (!accessToken) {
            socket.emit("sendOverdueRemindersResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("sendOverdueRemindersResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }
        if (!Array.isArray(testID)) {
            testID = [testID];
        }
        const response = await email_controller.sendOverdueReminders(testID, username);
        socket.emit("sendOverdueRemindersResponse", response);
    });

    socket.on('sendNormalReminders', async (testID, accessToken) => {
        if (!accessToken) {
            socket.emit("sendNormalRemindersResponse", { success:false, errorType:"authentication", response: "Authentication required." });
            return;
        }
        const username = await authenticator.verifyToken(accessToken);
        if (!username) {
            socket.emit("sendNormalRemindersResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        if (!Array.isArray(testID)) {
            testID = [testID];
        }
        const response = await email_controller.sendNormalReminders(testID, username);
        socket.emit("sendNormalRemindersResponse", response);
    });

});
