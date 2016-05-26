/**
 * Created by Administrator on 2016/4/14.
 */
define(['app/module'], function (module) {

    // 有时间戳计算年龄
    function getAge(time) {
        return Math.floor((time - ar.timeStamp() / 1000) / 365 / 24 / 3600);
    }

    // 返回配置名
    var getConfigName = function (config, pro) {
        if (0 == pro) {
            return '不限';
        }
        for (var i in config) {
            if (config[i].id == pro) {
                return config[i].name;
            }
        }
    }

    // 返回多项名
    var getMoreName = function (input, config) {
        if (!input) {
            return '不限';
        }
        var info = input.split('-');
        var name = '';
        for (var i in info) {
            name += getConfigName(config, parseInt(info[i])) + ' ';
        }
        return name;
    }

    // 由时间戳计算年龄
    module.filter('timeToAge', function () {
        return function (input, args1, args2) {
            if (typeof(input) != 'undefined' && input != '') {
                return getAge(input);
            }
        };
    });

    // 由姓名，性别，年龄返回尊称
    module.filter('sex', function () {
        return function (input, sex, age) {
            if (typeof(input) != 'undefined' && input != '') {
                age = getAge(age);
                if (sex == 1) {
                    return input.substr(0, 1) + '先生';
                } else if (age >= 35) {
                    return input.substr(0, 1) + '女士';
                } else {
                    return input.substr(0, 1) + '小姐';
                }
            }
        }
    });

    // 返回真实姓名（姓**）
    module.filter('realName', function () {
        return function (input, arg) {
            if (typeof(input) != 'undefined' && input != '') {
                if (input != '未知') {
                    return input.substr(0, 1) + '**';
                } else {
                    return input;
                }
            }
        }
    });

    // 返回婚姻状况
    module.filter('marriage', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var infoData = config_infoData.marriage;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回学历
    module.filter('education', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var infoData = config_infoData.education;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回子女状态
    module.filter('child', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var infoData = config_infoData.children;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回年薪
    module.filter('yearIncome', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var infoData = config_infoData.salary;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回购房状态
    module.filter('purchase', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                if (input == 0) {
                    return '不限';
                }
                var infoData = config_infoData.house;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回购车状态
    module.filter('car', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                if (input == 0) {
                    return '不限';
                }
                var infoData = config_infoData.car;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回职业
    module.filter('occupation', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var infoData = config_infoData.occupation;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        for (var j in infoData[i].children) {
                            if (infoData[i].children[j].id == parseInt(arr)) {
                                return infoData[i].name + '-' + infoData[i].children[j].name;
                            }
                        }
                    }
                }
            }
        }
    });

    // 返回地址
    module.filter('address', function () {
        return function (input, arr1, arr2) {
            if (typeof(input) != 'undefined' && input != '') {
                arr2 = arr2 != '0' ? getAddress(area, arr2) : '';
                arr1 = arr1 != '0' ? getAddress(citys, arr1) : '';
                input = getAddress(provines, input);
                if (arr2 != '') {
                    return input + '-' + arr1 + '-' + arr2;
                } else if (arr1 != '') {
                    return input + '-' + arr1;
                } else {
                    return input;
                }
            }
        }
    });

    // 返回地区名
    var getAddress = function (address, pro) {
        for (var i in address) {
            if (address[i].id == pro) {
                return address[i].name;
            }
        }
    }

    // 返回生肖属相
    module.filter('zodiac', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var infoData = config_infoData.zodiac;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回星座
    module.filter('constellation', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var infoData = config_infoData.constellation;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回民族
    module.filter('nation', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var infoData = config_infoData.nation;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回血型
    module.filter('blood', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var infoData = config_infoData.blood;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return infoData[i].name;
                    }
                }
            }
        }
    });

    // 返回择偶年龄
    module.filter('zo_age', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                var info = input.split('-');
                if (info[1] == '0') {
                    return info[0] + '-' + '不限';
                } else {
                    return input;
                }
            }
        }
    });

    // 返回择偶婚姻状况
    module.filter('zo_marriage', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined') {
                return getMoreName(input, config_infoData.marriage);
            }
        }
    });

    // 返回择偶属相
    module.filter('zo_zodiac', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                return getMoreName(input, config_infoData.zodiac);
            }
        }
    });

    // 返回择偶星座
    module.filter('zo_constellation', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined' && input != '') {
                return getMoreName(input, config_infoData.constellation);
            }
        }
    });

    // 权限设置
    module.filter('privacy', function () {
        return function (input, arr) {
            switch (input) {
                case '1':
                    return '全部可见';
                case '2':
                    return '我关注的人可见';
                case '3':
                    return 'vip会员可见';
                case '4':
                    return '不公开';
            }

        }
    });

    // 约会状态
    module.filter('rend_status', function () {
        return function (input) {
            switch (input) {
                case '0':
                    return '已关闭';
                case '1':
                    return '显示中';
                case '2':
                    return '已结束';
                default:
                    return '未知状态';
            }

        }
    });

    // 截取字符串
    module.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || ' …');
        };
    });

    module.filter('briMessage', function () {
        return function (input) {
            if (typeof(input) != 'undefined' && input != '') {
                input = input.replace(/&quot;/g, "\"");
                var json = JSON.parse(input);
                console.log(json)
                return json.bri_message;
            }
        }
    });

    module.filter('sexDisplay' , function () {
        return function (input) {
            if (input == 0){
                return "女生"
            }else if (input == 1){
                return "男生"
            }else {
                return "不限"
            }
        }
    });

    module.filter('feeDisplay' , function () {
        return function (input) {
            if (input == 1){
                return "免费"
            }else if (input == 3){
                return "你请客"
            }else if (input == 2){
                return "我请客"
            }else if(input ==4){
                return "AA制"
            }
        }
    });

    module.filter('unix',function(){
        return function (time){
        }
    })
})
