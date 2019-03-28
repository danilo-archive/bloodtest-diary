
/**
 * This file establishes a socket connection with the server and provides every single
 * protocol need by every component of the UI
 * The socket connection can be created by using the only method available to the public (getServerConnect())
 * which will return a ServerConnect object. That object represent a socket connection and will be
 * unique and shared between all client components.
 * Every protocol will be available through this object.
 * @module serverConnection
 * @author Danilo Del Busso, Mateusz Nowak, Jacopo Madaluni
 * @version 0.0.2
 */

import openSocket from 'socket.io-client';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const host = decodeURIComponent(cookies.get("ip"));
const port = cookies.get("port");

const underTwelve = 0;
const overTwelve = 1;

class ServerConnect {

    constructor(){
        this.loginToken = cookies.get("accessToken");
        this.currentRoom = "";
        this.socket = openSocket(`${host}:${port}`);
        this.currentMode = overTwelve;


        /**
        *   Triggered when a connection is established.
        */
        this.onConnected = undefined;
        this.socket.on("connected", () => {
            this.socket.emit("join", "", this.currentRoom, true);
            this.onConnected();
        });

        /**
        *   Triggered when the connection is lost.
        */
        this.onDisconnect = undefined;
        this.socket.on("disconnect", () => {
            this.onDisconnect();
        });

        /**
         * Triggered when a room is successfully joined
         */
        this.onRoomJoin = undefined;
        this.socket.on("joined", room => {
            this.onRoomJoin(room);
        });

        /**
        *   Triggered when a new test is added.
        */
        this.onTestAdded = undefined;
        this.socket.on("testAdded", newTest => {
            this.onTestAdded(newTest);
        });

        /**
        *   Triggered when a patient is edited.
        */
        this.onPatientEdit = undefined;
        this.socket.on("patientEdited", (patientId, newInfo) => {
            this.onPatientEdit(patientId, newInfo);
        });

    }

    /**
     * @returns {Boolean} True if the current user is admin
     */
    isAdmin(){
        return this.currentUser.isAdmin === "yes";
    }

    /**
     * Sets the current mode to be "under twelve"
     * This mode will only fetch data relative to patients that are considered "under twelve"
     */
    setUnderTwelve(){
        this.currentMode = underTwelve;
    }

    /**
     * Sets the current mode to be "over twelve"
     * This mode will only fetch data relative to patients that are considered "over twelve"
     */
    setOverTwelve(){
        this.currentMode = overTwelve;
    }
    /**
     * @returns {Boolean} True if the current mode is set to "under twelve"
     */
    isUnderTwelve(){
        return this.currentMode == underTwelve;
    }

    /**
    *   Protocol to delete the current authentication token.
    */
    deleteLoginToken(){
        this.loginToken = undefined;
        cookies.set('accessToken', "", { path: '/' });
    }

    /**
     * Initializes the logged session
     * @param {String} token Authentication token 
     * @param {Function} callback 
     */
    initSession(token, callback){
        this.setLoginToken(token);
        callback();
    }
    /**
    * Set the current authentication token.
    * @param {String} token the new token
    */
    setLoginToken(token){
        this.loginToken = token;
        cookies.set('accessToken', token, { path: '/' });
    }


    /**
    * Joins the main page room in the server.
    */
    joinMainPage(){
        this.socket.emit("join", this.currentRoom, "main_page");
        this.currentRoom = "main_page";
    }

    /**
    * Joins the login page room in the server.
    */
    joinLoginPage(){
        this.socket.emit("join", this.currentRoom, "login_page");
        this.currentRoom = "login_page";
    }
    /**
    * Joins the patients page room in the server.
    */
    joinPatientsPage(){
        this.socket.emit("join", this.currentRoom, "patients_page");
        this.currentRoom = "patients_page";

    }

    /**
     * Sets the callback to be called every time a room is successfully joined
     * @param {Function} callback 
     */
    setOnRoomJoin(callback){
        this.onRoomJoin = callback;
    }

    /**
    * Sets the callback to be called when socket.on("connected") is triggered.
    * @param {function} callback
    */
    setOnConnect(callback){
        this.onConnected = callback;
    }
    /**
    * Sets the callback to be called when socket.on("disconnect") is triggered.
    * @param {function} callback
    */
    setOnDisconnect(callback){
        this.onDisconnect = callback;
    }

    /**
    * Sets the callback to be called when a new test is added
    * (when socket.on("testAdded")) is triggered
    * @param {function} callback
    */
    setOnTestAdded(callback){
        this.onTestAdded = callback;
    }

