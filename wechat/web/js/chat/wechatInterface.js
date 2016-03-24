/**
 * Created by Administrator on 2016/3/23.
 */
define(['http://res.wx.qq.com/open/js/jweixin-1.0.0.js'] , function (wx) {
    // 微信接口调用
    wx.setConfig = function ($config) {

        wx.config($config);

        wx.ready(function () {

        });

        wx.error(function(res){

        })
    }



    //console.log($);
    wx.send_record = function () {
        var localId = null;
        var serverId = null; // 音频服务端ID
        wx.stopRecord({
                success: function (res) {
                    localId = res.localId;
                    if (localId != null) {
                        wx.uploadVoice({
                            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                            success: function (res) {
                                serverId = res.serverId; // 返回音频的服务器端ID
                            }
                        });
                    }else{
                        alert('没有录音Id');
                    }
                }
            }
        );

        return serverId;
    }

    return wx;
})