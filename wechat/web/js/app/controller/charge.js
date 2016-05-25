/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    // 选择支付方式
    module.controller("charge.index", ['app.serviceApi', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$location', function (api, $rootScope, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $location) {

        $scope.formData = [];

        // 商品
        api.get('/wap/charge/get-charge-goods-by-id',{id:$location.$$search.goodsId}).success(function(res){
            $scope.goods = res.data;
        })

        $scope.iswx = ar.isWeChat();
        if ($scope.iswx) {
            $scope.formData.payType = "1";
        } else {
            $scope.formData.payType = "2";
        }

        // 立即支付
        $scope.pay = function () {
        }

        // 跳转-返回
        $scope.jump = function () {
            $location.url($location.$$search.tempUrl);
        }

        api.get('/wap/charge/create-order',false).success(function(res){
            $scope.jsApi = res.data;
        })




        function jsApiCall()
        {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                $scope.jsApi,
            function(res){
                WeixinJSBridge.log(res.err_msg);
                alert(res.err_code+res.err_desc+res.err_msg);
            }
        );
        }

        function callpay()
        {
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                    document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                }
            }else{
                jsApiCall();
            }
        }

    }]);

})
