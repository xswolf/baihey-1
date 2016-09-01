/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    module.controller("message.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$location','$ionicListDelegate','dataFilter','$interval','$rootScope', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $location,$ionicListDelegate,dataFilter,$interval, $rootScope) {
        $timeout($scope.sumSend);
        // 判断是否登录
        /*api.getLoginStatus().success(function(res) {
         if(!res.status) {
         location.href = '/wap/user/login';
         return false;
         }
         });*/

        // 发现列表过滤条件：黑名单
        $scope.indexFilter = function (user_id) {
            return dataFilter.data.blacked.indexOf(user_id) == -1
        }

        $scope.userInfo = {};
        // 获取页面数据

        $rootScope.$watch('messageList' , function () {
            $scope.messageList = $rootScope.messageList;
        })

        //console.log($scope.messageList)

        $scope.userInfo.id = ar.getCookie('bhy_user_id');

       /* // 是否有谁关注了我，有则显示小红点
        $scope.isFollow = true;
        api.getSumFollow().success(function (res) {
            if (res.status) {
                var sumFollow = ar.getStorage('sumFollow') ? ar.getStorage('sumFollow') : 0;
                if (sumFollow >= res.data.sumFollow) {
                    $scope.isFollow = false;
                }
                ar.setStorage('NewSumFollow', res.data.sumFollow);
            }
        });*/

       /* // 联系人pop窗口
        $scope.popShow = false;
        $scope.pop_toggle = function () {
            $scope.popShow = !$scope.popShow;
        }*/

        // 删除操作
        $scope.removeItem = function (item,event) {
            angular.element(event.target).parent().parent().addClass('item-remove-animate');
            var message = ar.getStorage('messageList-'+$scope.userInfo.id);
            for (var i in message) {
                //console.log(message[i].other , item)
                if (message[i].other == item.send_user_id) {
                    message.splice(i, 1);
                    break;
                }
            }
            localStorage.removeItem("chat_messageHistory" + item.send_user_id);
            $scope.messageList = message;
            $rootScope.messageList = message;
            ar.setStorage('messageList-'+userId, $scope.messageList);
            api.setMsgDisplay(item.other).success(function (res) {
            });

            return true;
        }

    }]);

    /*module.controller("message.childBriberyController", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet) {
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

            if ($scope.payType == 1){ // 余额支付
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
            }else if ($scope.payType == 2) {// 微信支付
                api.list('/wap/charge/produce-order'  , {flag_h:1,money: $scope.money}).success(function (res) {
                    if (res.status == 1){
                        window.location.href='/wap/charge/pay?orderId=' + res.data;
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
