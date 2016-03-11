/**
 * Created by Administrator on 2016/3/11.
 */

require.config({
    urlArgs: "bust=" + (new Date()).getTime(), // 清除缓存
    baseUrl: '/wechat/web/js/',
    paths: {
        jquery: 'plugin/jquery/jquery-2.0.3.min',
        chat: 'chat/chat'
    }
});

define(['jquery','./chat'] , function ($ , chat) {

    chat.init('send'); // 初始化聊天

    $(document).on('click' , '#send' , function () { // 点击发送按钮
        var message = $("#message").val();
        var key = $("#name").val();
        chat.so.sendMsg('nr='+chat.esc(message)+'&key='+key);
    });

    chat.onMessageCallback = function (msg) {   // 服务器返回消息处理函数
        console.log(msg);
    }

});