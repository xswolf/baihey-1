/**
 * Created by Administrator on 2016/3/22.
 */

define(['jquery', 'angular', 'app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function ($, angular, module) {
    module.controller("login", ['app.serviceApi', '$scope', function (api, $scope) {

        //设定页面高度为屏幕高度
        $scope.winHeight = {
            'height': document.documentElement.clientHeight + 'px'
        }

        $scope.selSexO = function (){
            $scope.sexCk = false;
            $scope.sex = 1;
            $scope.$apply();
        }
        $scope.selSexT = function (){
            $scope.sexCk = true;
            $scope.sex = 2;
            $scope.$apply();
        }
        //获取验证码
        $scope.getCode = function () {

            /*if (!ar.validateMobile($scope.mobile)) {   //验证手机号码格式
                $('#bhy-alert1').modal();
                return false;
            }*/
            $scope.codeSwitch = true;
            $scope.$apply();

            /* if (!api.getMobileIsExist($scope.mobile)) { //验证手机是否已存在
                 $('#bhy-alert2').modal();
                 return false;
             }*/

            /*//计时
            var btn = $('.getCode');
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
            $scope.formData = {'sex': $scope.sex, 'mobile': $scope.mobile}; //组装表单数据
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

