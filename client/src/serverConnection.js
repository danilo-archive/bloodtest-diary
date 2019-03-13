
/**
 * The logic that works as back-end for the app's UI.
 * It communicates with an external server, queries and sends update requests.
 * @module serverConnection
 * @author Danilo Del Busso, Mateusz Nowak, Jacopo Madaluni
 * @version 0.0.2
 */

import openSocket from 'socket.io-client';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const host = "http://localhost";
const port = 3265;

class ServerConnect {

    constructor(){
        this.loginToken = cookies.get("accessToken");
        this.currentRoom = "";
        this.socket = openSocket(`${host}:${port}`);

        this.onConnected = undefined;
        this.socket.on("connected", () => {
            console.log("connected successfully");
            this.socket.emit("join", "", this.currentRoom, true);
            this.onConnected();
        });

        this.onDisconnect = undefined;

        this.socket.on("disconnect", () => {
            this.onDisconnect();
        });

        this.socket.on("disconnect", () => {
            console.log("Server lost...");
            console.log("Trying reconnecting");
        });

        this.onTestAdded = undefined;
        this.onTestStatusChange = undefined;
        this.onTestEdit = undefined;
        this.onPatientEdit = undefined;

        this.socket.on("testAdded", newTest => {
            this.onTestAdded(newTest);
        });

        this.socket.on("testStatusChange", (id, status) => {
            this.onTestStatusChange(id, status);
        });

        // TODO get ad hoc record and change it
        this.socket.on("patientEdited", (patientId, newInfo) => {
            this.onPatientEdit(patientId, newInfo);
        });
    }

    deleteLoginToken(){
        this.loginToken = undefined;
        cookies.set('accessToken', "", { path: '/' });
    }

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

    setOnConnect(callback){
        this.onConnected = callback;
    }

    setOnDisconnect(callback){
        this.onDisconnect = callback;
    }

    joinPatientsPage(){
        this.socket.emit("join", this.currentRoom, "patients_page");
        this.currentRoom = "patients_page";

    }

    /**
    * Sets the callback to call when a new test is added.
    * @callback callback "On test added" callback
    */
    setOnTestAdded(callback){
        this.onTestAdded = callback;
    }

    /**
    * Sets the callback to call when a test status is changed
    * @callback callback "On test status change" callback
    */
    setOnTestStatusChange(callback){
        console.log("set");
        this.onTestStatusChange = callback;
    }

    setOnTestEdit(callback){
        this.onTestEdit = callback;
    }

    setOnPatientEdited(callback){
        this.onPatientEdit = callback;
    }

    /**
     * Function to be called when user needs to be authenticated
     * @param {username: username, password: password} credentials
     * @param callback The callback function to be called on response
     * TODO eventually change name of the callback.
     */
    login(credentials, callback){
        console.log("trying to log in");
        this.socket.emit('authenticate', credentials);
        this.socket.once('authenticationResponse', res => {
            callback(res);
        });
    }


    /**
     * Function to be called when all patients have to be retrieved.
     * @param callback The callback function to be called on response
     * TODO eventually change name of the function.
     * TODO eventually change name of the callback.
     */
    getAllPatients(callback){
        this.socket.emit('getAllPatients', this.loginToken);
        this.socket.once("getAllPatientsResponse", res => {
            callback(res);
        });
    }

    getFullPatientInfo(patientId, callback){
        this.socket.emit("getFullPatientInfo", patientId, this.loginToken);
        this.socket.once("getFullPatientInfoResponse", res => {
            callback(res);
        });
    }

    /**
     * Function to be called when all tests have to be retrieved.
     * @param callback The callback function to be called on response
     * TODO eventually change name of the function.
     * TODO eventually change name of the callback.
     */
    getAllTests(callback){
        this.socket.emit('getAllTests', this.loginToken);
        this.socket.once('getAllTestsResponse', res => {
            callback(res);
        });
    }

    /**
     * Function to be called when all tests of a patient are needed.
     * @param patientId The id of the patient we want to retrieve the information of.
     * @param callback The callback function to be called on response
     * TODO eventually change name of the function.
     * TODO eventually change name of the callback.
     */
    getNextTestsOfPatient(patientId, callback){
        this.socket.emit('getNextTestsOfPatient', patientId, this.loginToken);
        this.socket.once('getNextTestsOfPatientResponse', res => {
            callback(res.info);
        });
    }

    /**
     * Function to be called when all tests on a date are needed.
     * @param date The id of the patient we want to retrieve the information of.
     * @param callback The callback function to be called on response
     * TODO eventually change name of the function.
     * TODO eventually change name of the callback.
     */
    getTestsOnDate(date, callback){
        this.socket.emit('getAllTestsOnDate', date, this.loginToken);
        this.socket.once('getAllTestsOnDateResponse', res => {
            callback(res);
        });
    }

