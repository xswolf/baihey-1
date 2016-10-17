$(function () {
    $(".row .col-xs-3 img").each(function (index,ele) {
        $(this).click(function (e) {
            e.stopPropagation();
            $(".show_pic_bg").show();
            $(".show_pic_box").show();
            $(".big_pic>img").attr('src', $(this).attr('src'));
            $(".big_pic .pic_describe").text($(this).data('describe'));
            $(".next_btn").data('index',$(this).data('index') + 1);
        });
    });
    $(document).bind('click',function(e){
        var target =$(e.target);
        if(target.closest(".next_btn").length == 0){
            $(".show_pic_box").hide();
            $(".show_pic_bg").hide();
        }
    })
    $(".next_btn").click(function(){
        var idx = $(this).data('index');
        if(idx == 13){
            idx = 1;
        }
        $(".big_pic>img").attr('src', $("img[data-index='"+ idx + "']").attr('src'));
        $(".big_pic .pic_describe").text($("img[data-index='"+ idx + "']").data('describe'));
        $(".next_btn").data('index',idx + 1);
    })
});