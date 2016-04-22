/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/router', 'app/directive/directiveApi'
    , 'app/service/serviceApi' ,'angular_sortable'
], function (module) {


    module.controller("member.index", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

       /* $scope.userInfo = ar.getStorage('userInfo');
        $scope.userInfo.info = JSON.parse($scope.userInfo.info);
        $scope.userInfo.identity_pic = JSON.parse($scope.userInfo.identity_pic);
*/
        $scope.userInfo = [{}];

    }]);

    module.controller("member.information", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {
        $scope.imgList = [
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
            {id: 5},
            {id: 6}

        ]


    }]);

    return module;
})


