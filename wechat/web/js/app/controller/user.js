/**
 * Created by Administrator on 2016/3/22.
 */

define(['jquery', 'angular', 'app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'amezeui', 'comm'
], function ($, angular, module) {
    module.controller("login", ['app.serviceApi', '$scope', function (api, $scope) {

        $scope.codeBtn = '获取验证码';

        //设定页面高度为屏幕高度
        $scope.winHeight = {
            'height': document.documentElement.clientHeight + 'px'
        }

        $scope.User = {};

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

        function validatePhone(phone){
            if (!ar.validateMobile(phone)) {
                $('#bhy-alert1').modal();
                return false;
            }

            if (!api.getMobileIsExist(phone)) { //验证手机是否已存在
                $('#bhy-alert2').modal();
                return false;
            }
            return true;
        }

        $scope.startTime = function() {
            $scope.max_time -= 1;
            $scope.codeBtn = "重新发送" + $scope.max_time;
            $scope.$apply();
        }

        $scope.endTime = function(){
            $scope.codeSwitch = false;
            $scope.codeCls = false;
            $scope.codeBtn = '获取验证码';
            clearInterval($scope.timer);
            $scope.$apply();
        }

        // 获取验证码
        $scope.getCode = function () {
            if (!validatePhone($scope.mobile)) return; //验证手机号码格式
            //计时
            $scope.codeSwitch = true;
            $scope.codeCls = true;
            $scope.max_time = 60;
            $scope.timer = setInterval($scope.startTime,1000);
            setTimeout($scope.endTime,$scope.max_time * 1000)

            /*var btn = $('.getCode');
             btn.prop('disabled', true).addClass('dslb');
             max_time = 60;
             var timer = setInterval(function () {
             btn_tick(btn, max_time);
             }, 1000);
             setTimeout(function () {
             btn.prop('disabled', false).removeClass('dslb');
             end_tick(btn, timer);
             }, max_time * 1000);*/

        }

        $scope.register = function () {
            if (!api.validateCode($scope.code)) {
                $('#bhy-alert3').modal();
                return false;
            }
            $scope.formData = {'sex': $scope.User.sex, 'mobile': $scope.User.mobile}; //组装表单数据
            var result = api.save($scope.formData);
            if (result.status == 1) {  //注册成功
                window.location.href = '';
            } else {                   //注册失败
                $('#bhy-alert4').modal();
                return false;
            }
        }


    }])

    return module;
})

function btn_tick(btn) {
    max_time -= 1;
    btn.val("重新发送" + max_time);
}

function end_tick(btn, timerObj) {
    btn.val("获取验证码");
    clearInterval(timerObj);
}

