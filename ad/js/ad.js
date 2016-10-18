$(function () {
    $(".row .col-xs-3 img").each(function (index, ele) {
        $(this).click(function (e) {
            e.stopPropagation();
            $(".show_pic_bg").show();
            $(".show_pic_box").show();
            $(".big_pic>img").attr('src', $(this).attr('src'));
            $(".big_pic .pic_describe").text($(this).data('describe'));
            $(".next_btn").data('index', $(this).data('index') + 1);
        });
    });
    $(document).click(function (e) {
        var target = $(e.target);
        if (target.closest(".next_btn").length == 0) {
            $(".show_pic_box").hide();
            $(".show_pic_bg").hide();
        }
    })
    $(".next_btn").click(function () {
        var idx = $(this).data('index');
        if (idx == 13) {
            idx = 1;
        }
        $(".big_pic>img").attr('src', $("img[data-index='" + idx + "']").attr('src'));
        $(".big_pic .pic_describe").text($("img[data-index='" + idx + "']").data('describe'));
        $(".next_btn").data('index', idx + 1);
    })

    function validateForm(){
        if (!$("#phone").val()) {
            alert("请输入手机号码！");
            return false;
        }

        if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test($.trim($("#phone").val())))) {
            alert("手机号码格式不正确！");
            return false;
        }
        return true;
    }
    $(".getCode").click(function () {

        validateForm();

        $.ajax({
            type: "GET",
            url: "/wap/user/mobile-is-exist",
            data: {mobile: $.trim($("#phone").val())},
            success: function (res) {
                if (res.status < 1) {
                    alert("该手机号已经存在！如需登录请关注微信公众号“嘉瑞百合缘”！");
                    return;
                } else {
                    $.get("/wap/user/send-code-msg", {mobile: $.trim($("#phone").val())}, function (res) {
                        if (res.status < 1) {
                            alert("发送短信验证码失败，请重试！");
                            return;
                        } else {
                            $(".getCode").addClass('disabd').prop('disabled', true);
                            var max = 60;
                            var int = setInterval(function(){
                                max--;
                                $(".getCode").html(max + " 秒重新获取");
                                if(max == 0){
                                    $(".getCode").prop('disabled',false).removeClass('disabd').html("点击获取验证码");
                                    clearInterval(int);
                                }
                            }, 1000);
                        }
                    })
                }
            }
        });
    })

    $("#regSubmit").click(function(){

        validateForm();

        $.ajax({
            type: "GET",
            url: "/wap/user/mobile-is-exist",
            data: {mobile: $.trim($("#phone").val())},
            success: function (res) {
                if (res.status < 1) {
                    alert("该手机号已经存在！如需登录请关注微信公众号“嘉瑞百合缘”！");
                    return;
                } else {
                    $.get("/wap/user/validate-code", {code: $.trim($("#code").val())}, function (res) {
                        if (!res.status) {
                            alert("短信验证码错误！");
                            return;
                        } else {
                            // 注册
                            $.ajax({
                                type: "POST",
                                url: "/wap/user/register",
                                data: {mobile: $.trim($("#phone").val())},
                                beforeSend:function(){
                                    $("#regSubmit").addClass('disabd').prop('disabled',true).html("注册中，请稍候...");
                                },
                                success: function (data) {
                                    if (data.status == 1) {
                                        alert("恭喜您注册成功！" + "\n" + "您的初始密码为："+$.trim($("#phone").val()).substring($.trim($("#phone").val()).length, $.trim($("#phone").val()).length - 6)+"（手机号后六位）。")
                                    }
                                },
                                error:function(){
                                    alert("网络错误，请刷新重试！");
                                    $("#regSubmit").removeClass('disabd').prop('disabled',false).html("立即注册，开启幸福之旅");
                                },
                                complete:function(){
                                    $("#regSubmit").removeClass('disabd').prop('disabled',false).html("立即注册，开启幸福之旅");
                                }
                            });
                        }
                    })
                }
            }
        });
    })
});