    /**
    * Sets the callback to be called when a patient is edited
    * (when socket.on("patientEdited") is triggered)
    * @param {function} callback
    */
    setOnPatientEdited(callback){
        this.onPatientEdit = callback;
    }

    /**
     * Function to be called when user needs to be authenticated
     * @param {JSON} credentials
     * @param {function} callback The callback function to be called on response
     * @example login({username: "exampleUsername", password: "examplePassword"})
     */
    login(credentials, callback){
        this.socket.emit('authenticate', credentials);
        this.socket.once('authenticationResponse', res => {
            callback(res);
        });
    }

    /**
     * Function to be called before logout.
     * Asks the server to get rid of the authentication token stored in the db
     * @param callback The callback function to be called on response
     */
    logout(callback){
        this.socket.emit("logout", this.loginToken);
        this.socket.once("logoutResponse", res => {
            if (res.success){
                this.deleteLoginToken();
            }
            callback(res);
        });
    }

    /**
     * Requests the information regarding the logged user
     * @param {Function} callback 
     */
    getCurrentUser(callback){
        this.socket.emit("getUser", this.loginToken);
        this.socket.once("getUserResponse", res => {
            callback(res);
        });
    }

    /**
     * Requests the information regarding all users in the system. 
     * A positive response will be sent back if the logged user has admin priviledges
     * @param {Function} callback 
     */
    getAllUsers(callback){
        this.socket.emit("getAllUsers", this.loginToken);
        this.socket.once("getAllUsersResponse", res => {
            callback(res);
        });
    }


    /**
     * Function to be called when all patients have to be retrieved.
     * @param {function} callback The callback function to be called on response
     */
    getAllPatients(callback){
        let isAdult = this.currentMode == overTwelve;
        this.socket.emit('getAllPatients', this.loginToken, isAdult);
        this.socket.once("getAllPatientsResponse", res => {
            callback(res);
        });
    }
    /**
     * Retrieves all information regarding a patient, calls the callback with the response.
     * @param {String} patientId The id of the patient
     * @param {function} callback
     */
    getFullPatientInfo(patientId, callback){
        this.socket.emit("getFullPatientInfo", patientId, this.loginToken);
        this.socket.once("getFullPatientInfoResponse", res => {
            callback(res);
        });
    }

    /**
     * Retrieves all the tests of a particular patient, calls the callback with the response
     * @param {String} patientId The id of the patient we want to retrieve the information of.
     * @param {function} callback
     */
    getNextTestsOfPatient(patientId, callback){
        this.socket.emit('getNextTestsOfPatient', patientId, this.loginToken);
        this.socket.once('getNextTestsOfPatientResponse', res => {
            callback(res);
        });
    }


    /**
     * Retrieves all overdue tests, calls the callback with the response.
     * @param {function} callback
     */
    getOverdueTests(callback){
        let isAdult = this.currentMode == overTwelve;
        this.socket.emit('getOverdueTests', this.loginToken, isAdult);
        this.socket.once('getOverdueTestsResponse', res => {
            callback(res);
        });
    }

    /**
     * Retrieves all tests in a week, calls the callback with the response.
     * @param {Date} date Any date on the week we want to select
     * @param {boolean} anydayTestsOnly True if you only want the tests that are not scheduled on a particular day.
     * @param {function} callback
     */
    getTestsInWeek(date, callback){
        let isAdult = this.currentMode == overTwelve;
        this.socket.emit('getTestsInWeek', date, this.loginToken, isAdult);
        this.socket.once('getTestsInWeekResponse', res => {
            callback(res);
        });
    }

    /**
     * Retrieves the information regarding a test, calls the callback with the response.
     * @param {int} testId The id of the test
     * @param {function} callback
     */
    getTestInfo(testId, callback){
        this.socket.emit("getTestInfo", testId, this.loginToken);
        this.socket.once("getTestInfoResponse", res => {
            callback(res.response[0]);
        });
    }
    /**
     * Requests a token to edit the chosen test, calls the callback with the response.
     * @param {int} testId The id of the test
     * @param {function} callback
     */
    requestTestEditing(testId, callback){
        this.socket.emit("requestTestEditToken", testId, this.loginToken);
        this.socket.once("requestTestEditTokenResponse", res => {
            callback(res);
        });
    }
    /**
     * Requests a token to edit the chosen patient, calls the callback with the response.
     * @param {String} patientId The id of the patient
     * @param {function} callback
     */
    requestPatientEditing(patientId, callback){
        this.socket.emit("requestPatientEditToken", patientId, this.loginToken);
        this.socket.once("requestPatientEditTokenResponse", res => {
            callback(res);
        });
    }
    
