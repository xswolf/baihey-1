/**
 * Created by Administrator on 2016/4/14.
 */
define(['app/module'], function (module) {

    // 有时间戳计算年龄
    function getAge(time) {
        return Math.floor((time - ar.timeStamp() / 1000) / 365 / 24 / 3600);
    }

    // 返回配置名
    var getConfigName = function(config,pro) {
        if(0 == pro) {
            return '不限';
        }
        for(var i in config) {
            if(config[i].id == pro) {
                return config[i].name;
            }
        }
    }

    // 返回多项名
    var getMoreName = function(input,config) {
        if(!input) {
            return '不限';
        }
        var info = input.split('-');
        var name = '';
        for(var i in info) {
            name += getConfigName(config,parseInt(info[i])) + ' ';
        }
        return name;
    }

    // 由时间戳计算年龄
    module.filter('timeToAge', function () {
        return function (input, args1, args2) {
            return getAge(input);
        };
    });

    // 由姓名，性别，年龄返回尊称
    module.filter('sex', function () {
        return function (input, sex, age) {

            age = getAge(age);
            if (sex == 1) {
                return input.substr(0, 1) + '先生';
            } else if (age >= 35) {
                return input.substr(0, 1) + '女士';
            } else {
                return input.substr(0, 1) + '小姐';
            }
        }
    });

    // 返回婚姻状况
    module.filter('marriage', function () {
        return function (input, arr) {
            var infoData = config_infoData.marriage;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回学历
    module.filter('education', function () {
        return function (input, arr) {
            var infoData = config_infoData.education;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回子女状态
    module.filter('child', function () {
        return function (input, arr) {
            var infoData = config_infoData.children;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回年薪
    module.filter('yearIncome', function () {
        return function (input, arr) {
            var infoData = config_infoData.salary;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回购房状态
    module.filter('purchase', function () {
        return function (input, arr) {
            if(input == 0) {
                return '不限';
            }
            var infoData = config_infoData.house;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回购车状态
    module.filter('car', function () {
        return function (input, arr) {
            if(input == 0) {
                return '不限';
            }
            var infoData = config_infoData.car;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回职业
    module.filter('occupation', function () {
        return function (input, arr) {
            var infoData = config_infoData.occupation;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    for(var j in infoData[i].children) {
                        if(infoData[i].children[j].id == parseInt(arr)) {
                            return infoData[i].name + '-' + infoData[i].children[j].name;
                        }
                    }
                }
            }
        }
    });

    // 返回地址
    module.filter('address', function() {
        return function (input, arr1, arr2) {
            arr2 = arr2 ? getAddress(area, arr2) : '';
            arr1 = arr1 ? getAddress(citys, arr1) : '';
            input = getAddress(provines, input);
            if(arr2 != '') {
                return input + '-' + arr1 + '-' + arr2;
            } else if(arr1 != '') {
                return input + '-' + arr1;
            } else {
                return input;
            }
        }
    });

    // 返回地区名
    var getAddress = function(address,pro) {
        for(var i in address) {
            if(address[i].id == pro) {
                return address[i].name;
            }
        }
    }

    // 返回生肖属相
    module.filter('zodiac', function () {
        return function (input, arr) {
            var infoData = config_infoData.zodiac;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回星座
    module.filter('constellation', function () {
        return function (input, arr) {
            var infoData = config_infoData.constellation;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回民族
    module.filter('nation', function () {
        return function (input, arr) {
            var infoData = config_infoData.nation;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回血型
    module.filter('blood', function () {
        return function (input, arr) {
            var infoData = config_infoData.blood;
            for(var i in infoData) {
                if(infoData[i].id == parseInt(input)) {
                    return infoData[i].name;
                }
            }
        }
    });

    // 返回择偶年龄
    module.filter('zo_age', function () {
        return function (input, arr) {
            var info = input.split('-');
            if(info[1] == '0') {
                return info[0]+'-'+'不限';
            } else {
                return input;
            }
        }
    });

    // 返回择偶婚姻状况
    module.filter('zo_marriage', function () {
        return function (input, arr) {
            return getMoreName(input,config_infoData.marriage);
        }
    });

    // 返回择偶属相
    module.filter('zo_zodiac', function () {
        return function (input, arr) {
            return getMoreName(input,config_infoData.zodiac);
        }
    });

    // 返回择偶星座
    module.filter('zo_constellation', function () {
        return function (input, arr) {
            return getMoreName(input,config_infoData.constellation);
        }
    });

    module.filter('briMessage',function () {
        return function (input) {
            input = input.replace(/&quot;/g , "\"");
            var json =  JSON.parse(input);
            console.log(json)
            return json.bri_message;
        }
    })
})
