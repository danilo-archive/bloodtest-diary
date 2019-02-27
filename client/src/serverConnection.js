
/**
 * The logic that works as back-end for the app's UI.
 * It communicates with an external server, queries and sends update requests.
 * @module serverConnection
 * @author Danilo Del Busso, Mateusz Nowak, Jacopo Madaluni
 * @version 0.0.2
 */

import openSocket from 'socket.io-client';
import {formatDate} from './lib/utils.js';

const host = "http://localhost";
const port = 3265;
var serverConnect = undefined;

class ServerConnect {

    constructor(){
        this.currentRoom = "";
        this.socket = openSocket(`${host}:${port}`);
        this.socket.on("connected", () => {
            console.log("connected successfully");
            this.socket.emit("join", "", this.currentRoom, true);
        });

        this.onTestAdded = undefined;
        this.onTestStatusChange = undefined;

        this.socket.on("testAdded", newTest => {
            this.onTestAdded(newTest);
        });

        this.socket.on("testStatusChange", (id, status) => {
            console.log("here");
            this.onTestStatusChange(id, status);
        });
    }

    joinMainPage(){
        this.socket.emit("join", this.currentRoom, "main_page");
        this.currentRoom = "main_page";
    }

    joinLoginPage(){
        this.socket.emit("join", this.currentRoom, "login_page");
        this.currentRoom = "login_page";
    }

    changeStatus(id, newStatus){
        this.socket.emit("testChange", id, newStatus);
    }

    setOnTestAdded(callback){
        this.onTestAdded = callback;
    }
    setOnTestStatusChange(callback){
        console.log("set");
        this.onTestStatusChange = callback;
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
        this.socket.on('authenticationResponse', res => {
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
        this.socket.emit('getAllPatients');
        this.socket.on("getAllPatientsResponse", res => {
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
        this.socket.emit('getAllTests');
        this.socket.on('getAllTestsResponse', res => {
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
    getTestsOfPatient(patientId, callback){
        this.socket.emit('getTestsOfPatient', patientId);
        this.socket.on('getTestsOfPatientResponse', res => {
            callback(res);
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
        this.socket.emit('getAllTestsOnDate', date);
        this.socket.on('getAllTestsOnDateResponse', res => {
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
        this.socket.emit('getOverdueTests');
        this.socket.on('getOverdueTestsResponse', res => {
            callback(res.response);
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
        let dateString = formatDate(date);
        this.socket.emit('getTestsInWeek', dateString, anydayTestsOnly);
        this.socket.on('getTestsInWeekResponse', res => {
            console.log(res.response);
            callback(res.response);
        });
    }

    addTest(patientId, date, notes, frequency=""){
        this.socket.emit("addTest", patientId, date, notes, frequency);
    }

    changeTestStatus(testId, newStatus){
        this.socket.emit('testStatusChange', testId, newStatus);
    }
}


const serverConnect = new ServerConnect();
function getServerConnect(){
    if (typeof serverConnect === undefined){
        serverConnect = new ServerConnect();
    }
    return serverConnect;
}
export {getServerConnect};
