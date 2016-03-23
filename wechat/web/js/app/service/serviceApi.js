/**
 * Created by Administrator on 2016/3/23.
 */
define(['angular','app/module'] , function (ng,module) {
    module.factory('app.serviceApi' , ['$http' , function ($http) {

        var api = {};

        /**
         * 获取用户登录状态
         * @returns {*}
         */
        api.getLoginStatus = function () {
            return 'test';
            return $http.get('url....');
        }

        return api;
    }])
});