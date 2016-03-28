/**
 * Created by Administrator on 2016/3/23.
 */
define(['app/module'] , function (module) {
    module.factory('app.serviceApi' , ['$http' , function ($http) {

        var api = {};

        /**
         * 获取用户登录状态
         * @returns {*}
         */
        api.getLoginStatus = function () {
            return 'app.serviceApi';
            return $http.get('url....');
        }

        api.getMobileIsExist = function(mobile){
            return $http.get('url',{params:{mobile:mobile}});
        }


        return api;
    }])
});