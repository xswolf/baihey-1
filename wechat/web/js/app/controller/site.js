/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'app/filter/filterApi', 'config/city'
], function (module) {

    module.controller("site.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading) {

        // 加载中动画
        //$ionicLoading.show({
        //    content: 'Loading',
        //    animation: 'fade-in',
        //    showBackdrop: false,
        //    maxWidth: 200,
        //    showDelay: 0
        //});

        $scope.searchForm = {
            data: {}
        }

        // 默认查询条件处理（性别处理）
        if (ar.getCookie('bhy_u_sex') && (ar.getCookie('bhy_u_sex') == 0)) {
            $scope.searchForm.data.sex = 1;
        } else {
            $scope.searchForm.data.sex = 0;
        }
        // 微信接口，获取用户地理位置。 如果用户拒绝提供位置，则默认重庆
        $scope.cityName = '重庆';
        $scope.cityId = 2;
        $scope.searchForm.data.age = '18-28';

        // 地区选择查询广播
        $scope.$on('cityName',function(event,data) {
            $scope.cityName = data.name;
            $scope.cityId = data.id;
            api.list("/wap/site/user-list", {'city': $scope.cityId,'sex': $scope.searchForm.data.sex, 'age': $scope.searchForm.data.age}).success(function (res) {
                $scope.items = res.data;
                for (var i in $scope.items) {
                    $scope.items[i].info = JSON.parse($scope.items[i].info);
                    $scope.items[i].identity_pic = JSON.parse($scope.items[i].identity_pic);
                }
            })
        });

        // 获取当前用户信息
        api.getUserInfo().success(function (res) {
            if (res.data) {
                $scope.userInfo = res.data;
                $scope.userInfo.info = JSON.parse($scope.userInfo.info);
                $scope.userInfo.identity_pic = JSON.parse($scope.userInfo.identity_pic);
            } else {
                $scope.userInfo = [];
                console.log('没有获取到当前用户信息');
            }

        });

        // 地区处理
        $scope.searchForm.data.city = $scope.cityId;

        api.list("/wap/site/user-list", {'city': $scope.searchForm.data.city,'sex': $scope.searchForm.data.sex, 'age': $scope.searchForm.data.age}).success(function (res) {
            $scope.items = res.data;
            for (var i in $scope.items) {
                $scope.items[i].info = JSON.parse($scope.items[i].info);
                $scope.items[i].identity_pic = JSON.parse($scope.items[i].identity_pic);
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
            $scope.user = api.list("/wap/site/user-list", $scope.searchForm.data);
            $scope.user.success(function (res) {
                $scope.items = res.data;
                for (var i in $scope.items) {
                    $scope.items[i].info = JSON.parse($scope.items[i].info);
                    $scope.items[i].identity_pic = JSON.parse($scope.items[i].identity_pic);
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

                    }

                    if (index == 1) {   //只看男
                        $scope.searchForm.data.sex = 1;
                        user = api.list("/wap/site/user-list", $scope.searchForm.data);
                    }

                    if (index == 2) {   //只看女
                        $scope.searchForm.data.sex = 0;
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
                                $scope.items = res.data;
                                $scope.items[0].info = JSON.parse($scope.items[0].info);
                                $scope.items[i].identity_pic = JSON.parse($scope.items[i].identity_pic);
                            })
                        });
                    }
                    if (user != undefined) {
                        user.success(function (res) {
                            $scope.items = res.data;
                            for (var i in $scope.items) {
                                $scope.items[i].info = JSON.parse($scope.items[i].info);
                                $scope.items[i].identity_pic = JSON.parse($scope.items[i].identity_pic);
                            }
                        })
                    }


                    return true;
                }
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
                if($scope.citys[i].id == $scope.cityId){
                    $scope.modalCityName = $scope.citys[i].name;
                    $scope.$emit('cityName',$scope.citys[i]);
                    continue;
                }
            }

            $scope.cityModal.hide();
        }

        console.log(provines[0]);
        $scope.provinces = provines;
        $scope.citys = citys;

        /*$scope.provinces = [
            {
                id: 1,
                name: '重庆市'
            },
            {
                id: 2,
                name: '北京市'

            },
            {
                id: 3,
                name: '上海市'
            },
            {
                id: 4,
                name: '天津市'
            },
            {
                id: 5,
                name: '广东省'
            },
            {
                id: 6,
                name: '四川省'
            },
            {
                id: 7,
                name: '浙江省'
            },
            {
                id: 8,
                name: '辽宁省'
            },
            {
                id: 9,
                name: '吉林省'
            },
            {
                id: 10,
                name: '陕西省'
            }
            ,
            {
                id: 11,
                name: '陕西省'
            }
            ,
            {
                id: 12,
                name: '陕西省'
            }
            ,
            {
                id: 13,
                name: '陕西省'
            }
            ,
            {
                id: 14,
                name: '陕西省'
            }
            ,
            {
                id: 15,
                name: '陕西省'
            }
            ,
            {
                id: 16,
                name: '陕西省'
            }
            ,
            {
                id: 17,
                name: '陕西省'
            }
            ,
            {
                id: 18,
                name: '陕西省'
            }
            ,
            {
                id: 19,
                name: '陕西省'
            }

        ]


        $scope.citys = [
            {
                id: 11,
                parent: 1,
                name: '重庆市'
            },
            {
                id: 21,
                parent: 2,
                name: '北京市'
            },
            {
                id: 31,
                parent: 3,
                name: '上海市'
            },
            {
                id: 41,
                parent: 4,
                name: '天津市'
            },
            {
                id: 51,
                parent: 5,
                name: '广州市'
            },
            {
                id: 52,
                parent: 5,
                name: '深圳市'
            },
            {
                id: 53,
                parent: 5,
                name: '东莞市'
            }
        ];
*/
    }]);

    // 高级搜索
    module.controller('site.childSearchController', ['app.serviceApi', '$scope', function (api, $scope) {
        $scope.$on('someEvent', function (event, mass) {
            $scope.searchForm.data = mass;
        });
        $scope.searchForm = {};

        $scope.searchForm.sex = 'all';

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

})
