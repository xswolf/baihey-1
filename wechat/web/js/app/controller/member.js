/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/router', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {


    module.controller("member.index", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        // 判断是否登录
        api.getLoginStatus().success(function(res) {
            if(!res.status) {
                location.href = '/wap/user/login';
                return false;
            }
        });

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
                {'id': 0, 'url': '/wechat/web/images/test/5.jpg', 'headpic': 1},
                {'id': 1, 'url': '/wechat/web/images/test/1.jpg', 'headpic': 0},
                {'id': 2, 'url': '/wechat/web/images/test/2.jpg', 'headpic': 0},
                {'id': 3, 'url': '/wechat/web/images/test/3.jpg', 'headpic': 0},
                {'id': 4, 'url': '/wechat/web/images/test/4.jpg', 'headpic': 0},
                {'id': 5, 'url': '/wechat/web/images/test/5.jpg', 'headpic': 0},
                {'id': 6, 'url': '/wechat/web/images/test/6.jpg', 'headpic': 0},
                {'id': 8, 'url': '/wechat/web/images/test/3.jpg', 'headpic': 0},
                {'id': 9, 'url': '/wechat/web/images/test/4.jpg', 'headpic': 0},
                {'id': 10, 'url': '/wechat/web/images/test/6.jpg', 'headpic': 0},
                {'id': 11, 'url': '/wechat/web/images/test/2.jpg', 'headpic': 0}
            ];

        $scope.removeImg = function (index) {
            $scope.imgList.splice(index, 1);
        };

        $scope.addNewImg = function () {
            $scope.imgList.push({'id': 12, 'url': '/wechat/web/images/test/4.jpg', 'headpic': 0})
        }

    }]);


    module.controller("member.dynamic", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.dynamic = [];

        // 当前登录用户的所有动态，点击加载，每页十条
        $scope.dynamic.list = [
            {
                id: 1, likeNumber: 68, commentNumber: 482, imgList: [
                {src: '/wechat/web/images/test/1.jpg'},
                {src: '/wechat/web/images/test/2.jpg'},
                {src: '/wechat/web/images/test/3.jpg'},
            ]
            },
            {
                id: 2, likeNumber: 877, commentNumber: 1882, imgList: [
                {src: '/wechat/web/images/test/6.jpg'},
                {src: '/wechat/web/images/test/4.jpg'},
                {src: '/wechat/web/images/test/1.jpg'},
            ]
            },
            {
                id: 3, likeNumber: 95, commentNumber: 381, imgList: [
                {src: '/wechat/web/images/test/2.jpg'},
                {src: '/wechat/web/images/test/5.jpg'},
                {src: '/wechat/web/images/test/3.jpg'},
            ]
            },
            {
                id: 4, likeNumber: 1898, commentNumber: 3487, imgList: [
                {src: '/wechat/web/images/test/6.jpg'},
                {src: '/wechat/web/images/test/1.jpg'},
                {src: '/wechat/web/images/test/4.jpg'},
            ]
            },
            {
                id: 5, likeNumber: 4577, commentNumber: 8841, imgList: [
                {src: '/wechat/web/images/test/5.jpg'},
                {src: '/wechat/web/images/test/6.jpg'},
                {src: '/wechat/web/images/test/4.jpg'},
            ]
            }

        ];

        $scope.dynamic.pageLast = true;  // 是否还有更多数据
        $scope.dynamic.like = true; // 当前登录用户是否已对该条动态点赞

        $scope.dynamic.clickLike = function(){ // 点赞
            if($scope.dynamic.like){  // 如果已点赞，说明是再次点击，点赞数-1，相应样式变化
                $scope.dynamic.like = !$scope.dynamic.like;
                 // 点赞数-1
            }
        };

        $scope.dynamic.loadMore = function () {  // 点击加载

        }

        $scope.bigImage = false;    //初始默认大图是隐藏的
        $scope.hideBigImage = function () {
            $scope.bigImage = false;
        };

        $scope.shouBigImage = function (imageName) {  //传递一个参数（图片的URl）
            $scope.Url = imageName;                   //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用
            $scope.bigImage = true;                   //显示大图
        };

    }]);
    return module;
})


