/**
 * Created by NSK. on 2016/7/13/0013.
 */
var bhyFunc = {
    ajaxRequest:function(url,param,success,type){
        var _type = type ? type : 'POST';
        $.ajax({
            type: _type,
            url:url,
            data:param,
            dataType:"json",
            success:success,
            beforeSend:function(){
                App.blockUI($('body'));
            },
            complete:function(){
                App.unblockUI($('body'));
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                alert('请求失败,错误原因：'+XMLHttpRequest.responseText);
            }
        })
    },
    sendMsg:function(){  // 发站内信

    },
    reviewYes:function(type){
        if(type == 1){  // 身份证
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
        if(type == 2){  // 婚姻证明
            bhyFunc.ajaxRequest('url',{user_id:1,type:2},function(res){
                if(res.status == 1){
                    $('.marrInfo').hide();
                    $('.marrSuccess').show()
                }else{
                    alert('审核出错，请刷新重试！');
                }
            })
        }
        if(type == 3){  // 学历证明
            bhyFunc.ajaxRequest('url',{user_id:1,type:3},function(res){
                if(res.status == 1){
                    $('.eduInfo').hide();
                    $('.eduSuccess').show()
                }else{
                    alert('审核出错，请刷新重试！');
                }
            })
        }
        if(type == 4){  // 房产证明
            bhyFunc.ajaxRequest('url',{user_id:1,type:4},function(res){
                if(res.status == 1){
                    $('.houseInfo').hide();
                    $('.houseSuccess').show()
                }else{
                    alert('审核出错，请刷新重试！');
                }
            })
        }
    },
    reviewNo:function(type){
        if(type == 1){   // 审核身份证不通过
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '图片模糊不清',
                title: '请填写审核不通过原因'
            }, function(value, index, elem){
                cause = value ? value : '图片模糊不清';
                bhyFunc.ajaxRequest('url',{user_id:1,type:1,cause:cause},function(res){
                    if(res.status == 1){
                        $('.idCardInfo').hide();
                        $('.idCardSuccess').hide();
                    }else{
                        alert('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
        if(type == 2){   // 婚姻证
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '图片模糊不清',
                title: '请填写审核不通过原因'
            }, function(value, index, elem){
                cause = value ? value : '图片模糊不清';
                bhyFunc.ajaxRequest('url',{user_id:1,type:2,cause:cause},function(res){
                    if(res.status == 1){
                        $('.marrInfo').hide();
                        $('.marrSuccess').hide();
                    }else{
                        alert('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
        if(type == 3){   // 学历证
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '图片模糊不清',
                title: '请填写审核不通过原因'
            }, function(value, index, elem){
                cause = value ? value : '图片模糊不清';
                bhyFunc.ajaxRequest('url',{user_id:1,type:3,cause:cause},function(res){
                    if(res.status == 1){
                        $('.eduInfo').hide();
                        $('.eduSuccess').hide();
                    }else{
                        alert('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
        if(type == 4){   // 房产证
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '图片模糊不清',
                title: '请填写审核不通过原因'
            }, function(value, index, elem){
                cause = value ? value : '图片模糊不清';
                bhyFunc.ajaxRequest('url',{user_id:1,type:4,cause:cause},function(res){
                    if(res.status == 1){
                        $('.houseInfo').hide();
                        $('.houseSuccess').hide();
                    }else{
                        alert('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
    },
    reviewIsOk:function(){  // 身份证审核通过
        var matchmaking = $('#matchmaking');
        if(!matchmaking.val()){
            layer.tips('请选择服务红娘', matchmaking);
            return false;
        }
        bhyFunc.ajaxRequest('url',{user_id:1,matchmaking:matchmaking.val(),service_status:$('#service_status').val(),is_sign:$('#is_sign').val()},function(res){
            if(res.status == 1){
                $('.idCardInfo').hide();
                $('.idCardSuccess').show();
                setTimeout(function(){
                    layer.confirm('需要现在为该会员充值/开通服务吗？', {icon: 3, title:'提示'}, function(index){
                        alert('需要');
                        layer.close(index);
                    });
                },1000)
            }else{
                alert('审核出错，请刷新重试！');
            }
            bhyFunc.layerClickedCancelButton('page');
        })
    },

    layerClickedCancelButton:function(type){  // 关闭相应类型的layer弹出窗口
        layer.closeAll(type);
    },

};