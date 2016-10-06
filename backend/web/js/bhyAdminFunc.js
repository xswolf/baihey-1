/**
 * Created by NSK. on 2016/7/13/0013.
 */
var bhyFunc = {
    user_id: $('#user_id').val() ? $('#user_id').val() : 0,
    ajaxRequest: function (url, param, success, type, async) {
        var _type = type ? type : 'POST';
        $.ajax({
            type: _type,
            url: url,
            data: param,
            dataType: "json",
            async: async == null || async == undefined ? true : async,
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
        this.ajaxRequest('/admin/member/sys-msg',
            {
                user_id: this.user_id,
                content: content.val()
            }, function (res) {
                if (res.status == 1) {
                    layer.msg('发送成功！');
                } else {
                    layer.msg('发送失败，请重试！');
                }
                bhyFunc.layerClickedCancelButton('page');
            })
    },
    reviewYes: function (type) {
        if (type == 1) {  // 身份证
            layer.confirm('确认审核通过吗？', {icon: 3, title:'提示'}, function(index){
                bhyFunc.ajaxRequest('/admin/member/auth', {
                    user_id: bhyFunc.user_id,
                    honesty_value: 1
                }, function (res) {
                    if (res.status == 1) {
                        $('.idCardInfo').hide();
                        $('.idCardSuccess').removeClass('hide')
                    } else {
                        layer.msg('审核出错，请刷新重试！');
                    }
                })
                layer.close(index);
            });
        }
        if (type == 5) {  // 婚姻证明
            this.ajaxRequest('/admin/member/auth', {user_id: this.user_id, honesty_value: 2}, function (res) {
                if (res.status == 1) {
                    $('.info' + 5).hide();
                    $('.id-toggle' + 5).removeClass('hide');
                } else {
                    layer.msg('审核出错，请刷新重试！');
                }
            })
        }
        if (type == 4) {  // 学历证明
            this.ajaxRequest('/admin/member/auth', {user_id: this.user_id, honesty_value: 4}, function (res) {
                if (res.status == 1) {
                    $('.info' + 4).hide();
                    $('.id-toggle' + 4).removeClass('hide');
                } else {
                    layer.msg('审核出错，请刷新重试！');
                }
            })
        }
        if (type == 6) {  // 房产证明
            this.ajaxRequest('/admin/member/auth', {user_id: this.user_id, honesty_value: 8}, function (res) {
                if (res.status == 1) {
                    $('.info' + 6).hide();
                    $('.id-toggle' + 6).removeClass('hide');
                } else {
                    layer.msg('审核出错，请刷新重试！');
                }
            })
        }
    },
    reviewNo: function (type) {
        var $this = this;
        if (type == 1) {   // 审核身份证不通过
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '您好，您上传的身份证照片未审核通过，原因：图片模糊不清。',
                title: '请填写原因'
            }, function (value, index, elem) {
                cause = value ? value : '您好，您上传的身份证照片未审核通过，原因：图片模糊不清。';
                $this.ajaxRequest('/admin/member/sys-msg', {
                    user_id: $this.user_id,
                    type: '2,3',
                    content: cause
                }, function (res) {
                    if (res.status == 1) {
                        $('.identify-auth').hide();
                    } else {
                        layer.msg('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
        if (type == 5) {   // 婚姻证
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '您好，您上传的婚姻证明照片未审核通过，原因：图片模糊不清。',
                title: '请填写原因'
            }, function (value, index, elem) {
                cause = value ? value : '您好，您上传的婚姻证明照片未审核通过，原因：图片模糊不清。';
                $this.ajaxRequest('/admin/member/sys-msg', {
                    user_id: $this.user_id,
                    type: '5',
                    content: cause
                }, function (res) {
                    if (res.status == 1) {
                        $('.identify-auth-' + type).hide();
                    } else {
                        layer.msg('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
        if (type == 4) {   // 学历证
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '您好，您上传的学历证明照片未审核通过，原因：图片模糊不清。',
                title: '请填写审核不通过原因'
            }, function (value, index, elem) {
                cause = value ? value : '您好，您上传的学历证明照片未审核通过，原因：图片模糊不清。';
                $this.ajaxRequest('/admin/member/sys-msg', {
                    user_id: $this.user_id,
                    type: '4',
                    content: cause
                }, function (res) {
                    if (res.status == 1) {
                        $('.identify-auth-' + type).hide();
                    } else {
                        layer.msg('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
        if (type == 6) {   // 房产证
            var cause = '';
            layer.prompt({
                formType: 2,
                value: '您好，您上传的房产证明照片未审核通过，原因：图片模糊不清。',
                title: '请填写审核不通过原因'
            }, function (value, index, elem) {
                cause = value ? value : '您好，您上传的房产证明照片未审核通过，原因：图片模糊不清。';
                $this.ajaxRequest('/admin/member/sys-msg', {
                    user_id: $this.user_id,
                    type: '6',
                    content: cause
                }, function (res) {
                    if (res.status == 1) {
                        $('.identify-auth-' + type).hide();
                    } else {
                        layer.msg('审核出错，请刷新重试！');
                    }
                    layer.close(index);
                })
            });
        }
    },
    reviewIsOk: function (user_id) {  // 分配服务红娘
        var matchmaking = $('#matchmaking');
        if (!matchmaking.val()) {
            layer.tips('请选择服务红娘', matchmaking);
            return false;
        }
        this.ajaxRequest('/admin/member/assign-matchmaking', {
            user_id: user_id,
            matchmaking: matchmaking.val(),
            service_status: $('#service_status').val(),
        }, function (res) {
            bhyFunc.layerClickedCancelButton('page');
            if (res.status == 1) {
                layer.msg('分配成功');
            } else {
                layer.msg('分配失败，请刷新重试！');
            }
        })
    },
    resetPass: function (user_id) {  // 重置密码
        layer.confirm('确定重置该用户密码吗？', {icon: 3, title: '提示'}, function (index) {
            bhyFunc.ajaxRequest('/admin/member/switch', {user_id: bhyFunc.user_id, field: 'password'}, function (res) {
                if (res.status == 1) {
                    layer.msg('重置密码成功！');
                } else {
                    layer.msg('重置失败，请刷新重试！')
                }
                layer.close(index);
            })
        });
    },
    isShow: $('#is-show').data('isshow'),
    closeUserInfo: function (a, user_id) {   // 开关用户资料
        var isShow = this.isShow;
        var status = $('#status').data('status');
        if (status != 2) {
            layer.alert('操作失败！该会员不是已审核状态。');
            return false;
        }
        if (isShow) {
            var confirm = '关闭资料后，该用户无法在前台展示，您确定吗？';
            var cui_txt = '开放资料';
            var stat_txt = '关闭资料';
        } else {
            var confirm = '开放资料，该用户会在前台展示，您确定吗？';
            var cui_txt = '关闭资料';
            var stat_txt = '已审核';
        }

        layer.confirm(confirm, {icon: 3, title: '提示'}, function (index) {
            bhyFunc.ajaxRequest('/admin/member/switch', {
                user_id: bhyFunc.user_id,
                is_show: !isShow,
                field: 'is_show'
            }, function (res) {
                if (res.status == 1) {
                    layer.msg('操作成功！');
                    bhyFunc.isShow = !isShow;
                    $('#closeUserInfoBtnTitle').text(cui_txt);
                    $('#status_icon').removeClass('text-green').addClass('text-warning');
                    $('#status').text(stat_txt);
                } else {
                    layer.msg('关闭资料失败，请刷新重试！')
                }
                layer.close(index);
            })
        });

    },
    addBlacklist: function (user_id) {
        var t = $('#userBlackList').text();
        if (t == '列入黑名单') {
            layer.confirm('列入黑名单后，该用户无法登录，您确定吗？', {icon: 3, title: '提示'}, function (index) {
                bhyFunc.ajaxRequest('/admin/member/switch', {
                    user_id: bhyFunc.user_id,
                    status: 3,
                    field: 'status'
                }, function (res) {
                    if (res.status == 1) {
                        layer.msg('列入黑名单成功！');
                        $('#userBlackList').text('解除黑名单');
                    } else {
                        layer.msg('列入黑名单失败!');
                    }
                })
                layer.close(index);
            });
        } else {
            bhyFunc.ajaxRequest('/admin/member/switch', {
                user_id: bhyFunc.user_id,
                status: 1,
                field: 'status'
            }, function (res) {
                if (res.status == 1) {
                    layer.msg('解除黑名单成功！');
                    $('#userBlackList').text('列入黑名单');
                } else {
                    layer.msg('解除黑名单失败!');
                }
            })
        }
    },
    selectedGoods: function (select) {
        if (select.value && select.value != 8) {   // 开通服务
            $('.discount').show();
            $('.money').hide();
            if ($('#discount').prop('checked')) {
                $('.charge_money').show();
            }
        } else {
            $('.discount').hide();
            $('.charge_money').hide();
            $('.money').hide();
        }
        if (select.value == 8) {
            $('.money').show();
        }
    },
    checkedDiscount: function (checkbox) {
        if (checkbox.checked) {
            $('.charge_money').show();
        } else {
            $('.charge_money').hide();
        }
    },
    charge: function (userId) {
        if (!userId) {
            userId = this.user_id;
        }
        var charge_goods = $('#charge_goods');
        var discount = $('#discount');
        var charge_money = $('#charge_money');
        if (!charge_goods.val()) {
            layer.tips('请选择充值产品', charge_goods);
            return false;
        }
        if (charge_goods.val() && charge_goods.val() != 8) {    // 开通服务
            if (discount.prop('checked')) {   // 打折
                if (!charge_money.val()) {
                    layer.tips('折后金额不合法，金额最少0.01元，最多20000元。')
                    return false;
                }
                // 自定义金额充值
                this.ajaxRequest('/admin/member/charge', {
                    user_id: userId,
                    goodsId: charge_goods.val(),
                    money: charge_money.val(),
                    chargeTypeId: 3
                }, function (res) {
                    if (res.status) {
                        layer.msg('充值成功！');
                        top.location.reload();
                    } else {
                        layer.msg('充值失败！');
                    }
                })
            } else {
                this.ajaxRequest('/admin/member/charge', {
                    user_id: userId,
                    goodsId: charge_goods.val(),
                    chargeTypeId: 3
                }, function (res) {
                    if (res.status) {
                        layer.msg('充值成功！');
                        top.location.reload();
                    } else {
                        layer.msg('充值失败！');
                    }
                })
            }
        } else {  // 嘉瑞账户充值
            if (!$('#money').val()) {
                layer.tips('充值金额不合法', $('#money'));
                return false;
            }
            this.ajaxRequest('/admin/member/charge', {
                user_id: userId,
                goodsId: charge_goods.val(),
                money: $('#money').val(),
                chargeTypeId: 3
            }, function (res) {
                if (res.status) {
                    layer.msg('充值成功！');
                    top.location.reload();
                } else {
                    layer.msg('充值失败！');
                }
            })
        }
    },
    getJsonShowImg: function (type, imgList) {
        if (type == 'discovery') {
            //$.getJSON('url',{user_id,this.user_id}, function(res){
            //    layer.photos({
            //        photos: res
            //    });
            //});

            for (var i in imgList) {
                imgList[i].src = imgList[i].thumb_path.replace("thumb", "picture");
                imgList[i].thumb = imgList[i].thumb_path;
            }
            // 数据格式
            var imgList = {
                "title": "", //相册标题
                "id": 1, //相册id
                "start": 0, //初始显示的图片序号，默认0
                data: imgList
            }
            layer.photos({
                photos: imgList
            });
        }

        if (type == 'message') {

            console.log(imgList)

            // 数据格式
            var imgList = {
                "title": "", //相册标题
                "id": 1, //相册id
                "start": 0, //初始显示的图片序号，默认0
                data: [
                    {
                        src: imgList.replace("thumb", "picture"),
                        thumb: imgList,
                    }
                ]
            }
            layer.photos({
                photos: imgList
            });
        }
    },
    deleteItemByList: function (itemId, td, url) {
        console.log(itemId);
        layer.confirm('确定要删除该条记录？', {icon: 3, title: '提示'}, function (index) {
            bhyFunc.ajaxRequest(url, {id: itemId}, function (res) {
                layer.close(index);
                if (res.status == 1) {
                    layer.msg('删除成功！');
                    $(td).parent().parent('tr').remove();
                } else {
                    layer.msg('删除失败！');
                }
            })
        })
    },
    layerClickedCancelButton: function (type) {  // 关闭相应类型的layer弹出窗口
        layer.closeAll(type);
    },
    cityPickerInit: function () {
        var html = "";
        for (var i in provines) {
            html += '<option value="' + provines[i].id + '">' + provines[i].name + '</option>';
        }
        $('#provines').append(html);
    },
    selectedProvines: function (p) {
        var html = '<option value="">城市</option>';
        for (var i in citys) {
            if (citys[i].parentId == $(p).val()) {
                html += '<option value="' + citys[i].id + '">' + citys[i].name + '</option>';
            }
        }
        $('#citys').empty().append(html);
        $('#area').empty().append('<option>区县</option>');
    },
    selectedCitys: function (c) {
        var html = '<option value="">区县</option>';
        for (var i in area) {
            if (area[i].parentId == $(c).val()) {
                html += '<option value="' + area[i].id + '">' + area[i].name + '</option>';
            }
        }
        $('#area').empty().append(html);
    },
    ageLink: function (min) {
        var ageHtml = "",
            ageMin = min,
            ageMax = 99;
        for (ageMin; ageMin <= ageMax; ageMin++) {
            ageHtml += '<option value="';
            ageHtml += ageMin;
            ageHtml += '">';
            ageHtml += ageMin;
            ageHtml += '</option>';
        }
        return ageHtml;
    },
    heightLink: function (min) {
        var ageHtml = "",
            ageMin = min,
            ageMax = 260;
        for (ageMin; ageMin <= ageMax; ageMin++) {
            ageHtml += '<option value="';
            ageHtml += ageMin;
            ageHtml += '">';
            ageHtml += ageMin;
            ageHtml += '厘米以上</option>';
        }
        return ageHtml;
    },
    getUserById: function (input) {   // 根据用户ID获取用户姓名
        if (input.value) {
            var user_id = $.trim(input.value);
            if (user_id) {
                this.ajaxRequest('/admin/member/get-user', {user_id: user_id}, function (res) {
                    var html = "";
                    var userInfo = JSON.parse(res.data.info);
                    var sex = res.data.sex == 1 ? '男' : '女';
                    //console.log(res.data.sex);
                    //console.log(userInfo.real_name);return false;
                    if (res.status > 0) {
                        html += '<p class="text-danger">' + userInfo.real_name + ' ';
                        html += sex + '</p>';
                        $(input).attr('data-ok', 'yes');
                    } else {
                        html += '<p>未找到该会员，请核对会员ID</p>'
                        $(input).attr('data-ok', 'no');
                    }
                    $(input).after(html);
                })
            }
        } else {
            var result = false;
            this.ajaxRequest('/admin/member/get-user', {user_id: input}, function (res) {
                if (res.status > 0) {
                    result = res.data;
                }
            },'post',false)
            return result;
        }

    },
    timesTampToDate: function (timesTamp) {   //将时间戳转为中文日期格式 2016/1/1 上午1:43:02
        var unixTimestamp = new Date(timesTamp * 1000);
        return unixTimestamp.toLocaleString();
    }

};