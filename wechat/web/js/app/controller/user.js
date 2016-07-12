/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    // 注册
    module.controller("User.register", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading','$interval','$location', function (api, $scope, $ionicPopup, $ionicLoading,$interval,$location) {

        $scope.User = {};

        $scope.codeTitle = '获取验证码';

        //如果文档高度大于屏幕高度，使用文档高度。 否则使用屏幕高度
        if (document.body.scrollHeight > document.documentElement.clientHeight) {
            $scope.winHeight = {
                'height': document.body.scrollHeight + 'px'
            }
        } else {
            $scope.winHeight = {
                'height': document.documentElement.clientHeight + 'px'
            }
        }

        $scope.sexToggle = function (sex, event) {
            event.stopPropagation();
            $scope.User.sex = sex;
        }

        // 验证手机号是否存在
        $scope.isExist = function () {
            if ($scope.User.mobile && $scope.User.mobile.length == 11) {
                api.getMobileIsExist($scope.User.mobile).success(function (data) {
                    if (data.status < 1) {
                        ar.saveDataAlert($ionicPopup, data.msg);
                        $scope.User.mobile = '';
                    }
                })
            }
        }
        // 倒计时
        $scope.getCode = function () {
            var timeTitle = 60;
            var timer = $interval(function () {
                $scope.codeTitle = '重新获取(' + timeTitle + ')';
            }, 1000, 60);
            timer.then(function () {
                $scope.codeTitle = '获取验证码';
                $interval.cancel(timer);
            }, function () {
                ar.saveDataAlert($ionicPopup, '倒计时出错');
            }, function () {
                timeTitle -= 1;
            });

            // 发送验证码
            api.sendCodeMsg($scope.User.mobile).success(function (res) {
                if (res.status < 1) {
                    ar.saveDataAlert($ionicPopup, res.msg);
                }
            });
        }

        //注册提交
        $scope.register = function () {
            $ionicLoading.show({template: '注册中...'});
            var result = api.save('/wap/user/register', $scope.User);
            result.success(function (data) {
                $ionicLoading.hide();
                if (data.status == 1) {
                    // 存储userInfo
                    ar.setStorage('userInfo', data.data);
                    //$location.url('/index')
                    top.location.href = '/wap/site/main#/index';
                } else if (data.status == 2) {
                    ar.saveDataAlert($ionicPopup, '验证码错误');
                } else {
                    ar.saveDataAlert($ionicPopup, '注册失败');
                }
            }).error(function () {
                $ionicLoading.hide();
                ar.saveDataAlert($ionicPopup, '网络连接错误，请重试！');
            })

        }

    }])

    // 登录
    module.controller("User.login", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.User = {};

        $scope.login = function () {

            if (!$scope.validateFrom()) return;

            api.save('/wap/user/login', $scope.User).success(function (data) {

                if (data.status) {
                    // 存储userInfo
                    ar.setStorage('userInfo', data.data);
                    top.location.href = '/wap/site/main#/index';
                    //$location.url('/index');
                } else {
                    ar.saveDataAlert($ionicPopup, '用户名或者密码错误');
                }

            }).error(function () {
                ar.saveDataAlert($ionicPopup, '网络连接错误，请重试');
            })

        }

        $scope.validateFrom = function () {

            if (!$scope.User.username) {
                ar.saveDataAlert($ionicPopup, '请输入您的手机号码或ID');
                return false;
            }

            if (!$scope.User.password) {
                ar.saveDataAlert($ionicPopup, '请输入您的密码');
                return false;
            }
            return true;
        }

    }])

    //找回密码
    module.controller("User.forgetpass", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.User = {}

        $scope.User.codeBtn = '获取验证码';

        // 发送验证码
        $scope.User.getCode = function () {


            //计时
            $scope.User.codeSwitch = true;
            $scope.User.codeCls = true;
            $scope.User.max_time = 60;
            $scope.User.timer = setInterval($scope.User.startTime, 1000);
            setTimeout($scope.User.endTime, $scope.User.max_time * 1000);

            if (!ar.validateMobile($scope.User.mobile)) {  // 验证手机格式
                ar.saveDataAlert($ionicPopup, '手机号码格式不正确');
                return false;
            }

            api.sendCodeMsg($scope.User.mobile).success(function (data) {
                if (!data.status) {
                    ar.saveDataAlert($ionicPopup, '短信发送失败，请稍后重试。');
                    return false;
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

        $scope.User.next = function () {

            //TODO
            // 查询手机号是否存在，如不存在自动注册
            window.location.href = '/wap/user/setpass?mobile=' + $scope.User.mobile;
            //比对验证码是否正确
            api.validateCode($scope.User.code).success(function (data) {
                if (data.status) {   //验证成功则跳转设置新密码页
                    window.location.href = '/wap/user/setpass?mobile=' + $scope.User.mobile;
                } else {
                    ar.saveDataAlert($ionicPopup, '验证码不正确');
                    return false;
                }
            });
        }


    }])

    //设置新密码
    module.controller("User.setpass", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.User = {};

        $scope.mobile = ar.getQueryString('mobile');


        //设置新密码
        $scope.User.setpass = function () {

            if (!ar.validatePass($scope.User.password)) {
                ar.saveDataAlert($ionicPopup, '密码不能少于6位字符');
                return false;
            }

            if ($scope.User.password != $scope.User.repassword) {
                ar.saveDataAlert($ionicPopup, '两次输入的密码不一致');
                return false;
            }

            var formData = [];
            formData.password = $scope.User.password;
            formData.phone = $scope.mobile;
            api.save('/wap/user/forgot-password', formData).success(function (data) {
                if (data.status) {
                    //提交成功
                    window.location.href = '/wap/user/login'

                } else {
                    ar.saveDataAlert($ionicPopup, '设置密码失败');
                }
            }).error(function () {
                ar.saveDataAlert($ionicPopup, '网络错误，请稍候再试');
            });

        }

    }])

    return module;
})


