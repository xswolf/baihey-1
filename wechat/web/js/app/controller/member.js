/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/router', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'config/area'
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
        $scope.userInfo = ar.getStorage('userInfo');
        $scope.userInfo.info = JSON.parse($scope.userInfo.info);
        $scope.userInfo.identity_pic = JSON.parse($scope.userInfo.identity_pic);
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
        $scope.userInfo = ar.getStorage('userInfo');

        $scope.formData = [];
        $scope.formData.personalized = $scope.userInfo.personalized;
        $scope.saveData = function () {
            if ($scope.formData.personalized == '' || typeof($scope.formData.personalized) == 'undefined') {
                if (confirm('您还未填写个性签名，确定保存吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.personalized = $scope.formData.personalized;
                    ar.setStorage('userInfo', $scope.userInfo);
                })
            }

        }

    }]);

    // 真实姓名
    module.controller("member.real_name", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);
        $scope.userInfo = ar.getStorage('userInfo');
        $scope.userInfo.info = JSON.parse($scope.userInfo.info);

        $scope.formData = [];
        $scope.formData.real_name = $scope.userInfo.info.real_name != '未知' ? $scope.userInfo.info.real_name : '';
        $scope.sex = 0;  // 用户性别
        $scope.saveData = function () {
            if ($scope.formData.real_name == '' || typeof($scope.formData.real_name) == 'undefined') {
                if (confirm('检测到您还未填写真实姓名，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.real_name = $scope.formData.real_name;
                    $scope.userInfo.info = JSON.stringify($scope.userInfo.info);
                    ar.setStorage('userInfo', $scope.userInfo);
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
        $scope.userInfo = ar.getStorage('userInfo');
        $scope.userInfo.info = JSON.parse($scope.userInfo.info);

        $scope.formData = [];
        $scope.formData.height = $scope.userInfo.info.height;

        $scope.heightModel = config_infoData.height;

        $scope.heightSelect = function (val) {
            $scope.formData.height = val;
        }

        $scope.saveData = function () {

            if ($scope.formData.height == '' || typeof($scope.formData.height) == 'undefined') {
                if (confirm('检测到您还选择身高，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.height = $scope.formData.height;
                    $scope.userInfo.info = JSON.stringify($scope.userInfo.info);
                    ar.setStorage('userInfo', $scope.userInfo);
                })
            }


        }

    }]);

    // 婚姻状况
    module.controller("member.is_marriage", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);
        $scope.userInfo = ar.getStorage('userInfo');
        $scope.userInfo.info = JSON.parse($scope.userInfo.info);

        $scope.formData = [];
        $scope.formData.is_marriage = $scope.userInfo.info.is_marriage;

        $scope.marriageModel = config_infoData.marriage;
console.log($scope.marriageModel);
        $scope.marriageSelect = function (val) {
            console.log(val);
            $scope.formData.is_marriage = val;
        }

        $scope.saveData = function () {

            if ($scope.formData.is_marriage == '' || typeof($scope.formData.is_marriage) == 'undefined') {
                if (confirm('检测到您还未选择婚姻状况，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.is_marriage = $scope.formData.is_marriage;
                    $scope.userInfo.info = JSON.stringify($scope.userInfo.info);
                    ar.setStorage('userInfo', $scope.userInfo);
                })
            }


        }

    }]);

    // 学历
    module.controller("member.education", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        $scope.education = "";

        $scope.educationModel = config_infoData.education;

        $scope.educationSelect = function (val) {
            $scope.education = val;
        }

        $scope.saveData = function () {

            if ($scope.education == '' || typeof($scope.education) == 'undefined') {
                if (confirm('检测到您还未选择学历，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.education).success(function (res) {
                    // 保存
                })
            }

        }
    }]);

    // 职业
    module.controller("member.occupation", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        // 获取文档高度以适应ion-scroll
        $scope.bodyHeight = document.body.scrollHeight;
        if ($scope.bodyHeight == 0) $scope.bodyHeight = window.screen.height;
        $scope.scrollStyle = {
            'height': ($scope.bodyHeight - 44) + 'px'
        }

        $scope.occupationModel = config_infoData.occupation;

        // 用户职业
        $scope.useroccBig = 1;  // 职业大类
        $scope.useroccSmall = 1; // 职业小类

        // 如用户未填写职业，默认加载小类数据
        $scope.occupation = $scope.occupationModel[0].children;


        $scope.selected_bigo = function (item) {
            $scope.occupation = item.children;
            $scope.big_selected = true;
            $scope.useroccBig = item.id;
        }

        $scope.selected_smallo = function (item) {
            $scope.useroccSmall = item.id;
        }

        $scope.saveData = function () {
            if ($scope.useroccBig == 0) {
                if (confirm('检测到您还未选择职业，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                if ($scope.useroccSmall == 0) {
                    $ionicPopup.alert({title: '请选择工作岗位'});
                    return false;
                } else {
                    api.save(url, $scope.occupation).success(function (res) {
                        // 保存
                    })
                }
            }
        }

    }]);

    // 地区
    module.controller("member.address", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        // 加载数据
        $scope.province = provines;
        $scope.province.splice(0, 0, {id: '0', name: '请选择'});
        $scope.city = [
            {id: '0', name: '请选择'}
        ];
        $scope.area = [
            {id: '0', name: '请选择'}
        ];

        // 用户数据
        $scope.formData = [];
        $scope.formData.userprovince = 0;
        $scope.formData.usercity = 0;
        $scope.formData.userarea = 0;

        // 默认数据
        $scope.pro = '0';
        $scope.cit = '0';
        $scope.are = '0';

        // 选择省
        $scope.provinceSelect = function (pro) {
            $scope.city = [{id: '0', name: '请选择'}];  // 清空数组
            $scope.area = [{id: '0', name: '请选择'}]; // 清空数组
            angular.forEach(citys, function (data, i) {
                if (citys[i].parentId == pro) {
                    $scope.city.push(citys[i]);
                }
            });
            $scope.formData.usercity = '0';
            $scope.formData.userarea = '0';
            $scope.formData.userprovince = pro;
        }

        // 选择市
        $scope.citySelect = function (cit) {
            $scope.area = [{id: '0', name: '请选择'}]; // 清空数组
            angular.forEach(area, function (data, i) {
                if (area[i].parentId == cit) {
                    $scope.area.push(area[i]);
                }
            });
            $scope.formData.userarea = '0';
            $scope.formData.usercity = cit;
        }

        // 选择区
        $scope.areaSelect = function (are) {
            $scope.formData.userarea = are;
        }

        $scope.saveData = function () {
            if ($scope.formData.userprovince == '0') {
                if (confirm('检测到您还未选择地区，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.formData).success(function (res) {
                    // 保存

                })
            }
        }

    }]);

    // 常出没地
    module.controller("member.haunt_address", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);
        $scope.formData = [];
        $scope.saveData = function () {
            if ($scope.formData.haunt_address == '' || typeof($scope.formData.haunt_address) == 'undefined') {
                if (confirm('检测到您还未填写常出没地，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.formData.haunt_address).success(function (res) {
                    // 保存

                })
            }
        }


    }]);

    // 微信号
    module.controller("member.wechat_number", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        $scope.formData = [];
        $scope.saveData = function () {
            if ($scope.formData.wechat == '' || typeof($scope.formData.wechat) == 'undefined') {
                if (confirm('检测到您还未填写微信号，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.formData.wechat).success(function (res) {
                    // 保存

                })
            }
        }

    }]);

    // QQ号
    module.controller("member.qq_number", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.showMenu(false);

        $scope.formData = [];
        $scope.saveData = function () {
            if ($scope.formData.qq == '' || typeof($scope.formData.qq) == 'undefined') {
                if (confirm('检测到您还未填写QQ号，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.formData.qq).success(function (res) {
                    // 保存

                })
            }
        }

    }]);

    // 去过的地方
    module.controller("member.been_address", ['app.serviceApi', '$scope', '$ionicPopup', '$filter', function (api, $scope, $ionicPopup, $filter) {

        $scope.showMenu(false);

        $scope.formData = [];

        $scope.formData.userAddrIdList = [];  // 用户已选择的地区，ID数据集，存数据库
        $scope.formData.userAddrList = [];    // 用户已选择的地区，name数据集，展示用

        $scope.addrList = [
            {id: 0, name: '北京', hot: 1},
            {id: 1, name: '上海', hot: 1},
            {id: 2, name: '张家界', hot: 1},
            {id: 3, name: '九寨沟', hot: 1},
            {id: 4, name: '马尔代夫', hot: 1},
            {id: 5, name: '三亚', hot: 1},
            {id: 6, name: '鼓浪屿', hot: 1},
            {id: 7, name: '丽江', hot: 1},
            {id: 8, name: '西双版纳', hot: 1},
            {id: 9, name: '西藏', hot: 1},
            {id: 10, name: '重庆', hot: 1},
            {id: 11, name: '黄山', hot: 0},
            {id: 12, name: '峨眉山', hot: 0},
            {id: 13, name: '拉斯维加斯', hot: 0},
            {id: 14, name: '纽约', hot: 0},
            {id: 15, name: '巴黎', hot: 0},
            {id: 16, name: '三峡', hot: 0},
            {id: 17, name: '埃及', hot: 0},
            {id: 18, name: '澳大利亚', hot: 0},
            {id: 19, name: '巴厘岛', hot: 0},
            {id: 20, name: '威尼斯', hot: 0}
        ];
        var arr = [
            {id: 0, name: '北京', hot: 1},
            {id: 1, name: '上海', hot: 1},
            {id: 2, name: '张家界', hot: 1},
            {id: 3, name: '九寨沟', hot: 1},
            {id: 4, name: '马尔代夫', hot: 1},
            {id: 5, name: '三亚', hot: 1},
            {id: 6, name: '鼓浪屿', hot: 1},
            {id: 7, name: '丽江', hot: 1},
            {id: 8, name: '西双版纳', hot: 1},
            {id: 9, name: '西藏', hot: 1},
            {id: 10, name: '重庆', hot: 1},
            {id: 11, name: '黄山', hot: 0},
            {id: 12, name: '峨眉山', hot: 0},
            {id: 13, name: '拉斯维加斯', hot: 0},
            {id: 14, name: '纽约', hot: 0},
            {id: 15, name: '巴黎', hot: 0},
            {id: 16, name: '三峡', hot: 0},
            {id: 17, name: '埃及', hot: 0},
            {id: 18, name: '澳大利亚', hot: 0},
            {id: 19, name: '巴厘岛', hot: 0},
            {id: 20, name: '威尼斯', hot: 0}
        ];
        var updateSelected = function (action, id, name) {
            if (action == 'add' && $scope.formData.userAddrIdList.indexOf(id) == -1) {
                $scope.formData.userAddrIdList.push(id);
                $scope.formData.userAddrList.push(name);
            }
            if (action == 'remove' && $scope.formData.userAddrIdList.indexOf(id) != -1) {
                var idx = $scope.formData.userAddrIdList.indexOf(id);
                $scope.formData.userAddrIdList.splice(idx, 1);
                $scope.formData.userAddrList.splice(idx, 1);
            }
        }

        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id, checkbox.name);
        }

        $scope.isSelected = function (id) {
            return $scope.formData.userAddrIdList.indexOf(id) >= 0;
        }

        // 关键字搜索
        $scope.search = function (value) {
            if (value == '' || typeof(value) == 'undefined') {
                $scope.addrList = arr;
                $scope.addrList = $filter('filter')($scope.addrList);
            } else {
                $scope.addrList = $filter('filter')($scope.addrList, {name:value});
            }
        }

        // 保存
        $scope.saveData = function(){
            if($scope.formData.userAddrIdList.length <= 0){
                if (confirm('检测到您还未选择去过的地方，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            }else {
                api.save(url, $scope.formData.userAddrIdList).success(function (res) {
                    // 保存

                })
            }
        }

    }
    ]);

    // 去过的地方
    module.controller("member.want_address", ['app.serviceApi', '$scope', '$ionicPopup', '$filter', function (api, $scope, $ionicPopup, $filter) {

        $scope.showMenu(false);

        $scope.formData = [];

        $scope.formData.userAddrIdList = [];  // 用户已选择的地区，ID数据集，存数据库
        $scope.formData.userAddrList = [];    // 用户已选择的地区，name数据集，展示用

        $scope.addrList = [
            {id: 0, name: '解放碑', hot: 1},
            {id: 1, name: '朝天门', hot: 1},
            {id: 2, name: '南山', hot: 1},
            {id: 3, name: '歌乐山', hot: 1},
            {id: 4, name: '仙女山', hot: 1},
            {id: 5, name: '武隆', hot: 1},
            {id: 6, name: '云阳龙缸', hot: 1},
            {id: 7, name: '金佛山', hot: 1},
            {id: 8, name: '桃花源', hot: 1},
            {id: 9, name: '黑山谷', hot: 1},
            {id: 10, name: '大足石刻', hot: 1},
            {id: 11, name: '金刀峡', hot: 0},
            {id: 12, name: '洋人街', hot: 0},
            {id: 13, name: '四面山', hot: 0},
            {id: 14, name: '缙云山', hot: 0},
            {id: 15, name: '小三峡', hot: 0},
            {id: 16, name: '桂园', hot: 0},
            {id: 17, name: '渣滓洞', hot: 0},
            {id: 18, name: '白公馆', hot: 0},
            {id: 19, name: '洪崖洞', hot: 0},
            {id: 20, name: '茶山竹海', hot: 0}
        ];
        var arr = [
            {id: 0, name: '北京', hot: 1},
            {id: 1, name: '上海', hot: 1},
            {id: 2, name: '张家界', hot: 1},
            {id: 3, name: '九寨沟', hot: 1},
            {id: 4, name: '马尔代夫', hot: 1},
            {id: 5, name: '三亚', hot: 1},
            {id: 6, name: '鼓浪屿', hot: 1},
            {id: 7, name: '丽江', hot: 1},
            {id: 8, name: '西双版纳', hot: 1},
            {id: 9, name: '西藏', hot: 1},
            {id: 10, name: '重庆', hot: 1},
            {id: 11, name: '黄山', hot: 0},
            {id: 12, name: '峨眉山', hot: 0},
            {id: 13, name: '拉斯维加斯', hot: 0},
            {id: 14, name: '纽约', hot: 0},
            {id: 15, name: '巴黎', hot: 0},
            {id: 16, name: '三峡', hot: 0},
            {id: 17, name: '埃及', hot: 0},
            {id: 18, name: '澳大利亚', hot: 0},
            {id: 19, name: '巴厘岛', hot: 0},
            {id: 20, name: '威尼斯', hot: 0}
        ];
        var updateSelected = function (action, id, name) {
            if (action == 'add' && $scope.formData.userAddrIdList.indexOf(id) == -1) {
                $scope.formData.userAddrIdList.push(id);
                $scope.formData.userAddrList.push(name);
            }
            if (action == 'remove' && $scope.formData.userAddrIdList.indexOf(id) != -1) {
                var idx = $scope.formData.userAddrIdList.indexOf(id);
                $scope.formData.userAddrIdList.splice(idx, 1);
                $scope.formData.userAddrList.splice(idx, 1);
            }
        }

        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id, checkbox.name);
        }

        $scope.isSelected = function (id) {
            return $scope.formData.userAddrIdList.indexOf(id) >= 0;
        }

        // 关键字搜索
        $scope.search = function (value) {
            if (value == '' || typeof(value) == 'undefined') {
                $scope.addrList = arr;
                $scope.addrList = $filter('filter')($scope.addrList);
            } else {
                $scope.addrList = $filter('filter')($scope.addrList, {name:value});
            }
        }
        $scope.typeTab = 1;

        // 本地（重庆）
        $scope.addrListOne =[
            {id: 1, name: '解放碑', hot: 1},
            {id: 2, name: '朝天门', hot: 1},
            {id: 3, name: '南山', hot: 1},
            {id: 4, name: '歌乐山', hot: 1},
            {id: 5, name: '仙女山', hot: 1},
            {id: 6, name: '武隆', hot: 1},
            {id: 7, name: '云阳龙缸', hot: 1},
            {id: 8, name: '金佛山', hot: 1},
            {id: 9, name: '桃花源', hot: 1},
            {id: 10, name: '黑山谷', hot: 1},
            {id: 11, name: '大足石刻', hot: 1},
            {id: 12, name: '金刀峡', hot: 0},
            {id: 13, name: '洋人街', hot: 0},
            {id: 14, name: '四面山', hot: 0},
            {id: 15, name: '缙云山', hot: 0},
            {id: 16, name: '小三峡', hot: 0},
            {id: 17, name: '桂园', hot: 0},
            {id: 18, name: '渣滓洞', hot: 0},
            {id: 19, name: '白公馆', hot: 0},
            {id: 20, name: '洪崖洞', hot: 0},
            {id: 21, name: '茶山竹海', hot: 0}
        ];

        // 省外
        $scope.addrListTwo = [
            {id: 1000001, name: '北京', hot: 1},
            {id: 1000002, name: '西藏', hot: 1},
            {id: 1000003, name: '拉萨', hot: 1},
            {id: 1000004, name: '张家界', hot: 1},
            {id: 1000005, name: '九寨沟', hot: 1},
            {id: 1000006, name: '神农架', hot: 1},
            {id: 1000007, name: '成都', hot: 1},
            {id: 1000008, name: '趵突泉', hot: 1},
            {id: 1000009, name: '鼓浪屿', hot: 1},
            {id: 1000010, name: '三亚', hot: 1},
            {id: 1000011, name: '青岛', hot: 0},
            {id: 1000012, name: '新疆', hot: 0},
            {id: 1000013, name: '华山', hot: 0},
            {id: 1000014, name: '黄山', hot: 0},
            {id: 1000015, name: '凤凰古镇', hot: 0},
            {id: 1000016, name: '千岛湖', hot: 0},
            {id: 1000017, name: '泰山', hot: 0},
            {id: 1000018, name: '上海', hot: 1}
        ];

        // 国外
        $scope.addrListThree = [
            {id: 8000001, name: '巴黎', hot: 1},
            {id: 8000002, name: '威尼斯', hot: 1},
            {id: 8000003, name: '东京', hot: 1},
            {id: 8000004, name: '首尔', hot: 1},
            {id: 8000005, name: '曼谷', hot: 1},
            {id: 8000006, name: '拉斯维加斯', hot: 1},
            {id: 8000007, name: '冰岛', hot: 1},
            {id: 8000008, name: '喜马拉雅山', hot: 1},
            {id: 8000009, name: '珠穆朗玛峰', hot: 1},
            {id: 8000010, name: '马尔代夫', hot: 1},
            {id: 8000011, name: '普吉岛', hot: 0},
            {id: 8000012, name: '巴厘岛', hot: 0},
            {id: 8000013, name: '新加坡', hot: 0},
            {id: 8000014, name: '济州岛', hot: 0},
            {id: 8000015, name: '纽约', hot: 1}
        ];

        $scope.showTab = function(tab){
            $scope.typeTab = tab;
        }

        // 保存
        $scope.saveData = function(){
            if($scope.formData.userAddrIdList.length <= 0){
                if (confirm('检测到您还未选择去过的地方，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            }else {
                api.save(url, $scope.formData.userAddrIdList).success(function (res) {
                    // 保存

                })
            }
        }

    }
    ]);

    return module;
})


