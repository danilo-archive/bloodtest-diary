/**
 * The logic that works as back-end for the app's UI.
 * It communicates with an external server, queries and sends update requests.
 * @module app
 * @author Danilo Del Busso, Mateusz Nowak
 * @version 0.0.2
 */

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server); // TODO remove not needed
const ioClient = require('socket.io-client'); // TODO remove not needed
const CONFIG_FILE_PATH = __dirname + '/config/app_config.json';
const jsonController = require('./lib/json-controller');
const bodyParser = require('body-parser');
//TODO remove; needed in the frontned
const crypto = require('crypto');


module.exports = {
    init, getAllPatients, getAllTests, getTestsOfPatient, getTestsOnDate,
    getOverdueTests, getTestsInWeek,
}

//start the app
init(jsonController.getJSON(CONFIG_FILE_PATH))

/**
 * Initialise and start the back-end for this app using
 * the configuration settings from a specific file.
 * @param {json} conf The JSON config file
 */
 // TODO
 // completely refactor this, init should initialize the socket with the server
 // should not provide get/post endpoints
function init(conf)
{
    let port = conf.port;
    let staticFolder = conf.staticFolder;
    var indexFile = conf.indexFile;
    var server_port = conf.server_port;
    const socket = ioClient.connect("http://localhost:"+server_port);
    server.listen(port);
    /*
     * Express connection.
     */
    app.use(express.static(__dirname + staticFolder));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.get('/', function (req,res)
    {
        res.sendFile(__dirname +staticFolder+"/" +indexFile);
    });

    //On post, try to login user; for now
    app.post('/',function (req,res)
    {
        socket.emit('log',{username:req.body.username,
                            //should be provided in frontend; we only receive the hash
                            password:crypto.createHash('sha256').update(req.body.password).digest('hex')
                          },function()
        {

        });
        socket.on('auth', function(user)
        {
          if(!res.headersSent)
          {
            console.log("Logging in here...")
            if(user)
            {
                console.log("Logged");
                //Random redirect for now
                res.redirect('https:google.com');
            }
            else
            {
                console.log("Unsuccesful login attempt");
                //Redirect back to login
                res.sendFile(__dirname +staticFolder+"/" +indexFile);
            }
          }
        });
    });
}


/**
 * Function to be called when user needs to be authenticated
 * @param {username: username, password: password} credentials
 * @param callback The callback function to be called on response
 * TODO eventually change name of the callback.
 */
function login(credentials, callback){
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
