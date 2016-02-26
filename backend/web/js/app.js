/**
 * Created by Administrator on 2016/2/22.
 */

$(function(){

    // 图片上传
    $(".file_upload").fileinput({
        showUpload: true,
        showCaption: false,
        uploadUrl:  "/admin/file/upload",
        browseClass: "btn btn-primary btn-sm",
        enctype: 'multipart/form-data',
        fileType: "any",
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        overwriteInitial: false,
        maxFileSize: 1000,
        maxFilesNum: 10,

    });

    $('.file_upload').on('fileuploaded', function(event, file, previewId, index, reader) {

        var input_name = $(this).data('up-name')
        var _input = "<input type='hidden' name='" + input_name + "[]' value='" + file.response.path + "' />";
        $(this).after(_input)

    });


    // 操作提示
    var message_cookie = $.cookie('alert_message');
    if (message_cookie !== null && message_cookie != undefined){
        message_cookie = JSON.parse(message_cookie);
        if (message_cookie != '' && message_cookie != undefined && message_cookie != 'null') {

            var _class = message_cookie.status == 1 ? 'alert-success' : 'alert-danger';
            $("." + _class).text(message_cookie.message).show();
            var success_hide = function () {
                $("." + _class).hide()
            }
            setTimeout(success_hide, 3000);
            $.cookie('alert_message' , null);
        }
    }

    /**
     * 删除提示框
     * Created by Administrator on 2016/2/25.
     */
    $(".btn_del").click(function () {
        var obj = $(this);
        // 四个选项都是可选参数
        Modal.alert(
            {
                msg: '内容',
                title: '标题',
                btnok: '确定',
                btncl: '取消'
            });

        // 如需增加回调函数，后面直接加 .on( function(e){} );
        // 点击“确定” e: true
        // 点击“取消” e: false
        Modal.confirm(
            {
                msg: "是否删除角色？"
            })
            .on(function (e) {
                if (e) {
                    var url = obj.data('url');
                    location.href = url;
                }
            }, "json");
    })
})
