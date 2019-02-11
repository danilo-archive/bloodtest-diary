/**
 * The module responsible for all the queries on the dataabase
 * and processing of the data retrived.
 * @module server
 * @author Mateusz Nowak
 * @version 0.0.1
 */


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var authenticator = require("./lib/authenticator.js");

http.listen(3265);
io.on('connection',function(socket)
{
    socket.on('log', function(user)
    {
        console.log("Authorizing here...")
        //Function to get users here
        //Return the users in emit on the bottom
        socket.emit('auth', authenticator.canLogin(user));
    });
});
