/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    module.controller("message.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading','$state', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading,$state) {

        $timeout($scope.sumSend);
        // 判断是否登录
        /*api.getLoginStatus().success(function(res) {
            if(!res.status) {
                location.href = '/wap/user/login';
                return false;
            }
        });*/

        $scope.userInfo = {};
        // 获取页面数据

        // 获取localstorage消息记录
        var messageList = ar.getStorage("messageList");
        $scope.messageList = new Array();
        if (messageList != null) {
            $scope.messageList = messageList;
        }
        //console.log($scope.messageList)
        // 从服务器获取未看消息
        $scope.listMessage = function() {
            $scope.messageList = ar.getStorage("messageList");
        }

        // 定时任务10秒取一次最新消息列表
        $scope.listMessage();
        setInterval(function () {
            $scope.listMessage();
        }, 5000);

        $scope.userInfo.id = ar.getCookie('bhy_user_id');

        // 是否有谁关注了我，有则显示小红点
        $scope.isFollow = true;
        api.getSumFollow().success(function (res) {
            if (res.status) {
                var sumFollow = ar.getStorage('sumFollow');
                if (sumFollow >= res.data.sumFollow) {
                    $scope.isFollow = false;
                }
                ar.setStorage('sumFollow', res.data.sumFollow);
            }
        });

        // 联系人pop窗口
        $scope.popShow = false;
        $scope.pop_toggle = function () {
            $scope.popShow = !$scope.popShow;
        }

        // 删除操作
        $scope.removeItem = function (item) {
            var message = ar.getStorage('messageList');
            for (var i in message) {
                if (message[i].send_user_id == item.send_user_id) {
                    message.splice(i, 1);
                    break;
                }
            }
            $scope.messageList = message;
            ar.setStorage('messageList', $scope.messageList);
            api.setMsgDisplay(item.other).success(function (res) {

            });
        }

    }]);


    module.controller("message.chat", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$ionicScrollDelegate', 'FileUploader', '$http','$location','$rootScope', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicScrollDelegate, FileUploader, $http , $location,$rootScope) {
        $scope.showMenu(false);
        $scope.sendId = ar.getCookie("bhy_user_id");
        $scope.multi = false;
        $scope.showMulti = function () {
            $scope.multi = !$scope.multi;
        }

        $scope.scrollBot = function () {
            $ionicScrollDelegate.scrollBottom(true);
        }

        $scope.talk_type = 'voice';

        $scope.changeType = function () {
            if ($scope.talk_type == 'voice') {
                $scope.talk_type = 'txt';
            } else {
                $scope.talk_type = 'voice';
            }
        }

        // 是否已关注对方， 已关注则不显示关注按钮。
        $scope.u_isFollow = true;

        // 加关注
        $scope.addFollow = function () {

            $scope.followData = [{sendId: $scope.sendId}, {receiveId: $scope.receiveId}];

            api.save(url, $scope.followData).success(function (res) {

                // 成功，提示
                $ionicPopup.alert({title: '加关注成功'});

            });
        }

        // 发红包
        $ionicModal.fromTemplateUrl('briberyModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.briberyModal = modal;
            $scope.briPageHide = function () {
                modal.hide();
            }
        });

        // 查看图片
        $scope.showPic = false;
        $scope.detail_pic = function (id) {
            $scope.showPicAdd = id;
            $scope.showPic = true;
        }
        $scope.hidePicBox = function () {
            $scope.showPic = false;
        }

        // 领取红包
        $ionicModal.fromTemplateUrl('detailBriModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.detailBriModal = modal;
        });
        $scope.detail_bri = function (briMessage) {
            briMessage = briMessage.replace(/&quot;/g , "\"");
            var json = JSON.parse(briMessage);
            $scope.openBri = json;
            // 判断红包是否被领取过
            api.list('/wap/message/bribery-status' , {bribery_id:json.id}).success(function (res) {
                if ($scope.sendId == res.receive_user_id){  // 别人发的红包才能领取，自己不能领取自己的
                    if (res.status == 0){
                        $scope.detailBriModal.show();
                    }else if (res.status ==1 ) {
                        $scope.openBribery();
                    }else{
                        alert('红包已经失效')
                    }
                }else{
                    alert('自己不能领取自己的红包')
                }

            })

        }

        // 打开红包
        $ionicModal.fromTemplateUrl('detaiOpenBriModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.detaiOpenBriModal = modal;
        });

        $scope.openBribery = function () {
            api.save('/wap/message/open-bribery' , {bribery_id:$scope.openBri.id}).success(function (res) {
                if(res.status == 1) {
                    $scope.detaiOpenBriModal.show();
                }else if (res.status == -1){
                    $scope.detaiOpenBriModal.show();
                }else{
                    alert('异常情况');
                }
                $scope.detailBriModal.hide();
            })
        }

        // 对方是否认证身份
        $scope.auth_validate = function (receviceId) {

            api.getUserAuthStatus(receviceId).success(function (res) {

                // 显示警示语
                $scope.u_auth_validate = res.status;

            })
        }

        // 红娘评价
        $scope.marker_rated = function (receviceId) {
            api.getUserAuthStatus(receviceId).success(function (res) {

                // 显示红娘评价
                $scope.u_maker_rated = res.status;

            })
        }

        //  获取历史聊天数据
        $scope.receiveId   = $location.search().id // 获取接受者ID
        $scope.real_name   = $location.search().real_name;
        $scope.sex         = $location.search().sex;
        $scope.age         = $location.search().age;
        $scope.sendHeadPic = $scope.receiveHeadPic = $location.search().head_pic.replace(/~2F/g , "/");
        $scope.historyList = ar.getStorage('chat_messageHistory' + $scope.receiveId);
        api.getUserInfo($scope.receiveId).success(function (res) {
            $rootScope.receiveUserInfo = res.data;
        });
        api.list("/wap/message/message-history", {id: $scope.receiveId}).success(function (data) {

            $rootScope.historyList = $scope.historyList == null ? $scope.historyList = data : $scope.historyList = $scope.historyList.concat(data);
            ar.setStorage('chat_messageHistory' + $scope.receiveId, $scope.historyList);
            var messageList = ar.getStorage('messageList');

            for (var i in messageList) { // 设置消息列表一看状态
                if (messageList[i].send_user_id == $scope.receiveId) {
                    messageList[i].sumSend = 0;
                    messageList[i].status = 1;
                }
            }
            ar.setStorage('messageList', messageList);
        }).error(function () {

            console.log('页面message.js出现错误，代码：/wap/chat/message-history');

        })

        // 实例化上传图片插件
        $scope.uploader = new FileUploader({url: '/wap/file/upload'});

        // socket聊天
        requirejs(['chat/wechatInterface', 'chat/chat'], function (wx, chat) {

            // 配置微信
            api.wxConfig().success(function (data) {
                wx.setConfig(JSON.parse(data.config));
            })


            // 初始化聊天
            chat.init($scope.sendId);
            $scope.chat = chat;
            // 播放语音
            $scope.detail_record = function (id) {
                wx.playVoice({
                    localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
                });

            }

            // 发送消息函数
            $scope.sendMessage = function (serverId, sendId, toUser, type) {
                var flagTime = ar.timeStamp();
                var id = ar.getId($scope.historyList);
                var message = {
                    id: id,
                    message: serverId,
                    send_user_id: sendId,
                    receive_user_id: toUser,
                    type: type,
                    status: 3,
                    time: flagTime
                };
                $scope.historyList.push(message);
                ar.setStorage('chat_messageHistory' + toUser, $scope.historyList); // 每次发送消息后把消息放到浏览器端缓存
                chat.sendMessage(serverId, sendId, toUser, type, flagTime);
            }

            // 开始录音
            $scope.start_record = function () {
                wx.startRecord();
            }

            // 结束录音
            $scope.send_record = function () {
                console.log('end');
                wx.send_record($scope.sendId, $scope.receiveId, function (serverId, sendId, toUser, type) {
                    $scope.sendMessage(serverId, sendId, toUser, type);
                });
            }

            // 发送文本消息调用接口
            $scope.send = function () {

                if ($scope.message == '' || $scope.message == null) return;

                $scope.sendMessage($scope.message, $scope.sendId, $scope.receiveId, 'send');

            }


            // 发送图片
            $scope.send_pic = function () {
                var e = document.getElementById("pic_fileInput");
                var ev = document.createEvent("MouseEvents");
                ev.initEvent("click", true, true);
                e.dispatchEvent(ev);

                // 过滤器，限制用户只能上传图片
                $scope.uploader.filters.push({
                    name: 'file-type-Res',
                    fn: function (item) {

                        if (!ar.msg_file_res_img(item)) {   // 验证文件是否是图片格式
                            $ionicPopup.alert({title: '只能发送图片类型的文件！'});
                            return false;
                        }

                        if ((item.size / 1024) > 2) {    // 图片大于2M，则压缩图片
                            api.resizeFile(item).then(function (blob_data) {
                                var fd = new FormData();
                                fd.append("imageFile", blob_data);
                                console.log(fd);
                            }, function (err_reason) {
                                console.log(err_reason);
                            });
                        }

                        return true;
                    }
                });


                var length = $scope.uploader.queue.length;
                $scope.uploader.onAfterAddingFile = function (fileItem) {   // 上传之后

                    fileItem.uploader.queue[length].upload();
                    //console.info('onAfterAddingFile', fileItem);

                };

                $scope.uploader.onCompleteItem = function (fileItem, response, status, headers) {  // 上传结束
                    console.log(response.path);
                    $scope.sendMessage(response.path, $scope.sendId, $scope.receiveId, 'pic');
                    //console.info('onCompleteItem', fileItem, response, status, headers);
                };

            }


            // 消息响应回调函数
            chat.onMessageCallback = function (msg) {
                var response = JSON.parse(msg.data);

                var setMessageStatus = function (response) {
                    if (response.type=='madd' || response.type=='remove' || response.type=='add') return;
                    if ($scope.sendId == response.sendId) {  // 响应自己发送的消息
                        for (var i in $scope.historyList) {
                            console.log(response.time +"=="+ $scope.historyList[i].time +"=="+  response.message +"=="+ $scope.historyList[i].message);
                            response.message = response.message.replace(/&quot;/g , "\"");
                            if (response.time == $scope.historyList[i].time && response.message == $scope.historyList[i].message) {

                                $scope.historyList[i].status = 2;
                            }
                        }
                    } else {
                        response.id = ar.getId($scope.historyList);
                        $scope.historyList.push(response);
                    }
                    $rootScope.historyList = $scope.historyList;
                    ar.setStorage('chat_messageHistory' + $scope.receiveId , $scope.historyList); // 每次发送消息后把消息放到浏览器端缓存
                }

                switch (response.type) {
                    case 'record': // 录音
                        wx.downloadVoice({
                            serverId: response.message, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                            success: function (res) {
                                //response.message = res.localId;
                                setMessageStatus(response);
                                $scope.scrollBot(); // 滚动至底部
                                $scope.$apply();
                            }
                        });
                        break;

                    default :
                        setMessageStatus(response);
                        $scope.scrollBot(); // 滚动至底部
                        //$scope.$apply();
                        break;
                }
            }

        })



    }]);

    module.controller("message.childBriberyController", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', function (api, $scope, $timeout, $ionicPopup, $ionicModal) {
        $scope.bri_message = '恭喜发财，大吉大利';

        $scope.btnStatus = true;
        $scope.money = 0;
        $scope.valMoney = function (money) {
            if (ar.validateMoney(money)) {
                $scope.money = money;
                if (money > 200) {
                    $scope.btnStatus = true;
                } else {
                    $scope.btnStatus = false;
                }
            } else {
                $scope.money = 0;
                $scope.btnStatus = true;
            }
        }


        // 发红包
        $scope.bri_submit = function () {

            if ($scope.money == 0) {
                $ionicPopup.alert({title: '红包金额不合法'});
                return false;
            }
            $scope.briFormData = {sendId: $scope.sendId, receiveId: $scope.receiveId, money: $scope.money,bri_message:$scope.bri_message};

            api.save("/wap/message/send-bribery", $scope.briFormData).success(function (res) {

                if (res.status == 1){
                    //成功，隐藏窗口
                    $scope.briPageHide();
                    $scope.sendMessage(res.message, $scope.sendId, $scope.receiveId, 'bribery');
                }else{
                    alert('余额不够');
                    console.log($scope.briFormData);
                }

            });
        }

    }]);

    // 领取红包
    module.controller("message.childDetailBriController", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', function (api, $scope, $timeout, $ionicPopup, $ionicModal) {

    }]);
})
