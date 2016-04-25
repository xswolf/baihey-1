/**
 * Created by Administrator on 2016/3/22.
 */
define(["app/module", 'app/service/serviceApi'],
    function (module) {
        return module.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('main', {
                    url: "/main",
                    abstract: true,
                    templateUrl: "main.html",
                    controller: 'main'

                })
                .state('main.index', {   // 首页
                    url: "/index",
                    views: {
                        'main-tab': {
                            templateUrl: "/wechat/views/site/index.html"
                        }
                    }
                })
                .state('main.member_information', {
                    url: "/information",
                    views: {
                        'member-tab': {
                            templateUrl: "/wechat/views/member/information.html"
                        }
                    }
                })
                .state('main.member_dynamic', {
                    url: "/dynamic",
                    views: {
                        'member-tab': {
                            templateUrl: "/wechat/views/member/dynamic.html"
                        }
                    }
                })
                .state('main.message', {  // 消息首页
                    cache: false,
                    url: "/message",
                    views: {
                        'message-tab': {
                            templateUrl: "/wechat/views/message/index.html"
                        }
                    }
                })
                .state('main.message_chat', { // 聊天页面
                    cache: false,
                    url: "/chat?id&head_pic&real_name&sex&age",
                    views: {
                        'message-tab': {
                            templateUrl: "/wechat/views/message/chat.html"
                        }
                    }
                })
                .state('main.member', {
                    url: "/member",
                    views: {
                        'member-tab': {
                            templateUrl: "/wechat/views/member/index.html"
                        }
                    }
                })
                .state('main.discovery', {
                    url: "/discovery",
                    views: {
                        'discovery-tab': {
                            templateUrl: "/wechat/views/discovery/index.html"
                        }
                    }
                })
                .state('main.rendezvous', {
                    url: "/rendezvous",
                    views: {
                        'rendezvous-tab': {
                            templateUrl: "/wechat/views/rendezvous/index.html"
                        }
                    }
                });
            $urlRouterProvider.otherwise("/main/index");
        }])
            .controller('main', ['$scope', '$location', 'app.serviceApi', function ($scope, $location, api) {
                if (ar.getCookie('bhy_user_id') > 0) {
                    api.getMessageNumber().success(function (res) {
                        $scope.msgNumber = parseInt(res.data);
                    });
                    setInterval(function () {
                        api.getMessageNumber().success(function (res) {
                            $scope.msgNumber = parseInt(res.data);
                        });
                    }, 10000);
                } else {
                    $scope.msgNumber = 0;
                }
                $scope.showMenu = function (show) {
                    if (show) {
                        angular.element(document.querySelector('.tab-nav'))
                            .removeClass('hide');
                    } else {
                        angular.element(document.querySelector('.tab-nav'))
                            .addClass('hide');
                    }
                }
            }])
    });
