/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {


    // 注册
    module.controller("register", ['app.serviceApi', '$scope', function (api, $scope) {
        $scope.codeBtn = '获取验证码';
        //设定页面高度为屏幕高度
        $scope.winHeight = {
            'height': document.documentElement.clientHeight + 'px'
        }
        $scope.sexCk1 = false;
        $scope.sexCk2 = false;

        require(['jquery'], function ($) {

            $scope.User = {};

            // 男生点击事件
            $scope.selSex1 = function () {
                $scope.sexCk2 = false;
                $scope.sexCk1 = true;
                $scope.User.sex = 1;
            }

            // 女生点击事件
            $scope.selSex2 = function () {
                $scope.sexCk1 = false;
                $scope.sexCk2 = true;
                $scope.User.sex = 2;
            }

            function validatePhone(phone) {
                if (!ar.validateMobile(phone)) {  // 验证手机格式
                    $('#bhy-alert1').modal();
                    return false;
                }

                if (!api.getMobileIsExist(phone)) { // 验证手机是否已存在
                    $('#bhy-alert2').modal();
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
                if (!validatePhone($scope.mobile)) return; // 验证手机号码格式

                //计时
                $scope.codeSwitch = true;
                $scope.codeCls = true;
                $scope.max_time = 60;
                $scope.timer = setInterval($scope.startTime, 1000);
                setTimeout($scope.endTime, $scope.max_time * 1000)

            }

            //注册提交
            $scope.register = function () {

                if (!$scope.User.sex) {
                    $('#bhy-alert5').modal();
                    return false;
                }

                if (!api.validateCode($scope.code)) {
                    $('#bhy-alert3').modal();
                    return false;
                }
                $scope.formData = {'sex': $scope.User.sex, 'mobile': $scope.User.mobile}; //组装表单数据

                var result = api.save('url', $scope.formData);
                result.success(function (data) {
                    if (data.status == 1) {
                        window.location.href = '';
                    }
                }).error(function () {
                    $('#bhy-alert4').modal();
                })

            }


        })

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


