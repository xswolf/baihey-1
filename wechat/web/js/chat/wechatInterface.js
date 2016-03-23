/**
 * Created by Administrator on 2016/3/23.
 */
define(['http://res.wx.qq.com/open/js/jweixin-1.0.0.js','chat/chat'] , function (wx,chat) {
    // 微信接口调用
    wx.setConfig = function ($config) {
        wx.config($config);
    }

    wx.ready(function () {

    });

    // 开始录音
    $(document).on('.wx_record','moused',function(){
        wx.startRecord();

    });

    // 结束录音
    $(document).on('.wx_record','moused',function(){
        var localId = null;
        var serverId = null; // 音频服务端ID
        wx.stopRecord({
                success: function (res) {
                    localId = res.localId;
                }
            }
        );

        wx.uploadVoice({
            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                serverId = res.serverId; // 返回音频的服务器端ID
            }
        });

        //var socket = chat.init($("#self_name").val());
        //chat.sendMessage();

    });

    return wx;
})