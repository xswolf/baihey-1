/**
 * Created by NSK. on 2016/7/13/0013.
 */
var bhyFunc = {
    user_id: $('#user_id').val() ? $('#user_id').val() : 0,
    ajaxRequest: function (url, param, success, type) {
        var _type = type ? type : 'POST';
        $.ajax({
            type: _type,
            url: url,
            data: param,
            dataType: "json",
            success: success,
            beforeSend: function () {
                App.blockUI($('body'));
            },
            complete: function () {
                App.unblockUI($('body'));
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('请求失败,错误原因：' + XMLHttpRequest.responseText);
                layer.closeAll();
            }
        })
    },
    sendMsg: function () {  // 发站内信
        var content = $('#msg_content');
        if (!$.trim(content.val())) {
            layer.tips('请填写信息内容', content);
            return false;
        }
        this.ajaxRequest('url', {
            user_id: this.user_id,
            content: content.val()
        }, function (res) {
            if (res.status == 1) {
                layer.msg('发送成功！');
            } else {
                layer.msg('发送失败，请重试！');
            }
            this.layerClickedCancelButton('page');
        })
    },
    reviewYes: function (type) {
        if (type == 1) {  // 身份证
            layer.open({
                type: 1,
                skin: 'layui-layer-demo', //样式类名
                closeBtn: 0, //不显示关闭按钮
                shift: 2,
                title: '审核',
                area: ['500px', '400px'],
                shadeClose: false, //开启遮罩关闭
                content: $('#layer_review')
            });
        }
        if (type == 2) {  // 婚姻证明
            this.ajaxRequest('url', {user_id: this.user_id, type: type}, function (res) {
                if (res.status == 1) {
                    $('.marrInfo').hide();
                    $('.marrSuccess').show()
                } else {
                    layer.msg('审核出错，请刷新重试！');
                }
            })
        }
        if (type == 3) {  // 学历证明
            this.ajaxRequest('url', {user_id: this.user_id, type: type}, function (res) {
                if (res.status == 1) {
                    $('.eduInfo').hide();
                    $('.eduSuccess').show()
                } else {
                    layer.msg('审核出错，请刷新重试！');
                }
            })
        }
        if (type == 4) {  // 房产证明
            this.ajaxRequest('url', {user_id: this.user_id, type: type}, function (res) {
                if (res.status == 1) {
                    $('.houseInfo').hide();
                    $('.houseSuccess').show()
                } else {
                    layer.msg('审核出错，请刷新重试！');
                }
            })
        }
    },
    reviewNo: function (type) {
        if (type == 1) {   // 审核身份证不通过
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '图片模糊不清',
                title: '请填写审核不通过原因'
            }, function (value, index, elem) {
                cause = value ? value : '图片模糊不清';
                this.ajaxRequest('url', {user_id: this.user_id, type: type, cause: cause}, function (res) {
                    if (res.status == 1) {
                        $('.idCardInfo').hide();
                        $('.idCardSuccess').hide();
                    } else {
                        layer.msg('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
        if (type == 2) {   // 婚姻证
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '图片模糊不清',
                title: '请填写审核不通过原因'
            }, function (value, index, elem) {
                cause = value ? value : '图片模糊不清';
                this.ajaxRequest('url', {user_id: this.user_id, type: type, cause: cause}, function (res) {
                    if (res.status == 1) {
                        $('.marrInfo').hide();
                        $('.marrSuccess').hide();
                    } else {
                        layer.msg('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
        if (type == 3) {   // 学历证
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '图片模糊不清',
                title: '请填写审核不通过原因'
            }, function (value, index, elem) {
                cause = value ? value : '图片模糊不清';
                this.ajaxRequest('url', {user_id: this.user_id, type: type, cause: cause}, function (res) {
                    if (res.status == 1) {
                        $('.eduInfo').hide();
                        $('.eduSuccess').hide();
                    } else {
                        layer.msg('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
        if (type == 4) {   // 房产证
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '图片模糊不清',
                title: '请填写审核不通过原因'
            }, function (value, index, elem) {
                cause = value ? value : '图片模糊不清';
                this.ajaxRequest('url', {user_id: this.user_id, type: type, cause: cause}, function (res) {
                    if (res.status == 1) {
                        $('.houseInfo').hide();
                        $('.houseSuccess').hide();
                    } else {
                        layer.msg('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
    },
    reviewIsOk: function () {  // 身份证审核通过
        var matchmaking = $('#matchmaking');
        if (!matchmaking.val()) {
            layer.tips('请选择服务红娘', matchmaking);
            return false;
        }
        this.ajaxRequest('url', {
            user_id: this.user_id,
            matchmaking: matchmaking.val(),
            service_status: $('#service_status').val(),
            is_sign: $('#is_sign').val()
        }, function (res) {
            if (res.status == 1) {
                $('.idCardInfo').hide();
                $('.idCardSuccess').show();
                setTimeout(function () {
                    layer.confirm('是否现在为该会员充值/开通服务吗？', {icon: 3, title: '提示'}, function (index) {
                        alert('需要');
                        layer.close(index);
                    });
                }, 1000)
            } else {
                layer.msg('审核出错，请刷新重试！');
            }
            this.layerClickedCancelButton('page');
        })
    },
    resetPass: function () {  // 重置密码
        layer.confirm('确定重置该用户密码吗？', {icon: 3, title:'提示'}, function(index){
            bhyFunc.ajaxRequest('url',{user_id:bhyFunc.user_id},function(res){
                if(res.status == 1){
                    layer.msg('重置密码成功！');
                }else{
                    layer.msg('重置失败，请刷新重试！')
                }
                layer.close(index);
            })
        });
    },
    closeUserInfo:function(a){   // 关闭用户资料
        var isShow = $(a).data('isshow');
        var status = $('#status').data('status');
        if(status != 1){
            layer.alert('操作失败！该会员不是已审核状态。');
            return false;
        }
        if(isShow){
            layer.confirm('关闭资料后，该用户无法在前台展示，您确定吗？', {icon: 3, title:'提示'}, function(index){
                bhyFunc.ajaxRequest('url',{user_id:bhyFunc.user_id,is_show:!isShow},function(res){
                    if(res.status == 1){
                        layer.msg('关闭资料成功！');
                        $('#closeUserInfoBtnTitle').text('开放资料');
                        $('#status_icon').removeClass('text-green').addClass('text-warning');
                        $('#status').text('关闭资料');
                    }else{
                        layer.msg('关闭资料失败，请刷新重试！')
                    }
                    layer.close(index);
                })
            });
        }else {
            this.ajaxRequest('url',{user_id:this.user_id,is_show:!isShow},function(res){
                if(res.status == 1){
                    layer.msg('开放资料成功！');
                    $('#closeUserInfoBtnTitle').text('关闭资料');
                    $('#status_icon').removeClass('text-green').addClass('text-warning');
                    $('#status').text('已审核');
                }else{
                    layer.msg('开放资料失败，请刷新重试！')
                }
            })
        }

    },
    addBlacklist:function(){
        var t = $('#userBlackList').text();
        if(t == '列入黑名单'){
            layer.confirm('列入黑名单后，该用户无法登录，您确定吗？', {icon: 3, title:'提示'}, function(index){
                bhyFunc.ajaxRequest('url',{user_id:bhyFunc.user_id,black:true},function(res){
                    if(res.status == 1){
                        layer.msg('列入黑名单成功！');
                        $('#userBlackList').text('解除黑名单');
                    }else{
                        layer.msg('列入黑名单失败!');
                    }
                })
                layer.close(index);
            });
        }else {
            this.ajaxRequest('url',{user_id:this.user_id,black:false},function(res){
                if(res.status == 1){
                    layer.msg('解除黑名单成功！');
                    $('#userBlackList').text('列入黑名单');
                }else{
                    layer.msg('解除黑名单失败!');
                }
            })
        }
    },
    selectedGoods:function(select){
        if(select.value && select.value != 8){   // 开通服务
            $('.discount').show();
            if($('#discount').prop('checked')){
                $('.charge_money').show();
            }
        }else{
            $('.discount').hide();
            $('.charge_money').hide();
        }
    },
    checkedDiscount:function(checkbox){
        if(checkbox.checked){
            $('.charge_money').show();
        }else{
            $('.charge_money').hide();
        }
    },
    charge:function(){
        this.layerClickedCancelButton('page');
        layer.open({
            type: 1,
            skin: 'layui-layer-demo',
            closeBtn: 1,
            shift: 2,
            title: '订单信息',
            area: ['500px', '450px'],
            shadeClose: false,
            content: '<div class="col-sm-12"><h5>请您确认以下订单信息</h5></div><div class="col-sm-12"><dl class="dl-horizontal fs14"><dt>订单号：</dt><dd>1651614984</dd><dt>充值用户：</dt><dd>张三</dd><dt>充值产品：</dt><dd>VIP会员（一个月）</dd><dt>金额：</dt><dd>86.00元</dd><dt>创建时间：</dt><dd>2016-07-14 11:01:25</dd></dl></div>'
        });
        return;
        var charge_goods = $('#charge_goods');
        var discount     = $('#discount');
        var charge_money = $('#charge_money');
        if(!charge_goods.val()){
            layer.tips('请选择充值产品',charge_goods);
            return false;
        }
        if(charge_goods.val() && charge_goods.val() != 8){    // 开通服务
            if(discount.prop('checked')){   // 打折
                if(!charge_money.val()){
                    layer.tips('折后金额不合法，金额最少0.01元，最多20000元。')
                    return false;
                }
                // 创建订单
                this.ajaxRequest('url',{goods_id:charge_goods.val(),money:charge_money.val()},function(res){
                    if(res.status == 1){

                    }
                })
            }

        }else{

        }
    },
    layerClickedCancelButton: function (type) {  // 关闭相应类型的layer弹出窗口
        layer.closeAll(type);
    },

};