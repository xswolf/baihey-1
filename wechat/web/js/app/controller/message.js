/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    module.controller("message.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$location','$ionicListDelegate','$interval','$rootScope', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $location,$ionicListDelegate,$interval, $rootScope) {

        // 发现列表过滤条件：黑名单
        $scope.indexFilter = function (user_id) {
            return $scope.dataFilter.blacked.indexOf(user_id) == -1
        }

        $scope.honesty = function (val) {
            return val & 1;
        }

        $scope.userInfo = {id:ar.getCookie('bhy_user_id')};
        // 删除操作
        $scope.removeItem = function (item,event) {
            angular.element(event.target).parent().parent().addClass('item-remove-animate');
            var message = ar.getStorage('messageList-'+$scope.userInfo.id);
            for (var i in message) {
                if (message[i].other == item.send_user_id) {
                    message.splice(i, 1);
                    break;
                }
            }
            localStorage.removeItem("chat_messageHistory-" + item.send_user_id+'-'+item.receive_user_id);
            $scope.messageList = message;
            ar.setStorage('messageList-'+ ar.getCookie('bhy_user_id'), $scope.messageList);
            api.setMsgDisplay(item.other).success(function (res) {
            }).error(function(response){
                console.log('设置消息显隐出错！'+response);
            });;

            return true;
        }


    }]);

})
