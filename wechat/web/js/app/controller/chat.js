/**
 * Created by Administrator on 2016/3/28.
 */
define(['app/module','app/service/serviceApi'] , function (module) {

    module.controller('Chat' , ['$scope' , 'app.serviceApi' ,function ($scope ,api ) {

        requirejs(['chat/wechatInterface','chat/chat'] , function (wx , chat) {
            var config = api.wxConfig(wx , chat);

            config.success(function (data) {
                wx.setConfig(data.config);
                chat.init($scope.name);
            })

            $scope.chatContent = []
            // 发送消息
            $scope.send = function () {
                if ($scope.message == '' || $scope.message == null) return;
                $scope.chatContent.push({nrong:$scope.message ,isSelf:true});
                chat.sendMessage($scope.message , $scope.sendName ,'send')
            }

            // 消息响应回调函数
            chat.onMessageCallback = function (msg) {
                var response = JSON.parse(msg.data);
                response.isSelf = false; // 别人发来的消息
                switch (response.type) {
                    case 'send':
                        $scope.chatContent.push(response);
                        break;

                }
                $scope.$apply();
            }
        })



    }])
})