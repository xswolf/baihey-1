/**
 * Created by Administrator on 2016/3/22.
 */

define(['angular','app/module'], function (angular,module) {
    //module.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    //    $urlRouterProvider.otherwise("/");
    //    $stateProvider.state('list', {
    //        url: "/",
    //        controller: 'goods.ListController',
    //        templateUrl: 'tpl-list.html'
    //    }).state('list-id', {
    //        url: "/list/{mid:int}",
    //        controller: 'goods.ListController',
    //        templateUrl: 'tpl-list.html'
    //    });
    //}])

    module.directive("rundirective", function() {
        console.log('directive');
        return {
            restrict : "A",
            template : "<h1>自定义指12121令!</h1>"
        }
    });

    module.directive('hello' , function () {
        return {
            restrict:"A",
            template:"<span>abc</span>"
        }
    });

    module.service('$server_test' , function () {
        this.func = function () {
            return 'this is server';
        }
    })

    module.controller("myCtrl" , function ($scope , $server_test) {
        $scope.data = 123;
        console.log($server_test.func());
    })


    return module;
})