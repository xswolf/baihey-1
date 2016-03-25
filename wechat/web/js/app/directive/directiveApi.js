/**
 * Created by Administrator on 2016/3/23.
 */
define(['app/module'] , function (module) {

    module.directive("hello", function() {
        return {
            restrict : "A",
            $scope: {
                title: '@'
            },
            template : "<h1>{{title}}自定义指12121令!<span ng-transclude></span></h1>",

            transclude:true
        }
    });

})