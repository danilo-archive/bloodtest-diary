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
const http = require('http').Server(app); // require('https) to change to https connection
const io = require('socket.io')(http);

const queryController = require('./lib/query-controller.js');
const CONFIG_FILE_PATH = __dirname + '/config/config.json';
const jsonController = require('./lib/json-parser');
const conf = jsonController.getJSON(CONFIG_FILE_PATH);
const port = conf.port;
const authenticator = require("./lib/authenticator.js");
const email_controller = require('./lib/email/email-controller');
const reportGenerator = require('./lib/report-generator');

http.listen(port);

// to broadcast in room => io.in("room").emit("change", json);


async function getUsername(socket, responseCode, accessToken){
    if (!accessToken) {
        socket.emit(responseCode, { success:false, errorType:"authentication", response: "Authentication required." });
        return null;
    }
    const username = await authenticator.verifyToken(accessToken);
    if (!username) {
        socket.emit(responseCode, { success:false, errorType:"authentication", response: "Invalid credentials." });
        return null;
    }
    return username;
}

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
            socket.emit("joined", room);
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
        logger.info("access token: " + accessToken);
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
        const username = await getUsername(socket, "getAllPatientsResponse", accessToken);
        if (!username){return}

        const response = await queryController.getAllPatients(isAdult);
        socket.emit("getAllPatientsResponse", {success: true, response: response.response});
    });

    socket.on("getFullPatientInfo", async (patientId, accessToken) => {
        const username = await getUsername(socket, "getFullPatientInfoResponse", accessToken);
        if (!username){return}

        const response = await queryController.getFullPatientInfo(patientId);
        socket.emit("getFullPatientInfoResponse", {success: true, response: response.response});
    });


    socket.on('getNextTestsOfPatient', async (patientId, accessToken) => {
        const username = await getUsername(socket, "getNextTestsOfPatientResponse", accessToken);
        if (!username){return}

        const response = await queryController.getNextTestsOfPatient(patientId);
        socket.emit('getNextTestsOfPatientResponse', response);
    });

    /**
    *@param {String} date of type "yyyy-mm-dd"
    *@param {Boolean} anydayTestsOnly - if unscheduled test to return
    **/

    socket.on('getTestsInWeek',async (date, accessToken,isAdult=true) => {
        const username = await getUsername(socket, "getTestsInWeekResponse", accessToken);
        if (!username){return}

        const response = await queryController.getTestWithinWeek(date,isAdult);
        socket.emit('getTestsInWeekResponse', {success: true, response: response.response});
    });

    socket.on('getOverdueTests', async (accessToken,isAdult=true) => {
        const username = await getUsername(socket, "getOverdueTestsResponse", accessToken);
        if (!username){return}

        const response = await queryController.getSortedOverdueWeeks(isAdult);
        socket.emit('getOverdueTestsResponse', {success: true, response: response.response});
    });

    socket.on('getTestInfo', async (testId, accessToken) => {
        const username = await getUsername(socket, "getTestInfoResponse", accessToken);
        if (!username){return}

        const response = await queryController.getTestInfo(testId);
        socket.emit("getTestInfoResponse", response);
    });

    socket.on('getOverdueReminderGroups', async (accessToken,isAdult=true) => {
        const username = await getUsername(socket, "getOverdueReminderGroupsResponse", accessToken);
        if (!username){return}

        const response = await queryController.getOverdueReminderGroups(isAdult);
        socket.emit("getOverdueReminderGroupsResponse", response);
    });

    socket.on('getUser', async (accessToken, user=undefined) => {
        const username = await getUsername(socket, "getUserResponse", accessToken);
        if (!username){return}

        if (user === undefined) {
            // User can retrieve their info.
            const response = await queryController.getUser(username);
            socket.emit("getUserResponse", response);
            return;
        }

        let canRetrieve = false;
        try {
            const admin = (await queryController.getUser(username)).response[0];
            if (admin.isAdmin === "yes") {
                canRetrieve = true;
            }
        }
        catch(err) {
            logger.error(err);
        }
        if (!canRetrieve) {
            socket.emit("getUserResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }
        const response = await queryController.getUser(user);
        if (response.success) {
            delete response.response[0].hashed_password;
            delete response.response[0].salt;
            delete response.response[0].iterations;
        }
        socket.emit("getUserResponse", response);
    });

    socket.on('getAllUsers', async (accessToken) => {
        const username = await getUsername(socket, "getAllUsersResponse", accessToken);
        if (!username){return}

        let canRetrieve = false;
        try {
            const admin = (await queryController.getUser(username)).response[0];
            if (admin.isAdmin === "yes") {
                canRetrieve = true;
            }
        }
        catch(err) {
            logger.error(err);
        }
        if (!canRetrieve) {
            socket.emit("getAllUsersResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }
        const response = await queryController.getAllUsers();
        socket.emit("getAllUsersResponse", response);
    });

    // ==============
    // ADDING
    // ==============

    socket.on("addTest", async (patientId, date, notes, frequency, occurrences, accessToken) => {
        const username = await getUsername(socket, "addTestResponse", accessToken);
        if (!username){return}

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
        const username = await getUsername(socket, "addPatientResponse", accessToken);
        if (!username){return}

        const response = await queryController.addPatientExtended(newPatient, username);
        if (response.success){
            socket.emit("addPatientResponse", {success: true, response: response.response});
            io.in("patients_page").emit("patientEdited", newPatient.patient_no, newPatient);
        }else{
            socket.emit("addPatientResponse", {success: false});
        }
    });

    socket.on("addUser", async (newUser, accessToken) => {
        const username = await getUsername(socket, "addUserResponse", accessToken);
        if (!username){return}
        let canInsert = false;
        try {
            const admin = (await queryController.getUser(username)).response[0];
            if (admin.isAdmin === "yes") {
                canInsert = true;
            }
        }
        catch(err) {
            logger.error(err);
        }
        if (!canInsert) {
            socket.emit("addUserResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.addUser(newUser, username);
        if (response.success){
            socket.emit("addUserResponse", {success: true, response: response.response});
        }else{
            socket.emit("addUserResponse", {success: false});
        }
    });

    // ==============
    // EDIT TOKEN EXCHANGE
    // ==============

    socket.on("requestTestEditToken", async (testId, accessToken) => {
        const username = await getUsername(socket, "requestTestEditTokenResponse", accessToken);
        if (!username){return}

        let response = await queryController.requestEditing("Test", testId, username);
        if (response) {
            response = {success: true, token: response}
        }
        else {
            response = {success: false}
        }
        socket.emit("requestTestEditTokenResponse", response);

    });

    socket.on("requestPatientEditToken", async (patientId, accessToken) => {
        const username = await getUsername(socket, "requestPatientEditTokenResponse", accessToken);
        if (!username){return}

        let response = await queryController.requestEditing("Patient", patientId, username);
        if (response) {
            response = {success: true, token: response}
        }
        else {
            response = {success: false}
        }
        socket.emit("requestPatientEditTokenResponse", response);
    });

    socket.on("requestUserEditToken", async (user, accessToken) => {
        const username = await getUsername(socket, "requestUserEditTokenResponse", accessToken);
        if (!username){return}

        let canRequest = false;
        try {
            const admin = (await queryController.getUser(username)).response[0];
            if (user === username || admin.isAdmin === "yes") {
                canRequest = true;
            }
        }
        catch(err) {
            logger.error(err);
        }
        if (!canRequest) {
            socket.emit("requestUserEditTokenResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        let response = await queryController.requestEditing("User", user, username);
        if (response) {
            response = {success: true, token: response}
        }
        else {
            response = {success: false}
        }
        socket.emit("requestUserEditTokenResponse", response);
    });

    socket.on("discardTestEditing", async (id, token, accessToken) => {
        const username = await getUsername(socket, "discardTestEditingResponse", accessToken);
        if (!username){return}

        const response = await queryController.returnToken("Test", id, token, username);
        socket.emit("discardTestEditingResponse", response);
    });

    socket.on("discardPatientEditing", async (id, token, accessToken) => {
        const username = await getUsername(socket, "discardPatientEditingResponse", accessToken);
        if (!username){return}

        const response = await queryController.returnToken("Patient", id, token, username);
        socket.emit("discardPatientEditingResponse", response);
    });

    socket.on("discardUserEditing", async (id, token, accessToken) => {
        const username = await getUsername(socket, "discardUserEditingResponse", accessToken);
        if (!username){return}

        const response = await queryController.returnToken("User", id, token, username);
        socket.emit("discardUserEditingResponse", response);
    });

    // ==============
    // DELETING
    // ==============

    socket.on("deletePatient", async (patientId, token, accessToken) => {
        const username = await getUsername(socket, "deletePatientResponse", accessToken);
        if (!username){return}

        const response = await queryController.deletePatient(patientId, token, username);
        logger.debug(response)
        if (response.success){
            socket.emit("deletePatientResponse", {success: true});
            io.in("patients_page").emit("patientEdited");
            io.in("main_page").emit("testAdded");
        }else{
            socket.emit("deletePatientResponse", {success: false});
        }
    });

    socket.on("unscheduleTest", async (testId, token, accessToken) => {
        const username = await getUsername(socket, "unscheduleTestResponse", accessToken);
        if (!username){return}

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
        const username = await getUsername(socket, "testStatusChangeResponse", accessToken);
        if (!username){return}

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
        logger.debug("New info: ", newInfo);
        const username = await getUsername(socket, "editTestResponse", accessToken);
        if (!username){return}

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
        const username = await getUsername(socket, "changeTestDueDateResponse", accessToken);
        if (!username){return}

        const response = await queryController.changeTestDueDate(testId, newDate, username);
        if (response.success){
            socket.emit("changeTestDueDateResponse", {success: true});
            io.in("main_page").emit("testAdded");
        }else{
            socket.emit("changeTestDueDateResponse", {success: false});
        }
    });

    socket.on("editPatient", async (patientId, newInfo, token, accessToken) => {
        const username = await getUsername(socket, "editPatientResponse", accessToken);
        if (!username){return}

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
        const username = await getUsername(socket, "changeTestColourResponse", accessToken);
        if (!username){return}

        const response = await queryController.changeTestColour(testId, newColour, username);
        if (response.success){
            socket.emit("changeTestColourResponse", {success: true});
            io.in("main_page").emit("testAdded");
        }else{
            socket.emit("changeTestColourResponse", {success: false});
        }
    });

    socket.on("changePatientColour", async (patientNo, newColour, accessToken) => {
        const username = await getUsername(socket, "changePatientColourResponse", accessToken);
        if (!username){return}

        const response = await queryController.changePatientColour(patientNo, newColour, username);
        logger.info(response)
        if (response.success){
            socket.emit("changePatientColourResponse", {success: true});
            io.in("main_page").emit("testAdded");
        }else{
            socket.emit("changePatientColourResponse", {success: false});
        }
    });

    socket.on("editUser", async (newData, token, accessToken) => {
        const username = await getUsername(socket, "editUserResponse", accessToken);
        if (!username){return}
        let canEdit = false;
        try {
            const admin = (await queryController.getUser(username)).response[0];
            if (newData.username === username || admin.isAdmin === "yes") {
                canEdit = true;
            }
        }
        catch(err) {
            logger.error(err);
        }
        if (!canEdit) {
            socket.emit("editUserResponse", { success:false, errorType:"authentication", response: "Invalid credentials." });
            return;
        }

        const response = await queryController.editUser(newData, token, username);
        logger.info(response);
        if (response.success){
            socket.emit("editUserResponse", {success: true, response: response.response});
        }else{
            socket.emit("editUserResponse", {success: false});
        }
    });

    // ==============
    // OTHER
    // ==============

    //PARAMETER - (STRING) USERNAME TO CHANGE PASSWORD
    socket.on('passwordRecoverRequest', async (username) => {
        const passwordResponse = await email_controller.recoverPassword(username);
        socket.emit('passwordRecoverResponse', passwordResponse);
    });

    socket.on('sendOverdueReminders', async (testID, accessToken) => {
        const username = await getUsername(socket, "sendOverdueRemindersResponse", accessToken);
        if (!username){return}

        if (!Array.isArray(testID)) {
            testID = [testID];
        }
        const response = await email_controller.sendOverdueReminders(testID, username);
        socket.emit("sendOverdueRemindersResponse", response);
    });

    socket.on('sendNormalReminders', async (testID, accessToken) => {
        const username = await getUsername(socket, "sendNormalRemindersResponse", accessToken);
        if (!username){return}

        if (!Array.isArray(testID)) {
            testID = [testID];
        }
        const response = await email_controller.sendNormalReminders(testID, username);
        socket.emit("sendNormalRemindersResponse", response);
    });
    
    /**
     * @param {string} month - Full name of the month in english, or null if generating report for the whole year.
     * @param {string} year - Year we are fetching from.
     */
    socket.on('generateMonthlyReport', async (month, accessToken) => {
        const username = await getUsername(socket, "generateMonthlyReportResponse", accessToken);
        if (!username){return}
        
        const res = await reportGenerator.getMonthlyReport(month, username);
        socket.emit("generateMonthlyReportResponse", res);
    });

});
