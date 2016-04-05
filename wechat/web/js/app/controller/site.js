/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'comm'
], function (module) {

    module.controller("site.index", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        $scope.data = {
            showDelete: false
        };

        $scope.itemButtons = [
            {
                text: 'Edit',
                type: 'button-assertive',
                onTap: function (item) {
                    alert('Edit Item: ' + item.id);
                }
            },
            {
                text: 'Share',
                type: 'button-calm',
                onTap: function (item) {
                    alert('Share Item: ' + item.id);
                }
            }
        ];

        $scope.onItemDelete = function (item) {
            $scope.items.splice($scope.items.indexOf(item), 1);
        };

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

    }])
})
