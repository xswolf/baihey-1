/**
 * Created by Administrator on 2016/3/29.
 */
require.config({
    urlArgs: "bust=v3"+Math.random(), // 清除缓存
    baseUrl: '/wechat/web/js/',
    paths: {
        jquery: 'plugin/jquery/jquery',
        angular: 'plugin/ionic/ionic.bundle.min',
        ionic:'plugin/ionic/ionic.min',
        bootstrap:'plugin/bootstrap/bootstrap.min',
        amezeui: 'plugin/amezeui/amazeui.min',
        comm: 'comm',
        config:'config'
    },
    shim:{
        angular:{
            exports:"angular"
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
