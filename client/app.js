/**
 * The logic that works as back-end for the app's UI. 
 * It communicates with an external server, queries and sends update requests.
 * @module app
 * @author Danilo Del Busso
 * @version 0.0.1
 */

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const CONFIG_FILE_PATH = __dirname + '/config/app_config.json';
const jsonController = require('./lib/json-controller');

//start the app
init(jsonController.getJSON(CONFIG_FILE_PATH))

/**
 * Initialise and start the back-end for this app using
 * the configuration settings from a specific file.
 * @param {json} conf The JSON config file
 */
function init(conf) {

    let port = conf.port;
    let staticFolder = conf.staticFolder;
    let indexFile = conf.indexFile;

    /*
     * Express connection. 
     */
    app.use(express.static(__dirname + staticFolder));
    app.get('/', function (req, res, next) {
        res.sendFile(indexFile);
    });

    server.listen(port);

}
