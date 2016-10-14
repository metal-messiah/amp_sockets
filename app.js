/**
 * Created by jporter on 10/4/2016.
 */


/**
 * // sending to sender-client only
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');
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
        users[socket.id] = {
            username: data.user,
            app: data.app
        }
        socket.broadcast.emit("new-join", data)
        io.sockets.emit("update-people", users)
    })

})

