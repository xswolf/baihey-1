/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'chat/wechatInterface', 'chat/chat', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module, wx, chat) {

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


        //  获取历史聊天数据
        $scope.sendId = ar.getQueryString('id')
        api.list("/wap/chat/message-history", {id: $scope.sendId}).success(function (data) {
            $scope.historyList = data;

        }).error(function () {
            console.log('页面message.js出现错误，代码：/wap/chat/message-history')
        })

        // socket聊天
        //requirejs(['chat/wechatInterface','chat/chat'] , function (wx , chat) {

        // 获取微信配置文件
        var config = api.wxConfig(wx, chat);
        config.success(function (data) {
            wx.setConfig(data.config);
            chat.init($scope.name);
        })


        // 发送消息
        $scope.send = function () {

            if ($scope.message == '' || $scope.message == null) return;

            chat.sendMessage($scope.message, $scope.sendId, 'send')
        }

        // 消息响应回调函数
        chat.onMessageCallback = function (msg) {
            var response = JSON.parse(msg.data);
            switch (response.type) {
                case 'send':
                    console.log(response);
                    response.id = $scope.historyList[$scope.historyList.length - 1].id + 1;
                    $scope.historyList.push(response);
                    break;

            }
            $scope.$apply();
        }
        //})

    }]);
})
