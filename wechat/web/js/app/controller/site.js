/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'app/filter/filterApi', 'config/city', 'config/occupation'
], function (module) {

    module.controller("site.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading) {
        $scope.searchForm = {
            data: {}
        }

        // 默认查询条件处理（性别处理）
        if (ar.getCookie('bhy_u_sex') && (ar.getCookie('bhy_u_sex') == 0)) {
            $scope.searchForm.data.sex = 1;
        } else {
            $scope.searchForm.data.sex = 0;
        }
        // 获取用户地理位置。 如果为获取到，则默认重庆
        if (ar.getCookie('bhy_u_city') && ar.getCookie('bhy_u_cityId')) {
            $scope.cityName = eval(ar.getCookie('bhy_u_city'));
            $scope.cityId = ar.getCookie('bhy_u_cityId');
            $scope.searchForm.data.city = ar.getCookie('bhy_u_cityId');
        } else {
            $scope.cityName = '重庆';
            $scope.cityId = 2;
            $scope.searchForm.data.city = 2
        }
        // 默认查询条件,年龄范围，页码，页数
        $scope.searchForm.data.age = '18-28';
        $scope.searchForm.data.pageNum = 1;
        $scope.searchForm.data.pageSize = 6;

        // 地区选择查询广播
        $scope.$on('cityName', function (event, data) {
            $scope.cityName = data.name;
            $scope.cityId = data.id;
            $scope.searchForm.data.city = data.id;
            $scope.searchForm.data.cityName = data.name;
            $scope.searchForm.data.pageNum = 1;
            $scope.pageLast = true;
            api.list("/wap/site/user-list", $scope.searchForm.data).success(function (res) {
                $scope.userList = res.data;
                for (var i in $scope.userList) {
                    $scope.userList[i].info = JSON.parse($scope.userList[i].info);
                    $scope.userList[i].auth = JSON.parse($scope.userList[i].auth);
                }
            })
        });

        // 获取默认list
        api.list("/wap/site/user-list", $scope.searchForm.data).success(function (res) {
            $scope.userList = res.data;
            for (var i in $scope.userList) {
                $scope.userList[i].info = JSON.parse($scope.userList[i].info);
                $scope.userList[i].auth = JSON.parse($scope.userList[i].auth);
            }
        })


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
            $scope.searchModal = modal;
            $scope.moreSearchModal = modal;
        });

        $scope.moreSearchModalHide = function () {
            $scope.moreSearchModal.hide();
            //console.log($scope.searchForm.data);
            $scope.searchForm.data.pageNum = 1;
            $scope.pageLast = true;
            $scope.user = api.list("/wap/site/user-list", $scope.searchForm.data);
            $scope.user.success(function (res) {
                $scope.userList = res.data;
                for (var i in $scope.userList) {
                    $scope.userList[i].info = JSON.parse($scope.userList[i].info);
                    $scope.userList[i].auth = JSON.parse($scope.userList[i].auth);
                }
            })
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
                cancel: function () {

                },
                buttonClicked: function (index) {
                    var user = null;
                    $scope.buttonsItemIndex = index;

                    if (index == 0) {   // 全部
                        $scope.searchForm.data.sex = 'all';
                        $scope.searchForm.data.pageNum = 1;
                        $scope.pageLast = true;
                        user = api.list("/wap/site/user-list", $scope.searchForm.data);
                    }

                    if (index == 1) {   //只看男
                        $scope.searchForm.data.sex = 1;
                        $scope.searchForm.data.pageNum = 1;
                        $scope.pageLast = true;
                        user = api.list("/wap/site/user-list", $scope.searchForm.data);
                    }

                    if (index == 2) {   //只看女
                        $scope.searchForm.data.sex = 0;
                        $scope.searchForm.data.pageNum = 1;
                        $scope.pageLast = true;
                        user = api.list("/wap/site/user-list", $scope.searchForm.data);
                    }

                    if (index == 3) {   //高级搜索
                        $scope.$broadcast('someEvent', $scope.searchForm.data);
                        $scope.searchModal.show();

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
                            api.list("/wap/site/user-list", {'id': res}).success(function (res) {
                                $scope.userList = res.data;
                                $scope.userList[0].info = JSON.parse($scope.userList[0].info);
                                $scope.userList[i].auth = JSON.parse($scope.userList[i].auth);
                            })
                        });
                    }
                    if (user != undefined) {
                        user.success(function (res) {
                            $scope.userList = res.data;
                            for (var i in $scope.userList) {
                                $scope.userList[i].info = JSON.parse($scope.userList[i].info);
                                $scope.userList[i].auth = JSON.parse($scope.userList[i].auth);
                            }
                        })
                    }


                    return true;
                }
            });

        }

        // 是否还有更多
        $scope.pageLast = true;

        // 点击加载更多
        $scope.loadMore = function () {
            $scope.searchForm.data.pageNum++;

            api.list('/wap/site/user-list', $scope.searchForm.data).success(function (res) {

                if (res.data.length < $scope.searchForm.data.pageSize) {
                    $scope.pageLast = false;
                }

                for (var i in res.data) {
                    res.data[i].info = JSON.parse(res.data[i].info);
                    res.data[i].auth = JSON.parse(res.data[i].auth);
                }
                $scope.userList = $scope.userList.concat(res.data);


            });

        }

    }]);

    //选择城市
    module.controller('site.childCityController', ['app.serviceApi', '$scope', function (api, $scope) {


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
            //$scope.searchForm.data.city = city_id;
        }

        // 保存已选择城市
        $scope.citySave = function () {

            for (var i = 0; i < $scope.citys.length; i++) {
                if ($scope.citys[i].id == $scope.cityId) {
                    $scope.modalCityName = $scope.citys[i].name;
                    $scope.$emit('cityName', $scope.citys[i]);
                    continue;
                }
            }

            $scope.cityModal.hide();
        }

        $scope.provinces = provines;
        $scope.citys = citys;

    }]);

    // 高级搜索
    module.controller('site.childSearchController', ['app.serviceApi', '$scope', function (api, $scope) {
        $scope.$on('someEvent', function (event, mass) {
            $scope.searchForm.data = mass;
        });
        $scope.searchForm = {};
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

        $scope.searchForm.sex = 'all';
        // 职业赋值
        $scope.occupations = occupation;

        $scope.searchForm.clickSex = function (value) {
            $scope.searchForm.sex = value;
            $scope.searchForm.data.sex = value;
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


    }]);

    module.controller('footer', ['app.serviceApi', '$scope', '$location', function (api, $scope, $location) {
        $scope.menu = $location.url();
        $scope.switchMenu = function (menu) {
            $scope.menu = menu;
        }
    }]);



})
