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
    module.controller("member.information", ['app.serviceApi', '$scope', '$ionicPopup', 'FileUploader', '$ionicLoading', '$ionicActionSheet', function (api, $scope, $ionicPopup, FileUploader, $ionicLoading, $ionicActionSheet) {
        $scope.formData = [];

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
                if(response.status > 0){
                    $scope.imgList.push({id: response.id, thumb_path: response.thumb_path, headpic: 0});
                }else{
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
        $scope.moreImg = function (index, img) {
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
                        var id = $scope.imgList[index].id;
                        api.save('/wap/member/del-photo', {'id': id}).success(function (res) {
                            $scope.imgList.splice(index, 1);
                            hideSheet();
                        });

                    } else {
                        return false;
                    }
                },
                buttonClicked: function () {
                    if (index != 0) {   // 设置头像
                        api.save('/wap/member/set-head', {'id': index}).success(function (res) {
                            $scope.imgList[head_id].is_head = 0;
                            $scope.imgList[index].is_head = 1;
                            head_id = index;
                            hideSheet();
                        });
                    }
                    return true;
                }
            });
        }

    }]);

    // 个人动态
    module.controller("member.dynamic", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function(imgList,index){
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top:0,bottom:0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe( pswpElement, photoswipe_ui, imgList, options);
                gallery.init();
            }

        })

        $scope.dynamic = [];

        // 当前登录用户的所有动态，点击加载，每页十条
        $scope.dynamic.list = [
            {
                id: 1, likeNumber: 68, commentNumber: 482, imgList: [
                {src: '/wechat/web/images/test/1.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/3.jpg',w:200,h:200}
            ]
            },
            {
                id: 2, likeNumber: 877, commentNumber: 1882, imgList: [
                {src: '/wechat/web/images/test/6.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/4.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/1.jpg',w:200,h:200}
            ]
            },
            {
                id: 3, likeNumber: 95, commentNumber: 381, imgList: [
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/5.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/3.jpg',w:200,h:200}
            ]
            },
            {
                id: 4, likeNumber: 1898, commentNumber: 3487, imgList: [
                {src: '/wechat/web/images/test/6.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/1.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/4.jpg',w:200,h:200}
            ]
            },
            {
                id: 5, likeNumber: 4577, commentNumber: 8841, imgList: [
                {src: '/wechat/web/images/test/5.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/6.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/4.jpg',w:200,h:200}
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

        /*$scope.formData.age = ar.getTimestampByBirthday(ar.DateTimeToDate($scope.birthday)); // 年龄时间戳
        $scope.formData.zodic = $scope.zodic.id; // 生肖ID 详见comm.js
        $scope.formData.constellation = $scope.constellation.id; // 星座ID 详见comm.js*/

        $scope.formData.age = ar.getTimestampByBirthday(ar.DateTimeToDate($scope.birthday)) + '-' + $scope.zodic.id + '-' + $scope.constellation.id;
        $scope.saveData = function () {
            if ($scope.age < 18) {
                $ionicPopup.alert({title: '如果您未满18岁，请退出本站，谢谢合作！'});
                return false;
            }
            api.save(url, $scope.formData).success(function (res) {
                // 保存
                $scope.userInfo.info.age = ar.getTimestampByBirthday(ar.DateTimeToDate($scope.birthday));
                $scope.userInfo.info.zodiac = $scope.zodic.id;
                $scope.userInfo.info.constellation = $scope.constellation.id;
                $scope.setUserStorage();
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
            if ($scope.formData.userprovince == "0") {
                if (confirm('检测到您还未选择地区，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
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
                })
            }
        }

    }]);

    // 常出没地
    module.controller("member.haunt_address", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.haunt_address = $scope.userInfo.info.haunt_address != '未知' ? $scope.userInfo.info.haunt_address : '';
        $scope.saveData = function () {
            if ($scope.formData.haunt_address == '' || typeof($scope.formData.haunt_address) == 'undefined') {
                if (confirm('检测到您还未填写常出没地，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.haunt_address = $scope.formData.haunt_address;
                    $scope.setUserStorage();
                })
            }
        }


    }]);

    // 微信号
    module.controller("member.wechat_number", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.wechat = $scope.userInfo.info.wechat != '未知' ? $scope.userInfo.info.wechat : '';
        $scope.saveData = function () {
            if ($scope.formData.wechat == '' || typeof($scope.formData.wechat) == 'undefined') {
                if (confirm('检测到您还未填写微信号，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.wechat = $scope.formData.wechat;
                    $scope.setUserStorage();
                })
            }
        }

    }]);

    // QQ号
    module.controller("member.qq_number", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.qq = $scope.userInfo.info.qq != '未知' ? $scope.userInfo.info.qq : '';
        $scope.saveData = function () {
            if ($scope.formData.qq == '' || typeof($scope.formData) == 'undefined') {
                if (confirm('检测到您还未填写QQ号，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.qq = $scope.formData.qq;
                    $scope.setUserStorage();
                })
            }
        }

    }]);

    // 去过的地方
    module.controller("member.been_address", ['app.serviceApi', '$scope', '$ionicPopup', '$filter', '$ionicScrollDelegate', function (api, $scope, $ionicPopup, $filter, $ionicScrollDelegate) {

        $scope.formData = [];
        $scope.formData.userAddrIdList = [];  // 用户已选择的地区，ID数据集，存数据库
        $scope.formData.userAddrList = [];    // 用户已选择的地区，name数据集，展示用
        var dataList = $scope.userInfo.went_travel != null ? $scope.userInfo.went_travel.split(',') : [];
        var arr = [];
        var getAddrName = function(id) {
            for(var i in arr) {
                if(id == arr[i].id) {
                    return arr[i].name;
                }
            }
        }
        // 默认数据处理
        api.list('/wap/member/area-travel-list', []).success(function (res) {
            $scope.addrList = res.data;
            arr = res.data;
            for(var i in dataList) {
                $scope.formData.userAddrIdList[i] = parseInt(dataList[i]);
                $scope.formData.userAddrList[i] = getAddrName($scope.formData.userAddrIdList[i]);
            }
        });

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
                var formData = [];
                formData.went_travel = $scope.formData.userAddrIdList.join(',');
                api.save('/wap/member/save-data', formData).success(function (res) {
                    $scope.userInfo.went_travel = formData.went_travel;
                    $scope.setUserStorage();
                });
            }
        }

    }
    ]);

    // 最近想去的地方
    module.controller("member.want_address", ['app.serviceApi', '$scope', '$ionicPopup', '$filter', '$ionicScrollDelegate', function (api, $scope, $ionicPopup, $filter, $ionicScrollDelegate) {

        $scope.formData = [];
        $scope.formData.userAddrIdList = [];  // 用户已选择的地区，ID数据集，存数据库
        $scope.formData.userAddrList = [];    // 用户已选择的地区，name数据集，展示用
        var dataList = $scope.userInfo.want_travel != null ? $scope.userInfo.want_travel.split(',') : [];
        var arr = [];
        var getAddrName = function(id) {
            for(var i in arr) {
                if(id == arr[i].id) {
                    return arr[i].name;
                }
            }
        }
        // 默认数据处理
        api.list('/wap/member/area-travel-list', []).success(function (res) {
            $scope.addrList = res.data;
            arr = res.data;
            for(var i in dataList) {
                $scope.formData.userAddrIdList[i] = parseInt(dataList[i]);
                $scope.formData.userAddrList[i] = getAddrName($scope.formData.userAddrIdList[i]);
            }
        });

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
                var formData = [];
                formData.want_travel = $scope.formData.userAddrIdList.join(',');
                api.save('/wap/member/save-data', formData).success(function (res) {
                    $scope.userInfo.want_travel = formData.want_travel;
                    $scope.setUserStorage();
                });
            }
        }
    }
    ]);

    // 喜欢的运动
    module.controller("member.sports", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicScrollDelegate', function (api, $scope, $ionicPopup, $ionicScrollDelegate) {

        $scope.formData = [];
        $scope.formData.userSportsIdList = [];
        $scope.formData.userSportsList = [];
        var dataList = $scope.userInfo.love_sport != null ? $scope.userInfo.love_sport.split(',') : [];
        var getAddrName = function(arr, id) {
            for(var i in arr) {
                if(id == arr[i].id) {
                    return arr[i].name;
                }
            }
        }
        // 默认数据处理
        api.list('/wap/member/config-list', {'type':1}).success(function (res) {
            $scope.sportsList = res.data;
            for(var i in dataList) {
                $scope.formData.userSportsIdList[i] = parseInt(dataList[i]);
                $scope.formData.userSportsList[i] = getAddrName($scope.sportsList, $scope.formData.userSportsIdList[i]);
            }
        });

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
                var formData = [];
                formData.love_sport = $scope.formData.userSportsIdList.join(',');
                api.save('/wap/member/save-data', formData).success(function (res) {
                    $scope.userInfo.love_sport = formData.love_sport;
                    $scope.setUserStorage();
                });
            }
        }

    }
    ]);

    // 喜欢的电影
    module.controller("member.movie", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicScrollDelegate', '$filter', function (api, $scope, $ionicPopup, $ionicScrollDelegate, $filter) {

        $scope.formData = [];
        $scope.formData.userMovieIdList = [];
        $scope.formData.userMovieList = [];
        var arr = [];
        var dataList = $scope.userInfo.want_film != null ? $scope.userInfo.want_film.split(',') : [];
        var getPicPath = function(arr, id) {
            for(var i in arr) {
                if(id == arr[i].id) {
                    return arr[i].pic_path;
                }
            }
        }
        // 默认数据处理
        api.list('/wap/member/config-list', {'type':2}).success(function (res) {
            $scope.movieList = res.data;
            arr = res.data;
            for(var i in dataList) {
                $scope.formData.userMovieIdList[i] = parseInt(dataList[i]);
                $scope.formData.userMovieList[i] = getPicPath($scope.movieList, $scope.formData.userMovieIdList[i]);
            }
        });

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
                var formData = [];
                formData.want_film = $scope.formData.userMovieIdList.join(',');
                api.save('/wap/member/save-data', formData).success(function (res) {
                    $scope.userInfo.want_film = formData.want_film;
                    $scope.setUserStorage();
                });
            }
        }

    }
    ]);

    // 喜欢的美食
    module.controller("member.delicacy", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicScrollDelegate', '$filter', function (api, $scope, $ionicPopup, $ionicScrollDelegate, $filter) {

        $scope.formData = [];

        $scope.formData.userDelicacyIdList = [];
        $scope.formData.userDelicacyList = [];
        var dataList = $scope.userInfo.like_food != null ? $scope.userInfo.like_food.split(',') : [];
        var getAddrName = function(arr, id) {
            for(var i in arr) {
                if(id == arr[i].id) {
                    return arr[i].name;
                }
            }
        }
        // 默认数据处理
        api.list('/wap/member/config-list', {'type':3}).success(function (res) {
            $scope.delicacyList = res.data;
            for(var i in dataList) {
                $scope.formData.userDelicacyIdList[i] = parseInt(dataList[i]);
                $scope.formData.userDelicacyList[i] = getAddrName($scope.delicacyList, $scope.formData.userDelicacyIdList[i]);
            }
        });
        /*$scope.delicacyList = [
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
        ];*/

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
                var formData = [];
                formData.like_food = $scope.formData.userDelicacyIdList.join(',');
                api.save('/wap/member/save-data', formData).success(function (res) {
                    $scope.userInfo.like_food = formData.like_food;
                    $scope.setUserStorage();
                });
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
        $scope.formData.is_child = $scope.userInfo.info.is_child != '未知' ? $scope.userInfo.info.is_child : '0';
        $scope.childrenList = config_infoData.children;

        $scope.childrenSelect = function (children) {
            $scope.formData.is_child = children;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.is_child == "0" || typeof($scope.formData.is_child) == 'undefined') {
                if (confirm('检测到您还未选择子女状况，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.is_child = $scope.formData.is_child;
                    $scope.setUserStorage();
                })
            }
        }

    }]);

    // 民族
    module.controller("member.nation", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.nation = $scope.userInfo.info.nation != '未知' ? $scope.userInfo.info.nation : '0';
        $scope.nationList = config_infoData.nation;

        $scope.nationSelect = function (nation) {
            $scope.formData.nation = nation;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.nation == "0" || typeof($scope.formData.nation) == 'undefined') {
                if (confirm('检测到您还未选择民族，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.nation = $scope.formData.nation;
                    $scope.setUserStorage();
                })
            }
        }
    }]);

    // 工作单位
    module.controller("member.work", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.work = $scope.userInfo.info.work != '未知' ? $scope.userInfo.info.work : '';

        // 保存
        $scope.saveData = function () {
            if (ar.trim($scope.formData.work) == "") {
                if (confirm('检测到您还未填写工作单位，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.work = $scope.formData.work;
                    $scope.setUserStorage();
                })
            }
        }
    }]);

    // 年收入
    module.controller("member.salary", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.year_income = $scope.userInfo.info.year_income != '未知' ? $scope.userInfo.info.year_income : '';
        $scope.salaryList = config_infoData.salary;

        $scope.salarySelect = function (salary) {
            $scope.formData.year_income = salary;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.year_income == "" || typeof($scope.formData.year_income) == 'undefined') {
                if (confirm('检测到您还未选择年收入，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.year_income = $scope.formData.year_income;
                    $scope.setUserStorage();
                })
            }
        }
    }]);

    // 购房情况
    module.controller("member.house", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.is_purchase = $scope.userInfo.info.is_purchase != '未知' ? $scope.userInfo.info.is_purchase : '';
        $scope.houseList = config_infoData.house;

        $scope.houseSelect = function (house) {
            $scope.formData.is_purchase = house;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.is_purchase == "" || typeof($scope.formData.is_purchase) == 'undefined') {
                if (confirm('检测到您还未选择购房情况，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.is_purchase = $scope.formData.is_purchase;
                    $scope.setUserStorage();
                })
            }
        }
    }]);

    // 购车情况
    module.controller("member.car", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.is_car = $scope.userInfo.info.is_car != '未知' ? $scope.userInfo.info.is_car : '';
        $scope.carList = config_infoData.car;

        $scope.carSelect = function (car) {
            $scope.formData.is_car = car;
        }

        // 保存
        $scope.saveData = function () {
            if ($scope.formData.is_car == "" || typeof($scope.formData.is_car) == 'undefined') {
                if (confirm('检测到您还未选择购车情况，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.is_car = $scope.formData.is_car;
                    $scope.setUserStorage();
                })
            }
        }
    }]);

    // 血型
    module.controller("member.blood", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.blood = $scope.userInfo.info.blood != '未知' ? $scope.userInfo.info.blood : '';
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
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.blood = $scope.formData.blood;
                    $scope.setUserStorage();
                })
            }
        }
    }]);

    // 毕业院校
    module.controller("member.school", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.school = $scope.userInfo.info.school != '未知' ? $scope.userInfo.info.school : '';

        // 保存
        $scope.saveData = function () {
            if (ar.trim($scope.formData.school) == "") {
                if (confirm('检测到您还未填写毕业院校，确定放弃吗？')) {
                    window.location.hash = '/main/information';  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.school = $scope.formData.school;
                    $scope.setUserStorage();
                })
            }
        }
    }]);

    // 择偶标准-年龄
    module.controller("member.zo_age", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        var zo_age = $scope.userInfo.info.zo_age.split('-');
        $scope.formData.zo_min_age = zo_age[0];
        $scope.formData.zo_msx_age = zo_age[1];
        $scope.zo_ageMaxList = [];
        $scope.zo_ageMinList = [];
        for (var i = 18; i <= 99; i++) {
            $scope.zo_ageMinList.push(i);
            $scope.zo_ageMaxList.push(i);
        }
        $scope.zo_ageMinSelect = function (ageMin) {
            $scope.zo_ageMaxList = [];
            if (ageMin >= $scope.formData.zo_msx_age) {
                $scope.formData.zo_msx_age = "0";
            }
            for (var i = ageMin; i <= 99; i++) {
                $scope.zo_ageMaxList.push(i);
            }
        }

        // 保存
        $scope.saveData = function () {
            var formData = [];
            formData.zo_age = $scope.formData.zo_min_age + '-' + $scope.formData.zo_msx_age;
            api.save('/wap/member/save-data', formData).success(function (res) {
                // 保存
                $scope.userInfo.info.zo_age = formData.zo_age;
                $scope.setUserStorage();
            })
        }
    }]);

    // 择偶标准-身高
    module.controller("member.zo_height", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        var zo_height = $scope.userInfo.info.zo_height.split('-');
        $scope.formData.zo_min_height = zo_height[0];
        $scope.formData.zo_msx_height = zo_height[1];
        $scope.zo_heightMaxList = [];
        $scope.zo_heightMinList = [];
        for (var i = 140; i <= 260; i++) {
            $scope.zo_heightMinList.push(i);
            $scope.zo_heightMaxList.push(i);
        }
        $scope.zo_heightMinSelect = function (heightMin) {
            $scope.zo_heightMaxList = [];
            if (heightMin >= $scope.formData.zo_msx_height) {
                $scope.formData.zo_msx_height = "0";
            }
            for (var i = heightMin; i <= 260; i++) {
                $scope.zo_heightMaxList.push(i);
            }
        }

        // 保存
        $scope.saveData = function () {
            var formData = [];
            formData.zo_height = $scope.formData.zo_min_height + '-' + $scope.formData.zo_msx_height;
            api.save('/wap/member/save-data', formData).success(function (res) {
                // 保存
                $scope.userInfo.info.zo_height = formData.zo_height;
                $scope.setUserStorage();
            })
        }
    }]);

    // 择偶标准-学历
    module.controller("member.zo_education", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];
        $scope.formData.zo_education = $scope.userInfo.info.zo_education != '未知' ? $scope.userInfo.info.zo_education : '';
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
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.zo_education = $scope.formData.zo_education;
                    $scope.setUserStorage();
                })
            }
        }
    }]);

    // 择偶标准-婚姻状况
    module.controller("member.zo_marriage", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.isSelectedNull = false;
        $scope.marriageList = config_infoData.marriage;

        $scope.formData.userMarriageIDList = [];   //用户数据  未婚、离异
        var zo_marriage = $scope.userInfo.info.zo_marriage != '未知' ? $scope.userInfo.info.zo_marriage.split('-') : [];
        for(var i in zo_marriage) {
            $scope.formData.userMarriageIDList[i] = parseInt(zo_marriage[i]);
        }

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
            var formData = [];
            formData.zo_marriage = $scope.formData.userMarriageIDList.join('-');
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.info.zo_marriage = formData.zo_marriage;
                $scope.setUserStorage();
            })

        }

    }]);

    // 择偶标准-购房情况
    module.controller("member.zo_house", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.zo_house = $scope.userInfo.info.zo_house != '未知' ? $scope.userInfo.info.zo_house : '0';
        $scope.zo_houseList = config_infoData.house;

        // 保存
        $scope.saveData = function () {
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                // 保存
                $scope.userInfo.info.zo_house = $scope.formData.zo_house;
                $scope.setUserStorage();
            })
        }
    }]);

    // 择偶标准-购车情况
    module.controller("member.zo_car", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.formData.zo_car = $scope.userInfo.info.zo_car != '未知' ? $scope.userInfo.info.zo_car : '0';
        $scope.zo_carList = config_infoData.car;

        // 保存
        $scope.saveData = function () {
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                // 保存
                $scope.userInfo.info.zo_car = $scope.formData.zo_car;
                $scope.setUserStorage();
            })
        }
    }]);

    // 择偶标准-属相
    module.controller("member.zo_zodiac", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.isSelectedNull = false;
        $scope.zodiacList = config_infoData.zodiac;

        $scope.formData.userZodiacIDList = [];   //用户数据  鼠、牛
        var zo_zodiac = $scope.userInfo.info.zo_zodiac != '未知' ? $scope.userInfo.info.zo_zodiac.split('-') : [];
        for(var i in zo_zodiac) {
            $scope.formData.userZodiacIDList[i] = parseInt(zo_zodiac[i]);
        }

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
            var formData = [];
            formData.zo_zodiac = $scope.formData.userZodiacIDList.join('-');
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.info.zo_zodiac = formData.zo_zodiac;
                $scope.setUserStorage();
            })

        }

    }]);

    // 择偶标准-星座
    module.controller("member.zo_constellation", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.formData = [];

        $scope.isSelectedNull = false;
        $scope.constellationList = config_infoData.constellation;

        $scope.formData.userConstellationIDList = [];   //用户数据  狮子座、天秤座
        var zo_constellation = $scope.userInfo.info.zo_constellation != '未知' ? $scope.userInfo.info.zo_constellation.split('-') : [];
        for(var i in zo_constellation) {
            $scope.formData.userConstellationIDList[i] = parseInt(zo_constellation[i]);
        }
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
            var formData = [];
            formData.zo_constellation = $scope.formData.userConstellationIDList.join('-');
            api.save('/wap/member/save-data', formData).success(function (res) {
                $scope.userInfo.info.zo_constellation = formData.zo_constellation;
                $scope.setUserStorage();
            })
        }

    }]);

    // 预览资料
    module.controller("member.preview", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading', function (api, $scope, $ionicPopup, $ionicLoading) {

        $scope.imgList = [
            {src: '/wechat/web/images/test/3.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/7.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/6.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/3.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/7.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/6.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/3.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/7.jpg',w:200,h:200}
        ]

        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function(imgList,index){
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top:0,bottom:0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe( pswpElement, photoswipe_ui, imgList, options);
                gallery.init();
            }

        })


    }]);

    // 谁关注了我
    module.controller("member.follow", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading', '$state', '$stateParams', function (api, $scope, $ionicPopup, $ionicLoading, $state, $stateParams) {
        $scope.followList = [
            {id: 1, realName: '张三', marriage: '未婚', age: '29', height: '180', house: '有房', car: '有车'},
            {id: 2, realName: '李四', marriage: '未婚', age: '35', height: '165', house: '有房', car: 0},
            {id: 3, realName: '王武', marriage: '未婚', age: '41', height: '170', house: 0, car: 0},
            {id: 4, realName: '谭善', marriage: '未婚', age: '34', height: '175', house: '有房', car: 0},
            {id: 5, realName: '赵四', marriage: '未婚', age: '24', height: '170', house: '有房', car: 0}
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

    // 查看用户资料
    module.controller("member.user_info", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$state', '$stateParams', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $state, $stateParams) {

        $scope.formData = [];
        $scope.formData.userId = $stateParams.userId;

        $scope.imgList = [
            {src: '/wechat/web/images/test/1.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/3.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/4.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/5.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/6.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/7.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/8.jpg',w:200,h:200},
            {src: '/wechat/web/images/test/3.jpg',w:200,h:200}
        ];

        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function(imgList,index){
                console.info(imgList,index);
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top:0,bottom:0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe( pswpElement, photoswipe_ui, imgList, options);
                gallery.init();
            }

        })

        $scope.jump = function () {
            $state.go($stateParams.tempUrl);
        }

        // 未关注
        $scope.formData.follow = false;

        // 取消关注
        $scope.cancelFollow = function(){

            $scope.formData.follow = false;
        }

        // 关注
        $scope.addFollow = function(){

        }

    }]);

    // 隐私设置
    module.controller("member.privacy", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 隐私设置-照片权限
    module.controller("member.privacy_pic", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 隐私设置-个人动态权限
    module.controller("member.privacy_per", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 隐私设置-微信显示权限
    module.controller("member.privacy_wechat", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 隐私设置-QQ显示权限
    module.controller("member.privacy_qq", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 隐私设置-黑名单
    module.controller("member.privacy_black", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 账户安全
    module.controller("member.security", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 账户安全-密码修改
    module.controller("member.security_pass", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 账户安全-手机绑定
    module.controller("member.security_phone", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.User = [];

        $scope.User.codeBtn = '获取验证码';

        function validatePhone(phone) {

            if (!ar.validateMobile(phone)) {  // 验证手机格式
                $ionicPopup.alert({title: '手机号码格式不正确'});
                return false;
            }

            api.getMobileIsExist(phone).success(function (data) {
                if (!data.status) {
                    $ionicPopup.alert({title: data.msg});
                    return true;
                } else {
                    return false;
                }
            })

            return true;
        }

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

            if (!validatePhone($scope.User.mobile)) return;

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
    }]);

    // 账户安全-微信绑定
    module.controller("member.security_wechat", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 账户安全-QQ绑定
    module.controller("member.security_qq", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 诚信认证
    module.controller("member.honesty", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

    // 诚信认证-身份认证
    module.controller("member.honesty_sfz", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/thumb-photo'
        });
    }]);

    // 诚信认证-婚姻认证
    module.controller("member.honesty_marr", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/thumb-photo'
        });
    }]);

    // 诚信认证-学历认证
    module.controller("member.honesty_edu", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/thumb-photo'
        });
    }]);

    // 诚信认证-房产认证
    module.controller("member.honesty_housing", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/thumb-photo'
        });
    }]);

    // 嘉瑞红包
    module.controller("member.bribery", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {


    }]);

    // 嘉瑞红包-收到的红包
    module.controller("member.bribery_rec", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.items = [];
        $scope.loadMore = function () {
            //$scope.$broadcast('scroll.infiniteScrollComplete');
            /* $http.get('/more-items').success(function(items) {
             useItems(items);
             $scope.$broadcast('scroll.infiniteScrollComplete');
             });*/
        };
        $scope.$on('$stateChangeSuccess', function () {
            $scope.loadMore();
        });

    }]);

    // 嘉瑞红包-发出的红包
    module.controller("member.bribery_send", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.items = [];
        $scope.loadMore = function () {
            //$scope.$broadcast('scroll.infiniteScrollComplete');
            /*$http.get('/more-items').success(function(items) {
             useItems(items);
             $scope.$broadcast('scroll.infiniteScrollComplete');
             });*/
        };
        $scope.$on('$stateChangeSuccess', function () {
            $scope.loadMore();
        });

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

    return module;
})


