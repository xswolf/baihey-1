/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    // 注册
    module.controller("register", ['app.serviceApi', '$scope', '$ionicPopup', '$timeout', function (api, $scope, $ionicPopup, $timeout) {

        $scope.codeBtn = '获取验证码';

        //设定页面高度为屏幕高度
        $scope.winHeight = {
            'height': document.documentElement.clientHeight + 'px'
        }

        $scope.User = {};

        $scope.User.sex = {
            man: false,
            woman: false
        }

        // 男生点击事件
        $scope.selSex1 = function () {
            $scope.User.sex.man = true;
            $scope.User.sex.woman = false;
        }

        // 女生点击事件
        $scope.selSex2 = function () {
            $scope.User.sex.man = false;
            $scope.User.sex.woman = true;
        }

        function validatePhone(phone) {
            if (!ar.validateMobile(phone)) {  // 验证手机格式
                $scope.showAlert('手机号码格式不正确');
                return false;
            }

            if (!api.getMobileIsExist(phone)) { // 验证手机是否已存在
                $scope.showAlert('手机号码已存在');
                return false;
            }
            return true;
        }

        // 开始计时
        $scope.startTime = function () {
            $scope.max_time -= 1;
            $scope.codeBtn = "重新发送" + $scope.max_time;
            $scope.$apply();
        }

        // 结束计时，还原文字
        $scope.endTime = function () {
            $scope.codeSwitch = false;
            $scope.codeCls = false;
            $scope.codeBtn = '获取验证码';
            clearInterval($scope.timer);
            $scope.$apply();
        }

        // 获取验证码
        $scope.getCode = function () {

            console.log(1);

            if (!validatePhone($scope.User.mobile)) return;  // 验证手机号码格式

            //计时
            $scope.codeSwitch = true;
            $scope.codeCls = true;
            $scope.max_time = 60;
            $scope.timer = setInterval($scope.startTime, 1000);
            setTimeout($scope.endTime, $scope.max_time * 1000)

        }

        //注册提交
        $scope.register = function () {

            if (!$scope.User.sex.man && !$scope.User.sex.woman) {
                $scope.showAlert('请选择您的性别');
                return false;
            }

            if (!api.validateCode($scope.code)) {
                $scope.showAlert('验证码不正确');
                return false;
            }

            $scope.formData = {'sex': $scope.User.sex, 'mobile': $scope.User.mobile}; //组装表单数据

            var result = api.save('url', $scope.formData);
            result.success(function (data) {
                if (data.status == 1) {
                    window.location.href = '';
                }
            }).error(function () {
                $scope.showAlert('网络连接错误，请重试。');
            })

        }



        // 弹窗
        $scope.showPopup = function () {
            $scope.data = {}

            $ionicPopup.show({
                templateUrl: 'popup-template.html',
                title: 'Enter Wi-Fi Password',
                subTitle: 'WPA2',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        onTap: function (e) {
                            return true;
                        }
                    },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.data.wifi;
                        }
                    },
                ]
            }).then(function (res) {
                console.log('Tapped!', res);
            }, function (err) {
                console.log('Err:', err);
            }, function (msg) {
                console.log('message:', msg);
            });

            $timeout(function () {
                $ionicPopup.alert({
                    title: 'Unable to connect to network'
                }).then(function (res) {
                    console.log('Your love for ice cream:', res);
                });
            }, 1000);
        };

        $scope.showConfirm = function () {
            $ionicPopup.confirm({
                title: 'Consume Ice Cream',
                content: 'Are you sure you want to eat this ice cream?'
            }).then(function (res) {
                if (res) {
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        };
        $scope.showPrompt = function () {
            $ionicPopup.prompt({
                title: 'ID Check',
                subTitle: 'What is your name?'
            }).then(function (res) {
                console.log('Your name is', res);
            });
        };
        $scope.showPasswordPrompt = function () {
            $ionicPopup.prompt({
                title: 'Password Check',
                subTitle: 'Enter your secret password',
                inputType: 'password',
                inputPlaceholder: 'Your password'
            }).then(function (res) {
                console.log('Your name is', res);
            });
        };
        $scope.showAlert = function (title) {
            $ionicPopup.alert({
                title: title, // String. 弹窗的标题。
                subTitle: '', // String (可选)。弹窗的子标题。
                template: '', // String (可选)。放在弹窗body内的html模板。
                templateUrl: '', // String (可选)。 放在弹窗body内的html模板的URL。
                okText: '确定', // String (默认: 'OK')。OK按钮的文字。
                okType: '', // String (默认: 'button-positive')。OK按钮的类型。
            }).then(function (res) {
                //点击确定后执行
            });
        };




    }])

    // 登录
    module.controller("login", ['app.serviceApi', '$scope', function (api, $scope) {
        // 设定页面高度为屏幕高度
        $scope.winHeight = {
            "height": document.documentElement.clientHeight + 'px'
        }

        require(['jquery'], function ($) {

        })

    }])
    return module;
})


