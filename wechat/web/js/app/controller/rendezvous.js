/**
 * Created by NSK. on 2016/5/16/0016.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    module.controller("rendezvous.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading','$interval', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading,$interval) {

        $scope.list = [];
        $scope.formData = [];
        $scope.formData.pageNum = 0;
        var getList = function(pageNum) {
            var formData = [];
            formData.pageNum = pageNum + 1;
            $scope.formData.pageNum = pageNum + 1;
            api.list('/wap/rendezvous/list' , formData).success(function (res) {
                res.data.length < 2 ? $scope.isMore = false : $scope.isMore = true;
                for(var i in res.data) {
                    var label = res.data[i].we_want.split(',');
                    res.data[i].label = [];
                    res.data[i].label = label;
                    res.data[i].info = JSON.parse(res.data[i].info);
                    res.data[i].auth = JSON.parse(res.data[i].auth);
                    $scope.list.push(res.data[i]);
                }
                for(var j in $scope.list) {
                    $scope.list[j].timer = getRTime(1464976286000);
                    $interval($scope.list[j].timer, 1000);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                console.log($scope.list);
            });
        }

        function getRTime(time){
            var NowTime = new Date();
            var t =time - NowTime.getTime();

            var d=Math.floor(t/1000/60/60/24);
            var h=Math.floor(t/1000/60/60%24);
            var m=Math.floor(t/1000/60%60);
            var s=Math.floor(t/1000%60);

            return d + '天' + h + '时' + m + '分' + s + '秒';

        }

        //$interval(getRTime, 1000);


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


        $scope.isMore = true;

        // 加载更多
        $scope.loadMore = function () {
            getList($scope.formData.pageNum);
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function() {
            return $scope.isMore;
        }
        /*// 加载更多
        $scope.loadMore = function(){
            console.log('加载更多');
        }*/


        $scope.screen = [];

        $scope.screen.theme = "0";  // 约会主题，默认 不限
        $scope.screen.fee_des = "0";  // 费用 默认 不限
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