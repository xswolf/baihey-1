/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'app/filter/filterApi', 'config/city', 'config/occupation'
], function (module) {

    module.controller("site.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$ionicBackdrop','$ionicScrollDelegate','$location','indexIsShowData','blacked','honestyStatus','headpicStatus',function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading,$ionicBackdrop,$ionicScrollDelegate,$location,indexIsShowData,blacked,honestyStatus,headpicStatus) {
        // 搜索条件
        $scope.searchForm = [];
        $scope.whereForm = [];
console.log(indexIsShowData.data);
        // 用户列表
        $scope.userList = [];

        // 判断身份证是否认证通过
        if(indexIsShowData.data.honestyStatus.length) {
            $scope.honestyStatus = indexIsShowData.data.honestyStatus[0].is_check;
        }
        // 判断头像是否认证通过
        if(indexIsShowData.data.headpicStatus) {
            $scope.headpicStatus = indexIsShowData.data.headpicStatus.is_check;
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
        $scope.checkPhone = function(url) {
            if($scope.userInfo.phone) {
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
        $scope.indexFilter = function(user){
            return user.id != $scope.userInfo.id && indexIsShowData.data.blacked.indexOf(user.id) != -1;
        }

        // 高级搜索模版
        $ionicModal.fromTemplateUrl('MoreSearchModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.moreSearchModal = modal;
        });

        // 条件初始化
        var init = function() {
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


        $scope.jump = function(url){
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
        var minAge=[],maxAge=[];
        for(var i = 18; i<= 99; i++){
            maxAge.push(i);
            if(i<99){
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
        var minHeight=[],maxHeight=[];
        for(var i = 140; i<= 260; i++){
            maxHeight.push(i);
            if(i<260){
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


})
