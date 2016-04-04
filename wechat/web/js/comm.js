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

    'cookieUser': function (userName) {
        if (window.localStorage) {   // 浏览器支持 localStorage
            window.localStorage.setItem("bhy_u_name", userName);
        } else {                     // 浏览器不支持 localStorage  则使用 cookie
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = "bhy_u_name=" + escape(userName) + ";expires=" + exp.toGMTString();
        }
    },

    'trim': function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

};
