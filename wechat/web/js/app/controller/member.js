/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/router', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {


    module.controller("member.index", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        /* $scope.userInfo = ar.getStorage('userInfo');
         $scope.userInfo.info = JSON.parse($scope.userInfo.info);
         $scope.userInfo.identity_pic = JSON.parse($scope.userInfo.identity_pic);
         */
        $scope.userInfo = [{}];

    }]);

    module.controller("member.information", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {
        $scope.showMenu(false);
        $scope.imgList =
            [
                {'id': 0, 'url': '/wechat/web/images/test/5.jpg','headpic':1},
                {'id': 1, 'url': '/wechat/web/images/test/1.jpg','headpic':0},
                {'id': 2, 'url': '/wechat/web/images/test/2.jpg','headpic':0},
                {'id': 3, 'url': '/wechat/web/images/test/3.jpg','headpic':0},
                {'id': 4, 'url': '/wechat/web/images/test/4.jpg','headpic':0},
                {'id': 5, 'url': '/wechat/web/images/test/5.jpg','headpic':0},
                {'id': 6, 'url': '/wechat/web/images/test/6.jpg','headpic':0},
                {'id': 8, 'url': '/wechat/web/images/test/3.jpg','headpic':0},
                {'id': 9, 'url': '/wechat/web/images/test/4.jpg','headpic':0},
                {'id': 10, 'url': '/wechat/web/images/test/6.jpg','headpic':0},
                {'id': 11, 'url': '/wechat/web/images/test/2.jpg','headpic':0}
            ];

        $scope.removeImg = function (index) {
            $scope.imgList.splice(index, 1);
        };

        $scope.addNewImg = function () {
            $scope.imgList.push({'id': 12, 'url': '/wechat/web/images/test/4.jpg','headpic':0})
        }

    }]);

    return module;
})


