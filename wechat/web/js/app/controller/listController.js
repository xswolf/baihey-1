/**
 * Created by Administrator on 2016/3/29.
 */

define([
    'app/controller/chat',
    'app/controller/user',
    'app/controller/site',
    'app/controller/message',
    'app/controller/member'
], function () {

    ionic.DomUtil.ready(function () {
        angular.element(document.querySelector('#domLoading'))
            .addClass('hide');
        var menuSelected = ar.getCookie('bhy_menu');
        angular.element(document.querySelector('#footer'))
            .find('li');
    });

})