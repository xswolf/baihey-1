/**
 * Created by Administrator on 2016/4/14.
 */
define(['app/module'], function (module) {

    // 有时间戳计算年龄
    function getAge(time) {
        return Math.floor((ar.timeStamp() - time) / 365 / 24 / 3600);
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
        input += '';
        var info = input.split(',');
        var name = '';
        for (var i in info) {
            name += getConfigName(config, parseInt(info[i])) + ' ';
        }
        return name;
    }

    // 由时间戳计算年龄
    module.filter('timeToAge', function () {
        return function (input, args1, args2) {
            if (input) {
                return getAge(input) + '岁';
            } else {
                return '';
            }
        };
    });

    // 由姓名，性别，年龄返回尊称
    module.filter('sex', function () {
        return function (name, sex, age, id) {
            if (name) {
                if (id && id > 9999) {
                    age = getAge(age);
                    if (sex == 1) {
                        return name.substr(0, 1) + '先生';
                    } else if (age >= 35) {
                        return name.substr(0, 1) + '女士';
                    } else {
                        return name.substr(0, 1) + '小姐';
                    }
                }else {
                    return name;
                }
            }
        }
    });

    // 返回真实姓名（姓**）
    module.filter('realName', function () {
        return function (input, arg) {
            if (input) {
                return input.substr(0, 1) + '**';
            } else {
                return '';
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
        return function (input, children) {
            var result = '';
            if (input) {
                var data = config_infoData.occupation;
                for (var i in data) {
                    if (data[i].id == input) {
                        result = data[i].name;
                        break;
                    }
                }
                if (children) {
                    var childrenData = config_infoData.children_occupation;
                    for (var i in childrenData) {
                        if (childrenData[i].id == children) {
                            result += ' ' + childrenData[i].name;
                            break;
                        }
                    }
                }
                return result;
            }
            return '';
        }
    });

    // 返回地址
    module.filter('address', function () {
        return function (province, city, areaId) {
            var title = '';
            if (province && province != '0') {
                title += getAddress(provines, province);
                if (city && city != '0') {
                    title += '-';
                    title += getAddress(citys, city);
                    if (areaId && areaId != '0') {
                        title += '-';
                        title += getAddress(area, areaId);
                    }
                }
            }
            return title;
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
            if (input) {
                var infoData = config_infoData.zodiac;
                for (var i in infoData) {
                    if (infoData[i].id == parseInt(input)) {
                        return '属' + infoData[i].name;
                    }
                }
            } else {
                return '';
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

    // 择偶年龄
    module.filter('zo_age', function () {
        return function (input) {
            if (input) {
                var info = input.split('-');
                if (info[1] == '0') {
                    return info[0] + '岁以上';
                } else {
                    return input + '岁';
                }
            } else {
                return '';
            }
        }
    });

    // 择偶身高
    module.filter('zo_height', function () {
        return function (input) {
            if (input) {
                var info = input.split('-');
                if (info[1] == '0') {
                    return info[0] + '厘米以上';
                } else {
                    return input + '厘米';
                }
            } else {
                return '';
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

    // 返回择偶子女状况
    module.filter('zo_children', function () {
        return function (input, arr) {
            if (typeof(input) != 'undefined') {
                return getMoreName(input, config_infoData.children);
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
                    return 'VIP会员可见';
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
                    return '已删除';
                case '1':
                    return '显示中';
                case '2':
                    return '已结束';
                case '3':
                    return '已关闭';
                default:
                    return '状态错误';
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
                return json.bri_message;
            }
        }
    });

    module.filter('sexDisplay', function () {
        return function (input) {
            if (input == 0) {
                return "女生"
            } else if (input == 1) {
                return "男生"
            } else {
                return "不限"
            }
        }
    });

    module.filter('themeDisplay', function () {
        return function (input) {
            switch (input) {
                case 1:
                    return '娱乐';
                case 2:
                    return '美食';
                case 3:
                    return '旅游';
                case 4:
                    return '运动健身';
                default:
                    return '其他';
            }
        }
    });

    module.filter('feeDisplay', function () {
        return function (input) {
            if (input == 1) {
                return "免费"
            } else if (input == 3) {
                return "你请客"
            } else if (input == 2) {
                return "我请客"
            } else if (input == 4) {
                return "AA制"
            }
        }
    });

    module.filter('unix', function () {
        return function (time) {
        }
    })

    module.filter('picture', function () {
        return function (path) {
            if (path) {
                return path.replace('thumb', 'picture');
            }
            return ' ';

        }
    })

    module.filter('height', function () {
        return function (value) {
            return parseInt(value) ? value + 'cm' : '';
        }
    })

    module.filter('bank', ['$sce', function ($sce) {
        return function (value, type) {
            if (!value) {
                return $sce.trustAsHtml('<img src="/wechat/web/images/loading.gif">');
            }
            if (type == 'name') {
                return value.split('-')[0];
            }
            if (type == 'type') {
                return value.split('-')[1];
            }
            if (type == 'card') {
                return value.substring((value.length - 4), value.length);
            }
            return value;
        }
    }])

    module.filter('withdrawStatusTitle', function () {
        return function (value) {
            if (!value) {
                return '失败';
            }
            if (value == 1) {
                return '已打款';
            }
            if (value == 2) {
                return '处理中';
            }
            if (value == 3) {
                return '失败';
            }
            return '失败';
        }
    })

    module.filter('amount', function () {
        return function (arr) {
            var sum = 0;
            if (arr) {
                for (var i in arr) {
                    sum += parseInt(arr[i].money);
                }
                return sum / 100;
            }
            return sum;
        }
    })

    module.filter('isNull', function () {
        return function (value) {
            if (value) {
                return value;
            } else {
                return ' ';
            }
        }
    })

    module.filter('recordName', function () {
        return function (value, type) {
            if (type == '提现') {
                var cardName = value.split('-');
                //console.log(cardName);
                return cardName[0] + '(' + cardName[1] + ' ' + cardName[2].substr(cardName[2].length - 4) + ')';
            }
            if (type == '嘉瑞红包') {
                return ar.cleanQuotes(value);
            }
            return value;
        }
    })

    module.filter('recordStatus', function () {
        return function (value, type) {
            if (type == '提现') {
                return '已打款';
            }
            if (type == '嘉瑞红包') {
                return '对方已领取';
            }
            return value;
        }
    })

    /**
     * 文字内容超出指定字数时，超出部分用指定字符代替
     */
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
    })

    /**
     * 文字内容超出指定字数时，超出部分用指定字符代替
     */
    module.filter('messageFilter', function () {
        return function (value) {
            if (value) {
                if (value.indexOf('/images/upload') != -1) {
                    return '[图片]';
                }
            }
            return value;
        }
    })

    module.filter('level', function () {
        return function (value) {
            if (value == 1) {
                return 'VIP'
            }
            if (value == 2) {
                return '贵宾'
            }
            if (value == 3) {
                return '钻石'
            }
            return value;
        }
    })

    module.filter('qqwx', function () {
        return function (value) {
            return value.substr(0,3) + '******（VIP会员可见）';
        }
    })

})
