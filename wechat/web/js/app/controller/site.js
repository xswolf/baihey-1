/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    module.controller("site.index", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicModal', function (api, $scope, $ionicPopup, $ionicModal) {

        $scope.items = [
            {
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            },
            {
                id: 4
            },
            {
                id: 5
            },
            {
                id: 6
            },
            {
                id: 7
            },
            {
                id: 8
            },
            {
                id: 9
            },
            {
                id: 10
            }
        ];

        $ionicModal.fromTemplateUrl('selCityModal.html', function (modal) {
            $scope.modal = modal;
        }, {
            animation: 'slide-in-up',
            focusFirstInput: true
        });


    }]);

    module.controller('site.childController', ['app.serviceApi', '$scope', function (api, $scope) {

        $scope.bodyHeight = document.body.scrollHeight;
        if ($scope.bodyHeight == 0) $scope.bodyHeight = window.screen.height;
        $scope.scrollStyle = {
            'height': ($scope.bodyHeight - 44) + 'px',
            'float': 'left',
            'width': '50%'
        }
        $scope.selId =1;

        $scope.selected_pv = function(pv_id){
            $scope.selId = pv_id;
        }

        $scope.provinces = [
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

    }])
})
