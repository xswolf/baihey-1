/**
 * Created by Administrator on 2016/3/22.
 */
define(["app/module" , 'app/service/serviceApi'],
    function (module) {
        return module.config(["$stateProvider","$urlRouterProvider"  ,function ($stateProvider,$urlRouterProvider ) {
            $stateProvider
                .state('main', {
                    url: "/main",
                    abstract: true,
                    templateUrl: "main.html"
                })
                .state('main.index', {   // 首页
                    url: "/index",
                    views: {
                        'main-tab': {
                            templateUrl: "/wechat/views/site/index.html",
                        }
                    }
                })
                .state('main.member_information', {
                    url: "/information",
                    views: {
                        'member-tab': {
                            templateUrl: "/wechat/views/member/information.html",
                        }
                    }
                })
                .state('main.message' , {  // 消息首页
                    url: "/message",
                    views: {
                        'message-tab': {
                            templateUrl: "/wechat/views/message/index.html",
                        }
                    }
                })
                .state('main.message_chat', { // 聊天页面
                    url: "/chat?id&head_pic",
                    views: {
                        'message-tab': {
                            templateUrl: "/wechat/views/message/chat.html",
                        }
                    }
                })
                .state('main.member', {
                    url: "/member",
                    views: {
                        'member-tab': {
                            templateUrl: "/wechat/views/member/index.html",
                        }
                    }
                })
                .state('main.discovery', {
                    url: "/discovery",
                    views: {
                        'discovery-tab': {
                            templateUrl: "/wechat/views/discovery/index.html",
                        }
                    }
                })
                .state('main.rendezvous', {
                    url: "/rendezvous",
                    views: {
                        'rendezvous-tab': {
                            templateUrl: "/wechat/views/rendezvous/index.html",
                        }
                    }
                })


            $urlRouterProvider.otherwise("/main/index");
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
