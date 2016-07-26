/**
 * Created by Administrator on 2016/3/23.
 */
define(['app/module'], function (module, config) {
    module.factory('app.serviceApi', ['$http', '$q', function ($http, $q) {

        var api = {};

        //api.city = config.city;
        /**
         * 获取用户登录状态
         * @returns {*}
         */
        api.getLoginStatus = function () {
            return $http.get('/wap/user/get-login-status');
        }

        /**
         * 获取当前用户信息
         * @returns {HttpPromise}
         */
        api.getUserInfo = function (id) {
            return $http({
                method: 'get',
                url: '/wap/user/get-user-info',
                params: {id: id}
            });
        }

        /**
         * 删除消息列表item
         * @returns {*}qq
         */
        api.setMsgDisplay = function (msgId) {
            return $http.get('/wap/message/del', {params: {msgId: msgId}});
        }

        /**
         * 根据用户ID获取身份认证状态
         * @param receviceId
         * @returns {*}
         */
        api.getUserAuthStatus = function (receviceId) {
            return $http.get('url', {params: {recevice_user_id: receviceId}});
        }

        /**
         * 根据用户ID获取红娘评价
         * @param receviceId
         * @returns {*}
         */
        api.getUserMakerRated = function (receviceId) {
            return $http.get('url', {params: {recevice_user_id: receviceId}});
        }

        /**
         * 验证手机号是否存在
         * @param mobile
         * @returns {*}
         */
        api.mobileIsExist = function (_mobile) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({method: 'GET', url: '/wap/user/mobile-is-exist',params: {mobile: _mobile}}).
            success(function(data, status, headers, config) {
                deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
            }).
            error(function(data, status, headers, config) {
                deferred.reject(data);   // 声明执行失败，即服务器返回错误
            });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        }

        api.getMobileIsExist = function (_mobile) {
            return $http.get('/wap/user/mobile-is-exist', {params: {mobile: _mobile}});
        }
        /**
         * 发送短信验证码
         * @param _mobile
         * @returns {*}
         */
        api.sendCodeMsg = function (_mobile) {
            return $http.get('/wap/user/send-code-msg', {params: {mobile: _mobile}});

        }

        /**
         * 验证短信验证码
         * @param code
         * @returns {*}
         */
        api.validateCode = function (code) {
            return $http.get('/wap/user/validate-code', {params: {code: code}});
        }

        /**
         * 提交数据
         * @param formData
         * @returns {*}
         */
        api.save = function (url, formData) {
            return $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                    //'X-CSRF-Token':'bzFrQUtlbHU3AS8SGAweRyt1CAInMkElCXMRCzIoH0AGS1MSJjwFPg=='
                },
                params: formData
            });
        }

        /**
         * 通用Get方法
         * @param url
         * @param paramsObject // 参数 对象
         * @returns {*}
         */
        api.get = function (url, paramsObject) {
            return $http.get(url, {params: paramsObject});
        }

        /**
         * 获取状态
         * @param url
         * @returns {HttpPromise}
         */
        api.getStatus = function (url, formData) {
            return $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                    //'X-CSRF-Token':'bzFrQUtlbHU3AS8SGAweRyt1CAInMkElCXMRCzIoH0AGS1MSJjwFPg=='
                },
                params: formData
            });
        }

        /**
         * 获取微信配置
         * @param wx
         * @returns {*}
         */
        api.wxConfig = function () {
            var signUrl = "http://wechat.baihey.com/wap/site/main";
            return $http({
                method: 'POST',
                url: '../chat/config',
                params: {url: signUrl}
            });
        }

        /**
         * 获取列表
         * @param url
         * @param params
         * @returns {*}
         */
        api.list = function (url, params) {
            return $http({
                method: 'POST',
                url: url,
                params: params
            });
        }

        // 获取未读消息总数
        api.getMessageNumber = function () {
            return $http.get('/wap/message/get-message-sum');
        }

        /**
         * 获取关注我的总数
         */
        api.getSumFollow = function () {
            return $http.get('/wap/follow/get-sum-follow');
        }


        return api;
    }])
});

