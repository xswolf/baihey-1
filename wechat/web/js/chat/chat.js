/**
 * Created by Administrator on 2016/3/11.
 */

define(['jquery'] , function(){
    var chat = {
        url : "ws://120.76.84.162:8080",
        //url : "ws://127.0.0.1:8080",
        name: '',
        esc : function esc(da) {
            da = da.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
            return encodeURIComponent(da);
        },
        socket : null,
    };

    // 初始化
    chat.init = function (name) {
        this.socket = this.so();
        this.name = name;

    };

    // 初始化socket
    chat.so = function(){
        var socket =  new WebSocket(this.url);
        console.log('socket connecting');

        // 链接上socket 发送用户姓名到服务器
        socket.onopen = function () {
            if (chat.socket.readyState == 1){
                chat.socket.send('type=add&ming='+chat.name)
            }
        };

        socket.onclose = function () {
            chat.socket = false;
            console.log('socket close');
        };

        socket.onmessage = function (msg) {
            eval('var da='+msg.data);
            chat.onMessageCallback(msg);
        };

        return socket;
    };


    // 发送消息
    chat.so.sendMsg = function (msg) {
        chat.socket.send(msg);
    };




    return chat;
});
