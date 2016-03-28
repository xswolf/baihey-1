/**
 * Created by Administrator on 2016/3/22.
 */

define(['angular','app/module','app/directive/directiveApi'
,'app/service/serviceApi'
], function (angular,module) {


    module.controller("myCtrl" , ['app.serviceApi','$scope',function (api,$scope ) {
        $scope.data = 123;
        $scope.status = 123;
        var r = api.getLoginStatus()
        console.log(r)
    }])

    return module;
})