    /**
     * Requests a token to edit the chosen user.
     * @param {String} username The username of the user 
     * @param {Function} callback 
     */
    requestUserEditing(username, callback){
        this.socket.emit("requestUserEditToken", username, this.loginToken);
        this.socket.once("requestUserEditTokenResponse", res => {
            callback(res);
        });
    }


    /**
     * Requests the distruction of the token previously received to edit a test, calls the callback with the response.
     * @param {int} testId The id of the test
     * @param {String} token The token to destroy.
     * @param {function} callback
     */
    discardTestEditing(testId, token, callback){
        this.socket.emit("discardTestEditing", testId, token, this.loginToken);
        this.socket.once("discardTestEditingResponse", res => {
            callback(res);
        });
    }
    /**
     * Requests the destruction of the token previously received to edit a patient, calls the callback with the response.
     * @param {int} patientId The id of the patient
     * @param {String} token The token to destroy.
     * @param {function} callback
     */
    discardPatientEditing(patientId, token, callback){
        this.socket.emit("discardPatientEditing", patientId, token, this.loginToken);
        this.socket.once("discardPatientEditingResponse", res => {
            callback(res);
        });
    }

    /**
     * Requests the destruction of the token previously received to edit a user.
     * @param {String} username The username of the user 
     * @param {String} token The token to destroy
     * @param {Function} callback 
     */
    discardUserEditing(username, token, callback){
        this.socket.emit("discardUserEditing", username, token, this.loginToken);
        this.socket.once("discardUserEditingResponse", res => {
            callback(res);
        })
    }

    /**
     * Requests to add a new user to the database
     * @param {JSON} newUser The information of the user to be added 
     * @param {Function} callback 
     */
    addUser(newUser, callback){
        this.socket.emit("addUser", newUser, this.loginToken);
        this.socket.once("addUserResponse", res => {
            callback(res);
        });
    }

    /**
     * Requests to add a new patient to the database
     * @param {JSON} newPatient The information of the new patient to be added 
     * @param {Function} callback 
     */
    addPatient(newPatient, callback){
        this.socket.emit("addPatient", newPatient, this.loginToken);
        this.socket.once("addPatientResponse", res => {
            callback(res);
        });
    }

    /**
     * Requests to delete a patient from the database 
     * @param {String} patientId The id of the patient to delete 
     * @param {String} token The edit token for that patient
     * @param {Function} callback 
     */
    deletePatient(patientId, token, callback){
        this.socket.emit("deletePatient", patientId, token, this.loginToken);
        this.socket.once("deletePatientResponse", res => {
            callback(res);
        });
    }

    /**
    * This method emits a request to add a test into the database, calls the callback with the response
    * @param {String} patientId The number of the patient that has to take the test.
    * @param {Date} date The first due date of the test
    * @param {String} notes Additional info about the test
    * @param {String} frequency The frequency of the test
    * @example var frequencyExample = "3:W"; // Read db manual for more info
    * @param {int} occurrences The number of times to repeat the test
    * @param {function} callback
    */
    addTest(patientId, date, notes, frequency, occurrences, callback){
        this.socket.emit("addTest", patientId, date, notes, frequency, occurrences, this.loginToken);
        this.socket.once("addTestResponse", res => {
            callback(res);
        });
    }

    /**
    * This method emits a request to add a test into the database, calls the callback with the response
    * @param {int} testId The id of the test to be changed.
    * @param {String} newStatus The new status of the test
    * @example var statusExample = "completed" // Read db manual for more info
    * @param {function} callback
    */
    changeTestStatus(testId, newStatus, callback){
        this.socket.emit('testStatusChange', testId, newStatus, this.loginToken);
        this.socket.once("testStatusChangeResponse", res => {
            callback(res);
        });
    }
    /**
    * This method emits a request to change a test due date, calls the callback with the response
    * @param {int} testId The id of the test to be changed.
    * @param {Date} newDate The new status of the test
    * @param {function} callback
    */
    changeTestDueDate(testId, newDate, callback){
        this.socket.emit("changeTestDueDate", testId, newDate, this.loginToken);
        this.socket.once("changeTestDueDateResponse", res => {
            callback(res);
        });
    }

