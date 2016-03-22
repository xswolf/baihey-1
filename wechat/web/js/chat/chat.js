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
        if (this.socket == null){
            this.socket = this.so();
            this.name = name;
        }
        return this.socket;

    };

    // 初始化socket
    chat.so = function(){
        var socket =  new WebSocket(this.url);


        // 链接上socket 发送用户姓名到服务器
        socket.onopen = function () {
            console.log('socket connecting');
            if (chat.socket.readyState == 1){
                chat.socket.send('type=add&ming='+chat.name)
            }
        };

        socket.onclose = function () {
            this.socket = null;
            socket.close();
            console.log('socket close');
        };

        socket.onmessage = function (msg) {
            chat.onMessageCallback(msg);
        };

        socket.onerror = function () {
            console.log('发生错误')
            this.socket = null;
            socket.close();


        }

        return socket;
    };


    return chat;
});
