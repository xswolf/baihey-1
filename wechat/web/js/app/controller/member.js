/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/router', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'config/area'
], function (module) {

    // 我
    module.controller("member.index", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        // 退出登录
        $scope.loginOut = function () {
            api.save('/wap/member/login-out', {}).success(function (res) {
                // 跳转登录页
                ar.delCookie('bhy_u_sex');
                ar.delCookie('bhy_u_city');
                ar.delCookie('bhy_user_id');
                ar.delCookie('bhy_u_cityId');
                ar.delCookie('bhy_u_cityPid');
                localStorage.clear();
                location.href = '/wap/user/login';
            });
        }
    }]);

    // 资料首页
    module.controller("member.information", ['app.serviceApi', '$scope', '$ionicPopup', 'FileUploader', '$ionicLoading', '$ionicActionSheet', function (api, $scope, $ionicPopup, FileUploader, $ionicLoading, $ionicActionSheet) {
        requirejs(['amezeui', 'amezeui_ie8'], function (amezeui, amezeui_ie8) {

        });
        $scope.onTouch = function () {
            console.log('ononon');
        }
        $scope.onRelease = function () {
            console.log('lelele');
        }
        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/thumb-photo'
        });

        $scope.formData = [];
        $scope.imgList = [];
        var head_id = 0;
        var getImgList = function () {
            api.list('/wap/member/photo-list', []).success(function (res) {
                $scope.imgList = res.data;
            });
        }
        getImgList();

        $scope.addNewImg = function () {
            var e = document.getElementById("pic_fileInput");
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            e.dispatchEvent(ev);

            uploader.filters.push({
                name: 'file-type-Res',
                fn: function (item) {
                    if (!ar.msg_file_res_img(item)) {   // 验证文件是否是图片格式
                        $ionicPopup.alert({title: '只能上传图片类型的文件！'});
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
                if (response.status > 0) {
                    if ($scope.imgList.length == 0) { // 第一张上传相片默认设为头像
                        $scope.imgList.push({id: response.id, thumb_path: response.thumb_path, is_head: 1});
                        $scope.userInfo.info.head_pic = response.thumb_path;
                        $scope.setUserStorage();
                    } else {
                        $scope.imgList.push({id: response.id, thumb_path: response.thumb_path, is_head: 0});
                    }
                } else {
                    $ionicPopup.alert({title: '上传图片失败！'});
                }
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {  // 上传出错
                $ionicPopup.alert({title: '上传图片出错！'});
                $scope.hideLoading();  // 隐藏loading
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {  // 上传结束
                $scope.hideLoading();  // 隐藏loading
            };

        }

        // 点击img，功能
        $scope.moreImg = function (index) {
            var id = $scope.imgList[index].id;
            var img = $scope.imgList[index].thumb_path;
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '设为头像'}
                ],
                destructiveText: '删除',
                titleText: '操作照片',
                cancelText: '取消',
                destructiveButtonClicked: function () {  // 点击删除
                    if (confirm("确认删除该照片？")) {
                        // 删除操作
                        api.save('/wap/member/del-photo', {'id': id}).success(function (res) {
                            $scope.imgList.splice(index, 1);
                            hideSheet();
                        });

                    } else {
                        return false;
                    }
                },
                buttonClicked: function (i) {
                    // 设置头像
                    api.save('/wap/member/set-head', {id: id, thumb_path: img}).success(function (res) {
                        $scope.imgList[head_id].is_head = 0;
                        $scope.imgList[index].is_head = 1;
                        head_id = index;
                        $scope.userInfo.info.head_pic = img;
                        $scope.setUserStorage();
                        hideSheet();
                    });
                    return true;
                }

            });

            $scope.dynamicList = [];
            api.list('/wap/member/get-dynamic-list', {user_id: $scope.userInfo.id, page: 0}).success(function (res) {
                for (var i in res.data) {
                    res.data[i].imgList = JSON.parse(res.data[i].pic);
                    $scope.dynamicList.push(res.data[i]);
                }
            });

            $scope.getTravel('went_travel', $scope.userInfo.went_travel);// 我去过的地方
            $scope.getTravel('want_travel', $scope.userInfo.want_travel);// 我想去的地方
            $scope.getConfig('love_sport', $scope.userInfo.love_sport);// 喜欢的运动
            $scope.getConfig('want_film', $scope.userInfo.want_film);// 想看的电影
            $scope.getConfig('like_food', $scope.userInfo.like_food);// 喜欢的食物
        }
    }
    ]);

    // 个人动态
    module.controller("member.dynamic", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.userId = $location.$$search.userId;

        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function (imgList, index) {
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top: 0, bottom: 0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe(pswpElement, photoswipe_ui, imgList, options);
                gallery.init();
            }

        })

        $scope.dynamic = [];

        // 当前登录用户的所有动态，点击加载，每页十条
        $scope.dynamic.list = [
            {
                id: 1, likeNumber: 68, commentNumber: 482, imgList: [
                {src: '/wechat/web/images/test/1.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/2.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/3.jpg', w: 200, h: 200}
            ]
            },
            {
                id: 2, likeNumber: 877, commentNumber: 1882, imgList: [
                {src: '/wechat/web/images/test/6.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/4.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/1.jpg', w: 200, h: 200}
            ]
            },
            {
                id: 3, likeNumber: 95, commentNumber: 381, imgList: [
                {src: '/wechat/web/images/test/2.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/5.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/3.jpg', w: 200, h: 200}
            ]
            },
            {
                id: 4, likeNumber: 1898, commentNumber: 3487, imgList: [
                {src: '/wechat/web/images/test/6.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/1.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/4.jpg', w: 200, h: 200}
            ]
            },
            {
                id: 5, likeNumber: 4577, commentNumber: 8841, imgList: [
                {src: '/wechat/web/images/test/5.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/6.jpg', w: 200, h: 200},
                {src: '/wechat/web/images/test/4.jpg', w: 200, h: 200}
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

        $scope.jump = function () {
            $location.url($location.$$search.tempUrl);
        }

    }]);

    // 个性签名
    module.controller("member.signature", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.personalized = $scope.userInfo.personalized;
        $scope.saveData = function () {
            if ($scope.formData.personalized != '' && $scope.formData.personalized) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.personalized = $scope.formData.personalized;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }

        }

    }]);

    // 真实姓名
    module.controller("member.real_name", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.real_name = $scope.userInfo.info.real_name != '未知' ? $scope.userInfo.info.real_name : '';
        $scope.sex = ar.getCookie('bhy_u_sex') == 1 ? 1 : 0;  // 用户性别
        $scope.saveData = function () {

            if ($scope.formData.real_name != '' && $scope.formData.real_name) {
                var confirm = ar.saveDataConfirm($ionicPopup, '真实姓名一旦填写不可更改，确认保存吗？');
                confirm.then(function (res) {
                    if (res) {
                        api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                            $scope.userInfo.info.real_name = $scope.formData.real_name;
                            $scope.setUserStorage();
                            $location.url('/main/member/information');
                        })
                    } else {
                        return false;
                    }
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 出生年月
    module.controller("member.age", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        // 日期控件
        $scope.settings = {
            theme: 'mobiscroll',
            lang: 'zh',
            display: 'bottom',
            controls: ['date'],
            mode: $scope.mode
        };


        $scope.formData = [];
        $scope.age = '年龄';
        $scope.zodiac = {id: 0, name: '生肖'};
        $scope.constellation = {id: 0, name: '星座'};
        $scope.birthdayChange = function () {
            $scope.age = ar.getAgeByBirthday(ar.DateTimeToDate($scope.formData.birthday)) + '岁';
            $scope.zodiac = ar.getZodicByBirthday(ar.DateTimeToDate($scope.formData.birthday));
            $scope.constellation = ar.getConstellationByBirthday(ar.DateTimeToDate($scope.formData.birthday));
        }

        $scope.saveData = function () {
            if ($scope.formData.birthday && $scope.formData.birthday != '') {
                if (parseInt($scope.age) < 18) {
                    ar.saveDataAlert($ionicPopup, '如果您未满18岁，请退出本站，谢谢合作！');
                    return false;
                }
                var confirm = ar.saveDataConfirm($ionicPopup, '出生年月一旦填写不可更改，确认保存吗？');
                confirm.then(function (res) {
                    if (res) {
                        var formData = [];
                        formData.age = ar.getTimestampByBirthday(ar.DateTimeToDate($scope.formData.birthday)) + '-' + $scope.zodiac.id + '-' + $scope.constellation.id;
                        api.save('/wap/member/save-data', formData).success(function (res) {
                            // 保存
                            $scope.userInfo.info.age = ar.getTimestampByBirthday(ar.DateTimeToDate($scope.formData.birthday));
                            $scope.userInfo.info.zodiac = $scope.zodiac.id;
                            $scope.userInfo.info.constellation = $scope.constellation.id;
                            $scope.setUserStorage();
                            $location.url('/main/member/information');
                        })
                    } else {
                        return false;
                    }
                });
            } else {
                $location.url('/main/member/information');
            }
        }

    }]);

    // 身高
    module.controller("member.height", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.height = $scope.userInfo.info.height == '未知' ? '' : $scope.userInfo.info.height;

        $scope.heightList = config_infoData.height;

        $scope.saveData = function () {

            if ($scope.formData.height != '' && $scope.formData.height) {
                var confirm = ar.saveDataConfirm($ionicPopup, '身高一旦填写不可更改，确认保存吗？');
                confirm.then(function (res) {
                    if (res) {
                        api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                            $scope.userInfo.info.height = $scope.formData.height;
                            $scope.setUserStorage();
                            $location.url('/main/member/information');
                        })
                    } else {
                        return false;
                    }
                })
            } else {
                $location.url('/main/member/information');
            }
        }

    }]);

    // 婚姻状况
    module.controller("member.is_marriage", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.is_marriage = $scope.userInfo.info.is_marriage == '未知' ? '' : $scope.userInfo.info.is_marriage;

        $scope.marriageList = config_infoData.marriage;

        $scope.saveData = function () {

            if ($scope.formData.is_marriage != '' && $scope.formData.is_marriage) {
                var confirm = ar.saveDataConfirm($ionicPopup, '婚姻状况一旦填写不可更改，确认保存吗？');
                confirm.then(function (res) {
                    if (res) {
                        api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                            $scope.userInfo.info.is_marriage = $scope.formData.is_marriage;
                            $scope.setUserStorage();
                            $location.url('/main/member/information');
                        })
                    } else {
                        return false;
                    }
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 学历
    module.controller("member.education", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.education = $scope.userInfo.info.education == '未知' ? '' : $scope.userInfo.info.education;

        $scope.educationList = config_infoData.education;

        $scope.saveData = function () {

            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                // 保存
                $scope.userInfo.info.education = $scope.formData.education;
                $scope.setUserStorage();
                $location.url('/main/member/information');
            })
        }
    }]);

    // 职业
    module.controller("member.occupation", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.occupation = $scope.userInfo.info.occupation != '未知' && $scope.userInfo.info.occupation ? $scope.userInfo.info.occupation : 1;
        $scope.children_occupation = $scope.userInfo.info.children_occupation != '未知' && $scope.userInfo.info.children_occupation ? $scope.userInfo.info.children_occupation : 1;

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

            if ($scope.useroccSmall == 0) {
                $ionicPopup.alert({title: '请选择工作岗位'});
                return false;
            } else {
                $scope.formData.occupation = $scope.useroccBig + '-' + $scope.useroccSmall;
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.occupation = $scope.useroccBig;
                    $scope.userInfo.info.children_occupation = $scope.useroccSmall;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            }
        }

    }]);

    // 地区
    module.controller("member.address", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        // 加载数据
        $scope.provinceList = provines;

        // 用户数据
        var local = '';
        $scope.formData = [];
        $scope.formData.userprovince = ar.getObjById(provines, $scope.userInfo.province);
        $scope.formData.usercity = ar.getObjById(citys, $scope.userInfo.city);
        $scope.formData.userarea = ar.getObjById(area, $scope.userInfo.area);

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
        address('city', $scope.formData.userprovince.id);
        address('area', $scope.formData.usercity.id);

        // 选择省
        $scope.provinceSelect = function (pro) {
            $scope.formData.usercity = "0";
            $scope.formData.userarea = "0";
            $scope.cityList = [];  // 清空数组 市
            $scope.areaList = []; // 清空数组 区
            address('city', pro.id);
            local = pro.name;
        }

        // 选择市
        $scope.citySelect = function (cit) {
            $scope.areaList = []; // 清空数组 区
            address('area', cit.id);
            if (cit == "0") {
                $scope.formData.userarea = "0";
            }
            local = cit.name;
        }

        // 选择区
        $scope.areaSelect = function (are) {
            local = are.name;
        }

        $scope.saveData = function () {
            $scope.addressData = [];
            $scope.addressData.address = $scope.formData.userprovince.id;
            if ($scope.formData.usercity.id > 0) {
                $scope.addressData.address += '-' + $scope.formData.usercity.id;
            } else {
                $scope.addressData.address += '-0';
            }
            if ($scope.formData.userarea.id > 0) {
                $scope.addressData.address += '-' + $scope.formData.userarea.id + '-' + local;
            } else {
                $scope.addressData.address += '-0' + '-' + local;
            }
            api.save('/wap/member/save-data', $scope.addressData).success(function (res) {
                // 保存
                $scope.userInfo.info.local = local;
                $scope.userInfo.province = $scope.formData.userprovince.id;
                if ($scope.formData.usercity.id > 0) {
                    $scope.userInfo.city = $scope.formData.usercity.id;
                } else {
                    $scope.userInfo.city = '0';
                }
                if ($scope.formData.userarea.id > 0) {
                    $scope.userInfo.area = $scope.formData.userarea.id;
                } else {
                    $scope.userInfo.area = '0';
                }
                $scope.setUserStorage();
                $location.url('/main/member/information');
            })
        }

    }]);

    // 常出没地
    module.controller("member.haunt_address", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.haunt_address = $scope.userInfo.info.haunt_address != '未知' ? $scope.userInfo.info.haunt_address : '';
        $scope.saveData = function () {
            if ($scope.formData.haunt_address != '' && $scope.formData.haunt_address) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.haunt_address = $scope.formData.haunt_address;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }

    }]);

    // 微信号
    module.controller("member.wechat_number", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.wechat = $scope.userInfo.info.wechat != '未知' ? $scope.userInfo.info.wechat : '';
        $scope.saveData = function () {
            if ($scope.formData.wechat != '' && $scope.formData.wechat) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.wechat = $scope.formData.wechat;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }

    }]);

    // QQ号
    module.controller("member.qq_number", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.qq = $scope.userInfo.info.qq != '未知' ? $scope.userInfo.info.qq : '';
        $scope.saveData = function () {
            if ($scope.formData.qq != '' && $scope.formData) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.qq = $scope.formData.qq;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }

    }]);

    // 去过的地方
    module.controller("member.been_address", ['app.serviceApi', '$scope', '$ionicPopup', '$filter', '$ionicScrollDelegate', '$ionicLoading', '$location', function (api, $scope, $ionicPopup, $filter, $ionicScrollDelegate, $ionicLoading, $location) {

        $scope.formData = [];
        $scope.formData.userAddrIdList = $scope.userInfo.went_travel != null && $scope.userInfo.went_travel ? $scope.userInfo.went_travel.split(',') : [];// 用户已选择的地区，ID数据集，存数据库
        $scope.isMore = true;
        $scope.typeTab = 1;     // 默认国内
        $scope.domestic = [];   // 国内
        $scope.abroad = [];     // 国外
        $scope.data = [];
        $scope.pageSize = 1;     // 默认一页显示3条
        api.list('/wap/member/went-travel-list', {}).success(function (res) {    //typeId:2，国内。 typeId:3，国外
            $scope.data = res.data;
            for (var i in $scope.data) {
                for (var j in $scope.formData.userAddrIdList) {
                    if ($scope.formData.userAddrIdList[j] == $scope.data[i].id) {
                        $scope.data[i].checked = true;
                        break;
                    } else {
                        $scope.data[i].checked = false;
                    }
                }
                if ($scope.data[i].type == 2 && $scope.data[i].parentId == 0) {
                    $scope.domestic.push($scope.data[i]);
                }
                if ($scope.data[i].type == 3 && $scope.data[i].parentId == 0) {
                    $scope.abroad.push($scope.data[i]);
                }
            }
        });

        // 加载更多
        $scope.loadMore = function (typeTab) {
            if (typeTab == 1) {
                if ($scope.pageSize == $scope.domestic.length) {
                    $scope.isMore = false;
                }
            } else {
                if ($scope.pageSize == $scope.abroad.length) {
                    $scope.isMore = false;
                }
            }
            $scope.pageSize += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore;
        }

        // 删除
        $scope.remove = function (event) {
            $scope.data[event].checked = false;
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        }

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function (event) {
            if (event.target.checked) {
                $ionicScrollDelegate.$getByHandle('small').scrollBottom();
            } else {
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }
        };

        $scope.showTab = function (tab) {
            $scope.typeTab = tab;
        }

        // 保存
        $scope.saveData = function () {
            $ionicLoading.show({template: '保存中...'});
            var formData = {went_travel: []};
            for (var i in $scope.data) {
                if ($scope.data[i].checked) {
                    formData.went_travel.push($scope.data[i].id);
                }
            }
            formData.went_travel = formData.went_travel.join(',');
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.went_travel = formData.went_travel;
                $scope.setUserStorage();
                $ionicLoading.hide();
                $location.url('/main/member/information');
            });


        }

    }
    ]);

    // 最近想去的地方
    module.controller("member.want_address", ['app.serviceApi', '$scope', '$ionicPopup', '$filter', '$ionicScrollDelegate', '$ionicLoading', '$location', function (api, $scope, $ionicPopup, $filter, $ionicScrollDelegate, $ionicLoading, $location) {

        $scope.formData = [];
        $scope.formData.userAddrIdList = $scope.userInfo.want_travel != null && $scope.userInfo.want_travel ? $scope.userInfo.want_travel.split(',') : [];  // 用户已选择的地区，ID数据集，存数据库
        $scope.isMore = true;
        $scope.typeTab = 1;     // 默认国内
        $scope.domestic = [];   // 国内
        $scope.abroad = [];     // 国外
        $scope.data = [];
        $scope.pageSize = 1;     // 默认一页显示3条
        api.list('/wap/member/went-travel-list', {}).success(function (res) {    //typeId:2，国内。 typeId:3，国外
            $scope.data = res.data;
            for (var i in $scope.data) {
                for (var j in $scope.formData.userAddrIdList) {
                    if ($scope.formData.userAddrIdList[j] == $scope.data[i].id) {
                        $scope.data[i].checked = true;
                        break;
                    } else {
                        $scope.data[i].checked = false;
                    }
                }
                if ($scope.data[i].type == 2 && $scope.data[i].parentId == 0) {
                    $scope.domestic.push($scope.data[i]);
                }
                if ($scope.data[i].type == 3 && $scope.data[i].parentId == 0) {
                    $scope.abroad.push($scope.data[i]);
                }
            }
        });

        // 加载更多
        $scope.loadMore = function (typeTab) {
            if (typeTab == 1) {
                if ($scope.pageSize == $scope.domestic.length) {
                    $scope.isMore = false;
                }
            } else {
                if ($scope.pageSize == $scope.abroad.length) {
                    $scope.isMore = false;
                }
            }
            $scope.pageSize += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore;
        }

        // 删除
        $scope.remove = function (index) {
            $scope.data[index].checked = false;
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        }

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function (event) {
            if (event.target.checked) {
                $ionicScrollDelegate.$getByHandle('small').scrollBottom();
            } else {
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }
        };

        $scope.showTab = function (tab) {
            $scope.typeTab = tab;
        }

        // 保存
        $scope.saveData = function () {
            $ionicLoading.show({template: '保存中...'});
            var formData = {want_travel: []};
            for (var i in $scope.data) {
                if ($scope.data[i].checked) {
                    formData.want_travel.push($scope.data[i].id);
                }
            }
            formData.want_travel = formData.want_travel.join(',');
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.want_travel = formData.want_travel;
                $scope.setUserStorage();
                $ionicLoading.hide();
                $location.url('/main/member/information');
            });

        }
    }
    ]);

    // 喜欢的运动
    module.controller("member.sports", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicScrollDelegate', '$ionicLoading', '$location', function (api, $scope, $ionicPopup, $ionicScrollDelegate, $ionicLoading, $location) {

        $scope.formData = [];
        $scope.formData.userSportsIdList = $scope.userInfo.love_sport != null && $scope.userInfo.love_sport ? $scope.userInfo.love_sport.split(',') : [];  // 用户数据

        // 默认数据处理
        api.list('/wap/member/config-list', {'type': 1}).success(function (res) {
            $scope.sportsList = res.data;
            for (var i in $scope.sportsList) {
                for (var j in $scope.formData.userSportsIdList) {
                    if ($scope.formData.userSportsIdList[j] == $scope.sportsList[i].id) {
                        $scope.sportsList[i].checked = true;
                        break;
                    } else {
                        $scope.sportsList[i].checked = false;
                    }
                }
            }
        });

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function (event) {
            if (event.target.checked) {
                $ionicScrollDelegate.$getByHandle('small').scrollBottom();
            } else {
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }
        };

        // 删除
        $scope.remove = function (index) {
            $scope.sportsList[index].checked = false;
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        }

        // 保存
        $scope.saveData = function () {
            $ionicLoading.show({template: '保存中...'});
            var formData = {love_sport: []};
            for (var i in $scope.sportsList) {
                if ($scope.sportsList[i].checked) {
                    formData.love_sport.push($scope.sportsList[i].id);
                }
            }
            formData.love_sport = formData.love_sport.join(',');
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.love_sport = formData.love_sport;
                $scope.setUserStorage();
                $ionicLoading.hide();
                $location.url('/main/member/information');
            });
        }

    }
    ]);

    // 喜欢的电影
    module.controller("member.movie", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicScrollDelegate', '$filter', '$ionicLoading', '$location', function (api, $scope, $ionicPopup, $ionicScrollDelegate, $filter, $ionicLoading, $location) {

        $scope.formData = [];
        $scope.formData.userMovieIdList = $scope.userInfo.want_film != null && $scope.userInfo.want_film ? $scope.userInfo.want_film.split(',') : [];

        // 默认数据处理
        api.list('/wap/member/config-list', {'type': 2}).success(function (res) {
            $scope.list = res.data;
            for (var i in $scope.list) {
                for (var j in $scope.formData.userMovieIdList) {
                    if ($scope.list[i].id == $scope.formData.userMovieIdList[j]) {
                        $scope.list[i].checked = true;
                        break;
                    } else {
                        $scope.list[i].checked = false;
                    }
                }
            }
        });

        // 删除
        $scope.remove = function (index) {
            $scope.list[index].checked = false;
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        }

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function (event) {
            if (event.target.checked) {
                $ionicScrollDelegate.$getByHandle('small').scrollBottom();
            } else {
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }
        };

        // 保存
        $scope.saveData = function () {

            $ionicLoading.show({template: '保存中...'});
            var formData = {want_film: []};
            for (var i in $scope.list) {
                if ($scope.list[i].checked) {
                    formData.want_film.push($scope.list[i].id);
                }
            }
            formData.want_film = formData.want_film.join(',');
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.want_film = formData.want_film;
                $scope.setUserStorage();
                $ionicLoading.hide();
                $location.url('/main/member/information');
            });
        }

    }
    ]);

    // 喜欢的美食
    module.controller("member.delicacy", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicScrollDelegate', '$filter', '$ionicLoading', '$location', function (api, $scope, $ionicPopup, $ionicScrollDelegate, $filter, $ionicLoading, $location) {

        $scope.formData = [];
        $scope.formData.userDelicacyIdList = $scope.userInfo.like_food != null && $scope.userInfo.like_food ? $scope.userInfo.like_food.split(',') : [];
        ;

        // 默认数据处理
        api.list('/wap/member/config-list', {'type': 3}).success(function (res) {
            $scope.foodList = res.data;
            for (var i in $scope.foodList) {
                for (var j in $scope.formData.userDelicacyIdList) {
                    if ($scope.foodList[i].id == $scope.formData.userDelicacyIdList[j]) {
                        $scope.foodList[i].checked = true;
                        break;
                    } else {
                        $scope.foodList[i].checked = false;
                    }
                }
            }
        });

        // 删除
        $scope.remove = function (index) {
            $scope.foodList[index].checked = false;
            $ionicScrollDelegate.$getByHandle('small').scrollTop();
        }

        // 横向滚动至底部
        $scope.scrollSmallToBottom = function (event) {
            if (event.target.checked) {
                $ionicScrollDelegate.$getByHandle('small').scrollBottom();
            } else {
                $ionicScrollDelegate.$getByHandle('small').scrollTop();
            }
        };

        // 保存
        $scope.saveData = function () {
            $ionicLoading.show({template: '保存中...'});
            var formData = {like_food: []};
            for (var i in $scope.foodList) {
                if ($scope.foodList[i].checked) {
                    formData.like_food.push($scope.foodList[i].id);
                }
            }
            formData.like_food = formData.like_food.join(',');
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.like_food = formData.like_food;
                $scope.setUserStorage();
                $ionicLoading.hide();
                $location.url('/main/member/information');
            });
        }

    }
    ]);

    // 对未来伴侣的期望
    module.controller("member.mate", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.mate = $scope.userInfo.info.mate != '未知' && $scope.userInfo.info.mate != undefined ? $scope.userInfo.info.mate : '';

        // 保存
        $scope.saveData = function () {
            if (ar.trim($scope.formData.mate)) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.mate = $scope.formData.mate;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 子女状况
    module.controller("member.children", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.is_child = $scope.userInfo.info.is_child != '未知' && $scope.userInfo.info.is_child ? $scope.userInfo.info.is_child : '';
        $scope.childrenList = config_infoData.children;

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.is_child) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.is_child = $scope.formData.is_child;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }

    }]);

    // 民族
    module.controller("member.nation", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.nation = $scope.userInfo.info.nation != '未知' && $scope.userInfo.info.nation ? $scope.userInfo.info.nation : '';
        $scope.nationList = config_infoData.nation;

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.nation) {
                var confirm = ar.saveDataConfirm($ionicPopup, '民族一旦填写不可更改，确认保存吗？');
                confirm.then(function (res) {
                    if (res) {
                        api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                            $scope.userInfo.info.nation = $scope.formData.nation;
                            $scope.setUserStorage();
                            $location.url('/main/member/information');
                        })
                    } else {
                        return false;
                    }
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 工作单位
    module.controller("member.work", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.work = $scope.userInfo.info.work != '未知' ? $scope.userInfo.info.work : '';

        // 保存
        $scope.saveData = function () {
            if (ar.trim($scope.formData.work)) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.work = $scope.formData.work;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 年收入
    module.controller("member.salary", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.year_income = $scope.userInfo.info.year_income != '未知' ? $scope.userInfo.info.year_income : '';
        $scope.salaryList = config_infoData.salary;

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.year_income) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.year_income = $scope.formData.year_income;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 购房情况
    module.controller("member.house", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.is_purchase = $scope.userInfo.info.is_purchase != '未知' ? $scope.userInfo.info.is_purchase : '';
        $scope.houseList = config_infoData.house;

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.is_purchase) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.is_purchase = $scope.formData.is_purchase;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 购车情况
    module.controller("member.car", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.is_car = $scope.userInfo.info.is_car != '未知' ? $scope.userInfo.info.is_car : '';
        $scope.carList = config_infoData.car;

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.is_car) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.is_car = $scope.formData.is_car;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 血型
    module.controller("member.blood", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.blood = $scope.userInfo.info.blood != '未知' ? $scope.userInfo.info.blood : '';
        $scope.bloodList = config_infoData.blood;

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.blood) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.blood = $scope.formData.blood;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 毕业院校
    module.controller("member.school", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.school = $scope.userInfo.info.school != '未知' ? $scope.userInfo.info.school : '';

        // 保存
        $scope.saveData = function () {
            if (ar.trim($scope.formData.school)) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.school = $scope.formData.school;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 择偶标准-年龄
    module.controller("member.zo_age", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {
        $scope.formData = [];
        $scope.formData.zo_age = '18-22';  //TODO 改为用户真实数据
        // 年龄范围 控件
        var minAge = [], maxAge = [];
        for (var i = 18; i <= 99; i++) {
            maxAge.push(i);
            if (i < 99) {
                minAge.push(i);
            }
        }
        $scope.settingsAge = {
            theme: 'mobiscroll',
            lang: 'zh',
            display: 'bottom',
            rows: 5,
            wheels: [
                [{
                    circular: false,
                    data: minAge,
                    label: '最低年龄'
                }, {
                    circular: false,
                    data: maxAge,
                    label: '最高年龄'
                }]
            ],
            showLabel: true,
            minWidth: 130,
            cssClass: 'md-pricerange',
            validate: function (event, inst) {
                var i,
                    values = event.values,
                    disabledValues = [];

                for (i = 0; i < maxAge.length; ++i) {
                    if (maxAge[i] <= values[0]) {
                        disabledValues.push(maxAge[i]);
                    }
                }
                return {
                    disabled: [
                        [], disabledValues
                    ]
                }
            },
            formatValue: function (data) {
                return data[0] + '-' + data[1];
            },
            parseValue: function (valueText) {
                if (valueText) {
                    return valueText.replace(/\s/gi, '').split('-');
                }
                return [18, 22];
            }
        };

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.zo_age) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.zo_age = $scope.formData.zo_age;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }

        }
    }]);

    // 择偶标准-身高
    module.controller("member.zo_height", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {
        $scope.formData = [];
        $scope.formData.zo_height = '160-180';  //TODO 改为用户真实数据
        // 身高范围
        var minHeight = [], maxHeight = [];
        for (var i = 140; i <= 260; i++) {
            maxHeight.push(i);
            if (i < 260) {
                minHeight.push(i);
            }
        }
        $scope.settingsHeight = {
            theme: 'mobiscroll',
            lang: 'zh',
            display: 'bottom',
            rows: 5,
            wheels: [
                [{
                    circular: false,
                    data: minHeight,
                    label: '最低身高(厘米)'
                }, {
                    circular: false,
                    data: maxHeight,
                    label: '最高身高(厘米)'
                }]
            ],
            showLabel: true,
            minWidth: 130,
            cssClass: 'md-pricerange',
            validate: function (event, inst) {
                var i,
                    values = event.values,
                    disabledValues = [];

                for (i = 0; i < maxHeight.length; ++i) {
                    if (maxHeight[i] <= values[0]) {
                        disabledValues.push(maxHeight[i]);
                    }
                }

                return {
                    disabled: [
                        [], disabledValues
                    ]
                }
            },
            formatValue: function (data) {
                return data[0] + '-' + data[1];
            },
            parseValue: function (valueText) {
                if (valueText) {
                    return valueText.replace(/\s/gi, '').split('-');
                }
                return [160, 180];
            }
        };

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.zo_height) {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    $scope.userInfo.info.zo_height = $scope.formData.zo_height;
                    $scope.setUserStorage();
                    $location.url('/main/member/information');
                })
            } else {
                $location.url('/main/member/information');
            }
        }
    }]);

    // 择偶标准-学历
    module.controller("member.zo_education", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.zo_education = $scope.userInfo.info.zo_education != '未知' ? $scope.userInfo.info.zo_education : '';
        $scope.zo_educationList = config_infoData.education;

        // 保存
        $scope.saveData = function () {
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.info.zo_education = $scope.formData.zo_education;
                $scope.setUserStorage();
                $location.url('/main/member/information');
            })
        }
    }]);

    // 择偶标准-婚姻状况
    module.controller("member.zo_marriage", ['app.serviceApi', '$scope', '$ionicPopup', '$location', '$ionicLoading', function (api, $scope, $ionicPopup, $location, $ionicLoading) {
        $scope.formData = [];
        $scope.marriageList = config_infoData.marriage;
        $scope.isNull = $scope.userInfo.info.zo_marriage == '未知' || !$scope.userInfo.info.zo_marriage ? true : false;
        for (var i in $scope.marriageList) {
            for (var j in $scope.userInfo.info.zo_marriage) {
                if ($scope.userInfo.info.zo_marriage[j] == $scope.marriageList[i].id) {
                    $scope.marriageList[i].checked = true;
                    break;
                } else {
                    $scope.marriageList[i].checked = false;
                }
            }
        }

        $scope.isNullFunc = function (event) {
            if (event.target.checked) {
                for (var i in $scope.marriageList) {
                    $scope.marriageList[i].checked = false;
                }
            }
        }

        // 保存
        $scope.saveData = function () {
            $ionicLoading.show({template: '保存中...'});
            var formData = [];
            for (var i in $scope.marriageList) {
                if ($scope.marriageList[i].checked) {
                    formData.zo_marriage.push($scope.marriageList[i].id);
                }
            }

            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.info.zo_marriage = formData.zo_marriage;
                $scope.setUserStorage();
                $ionicLoading.hide();
                $location.url('/main/member/information');
            })

        }

    }]);

    // 择偶标准-子女状况
    module.controller("member.zo_children", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];
        $scope.formData.zo_children = $scope.userInfo.info.zo_children != '未知' && $scope.userInfo.info.zo_children ? $scope.userInfo.info.zo_children : '';
        $scope.childrenList = config_infoData.children;

        // 保存
        $scope.saveData = function () {
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.info.zo_children = $scope.formData.zo_children;
                $scope.setUserStorage();
                $location.url('/main/member/information');
            })
        }

    }]);

    // 择偶标准-购房情况
    module.controller("member.zo_house", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];

        $scope.formData.zo_house = $scope.userInfo.info.zo_house != '未知' && $scope.userInfo.info.zo_house ? $scope.userInfo.info.zo_house : '';
        $scope.zo_houseList = config_infoData.house;

        // 保存
        $scope.saveData = function () {
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.info.zo_house = $scope.formData.zo_house;
                $scope.setUserStorage();
                $location.url('/main/member/information');
            })
        }
    }]);

    // 择偶标准-购车情况
    module.controller("member.zo_car", ['app.serviceApi', '$scope', '$ionicPopup', '$location', function (api, $scope, $ionicPopup, $location) {

        $scope.formData = [];

        $scope.formData.zo_car = $scope.userInfo.info.zo_car != '未知' && $scope.userInfo.info.zo_car ? $scope.userInfo.info.zo_car : '';
        $scope.zo_carList = config_infoData.car;

        // 保存
        $scope.saveData = function () {
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.info.zo_car = $scope.formData.zo_car;
                $scope.setUserStorage();
                $location.url('/main/member/information');
            })
        }
    }]);

    // 择偶标准-属相
    module.controller("member.zo_zodiac", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading', '$location', function (api, $scope, $ionicPopup, $ionicLoading, $location) {

        $scope.formData = [];
        $scope.isNull = $scope.userInfo.info.zo_zodiac == '未知' || !$scope.userInfo.info.zo_zodiac ? true : false;
        $scope.isSelectedNull = false;
        $scope.zodiacList = config_infoData.zodiac;
        for (var i in $scope.zodiacList) {
            for (var j in $scope.userInfo.info.zo_zodiac) {
                if ($scope.userInfo.info.zo_zodiac[j] == $scope.zodiacList[i].id) {
                    $scope.zodiacList[i].checked = true;
                    break;
                } else {
                    $scope.zodiacList[i].checked = false;
                }
            }
        }

        $scope.isNullFunc = function (event) {
            if (event.target.checked) {
                for (var i in $scope.zodiacList) {
                    $scope.zodiacList[i].checked = false;
                }
            }
        }

        // 保存
        $scope.saveData = function () {
            $ionicLoading.show({template: '保存中...'});
            var formData = [];
            for (var i in $scope.zodiacList) {
                if ($scope.zodiacList[i].checked) {
                    formData.zo_zodiac.push($scope.zodiacList[i].id);
                }
            }
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.info.zo_zodiac = formData.zo_zodiac;
                $scope.setUserStorage();
                $ionicLoading.hide();
                $location.url('/main/member/information');
            })
        }

    }]);

    // 择偶标准-星座
    module.controller("member.zo_constellation", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading', '$location', function (api, $scope, $ionicPopup, $ionicLoading, $location) {

        $scope.formData = [];
        $scope.constellationList = config_infoData.constellation;
        $scope.isNull = $scope.userInfo.info.zo_constellation == '未知' || !$scope.userInfo.info.zo_constellation ? true : false;
        for (var i in $scope.constellationList) {
            for (var j in $scope.userInfo.info.zo_constellation) {
                if ($scope.userInfo.info.zo_constellation[j] == $scope.constellationList[i].id) {
                    $scope.constellationList[i].checked = true;
                    break;
                } else {
                    $scope.constellationList[i].checked = false;
                }
            }
        }

        $scope.isNullFunc = function (event) {
            if (event.target.checked) {
                for (var i in $scope.constellationList) {
                    $scope.constellationList[i].checked = false;
                }
            }
        }

        // 保存
        $scope.saveData = function () {
            $ionicLoading.show({template: '保存中...'});
            var formData = [];
            for (var i in $scope.constellationList) {
                if ($scope.constellationList[i].checked) {
                    formData.zo_constellation.push($scope.constellationList[i].id);
                }
            }
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.info.zo_constellation = formData.zo_constellation;
                $scope.setUserStorage();
                $ionicLoading.hide();
                $location.url('/main/member/information');
            })
        }

    }]);

    // 预览资料
    module.controller("member.preview", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading', function (api, $scope, $ionicPopup, $ionicLoading) {

        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function (imgList, index) {
                var item = [{}];
                for (var i in imgList) {
                    item[i] = [];
                    var arr = imgList[i].thumb_path.split('.');
                    var attr = arr[0].split('_');
                    item[i].src = imgList[i].thumb_path.replace('thumb', 'picture');
                    item[i].w = attr[1];
                    item[i].h = attr[2];
                }
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };

                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top: 0, bottom: 0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe(pswpElement, photoswipe_ui, item, options);
                gallery.init();
            }

        })


    }]);

    // 关注的人
    module.controller("member.follow", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading', '$location', '$ionicActionSheet', function (api, $scope, $ionicPopup, $ionicLoading, $location, $ionicActionSheet) {
        $scope.followType = typeof $location.$$search.type == 'undefined' ? 'follow' : $location.$$search.type;
        $scope.followList = [];
        loadData();
        function loadData() {
            api.list('/wap/follow/follow-list', {type: $scope.followType}).success(function (res) {
                $scope.followList = res.data;
                for (var i in $scope.followList) {
                    $scope.followList[i].info = JSON.parse($scope.followList[i].info);
                    $scope.followList[i].auth = JSON.parse($scope.followList[i].auth);
                }
            });
        }

        // 取消关注
        $scope.delFollow = function (item, $index) {
            api.get('/wap/follow/del-follow', {
                user_id: ar.getCookie("bhy_user_id"),
                follow_id: item.user_id
            }).success(function (res) {
                if (res.data) {     // 成功
                    $scope.followList.splice($index, 1);
                } else {            // 失败
                    $ionicPopup.alert({title: '取消关注失败'});
                }
            })
        }

        // 切换，我关注的人，关注我的人
        $scope.switching = function (value) {
            $scope.followType = value;
        };

    }]);

    // 查看用户资料
    module.controller("member.user_info", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$location', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $location) {

        // 用于想去的地方，去过的地方等
        var getTravel = function (name, serId) {
            if (serId != null && serId) {
                var arrSer = serId.split(',');
                eval("$scope." + name + "_count = " + arrSer.length);
                api.list('/wap/member/get-travel-list', {'area_id': serId}).success(function (res) {
                    eval("$scope." + name + " = " + JSON.stringify(res.data));
                });
            } else {
                eval("$scope." + name + "_count = " + 0);
            }
        }
        var getConfig = function (name, serId) {
            if (serId != null) {
                var arrSer = serId.split(',');
                eval("$scope." + name + "_count = " + arrSer.length);
                api.list('/wap/member/get-config-list', {'config_id': serId}).success(function (res) {
                    eval("$scope." + name + " = " + JSON.stringify(res.data));
                });
            } else {
                eval("$scope." + name + "_count = " + 0);
            }
        }
        $scope.formData = [];
        $scope.formData.userId = $location.$$search.userId;
        $scope.otherUserInfo = [];
        $scope.imgList = [];
        $scope.dynamicList = [];
        $scope.formData.follow = false;

        api.list("/wap/member/user-info-page-by-id", {'id': $scope.formData.userId}).success(function (res) {
            if(res.status) {
                // 用户信息
                $scope.otherUserInfo = res.userInfo;
                $scope.otherUserInfo.info = JSON.parse($scope.otherUserInfo.info);
                $scope.otherUserInfo.auth = JSON.parse($scope.otherUserInfo.auth);
                // 用户相册
                $scope.imgList = res.userPhoto.length > 0 ?  res.userPhoto : [];
                // 用户动态
                if(res.dynamic) {
                    for (var i in res.dynamic) {
                        res.dynamic[i].imgList = JSON.parse(res.dynamic[i].pic);
                        $scope.dynamicList.push(res.dynamic[i]);
                    }
                }
                // 关注状态
                $scope.formData.follow = res.followStatus;
                $scope.otherUserInfo.went_travel ? getTravel('went_travel', $scope.otherUserInfo.went_travel) : true;// 我去过的地方
                $scope.otherUserInfo.want_travel ? getTravel('want_travel', $scope.otherUserInfo.want_travel) : true;// 我想去的地方
                $scope.otherUserInfo.love_sport ? getConfig('love_sport', $scope.otherUserInfo.love_sport) : true;// 喜欢的运动
                $scope.otherUserInfo.want_film ? getConfig('want_film', $scope.otherUserInfo.want_film) : true;// 想看的电影
                $scope.otherUserInfo.like_food ? getConfig('like_food', $scope.otherUserInfo.like_food) : true;// 喜欢的食物
            }
        });

        $scope.localChat = function () {
            window.location.hash = "#/main/chat?id=" + $scope.otherUserInfo.id + "&head_pic=" + $scope.otherUserInfo.info.head_pic + "&real_name=" + $scope.otherUserInfo.info.real_name + "&sex=" + $scope.otherUserInfo.sex + "&age=" + $scope.otherUserInfo.info.age;
        }

        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function (imgList, index) {

                var item = [{}];
                for (var i in imgList) {
                    item[i] = [];
                    var arr = imgList[i].thumb_path.split('.');
                    var attr = arr[0].split('_');
                    item[i].src = imgList[i].thumb_path.replace('thumb', 'picture');
                    item[i].w = attr[1];
                    item[i].h = attr[2];
                }
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top: 0, bottom: 0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe(pswpElement, photoswipe_ui, item, options);
                gallery.init();
            }

        })

        $scope.jump = function () {
            $location.url($location.$$search.tempUrl);
        }

        var followData = [];
        followData.user_id = ar.getCookie("bhy_user_id");
        followData.follow_id = $scope.formData.userId;
        // 未关注
        /*$scope.formData.follow = false;
        api.getStatus('/wap/follow/get-follow-status', followData).success(function (res) {
            if (res.data) {
                $scope.formData.follow = true;
            }
        });*/
        // 取消关注
        $scope.cancelFollow = function () {
            api.save('/wap/follow/del-follow', followData).success(function (res) {
                if (res.data) {
                    $scope.formData.follow = false;
                    // 成功，提示
                    $ionicPopup.alert({title: '取消关注成功'});
                }
            });
        }

        // 关注
        $scope.addFollow = function () {
            api.save('/wap/follow/add-follow', followData).success(function (res) {
                if (res.data) {
                    $scope.formData.follow = true;
                    // 成功，提示
                    $ionicPopup.alert({title: '加关注成功'});
                }
            });
        }

    }]);

    // 隐私设置
    module.controller("member.privacy", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.$on('$ionicView.beforeEnter', function () {
            api.list('/wap/follow/get-sum-black', {}).success(function (res) {
                $scope.blackSum = res.data;
            });
        });
    }]);

    // 隐私设置-照片权限
    module.controller("member.privacy_pic", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.privacy_pic = $scope.userInfo.privacy_pic ? $scope.userInfo.privacy_pic : 1;

        // 已经离开本页面
        $scope.$on('$ionicView.afterLeave', function () {
            // 保存数据
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.privacy_pic = $scope.formData.privacy_pic;
                $scope.getUserPrivacyStorage('');
            });
        });
    }]);

    // 隐私设置-个人动态权限
    module.controller("member.privacy_per", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.privacy_per = $scope.userInfo.privacy_per ? $scope.userInfo.privacy_per : 1;

        // 已经离开本页面
        $scope.$on('$ionicView.afterLeave', function () {
            // 保存数据
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.privacy_per = $scope.formData.privacy_per;
                $scope.getUserPrivacyStorage('');
            });
        });
    }]);

    // 隐私设置-微信显示权限
    module.controller("member.privacy_wechat", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.privacy_wechat = $scope.userInfo.privacy_wechat ? $scope.userInfo.privacy_wechat : 1;

        // 已经离开本页面
        $scope.$on('$ionicView.afterLeave', function () {
            // 保存数据
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.privacy_wechat = $scope.formData.privacy_wechat;
                $scope.getUserPrivacyStorage('');
            });
        });
    }]);

    // 隐私设置-QQ显示权限
    module.controller("member.privacy_qq", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.privacy_qq = $scope.userInfo.privacy_qq ? $scope.userInfo.privacy_qq : 1;

        // 已经离开本页面
        $scope.$on('$ionicView.afterLeave', function () {
            // 保存数据
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.privacy_qq = $scope.formData.privacy_qq;
                $scope.getUserPrivacyStorage('');
            });
        });
    }]);

    // 隐私设置-黑名单
    module.controller("member.privacy_black", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.followList = [];
        api.list('/wap/follow/black-list', {}).success(function (res) {
            $scope.followList = res.data;
            for (var i in $scope.followList) {
                $scope.followList[i].info = JSON.parse($scope.followList[i].info);
                $scope.followList[i].auth = JSON.parse($scope.followList[i].auth);
            }
        });

        // 解除黑名单
        $scope.removeItem = function ($index, item) {
            api.save('/wap/follow/del-black', {'id': item.id}).success(function (res) {
                $scope.followList.splice($index, 1);
            });
        }
    }]);

    // 账户安全
    module.controller("member.security", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.formData = [];

    }]);

    // 账户安全-密码修改
    module.controller("member.security_pass", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.formData = [];
        // 保存
        $scope.saveData = function () {
            if ($scope.formData.pass == '') {
                $ionicPopup.alert({title: '请填写旧密码'});
                return false;
            }
            if ($scope.formData.new_pass1 == '' || $scope.formData.new_pass1.length < 6) {
                $ionicPopup.alert({title: '密码长度必须大于6个字符'});
                return false;
            }
            if ($scope.formData.new_pass1 != $scope.formData.new_pass1) {
                $ionicPopup.alert({title: '新密码不一致'});
                return false;
            }

            api.save('/wap/user/reset-password', $scope.formData).success(function (res) {
                if (res.data) {
                    $ionicPopup.alert({title: '密码修改成功'});
                    $scope.userInfo.reset_pass_time = parseInt(res.data);
                    $scope.getUserPrivacyStorage('#/main/member/security');
                } else {
                    $ionicPopup.alert({title: '密码修改失败'});
                }
            })

        }

    }]);

    // 账户安全-手机绑定
    module.controller("member.security_phone", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.User = [];
        $scope.User.codeBtn = '获取验证码';
        $scope.User.mobile = $scope.userInfo.phone != null ? $scope.userInfo.phone : '';

        // 开始计时
        $scope.User.startTime = function () {
            $scope.User.max_time -= 1;
            $scope.User.codeBtn = "重新发送" + $scope.User.max_time;
            $scope.$apply();
        }

        // 结束计时，还原文字
        $scope.User.endTime = function () {
            $scope.User.codeSwitch = false;
            $scope.User.codeCls = false;
            $scope.User.codeBtn = '获取验证码';
            clearInterval($scope.User.timer);
            $scope.$apply();
        }

        // 获取验证码
        $scope.User.getCode = function () {

            if (!ar.validateMobile($scope.User.mobile)) {  // 验证手机格式
                $ionicPopup.alert({title: '手机号码格式不正确'});
                return false;
            }

            api.getMobileIsExist($scope.User.mobile).success(function (data) {
                if (!data.status) {
                    $ionicPopup.alert({title: data.msg});
                    return false;
                } else {
                    //计时
                    $scope.User.codeSwitch = true;
                    $scope.User.codeCls = true;
                    $scope.User.max_time = 60;
                    $scope.User.timer = setInterval($scope.User.startTime, 1000);
                    setTimeout($scope.User.endTime, $scope.User.max_time * 1000);

                    // 发送验证码
                    api.sendCodeMsg($scope.User.mobile).success(function (data) {

                        if (!data.status) {
                            $ionicPopup.alert({title: '短信发送失败，请稍后重试。'});
                            return false;
                        }
                    });
                }
            })

            $scope.saveData = function () {

                if ($scope.User.mobile == '') {
                    $ionicPopup.alert({title: '手机号不能为空'});
                    return false;
                }
                api.validateCode($scope.User.code).success(function (res) {
                    if (!res.status) {
                        $ionicPopup.alert({title: '验证码错误'});
                        return false;
                    } else {
                        var formData = [];
                        formData.phone = $scope.User.mobile;
                        api.save('/wap/user/update-user-data', formData).success(function (res) {
                            if (res.data) {
                                $ionicPopup.alert({title: '手机绑定成功'});
                                $scope.userInfo.phone = $scope.User.mobile;
                                $scope.getUserPrivacyStorage('#/main/member/security');
                            } else {
                                $ionicPopup.alert({title: '手机绑定失败'});
                            }
                        })
                    }
                })
            }
        }
    }]);

    // 账户安全-微信绑定
    module.controller("member.security_wechat", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.wechat = $scope.userInfo.info.wechat != '未知' ? $scope.userInfo.info.wechat : '';
        $scope.saveData = function () {
            alert($scope.formData.wechat);
            if ($scope.formData.wechat == '' || typeof($scope.formData.wechat) == 'undefined') {
                if (confirm('检测到您还未填写微信号，确定放弃吗？')) {
                    window.location.hash = '#/main/member/security';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.wechat = $scope.formData.wechat;
                    $scope.getUserPrivacyStorage('#/main/member/security');
                })
            }
        }
    }]);

    // 账户安全-QQ绑定
    module.controller("member.security_qq", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.qq = $scope.userInfo.info.qq != '未知' ? $scope.userInfo.info.qq : '';
        $scope.saveData = function () {
            if ($scope.formData.qq == '' || typeof($scope.formData.qq) == 'undefined') {
                if (confirm('检测到您还未填写微信号，确定放弃吗？')) {
                    window.location.hash = '#/main/member/security';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.qq = $scope.formData.qq;
                    $scope.getUserPrivacyStorage('#/main/member/security');
                })
            }
        }
    }]);

    // 诚信认证
    module.controller("member.honesty", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 诚信认证-身份认证
    module.controller("member.honesty_sfz", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        // 实例化上传图片插件
        var uploader1 = $scope.uploader1 = new FileUploader({
            url: '/wap/file/auth-pictures?auth=identity_pic1'
        });
        var uploader2 = $scope.uploader2 = new FileUploader({
            url: '/wap/file/auth-pictures?auth=identity_pic2'
        });

        $scope.formData = [];
        $scope.formData.real_name = $scope.userInfo.info.real_name != '未知' ? $scope.userInfo.info.real_name : '';
        $scope.formData.identity_id = $scope.userInfo.info.identity_id != '未知' ? $scope.userInfo.info.identity_id : '';
        $scope.formData.identity_address = $scope.userInfo.info.identity_address != '未知' ? $scope.userInfo.info.identity_address : '';

        $scope.addNewImg = function (name) {
            if (name == 'identity_pic1') {
                var uploader = uploader1;
            } else {
                var uploader = uploader2;
            }
            $scope.uploaderImage(uploader, name);
        }

        $scope.saveData = function () {
            if ($scope.formData.real_name == '' || $scope.formData.identity_id == '' || $scope.formData.identity_address == '') {
                if (confirm('检测到您还未填写完整，确定放弃吗？')) {
                    window.location.hash = '#/main/member/honesty';  //跳转
                } else {
                    return false;
                }
            } else {
                var formData = [];
                formData.identity = $scope.formData.real_name + '_' + $scope.formData.identity_id + '_' + $scope.formData.identity_address;
                api.save('/wap/member/save-data', formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.real_name = $scope.formData.real_name;
                    $scope.userInfo.info.identity_id = $scope.formData.identity_id;
                    $scope.userInfo.info.identity_address = $scope.formData.identity_address;
                    $scope.getUserPrivacyStorage('#/main/member/honesty');
                })
            }
        }
    }]);

    // 诚信认证-婚姻认证
    module.controller("member.honesty_marr", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        // 实例化上传图片插件
        var uploader1 = $scope.uploader1 = new FileUploader({
            url: '/wap/file/auth-pictures?auth=marriage_pic1'
        });
        var uploader2 = $scope.uploader2 = new FileUploader({
            url: '/wap/file/auth-pictures?auth=marriage_pic2'
        });

        $scope.addNewImg = function (name) {
            if (name == 'marriage_pic1') {
                var uploader = uploader1;
            } else {
                var uploader = uploader2;
            }
            $scope.uploaderImage(uploader, name);
        }
    }]);

    // 诚信认证-学历认证
    module.controller("member.honesty_edu", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        // 实例化上传图片插件
        var uploader1 = $scope.uploader1 = new FileUploader({
            url: '/wap/file/auth-pictures?auth=education_pic1'
        });
        var uploader2 = $scope.uploader2 = new FileUploader({
            url: '/wap/file/auth-pictures?auth=education_pic2'
        });

        $scope.addNewImg = function (name) {
            if (name == 'education_pic1') {
                var uploader = uploader1;
            } else {
                var uploader = uploader2;
            }
            $scope.uploaderImage(uploader, name);
        }
    }]);

    // 诚信认证-房产认证
    module.controller("member.honesty_housing", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        // 实例化上传图片插件
        var uploader1 = $scope.uploader1 = new FileUploader({
            url: '/wap/file/auth-pictures?auth=house_pic1'
        });
        var uploader2 = $scope.uploader2 = new FileUploader({
            url: '/wap/file/auth-pictures?auth=house_pic2'
        });

        $scope.addNewImg = function (name) {
            if (name == 'house_pic1') {
                var uploader = uploader1;
            } else {
                var uploader = uploader2;
            }
            $scope.uploaderImage(uploader, name);
        }
    }]);

    // 开通VIP
    module.controller("member.vip", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$interval', '$location', function (api, $scope, $timeout, $ionicPopup, $interval, $location) {
        $scope.formData = [];

        $scope.formData.timer = '78时00分12秒';

        // 用户的ID
        $scope.userId = 1;

        // 商品列表
        api.save('/wap/charge/get-charge-goods-list', {type: 1}).success(function (res) {
            $scope.goodsList = res;
        });

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

        // 生成订单并跳转支付
        $scope.createOrder = function (_goodsId) {
            api.save('/wap/charge/produce-order', {
                goodsId: _goodsId,
                user_id: ar.getCookie('bhy_user_id')
            }).success(function (res) {
                if (res.status < 1) {
                    $ionicPopup.alert({title: res.msg});
                } else {
                    $location.url('/main/member_charge?orderId=' + res.data + '&tempUrl=/main/member/vip');
                }
            })
        }

    }]);


    // 嘉瑞红包
    module.controller("member.bribery", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        api.list('/wap/member/bribery-info').success(function (res) {
            $scope.bribery = res.data;
        })

    }]);

    // 嘉瑞红包-收到的红包
    module.controller("member.bribery_rec", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

        $scope.items = [];
        $scope.moreData = true;
        $scope.money = $location.$$search.money;
        $scope.briberyList = [];
        $scope.loadMore = function () {
            api.list('/wap/member/bribery-list', {flag: true, page: $scope.page}).success(function (res) {
                if (res.data == '') {
                    $scope.moreData = false;
                    return;
                }
                var data = ar.cleanQuotes(JSON.stringify(res.data))
                $scope.briberyList = $scope.briberyList.concat(JSON.parse(data));
                $scope.page++;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            })
        };
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.page = 0;
        });

        $scope.moreDataCanBeLoaded = function () {

            return $scope.moreData;
        }

    }]);

    // 嘉瑞红包-发出的红包
    module.controller("member.bribery_send", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {
        $scope.items = [];
        $scope.moreData = true;
        $scope.money = $location.$$search.money;
        $scope.briberyList = [];
        $scope.loadMore = function () {
            api.list('/wap/member/bribery-list', {flag: false, page: $scope.page}).success(function (res) {
                if (res.data == '') {
                    $scope.moreData = false;
                    return;
                }
                var data = ar.cleanQuotes(JSON.stringify(res.data))
                $scope.briberyList = $scope.briberyList.concat(JSON.parse(data));
                $scope.page++;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            })
        };
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.page = 0;
        });

        $scope.moreDataCanBeLoaded = function () {

            return $scope.moreData;
        }


    }]);

    // 嘉瑞红包-红包提现
    module.controller("member.bribery_withdraw", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {


    }]);

    // 嘉瑞红包-选择银行卡
    module.controller("member.bank_card", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.userBankCardList = [
            {id: 1, name: '中国农业银行', 'type': '储蓄卡', cardNumber: '6228480470845947715', 'ad': '农业银行（7715）'},
            {id: 2, name: '中国工商银行', 'type': '储蓄卡', cardNumber: '1565248947890794255', 'ad': '工商银行（4255）'},
            {id: 3, name: '中国建设银行', 'type': '储蓄卡', cardNumber: '3875317856415236881', 'ad': '建设银行（6881）'}
        ]

    }]);

    // 嘉瑞红包-新卡提现
    module.controller("member.add_bank_card", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {


    }]);

    // 嘉瑞红包-发红包
    module.controller("member.bribery_award", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', function (api, $scope, $timeout, $ionicPopup, $ionicModal) {

        $ionicModal.fromTemplateUrl('selectUser.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.bri_submit = function () {
            $scope.openModal();
        }

    }]);

    // 嘉瑞红包-发红包-选择我关注的好友
    module.controller("member.bribery_selectUser", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 我的约会
    module.controller("member.rendezvous", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 我的约会-发布约会
    module.controller("member.rendezvous_add", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$location', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $location) {

        $scope.formData = [];
        if ($location.search().id) {
            api.list('/wap/rendezvous/get-rendezvous-info', {id: $location.search().id}).success(function (res) {
                $scope.formData = res.data;
                $scope.formData.theme = parseInt($scope.formData.theme);
            });
        }

        // 跳转-返回
        $scope.jump = function () {
            if ($location.$$search.tempUrl) {    // 因为只有2种情况，所以只需要判断是否有值
                $location.url('/main/rendezvous');
            } else {
                $location.url('/main/member/rendezvous');
            }
        }


        // 约会主题
        $ionicModal.fromTemplateUrl('themeModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.themeModal = modal;
        });
        $scope.openThemeModal = function () {
            $scope.themeModal.show();
        };
        $scope.closeThemeModal = function () {
            $scope.themeModal.hide();
        };

        // 约会标题
        $ionicModal.fromTemplateUrl('themeTitleModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.themeTitleModal = modal;
        });
        $scope.openThemeTitleModal = function () {
            $scope.themeTitleModal.show();
        };
        $scope.closeThemeTitleModal = function () {
            $scope.themeTitleModal.hide();
        };

        // 性别限制
        $ionicModal.fromTemplateUrl('sexModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.sexModal = modal;
        });
        $scope.openSexModal = function () {
            $scope.sexModal.show();
        };
        $scope.closeSexModal = function () {
            $scope.sexModal.hide();
        };

        // 我的出发地
        $ionicModal.fromTemplateUrl('fromModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.fromModal = modal;
        });
        $scope.openFromModal = function () {
            $scope.fromModal.show();
        };
        $scope.closeFromModal = function () {
            $scope.fromModal.hide();
        };


        // 目的地
        $ionicModal.fromTemplateUrl('destinationModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.destinationModal = modal;
        });
        $scope.openDestinationModal = function () {
            $scope.destinationModal.show();
        };
        $scope.closeDestinationModal = function () {
            $scope.destinationModal.hide();
        };

        // 约会时间
        $ionicModal.fromTemplateUrl('dateModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.dateModal = modal;
        });
        $scope.openDateModal = function () {
            $scope.dateModal.show();
        };
        $scope.closeDateModal = function () {
            $scope.dateModal.hide();
        };

        // 费用说明
        $ionicModal.fromTemplateUrl('moneyModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.moneyModal = modal;
        });
        $scope.openMoneyModal = function () {
            $scope.moneyModal.show();
        };
        $scope.closeMoneyModal = function () {
            $scope.moneyModal.hide();
        };

        // 对约伴的要求
        $ionicModal.fromTemplateUrl('requirementModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.requirementModal = modal;
        });
        $scope.openRequirementModal = function () {
            $scope.requirementModal.show();
        };
        $scope.closeRequirementModal = function () {
            $scope.requirementModal.hide();
        };

        // 默认选项
        $scope.formData.sex = "0";

        $scope.formData.themeList = [
            {id: 1, title: '娱乐'},
            {id: 2, title: '美食'},
            {id: 3, title: '旅游'},
            {id: 4, title: '运动健身'},
            {id: -1, title: '其他'},
        ]

        // 保存，发布
        $scope.saveData = function () {
            $scope.formData.rendezvous_time = ar.currentDate;
            if (!$scope.formData.theme) {
                $ionicPopup.alert({title: '请选择约会主题'});
                return false;
            }
            if (!$scope.formData.title) {
                $ionicPopup.alert({title: '请填写约会标题'});
                return false;
            }

            if (!$scope.formData.destination) {
                $ionicPopup.alert({title: '请填写目的地'});
                return false;
            }
            if (!$scope.formData.rendezvous_time) {
                $ionicPopup.alert({title: '请填写出发时间'});
                return false;
            }
            if (!$scope.formData.fee_des) {
                $ionicPopup.alert({title: '请选择费用说明'});
                return false;
            }

            api.save('/wap/rendezvous/release', $scope.formData).success(function (res) {
                if (res.data) {
                    $ionicPopup.alert({title: '发布成功！'});
                    window.location.hash = '#/main/member/rendezvous_put';
                }
            })
        }

    }]);

    // 我的约会-发布约会-约会主题
    module.controller("member.rendezvous_theme", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.selTheme = function () {

            $scope.closeThemeModal();
        }

    }]);

    // 我的约会-发布约会-约会标题
    module.controller("member.rendezvous_themeTitle", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.save = function () {
            $scope.closeThemeTitleModal();
            console.info($scope.formData.themeTitle, $scope.formData.content);
        }

    }]);

    // 我的约会-发布约会-性别限制
    module.controller("member.rendezvous_sex", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.selSex = function () {
            $scope.closeSexModal();
            console.log($scope.formData.sex);
        }
    }]);

    // 我的约会-发布约会-我的出发地
    module.controller("member.rendezvous_from", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.saveFrom = function () {
            $scope.closeFromModal();
            console.log($scope.formData.from);
        }
    }]);

    // 我的约会-发布约会-目的地
    module.controller("member.rendezvous_destination", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.saveDestination = function () {
            $scope.closeDestinationModal();
            console.log($scope.formData.destination);
        }
    }]);

    // 我的约会-发布约会-出发时间
    module.controller("member.rendezvous_date", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.saveDate = function () {
            $scope.closeDateModal();
            console.log($scope.formData.rendezvous_time);
        }
    }]);

    // 我的约会-发布约会-费用说明
    module.controller("member.rendezvous_money", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.selMoney = function () {
            $scope.closeMoneyModal();
            console.log($scope.formData.fee_des);
        }
    }]);

    // 我的约会-发布约会-对约伴的要求
    module.controller("member.rendezvous_requirement", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.userSex = 0;  // 用户性别 默认女0

        $scope.labelList = config_infoData.label;

        $scope.lab = [];

        $scope.nothing = false;  // 不限


        // 添加标签
        $scope.addLabel = function (value) {
            if ($scope.lab.indexOf(value) == -1) {  // 标签不存在才允许添加
                $scope.lab.push(value);
            }
            if (value == '不限') {
                $scope.lab = [];
                $scope.lab.push(value);
                $scope.nothing = true;
            }
        }

        // 删除标签
        $scope.removeLabel = function (index, value) {
            if (value == '不限') {
                $scope.nothing = false;
            }
            $scope.lab.splice(index, 1);
        }

        $scope.saveRequirement = function () {
            $scope.closeRequirementModal();
            $scope.formData.we_want = $scope.lab.join(',');
            console.log($scope.formData.we_want);
        }
    }]);


    // 我的约会-我发布的约会
    module.controller("member.rendezvous_put", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicActionSheet', '$location', '$ionicScrollDelegate', function (api, $scope, $timeout, $ionicPopup, $ionicActionSheet, $location, $ionicScrollDelegate) {

        $scope.formData = [];
        $scope.dateList = [];
        $scope.putList = [];
        $scope.formData.pageNum = 0;
        // 获取我发布的约会列表
        var getPutList = function (date, pageNum) {
            var formData = [];
            formData.user_id = ar.getCookie('bhy_user_id');
            formData.pageNum = pageNum + 1;
            formData.date = date;
            $scope.formData.date = date;
            $scope.formData.pageNum = pageNum + 1;
            api.list('/wap/rendezvous/list', formData).success(function (res) {
                res.data.length < 10 ? $scope.isMore = false : $scope.isMore = true;
                for (var i in res.data) {
                    var label = res.data[i].we_want.split(',');
                    res.data[i].label = [];
                    res.data[i].label = label;
                    $scope.putList.push(res.data[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        // 修改约会状态
        var upStatus = function (id, status) {
            var formData = [];
            formData.id = id;
            formData.status = status;
            api.save('/wap/rendezvous/update-status', formData).success(function (res) {
            });
        }
        // 只能查看最近半年的数据
        for (var i = 0; i < 6; i++) {
            var dt = new Date();
            dt.setMonth(dt.getMonth() - i);
            var _title = dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月';
            var _time = dt.getFullYear() + '-' + (dt.getMonth() + 1);
            $scope.dateList.push({title: _title, value: dt.toLocaleString(), time: _time});
        }
        $scope.dateTitle = $scope.dateList[0].title; // 默认当前月
        var arr = $scope.dateList[0].time.split('-');
        $scope.formData.year = arr[0];
        $scope.formData.month = arr[1] < 10 ? '0' + arr[1] : arr[1];
        $scope.datePicker = false;
        $scope.showDate = function () {
            $scope.datePicker = !$scope.datePicker;
        }

        // 选择日期改变样式、并查询数据
        $scope.seletedDate = function (title, time) {
            $scope.dateTitle = title;
            var arr = time.split('-');
            $scope.formData.year = arr[0];
            $scope.formData.month = arr[1] < 10 ? '0' + arr[1] : arr[1];
            getPutList(time, 0);
            $scope.putList = []; // 根据日期查询的数据
            $scope.datePicker = false;
        }

        $scope.isMore = true;

        // 加载更多
        $scope.loadMore = function () {
            getPutList($scope.formData.date, $scope.formData.pageNum);
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore;
        }

        // 操作
        $scope.showhandle = function (id, itemIndex) {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '关闭'},
                    {text: '修改'}
                ],
                destructiveText: '删除',
                titleText: '操作',
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                destructiveButtonClicked: function () {
                    var confirmPopup = $ionicPopup.confirm({
                        title: '确定删除此条记录？删除后不可恢复。',
                        template: false,
                        cancelText: '点错了',
                        okText: '确定'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            // 删除
                            upStatus($scope.putList[itemIndex].id, 0);
                            $scope.putList.splice(itemIndex, 1);
                            hideSheet();
                        } else {
                            return false;
                        }
                    });
                },
                buttonClicked: function (index) {
                    if (index == 0) {  // 关闭约会
                        $scope.putList[itemIndex].status = "3";
                        upStatus($scope.putList[itemIndex].id, 3);
                        hideSheet();
                    }
                    if (index == 1) { // 修改
                        $location.url('/main/member/rendezvous_add?id=' + $scope.putList[itemIndex].id);
                    }
                }
            });
        }

        // 跳转-参与的人
        $scope.involved = function (id, theme, title) {
            $location.url('/main/member/rendezvous_involved?id=' + id + '&theme=' + theme + '&title=' + title);
        }

        $scope.openTxt = false;
        // 展开全文
        $scope.openText = function ($event) {
            $event.stopPropagation();
            $scope.openTxt = true;
        }


    }]);

    // 我的约会-我参与的约会
    module.controller("member.rendezvous_part", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.formData = [];
        $scope.partList = [];
        $scope.formData.pageNum = 0;
        var getPutList = function (pageNum) {
            var formData = [];
            formData.user_id = ar.getCookie('bhy_user_id');
            formData.pageNum = pageNum + 1;
            $scope.formData.pageNum = pageNum + 1;
            api.list('/wap/rendezvous/apply-list', formData).success(function (res) {
                res.data.length < 10 ? $scope.isMore = false : $scope.isMore = true;
                for (var i in res.data) {
                    var label = res.data[i].we_want.split(',');
                    res.data[i].label = [];
                    res.data[i].label = label;
                    res.data[i].info = JSON.parse(res.data[i].info);
                    res.data[i].auth = JSON.parse(res.data[i].auth);
                    $scope.partList.push(res.data[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        $scope.isMore = true;

        // 加载更多
        $scope.loadMore = function () {
            getPutList($scope.formData.pageNum);
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore;
        }

        $scope.delPart = function (id, itemIndex) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确定删除此条记录？删除后将不显示在对方参与列表。',
                template: false,
                cancelText: '点错了',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // 删除
                    api.save('/wap/rendezvous/delete-apply', {id: id}).success(function (res) {
                        $scope.partList.splice(itemIndex, 1);
                    });
                } else {
                    return false;
                }
            });
        }

        $scope.openTxt = false;
        // 展开全文
        $scope.openText = function ($event) {
            $event.stopPropagation();
            $scope.openTxt = true;
        }

        $scope.acceptAlert = function (phone) {
            if (phone == null || typeof(phone) == undefined) {
                $ionicPopup.alert({title: '请等待TA联系'});
            } else {
                $ionicPopup.alert({title: 'TA的手机号码：' + phone});
            }
        }

    }]);

    // 我的约会-参与的人
    module.controller("member.rendezvous_involved", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

        $scope.partList = [];
        $scope.rendzvous = [];
        $scope.involvedList = [];
        $scope.rendzvous.id = $location.$$search.id;
        $scope.rendzvous.title = $location.$$search.title;
        $scope.rendzvous.theme = $location.$$search.theme;

        api.list('/wap/rendezvous/rendezvous-apply-list', {id: $location.$$search.id}).success(function (res) {
            $scope.involvedList = res.data;
            for (var i in res.data) {
                $scope.involvedList[i].info = JSON.parse(res.data[i].info);
                $scope.involvedList[i].auth = JSON.parse(res.data[i].auth);
            }
        });

        $scope.isAccept = false;
        $scope.isIgnore = false;
        // 接受
        $scope.accept = function (id, itemIndex) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确定接受吗？',
                template: false,
                cancelText: '点错了',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // 确定
                    var formData = [];
                    formData.id = id;
                    formData.status = 1;
                    api.save('/wap/rendezvous/update-apply-status', formData).success(function (res) {
                        $scope.involvedList[itemIndex].status = 1;
                    });
                    $scope.isAccept = true;
                } else {
                    return false;
                }
            });
        }

        // 忽略
        $scope.ignore = function (id, itemIndex) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确定忽略吗？',
                template: false,
                cancelText: '点错了',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // 确定
                    var formData = [];
                    formData.id = id;
                    formData.status = 2;
                    api.save('/wap/rendezvous/update-apply-status', formData).success(function (res) {
                        $scope.involvedList[itemIndex].status = 2;
                    });
                    $scope.isIgnore = true;
                } else {
                    return false;
                }
            });
        }


    }]);

    // 我的专属红娘
    module.controller("member.matchmaker", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

        $scope.matchmakerList = [];
        var formData = [];
        formData.matchmaker = $scope.userInfo.matchmaking ? $scope.userInfo.matchmaker + '-' + $scope.userInfo.matchmaking : $scope.userInfo.matchmaker;
        api.list('/wap/matchmaker/user-matchmaker-list', formData).success(function (res) {
            $scope.matchmakerList = res.data;
            if (res.data.length > 1) {
                if (res.data[0].id != $scope.userInfo.matchmaker) {
                    $scope.matchmakerList[0] = res.data[1];
                    $scope.matchmakerList[1] = res.data[0];
                }
            }
        });
        $scope.value = 0;
        $scope.toggle = function (i) {
            $scope.value = i;
        }

    }]);

    // 红娘服务的四大优势
    module.controller("member.matchmaker_service", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

    // 关于嘉瑞
    module.controller("member.about", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

    // 帮助中心
    module.controller("member.help", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

    module.controller("member.help_notice", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

    module.controller("member.help_appointment", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

    module.controller("member.help_protocol", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

    return module;
})


