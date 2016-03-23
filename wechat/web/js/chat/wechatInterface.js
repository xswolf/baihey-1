/**
 * Created by Administrator on 2016/3/23.
 */
define(['http://res.wx.qq.com/open/js/jweixin-1.0.0.js',] , function (chat) {
    // 微信接口调用
    chat.setConfig = function ($config) {
        chat.config($config);
    }

    chat.ready(function () {

    });

    return chat;
})