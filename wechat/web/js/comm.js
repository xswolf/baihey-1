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

        'isWeChat': function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
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

        'setCookie': function (name, value, day) {
            var Days = day;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/wap";
        },

        'delCookie': function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/wap";
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

        getId: function (data) {
            var id = 0;
            if (data == undefined || data.length == 0) { // 判断是否有聊天内容设置ID
                id = 1;
            } else {
                id = parseInt(data[data.length - 1].id) + 1;
            }
            return id;
        },

        /**
         * 将时间转换为正常日期格式 例：2016-04-27
         * @param ISODateStr
         * @returns {*}
         * @constructor
         */
        DateTimeToDate: function (DateStr) {
            if (typeof(DateStr) == 'undefined') {
                return '未知';
            }
            return new Date((DateStr / 1000 + 86400) * 1000).toISOString().split("T")[0];
        },

        /**
         * 根据出生日期计算年龄
         * @param Birthday
         * @returns {*}
         */
        getAgeByBirthday: function (Birthday) {
            var age = -1;
            var r = Birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (r == null)return false;
            var d = new Date(r[1], r[3] - 1, r[4]);
            if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
                var Y = new Date().getFullYear();
                var M = new Date().getMonth() + 1;
                var D = new Date().getDate();
                if (M * 1 - r[3] * 1 < 0) {
                    age = (Y * 1 - r[1] * 1) - 1;
                }
                else {
                    if (D - r[4] >= 0) {
                        age = (Y * 1 - r[1] * 1);
                    }
                    else {
                        age = (Y * 1 - r[1] * 1) - 1;
                    }
                }
                return (age);
            }
            return (age);
        },

        /**
         * 根据出生年月计算属相
         * @param birthday
         * @returns {*[]} id name
         */
        getZodicByBirthday: function (birthday) {
            var toyear = 1997;
            var birthyear = new Date(birthday).getFullYear();
            var zodic = [{id: 0, name: '未知'}]
            x = (toyear - birthyear) % 12
            if ((x == 1) || (x == -11)) {
                zodic.id = 1;
                zodic.name = '鼠';
            }
            else {
                if (x == 0) {
                    zodic.id = 2;
                    zodic.name = '牛';
                }
                else {
                    if ((x == 11) || (x == -1)) {
                        zodic.id = 3;
                        zodic.name = '虎';
                    }
                    else {
                        if ((x == 10) || (x == -2)) {
                            zodic.id = 4;
                            zodic.name = '兔';
                        }
                        else {
                            if ((x == 9) || (x == -3)) {
                                zodic.id = 5;
                                zodic.name = '龙';
                            }
                            else {
                                if ((x == 8) || (x == -4)) {
                                    zodic.id = 6;
                                    zodic.name = '蛇';
                                }
                                else {
                                    if ((x == 7) || (x == -5)) {
                                        zodic.id = 7;
                                        zodic.name = '马';
                                    }
                                    else {
                                        if ((x == 6) || (x == -6)) {
                                            zodic.id = 8;
                                            zodic.name = '羊';
                                        }
                                        else {
                                            if ((x == 5) || (x == -7)) {
                                                zodic.id = 9;
                                                zodic.name = '猴';
                                            }
                                            else {
                                                if ((x == 4) || (x == -8)) {
                                                    zodic.id = 10;
                                                    zodic.name = '鸡';
                                                }
                                                else {
                                                    if ((x == 3) || (x == -9)) {
                                                        zodic.id = 11;
                                                        zodic.name = '狗';
                                                    }
                                                    else {
                                                        if ((x == 2) || (x == -10)) {
                                                            zodic.id = 12;
                                                            zodic.name = '猪';
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return zodic;
        },


        /**
         * 根据出生日期计算星座
         * @param birthday
         * @returns {*[]} id name
         */
        getConstellationByBirthday: function (birthday) {
            var start = 1901, date = new Date(birthday).getDate(), month = new Date(birthday).getMonth() + 1, constellation = [{
                id: 0,
                name: '未知'
            }];
            if (month == 1 && date >= 20 || month == 2 && date <= 18) {
                constellation.id = 1;
                constellation.name = '水瓶座';
            }
            if (month == 2 && date >= 19 || month == 3 && date <= 20) {
                constellation.id = 2;
                constellation.name = '双鱼座';
            }
            if (month == 3 && date >= 21 || month == 4 && date <= 19) {
                constellation.id = 3;
                constellation.name = '白羊座';
            }
            if (month == 4 && date >= 20 || month == 5 && date <= 20) {
                constellation.id = 4;
                constellation.name = '金牛座';
            }
            if (month == 5 && date >= 21 || month == 6 && date <= 21) {
                constellation.id = 5;
                constellation.name = '双子座';
            }
            if (month == 6 && date >= 22 || month == 7 && date <= 22) {
                constellation.id = 6;
                constellation.name = '巨蟹座';
            }
            if (month == 7 && date >= 23 || month == 8 && date <= 22) {
                constellation.id = 7;
                constellation.name = '狮子座';
            }
            if (month == 8 && date >= 23 || month == 9 && date <= 22) {
                constellation.id = 8;
                constellation.name = '处女座';
            }
            if (month == 9 && date >= 23 || month == 10 && date <= 23) {
                constellation.id = 9;
                constellation.name = '天秤座';
            }
            if (month == 10 && date >= 24 || month == 11 && date <= 22) {
                constellation.id = 10;
                constellation.name = '天蝎座';
            }
            if (month == 11 && date >= 23 || month == 12 && date <= 21) {
                constellation.id = 11;
                constellation.name = '射手座';
            }
            if (month == 12 && date >= 22 || month == 1 && date <= 19) {
                constellation.id = 12;
                constellation.name = '摩羯座';
            }
            return constellation;
        },

        /**
         * 将日期转换为时间戳
         * @param birthday
         * @returns {number}
         */
        getTimestampByBirthday: function (birthday) {
            return Math.round(new Date(birthday.replace(/-/g, '/')).getTime() / 1000);
        },

        /**
         * 身高
         * @param min
         * @returns {string}
         */
        heightLink: function (min) {
            var ageHtml = "",
                ageMin = min,
                ageMax = 260;
            for (ageMin; ageMin <= ageMax; ageMin++) {
                ageHtml += '<option value="';
                ageHtml += ageMin;
                ageHtml += '">';
                ageHtml += ageMin;
                ageHtml += '</option>';
            }
            return ageHtml;
        },

        /**
         * 通过id遍历获取对象
         * @param arr
         * @param id
         * @returns {*}
         */
        getObjById: function (arr, id) {
            if (id == '0' || id == 'null') {
                return '0';
            }
            for (var i in arr) {
                if (arr[i].id == id) {
                    return arr[i];
                }
            }
        },

        /**
         * 找到数组中存在的元素，返回其索引
         * @param arr
         * @param name
         * @param value
         * @returns {*}
         */
        getArrI: function (arr, name, value) {
            var filed = ""
            for (var i in arr) {
                filed = eval("arr[i]." + name);
                if (filed == value) {
                    return i;
                }
            }
            return false;
        },

        /**
         * 去除数据库json字段引号
         */
        cleanQuotes: function (string) {
            var str = string.replace(/\\"/g, "");
            return str;
        }
    }
    ;
