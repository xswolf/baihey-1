/**
 * Created by Administrator on 2016/3/22.
 */

define(['angular','app/module','app/directive/directiveApi'
,'app/service/serviceApi'
], function (angular,module,directiveApi,service) {

    module.controller("modal" , ['app.serviceApi','$scope',function (api,$scope ) {

           /* $('.getCode').click(function () {
                if (!ar.validateMobile($('.mobile').val())) {
                    $('#bhy-alert').modal();
                    return false;
                }
                $('.getCode').addClass('dslb').prop('disabled', true);
                max_time = 60;
                tick_timer = setInterval(function () {
                    btn_tick();
                }, 1000);
                setTimeout(function () {
                    $('.getCode').prop('disabled', false).removeClass('dslb');
                    end_tick();
                }, max_time * 1000);
            })

        function btn_tick() {
            max_time -= 1;
            $('.getCode').val("重新发送" + max_time);
        }

        function end_tick() {
            $('.getCode').val("获取验证码");
            clearInterval(tick_timer);
        }*/

    }])


    return module;
})