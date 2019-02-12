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
    socket.on('log', (user) => {
        console.log("Authorizing here...")
        //Function to get users here
        //Return the users in emit on the bottom
        socket.emit('auth', authenticator.canLogin(user));
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
