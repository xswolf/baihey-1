/**
 * Created by Administrator on 2016/4/14.
 */
define(['app/module'], function (module) {

    // 有时间戳计算年龄
    function getAge(time) {
        return Math.floor((time - ar.timeStamp() / 1000) / 365 / 24 / 3600);
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
        return function (input, marriage) {
            switch(input) {
                case 1:
                    return '未婚';break;
                case 2:
                    return '离异';break;
                case 3:
                    return '丧偶';break;
                case 4:
                    return '已婚';break;
                default :
                    return '未知';
            }
        }
    });

    // 返回学历
    module.filter('education', function () {
        return function (input, marriage) {
            switch(input) {
                case 1:
                    return '高中以下';break;
                case 2:
                    return '高中/中专';break;
                case 3:
                    return '大专';break;
                case 4:
                    return '本科';break;
                case 5:
                    return '双学士';break;
                case 6:
                    return '硕士';break;
                case 7:
                    return '硕士研究生';break;
                case 8:
                    return '博士';break;
                case 9:
                    return '博士后';break;
                default :
                    return '未知';
            }
        }
    });

})
