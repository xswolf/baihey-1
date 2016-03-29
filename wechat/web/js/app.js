/**
 * Created by Administrator on 2016/3/29.
 */
require.config({
    //urlArgs: "bust=v3"+Math.random(), // 清除缓存
    baseUrl: '/wechat/web/js/',
    paths: {
        jquery: 'plugin/jquery/jquery',
        angular: 'plugin/angular/angular.min',
        "angular-route": "plugin/angular/angular-route",
        bootstrap:'plugin/bootstrap/bootstrap.min'
    },
    shim:{
        angular:{
            exports:"angular"
        },
        "angular-route":{
            deps:['angular'],
            exports:"angular-route"
        },
        jquery : {
            exports:"jquery"
        }
    }
});


require(['angular',"app/controller/listController"],function(angular){
    'use strict';
    angular.bootstrap(document,['webApp']);

});
