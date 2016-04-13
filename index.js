var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];
app.use('/', express.static(__dirname+"/public"))
io.sockets.on('connect', function(socket) {
     
    socket.on('login', function(name) {
        if (users.indexOf(name) > -1) {
            socket.emit('Existed');
        } else {
            socket.userIndex = users.length;
            socket.name = name;
            users.push(name);
            socket.emit('loginSuccess');
            //io.sockets.emit('foo')表示所有人都可以收到该事件。
            io.sockets.emit('system', name, users.length, 'login'); //向所有连接到服务器的客户端发送当前登陆用户的昵称 
        };
    });
    socket.on('disconnect', function() {

        users.splice(socket.userIndex, 1);
        //socket.broadcast.emit('foo')则表示向除自己外的所有人发送该事件
        socket.broadcast.emit('system', socket.name, users.length, 'logout');
      
    });
      socket.on('postMsg', function(msg) {
           
            io.sockets.emit('newMsg', socket.name, msg);
        });
});


http.listen(3000);
