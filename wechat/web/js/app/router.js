/**
 * Created by Administrator on 2016/3/22.
 */
define(["app/module", 'app/service/serviceApi'],
    function (module) {
        module.run(['$rootScope', '$state', '$timeout', 'app.serviceApi', function ($rootScope, $state, $timeout, api) {
            var messageList = function () {
                api.list('/wap/message/message-list', []).success(function (res) {
                    $rootScope.messageList = ar.getStorage('messageList') ? ar.getStorage('messageList') : [];
                    var list = res.data;
                    for (var i in list) {
                        list[i].info = JSON.parse(list[i].info);
                        list[i].identity_pic = JSON.parse(list[i].identity_pic);
                        var flag = true;
                        for (var j in $rootScope.messageList) {  // 相同消息合并
                            if ($rootScope.messageList[j].send_user_id == list[i].send_user_id) {
                                $rootScope.messageList[j] = list[i];
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            $rootScope.messageList.push(list[i]);
                        }
                    }
                    //console.log($rootScope.messageList)
                    ar.setStorage('messageList', $rootScope.messageList)
                });
            }
            $rootScope.$on('$stateChangeStart', function (evt, next) {
                if (next.url == '/message') {
                    messageList();
                    $rootScope.handle = setInterval(function () {
                        messageList();
                    }, 5000);
                } else {
                    clearInterval($rootScope.handle)
                }

            })
        }]);
        return module.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
                $ionicConfigProvider.templates.maxPrefetch(0);
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
                    .state('main.member_signature', {
                        url: "/signature",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/signature.html",
                                controller: 'member.signature'
                            }
                        }
                    })
                    .state('main.member_real_name', {
                        url: "/real_name",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/real_name.html",
                                controller: 'member.real_name'
                            }
                        }
                    })
                    .state('main.member_age', {
                        url: "/age",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/age.html",
                                controller: 'member.age'
                            }
                        }
                    })
                    .state('main.member_height', {
                        url: "/height",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/height.html",
                                controller: 'member.height'
                            }
                        }
                    })
                    .state('main.member_is_marriage', {
                        url: "/is_marriage",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/is_marriage.html",
                                controller:'member.is_marriage'
                            }
                        }
                    })
                    .state('main.member_education', {
                        url: "/education",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/education.html",
                                controller:'member.education'
                            }
                        }
                    })
                    .state('main.member_occupation', {
                        url: "/occupation",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/occupation.html",
                                controller:'member.occupation'
                            }
                        }
                    })
                    .state('main.member_address', {
                        url: "/address",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/address.html",
                                controller:'member.address'
                            }
                        }
                    })
                    .state('main.member_haunt_address', {
                        url: "/haunt_address",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/haunt_address.html",
                                controller:'member.haunt_address'
                            }
                        }
                    })
                    .state('main.member_wechat_number', {
                        url: "/wechat_number",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/wechat_number.html",
                                controller:'member.wechat_number'
                            }
                        }
                    })
                    .state('main.member_qq_number', {
                        url: "/wechat_number",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/qq_number.html"
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
                        },

                        onExit: function ($rootScope) {

                            var messageList = ar.getStorage("messageList");
                            var flag = true;
                            var i = 0;

                            if (messageList != undefined && messageList != '') {
                                for (i in messageList) {
                                    if (messageList[i].receive_user_id == $rootScope.receiveUserInfo.id || messageList[i].send_user_id == $rootScope.receiveUserInfo.id) {
                                        if ($rootScope.historyList != undefined && $rootScope.historyList.length > 0) {

                                            messageList[i].message = $rootScope.historyList[$rootScope.historyList.length - 1].message
                                        }
                                        flag = false;
                                    }
                                }
                            }
                            if (flag) {
                                $rootScope.receiveUserInfo.info = JSON.parse($rootScope.receiveUserInfo.info);
                                $rootScope.receiveUserInfo.identity_pic = JSON.parse($rootScope.receiveUserInfo.identity_pic);
                                $rootScope.receiveUserInfo.receive_user_id = $rootScope.receiveUserInfo.id;
                                $rootScope.receiveUserInfo.other = $rootScope.receiveUserInfo.id;
                                $rootScope.receiveUserInfo.send_user_id = $rootScope.receiveUserInfo.send_user_id;
                                if ($rootScope.historyList != undefined && $rootScope.historyList.length > 0) {
                                    $rootScope.receiveUserInfo.message = $rootScope.historyList[$rootScope.historyList.length - 1].message
                                }

                                messageList.push($rootScope.receiveUserInfo);
                            }


                            ar.setStorage('messageList', messageList);

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
                //$urlRouterProvider.otherwise("/main/index");
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
