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

        return Date.parse(new Date()) / 1000;
    },

    'validateMobile': function (mobile) {
        var pattern = /^1[34578]\d{9}$/;
        return pattern.test(mobile);
    },

    'getCookie': function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },

    'delCookie': function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
    },

    'cookieUser': function (userName) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "bhy_u_name=" + escape(userName) + ";expires=" + exp.toGMTString() + ";path=/";
    },

    'trim': function (str) {
        str = str ? str : "";
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    'getQueryString': function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },

    'validatePass': function (pass) {
        var reg = /^\w{6}$/;
        return reg.test(pass);
    },

    'validateMoney': function (money) {
        if (/^\d+(\.\d{1,3})?$/.test(money)) {
            return true;
        } else {
            return false;
        }
    },

    'msg_file_res_img': function (imgFile) {
        var suffixName = imgFile.name.toLowerCase().substr(imgFile.name.lastIndexOf("."));    //后缀名

        if (suffixName == '.jpg' || suffixName == '.png' || suffixName == '.bmp' || suffixName == '.gif' || suffixName == '.jpeg') {
            return true;
        }

        return false;
    },

    // 设置localStorage
    setStorage: function (name, data) {

        if (data instanceof Object) {
            data = JSON.stringify(data);
        }
        if (window.localStorage) {
            localStorage.setItem(name, data);
        } else {
            console.log('浏览器不支持localStorage')
        }
    },

    // 获取localStorage
    getStorage: function (name) {

        if (window.localStorage) {
            var obj = localStorage.getItem(name);
            obj = JSON.parse(obj);
            return obj;
        } else {
            console.log('浏览器不支持localStorage')
        }
    },

    getClass: function (cls) {   // 通过class获取元素
        var ret = [];
        var els = document.getElementsByTagName("*");
        for (var i = 0; i < els.length; i++) {
            //判断els[i]中是否存在cls这个className;.indexOf("cls")判断cls存在的下标，如果下标>=0则存在;
            if (els[i].className === cls || els[i].className.indexOf("cls") >= 0 || els[i].className.indexOf(" cls") >= 0 || els[i].className.indexOf(" cls ") > 0) {
                ret.push(els[i]);
            }
        }
        return ret;
    },

    getStyle: function (obj, attr) { // 解决JS兼容问题获取正确的属性值
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
    },

    startMove: function (obj, json, fun) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var isStop = true;
            for (var attr in json) {
                var iCur = 0;
                //判断运动的是不是透明度值
                if (attr == "opacity") {
                    iCur = parseInt(parseFloat(ar.getStyle(obj, attr)) * 100);
                } else {
                    iCur = parseInt(ar.getStyle(obj, attr));
                }
                var ispeed = (json[attr] - iCur) / 8;
                //运动速度如果大于0则向下取整，如果小于0想上取整；
                ispeed = ispeed > 0 ? Math.ceil(ispeed) : Math.floor(ispeed);
                //判断所有运动是否全部完成
                if (iCur != json[attr]) {
                    isStop = false;
                }
                //运动开始
                if (attr == "opacity") {
                    obj.style.filter = "alpha:(opacity:" + (json[attr] + ispeed) + ")";
                    obj.style.opacity = (json[attr] + ispeed) / 100;
                } else {
                    obj.style[attr] = iCur + ispeed + "px";
                }
            }
            //判断是否全部完成
            if (isStop) {
                clearInterval(obj.timer);
                if (fun) {
                    fun();
                }
            }
        }, 30);
    }

};
