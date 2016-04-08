/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    module.controller("message.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading) {

        // 加载中动画
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });

        // 模拟延迟2秒展现页面
        $timeout(function () {
            $ionicLoading.hide();

            // 获取页面数据
            $scope.items =[
                {
                    id : 1,
                    name:"张三"
                },
                {
                    id : 2,
                    name:"李四"
                },
                {
                    id : 3,
                    name:"王二麻子"
                },
                {
                    id : 4,
                    name:"王二麻子"
                },
                {
                    id : 5,
                    name:"王二麻子"
                },
                {
                    id : 6,
                    name:"王二麻子"
                },
                {
                    id : 7,
                    name:"王二麻子"
                }

            ]

            $scope.isFollow = true;   // 是否有谁关注了我，有则显示小红点


        }, 2000);

        $scope.popShow = false;
        $scope.pop_toggle = function(){
            $scope.popShow = !$scope.popShow;
        }






    }]);

})
