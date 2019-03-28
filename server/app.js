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

    /**
     * Logout end point
     * Logs out a user
     * @param {String} accessToken The token given at the moment of authentication
     */
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

    /**
     * Emits a response with all the patients in the database
     * @param {String} accessToken The authentication token
     * @param {Boolean} isAdult If true only patients over 12 will be included
     */
    socket.on('getAllPatients', async (accessToken,isAdult=true) => {
        const username = await getUsername(socket, "getAllPatientsResponse", accessToken);
        if (!username){return}

        const response = await queryController.getAllPatients(isAdult);
        socket.emit("getAllPatientsResponse", {success: true, response: response.response});
    });

    /**
     * Emits a response with all  the information regarding a patient
     * @param {String} patientId The id of the patient
     * @param {String} accessToken The authentication token
     */
    socket.on("getFullPatientInfo", async (patientId, accessToken) => {
        const username = await getUsername(socket, "getFullPatientInfoResponse", accessToken);
        if (!username){return}

        const response = await queryController.getFullPatientInfo(patientId);
        socket.emit("getFullPatientInfoResponse", {success: true, response: response.response});
    });

    /**
     * Emits a response with all the next non completed tests of a patient
     * @param {String} patientId The id of the patient
     * @param {String} accessToken The authentication token
     */
    socket.on('getNextTestsOfPatient', async (patientId, accessToken) => {
        const username = await getUsername(socket, "getNextTestsOfPatientResponse", accessToken);
        if (!username){return}

        const response = await queryController.getNextTestsOfPatient(patientId);
        socket.emit('getNextTestsOfPatientResponse', response);
    });

    /**
     * Emits a response with all tests in the dashboard given a particular date
     * This does not include data for the outstanding column
     * @param {String} date of type "yyyy-mm-dd"
     * @param {String} accessToken The authentication token
     * @param {Boolean} isAdult If true only tests of patients over 12 are included
    **/
    socket.on('getTestsInWeek',async (date, accessToken,isAdult=true) => {
        const username = await getUsername(socket, "getTestsInWeekResponse", accessToken);
        if (!username){return}

        const response = await queryController.getTestWithinWeek(date,isAdult);
        socket.emit('getTestsInWeekResponse', {success: true, response: response.response});
    });

    /**
     * Emits a response with the data for the overdue column
     * @param {String} accessToken The authentication token
     * @param {Boolean} isAdult If true only tests of patients over 12 are included
     */
    socket.on('getOverdueTests', async (accessToken,isAdult=true) => {
        const username = await getUsername(socket, "getOverdueTestsResponse", accessToken);
        if (!username){return}

        const response = await queryController.getSortedOverdueWeeks(isAdult);
        socket.emit('getOverdueTestsResponse', {success: true, response: response.response});
    });

    /**
     * Emits a response with all the info of a test
     * @param {int} testId the id of the test
     * @param {String} accessToken The authentication token 
     */
    socket.on('getTestInfo', async (testId, accessToken) => {
        const username = await getUsername(socket, "getTestInfoResponse", accessToken);
        if (!username){return}

        const response = await queryController.getTestInfo(testId);
        socket.emit("getTestInfoResponse", response);
    });

    /**
     * Emits a response with the groups for the overdue column in dashboard. 
     * @param {String} accessToken The authentication token
     * @param {Boolean} isAdult If true only tests of patients over 12 are included
     */
    socket.on('getOverdueReminderGroups', async (accessToken,isAdult=true) => {
        const username = await getUsername(socket, "getOverdueReminderGroupsResponse", accessToken);
        if (!username){return}

        const response = await queryController.getOverdueReminderGroups(isAdult);
        socket.emit("getOverdueReminderGroupsResponse", response);
    });

    /**
     * Emits a response with the information about a user
     * @param {String} accessToken The authentication token
     * @param {String} user The username of the user
     */
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

    /**
     * Emits a response with all the users in the database. Only available to admins
     * @param {String} accessToken The authentication token
     */
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

    /**
     * End point to add a test to the database
     * @param {String} patientId The id of the patient
     * @param {String} date The due date yyyy-mm-dd
     * @param {String} notes Additional notes
     * @param {String} frequency The frequency encoding
     * @param {int} occurrences The number of tests yet to schedule
     * @param {String} accessToken The authentication token
     */
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

    /**
     * End point to add a new patient to the database
     * @param {JSON} newPatient The new patient info
     * @param {String} accessToken The authentication token
     */
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

    /**
     * End point to add a new user to the database
     * @param {JSON} newUser The info of the new user
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Requests a token to edit a test
     * @param {int} testId The id of the test to be edited
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Requests a token to edit a patient
     * @param {String} patientId The id of the patient to be edited
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Requests a token to edit an user
     * @param user The username of the user to be edited
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Destroyes a Test edit token
     * @param {int} id The id of the test the token was requested for
     * @param {String} token The token to be destroyed
     * @param {String} accessToken The authentication token
     */
    socket.on("discardTestEditing", async (id, token, accessToken) => {
        const username = await getUsername(socket, "discardTestEditingResponse", accessToken);
        if (!username){return}

        const response = await queryController.returnToken("Test", id, token, username);
        socket.emit("discardTestEditingResponse", response);
    });

    /**
     * Destroyes a Patient edit token
     * @param {String} id The id of the patient the token was requested for
     * @param {String} token The token to be destroyed
     * @param {String} accessToken The authentication token
     */
    socket.on("discardPatientEditing", async (id, token, accessToken) => {
        const username = await getUsername(socket, "discardPatientEditingResponse", accessToken);
        if (!username){return}

        const response = await queryController.returnToken("Patient", id, token, username);
        socket.emit("discardPatientEditingResponse", response);
    });

    /**
     * Destroyes a User edit token
     * @param {String} id The username of the user the token was requested for
     * @param {String} token The token to destroy
     * @param {String} accessToken The authentication token
     */
    socket.on("discardUserEditing", async (id, token, accessToken) => {
        const username = await getUsername(socket, "discardUserEditingResponse", accessToken);
        if (!username){return}

        const response = await queryController.returnToken("User", id, token, username);
        socket.emit("discardUserEditingResponse", response);
    });

    // ==============
    // DELETING
    // ==============
    /**
     * Deletes a patient and all related info from the database
     * @param {String} patientId The id of the patient to be deleted
     * @param {String} token An edit token for that patient
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Deletes a test from the database
     * @param {int} testId The id of the test to be deleted
     * @param {String} token An edit token for that test
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Changes the completed_status of a test
     * @param {int} testId The id of the test to modify
     * @param {String} newStatus The new status of the test
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Edits a test with the new information
     * @param {int} testId The id of the test to be modified
     * @param {JSON} newInfo The new (possibly partial) information
     * @param {String} token An edit token for that test
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Changes a test's due_date
     * @param {int} testId The id of the test to modify
     * @param {String} newDate The new due date yyyy-mm-dd
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Edits a patient with the new info
     * @param {String} patientId The id of the patient to modify
     * @param {Json} newInfo The new (possibly patial) info of the patient
     * @param {String} token An edit token for that patient
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Changes the colour of a test
     * @param {int} testId The id of the test to modify
     * @param {String} newColour The new colour in hex code
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Changes the colour of a patient
     * @param {String} patientNo The id of the patient to modify
     * @param {String} newColour The new colour in hex code
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Edits a user with the new info
     * @param {JSON} newData The new (possibly partial) info of the user
     * @param {String} token An edit token for that user
     * @param {String} accessToken The authentication token
     */
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

    /**
     * Password recovery end point
     * @param {String} username The username of that guy who forgot the password
     */
    socket.on('passwordRecoverRequest', async (username) => {
        const passwordResponse = await email_controller.recoverPassword(username);
        socket.emit('passwordRecoverResponse', passwordResponse);
    });

    /**
     * Sends overdue reminders to the patients of the sent tests
     * @param {List<int>} testId The LIST of the ids of the tests whose patients must be contacted
     * @param {String} accessToken The authentication token
     */
    socket.on('sendOverdueReminders', async (testID, accessToken) => {
        const username = await getUsername(socket, "sendOverdueRemindersResponse", accessToken);
        if (!username){return}

        if (!Array.isArray(testID)) {
            testID = [testID];
        }
        const response = await email_controller.sendOverdueReminders(testID, username);
        socket.emit("sendOverdueRemindersResponse", response);
    });

    /**
     * Sends reminders to the patients of the sent tests
     * @param {List<int>} testId The LIST of the ids of the tests whose patients must be contacted
     * @param {String} accessToken The authentication token
     */
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
     * @param {String} accessToken The authentication token
     */
    socket.on('generateReport', async (month, year, accessToken) => {
        const username = await getUsername(socket, "generateReportResponse", accessToken);
        if (!username){return}
        
        const res = await reportGenerator.getReport(month, year, username);
        socket.emit("generateReportResponse", res);
    });

});
