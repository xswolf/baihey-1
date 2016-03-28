/**
 * Created by Administrator on 2016/3/22.
 */

define(['jquery','angular','app/module','app/directive/directiveApi'
,'app/service/serviceApi'
], function ($,angular,module) {
    module.controller("login" , ['app.serviceApi','$scope',function (api,$scope ) {

        //设定页面高度为屏幕高度
        $scope.winHeight = {
            'height': document.documentElement.clientHeight+ 'px'
        }

        //获取验证码
        $scope.getCode = function(){

             if(!ar.validateMobile($scope.mobile)){   //验证手机号码格式
                 $('#bhy-alert1').modal();
                 return false;
             }

             /*if(!api.getMobileIsExist($scope.mobile)){
                 $('#bhy-alert2').modal();
                 return false;
             }
*/
            //计时
            var btn = $('.getCode');
            max_time = 60;
            var timer = setInterval(function () {
                btn_tick(btn,max_time);
            }, 1000);
            setTimeout(function () {
                //btn.prop('disabled', false).removeClass('dslb');
                $scope.codeSwitch = true;
                console.log($scope.codeSwitch);
                end_tick(btn,timer);
            }, max_time * 1000);


        }

    }])

    return module;
})

function btn_tick(btn) {
    max_time -= 1;
    btn.val("重新发送" + max_time);
}

function end_tick(btn,timerObj) {
    btn.val("获取验证码");
    clearInterval(timerObj);
}
