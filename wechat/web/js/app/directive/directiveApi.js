/**
 * Created by Administrator on 2016/3/23.
 */
define(['angular','app/module'] , function (ng,module) {

    module.directive("hello", function() {
        return {
            restrict : "A",
            template : "<h1>自定义指12121令!</h1>"
        }
    });

})