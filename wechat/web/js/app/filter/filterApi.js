/**
 * Created by Administrator on 2016/4/14.
 */
define(['app/module'], function (module) {

    // 由时间戳计算年龄
    module.filter('timeToAge',function() {
       return function(input,args1,args2){

           return Math.floor((ar.timeStamp()/1000 - input)/365/24/3600);
       };
    });
})
