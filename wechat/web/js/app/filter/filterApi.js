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

})
