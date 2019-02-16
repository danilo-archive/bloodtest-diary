
/**
 * The logic that works as back-end for the app's UI.
 * It communicates with an external server, queries and sends update requests.
 * @module serverConnection
 * @author Danilo Del Busso, Mateusz Nowak, Jacopo Madaluni
 * @version 0.0.2
 */

import openSocket from 'socket.io-client';

const host = "http://localhost";
const port = 3265;
const  socket = openSocket(`${host}:${port}`);


/**
 * Function to be called when user needs to be authenticated
 * @param {username: username, password: password} credentials
 * @param callback The callback function to be called on response
 * TODO eventually change name of the callback.
 */
function login(credentials, callback){
    console.log("trying to log in");
    socket.emit('log', credentials);
    socket.on('auth', res => {
        callback(res);
    });
}


/**
 * Function to be called when all patients have to be retrieved.
 * @param callback The callback function to be called on response
 * TODO eventually change name of the function.
 * TODO eventually change name of the callback.
 */
function getAllPatients(callback){
    socket.emit('getAllPatients');
    socket.on("getAllPatientsResponse", res => {
        callback(res);
    });
}

/**
 * Function to be called when all tests have to be retrieved.
 * @param callback The callback function to be called on response
 * TODO eventually change name of the function.
 * TODO eventually change name of the callback.
 */
function getAllTests(callback){
    socket.emit('getAllTests');
    socket.on('getAllTestsResponse', res => {
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
function getTestsOfPatient(patientId, callback){
    socket.emit('getTestsOfPatient', patientId);
    socket.on('getTestsOfPatientResponse', res => {
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
function getTestsOnDate(date, callback){
    socket.emit('getAllTestsOnDate', date);
    socket.on('getAllTestsOnDateResponse', res => {
        callback(res);
    });
}

/**
 * Function to be called when all overdue tests are needed.
 * @param callback The callback function to be called on response
 * TODO eventually change name of the function.
 * TODO eventually change name of the callback.
 */
function getOverdueTests(callback){
    socket.emit('getOverdueTests');
    socket.on('getOverdueTestsResponse', res => {
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
function getTestsInWeek(date, anydayTestsOnly=false, callback){
    socket.emit('getTestsInWeek', date, anydayTestsOnly);
    socket.on('getTestsInWeekResponse', res => {
        callback(res);
    });
}

export {test, login};
