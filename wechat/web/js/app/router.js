/**
 * Created by Administrator on 2016/3/22.
 */
define(["app/module" , 'app/service/serviceApi'],
    function (module) {
        return module.config(["$stateProvider","$urlRouterProvider"  ,function ($stateProvider,$urlRouterProvider ) {
            $stateProvider
                .state('index', {
                    url: "/index",
                    templateUrl: "/wechat/views/site/index.html"
                })
                .state('member_information', {
                    url: "/member_information",
                    templateUrl: "/wechat/views/member/information.html"

                })
                .state('message' , {  // 消息首页
                    url: "/message",
                    templateUrl : "/wechat/views/message/index.html"
                })
                .state('message_chat', { // 聊天页面
                    url: "/message_chat?id",
                    templateUrl: "/wechat/views/message/chat.html",
                })
                .state('member', {
                    url: "/member_index",
                    templateUrl: "/wechat/views/member/index.html"
                })


            $urlRouterProvider.otherwise("/index");
        }])
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
