/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    module.controller("message.chat1", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$ionicScrollDelegate', 'FileUploader', '$http', '$location', '$rootScope', '$filter', '$ionicPopover', '$interval', 'dataFilter', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicScrollDelegate, FileUploader, $http, $location, $rootScope, $filter, $ionicPopover, $interval, dataFilter) {
        $scope.historyList = [];
        // 设置消息状态为已看
        $scope.setMessageStatus = function (list) {
            for (var i in list) {
                list[i].status = 1;
            }
            return list;
        }
        $scope.sendId = ar.getCookie("bhy_user_id");
        $scope.receiveId = $location.search().id;
        // 身份证认证
        api.list("/wap/member/honesty-photo", {user_id: $scope.receiveId}).success(function (res) {
            $scope.sfzCheck = res.sfz;
        });

        $scope.hideMultiOnKeyboard = function () {
            angular.element(document.querySelector('#multi_con')).css('bottom', '-110px');
            angular.element(document.querySelector('#msg_footer_bar')).css('bottom', '0');
        }

        var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');

        $scope.messageNum = 0;
        var list = ar.getStorage('chat_messageHistory' + $scope.receiveId);
        // 状态发送中的全部改为发送失败
        for (var i in list) {
            if (list[i].status == 3) {
                list[i].status = 4;
            }
        }

        $scope.doRefresh = function () {
            if (list != null) {
                var num = 20;
                var length = list.length;
                $scope.messageNum += num;
                var start = length - $scope.messageNum <= 0 ? 0 : length - $scope.messageNum;

                $scope.historyList = list.slice(start, length);
            }
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);

        };

        window.addEventListener("native.keyboardshow", function (e) {
            viewScroll.scrollBottom(true);
        });

        // 显示时间函数
        $scope.isLongTime = function (time, index) {
            if(index < 1) return true;
            if (!time) return false;
            return time - $scope.historyList[index - 1].time > 5;
        }

        $scope.followData = {};
        $scope.followData.user_id = $scope.sendId;
        $scope.followData.follow_id = $scope.receiveId;
        // 是否已关注对方， 已关注则不显示关注按钮。
        $scope.u_isFollow = true;
        api.getStatus('/wap/follow/get-follow-status', $scope.followData).success(function (res) {
            if (res.data) {
                $scope.u_isFollow = false;
            }
        });

        // 加关注
        $scope.addFollow = function () {
            if ($scope.followData.user_id == $scope.followData.follow_id) {
                ar.saveDataAlert($ionicPopup, '您不能关注自己');
                return;
            }
            if (dataFilter.data.blacked.indexOf($scope.followData.follow_id) != -1) {
                ar.saveDataAlert($ionicPopup, '对方设置，关注失败');
                return;
            }
            api.save('/wap/follow/add-follow', $scope.followData).success(function (res) {
                if (res.data) {
                    $scope.u_isFollow = false;
                    // 成功，提示
                    ar.saveDataAlert($ionicPopup, '加关注成功');
                }
            });
        }

        /*// 发红包
         $ionicModal.fromTemplateUrl('briberyModal.html', {
         scope: $scope,
         animation: 'slide-in-up'
         }).then(function (modal) {
         $scope.briberyModal = modal;
         $scope.briPageHide = function () {
         modal.hide();
         }
         });*/

        // 查看图片
        /*$scope.showPic = false;
         $scope.detail_pic = function (img) {
         $scope.showPicAdd = img;
         $scope.showPic = true;
         }
         $scope.hidePicBox = function () {
         $scope.showPic = false;
         }*/

        /*// 领取红包
         $ionicModal.fromTemplateUrl('detailBriModal.html', {
         scope: $scope,
         animation: 'slide-in-up'
         }).then(function (modal) {
         $scope.detailBriModal = modal;
         });
         $scope.detail_bri = function (briMessage) {
         briMessage = briMessage.replace(/&quot;/g, "\"");
         var json = JSON.parse(briMessage);
         json.money = json.money / 100; // 页面显示元
         $scope.openBri = json;
         // 判断红包是否被领取过
         api.list('/wap/message/bribery-status', {bribery_id: json.id}).success(function (res) {
         if ($scope.sendId == res.receive_user_id) {  // 别人发的红包才能领取，自己不能领取自己的
         if (res.status == 0) {
         $scope.detailBriModal.show();
         } else if (res.status == 1) {
         $scope.openBribery();
         } else {
         alert('红包已经失效')
         }
         } else {
         alert('自己不能领取自己的红包')
         }

         })

         }*/

        /*// 打开红包
         $ionicModal.fromTemplateUrl('detaiOpenBriModal.html', {
         scope: $scope,
         animation: 'slide-in-up'
         }).then(function (modal) {
         $scope.detaiOpenBriModal = modal;
         });

         $scope.openBribery = function () {
         api.save('/wap/message/open-bribery', {bribery_id: $scope.openBri.id}).success(function (res) {
         if (res.status == 1) {
         $scope.detaiOpenBriModal.show();
         } else if (res.status == -1) {
         $scope.detaiOpenBriModal.show();
         } else {
         alert('异常情况');
         }
         $scope.detailBriModal.hide();
         })
         }*/


        // 用户身份是否验证 TODO 用户验证了之后localStorage是否能够得到更新
        var userInfoList = ar.getStorage('messageList');
        for (var i in userInfoList) {
            if ($scope.receiveId == userInfoList[i].id) {
                $scope.auth_validate = userInfoList[i].auth.identity_check;
            }
        }

        // 红娘评价
        //$scope.marker_rated = function (receviceId) {
        //    api.getUserAuthStatus(receviceId).success(function (res) {
        //
        //        // 显示红娘评价
        //        $scope.u_maker_rated = res.status;
        //
        //    })
        //}

        //  获取历史聊天数据
        $scope.real_name = $location.search().real_name;
        $scope.sex = $location.search().sex;
        $scope.age = $location.search().age;
        $scope.report_flag = $location.search().report_flag;
        $scope.receiveHeadPic = $location.search().head_pic.replace(/~2F/g, "/");
        $scope.sendHeadPic = JSON.parse(ar.getStorage('userInfo').info).head_pic;
        api.getUserInfo($scope.receiveId).success(function (res) {
            $rootScope.receiveUserInfo = res.data;
        });

        api.list("/wap/message/message-history", {id: $scope.receiveId}).success(function (res) {
            var data = res.data.messageList;
            console.log(res.data);
            if (data.length > 0 || res.data.status == 0) { // 如果有新消息，所有消息状态为已看
                list = $scope.setMessageStatus(list);
            }
            $rootScope.historyListHide = list = list != null ? list.concat(data) : data;
            ar.setStorage('chat_messageHistory' + $scope.receiveId, list);

            ar.initPhotoSwipeFromDOM('.bhy-gallery', $scope);   // 查看大图插件
            $scope.doRefresh();
            $timeout(function () {
                viewScroll.scrollBottom(true);
            }, 800);

        }).error(function () {
            console.log('页面message.js出现错误，代码：/wap/chat/message-history');
        })

        // 实例化上传图片插件
        $scope.uploader = new FileUploader({url: '/wap/file/thumb'});

        // socket聊天
        requirejs(['chat/wechatInterface', 'plugin/socket/socket.io.1.4.0'], function (wx, socket) {

            // 配置微信
            //api.wxConfig().success(function (data) {
            //    wx.setConfig(JSON.parse(data.config));
            //})

            socket = socket.connect("http://120.76.84.162:8088");
            //socket = socket.connect("http://127.0.0.1:8088");

            // 告诉服务器你已经上线
            socket.emit('tell name', {send_user_id: $scope.sendId, receive_user_id: $scope.receiveId, status: 1});
            // 监听离开聊天页面，断掉socket
            $scope.$on('$destroy', function () {
                socket.emit('tell name', {send_user_id: $scope.sendId, receive_user_id: $scope.receiveId, status: 0});
                socket.disconnect();
            });

            /*// 播放语音
             $scope.detail_record = function (id) {
             wx.playVoice({
             localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
             });

             }*/

            // 发送消息函数
            $scope.sendMessage = function (serverId, sendId, receiveID, type, flagTime) {

                flagTime != undefined ? '' : flagTime = ar.timeStamp();
                var id = ar.getId($scope.historyList);
                var message = {
                    id: id,
                    message: serverId,
                    send_user_id: sendId,
                    receive_user_id: receiveID,
                    type: type,
                    status: 3,
                    time: flagTime
                };

                // 图片上传发送消息回调时不写localStorage,因为上传的时候已经写过了
                if (!(serverId != 'view' && type == 'pic')) {
                    $scope.historyList.push(message);
                    ar.setStorage('chat_messageHistory' + receiveID, $scope.historyList); // 每次发送消息后把消息放到浏览器端缓存
                }
                if (type == 'pic' && serverId == 'view') {
                    return;
                }
                socket.emit('chat message', message);

            }

            /* // 开始录音
             $scope.start_record = function () {
             wx.startRecord();
             }

             // 结束录音
             $scope.send_record = function () {
             console.log('end');
             wx.send_record($scope.sendId, $scope.receiveId, function (serverId, sendId, toUser, type) {
             $scope.sendMessage(serverId, sendId, toUser, type);
             });
             }*/

            // 绑定手机弹窗
            $ionicPopover.fromTemplateUrl('bindPhonePopover.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            $scope.openPopover = function () {
                $scope.popover.show(document.body);
            };
            $scope.closePopover = function () {
                $scope.popover.hide();
            };

            $scope.phoneInfo = {};
            $scope.codeTitle = '获取验证码';
            // 获取验证码
            $scope.getCode = function () {
                api.getMobileIsExist($scope.phoneInfo.phone).success(function (data) {
                    if (!data.status) {
                        ar.saveDataAlert($ionicPopup, data.msg);
                    } else {
                        var timeTitle = 60;
                        var timer = $interval(function () {
                            $scope.codeTitle = '重新获取(' + timeTitle + ')';
                        }, 1000, 60);
                        timer.then(function () {
                                $scope.codeTitle = '获取验证码';
                                $interval.cancel(timer);
                            }, function () {
                            },
                            function () {
                                timeTitle -= 1;
                            });
                        // 发送验证码
                        api.sendCodeMsg($scope.phoneInfo.phone).success(function (res) {
                            if (res.status < 1) {
                                ar.saveDataAlert($ionicPopup, res.msg);
                            }
                        });
                    }
                });
            }
            // 绑定手机号
            $scope.bindPhone = function () {
                api.getMobileIsExist($scope.phoneInfo.phone).success(function (data) {
                    if (!data.status) {
                        ar.saveDataAlert($ionicPopup, data.msg);
                    } else {
                        // 比对验证码
                        api.validateCode($scope.phoneInfo.code).success(function (res) {
                            if (res.status) {  // 验证码正确
                                api.save('/wap/user/update-user-data', {phone: $scope.phoneInfo.phone}).success(function (res) {
                                    if (res.data) {
                                        ar.saveDataAlert($ionicPopup, '绑定手机成功');
                                        $scope.userInfo.phone = $scope.phoneInfo.phone;
                                        $scope.getUserPrivacyStorage();
                                    } else {
                                        ar.saveDataAlert($ionicPopup, '绑定手机失败');
                                    }
                                    $scope.closePopover();
                                });
                            } else {
                                ar.saveDataAlert($ionicPopup, '验证码错误');
                            }
                        })
                    }
                })
            }
            // 发送文本消息调用接口
            $scope.send = function () {
                if ($scope.send_content == '' || $scope.send_content == null || $scope.send_content == undefined) return;
                if (!$scope.userInfo.phone) {   // 用户未认证手机号码
                    $scope.openPopover();
                    return;
                }
                if ($scope.userInfo.id == $location.$$search.id) {    // 不能与自己聊天  TODO
                    ar.saveDataAlert($ionicPopup, '您不能与自己聊天！');
                    return;
                }
                try {
                    $scope.sendMessage($scope.send_content, $scope.sendId, $scope.receiveId, 'send');
                } catch (e) {

                } finally {
                    $scope.send_content = '';
                }
            }


            // 发送图片
            $scope.send_pic = function () {
                var e = document.getElementById("pic_fileInput");
                var ev = document.createEvent("MouseEvents");
                ev.initEvent("click", true, true);
                e.dispatchEvent(ev);

                $scope.uploader.filters.push({
                    name: 'file-size-Res',
                    fn: function (item) {
                        if (item.size > 8388608) {
                            ar.saveDataAlert($ionicPopup, '请选择小于8MB的图片！')
                            return false;
                        }
                        return true;
                    }
                });

                var time = ar.timeStamp();
                $scope.picLength = $scope.uploader.queue.length;
                $scope.uploader.onAfterAddingFile = function (fileItem) {   // 上传之后
                    $scope.sendMessage('view', $scope.sendId, $scope.receiveId, 'pic', time); // 假发送，便于预览图片
                    fileItem.uploader.queue[$scope.picLength].upload();
                    viewScroll.resize();
                    viewScroll.scrollBottom(true);
                };

                $scope.uploader.onCompleteItem = function (fileItem, response, status, headers) {  // 上传结束
                    $scope.sendMessage(response.thumb_path, $scope.sendId, $scope.receiveId, 'pic', time);  // 真实发送
                    var img = new Image();
                    img.src = response.thumb_path;
                    if (img.complete) {
                        viewScroll.resize();
                        viewScroll.scrollBottom(true);
                    } else {
                        img.onload = function () {
                            viewScroll.resize();
                            viewScroll.scrollBottom(true);
                            img.onload = null; //避免重复加载
                        }
                    }
                    ar.initPhotoSwipeFromDOM('.bhy-gallery', $scope);
                };

                $scope.uploader.onErrorItem = function (item, response, status, headers) {
                    alert('发送图片出错，错误原因：' + response);
                }

            }

            // 消息响应回调函数
            socket.on($scope.sendId + '-' + $scope.receiveId, function (response) {
                if (response == "10086") {
                    $scope.historyList = $scope.setMessageStatus($scope.historyList);
                    ar.setStorage('chat_messageHistory' + $scope.receiveId, $scope.historyList); // 每次发送消息后把消息放到浏览器端缓存
                    $scope.$apply();
                    return;
                }
                var setMessage = function (response) {
                    if (response.type == 'madd' || response.type == 'remove' || response.type == 'add') return;
                    response.message = response.message.replace(/&quot;/g, "\"");
                    if ($scope.sendId == response.send_user_id) {  // 响应自己发送的消息
                        for (var i in $scope.historyList) {
                            if (response.status == 1) { // 如果对方在线，所有消息均设置已读
                                $scope.historyList[i].status = 1;
                            }
                            if (response.time == $scope.historyList[i].time &&
                                (response.message == $scope.historyList[i].message ||
                                response.type == 'pic')) {
                                $scope.historyList[i].message = response.message;
                                $scope.historyList[i].status = response.status;
                            }
                        }
                    } else {
                        response.id = ar.getId($scope.historyList);
                        $scope.historyList.push(response);
                        if(response.type == 'pic'){
                            var img = new Image();
                            img.src = response.message;
                            if (img.complete) {
                                viewScroll.resize();
                                viewScroll.scrollBottom(true);
                            } else {
                                img.onload = function () {
                                    viewScroll.resize();
                                    viewScroll.scrollBottom(true);
                                    img.onload = null; //避免重复加载
                                }
                            }
                        }

                    }
                    $rootScope.historyList = $scope.historyList;
                    ar.setStorage('chat_messageHistory' + $scope.receiveId, $scope.historyList); // 每次发送消息后把消息放到浏览器端缓存
                    $rootScope.historyListHide = $scope.historyList;
                    list = $scope.historyList;
                }

                switch (response.type) {
                    case 'record': // 录音
                        /*wx.downloadVoice({
                         serverId: response.message, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
                         success: function (res) {
                         //response.message = res.localId;
                         setMessage(response);
                         viewScroll.scrollBottom(); // 滚动至底部
                         $scope.$apply();
                         }
                         });*/
                        break;

                    default :
                        setMessage(response);
                        viewScroll.resize();
                        viewScroll.scrollBottom(true);  // 滚动至底部
                        $scope.$apply();
                        break;
                }
            })


        })


    }]);

    /* module.controller("message.childBriberyController", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet) {
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
     ar.saveDataAlert($ionicPopup, '红包金额不合法');
     return false;
     }
     $scope.briFormData = {
     sendId: $scope.sendId,
     receiveId: $scope.receiveId,
     money: $scope.money,
     bri_message: $scope.bri_message
     };

     if ($scope.payType == 1) { // 余额支付
     api.save("/wap/message/send-bribery", $scope.briFormData).success(function (res) {

     if (res.status == 1) {
     //成功，隐藏窗口
     $scope.hideMultiOnKeyboard();
     $scope.briPageHide();
     $scope.sendMessage(res.message, $scope.sendId, $scope.receiveId, 'bribery');
     } else {
     alert(res.message);
     console.log($scope.briFormData);
     }

     });
     } else if ($scope.payType == 2) {// 微信支付
     api.list('/wap/charge/produce-order', {flag_h: 1, money: $scope.money}).success(function (res) {
     if (res.status == 1) {
     window.location.href = '/wap/charge/pay?orderId=' + res.data;
     }
     //requirejs(["jquery"] , function ($) {
     //    ar.weiXinPayCallBack($, param , orderId);
     //})
     })

     }


     }

     }]);

     // 领取红包
     module.controller("message.childDetailBriController", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', function (api, $scope, $timeout, $ionicPopup, $ionicModal) {

     }]);*/
})
