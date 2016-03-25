/**
 * Created by Administrator on 2016/3/22.
 */

define(['angular','app/module','app/directive/directiveApi'
,'app/service/serviceApi'
], function (angular,module,directiveApi,service) {

    module.controller("modal" , ['app.serviceApi','$scope',function (api,$scope ) {
        $scope.title = '';
        var r = api.getLoginStatus()
        console.log(r)
    }])


    return module;
})