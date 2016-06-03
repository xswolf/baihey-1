/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    module.controller("welcome", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        if (document.body.scrollHeight > document.documentElement.clientHeight) {
            $scope.winHeight = {
                'height': document.body.scrollHeight + 'px'
            }
        } else {
            $scope.winHeight = {
                'height': document.documentElement.clientHeight + 'px'
            }
        }


            // 默认重庆
            var lng = 106.51228345689027;
            var lat = 29.54206567258729;

            if (window.navigator.geolocation) {
                var options = {
                    enableHighAccuracy: true,
                };
                window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
            } else {
                alert("浏览器不支持html5来获取地理位置信息");
            }

            function handleSuccess(position) {
                // 获取到当前位置经纬度  本例中是chrome浏览器取到的是google地图中的经纬度
                lng = position.coords.longitude;
                lat = position.coords.latitude;
            }

            function handleError() {

            }

            api.get('/wap/user/get-location', {lng: lng, lat: lat}).success(function (res) {
                //var data = JSON.parse(res);
                alert(res);
               /* // 存储cookie
                ar.setCookie('bhy_u_cityId',data.result.addressComponent.city.replace('市',''))
                for (var i in citys){
                    if(citys[i].name==data.result.addressComponent.city.replace('市','')){
                        alert(citys[i].id);
                        return;
                    }
                }*/
            });


        $scope.showMain =function(){

        }

        window.onorientationchange = function () {
            switch (window.orientation) {
                case -90:
                case 90:  // 横屏
                    break;
                case 0:
                case 180: //竖屏
                    break;
            }

        }

    }]);
    // 注册
    module.controller("User.register", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.User = {};

        $scope.User.codeBtn = '获取验证码';

        //如果文档高度大于屏幕高度，使用文档高度。 否则使用屏幕高度
        if (document.body.scrollHeight > document.documentElement.clientHeight) {
            $scope.User.winHeight = {
                'height': document.body.scrollHeight + 'px'
            }
        } else {
            $scope.User.winHeight = {
                'height': document.documentElement.clientHeight + 'px'
            }
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

            api.getMobileIsExist(phone).success(function (data) {
                if (!data.status) {
                    $ionicPopup.alert({title: data.msg});
                    return true;
                } else {
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

            //计时
            $scope.User.codeSwitch = true;
            $scope.User.codeCls = true;
            $scope.User.max_time = 60;
            $scope.User.timer = setInterval($scope.User.startTime, 1000);
            setTimeout($scope.User.endTime, $scope.User.max_time * 1000);

            // 发送验证码
            api.sendCodeMsg($scope.User.mobile).success(function (data) {

                if (!data.status) {
                    $ionicPopup.alert({title: '短信发送失败，请稍后重试。'});
                    return false;
                }
            });


        }

        //注册提交
        $scope.User.register = function () {


            if ($scope.User.sex.man == false && $scope.User.sex.woman == false) {
                $ionicPopup.alert({title: '请选择您的性别'});
                return false;
            }

            if (!ar.trim($scope.User.code)) {

                $ionicPopup.alert({title: '请填写正确短信验证码'});
                return false;
            }

            var result = api.save('/wap/user/register', $scope.User);
            result.success(function (data) {
                if (data.status == 1) {
                    // 存储userInfo
                    ar.setStorage('userInfo', data.data);
                    window.location.href = '/wap/site/main#/main/index';
                } else if (data.status == 2) {
                    $ionicPopup.alert({title: '验证码错误'});
                } else {
                    $ionicPopup.alert({title: '注册失败'});
                }
            }).error(function () {
                $ionicPopup.alert({title: '网络连接错误，请重试'});
            })

        }

    }])

    // 登录
    module.controller("User.login", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.User = {};

        //如果文档高度大于屏幕高度，使用文档高度。 否则使用屏幕高度
        if (document.body.scrollHeight > document.documentElement.clientHeight) {
            $scope.User.winHeight = {
                'height': document.body.scrollHeight + 'px'
            }
        } else {

            $scope.User.winHeight = {
                'height': document.documentElement.clientHeight + 'px'
            }
        }

        $scope.User.login = function () {

            if (!$scope.User.validateFrom()) return;

            api.save('/wap/user/login', $scope.User).success(function (data) {

                if (data.status) {
                    // 存储userInfo
                    ar.setStorage('userInfo', data.data);
                    window.location.href = '/wap/site/main#/main/index';
                } else {
                    $ionicPopup.alert({title: '用户名或者密码错误'});
                }

            }).error(function () {
                $ionicPopup.alert({title: '网络连接错误，请重试'});
            })

        }

        $scope.User.validateFrom = function () {

            if (!$scope.User.username) {
                $ionicPopup.alert({title: '请输入您的手机号码或ID'});
                return false;
            }

            if (!$scope.User.password) {
                $ionicPopup.alert({title: '请输入您的密码'});
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
                $ionicPopup.alert({title: '手机号码格式不正确'});
                return false;
            }

            api.sendCodeMsg($scope.User.mobile).success(function (data) {
                if (!data.status) {
                    $ionicPopup.alert({title: '短信发送失败，请稍后重试。'});
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
                    $ionicPopup.alert({title: '验证码不正确'});
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
                $ionicPopup.alert({title: '密码不能少于6位字符'})
                return false;
            }

            if ($scope.User.password != $scope.User.repassword) {
                $ionicPopup.alert({title: '两次输入的密码不一致'});
                return false;
            }

            api.save('url', $scope.User).success(function (data) {
                if (data.status) {
                    //提交成功
                    window.location.href = '/wap/user/login'

                } else {
                    $ionicPopup.alert({title: '设置密码失败'});
                }
            }).error(function () {
                $ionicPopup.alert({title: '网络错误，请稍候再试'});
            });

        }

    }])

    return module;
})


