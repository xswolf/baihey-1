/**
 * Created by Administrator on 2016/3/23.
 */
define(['app/module'], function (module) {
    module.factory('app.serviceApi', ['$http', function ($http) {

        var api = {};

        /**
         * 获取用户登录状态
         * @returns {*}
         */
        api.getLoginStatus = function () {
            return 'app.serviceApi';
            return $http.get('url....');
        }

        /**
         * 验证手机号是否存在
         * @param mobile
         * @returns {*}
         */
        api.getMobileIsExist = function (mobile) {
            //return true;
            return $http.get('/wap/user/mobile-is-exist', {params: {mobile: mobile}});
        }

        /**
         * 验证短信验证码
         * @param code
         * @returns {*}
         */
        api.validateCode = function (code) {
            return $http.get('url',{params:{code:code}});
        }

        /**
         * 提交数据
         * @param formData
         * @returns {*}
         */
        api.save = function (url,formData) {
            return $http.post(url,{params:formData});
        }

        api.wxConfig = function (wx ) {

            return $http.get('../chat/config');

        }

        return api;
    }])
});