/**
 * Created by Administrator on 2016/3/14.
 */
    var ar = {
        'currentDate': function () {
            var myDate = new Date();
            myDate.getYear();        //获取当前年份(2位)
            myDate.getFullYear();    //获取完整的年份(4位,1970-????)
            myDate.getMonth();       //获取当前月份(0-11,0代表1月)
            myDate.getDate();        //获取当前日(1-31)
            myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
            myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
            myDate.getHours();       //获取当前小时数(0-23)
            myDate.getMinutes();     //获取当前分钟数(0-59)
            myDate.getSeconds();     //获取当前秒数(0-59)
            myDate.getMilliseconds();    //获取当前毫秒数(0-999)
            myDate.toLocaleDateString();     //获取当前日期
            //var mytime=myDate.toLocaleTimeString();     //获取当前时间
            return myDate.toLocaleString();        //获取日期与时间
        },

        'timeStamp': function () { // 当前时间戳

            return Date.parse(new Date());
        },

        'validateMobile': function (mobile) {
            var pattern = /^1[34578]\d{9}$/;
            return pattern.test(mobile);
        },
        'bhyModal':{
            'modal':function(title,text){
                var $modal = $('<div class="am-modal am-modal-no-btn" tabindex="-1" id="bhy-modal"><div class="am-modal-dialog"><div class="am-modal-hd">'+title+'<a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a> </div> <div class="am-modal-bd">'+text+'</div> </div> </div>');
                $('body').append($modal);
                $modal.modal();
            },
            'alert':function(text){
                var $modal = $('<div class="am-modal am-modal-alert" tabindex="-1" id="bhy-alert"><div class="am-modal-dialog"><div class="am-modal-bd">'+text+'</div><div class="am-modal-footer"><span class="am-modal-btn">确定</span></div></div></div>');
                $('body').append($modal);
                $modal.modal();
            },
            'confirm':function(){

            }
        }
    };