    /**
    * This method emits a request to edit a test into the database, calls the callback with the response.
    * @param {int} testId The id of the test to be changed.
    * @param {JSON} newData All the information about the test
    * @param {String} token The token that grants editing priviledges.
    * @param {function} callback
    */
    editTest(testId, newData, token, callback){
        this.socket.emit("editTest", testId, newData, token, this.loginToken);
        this.socket.once("editTestResponse", response => {
            callback(response);
        });
    }
    /**
    * This method emits a request to edit a patient into the database, calls the callback with the response.
    * @param {String} patientId The id of the patient to be changed.
    * @param {JSON} newData All the information about the patient
    * @param {String} token The token that grants editing priviledges.
    * @param {function} callback
    */
    editPatient(patientId, newData, token, callback){
        this.socket.emit("editPatient", patientId, newData, token, this.loginToken);
        this.socket.once("editPatientResponse", res => {
            callback(res);
        });
    }

    /**
     * This method emits a request to edit a user.
     * @param {JSON} newData The new info of the user 
     * @param {String} token The edit token for that user
     * @param {Function} callback 
     */
    editUser(newData, token, callback){
        this.socket.emit("editUser", newData, token, this.loginToken);
        this.socket.once("editUserResponse", res => {
            callback(res);
        });
    }

    /**
     * Requests to delete a test from the database
     * @param {int} testId The id of the test to be deleted
     * @param {String} token The edit token for that test
     * @param {Function} callback 
     */
    unscheduleTest(testId, token, callback){
        this.socket.emit("unscheduleTest", testId, token, this.loginToken);
        this.socket.once("unscheduleTestResponse", res => {
            callback(res);
        });
    }

    /**
     * Requests the groups of overdue tests for the email modal
     * @param {Function} callback 
     */
    getOverdueReminderGroups(callback){
        let isAdult = this.currentMode == overTwelve;
        this.socket.emit("getOverdueReminderGroups", this.loginToken, isAdult);
        this.socket.once("getOverdueReminderGroupsResponse", res => {
            callback(res);
        });
    }

    /**
     * Requests to send the overdue reminders for the relative tests
     * @param {List<int>} testIds The list of tests whose patients must be contacted
     * @param {Function} callback 
     */
    sendOverdueReminders(testIds, callback){
        this.socket.emit("sendOverdueReminders", testIds, this.loginToken);
        this.socket.once("sendOverdueRemindersResponse", res => {
            callback(res);
        });
    }
    /**
     * Requests to send reminders for the relative tests
     * @param {List<int>} testId The list of tests whose patients must be contacted
     * @param {Function} callback 
     */
    sendNormalReminders(testId, callback){
        this.socket.emit("sendNormalReminders", testId, this.loginToken);
        this.socket.once("sendNormalRemindersResponse", res => {
            callback(res);
        });
    }

    /**
     * Requests to change the colour of a patient
     * @param {String} patientId The id of the patient 
     * @param {String} newColor The hex code of the new colour (#ff2312)
     * @param {Function} callback 
     */
    changePatientColour(patientId, newColor, callback){
        this.socket.emit("changePatientColour", patientId, newColor, this.loginToken);
        this.socket.once("changePatientColourResponse", res => {
            callback(res);
        });
    }

    /**
     * Requests to change the colour of a test
     * @param {int} testId The id of the test 
     * @param {String} newColor The hex code of the new colour (#ff2312)
     * @param {Function} callback 
     */
    changeTestColour(testId, newColor, callback){
        this.socket.emit("changeTestColour", testId, newColor, this.loginToken);
        this.socket.once("changeTestColourResponse", res => {
            callback(res);
        });
    }

    /**
     * Activates the recover password protocol in the server
     * @param {String} username The username of the user who doesn't remember his/her password (facepalm) 
     * @param {Function} callback 
     */
    recoverPassword(username, callback){
        this.socket.emit("passwordRecoverRequest", username);
        this.socket.once("passwordRecoverResponse", res => {
            callback(res);
        });
    }

       /**
     * @param {string} month - Full name of the month in english, or null if generating report for the whole year.
     * @param {string} year - Year we are fetching from.
     */
    generateReport(month, year, callback) {
        this.socket.emit("generateReport", month, year, this.loginToken);
        this.socket.once("generateReportResponse", res => {
            callback(res);
        });
    }

}


let serverConnect = new ServerConnect();
/**
* Function to get the unique instance of the server connection
* @returns {ServerConnect}
*/
function getServerConnect(){
    if (typeof serverConnect === undefined){
        serverConnect = new ServerConnect();
    }
    return serverConnect;
}
export {getServerConnect};
