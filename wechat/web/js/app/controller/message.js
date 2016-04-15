/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    module.controller("message.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading) {


        // 获取页面数据
        $scope.items = [
            {
                id: 1,
                name: "张三"
            },
            {
                id: 2,
                name: "李四"
            },
            {
                id: 3,
                name: "王二麻子"
            },
            {
                id: 4,
                name: "王二麻子"
            },
            {
                id: 5,
                name: "王二麻子"
            },
            {
                id: 6,
                name: "王二麻子"
            },
            {
                id: 7,
                name: "王二麻子"
            },
            {
                id: 8,
                name: "王二麻子"
            },
            {
                id: 9,
                name: "王二麻子"
            },
            {
                id: 9,
                name: "王二麻子"
            },
            {
                id: 10,
                name: "王二麻子"
            },
            {
                id: 11,
                name: "王二麻子"
            },
            {
                id: 12,
                name: "王二麻子"
            },
            {
                id: 13,
                name: "王二麻子"
            },
            {
                id: 14,
                name: "王二麻子"
            },
            {
                id: 15,
                name: "王二麻子"
            },
            {
                id: 16,
                name: "王二麻子"
            },
            {
                id: 17,
                name: "王二麻子"
            },
            {
                id: 18,
                name: "王二麻子"
            },
            {
                id: 19,
                name: "王二麻子"
            },
            {
                id: 20,
                name: "王二麻子"
            }

        ]

        $scope.isFollow = true;   // 是否有谁关注了我，有则显示小红点

        // 联系人pop窗口
        $scope.popShow = false;
        $scope.pop_toggle = function () {
            $scope.popShow = !$scope.popShow;
        }

        // 删除操作
        $scope.removeItem = function (item) {
            console.log(item);

        }

        $scope.chatHref = function (id) {
            window.location.href = '/wap/message/chat?id=' + id;
        }

    }]);


    module.controller("message.chat", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$ionicScrollDelegate', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicScrollDelegate) {

        $scope.multi = false;
        $scope.showMulti = function () {
            $scope.multi = !$scope.multi;
        }

        $scope.scrollBot = function () {
            $ionicScrollDelegate.scrollBottom(true);
        }

        $scope.talk_type = 'voice';

        $scope.changeType = function(){
            if($scope.talk_type == 'voice'){
                $scope.talk_type = 'txt';
            }else{
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

        // 显示警示语，根据对方是否验证身份证。
        $scope.u_novalidate = true;

        // 红包
        $ionicModal.fromTemplateUrl('briberyModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.briberyModal = modal;
            $scope.briPageHide = function () {
                modal.hide();
            }
        });

        $scope.briPageHide = function () {
            briberyModal.hide();
        }

        //  获取历史聊天数据
        $scope.receiveId = ar.getQueryString('id')
        api.list("/wap/message/message-history", {id: $scope.receiveId}).success(function (data) {
            $scope.historyList = data;

        }).error(function () {
            console.log('页面message.js出现错误，代码：/wap/chat/message-history')
        })

        // socket聊天
        requirejs(['chat/wechatInterface', 'chat/chat'], function (wx, chat) {

            // 配置微信
            wx.setConfig($scope.wx_config);

            // 初始化聊天
            chat.init($scope.sendId);

            // 发送图片调用接口
            $scope.send_pic = function () {

                console.log('调起发送接口')
                wx.send_pic($scope.sendId, $scope.receiveId);
            }

            // 开始录音
            $scope.start_record = function () {
                wx.startRecord();
            }

            // 结束录音
            $scope.send_record = function () {
                wx.send_record($scope.sendId, $scope.receiveId);
            }

            // 发送文本消息调用接口
            $scope.send = function () {

                if ($scope.message == '' || $scope.message == null) return;

                chat.sendMessage($scope.message, $scope.sendId, $scope.receiveId, 'send');

            }

            // 消息响应回调函数
            chat.onMessageCallback = function (msg) {
                var response = JSON.parse(msg.data);

                if ($scope.historyList == undefined || $scope.historyList.length == 0) { // 判断是否有聊天内容设置ID
                    response.id = 1
                } else {
                    response.id = $scope.historyList[$scope.historyList.length - 1].id + 1;
                }

                switch (response.type) {
                    case 'send': // 文字

                        $scope.historyList.push(response);
                        break;

                    case 'pic': // 图片

                        $scope.historyList.push(response);
                        break;

                    case 'record': // 录音

                        $scope.historyList.push(response);
                        break;
                }
                $scope.scrollBot(); // 滚动至底部
                $scope.$apply();
            }
        })

    }]);

    module.controller("message.childBriberyController", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', function (api, $scope, $timeout, $ionicPopup, $ionicModal) {

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

            $scope.briFormData = [{sendId: $scope.sendId, receiveId: $scope.receiveId, money: $scope.money}];

            api.save(url, $scope.briFormData).success(function (res) {

                //成功，隐藏窗口
                $scope.briPageHide();
            });
        }

    }]);

})
