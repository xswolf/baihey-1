/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/router', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    // 我
    module.controller("member.index", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        /* // 判断是否登录
         api.getLoginStatus().success(function (res) {
         if (!res.status) {
         location.href = '/wap/user/login';
         return false;
         }
         });*/

        /* $scope.userInfo = ar.getStorage('userInfo');
         $scope.userInfo.info = JSON.parse($scope.userInfo.info);
         $scope.userInfo.identity_pic = JSON.parse($scope.userInfo.identity_pic);
         */
        $scope.userInfo = [{}];

    }]);

    // 资料首页
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

    // 个人动态
    module.controller("member.dynamic", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        // 图片放大查看插件
        requirejs(['jquery'], function ($) {
            requirejs(['klass', 'photoswipe'], function (klass, PhotoSwipe) {

                $(document).ready(function () {
                    var myPhotoSwipe = $(".dyn_con_p a").photoSwipe({
                        enableMouseWheel: false,
                        enableKeyboard: false,
                        allowRotationOnUserZoom: true
                    });
                });
            })
        })

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

        $scope.dynamic.clickLike = function () { // 点赞
            if ($scope.dynamic.like) {  // 如果已点赞，说明是再次点击，点赞数-1，相应样式变化
                $scope.dynamic.like = !$scope.dynamic.like;
                // 点赞数-1
            }
        };

        $scope.dynamic.loadMore = function () {  // 点击加载

        }

    }]);

    // 个性签名
    module.controller("member.signature", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        $scope.formData = [];
        $scope.saveData = function () {
            if ($scope.personalized == '' || typeof($scope.personalized) == 'undefined') {
                if (confirm('您还未填写个性签名，确定保存吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                $scope.formData.personalized = $scope.personalized;
                api.save(url, $scope.formData).success(function (res) {
                    // 保存
                })
            }

        }

    }]);

    // 真实姓名
    module.controller("member.real_name", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        $scope.sex = 0;  // 用户性别
        $scope.saveData = function () {
            if ($scope.real_name == '' || typeof($scope.real_name) == 'undefined') {
                if (confirm('检测到您还未填写真实姓名，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                $scope.formData.real_name = $scope.real_name;
                api.save(url, $scope.formData).success(function (res) {
                    // 保存
                })
            }
        }
    }]);

    // 出生年月
    module.controller("member.age", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        $scope.formData = [];
        $scope.age = '年龄';
        $scope.zodic = {id: 0, name: '生肖'};
        $scope.constellation = {id: 0, name: '星座'};
        $scope.birthdayChange = function () {
            $scope.age = ar.getAgeByBirthday(ar.DateTimeToDate($scope.birthday)) + '岁';
            $scope.zodic = ar.getZodicByBirthday(ar.DateTimeToDate($scope.birthday));
            $scope.constellation = ar.getConstellationByBirthday(ar.DateTimeToDate($scope.birthday));
        }

        $scope.formData.age = ar.getTimestampByBirthday(ar.DateTimeToDate($scope.birthday)); // 年龄时间戳
        $scope.formData.zodic = $scope.zodic.id; // 生肖ID 详见comm.js
        $scope.formData.constellation = $scope.constellation.id; // 星座ID 详见comm.js

        $scope.saveData = function () {
            if ($scope.age < 18) {
                $ionicPopup.alert({title: '如果您未满18岁，请退出本站，谢谢合作！'});
                return false;
            }
            api.save(url, $scope.formData).success(function (res) {
                // 保存
            })
        }

    }]);

    // 身高
    module.controller("member.height", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        $scope.height = "";

        $scope.heightModel = [];

        for (var i = 140; i <= 260; i++) {
            $scope.heightModel.push({
                'id': i,
                'name': i + '厘米'
            })
        }

        $scope.heightSelect = function (val) {
            $scope.height = val;
        }

        $scope.saveData = function () {

            if ($scope.height == '' || typeof($scope.height) == 'undefined') {
                if (confirm('检测到您还选择身高，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            }else {
                api.save(url, $scope.height).success(function (res) {
                    // 保存
                })
            }


        }

    }]);

    // 婚姻状况
    module.controller("member.is_marriage", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);


    }]);

    // 学历
    module.controller("member.education", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);


    }]);

    // 职业
    module.controller("member.occupation", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);


    }]);

    // 地区
    module.controller("member.address", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);


    }]);

    // 常出没地
    module.controller("member.haunt_address", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);


    }]);

    // 微信号
    module.controller("member.wechat_number", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);


    }]);

    // QQ号
    module.controller("member.qq_number", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);


    }]);

    return module;
})


