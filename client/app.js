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
const io = require('socket.io')(server);
const ioClient = require('socket.io-client');
const CONFIG_FILE_PATH = __dirname + '/config/app_config.json';
const jsonController = require('./lib/json-controller');
const bodyParser = require('body-parser');



//start the app
init(jsonController.getJSON(CONFIG_FILE_PATH))

/**
 * Initialise and start the back-end for this app using
 * the configuration settings from a specific file.
 * @param {json} conf The JSON config file
 */
function init(conf)
{
    let port = conf.port;
    let staticFolder = conf.staticFolder;
    var indexFile = conf.indexFile;
    var server_port = conf.server_port;
    const client = ioClient.connect("http://localhost:"+server_port);
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
        client.emit('log', {username:req.body.username, password: req.body.password},function()
        {

        });
        client.on('auth', function(user)
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
