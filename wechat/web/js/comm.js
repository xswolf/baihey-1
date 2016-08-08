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

    'currentYmd': function () {
        var myDate = new Date();
        return myDate.getFullYear() + '' + myDate.getMonth() + '' + myDate.getDate();
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

    'getPassByPhone': function(phone){
        if(isNaN(phone)){
            if(!phone || phone.length != 11){
                alert('手机号格式不正确');
                return false;
            }
            return phone.substring(-6);
        }else {
            if(!phone || phone.toString().length != 11){
                alert('手机号格式不正确');
                return false;
            }
            return phone.toString().substring(phone.toString().length,phone.toString().length - 6);
        }
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
            if (obj != 'undefined') {
                obj = JSON.parse(obj);
                return obj;
            } else {
                return false;
            }
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
            return '';
        }
        return new Date((DateStr / 1000 + 86400) * 1000).toISOString().split("T")[0];
    },

    /**
     * 将10位时间戳转为中文日期格式 2016/1/1 上午1:43:02
     * @param timesTamp
     * @returns {string}
     */
    timesTampToDate: function (timesTamp) {
        var unixTimestamp = new Date(timesTamp * 1000);
        return unixTimestamp.toLocaleString();
    },

    dateToTimestamp:function(date){
        return new Date(date).getTime() / 1000;
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
        var zodic = [{id: 0, name: ''}]
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
            name: ''
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
        return Math.round(new Date(birthday.replace(/-/g, '-')).getTime() / 1000);
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
        var str = string.replace(/"/g, "");
        return str;
    },

    saveDataConfirm: function (confirm, title) {
        var confirmPopup = confirm.confirm({
            template: title,
            cancelText: '取消',
            okText: '确认'
        });
        return confirmPopup;
    },

    saveDataAlert: function (alert, title) {
        alert.alert({
            template: title,
            okText: '确定'
        })
    },
    // 微信支付回调
    weiXinPayCallBack: function ($, param, orderId) {
        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', param,
                function (res) {
                    $.get('http://wechat.baihey.com/wap/charge/order-query', {out_trade_no: orderId}, function (res) {
                        res = JSON.parse(res);
                        if (res.trade_state && res.trade_state == "SUCCESS") {
                            $.get('http://wechat.baihey.com/wap/charge/set-order-status', {orderId: orderId}, function (res) {
                                res = JSON.parse(res);
                                if (res.data) {
                                    window.location.href = '/wap/site/main#/charge_order?orderId=' + orderId + '&payType=5';
                                } else {
                                    alert('设置订单状态失败');
                                }
                            })
                        } else {
                            window.location.href = '/wap/site/main#/charge_order?orderId=' + orderId + '&payType=5';
                        }
                    });
                }
            );
        }

        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    },

    initPhotoSwipeFromDOM: function (gallerySelector) {
        requirejs(['photoswipe', 'photoswipe_ui'], function (PhotoSwipe, PhotoSwipeUI_Default) {
            var parseThumbnailElements = function (el) {

                var thumbElements = el.childNodes,
                    numNodes = thumbElements.length,
                    items = [],
                    el,
                    childElements,
                    thumbnailEl,
                    size,
                    item;

                for (var i = 0; i < numNodes; i++) {
                    el = thumbElements[i];

                    // include only element nodes
                    if (el.nodeType !== 1) {
                        continue;
                    }

                    childElements = el.children;
                    size = el.getAttribute('data-size').split('x');

                    // create slide object
                    item = {
                        src: el.getAttribute('href'),
                        w: parseInt(size[0], 10),
                        h: parseInt(size[1], 10),
                        author: el.getAttribute('data-author')
                    };

                    item.el = el; // save link to element for getThumbBoundsFn

                    if (childElements.length > 0) {
                        item.msrc = childElements[0].getAttribute('src'); // thumbnail url
                        if (childElements.length > 1) {
                            item.title = childElements[1].innerHTML; // caption (contents of figure)
                        }
                    }


                    var mediumSrc = el.getAttribute('data-med');
                    if (mediumSrc) {
                        size = el.getAttribute('data-med-size').split('x');
                        // "medium-sized" image
                        item.m = {
                            src: mediumSrc,
                            w: parseInt(size[0], 10),
                            h: parseInt(size[1], 10)
                        };
                    }
                    // original image
                    item.o = {
                        src: item.src,
                        w: item.w,
                        h: item.h
                    };

                    items.push(item);
                }

                return items;
            };

            // find nearest parent element
            var closest = function closest(el, fn) {
                return el && ( fn(el) ? el : closest(el.parentNode, fn) );
            };

            var onThumbnailsClick = function (e) {
                e = e || window.event;
                e.preventDefault ? e.preventDefault() : e.returnValue = false;

                var eTarget = e.target || e.srcElement;

                var clickedListItem = closest(eTarget, function (el) {
                    return el.tagName === 'A';
                });

                if (!clickedListItem) {
                    return;
                }

                var clickedGallery = clickedListItem.parentNode;

                var childNodes = clickedListItem.parentNode.childNodes,
                    numChildNodes = childNodes.length,
                    nodeIndex = 0,
                    index;

                for (var i = 0; i < numChildNodes; i++) {
                    if (childNodes[i].nodeType !== 1) {
                        continue;
                    }

                    if (childNodes[i] === clickedListItem) {
                        index = nodeIndex;
                        break;
                    }
                    nodeIndex++;
                }

                if (index >= 0) {
                    openPhotoSwipe(index, clickedGallery);
                }
                return false;
            };

            var photoswipeParseHash = function () {
                var hash = window.location.hash.substring(1),
                    params = {};

                if (hash.length < 5) { // pid=1
                    return params;
                }

                var vars = hash.split('&');
                for (var i = 0; i < vars.length; i++) {
                    if (!vars[i]) {
                        continue;
                    }
                    var pair = vars[i].split('=');
                    if (pair.length < 2) {
                        continue;
                    }
                    params[pair[0]] = pair[1];
                }

                if (params.gid) {
                    params.gid = parseInt(params.gid, 10);
                }

                return params;
            };

            var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
                var pswpElement = document.querySelectorAll('.pswp')[0],
                    gallery,
                    options,
                    items;

                items = parseThumbnailElements(galleryElement);

                // define options (if needed)
                options = {

                    galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                    getThumbBoundsFn: function (index) {
                        // See Options->getThumbBoundsFn section of docs for more info
                        var thumbnail = items[index].el.children[0],
                            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = thumbnail.getBoundingClientRect();

                        return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
                    },

                    addCaptionHTMLFn: function (item, captionEl, isFake) {
                        //if (!item.title) {
                        //    captionEl.children[0].innerText = '';
                        //    return false;
                        //}
                        captionEl.children[0].innerHTML = '轻触照片退出';
                        captionEl.children[0].style.cssText = 'text-align:center';
                        return true;
                    },

                };

                if (fromURL) {
                    if (options.galleryPIDs) {
                        // parse real index when custom PIDs are used
                        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                        for (var j = 0; j < items.length; j++) {
                            if (items[j].pid == index) {
                                options.index = j;
                                break;
                            }
                        }
                    } else {
                        options.index = parseInt(index, 10) - 1;
                    }
                } else {
                    options.index = parseInt(index, 10);
                }

                // exit if index not found
                if (isNaN(options.index)) {
                    return;
                }

                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top: 0, bottom: 0};
                options.captionEl = true;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.history = false;
                options.bgOpacity = 1;
                options.tapToClose = true;
                options.tapToToggleControls = false;
                options.closeEl = false;

                if (disableAnimation) {
                    options.showAnimationDuration = 0;
                }

                // Pass data to PhotoSwipe and initialize it
                gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

                // see: http://photoswipe.com/documentation/responsive-images.html
                var realViewportWidth,
                    useLargeImages = false,
                    firstResize = true,
                    imageSrcWillChange;

                gallery.listen('beforeResize', function () {

                    var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
                    dpiRatio = Math.min(dpiRatio, 2.5);
                    realViewportWidth = gallery.viewportSize.x * dpiRatio;


                    if (realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
                        if (!useLargeImages) {
                            useLargeImages = true;
                            imageSrcWillChange = true;
                        }

                    } else {
                        if (useLargeImages) {
                            useLargeImages = false;
                            imageSrcWillChange = true;
                        }
                    }

                    if (imageSrcWillChange && !firstResize) {
                        gallery.invalidateCurrItems();
                    }

                    if (firstResize) {
                        firstResize = false;
                    }

                    imageSrcWillChange = false;

                });

                /*gallery.listen('gettingData', function (index, item) {
                 if (useLargeImages) {
                 item.src = item.o.src;
                 item.w = item.o.w;
                 item.h = item.o.h;
                 } else {
                 item.src = item.m.src;
                 item.w = item.m.w;
                 item.h = item.m.h;
                 }
                 });*/

                gallery.init();
            };

            // select all gallery elements
            var galleryElements = document.querySelectorAll(gallerySelector);
            for (var i = 0, l = galleryElements.length; i < l; i++) {
                galleryElements[i].setAttribute('data-pswp-uid', i + 1);
                galleryElements[i].onclick = onThumbnailsClick;
            }

            // Parse URL and open gallery if it contains #&pid=3&gid=1
            var hashData = photoswipeParseHash();
            if (hashData.pid && hashData.gid) {
                openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
            }

        })
    },

    processData: function (fieldName, $scope, api, $ionicPopup, $filter, $ionicScrollDelegate) {
        if (fieldName == 'address') {    // 地区
            address();
        }
        if (fieldName == 'been_address') {  // 去过的地方
            beenAddress();
        }
        if (fieldName == 'blood') {      // 血型
            blood();
        }
        if (fieldName == 'car' || fieldName == 'zo_car') {      // 购车
            car();
        }
        if (fieldName == 'children' || fieldName == 'zo_children') {      // 子女
            children();
        }
        if (fieldName == 'delicacy') {      // 喜欢的美食
            delicacy();
        }
        if (fieldName == 'education' || fieldName == 'zo_education') {      // 学历
            education();
        }
        if (fieldName == 'height') {      // 身高
            height();
        }
        if (fieldName == 'house' || fieldName == 'zo_house') {      // 购房
            house();
        }
        if (fieldName == 'is_marriage') {      // 婚姻状况
            isMarriage();
        }
        if (fieldName == 'movie') {      // 喜欢的影视
            movie();
        }
        if (fieldName == 'nation') {      // 民族
            nation();
        }
        if (fieldName == 'occupation') {      // 职业
            occupation();
        }
        if (fieldName == 'salary') {      // 年薪
            salary();
        }
        if (fieldName == 'sports') {      // 喜欢的运动
            sports();
        }
        if (fieldName == 'want_address') {      // 想去的地方
            wantAddress();
        }

        if (fieldName == 'zo_constellation') {      // 择偶星座
            zoConstellation();
        }

        if (fieldName == 'zo_marriage') {      // 择偶婚姻
            zoMarriage();
        }
        if (fieldName == 'zo_zodiac') {      // 择偶属相
            zoZodiac();
        }


        function address() {
            $scope.provinceList = provines;
            $scope.cityList = citys;
            $scope.areaList = area;
        }

        function beenAddress() {
            $scope.formData = {};
            $scope.formData.went_travel = $scope.userInfo.went_travel ? $scope.userInfo.went_travel.split(',') : [];// 用户已选择的地区，ID数据集，存数据库
            $scope.isMore = true;
            $scope.typeTab = 1;     // 默认国内
            $scope.domestic = [];   // 国内
            $scope.abroad = [];     // 国外
            $scope.data = [];
            $scope.pageSize = 1;     // 默认一页显示3条
            api.list('/wap/member/went-travel-list', {}).success(function (res) {    //typeId:2，国内。 typeId:3，国外
                $scope.data = res.data;
                for (var i in $scope.data) {
                    for (var j in $scope.formData.went_travel) {
                        if ($scope.formData.went_travel[j] == $scope.data[i].id) {
                            $scope.data[i].checked = true;
                            break;
                        } else {
                            $scope.data[i].checked = false;
                        }
                    }
                    if ($scope.data[i].type == 2 && $scope.data[i].parentId == 0) {
                        $scope.domestic.push($scope.data[i]);
                    }
                    if ($scope.data[i].type == 3 && $scope.data[i].parentId == 0) {
                        $scope.abroad.push($scope.data[i]);
                    }
                }
            });

            // 加载更多
            $scope.loadMore = function (typeTab) {
                if (typeTab == 1) {
                    if ($scope.pageSize == $scope.domestic.length) {
                        $scope.isMore = false;
                    }
                } else {
                    if ($scope.pageSize == $scope.abroad.length) {
                        $scope.isMore = false;
                    }
                }
                $scope.pageSize += 1;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

            // 是否还有更多
            $scope.moreDataCanBeLoaded = function () {
                return $scope.isMore;
            }

            // 删除
            $scope.remove = function (dat) {
                for (var i in $scope.data) {
                    if ($scope.data[i].id == dat.id) {
                        $scope.data[i].checked = false;
                        break;
                    }
                }
                delItem(dat, 'went_travel');
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }

            // 横向滚动至底部
            $scope.scrollSmallToBottom = function (event, da) {
                var list = $filter('filter')($scope.data, {checked: true});
                if (list.length > 6) {
                    da.checked = false;
                    ar.saveDataAlert($ionicPopup, '您最多能选择6项！');
                    return;
                }
                if (event.target.checked) {
                    addItem(da, 'went_travel');
                    $ionicScrollDelegate.$getByHandle('small').scrollBottom();
                } else {
                    delItem(da, 'went_travel');
                    $ionicScrollDelegate.$getByHandle('small').scrollTop();
                }
            };

            $scope.showTab = function (tab) {
                $scope.typeTab = tab;
            }

        }

        function blood() {
            $scope.bloodList = config_infoData.blood;
        }

        function car() {
            $scope.carList = config_infoData.car;
        }

        function children() {
            $scope.childrenList = config_infoData.children;
        }

        function delicacy() {
            $scope.formData = {};
            $scope.formData.like_food = $scope.userInfo.like_food ? $scope.userInfo.like_food.split(',') : [];

            // 默认数据处理
            api.list('/wap/member/config-list', {'type': 3}).success(function (res) {
                $scope.foodList = res.data;
                for (var i in $scope.foodList) {
                    for (var j in $scope.formData.like_food) {
                        if ($scope.foodList[i].id == $scope.formData.like_food[j]) {
                            $scope.foodList[i].checked = true;
                            break;
                        } else {
                            $scope.foodList[i].checked = false;
                        }
                    }
                }
            });

            // 删除
            $scope.remove = function (f) {
                for (var i in $scope.foodList) {
                    if ($scope.foodList[i].id == f.id) {
                        $scope.foodList[i].checked = false;
                        break;
                    }
                }
                delItem(da, 'like_food');
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }

            // 横向滚动至底部
            $scope.scrollSmallToBottom = function (event, da) {
                var list = $filter('filter')($scope.foodList, {checked: true});
                if (list.length > 6) {
                    da.checked = false;
                    ar.saveDataAlert($ionicPopup, '您最多能选择6项！');
                    return;
                }
                if (event.target.checked) {
                    addItem(da, 'like_food');
                    $ionicScrollDelegate.$getByHandle('small').scrollBottom();
                } else {
                    delItem(da, 'like_food');
                    $ionicScrollDelegate.$getByHandle('small').scrollTop();
                }
            }

        }

        function education() {
            $scope.educationList = config_infoData.education;
        }

        function height() {
            $scope.heightList = config_infoData.height;
        }

        function house() {
            $scope.houseList = config_infoData.house;
        }

        function isMarriage() {
            $scope.marriageList = config_infoData.marriage;
        }

        function movie() {
            $scope.formData = {};
            $scope.formData.want_film = $scope.userInfo.want_film ? $scope.userInfo.want_film.split(',') : [];

            // 默认数据处理
            api.list('/wap/member/config-list', {'type': 2}).success(function (res) {
                $scope.list = res.data;
                for (var i in $scope.list) {
                    for (var j in $scope.formData.want_film) {
                        if ($scope.list[i].id == $scope.formData.want_film[j]) {
                            $scope.list[i].checked = true;
                            break;
                        } else {
                            $scope.list[i].checked = false;
                        }
                    }
                }
            });

            // 删除
            $scope.remove = function (l) {
                for (var i in $scope.list) {
                    if ($scope.list[i].id == l.id) {
                        $scope.list[i].checked = false;
                        break;
                    }
                }
                delItem(l, 'want_film');
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }

            // 横向滚动至底部
            $scope.scrollSmallToBottom = function (event, da) {
                var list = $filter('filter')($scope.list, {checked: true});
                if (list.length > 6) {
                    da.checked = false;
                    ar.saveDataAlert($ionicPopup, '您最多能选择6项！');
                    return;
                }
                if (event.target.checked) {
                    addItem(da, 'want_film');
                    $ionicScrollDelegate.$getByHandle('small').scrollBottom();
                } else {
                    delItem(da, 'want_film');
                    $ionicScrollDelegate.$getByHandle('small').scrollTop();
                }
            }

        }

        function nation() {
            $scope.nationList = config_infoData.nation;
        }

        function occupation() {
            $scope.occupationList = config_infoData.occupation;
            $scope.childrenOccupationList = config_infoData.children_occupation;
            $scope.userInfo.info.occupation = $scope.userInfo.info.occupation ? $scope.userInfo.info.occupation : 1;
            $scope.userInfo.info.children_occupation = $scope.userInfo.info.children_occupation ? $scope.userInfo.info.children_occupation : 1;
            // 获取文档高度以适应ion-scroll
            $scope.bodyHeight = document.body.scrollHeight;
            if ($scope.bodyHeight == 0) $scope.bodyHeight = window.screen.height;
            $scope.scrollStyle = {
                'height': ($scope.bodyHeight - 44) + 'px'
            }

            $scope.selected_big = function (item) {
                $scope.userInfo.info.occupation = item.id;
                $scope.userInfo.info.children_occupation = 0;
            }

            $scope.selected_small = function (item) {
                $scope.userInfo.info.children_occupation = item.id;
            }
        }

        function salary() {
            $scope.salaryList = config_infoData.salary;
        }

        function sports() {
            $scope.formData = {};
            $scope.formData.love_sport = $scope.userInfo.love_sport ? $scope.userInfo.love_sport.split(',') : [];

            // 默认数据处理
            api.list('/wap/member/config-list', {'type': 1}).success(function (res) {
                $scope.sportsList = res.data;
                for (var i in $scope.sportsList) {
                    for (var j in $scope.formData.love_sport) {
                        if ($scope.formData.love_sport[j] == $scope.sportsList[i].id) {
                            $scope.sportsList[i].checked = true;
                            break;
                        } else {
                            $scope.sportsList[i].checked = false;
                        }
                    }
                }
            });

            // 横向滚动至底部
            $scope.scrollSmallToBottom = function (event, da) {
                var list = $filter('filter')($scope.sportsList, {checked: true});
                if (list.length > 6) {
                    da.checked = false;
                    ar.saveDataAlert($ionicPopup, '您最多能选择6项！');
                    return;
                }
                if (event.target.checked) {
                    addItem(da, 'love_sport');
                    $ionicScrollDelegate.$getByHandle('small').scrollBottom();
                } else {
                    delItem(da, 'love_sport');
                    $ionicScrollDelegate.$getByHandle('small').scrollTop();
                }
            };

            // 删除
            $scope.remove = function (s) {
                for (var i in $scope.sportsList) {
                    if ($scope.sportsList[i].id == s.id) {
                        $scope.sportsList[i].checked = false;
                        break;
                    }
                }
                delItem(s, 'love_sport');
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }

        }

        function wantAddress() {
            $scope.formData = {};
            $scope.formData.want_travel = $scope.userInfo.want_travel ? $scope.userInfo.want_travel.split(',') : [];
            $scope.isMore = true;
            $scope.typeTab = 1;     // 默认国内
            $scope.domestic = [];   // 国内
            $scope.abroad = [];     // 国外
            $scope.data = [];
            $scope.pageSize = 1;     // 默认一页显示3条
            api.list('/wap/member/went-travel-list', {}).success(function (res) {    //typeId:2，国内。 typeId:3，国外
                $scope.data = res.data;
                for (var i in $scope.data) {
                    for (var j in $scope.formData.want_travel) {
                        if ($scope.formData.want_travel[j] == $scope.data[i].id) {
                            $scope.data[i].checked = true;
                            break;
                        } else {
                            $scope.data[i].checked = false;
                        }
                    }
                    if ($scope.data[i].type == 2 && $scope.data[i].parentId == 0) {
                        $scope.domestic.push($scope.data[i]);
                    }
                    if ($scope.data[i].type == 3 && $scope.data[i].parentId == 0) {
                        $scope.abroad.push($scope.data[i]);
                    }
                }
            });

            // 加载更多
            $scope.loadMore = function (typeTab) {
                if (typeTab == 1) {
                    if ($scope.pageSize == $scope.domestic.length) {
                        $scope.isMore = false;
                    }
                } else {
                    if ($scope.pageSize == $scope.abroad.length) {
                        $scope.isMore = false;
                    }
                }
                $scope.pageSize += 1;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

            // 是否还有更多
            $scope.moreDataCanBeLoaded = function () {
                return $scope.isMore;
            }

            // 删除
            $scope.remove = function (dat) {
                for (var i in $scope.data) {
                    if ($scope.data[i].id == dat.id) {
                        $scope.data[i].checked = false;
                        break;
                    }
                }
                delItem(dat, 'want_travel');
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }

            // 横向滚动至底部
            $scope.scrollSmallToBottom = function (event, da) {
                var list = $filter('filter')($scope.data, {checked: true});
                if (list.length > 6) {
                    da.checked = false;
                    ar.saveDataAlert($ionicPopup, '您最多能选择6项！');
                    return;
                }
                if (event.target.checked) {
                    addItem(da, 'want_travel');
                    $ionicScrollDelegate.$getByHandle('small').scrollBottom();
                } else {
                    delItem(da, 'want_travel');
                    $ionicScrollDelegate.$getByHandle('small').scrollTop();
                }
            };

            $scope.showTab = function (tab) {
                $scope.typeTab = tab;
            }

        }


        function zoConstellation() {
            $scope.formData = {};
            $scope.constellationList = config_infoData.constellation;
            $scope.formData.zo_constellation = $scope.constellationList;
            for (var i in $scope.constellationList) {
                for (var j in $scope.userInfo.info.zo_constellation) {
                    if ($scope.userInfo.info.zo_constellation[j] == $scope.constellationList[i].id) {
                        $scope.constellationList[i].checked = true;
                        break;
                    } else {
                        $scope.constellationList[i].checked = false;
                    }
                }
            }
        }

        function zoMarriage() {
            $scope.formData = {};
            $scope.marriageList = config_infoData.marriage;
            $scope.formData.zo_marriage = $scope.marriageList;
            for (var i in $scope.marriageList) {
                for (var j in $scope.userInfo.info.zo_marriage) {
                    if ($scope.userInfo.info.zo_marriage[j] == $scope.marriageList[i].id) {
                        $scope.marriageList[i].checked = true;
                        break;
                    } else {
                        $scope.marriageList[i].checked = false;
                    }
                }
            }

        }

        function zoZodiac() {
            $scope.formData = {};
            $scope.zodiacList = config_infoData.zodiac;
            $scope.formData.zo_zodiac = $scope.zodiacList;
            for (var i in $scope.zodiacList) {
                for (var j in $scope.userInfo.info.zo_zodiac) {
                    if ($scope.userInfo.info.zo_zodiac[j] == $scope.zodiacList[i].id) {
                        $scope.zodiacList[i].checked = true;
                        break;
                    } else {
                        $scope.zodiacList[i].checked = false;
                    }
                }
            }
        }

        function addItem(item, name) {
            if (name == 'went_travel') {
                $scope.formData.went_travel.push(item.id);
            }
            if (name == 'want_travel') {
                $scope.formData.want_travel.push(item.id);
            }
            if (name == 'love_sport') {
                $scope.formData.love_sport.push(item.id);
            }
            if (name == 'want_film') {
                $scope.formData.want_film.push(item.id);
            }
            if (name == 'like_food') {
                $scope.formData.like_food.push(item.id);
            }
        }

        function delItem(item, name) {
            if (name == 'went_travel') {
                for (var i in $scope.formData.went_travel) {
                    if ($scope.formData.went_travel[i] == item.id) {
                        $scope.formData.went_travel.splice(i, 1);
                        break;
                    }
                }
            }
            if (name == 'want_travel') {
                for (var i in $scope.formData.want_travel) {
                    if ($scope.formData.want_travel[i] == item.id) {
                        $scope.formData.want_travel.splice(i, 1);
                        break;
                    }
                }
            }
            if (name == 'love_sport') {
                for (var i in $scope.formData.love_sport) {
                    if ($scope.formData.love_sport[i] == item.id) {
                        $scope.formData.love_sport.splice(i, 1);
                        break;
                    }
                }
            }
            if (name == 'want_film') {
                for (var i in $scope.formData.want_film) {
                    if ($scope.formData.want_film[i] == item.id) {
                        $scope.formData.want_film.splice(i, 1);
                        break;
                    }
                }
            }
            if (name == 'like_food') {
                for (var i in $scope.formData.like_food) {
                    if ($scope.formData.like_food[i] == item.id) {
                        $scope.formData.like_food.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },

    processParams: function ($scope,formData) {
        if(!formData) return true;
        var form = formData;
        if(form.birthday){
            //$scope.userInfo.info.age = this.dateToTimestamp(form.birbirthday);
            $scope.userInfo.info.age = form.birthday.getTime()/1000;
            $scope.userInfo.info.zodiac = form.zodiac.id;
            $scope.userInfo.info.constellation = form.constellation.id;
        }
        if(form.went_travel){
            $scope.userInfo.went_travel = form.went_travel.join(',');
        }
        if(form.want_travel){
            $scope.userInfo.want_travel = form.want_travel.join(',');
        }
        if(form.love_sport){
            $scope.userInfo.love_sport = form.love_sport.join(',');
        }
        if(form.want_film){
            $scope.userInfo.want_film = form.want_film.join(',');
        }
        if(form.like_food){
            $scope.userInfo.like_food = form.like_food.join(',');
        }
        if(form.zo_marriage){
            var zo_marriage = [];
            for(var i in form.zo_marriage){
                if(form.zo_marriage[i].checked){
                    zo_marriage.push(form.zo_marriage[i].id);
                }
            }
            $scope.userInfo.info.zo_marriage = zo_marriage.join(',');
        }
        if(form.zo_zodiac){
            var zo_zodiac = [];
            for(var i in form.zo_zodiac){
                if(form.zo_zodiac[i].checked){
                    zo_zodiac.push(form.zo_zodiac[i].id);
                }
            }
            $scope.userInfo.info.zo_zodiac = zo_zodiac.join(',');
        }
        if(form.zo_constellation){
            var zo_constellation = [];
            for(var i in form.zo_constellation){
                if(form.zo_constellation[i].checked){
                    zo_constellation.push(form.zo_constellation[i].id);
                }
            }
            $scope.userInfo.info.zo_constellation = zo_constellation.join(',');
        }
        $scope.getTravel('went_travel', $scope.userInfo.went_travel);// 我去过的地方
        $scope.getTravel('want_travel', $scope.userInfo.want_travel);// 我想去的地方
        $scope.getConfig('love_sport', $scope.userInfo.love_sport);// 喜欢的运动
        $scope.getConfig('want_film', $scope.userInfo.want_film);// 想看的电影
        $scope.getConfig('like_food', $scope.userInfo.like_food);// 喜欢的食物
    }


};


