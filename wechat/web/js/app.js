/**
 * Created by Administrator on 2016/3/11.
 */

require.config({
    urlArgs: "bust=" + (new Date()).getTime(), // 清除缓存
    baseUrl: '/wechat/web/js/',
    paths: {
        jquery: 'plugin/jquery/jquery-2.0.3.min',
        chat: 'chat/chat',
        comm: 'comm',
        jweixin: 'chat/jweixin'
    }
});

requirejs(['jquery', './chat', 'comm','jweixin'], function ($, chat, comm,wx) {


    wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wx787f8071dd1e1dac', // 必填，公众号的唯一标识
        timestamp: comm.timestamp, // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
        jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(function(){

    });

    wx.error(function(res){

    });

    wx.checkJsApi({
        jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
            alert(1)
        }
    });

    wx.startRecord();

    chat.init($("#self_name").val()); // 初始化聊天

    $(document).on('click', '#send', function () { // 点击发送按钮

        var message = $("#send_message").val();
        var key = $("#send_name").val();
        chat.so.sendMsg('&nr=' + chat.esc(message) + '&key=' + key);

    });

    chat.onMessageCallback = function (msg) {   // 服务器返回消息处理函数

        var data = JSON.parse(msg.data);
        console.log(data);

        if (data.type == 'send') {

            var msgCot = data.sendName != $("#self_name").val() ? $(".self_send:first").clone() : msgCot = $(".other_send:first").clone();
            msgCot.find('.cot').html(data.nrong);
            msgCot.find('.timeago').html(comm.currentDate());
            msgCot.show();
            $(".chat-list").append(msgCot);

        }

    }

});