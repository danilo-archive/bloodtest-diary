/**
 * The module responsible for all the queries on the dataabase
 * and processing of the data retrived.
 * @module server
 * @author Mateusz Nowak & Jacopo Madaluni
 * @version 0.0.1
 */


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const CONFIG_FILE_PATH = __dirname + '/config/config.json';
const jsonController = require('./lib/json-controller');
const conf = jsonController.getJSON(CONFIG_FILE_PATH);
const port = conf.port;
var authenticator = require("./lib/authenticator.js");

http.listen(port);


io.on('connection',function(socket)
{
    console.log(`Socket ${socket.id} connected`);

    socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected`);
    });

    /**
    * Login endpoint.
    * @param {username:username, password:password} credentials Hashed json of credentials
    * @return {Boolean} True if credentials are correct
    */
    socket.on('authenticate', (credentials) => {
        console.log(`Authentication request from ${socket.id}`);
        res = authenticator.canLogin(credentials,getUserInDatabase(credentials.username));
        console.log(`Authentication ${res ? "successful" : "unsuccesful"}`);
        socket.emit('authenticationResponse', res);
    });

    socket.on('getAllPatients', () => {
        // TODO
        // retrive all patients and return them as json
    });

    socket.on('getAllTests', () => {
        // TODO
        // retrieve all tests scheduled and return them as json
    });

    socket.on('getTestsOfPatient', (patientId) => {
        // TODO
        // given the id of the patient, return all the tests scheduled
        // for that patient as json
    });

    socket.on('getTestsOnDate', (date) => {
        // TODO
        // given a date, return all tests on that date as json
    });

    socket.on('getTestsInWeek', (date, anydayTestsOnly=false) => {
        // TODO
        // given a date, retrieve the tests that are scheduled on that
        // date week, and return them as json
        // if anydayTestsOnly is true, return only the tests that don't have
        // a particular day assigned
    });


    socket.on('getOverdueTests', () => {
        // TODO
        // retrieve all overdue tests and return them as json
    });

    // updates of database --------------------------------
    // TODO add endpoints for diary updates
});


/**
* TODO: Get user data from the database provided the username
**/
function getUserInDatabase(username)
{
  return [{id:"1", username:"admin", password:"f0edc3ac2daf24876a782e9864e9596970a8b8717178e705cd70726b92dbfc58c8e8fb27f7082239969496d989ff65d0bb2fcc3bd91c3a0251fa221ca2cd88a5",iterations: 1268 ,salt:"d50dbbbe33c2d3c545051917b6a60ccd577a1a3f1a96dfac95199e7b0de32841"}];
}
