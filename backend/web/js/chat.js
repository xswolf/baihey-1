/**
 * Created by NSK. on 2016/8/26/0026.
 */

var module = angular.module('chatApp', []);
module.controller('chat', function ($scope, $http, $interval, $timeout) {

    $scope.changeStatus = function(item){
        item.msg_status = 0;
    }

    $http({url: '/admin/chat/fictitious-list'}).success(function (res, header, config, status) {
        for (var i in res.data) {
            res.data[i].time = Date.parse(new Date()) / 1000;
            res.data[i].token = $.md5(res.data[i].user_id + 'jzBhY2016-jr' + '' + Date.parse(new Date()) / 1000);
            res.data[i].info = JSON.parse(res.data[i].info);
            res.data[i].auth = JSON.parse(res.data[i].auth);
            res.data[i].msg_status = 0;
        }
        $scope.userInfoList = res.data;
        $timeout(chatFilter,800);
    }).error(function (data, header, config, status) {
        alert('错误：' + data);
    }).finally(function () {

    });

    function chatFilter(){
        $http({url: '/admin/chat/chat-list'}).success(function (res, header, config, status) {
            for(var i in res.data){
                res.data[i].info = JSON.parse(res.data[i].info);
                for(var u in $scope.userInfoList){
                    if($scope.userInfoList[u].user_id == res.data[i].receive_user_id){
                        $scope.userInfoList[u].msg_status = 1;
                    }
                }
            }
            $scope.chatUserList = res.data;
        });

    }

    $interval(chatFilter,300000);


    $scope.pageSize = 20;
    $scope.moreLoading = false;
    $scope.isMore = true;
    $scope.loadMore = function(){
        if($scope.userInfoList.length <= $scope.pageSize){
            $scope.isMore = false;
            return;
        }
        $scope.moreLoading = true;
        $timeout(function(){
            $scope.pageSize += 20;
            $scope.moreLoading = false;
        },1000)

    }

});