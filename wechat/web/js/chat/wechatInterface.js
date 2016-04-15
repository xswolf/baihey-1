/**
 * Created by Administrator on 2016/3/23.
 */
define(['http://res.wx.qq.com/open/js/jweixin-1.0.0.js','chat/chat'] , function (wx,chat) {
//define(['chat/jweixin','chat/chat'] , function (wx,chat) {
    // 微信接口调用
    wx.setConfig = function ($config) {

        wx.config($config);

        wx.ready(function () {

        });

        wx.error(function(res){
            console.log('发生错误，wechatInterface.js' , res)
        })
    }

    /**
     * 发送语音
     * @param toUser
     */
    wx.send_record = function (sendId , toUser) {
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
                                chat.sendMessage(serverId,sendId, toUser ,'record')
                            }
                        });
                    }else{
                        alert('没有录音Id');
                    }
                }
            }
        );
    }

    /**
     * 发送图片
     * @param toUser
     */
    wx.send_pic = function(sendId,toUser){
        var localId = null;
        var serverId = null; // 图片服务端ID
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                localId = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                if (localId != null) {
                    wx.uploadImage({
                        localId: localId[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                            serverId = res.serverId; // 返回图片的服务器端ID
                            chat.sendMessage(serverId,sendId, toUser, 'pic');
                        }
                    });
                } else {
                    alert('没有图片Id');
                }
            },
            complete : function () {
                console.log('什么情况')
            },
            fail : function () {
                console.log('发送错误了')
            }
        });

    }

    return wx;
})