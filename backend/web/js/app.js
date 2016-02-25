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

})