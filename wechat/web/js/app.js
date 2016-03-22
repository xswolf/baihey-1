/**
 * Created by Administrator on 2016/3/11.
 */

require.config({
    urlArgs: "bust=v2", // 清除缓存
    baseUrl: '/wechat/web/js/',
    paths: {
        jquery: 'plugin/jquery/jquery',
        angular: 'plugin/angular/angular.min'
    },

    shim : {
        angular: {
            exports: 'angular',
            state: 2
        }
    }
});

//require(['jquery', 'chat', 'comm'], function ($, chat, comm) {
//
//    chat.init($("#self_name").val()); // 初始化聊天
//
//    $(document).on('click', '#send', function () { // 点击发送按钮
//
//        var message = $("#send_message").val();
//        var key = $("#send_name").val();
//        chat.so.sendMsg('&nr=' + chat.esc(message) + '&key=' + key);
//
//    });
//
//    chat.onMessageCallback = function (msg) {   // 服务器返回消息处理函数
//
//        var data = JSON.parse(msg.data);
//        console.log(data);
//        if (data.type == 'send') {
//
//            var msgCot = data.sendName != $("#self_name").val() ? $(".self_send:first").clone() : msgCot = $(".other_send:first").clone();
//            msgCot.find('.cot').html(data.nrong);
//            msgCot.find('.timeago').html(comm.currentDate());
//            msgCot.show();
//            $(".chat-list").append(msgCot);
//
//        }
//    }
//});