/**
 * Created by NSK. on 2016/5/16/0016.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    module.controller("rendezvous.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading','$interval', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading,$interval) {

        $scope.searchForm = {};

        api.list('/wap/rendezvous/list' , $scope.searchForm).success(function (res) {
            $scope.list = res.data;
        })

        $scope.formData = [];

        $scope.formData.timer = '78时00分12秒';

        var tid = $interval(function () {
            var totalSec = getTotalSecond($scope.formData.timer) - 1;
            if (totalSec >= 0) {
                $scope.formData.timer = getNewSyTime(totalSec);
            } else {
                $interval.cancel(tid);
            }

        }, 1000);

        //根据剩余时间字符串计算出总秒数
        function getTotalSecond(timestr) {
            var reg = /\d+/g;
            var timenums = new Array();
            while ((r = reg.exec(timestr)) != null) {
                timenums.push(parseInt(r));
            }
            var second = 0, i = 0;
            if (timenums.length == 4) {
                second += timenums[0] * 24 * 3600;
                i = 1;
            }
            second += timenums[i] * 3600 + timenums[++i] * 60 + timenums[++i];
            return second;
        }

        //根据剩余秒数生成时间格式
        function getNewSyTime(sec) {
            var s = sec % 60;
            sec = (sec - s) / 60; //min
            var m = sec % 60;
            sec = (sec - m) / 60; //hour
            var h = sec % 24;
            var d = (sec - h) / 24;//day
            var syTimeStr = "";
            if (d > 0) {
                syTimeStr += d.toString() + "天";
            }

            syTimeStr += ("0" + h.toString()).substr(-2) + "时"
                + ("0" + m.toString()).substr(-2) + "分"
                + ("0" + s.toString()).substr(-2) + "秒";

            return syTimeStr;
        }

        // 筛选
        $ionicModal.fromTemplateUrl('screenModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.screenModal = modal;
        });

        $scope.showScreenModal = function(){
            $scope.screenModal.show();
        }

        $scope.closeScreenModal = function(){
            $scope.screenModal.hide();
        }


        // 加载更多
        $scope.loadMore = function(){
            console.log('加载更多');
        }


        $scope.screen = [];

        $scope.screen.theme = "0";  // 约会主题，默认 不限
        $scope.screen.money = "0";  // 费用 默认 不限
        $scope.screen.sex = 0; // 发布者性别 默认 不限

        // 性别选择
        $scope.sexChange = function(value){
            $scope.screen.sex = value;
        }

        // 确定筛选
        $scope.saveScreen = function(){

            console.log($scope.screen);

        }
    }]);

    // 约TA
    module.controller("rendezvous.ask", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading','$ionicScrollDelegate','$interval','$location',function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading,$ionicScrollDelegate,$interval,$location) {

        $scope.formData = [];
        $scope.codeTitle = '获取验证码';
        $scope.isSend = false;  // 未发送
        var viewScroll = $ionicScrollDelegate.$getByHandle('askScroll');

        // 手机键盘弹出时，滑动至底部
        window.addEventListener("native.keyboardshow", function(){
            viewScroll.scrollBottom();
        });

        // 验证
        function validate(){
            if(!$scope.formData.mobile || $scope.formData.mobile == ''){
                $ionicPopup.alert({title:'请输入您的手机号码'});
                return false;
            }
            if(!ar.validateMobile($scope.formData.mobile)){
                $ionicPopup.alert({title:'手机号码格式有误'});
                return false;
            }
            return true;
        }

        // 发送验证码
        $scope.sendCode = function(){
            if(!validate){
                return false;
            }
            // 发送验证码


            // 获取验证码按钮倒计时
            $scope.isSend = true;
            var maxTime = 60;  // 计时多久，单位：秒
            var timer = $interval(function(){
                maxTime--;
                $scope.codeTitle = maxTime+'重新获取';
            },1000,maxTime);

            // 发送成功，倒计时结束，按钮还原
            timer.then(function(){
                $interval.cancel(timer);
                $scope.isSend = false;
                $scope.codeTitle = '获取验证码';
            })
        }

        // 确认约会
        $scope.save = function(){
            if(!validate){
                return false;
            }

            // 查询验证码是否正确
            api.validateCode($scope.formData.code).success(function(res){
                if(res){  // 正确，提交数据并提示后跳转

                    //提交数据
                    api.save('url',$scope.followData).success(function(res){
                        if(res){  // 提交数据成功

                            $ionicPopup.alert({title:'已向对方发送约会信息，请耐心等待对方回复'});

                            $timeout(function() {
                                $location.url('#/main/rendezvous');
                            }, 800);

                        }else{
                            $ionicPopup.alert({title:'网络错误，请稍候重试！'});
                        }
                    })
                }else {   // 错误
                    $ionicPopup.alert({title:'验证码错误，请核对！'});
                }
            })
        }

    }]);


});