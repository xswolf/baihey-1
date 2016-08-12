/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'app/filter/filterApi', 'config/city', 'config/occupation'
], function (module) {

    module.controller("site.index", ['app.serviceApi', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$ionicBackdrop', '$ionicScrollDelegate', '$location', 'dataFilter', function (api, $rootScope, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicBackdrop, $ionicScrollDelegate, $location, dataFilter) {

        // 搜索条件
        $scope.searchForm = {age: '18-28', pageNum: 1, pageSize: 6, sex: 0};
        $scope.userId = ar.getCookie("bhy_user_id") ? ar.getCookie("bhy_user_id") : 0;

        // 条件初始化
        var init = function () {
            $scope.searchForm = {};
            $scope.whereForm = {};
            $scope.searchForm.pageNum = 1; // 初始化页码
            //$scope.searchForm.pageSize = 6; // 初始化页码
            // 默认查询条件：年龄范围，页码，每页数量
            if ($scope.userId > 0 && $scope.userInfo.sex == 0) {
                $scope.searchForm.sex = 1;
                $scope.whereForm.sex = 1;
            } else {
                $scope.searchForm.sex = 0;
                $scope.whereForm.sex = 0;
            }
        }
        init();

        // 用户列表
        $scope.userList = [];

        // 判断身份证是否认证通过
        if (dataFilter.data.honestyStatus.length) {
            $scope.honestyStatus = dataFilter.data.honestyStatus[0].is_check;
        }
        // 判断头像是否认证通过
        if (dataFilter.data.headpicStatus) {
            $scope.headpicStatus = dataFilter.data.headpicStatus.is_check;
        }
        $scope.honesty = function (val) {
            return val & 1;
        }

        $scope.cityName = '重庆';
        $scope.cityId = 2;
        $scope.searchForm.city = 2
        //getSearchCondition($scope.userId);

        // 默认还有更多
        $scope.pageLast = true;

        // 判断手机是否认证
        $scope.checkPhone = function (url) {
            if ($scope.userInfo.phone) {
                window.location.hash = url;
            } else {
                window.location.hash = '#/member/security_phone';
            }
        }

        $scope.dataLoading = false;

        // 首页搜索过滤条件（拉黑）
        $scope.indexFilter = function (user) {
            if ($scope.userId > 0 && $scope.userInfo) {
                return user.id != $scope.userInfo.id && dataFilter.data.blacked.indexOf(user.id) == -1;
            }
            return 1;
        }

        // 高级搜索模版
        $ionicModal.fromTemplateUrl('MoreSearchModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.moreSearchModal = modal;
        });

        // 高级搜索-点击确定
        $scope.moreSearchOk = function () {
            $scope.dataLoading = true;
            $scope.userList = [];
            $scope.moreSearchModal.hide();
            if ($scope.whereForm.id) {
                $scope.searchForm = [];
                $scope.searchForm.id = $scope.whereForm.id;
                $scope.whereForm = [];
                $scope.whereForm.id = $scope.searchForm.id;
            }
            $scope.searchForm = $scope.whereForm;
            $scope.searchForm.pageNum = 1;
            //setSearchCondition($scope.searchForm, $scope.userId);
            $scope.loadMore(1);
        };

        //点击搜索
        $scope.search = function () {

            $scope.buttonsItem = [
                {text: '只看女'},
                {text: '只看男'},
                {text: '高级搜索'},
            ];

            var hideSheet = $ionicActionSheet.show({
                buttons: $scope.buttonsItem,
                titleText: '搜索',
                cancelText: '取消',
                buttonClicked: function (index) {
                    $scope.pageLast = true;
                    if (index == 1) {   //只看男
                        $scope.userList = [];
                        init();
                        $scope.whereForm = [];
                        $scope.searchForm.sex = 1;
                        $scope.whereForm.sex = 1;
                        $scope.dataLoading = true;
                        $scope.loadMore(1);
                        //setSearchCondition($scope.searchForm, $scope.userId);
                    }
                    if (index == 0) {   //只看女
                        $scope.userList = [];
                        init();
                        $scope.whereForm = [];
                        $scope.searchForm.sex = 0;
                        $scope.whereForm.sex = 0;
                        $scope.dataLoading = true;
                        $scope.loadMore(1);
                        //setSearchCondition($scope.searchForm, $scope.userId);
                    }
                    if (index == 2) {   //高级搜索
                        if($scope.moreSearchModal.show()){
                            $ionicScrollDelegate.$getByHandle('searchScroll').scrollTop();
                        }
                    }
                    hideSheet();
                }
            });
        }


        $scope.doRefresh = function () {
            var refreshForm = $scope.searchForm;
            refreshForm.pageSize = $scope.userList.length;
            refreshForm.pageNum = 1;
            $scope.dataLoading = true;
            api.list('/wap/site/user-list', refreshForm).success(function (res) {
                for (var i in res.data) {
                    res.data[i].info = JSON.parse(res.data[i].info);
                    res.data[i].auth = JSON.parse(res.data[i].auth);
                }
                $scope.userList = res.data;
                $scope.dataLoading = false;
                $scope.searchForm.pageNum += 1;
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        // 加载更多
        $scope.loadMore = function (top) {
            $scope.dataLoading = true;
            api.list('/wap/site/user-list', $scope.searchForm).success(function (res) {
                if (res.data.length < 6) {
                    $scope.pageLast = false;
                }
                for (var i in res.data) {
                    res.data[i].info = JSON.parse(res.data[i].info);
                    res.data[i].auth = JSON.parse(res.data[i].auth);
                }
                $scope.userList = $scope.userList.concat(res.data);
                $scope.dataLoading = false;
                $scope.searchForm.pageNum += 1;
                //console.log($scope.userList);
                if(top) $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.pageLast;
        }


        /* 高级搜索 */
        // 年龄范围
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
                    console.log(valueText);
                    return valueText.replace(/\s/gi, '').split('-');
                }
                return [18, 22];
            }
        };

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

        $scope.salary = config_infoData.salary;
        $scope.house = config_infoData.house;
        $scope.marriage = config_infoData.marriage;
        $scope.education = config_infoData.education;
        $scope.children = config_infoData.children;
        $scope.house = config_infoData.house;
        $scope.car = config_infoData.car;
        $scope.zodiac = config_infoData.zodiac;
        $scope.constellation = config_infoData.constellation;
        $scope.nation = config_infoData.nation;

        // 职业赋值
        $scope.occupations = occupation;

        // 性别切换
        $scope.sexChange = function (value) {
            $scope.whereForm.sex = value;
        }

        $scope.moreText = '展开';
        $scope.more = false;

        // 展开/收起更多条件
        $scope.moreToggle = function () {
            $ionicScrollDelegate.$getByHandle('searchScroll').resize();   // 重新计算滚动视图高度
            $scope.more = !$scope.more;
            if ($scope.more) {
                $scope.moreText = '收起';
            } else {
                $scope.moreText = '展开';
            }
        }

        // remove欢迎图片
        if (document.getElementById('welcome')) {
            document.getElementById('welcome').className = 'animated fadeOut';
            setTimeout(function () {
                document.body.removeChild(document.getElementById('welcome'));
            }, 1100)
        }

        /**
         * 缓存搜索条件
         * @param currentSearchCondition 当前搜索条件
         * @param userId 当前用户ID
         */
        function setSearchCondition(currentSearchCondition, userId) {
            ar.setStorage('searchCondition', currentSearchCondition);
            ar.setStorage('searchConditionByUserId', userId);
        }

        /**
         * 读取搜索条件缓存
         * @returns {*}
         */
        function getSearchCondition(userId) {
            if (userId == ar.getStorage('searchConditionByUserId') && ar.getStorage('searchCondition')) {
                $scope.searchForm = ar.getStorage('searchCondition');
                $scope.whereForm = ar.getStorage('searchCondition');
            } else {
                // 根据登录状态，登录用户性别默认查询条件：性别
                /*if (ar.getStorage('bhy_u_sex') && (ar.getStorage('bhy_u_sex') == 0)) {
                 $scope.searchForm.sex = 1;
                 } else {
                 $scope.searchForm.sex = 0;
                 }*/
                $scope.cityName = '重庆';
                $scope.cityId = 2;
                $scope.searchForm.city = 2

            }
        }

    }]);

    // 查看会员资料-会员动态
    module.controller("site.discovery", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$ionicBackdrop', '$ionicScrollDelegate', '$location', 'dataFilter', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicBackdrop, $ionicScrollDelegate, $location, dataFilter) {
        $scope.discoveryList = [];
        $scope.user = [];
        $scope.isMore = true;
        $scope.pageSize = 5;
        // 用户ID
        $scope.user_id = $location.$$search.userId;

        // 根据用户ID获取用户全部动态
        api.get('/wap/member/get-dynamic-list', {user_id: $scope.user_id, limit: 10000}).success(function (res) {
            for (var i in res.data) {
                res.data[i].imgList = JSON.parse(res.data[i].pic);
                res.data[i].real_name = res.data[i].real_name.replace(/\"/g, '');
                res.data[i].head_pic = res.data[i].head_pic.replace(/\"/g, '');
                res.data[i].level = res.data[i].level.replace(/\"/g, '');
                res.data[i].age = res.data[i].age.replace(/\"/g, '');
            }
            $scope.discoveryList = res.data;
            $scope.user.username = res.data[0].real_name;
            $scope.user.age = res.data[0].age;
            $scope.user.sex = res.data[0].sex;
            ar.initPhotoSwipeFromDOM('.bhy-gallery',$scope);
        })

        $scope.jump = function (url) {
            $location.url(url);
        }

        //用户已屏蔽的动态id，从localStorage获取
        $scope.display = ar.getStorage('display') ? ar.getStorage('display') : [];

        // 动态列表过滤条件：关注、举报、屏蔽
        $scope.indexFilter = function (dis) {
            if (dis.fid > 0) {
                return false;// 动态被举报
            }
            if (dis.auth == '2') {   // 用户设置该条动态为关注的人可见
                return dataFilter.data.follow.indexOf(dis.user_id) != -1 && $scope.display.indexOf(dis.id) == -1;
            } else if (dis.auth == '4') {
                return false;
            }
            return $scope.display.indexOf(dis.id) == -1;
        }

        // 点赞
        $scope.clickLike = function (dis) {
            var i = ar.getArrI($scope.discoveryList, 'id', dis.id);
            var add = 0;
            if ($scope.discoveryList[i].cid > 0) {
                add = -1;
                $scope.discoveryList[i].cid = -1;
            } else {
                add = 1;
                $scope.discoveryList[i].cid = 1;
            }
            $scope.discoveryList[i].like_num = parseInt($scope.discoveryList[i].like_num) + add;
            api.save('/wap/member/set-click-like', {dynamicId: dis.id, add: add});
        }

        // 更多功能
        $scope.more = function (isUser, id, index) {
            var btnList = [
                {text: '举报'},
                {text: '屏蔽'}
            ];
            if (isUser) {   // 判断该条动态是否所属当前用户
                btnList = [
                    {text: '删除'}
                ];
            }

            $ionicActionSheet.show({
                buttons: btnList,
                titleText: '更多',
                cancelText: '取消',
                cancel: function () {
                },
                buttonClicked: function (i, btnObj) {
                    if (btnObj.text == '屏蔽') {
                        $scope.display.push(id);
                        ar.setStorage('display', $scope.display);
                        // 将参数ID存入localStorage：display
                    }
                    if (btnObj.text == '举报') {
                        $location.url('/member/report?id=' + id + '&type=2&title=动态&tempUrl=' + $location.$$url);
                    }
                    if (btnObj.text == '删除') {
                        $scope.display.push(id);
                        ar.setStorage('display', $scope.display);
                        // 改变状态 api.save
                        api.save('/wap/member/delete-dynamic', {id: id}).success(function (res) {
                            $location.url('/discovery');
                        });
                    }

                    return true;
                }
            });
        }

        // 加载更多
        $scope.loadMore = function () {
            if ($scope.pageSize > $scope.discoveryList.length) {
                $scope.isMore = false;
            }
            $scope.pageSize += 5;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            ar.initPhotoSwipeFromDOM('.bhy-gallery',$scope);
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore;
        }


    }]);
})
