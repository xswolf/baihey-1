/**
 * Created by Administrator on 2016/3/23.
 */
define(['app/module'], function (module) {

    module.directive("config", function () {
        return {
            restrict: "E",
            link: function ($scope, element) {
                console.log(element.html());
                //$scope.Chat.config =
            }
        }
    });

    module.directive("height", function () {
        return {
            restrict: "EA",
            replace: true,
            template: function (tElement, tAttrs) {
                var ageHtml = "",
                    ageMin = 140,
                    ageMax = 260;
                for (ageMin; ageMin <= ageMax; ageMin++) {
                    ageHtml += '<option value="';
                    ageHtml += ageMin;
                    ageHtml += '">';
                    ageHtml += ageMin;
                    ageHtml += '</option>';
                }
                return ageHtml;
            }
        }
    });

})



