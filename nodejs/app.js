var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(8088, function () {
    console.log('listening on *:8088');
});

var userList = []; // 存储在线的用户

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

var Message = require('./model/Message');
var message = new Message();

io.on('connection', function (socket) {

    // 聊天发信息用接口
    socket.on('chat message', function (msg) {

        if (userList.indexOf(msg.receive_user_id + '-' + msg.send_user_id) > -1) { // 接受者在线 ， 广播给接受者
            msg.status = 1;
            io.emit(msg.receive_user_id + '-' + msg.send_user_id, msg);
        } else {
            msg.status = 2;
        }
        io.emit(msg.receive_user_id, msg); // 网站外接受
        io.emit(msg.send_user_id + '-' + msg.receive_user_id, msg); // 广播给自己

        console.log(message)
        message.add(msg , function (err,res) {
            console.log(res.insertId);
        });
        console.log('send:' + msg.send_user_id + '   ' + 'receive: ' + msg.receive_user_id, msg);
    });

    // 告诉服务器你加入了聊天
    socket.on('tell name', function (msg) {
        socket.username = msg.send_user_id + '-' + msg.receive_user_id;
        if (msg.status == 1) {  // 用户上线
            if (userList.indexOf(socket.username) == -1) {
                userList.push(socket.username);
            }
            io.emit(msg.receive_user_id + '-' + msg.send_user_id, '10086'); // 消息内容10086为用户上线广播
            console.log(' user id:' + msg.send_user_id + ' is connected', userList);
        } else {  // 用户下线
            userList.remove(socket.username);
            console.log(' user id:' + msg.send_user_id + ' is disconnected', userList);
        }

    })

    //  断开连接
    socket.on('disconnect', function () {
        userList.remove(socket.username);
        console.log('user :' + socket.username + ' disconnect');
    });

});
