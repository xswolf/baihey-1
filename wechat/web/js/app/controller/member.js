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


    }]);

    // 资料首页
    module.controller("member.information", ['app.serviceApi', '$scope', '$ionicPopup', 'FileUploader', '$ionicLoading', function (api, $scope, $ionicPopup, FileUploader, $ionicLoading) {
        $scope.formData = [];

        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/upload'
        });

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

        // 删除照片
        $scope.removeImg = function (index) {

            if (confirm("是否删除？")) {
                // 删除操作 api.getXXX
                $scope.imgList.splice(index, 1);
            } else {
                return false;
            }


        };

        $scope.showLoading = function (progress) {
            $ionicLoading.show({
                template: '<p class="tac">上传中...</p><p class="tac">' + progress + '%</p>'
            });
        };

        $scope.hideLoading = function () {
            $ionicLoading.hide();
        }

        $scope.addNewImg = function () {
            var e = document.getElementById("pic_fileInput");
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            e.dispatchEvent(ev);

            uploader.filters.push({
                name: 'file-type-Res',
                fn: function (item) {
                    if (!ar.msg_file_res_img(item)) {   // 验证文件是否是图片格式
                        $ionicPopup.alert({title: '只能发送图片类型的文件！'});
                        return false;
                    }
                    return true;
                }
            });

            uploader.onAfterAddingFile = function (fileItem) {  // 选择文件后
                fileItem.upload();   // 上传
            };
            uploader.onProgressItem = function (fileItem, progress) {   //进度条
                $scope.showLoading(progress);    // 显示loading
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {  // 上传成功
                $scope.imgList.push({id: 12, url: response.path, headpic: 0});
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {  // 上传出错
                $ionicPopup.alert({title: '上传图片出错！'});
                $scope.hideLoading();  // 隐藏loading
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {  // 上传结束
                $scope.hideLoading();  // 隐藏loading
            };

        }


    }]);

    // 个人动态
    module.controller("member.dynamic", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

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
                    //$scope.upUserStorage('personalized',$scope.formData.personalized,'wu');
                    $scope.setUserStorage();
                })
            }

        }

    }]);

    // 真实姓名
    module.controller("member.real_name", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

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
                    $scope.setUserStorage();
                })
            }
        }
    }]);

    // 出生年月
    module.controller("member.age", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

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
                    $scope.setUserStorage();
                })
            }


        }

    }]);

    // 婚姻状况
    module.controller("member.is_marriage", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.is_marriage = $scope.userInfo.info.is_marriage;

        $scope.marriageModel = config_infoData.marriage;

        $scope.marriageSelect = function (val) {
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
                    $scope.setUserStorage();
                })
            }


        }

    }]);

    // 学历
    module.controller("member.education", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.education = $scope.userInfo.info.education;

        $scope.educationModel = config_infoData.education;

        $scope.educationSelect = function (val) {
            $scope.formData.education = val;
        }

        $scope.saveData = function () {

            if ($scope.formData.education == '' || typeof($scope.formData.education) == 'undefined') {
                if (confirm('检测到您还未选择学历，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.education = $scope.formData.education;
                    $scope.setUserStorage();
                })
            }

        }
    }]);

    // 职业
    module.controller("member.occupation", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.occupation = $scope.userInfo.info.occupation != '未知' ? $scope.userInfo.info.occupation : 1;
        $scope.children_occupation = $scope.userInfo.info.children_occupation != '未知' ? $scope.userInfo.info.children_occupation : 1;

        // 获取文档高度以适应ion-scroll
        $scope.bodyHeight = document.body.scrollHeight;
        if ($scope.bodyHeight == 0) $scope.bodyHeight = window.screen.height;
        $scope.scrollStyle = {
            'height': ($scope.bodyHeight - 44) + 'px'
        }

        $scope.occupationModel = config_infoData.occupation;

        // 用户职业
        $scope.useroccBig = $scope.occupation;  // 职业大类
        $scope.useroccSmall = $scope.children_occupation; // 职业小类

        // 如用户未填写职业，默认加载小类数据
        $scope.occupation = $scope.occupationModel[$scope.occupation - 1].children;


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
                    $scope.formData.occupation = $scope.useroccBig + '-' + $scope.useroccSmall;
                    api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                        // 保存
                        $scope.userInfo.info.occupation = $scope.useroccBig;
                        $scope.userInfo.info.children_occupation = $scope.useroccSmall;
                        $scope.setUserStorage();
                    })
                }
            }
        }

    }]);

    // 地区
    module.controller("member.address", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        // 加载数据
        $scope.provinceList = provines;

        // 用户数据
        $scope.formData = [];
        $scope.formData.userprovince = $scope.userInfo.province != 'null' ? $scope.userInfo.province : '0';
        $scope.formData.usercity = $scope.userInfo.city != 'null' ? $scope.userInfo.city : '0';
        $scope.formData.userarea = $scope.userInfo.area != 'null' ? $scope.userInfo.area : '0';

        // 地区联动
        $scope.cityList = [];
        $scope.areaList = [];
        var address = function (name, pro) {
            var arr = name == 'city' ? citys : area;
            if (pro == null || pro == undefined || pro == 0) return null;
            for (var i in arr) {
                if (arr[i].parentId == pro) {
                    eval('$scope.' + name + 'List.push(arr[i])');
                }
            }
        }
        address('city', $scope.formData.userprovince);
        address('area', $scope.formData.usercity);

        // 选择省
        $scope.provinceSelect = function (pro) {
            $scope.formData.usercity = "0";
            $scope.formData.userarea = "0";
            $scope.cityList = [];  // 清空数组 市
            $scope.areaList = []; // 清空数组 区
            address('city', pro);
        }

        // 选择市
        $scope.citySelect = function (cit) {
            $scope.areaList = []; // 清空数组 区
            address('area', cit);
            if (cit == "0") {
                $scope.formData.userarea = "0";
            }
        }

        $scope.saveData = function () {
            if ($scope.formData.userprovince == "0") {
                if (confirm('检测到您还未选择地区，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                $scope.addressData = [];
                $scope.addressData.address = $scope.formData.userprovince;
                if ($scope.formData.usercity > 0) {
                    $scope.addressData.address += '-' + $scope.formData.usercity;
                } else {
                    $scope.addressData.address += '-0';
                }
                if ($scope.formData.userarea > 0) {
                    $scope.addressData.address += '-' + $scope.formData.userarea;
                } else {
                    $scope.addressData.address += '-0';
                }
                api.save('/wap/member/save-data', $scope.addressData).success(function (res) {
                    // 保存
                    $scope.userInfo.province = $scope.formData.userprovince;
                    if ($scope.formData.usercity > 0) {
                        $scope.userInfo.city = $scope.formData.usercity;
                    } else {
                        $scope.userInfo.city = null;
                    }
                    if ($scope.formData.userarea > 0) {
                        $scope.userInfo.area = $scope.formData.userarea;
                    } else {
                        $scope.userInfo.area = null;
                    }
                    $scope.setUserStorage();
                })
            }
        }

    }]);

    // 常出没地
    module.controller("member.haunt_address", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

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
    module.controller("member.been_address", ['app.serviceApi', '$scope', '$ionicPopup', '$filter', '$ionicScrollDelegate', function (api, $scope, $ionicPopup, $filter, $ionicScrollDelegate) {

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
                $scope.scrollSmallToBottom();
            }
            if (action == 'remove' && $scope.formData.userAddrIdList.indexOf(id) != -1) {
                var idx = $scope.formData.userAddrIdList.indexOf(id);
                $scope.formData.userAddrIdList.splice(idx, 1);
                $scope.formData.userAddrList.splice(idx, 1);
                $scope.scrollSmallToTop();
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

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollBottom();
        };

        // 横向滚动至顶部
        $scope.scrollSmallToTop = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        };

        // 关键字搜索
        $scope.search = function (value) {
            if (value == '' || typeof(value) == 'undefined') {
                $scope.addrList = arr;
                $scope.addrList = $filter('filter')($scope.addrList);
            } else {
                $scope.addrList = $filter('filter')($scope.addrList, {name: value});
            }
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.userAddrIdList.length <= 0) {
                if (confirm('检测到您还未选择去过的地方，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.formData.userAddrIdList).success(function (res) {
                    // 保存

                })
            }
        }

    }
    ]);

    // 最近想去的地方
    module.controller("member.want_address", ['app.serviceApi', '$scope', '$ionicPopup', '$filter', '$ionicScrollDelegate', function (api, $scope, $ionicPopup, $filter, $ionicScrollDelegate) {

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
                $scope.scrollSmallToBottom();
            }
            if (action == 'remove' && $scope.formData.userAddrIdList.indexOf(id) != -1) {
                var idx = $scope.formData.userAddrIdList.indexOf(id);
                $scope.formData.userAddrIdList.splice(idx, 1);
                $scope.formData.userAddrList.splice(idx, 1);
                $scope.scrollSmallToTop();
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

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollBottom();
        };

        // 横向滚动至顶部
        $scope.scrollSmallToTop = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        };

        // 关键字搜索
        $scope.search = function (value) {
            if (value == '' || typeof(value) == 'undefined') {
                $scope.addrList = arr;
                $scope.addrList = $filter('filter')($scope.addrList);
            } else {
                $scope.addrList = $filter('filter')($scope.addrList, {name: value});
            }
        }
        $scope.typeTab = 1;

        // 本地（重庆）
        $scope.addrListOne = [
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

        $scope.showTab = function (tab) {
            $scope.typeTab = tab;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.userAddrIdList.length <= 0) {
                if (confirm('检测到您还未选择去过的地方，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.formData.userAddrIdList).success(function (res) {
                    // 保存

                })
            }
        }
    }
    ]);

    // 喜欢的运动
    module.controller("member.sports", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicScrollDelegate', function (api, $scope, $ionicPopup, $ionicScrollDelegate) {

        $scope.formData = [];

        $scope.formData.userSportsIdList = [];
        $scope.formData.userSportsList = [];

        $scope.sportsList = [
            {id: 1, name: '跑步'},
            {id: 2, name: '游泳'},
            {id: 3, name: '骑行'},
            {id: 4, name: '登山'},
            {id: 5, name: '兵乓球'},
            {id: 6, name: '篮球'},
            {id: 7, name: '足球'},
            {id: 8, name: '羽毛球'},
            {id: 9, name: '滑雪'},
            {id: 10, name: '攀岩'},
            {id: 11, name: '户外'},
            {id: 12, name: '高尔夫'}
        ];


        var updateSelected = function (action, id, name) {
            if (action == 'add' && $scope.formData.userSportsIdList.indexOf(id) == -1) {
                $scope.formData.userSportsIdList.push(id);
                $scope.formData.userSportsList.push(name);
                $scope.scrollSmallToBottom();
            }
            if (action == 'remove' && $scope.formData.userSportsIdList.indexOf(id) != -1) {
                var idx = $scope.formData.userSportsIdList.indexOf(id);
                $scope.formData.userSportsIdList.splice(idx, 1);
                $scope.formData.userSportsList.splice(idx, 1);
                $scope.scrollSmallToTop();
            }
        }

        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id, checkbox.name);
        }

        // 判断是否选中
        $scope.isSelected = function (id) {
            return $scope.formData.userSportsIdList.indexOf(id) >= 0;
        }

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollBottom();
        };

        // 横向滚动至顶部
        $scope.scrollSmallToTop = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        };


        // 保存
        $scope.saveData = function () {
            if ($scope.formData.userSportsIdList.length <= 0) {
                if (confirm('检测到您还未选择喜欢的运动，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.formData.userSportsIdList).success(function (res) {
                    // 保存

                })
            }
        }

    }
    ]);

    // 喜欢的电影
    module.controller("member.movie", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicScrollDelegate', '$filter', function (api, $scope, $ionicPopup, $ionicScrollDelegate, $filter) {

        $scope.formData = [];

        $scope.formData.userMovieIdList = [];
        $scope.formData.userMovieList = [];

        $scope.movieList = [
            {id: 1, name: '美人鱼', img: '/wechat/web/images/test/movie1.jpg'},
            {id: 2, name: '飞鹰艾迪', img: '/wechat/web/images/test/movie2.jpg'},
            {id: 3, name: '喜乐长安', img: '/wechat/web/images/test/movie3.jpg'},
            {id: 4, name: '恐怖将映', img: '/wechat/web/images/test/movie4.gif'},
            {id: 5, name: '寻找心中的你', img: '/wechat/web/images/test/movie5.jpg'},
            {id: 6, name: '半熟少女', img: '/wechat/web/images/test/movie6.jpg'},
            {id: 7, name: '功夫熊猫', img: '/wechat/web/images/test/movie7.jpg'},
            {id: 8, name: '谍影特工', img: '/wechat/web/images/test/movie8.jpg'}
        ];

        var arr = [
            {id: 1, name: '美人鱼', img: '/wechat/web/images/test/movie1.jpg'},
            {id: 2, name: '飞鹰艾迪', img: '/wechat/web/images/test/movie2.jpg'},
            {id: 3, name: '喜乐长安', img: '/wechat/web/images/test/movie3.jpg'},
            {id: 4, name: '恐怖将映', img: '/wechat/web/images/test/movie4.gif'},
            {id: 5, name: '寻找心中的你', img: '/wechat/web/images/test/movie5.jpg'},
            {id: 6, name: '半熟少女', img: '/wechat/web/images/test/movie6.jpg'},
            {id: 7, name: '功夫熊猫', img: '/wechat/web/images/test/movie7.jpg'},
            {id: 8, name: '谍影特工', img: '/wechat/web/images/test/movie8.jpg'}
        ];

        var updateSelected = function (action, id, name) {
            if (action == 'add' && $scope.formData.userMovieIdList.indexOf(id) == -1) {
                $scope.formData.userMovieIdList.push(id);
                $scope.formData.userMovieList.push(name);
                $scope.scrollSmallToBottom();
            }
            if (action == 'remove' && $scope.formData.userMovieIdList.indexOf(id) != -1) {
                var idx = $scope.formData.userMovieIdList.indexOf(id);
                $scope.formData.userMovieIdList.splice(idx, 1);
                $scope.formData.userMovieList.splice(idx, 1);
                $scope.scrollSmallToTop();
            }
        }

        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id, checkbox.name);
        }

        // 判断是否选中
        $scope.isSelected = function (id) {
            return $scope.formData.userMovieIdList.indexOf(id) >= 0;
        }

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollBottom();
        };

        // 横向滚动至顶部
        $scope.scrollSmallToTop = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        };

        // 搜索
        $scope.search = function (value) {
            if (value == '' || typeof(value) == 'undefined') {
                $scope.movieList = arr;
                $scope.movieList = $filter('filter')($scope.movieList);
            } else {
                $scope.movieList = $filter('filter')($scope.movieList, {name: value});
            }
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.userMovieIdList.length <= 0) {
                if (confirm('检测到您还未选择想看的电影，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.formData.userMovieIdList).success(function (res) {
                    // 保存

                })
            }
        }

    }
    ]);


    // 喜欢的电影
    module.controller("member.delicacy", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicScrollDelegate', '$filter', function (api, $scope, $ionicPopup, $ionicScrollDelegate, $filter) {

        $scope.formData = [];

        $scope.formData.userDelicacyIdList = [];
        $scope.formData.userDelicacyList = [];

        $scope.delicacyList = [
            {id: 1, name: '爱吃酸'},
            {id: 2, name: '爱吃甜'},
            {id: 3, name: '爱吃辣'},
            {id: 4, name: '爱吃素'},
            {id: 5, name: '爱吃肉'},
            {id: 6, name: '料理'},
            {id: 7, name: '海鲜'},
            {id: 8, name: '西餐'},
            {id: 9, name: '中餐'},
            {id: 10, name: '甜点'},
            {id: 11, name: '咖啡类'},
            {id: 12, name: '酒类'}
        ];

        var updateSelected = function (action, id, name) {
            if (action == 'add' && $scope.formData.userDelicacyIdList.indexOf(id) == -1) {
                $scope.formData.userDelicacyIdList.push(id);
                $scope.formData.userDelicacyList.push(name);
                $scope.scrollSmallToBottom();
            }
            if (action == 'remove' && $scope.formData.userDelicacyIdList.indexOf(id) != -1) {
                var idx = $scope.formData.userDelicacyIdList.indexOf(id);
                $scope.formData.userDelicacyIdList.splice(idx, 1);
                $scope.formData.userDelicacyList.splice(idx, 1);
                $scope.scrollSmallToTop();
            }
        }

        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id, checkbox.name);
        }

        // 判断是否选中
        $scope.isSelected = function (id) {
            return $scope.formData.userDelicacyIdList.indexOf(id) >= 0;
        }

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollBottom();
        };

        // 横向滚动至顶部
        $scope.scrollSmallToTop = function () {
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        };


        // 保存
        $scope.saveData = function () {
            if ($scope.formData.userDelicacyIdList.length <= 0) {
                if (confirm('检测到您还未选择喜欢的美食，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save(url, $scope.formData.userDelicacyIdList).success(function (res) {
                    // 保存

                })
            }
        }

    }
    ]);

    // 对未来伴侣的期望
    module.controller("member.mate", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.mateText = "";

        // 保存
        $scope.saveData = function () {
            if (ar.trim($scope.formData.mateText) == "") {
                if (confirm('检测到您还未填写任何内容，确定放弃吗？')) {
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

    // 子女状况
    module.controller("member.children", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.childrenList = config_infoData.children;

        $scope.childrenSelect = function (children) {
            $scope.formData.children = children;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.children == "" || typeof($scope.formData.children) == 'undefined') {
                if (confirm('检测到您还未选择子女状况，确定放弃吗？')) {
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

    // 民族
    module.controller("member.nation", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.nationList = config_infoData.nation;

        $scope.nationSelect = function (nation) {
            $scope.formData.nation = nation;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.nation == "" || typeof($scope.formData.nation) == 'undefined') {
                if (confirm('检测到您还未选择民族，确定放弃吗？')) {
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

    // 工作单位
    module.controller("member.work", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.work = "";

        // 保存
        $scope.saveData = function () {
            if (ar.trim($scope.formData.work) == "") {
                if (confirm('检测到您还未填写工作单位，确定放弃吗？')) {
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

    // 年收入
    module.controller("member.salary", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.salaryList = config_infoData.salary;

        $scope.salarySelect = function (salary) {
            $scope.formData.salary = salary;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.salary == "" || typeof($scope.formData.salary) == 'undefined') {
                if (confirm('检测到您还未选择年收入，确定放弃吗？')) {
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

    // 购房情况
    module.controller("member.house", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.houseList = config_infoData.house;

        $scope.houseSelect = function (house) {
            $scope.formData.house = house;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.house == "" || typeof($scope.formData.house) == 'undefined') {
                if (confirm('检测到您还未选择购房情况，确定放弃吗？')) {
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

    // 购车情况
    module.controller("member.car", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.carList = config_infoData.car;

        $scope.carSelect = function (car) {
            $scope.formData.car = car;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.car == "" || typeof($scope.formData.car) == 'undefined') {
                if (confirm('检测到您还未选择购车情况，确定放弃吗？')) {
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

    // 血型
    module.controller("member.blood", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.bloodList = config_infoData.blood;

        $scope.bloodSelect = function (blood) {
            $scope.formData.blood = blood;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.blood == "" || typeof($scope.formData.blood) == 'undefined') {
                if (confirm('检测到您还未选择血型，确定放弃吗？')) {
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

    // 毕业院校
    module.controller("member.school", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.school = "";

        // 保存
        $scope.saveData = function () {
            if (ar.trim($scope.formData.school) == "") {
                if (confirm('检测到您还未填写毕业院校，确定放弃吗？')) {
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

    // 择偶标准-年龄
    module.controller("member.zo_age", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.zo_ageMax = "0";   // 最大年龄
        $scope.formData.zo_ageMin = "18";   // 最小年龄
        $scope.zo_ageMaxList = [];
        $scope.zo_ageMinList = [];
        for (var i = 18; i <= 99; i++) {
            $scope.zo_ageMinList.push(i);
            $scope.zo_ageMaxList.push(i);
        }
        $scope.zo_ageMinSelect = function (ageMin) {
            $scope.zo_ageMaxList = [];
            if (ageMin >= $scope.formData.zo_ageMax) {
                $scope.formData.zo_ageMax = "0";
            }
            for (var i = ageMin; i <= 99; i++) {
                $scope.zo_ageMaxList.push(i);
            }
        }

        // 保存
        $scope.saveData = function () {

            api.save(url, $scope.formData).success(function (res) {
                // 保存

            })
        }
    }]);

    // 择偶标准-身高
    module.controller("member.zo_height", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.zo_heightMax = "0";   // 最大年龄
        $scope.formData.zo_heightMin = "140";   // 最小年龄
        $scope.zo_heightMaxList = [];
        $scope.zo_heightMinList = [];
        for (var i = 140; i <= 260; i++) {
            $scope.zo_heightMinList.push(i);
            $scope.zo_heightMaxList.push(i);
        }
        $scope.zo_heightMinSelect = function (heightMin) {
            $scope.zo_heightMaxList = [];
            if (heightMin >= $scope.formData.zo_heightMax) {
                $scope.formData.zo_heightMax = "0";
            }
            for (var i = heightMin; i <= 260; i++) {
                $scope.zo_heightMaxList.push(i);
            }
        }

        // 保存
        $scope.saveData = function () {

            api.save(url, $scope.formData).success(function (res) {
                // 保存

            })
        }
    }]);

    // 择偶标准-学历
    module.controller("member.zo_education", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.zo_education = "";   // 学历
        $scope.zo_educationList = config_infoData.education;

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.zo_education == "") {
                if (confirm('检测到您还未选择学历要求，确定放弃吗？')) {
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

    // 择偶标准-婚姻状况
    module.controller("member.zo_marriage", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.isSelectedNull = false;
        $scope.marriageList = config_infoData.marriage;

        $scope.formData.userMarriageIDList = [1, 2];   //用户数据  未婚、离异

        // 点击不限
        $scope.SelectedNull = function ($event) {
            if ($event.target.checked) {     // 选中不限
                $scope.isSelectedNull = true;
                $scope.formData.userMarriageIDList = [];
            } else {
                $scope.isSelectedNull = false;
            }
        }

        $scope.selected = function ($event, id) {
            var idx = $scope.formData.userMarriageIDList.indexOf(id);
            if ($event.target.checked && idx == -1) {
                $scope.formData.userMarriageIDList.push(id);
            }
            if (!$event.target.checked && idx != -1) {
                $scope.formData.userMarriageIDList.splice(idx, 1);
            }
        }

        // 判断是否选中
        $scope.isSelected = function (id) {
            return $scope.formData.userMarriageIDList.indexOf(id) >= 0;
        }

        // 保存
        $scope.saveData = function () {

            api.save(url, $scope.formData).success(function (res) {

            })

        }

    }]);

    // 择偶标准-购房情况
    module.controller("member.zo_house", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.zo_house = "0";   // 学历 默认不限
        $scope.zo_houseList = config_infoData.house;

        // 保存
        $scope.saveData = function () {

            api.save(url, $scope.formData).success(function (res) {
                // 保存

            })
        }
    }]);

    // 择偶标准-购车情况
    module.controller("member.zo_car", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.zo_car = "";   // 学历
        $scope.zo_carList = config_infoData.car;

        // 保存
        $scope.saveData = function () {

            api.save(url, $scope.formData).success(function (res) {
                // 保存

            })
        }
    }]);

    // 择偶标准-属相
    module.controller("member.zo_zodiac", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.isSelectedNull = false;
        $scope.zodiacList = config_infoData.zodiac;

        $scope.formData.userZodiacIDList = [1, 2];   //用户数据  鼠、牛

        // 点击不限
        $scope.SelectedNull = function ($event) {
            if ($event.target.checked) {     // 选中不限
                $scope.isSelectedNull = true;
                $scope.formData.userZodiacIDList = [];
            } else {
                $scope.isSelectedNull = false;
            }
        }

        $scope.selected = function ($event, id) {
            var idx = $scope.formData.userZodiacIDList.indexOf(id);
            if ($event.target.checked && idx == -1) {
                $scope.formData.userZodiacIDList.push(id);
            }
            if (!$event.target.checked && idx != -1) {
                $scope.formData.userZodiacIDList.splice(idx, 1);
            }
        }

        // 判断是否选中
        $scope.isSelected = function (id) {
            return $scope.formData.userZodiacIDList.indexOf(id) >= 0;
        }

        // 保存
        $scope.saveData = function () {

            api.save(url, $scope.formData).success(function (res) {

            })

        }

    }]);

    // 择偶标准-星座
    module.controller("member.zo_constellation", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.isSelectedNull = false;
        $scope.constellationList = config_infoData.constellation;

        $scope.formData.userConstellationIDList = [7, 9];   //用户数据  狮子座、天秤座

        // 点击不限
        $scope.SelectedNull = function ($event) {
            if ($event.target.checked) {     // 选中不限
                $scope.isSelectedNull = true;
                $scope.formData.userConstellationIDList = [];
            } else {
                $scope.isSelectedNull = false;
            }
        }

        $scope.selected = function ($event, id) {
            var idx = $scope.formData.userConstellationIDList.indexOf(id);
            if ($event.target.checked && idx == -1) {
                $scope.formData.userConstellationIDList.push(id);
            }
            if (!$event.target.checked && idx != -1) {
                $scope.formData.userConstellationIDList.splice(idx, 1);
            }
        }

        // 判断是否选中
        $scope.isSelected = function (id) {
            return $scope.formData.userConstellationIDList.indexOf(id) >= 0;
        }

        // 保存
        $scope.saveData = function () {

            api.save(url, $scope.formData).success(function (res) {

            })

        }

    }]);

    // 预览资料
    module.controller("member.preview", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading', function (api, $scope, $ionicPopup, $ionicLoading) {
        // 图片放大查看插件
        requirejs(['jquery'], function ($) {
            requirejs(['klass', 'photoswipe'], function (klass, PhotoSwipe) {

                $(document).ready(function () {
                    var myPhotoSwipe = $(".imgItem a").photoSwipe({
                        enableMouseWheel: false,
                        enableKeyboard: false,
                        allowRotationOnUserZoom: true
                    });
                });
            })
        })


    }]);

    // 谁关注了我
    module.controller("member.follow", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading', function (api, $scope, $ionicPopup, $ionicLoading) {
        $scope.followList = [
            {id: 1, realName: '张三', marriage: '未婚', age: '29', height: '180', house: '有房', car: '有车'},
            {id: 1, realName: '李四', marriage: '未婚', age: '35', height: '165', house: '有房', car: 0},
            {id: 1, realName: '王武', marriage: '未婚', age: '41', height: '170', house: 0, car: 0},
            {id: 1, realName: '谭善', marriage: '未婚', age: '34', height: '175', house: '有房', car: 0},
            {id: 1, realName: '赵四', marriage: '未婚', age: '24', height: '170', house: '有房', car: 0}
        ];

        $scope.removeItem = function ($index, item) {
            if (confirm("确认删除？")) {
                // 删除操作

                $scope.followList.splice($index, 1)

            } else {
                return false;
            }
        }
    }]);

    return module;
})


