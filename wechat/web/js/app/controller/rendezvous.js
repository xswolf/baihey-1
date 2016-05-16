/**
 * Created by NSK. on 2016/5/16/0016.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    module.controller("rendezvous.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading','$interval', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading,$interval) {

        $scope.formData = [];

        $scope.formData.timer = '78时00分12秒';

        var tid = $interval(function () {
            var totalSec = getTotalSecond($scope.formData.timer) - 1;
            if (totalSec >= 0) {
                $scope.formData.timer = getNewSyTime(totalSec);
            } else {
                $interval.cancel(tid);
            }

        }, 1000);

        //根据剩余时间字符串计算出总秒数
        function getTotalSecond(timestr) {
            var reg = /\d+/g;
            var timenums = new Array();
            while ((r = reg.exec(timestr)) != null) {
                timenums.push(parseInt(r));
            }
            var second = 0, i = 0;
            if (timenums.length == 4) {
                second += timenums[0] * 24 * 3600;
                i = 1;
            }
            second += timenums[i] * 3600 + timenums[++i] * 60 + timenums[++i];
            return second;
        }

        //根据剩余秒数生成时间格式
        function getNewSyTime(sec) {
            var s = sec % 60;
            sec = (sec - s) / 60; //min
            var m = sec % 60;
            sec = (sec - m) / 60; //hour
            var h = sec % 24;
            var d = (sec - h) / 24;//day
            var syTimeStr = "";
            if (d > 0) {
                syTimeStr += d.toString() + "天";
            }

            syTimeStr += ("0" + h.toString()).substr(-2) + "时"
                + ("0" + m.toString()).substr(-2) + "分"
                + ("0" + s.toString()).substr(-2) + "秒";

            return syTimeStr;
        }

    }]);
});