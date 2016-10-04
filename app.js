/**
 * Created by jporter on 10/4/2016.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html')
})
app.use('/client', express.static(__dirname + '/client'));

http.listen(process.env.PORT || 2000);

var users = {}

var io = require('socket.io')(http, {});

io.on('connection', function (socket) {

    socket.on('disconnect', function () {
        delete users[socket.id]
        io.sockets.emit("update-people", users)
    })

    socket.on("join", function (data) {
        users[socket.id] = data.user;
        users["app"] = data.appname
        io.sockets.emit("update-people", users)
    })

})

