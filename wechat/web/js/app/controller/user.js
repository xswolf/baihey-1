/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    // 注册
    module.controller("register", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.User = {register: {}};

        $scope.User.isOk = false;  //是否通行

        $scope.User.register.codeBtn = '获取验证码';

        //设定页面高度为屏幕高度
        $scope.User.register.winHeight = {
            'height': document.documentElement.clientHeight + 'px'
        }

        $scope.User.register.sex = {
            man: false,
            woman: false
        }

        // 男生点击事件
        $scope.User.register.selSex1 = function () {
            $scope.User.register.sex.man = true;
            $scope.User.register.sex.woman = false;
        }

        // 女生点击事件
        $scope.User.register.selSex2 = function () {
            $scope.User.register.sex.man = false;
            $scope.User.register.sex.woman = true;
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
        $scope.User.register.startTime = function () {
            $scope.User.register.max_time -= 1;
            $scope.User.register.codeBtn = "重新发送" + $scope.User.register.max_time;
            $scope.$apply();
        }

        // 结束计时，还原文字
        $scope.User.register.endTime = function () {
            $scope.User.register.codeSwitch = false;
            $scope.User.register.codeCls = false;
            $scope.User.register.codeBtn = '获取验证码';
            clearInterval($scope.User.register.timer);
            $scope.$apply();
        }

        // 获取验证码
        $scope.User.register.getCode = function () {

            if (!validatePhone($scope.User.register.mobile)) return;

            // 发送验证码
            api.sendCodeMsg($scope.User.register.mobile).success(function (data){

                if(data.status != 0){
                    $ionicPopup.alert({title: '短信发送失败，请稍后重试。'});
                    $scope.User.isOk = false;
                    return false;
                }else {
                    $scope.User.isOk = true;
                }
            });

            //计时
            $scope.User.register.codeSwitch = true;
            $scope.User.register.codeCls = true;
            $scope.User.register.max_time = 60;
            $scope.User.register.timer = setInterval($scope.User.register.startTime, 1000);
            setTimeout($scope.User.register.endTime, $scope.User.register.max_time * 1000)

        }

        //注册提交
        $scope.User.register.register = function () {


            if ($scope.User.register.sex.man == false && $scope.User.register.sex.woman == false) {
                $ionicPopup.alert({title: '请选择您的性别'});
                return false;
            }

            if(!ar.trim($scope.User.register.code)){

                $ionicPopup.alert({title: '请填写短信验证码'});
                return false;
            }

            api.validateCode(ar.trim($scope.User.register.code)).success(function(data){
                if(!data.status){
                    $ionicPopup.alert({title: '验证码不正确'});
                    $scope.User.isOk = false;
                    return false;
                }else {
                    $scope.User.isOk = true;
                }
            })

            if(!$scope.User.isOk){
                return false;
            }

            $scope.User.register.formData = {'sex': $scope.User.register.sex, 'mobile': $scope.User.register.mobile}; //组装表单数据

            var result = api.save('/wap/user/register', $scope.User.register.formData);
            result.success(function (data) {
                if (data.status) {
                    var m = $scope.User.register.mobile;
                    ar.cookieUser($scope.User.register.mobile, m.substring(m.length-6));
                    window.location.href = '/wap/site/index';
                }
            }).error(function () {
                $ionicPopup.alert({title: '网络连接错误，请重试'});
            })

        }

    }])

    // 登录
    module.controller("login", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.User = {login: {}};

        // 设定页面高度为屏幕高度
        $scope.User.login.winHeight = {
            "height": document.documentElement.clientHeight + 'px'
        }


        $scope.User.login.login = function(){

            if(!$scope.User.login.validateFrom()) return;

            api.save('/wap/user/login',$scope.User.login).success(function(data){

                if(data.status){
                    ar.cookieUser($scope.User.login.username,$scope.User.login.password);  //存入cookie
                    window.location.href = '/wap/site';
                }else {
                    $ionicPopup.alert({title: '用户名或者密码错误'});
                }

            })

        }

        $scope.User.login.validateFrom = function(){

            if(!$scope.User.login.username){
                $ionicPopup.alert({title: '请输入您的手机号码或ID'});
                return false;
            }

            if(!$scope.User.login.password){
                $ionicPopup.alert({title: '请输入您的密码'});
                return false;
            }

            return true;
        }


    }])

    //找回密码
    module.controller("forgetpass", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {




    }])

    return module;
})


