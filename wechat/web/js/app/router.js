/**
 * Created by Administrator on 2016/3/22.
 */
define(["app/module"],
    function (module) {
        return module.config(function ($stateProvider,$urlRouterProvider) {
            $stateProvider
                .state('index', {
                    url: "/index",
                    templateUrl: "/wechat/views/site/index.html"
                })
                .state('member_information', {
                    url: "/information",
                    templateUrl: "/wechat/views/member/information.html"

                }).state('message' , {
                    url: "/message",
                    templateUrl : "/wechat/views/message/index.html"
                })
                .state('member', {
                    url: "/site_index",
                    templateUrl: "/wechat/views/member/index.html"
                })

            $urlRouterProvider.otherwise("/index");
        })
    });


/*
define(["app/module"],
    function (module) {
        return module.run([
                '$rootScope',
                '$state',
                '$stateParams',
                function ($rootScope, $state, $stateParams) {
                    $rootScope.$state = $state;
                    $rootScope.$stateParams = $stateParams
                }
            ])
            .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {
                //用于改变state时跳至顶部
                $uiViewScrollProvider.useAnchorScroll();
                // 默认进入先重定向
                $urlRouterProvider.otherwise('/home');
                $stateProvider
                    .state('home', {
                        //abstract: true,
                        url: '/home',
                        views: {
                            'main@': {
                                templateUrl: '../view/home.html'
                            }
                        }
                    })
            })
    });
*/
