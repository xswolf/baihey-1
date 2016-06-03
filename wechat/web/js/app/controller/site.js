/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'app/filter/filterApi', 'config/city', 'config/occupation'
], function (module) {

    module.controller("site.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$ionicBackdrop', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading,$ionicBackdrop) {
        // 搜索条件
        $scope.searchForm = [];

        // 用户列表
        $scope.userList = [];

        // 默认还有更多
        $scope.pageLast = true;

        // 读取用户数据
        function userListPromise() {
            api.list("/wap/site/user-list", $scope.searchForm).success(function (res) {
                if (res.data.length == 0) {
                    $scope.pageLast = false;
                }
                $scope.userList = res.data;
                for (var i in $scope.userList) {
                    $scope.userList[i].info = JSON.parse($scope.userList[i].info);
                    $scope.userList[i].auth = JSON.parse($scope.userList[i].auth);
                }
            })
        }

        // 根据登录状态，登录用户性别默认查询条件：性别
        if (ar.getCookie('bhy_u_sex') && (ar.getCookie('bhy_u_sex') == 0)) {
            $scope.searchForm.sex = 1;
        } else {
            $scope.searchForm.sex = 0;
        }

        // 获取用户地理位置。 如果未获取到，则默认重庆
        if (ar.getCookie('bhy_u_city') && ar.getCookie('bhy_u_cityId')) {
            $scope.cityName = eval(ar.getCookie('bhy_u_city'));
            $scope.cityId = ar.getCookie('bhy_u_cityId');
            $scope.searchForm.city = ar.getCookie('bhy_u_cityId');
        } else {
            $scope.cityName = '重庆';
            $scope.cityId = 2;
            $scope.searchForm.city = 2
        }

        // 默认查询条件：年龄范围，页码，每页数量
        $scope.searchForm.age = '18-28';
        $scope.searchForm.pageNum = 1;
        $scope.searchForm.pageSize = 6;

        // 监听地区变化
        $scope.$on('cityName', function (event, data) {
            $scope.cityName = data.name;
            $scope.cityId = data.id;
            $scope.searchForm.city = data.id;
            $scope.searchForm.cityName = data.name;
            $scope.searchForm.pageNum = 0;
        });


        // 选择城市模版
        $ionicModal.fromTemplateUrl('selCityModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.cityModal = modal;
        });

        // 高级搜索模版
        $ionicModal.fromTemplateUrl('MoreSearchModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.moreSearchModal = modal;
        });

        // 高级搜索-点击确定
        $scope.moreSearchOk = function () {
            $scope.moreSearchModal.hide();
            $scope.searchForm.pageNum = 1;
            userListPromise();
        }

        $scope.buttonsItemIndex = '';

        //点击搜索
        $scope.search = function () {

            $scope.buttonsItem = [
                {text: '全部'},
                {text: '只看男'},
                {text: '只看女'},
                {text: '高级搜索'},
                {text: 'ID搜索'}
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
                    $scope.searchForm.pageNum = 1; // 初始化页码
                    $scope.buttonsItemIndex = index;
                    if (index == 0) {   // 全部
                        $scope.searchForm.sex = 'all';
                        userListPromise();
                        hideSheet();
                    }

                    if (index == 1) {   //只看男
                        $scope.searchForm.sex = 1;
                        userListPromise();
                        hideSheet();
                    }

                    if (index == 2) {   //只看女
                        $scope.searchForm.sex = 0;
                        userListPromise();
                        hideSheet();
                    }

                    if (index == 3) {   //高级搜索
                        $scope.moreSearchModal.show();
                        hideSheet();
                    }

                    if (index == 4) {   //ID搜索
                        $ionicPopup.prompt({
                            title: 'ID搜索',
                            cancelText: '取消',
                            cancelType: 'button-light',
                            okText: '确认搜索',
                            okType: 'button-energized',
                            inputPlaceholder: '请输入对方ID号'
                        }).then(function (res) {
                            $scope.searchForm.id = res;
                            userListPromise();
                            hideSheet();
                        });
                    }
                }
            });
        }

        // 加载更多
        $scope.loadMore = function () {

            api.list('/wap/site/user-list', $scope.searchForm).success(function (res) {
                if (res.data.length == 0) {
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

        // 选择城市
        $scope.bodyHeight = document.body.scrollHeight;
        if ($scope.bodyHeight == 0) $scope.bodyHeight = window.screen.height;
        $scope.scrollStyle = {
            'height': ($scope.bodyHeight - 44) + 'px',
            'float': 'left',
            'width': '50%'
        }

        // modal内左上角地理位置名称
        $scope.modalCityName = $scope.cityName;

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
        $scope.cityList = citys;

        /* 高级搜索 */
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
            $scope.searchForm.sex = value;
        }

        $scope.moreText = '展开';
        $scope.more = false;
        $scope.moreToggle = function () {
            $scope.more = !$scope.more;
            if ($scope.more) {
                $scope.moreText = '收起';
            } else {
                $scope.moreText = '展开';
            }
        }

        // 默认搜索条件


    }]);


})
