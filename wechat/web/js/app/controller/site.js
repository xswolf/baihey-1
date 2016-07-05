/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'app/filter/filterApi', 'config/city', 'config/occupation'
], function (module) {

    module.controller("site.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$ionicBackdrop', '$ionicScrollDelegate', '$location', 'dataFilter', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $ionicBackdrop, $ionicScrollDelegate, $location, dataFilter) {
        // 搜索条件
        $scope.searchForm = [];
        $scope.whereForm = [];
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

        // 默认还有更多
        $scope.pageLast = true;

        // 查询地区  // TODO 此功能暂时屏蔽
        /*function getLocation(){
         // 默认重庆
         var lng = 106.51228345689027;
         var lat = 29.54206567258729;

         if (window.navigator.geolocation) {
         var options = {
         enableHighAccuracy: true,
         };
         window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
         } else {
         alert("浏览器不支持html5来获取地理位置信息");
         }

         function handleSuccess(position) {
         // 获取到当前位置经纬度  本例中是chrome浏览器取到的是google地图中的经纬度
         lng = position.coords.longitude;
         lat = position.coords.latitude;
         }

         function handleError() {

         }

         api.get('/wap/user/get-location', {lng: lng, lat: lat}).success(function (res) {
         });
         }*/
        //getLocation();

        // 判断手机是否认证
        $scope.checkPhone = function (url) {
            if ($scope.userInfo.phone) {
                window.location.hash = url;
            } else {
                window.location.hash = '#/member/security_phone';
            }
        }

        // 根据登录状态，登录用户性别默认查询条件：性别
        if (ar.getCookie('bhy_u_sex') && (ar.getCookie('bhy_u_sex') == 0)) {
            $scope.searchForm.sex = 1;
        } else {
            $scope.searchForm.sex = 0;
        }

        // 获取用户地理位置。 如果未获取到，则默认重庆
        //if (ar.getCookie('bhy_u_city') && ar.getCookie('bhy_u_cityId')) {   // TODO 此功能暂时屏蔽
        //    $scope.cityName = eval(ar.getCookie('bhy_u_city'));
        //    $scope.cityId = ar.getCookie('bhy_u_cityId');
        //    $scope.searchForm.city = ar.getCookie('bhy_u_cityId');
        //} else {
        $scope.cityName = '重庆';
        $scope.cityId = 2;
        $scope.searchForm.city = 2
        //}


        // 默认查询条件：年龄范围，页码，每页数量
        $scope.searchForm.age = '18-28';
        $scope.searchForm.pageNum = 1;
        $scope.searchForm.pageSize = 6;

        // 监听地区变化 // TODO 此功能暂时屏蔽
        /*$scope.$on('cityName', function (event, data) {
         $scope.cityName = data.name;
         $scope.cityId = data.id;
         $scope.searchForm.city = data.id;
         $scope.searchForm.cityName = data.name;
         $scope.searchForm.pageNum = 0;
         });*/


        /*// 选择城市模版 // TODO 此功能暂时屏蔽
         $ionicModal.fromTemplateUrl('selCityModal.html', {
         scope: $scope,
         animation: 'slide-in-up'
         }).then(function (modal) {
         $scope.cityModal = modal;
         });*/

        // 首页filter显示
        $scope.indexFilter = function (user) {
            return user.id != $scope.userInfo.id && dataFilter.data.blacked.indexOf(user.id) == -1;
        }

        // 高级搜索模版
        $ionicModal.fromTemplateUrl('MoreSearchModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.moreSearchModal = modal;
        });

        // 条件初始化
        var init = function () {
            $scope.searchForm = [];
            $scope.searchForm.age = 0; // 初始化年龄
            $scope.searchForm.pageNum = 1; // 初始化页码
        }
        // 高级搜索-点击确定
        $scope.moreSearchOk = function () {
            $scope.userList = [];
            $scope.moreSearchModal.hide();
            $scope.searchForm = $scope.whereForm;
            $scope.searchForm.pageNum = 1;
            //userListPromise();
            $scope.loadMore();
        }

        $scope.buttonsItemIndex = '';

        //点击搜索
        $scope.search = function () {

            $scope.buttonsItem = [
                {text: '全部'},
                {text: '只看男'},
                {text: '只看女'},
                {text: '高级搜索'},
            ];

            if ($scope.buttonsItemIndex != '') {
                $scope.buttonsItem[$scope.buttonsItemIndex].text = '<b>' + $scope.buttonsItem[$scope.buttonsItemIndex].text + '</b>'
            } else {
                $scope.buttonsItem[0].text = '<b>全部</b>';
            }

            var hideSheet = $ionicActionSheet.show({
                buttons: $scope.buttonsItem,
                titleText: '搜索',
                cancelText: '取消',
                buttonClicked: function (index) {
                    console.log($scope.whereForm);
                    $scope.pageLast = true;
                    $scope.buttonsItemIndex = index;
                    if (index == 0) {   // 全部
                        $scope.userList = [];
                        init();
                        $scope.searchForm.sex = 'all';
                        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
                        hideSheet();
                    }

                    if (index == 1) {   //只看男
                        $scope.userList = [];
                        init();
                        $scope.searchForm.sex = 1;
                        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
                        hideSheet();
                    }

                    if (index == 2) {   //只看女
                        $scope.userList = [];
                        init();
                        $scope.searchForm.sex = 0;
                        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
                        hideSheet();
                    }

                    if (index == 3) {   //高级搜索
                        $scope.moreSearchModal.show();
                        hideSheet();
                    }
                }
            });
        }

        // 加载更多
        $scope.loadMore = function () {

            api.list('/wap/site/user-list', $scope.searchForm).success(function (res) {
                if (res.data.length < 6) {
                    $scope.pageLast = false;
                }
                for (var i in res.data) {
                    res.data[i].info = JSON.parse(res.data[i].info);
                    res.data[i].auth = JSON.parse(res.data[i].auth);
                }
                $scope.userList = $scope.userList.concat(res.data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.searchForm.pageNum += 1;
            });
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.pageLast;
        }


        $scope.jump = function (url) {
            $location.url(url);
        }

        /* // 选择城市
         $scope.bodyHeight = document.body.scrollHeight;
         if ($scope.bodyHeight == 0) $scope.bodyHeight = window.screen.height;
         $scope.scrollStyle = {
         'height': ($scope.bodyHeight - 44) + 'px',
         'float': 'left',
         'width': '50%'
         }*/

        // modal内左上角地理位置名称
        /*$scope.modalCityName = $scope.cityName;

         $scope.pvId = 1;
         $scope.cityId = 2;

         $scope.selected_pv = function (pv_id) {
         $scope.pvId = pv_id;
         }

         $scope.selected_city = function (city_id) {
         $scope.cityId = city_id;
         $scope.citySave();
         }

         // 保存已选择城市
         $scope.citySave = function () {
         $scope.searchForm.pageNum = 1;
         for (var i = 0; i < $scope.cityList.length; i++) {
         if ($scope.cityList[i].id == $scope.cityId) {
         $scope.modalCityName = $scope.cityList[i].name;
         $scope.cityName = $scope.cityList[i].name;
         $scope.searchForm.city = $scope.cityId;
         $scope.searchForm.cityName = $scope.cityList[i].name;
         userListPromise();
         $scope.pageLast = true;
         break;
         }
         }
         $scope.cityModal.hide();
         }

         $scope.provinceList = provines;
         $scope.cityList = citys;*/

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


        //$scope.searchForm = {};
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

        //$scope.searchForm.sex = 'all';
        // 职业赋值
        $scope.occupations = occupation;

        $scope.sexChange = function (value) {
            //$scope.searchForm.sex = value;
            $scope.whereForm.sex = value;
        }

        $scope.moreText = '展开';
        $scope.more = false;
        $scope.moreToggle = function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();   // 重新计算滚动视图高度
            $scope.more = !$scope.more;
            if ($scope.more) {
                $scope.moreText = '收起';
            } else {
                $scope.moreText = '展开';
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
                    res.data[i].head_pic = res.data[i].head_pic.replace(/\"/g, '');
                    res.data[i].level = res.data[i].level.replace(/\"/g, '');
                    res.data[i].age = res.data[i].age.replace(/\"/g, '');
                }
                $scope.discoveryList = res.data;
                $scope.user.username = res.data[0].name;
                $scope.user.age = res.data[0].age;
                $scope.user.sex = res.data[0].sex;
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
                } else if (dis.auth == '3') {
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
            }

            // 是否还有更多
            $scope.moreDataCanBeLoaded = function () {
                return $scope.isMore;
            }


    }]);
})