    /**
     * Function to be called when all overdue tests are needed.
     * @param callback The callback function to be called on response
     * TODO eventually change name of the function.
     * TODO eventually change name of the callback.
     */
    getOverdueTests(callback){
        this.socket.emit('getOverdueTests', this.loginToken);
        this.socket.once('getOverdueTestsResponse', res => {
            callback(res);
        });
    }

    /**
     * Function to be called when all tests in a week are needed.
     * @param date Any date on the week we want to select
     * @param anydayTestsOnly True if you only want the tests that are not scheduled on a particular day.
     * @param callback The callback function to be called on response
     * TODO eventually change name of the function.
     * TODO eventually change name of the callback.
     */
    getTestsInWeek(date, callback, anydayTestsOnly=false){
        console.log("asking for tests");
        console.log(this.loginToken);
        this.socket.emit('getTestsInWeek', date, this.loginToken);
        this.socket.once('getTestsInWeekResponse', res => {
            callback(res.response);
        });
    }

    // TODO: what is this???
    getMockTest(testId, callback){
        const duedate = new Date(2019, 3, 4);
        const mockedTest = {
            patient_name: "John Doe",
            patient_no: "P123890",
            test_id: 123,
            due_date: "2019-3-3",
            frequency: "2-W",
            occurrences: 3,
            completed_status: "no",
            notes: "This guys is basically just an idiot",
            completedDate: null,
            hospitalId: 3

        }
        setTimeout( () => {
            callback(mockedTest);
        }, 3000);
    }

    getTestInfo(testId, callback){
        this.socket.emit("getTestInfo", testId, this.loginToken);
        this.socket.once("getTestInfoResponse", res => {
            callback(res.response[0]);
        });
    }

    requestTestEditing(testId, callback){
        this.socket.emit("requestTestEditToken", testId, this.loginToken);
        this.socket.once("requestTestEditTokenResponse", token => {
            callback(token);
        });
    }

    requestPatientEditing(patientId, callback){
        this.socket.emit("requestPatientEditToken", patientId, this.loginToken);
        this.socket.once("requestPatientEditTokenResponse", token => {
            callback(token);
        });
    }

    discardTestEditing(id, token, callback){
        this.socket.emit("discardEditing", "Test", id, token, this.loginToken);
        this.socket.once("discardEditingResponse", res => {
            callback(res);
        });
    }
    discardPatientEditing(id, token, callback){
        this.socket.emit("discardEditing", "Patient", id, token, this.loginToken);
        this.socket.once("discardEditingResponse", res => {
            callback(res);
        });
    }

    /**
    * Thim method emits a request to add a test into the database
    * @param patientId The number of the patient that has to take the test.
    * @param date The first due date of the test
    * @param notes Additional info about the test
    * @param frequency The frequency of the test
    */
    addTest(patientId, date, notes, frequency, occurrences, callback){
        this.socket.emit("addTest", patientId, date, notes, frequency, occurrences, this.loginToken);
        this.socket.once("addTestResponse", res => {
            callback(res);
        });
    }

    /**
    * Thim method emits a request to add a test into the database
    * @param testId The id of the test to be changed.
    * @param newStatus The new status of the test
    */
    changeTestStatus(testId, newStatus, callback){
        this.socket.emit('testStatusChange', testId, newStatus, this.loginToken);
        this.socket.once("testStatusChangeResponse", res => {
            callback(res);
        });
    }
    changeTestDueDate(testId, newDate, callback){
        this.socket.emit("changeTestDueDate", testId, newDate, this.loginToken);
        this.socket.once("changeTestDueDateResponse", res => {
            callback(res);
        });
    }

    /**
    * Thim method emits a request to edit a test into the database.
    * Response can be either success or failure.
    * @param testId The id of the test to be changed.
    * @param {JSON} newData All the information about the test
    * @param token The token that grants editing priviledges.
    * @callback callback Protocol to be called on response
    */
    editTest(testId, newData, token, callback){
        console.log({newData});
        this.socket.emit("editTest", testId, newData, token, this.loginToken);
        this.socket.once("editTestResponse", response => {
            callback(response);
        });
    }

    editPatient(patientId, newData, token, callback){
        this.socket.emit("editPatient", patientId, newData, token, this.loginToken);
        this.socket.once("editPatientResponse", res => {
            callback(res);
        });
    }
}


let serverConnect = new ServerConnect();
function getServerConnect(){
    if (typeof serverConnect === undefined){
        serverConnect = new ServerConnect();
    }
    return serverConnect;
}
export {getServerConnect};
