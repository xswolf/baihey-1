/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    module.controller("message.chat1", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$ionicScrollDelegate', 'FileUploader', '$http', '$location', '$rootScope', '$filter', '$ionicPopover', '$interval', 'dataFilter', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicScrollDelegate, FileUploader, $http, $location, $rootScope, $filter, $ionicPopover, $interval, dataFilter) {
        var userId = ar.getCookie('bhy_user_id');
        $scope.historyList = [];
        $scope.blackList = false;
        // 设置消息状态为已看
        $scope.setMessageStatus = function (list) {
            for (var i in list) {
                if (list[i].status != 4) {
                    list[i].status = 1;
                }
            }
            return list;
        }
        $scope.sendId = ar.getCookie("bhy_user_id");
        $scope.receiveId = $location.search().id;

        $scope.blackListAlert = function () {
            if (dataFilter.data.blacked.indexOf($scope.receiveId) > -1) {   // 已被对方拉黑，不可查看对方资料
                ar.saveDataAlert($ionicPopup, '您已被对方拉黑，不可查看对方资料。')
                return;
            }
            if ($scope.receiveId >= 10000) {
                $location.url('/userInfo?userId=' + $scope.receiveId);
            } else {
                $location.url('/admin_info?userId=' + $scope.receiveId)
            }
        }
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
        var list = ar.getStorage('chat_messageHistory-' + $scope.receiveId + '-' + userId);
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
        $scope.doRefresh();
        window.addEventListener("native.keyboardshow", function (e) {
            viewScroll.scrollBottom(true);
        });


        // 显示时间函数
        $scope.isLongTime = function (time, index) {
            if (index < 1) return true;
            if (!time) return false;
            return (time - $scope.historyList[index - 1].create_time) > 300;
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

        // 用户身份是否验证 TODO 用户验证了之后localStorage是否能够得到更新
        var userInfoList = ar.getStorage('messageList-' + userId);
        for (var i in userInfoList) {
            if ($scope.receiveId == userInfoList[i].id) {
                $scope.auth_validate = userInfoList[i].auth.identity_check;
            }
        }

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

            list = list != null ? list.concat(data) : data;
            if (list.length > 50){ //最多只能保存50条数据
                list.splice(0, list.length-50);
            }
            $rootScope.historyListHide =  list;

            ar.setStorage('chat_messageHistory-' + $scope.receiveId + '-' + userId, list);

            if (data.length > 0 || res.data.status == 0) { // 如果有新消息，所有消息状态为已看 res.data.status == 0 对方已看
                list = $scope.setMessageStatus(list);
                if(data.length > 0){
                    //$scope.doRefresh();
                    $scope.historyList = $scope.historyList.concat(data);
                    viewScroll.resize();
                    viewScroll.scrollBottom(true);
                }
            }
            ar.initPhotoSwipeFromDOM('.bhy-gallery', $scope, $ionicPopup);   // 查看大图插件

        }).error(function () {
            console.log('页面message.js出现错误，代码：/wap/chat/message-history');
        })

        // 实例化上传图片插件
        $scope.uploader = new FileUploader({url: '/wap/file/thumb'});
        $filter("orderBy")();
        // socket聊天
        requirejs(['chat/wechatInterface', 'plugin/socket/socket.io.1.4.0'], function (wx, socket) {

            socket = socket.connect("http://120.76.84.162:8088");
            // 告诉服务器你已经上线
            socket.emit('tell name', {send_user_id: $scope.sendId, receive_user_id: $scope.receiveId, status: 1});
            // 监听离开聊天页面，断掉socket
            $scope.$on('$destroy', function () {
                socket.emit('tell name', {send_user_id: $scope.sendId, receive_user_id: $scope.receiveId, status: 0});
                socket.disconnect();
            });


            // 发送消息函数
            $scope.sendMessage = function (serverId, sendId, receiveID, type, flagTime, isSend) {

                flagTime != undefined ? '' : flagTime = ar.timeStamp();
                var id = ar.getId($scope.historyList);
                var message = {
                    id: id,
                    message: serverId,
                    send_user_id: sendId,
                    receive_user_id: receiveID,
                    type: type,
                    status: 3,
                    time: flagTime,
                    create_time: flagTime
                };

                if (dataFilter.data.blacked.indexOf(receiveID) > -1) {  //黑名单，不能发消息
                    message.refuse = -1;
                    message.status = 4;
                    $scope.historyList.push(message);
                    ar.setStorage('chat_messageHistory-' + receiveID + '-' + userId, $scope.historyList); // 每次发送消息后把消息放到浏览器端缓存
                    return;
                }

                // 图片上传发送消息回调时不写localStorage,因为上传的时候已经写过了
                if ((isSend && type != 'pic') || (type == 'pic' && !isSend)) {
                    $scope.historyList.push(message);
                    ar.setStorage('chat_messageHistory-' + receiveID + '-' + userId, $scope.historyList); // 每次发送消息后把消息放到浏览器端缓存
                }

                if (!isSend && type == 'pic') {
                    return;
                }

                socket.emit('chat message', message);

            }

            // 发送文本消息调用接口
            $scope.send = function () {
                if ($scope.send_content == '' || $scope.send_content == null || $scope.send_content == undefined) return;
                if (!$scope.userInfo.phone || $scope.userInfo.phone == '0') {   // 用户未认证手机号码  $scope.userInfo.phone
                    var alertPopup = $ionicPopup.alert({
                        template: '绑定手机，免费畅聊',
                        okText: '现在去绑定'
                    });
                    alertPopup.then(function (res) {
                        $location.url('/member/bindPhone');
                    });
                    return;
                }
                if ($scope.userInfo.id == $location.$$search.id) {    // 不能与自己聊天  TODO
                    ar.saveDataAlert($ionicPopup, '您不能与自己聊天！');
                    return;
                }

                $scope.sendMessage($scope.send_content, $scope.sendId, $scope.receiveId, 'send', undefined, true);
                $scope.send_content = '';

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
                $scope.uploader.onAfterAddingFile = function (fileItem) {   // 选择文件之后

                    $scope.sendMessage(fileItem.file.name, $scope.sendId, $scope.receiveId, 'pic', time, false); // 假发送，便于预览图片
                    fileItem.upload();   // 上传
                    viewScroll.resize();
                    viewScroll.scrollBottom(true);


                    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {  // 上传成功

                        if (response.status == 1) {
                            for (var i in $scope.historyList) {
                                if ($scope.historyList[i].message == fileItem.file.name) {
                                    $scope.sendMessage(response.thumb_path, $scope.sendId, $scope.receiveId, 'pic', $scope.historyList[i].time, true);  // 真实发送
                                }
                            }

                        } else {
                            for (var i = $scope.historyList.length - 1; i >= 0; i++) {
                                if ($scope.historyList[i].type == 'pic' && $scope.historyList[i].status == 3) {
                                    $scope.historyList[i].status = 4;
                                    break;
                                }
                            }

                        }

                    }

                };


                $scope.uploader.onCompleteItem = function (fileItem, response, status, headers) {  // 上传结束
                    if (response.thumb_path) {
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
                        ar.initPhotoSwipeFromDOM('.bhy-gallery', $scope, $ionicPopup);
                    }
                };

                $scope.uploader.onErrorItem = function (item, response, status, headers) {
                    ar.saveDataAlert($ionicPopup, '发送图片出错，错误原因未知');
                    for (var i = $scope.historyList.length - 1; i >= 0; i++) {
                        if ($scope.historyList[i].type == 'pic' && $scope.historyList[i].status == 3) {
                            $scope.historyList[i].status = 4;
                            break;
                        }
                    }
                }

            }

            // 消息响应回调函数
            socket.on($scope.sendId + '-' + $scope.receiveId, function (response) {
                if (response == "10086") {
                    $scope.historyList = $scope.setMessageStatus($scope.historyList);
                    ar.setStorage('chat_messageHistory-' + $scope.receiveId + '-' + userId, $scope.historyList); // 每次发送消息后把消息放到浏览器端缓存
                    $scope.$apply();
                    return;
                }
                var setMessage = function (response) {
                    if (response.type == 'madd' || response.type == 'remove' || response.type == 'add') return;
                    response.message = response.message.replace(/&quot;/g, "\"");
                    if ($scope.sendId == response.send_user_id) {  // 响应自己发送的消息
                        for (var i in $scope.historyList) {

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
                        if (response.type == 'pic') {
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
                    list = $rootScope.historyListHide = $rootScope.historyList = $scope.historyList;
                    ar.setStorage('chat_messageHistory-' + $scope.receiveId + '-' + userId, $scope.historyList); // 每次发送消息后把消息放到浏览器端缓存

                }

                switch (response.type) {
                    case 'record': // 录音

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


})

