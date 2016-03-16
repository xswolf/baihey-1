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

    console.log(wx);

    var config = $("#config").val();
    wx.config(config);
    console.log(1);
    wx.ready(function(){
        console.log('ready')
    });

    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        }
    });

    console.log(2);

    wx.error(function(res){
        console.log('error');
    });
    console.log(3);

    wx.checkJsApi({
        jsApiList: ['startRecord'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
            console.log('startRecord')
        },
        fail: function () {
            console.log('error startRecord');
        }
    });
    console.log(4);


    return false;

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