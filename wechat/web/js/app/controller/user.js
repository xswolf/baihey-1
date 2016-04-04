/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    // 注册
    module.controller("User.register", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.User = {};


        $scope.User.codeBtn = '获取验证码';

        //设定页面高度为屏幕高度
        $scope.User.winHeight = {
            'height': document.documentElement.clientHeight + 'px'
        }

        $scope.User.sex = {
            man: false,
            woman: false
        }

        // 男生点击事件
        $scope.User.selSex1 = function () {
            $scope.User.sex.man = true;
            $scope.User.sex.woman = false;
        }

        // 女生点击事件
        $scope.User.selSex2 = function () {
            $scope.User.sex.man = false;
            $scope.User.sex.woman = true;
        }

        function validatePhone(phone) {

            if (!ar.validateMobile(phone)) {  // 验证手机格式
                $ionicPopup.alert({title: '手机号码格式不正确'});
                return false;
            }

            api.getMobileIsExist(phone).success(function(data){
                    if(!data.status){
                        $ionicPopup.alert({title: data.msg});
                        return true;
                    }else {
                        return false;
                    }
            })

            return true;
        }

        // 开始计时
        $scope.User.startTime = function () {
            $scope.User.max_time -= 1;
            $scope.User.codeBtn = "重新发送" + $scope.User.max_time;
            $scope.$apply();
        }

        // 结束计时，还原文字
        $scope.User.endTime = function () {
            $scope.User.codeSwitch = false;
            $scope.User.codeCls = false;
            $scope.User.codeBtn = '获取验证码';
            clearInterval($scope.User.timer);
            $scope.$apply();
        }

        // 获取验证码
        $scope.User.getCode = function () {

            if (!validatePhone($scope.User.mobile)) return;

            // 发送验证码
            api.sendCodeMsg($scope.User.mobile).success(function (data){

                if(!data.status){
                    $ionicPopup.alert({title: '短信发送失败，请稍后重试。'});
                    return false;
                }else {
                    //计时
                    $scope.User.codeSwitch = true;
                    $scope.User.codeCls = true;
                    $scope.User.max_time = 60;
                    $scope.User.timer = setInterval($scope.User.startTime, 1000);
                    setTimeout($scope.User.register.endTime, $scope.User.max_time * 1000);
                }
            });



        }

        //注册提交
        $scope.User.register = function () {


            if ($scope.User.sex.man == false && $scope.User.sex.woman == false) {
                $ionicPopup.alert({title: '请选择您的性别'});
                return false;
            }

            if(!ar.trim($scope.User.code)){

                $ionicPopup.alert({title: '请填写短信验证码'});
                return false;
            }

            var result = api.save('/wap/user/register', $scope.User);
            result.success(function (data) {
                if (data.status) {
                    var m = $scope.User.mobile;
                    ar.cookieUser($scope.User.mobile, m.substring(m.length-6));
                    window.location.href = '/wap/site/index';
                }
            }).error(function () {
                $ionicPopup.alert({title: '网络连接错误，请重试'});
            })

        }

    }])

    // 登录
    module.controller("User.login", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.User = {};

        // 设定页面高度为屏幕高度
        $scope.User.winHeight = {
            "height": document.documentElement.clientHeight + 'px'
        }


        $scope.User.login = function(){

            if(!$scope.User.validateFrom()) return;

            api.save('/wap/user/login',$scope.User).success(function(data){

                if(data.status){
                    ar.cookieUser($scope.User.username,$scope.User.password);  //存入cookie
                    window.location.href = '/wap/site';
                }else {
                    $ionicPopup.alert({title: '用户名或者密码错误'});
                }

            })

        }

        $scope.User.validateFrom = function(){

            if(!$scope.User.username){
                $ionicPopup.alert({title: '请输入您的手机号码或ID'});
                return false;
            }

            if(!$scope.User.password){
                $ionicPopup.alert({title: '请输入您的密码'});
                return false;
            }

            return true;
        }


    }])

    //找回密码
    module.controller("User.forgetpass", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.User = { }

        $scope.User.codeBtn = '获取验证码';



        // 发送验证码
        $scope.User.getCode = function(){

            if (!ar.validateMobile($scope.User.mobile)) {  // 验证手机格式
                $ionicPopup.alert({title: '手机号码格式不正确'});
                return false;
            }

            api.sendCodeMsg($scope.User.mobile).success(function (data){
                if(!data.status){
                    $ionicPopup.alert({title: '短信发送失败，请稍后重试。'});
                    return false;
                }else {
                    //计时
                    $scope.User.codeSwitch = true;
                    $scope.User.codeCls = true;
                    $scope.User.max_time = 60;
                    $scope.User.timer = setInterval($scope.User.startTime, 1000);
                    setTimeout($scope.User.endTime, $scope.User.max_time * 1000);
                }

            });
        }


        // 开始计时
        $scope.User.startTime = function () {
            $scope.User.max_time -= 1;
            $scope.User.codeBtn = "重新发送" + $scope.User.max_time;
            $scope.$apply();
        }

        // 结束计时，还原文字
        $scope.User.endTime = function () {
            $scope.User.codeSwitch = false;
            $scope.User.codeCls = false;
            $scope.User.codeBtn = '获取验证码';
            clearInterval($scope.User.timer);
            $scope.$apply();
        }



    }])

    return module;
})


