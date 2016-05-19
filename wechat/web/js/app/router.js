/**
 * Created by Administrator on 2016/3/22.
 */
define(["app/module", 'app/service/serviceApi'],
    function (module) {
        module.run(['$rootScope', '$state', '$timeout', 'app.serviceApi', '$ionicLoading', function ($rootScope, $state, $timeout, api, $ionicLoading) {
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

            });
            // 页面开始加载
            $rootScope
                .$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams) {
                        $ionicLoading.show();
                        //console.info(event, toState, toParams, fromState, fromParams)
                    });
            // 页面加载成功
            $rootScope
                .$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        $ionicLoading.hide();
                    });
        }]);
        return module.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider","$controllerProvider", function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,$controllerProvider) {
                $ionicConfigProvider.templates.maxPrefetch(0);
                $ionicConfigProvider.tabs.position("bottom");
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
                            'home-tab': {
                                templateUrl: "/wechat/views/site/index.html"
                            }
                        }
                    })
                    .state('main.member', {   // 我
                        url: "/member",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/index.html"
                            }
                        }
                    })
                    .state('main.member-children', {   // 我-子页
                        url: '/member/:tempName',
                        views: {
                            'member-tab': {
                                templateUrl: function ($stateParams) {
                                    return "/wechat/views/member/" + $stateParams.tempName + ".html";
                                },
                                controllerProvider: function($stateParams){
                                    return 'member.'+$stateParams.tempName;
                                }
                            }
                        }
                    })
                    .state('main.member_user_info', {  // 用户资料
                        url: "/user_info?userId&tempUrl",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/member/user_info.html",
                                controller: 'member.user_info'
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
                    .state('main.discovery', {       // 发现
                        url: "/discovery?userId?tempUrl",
                        views: {
                            'discovery-tab': {
                                templateUrl: "/wechat/views/discovery/index.html",
                                controller: 'discovery.index'
                            }
                        }
                    })
                    .state('main.dynmaic', {       // 个人动态
                        url: "/dynmaic?userId?tempUrl",
                        views: {
                            'member-tab': {
                                templateUrl: "/wechat/views/discovery/index.html",
                                controller: 'discovery.index'
                            }
                        }
                    })
                    .state('main.discovery_single', {       // 发现-个人
                        url: "/discovery_single?id",
                        views: {
                            'discovery-tab': {
                                templateUrl: "/wechat/views/discovery/single.html",
                                controller: 'discovery.single'
                            }
                        }
                    })
                    .state('main.rendezvous', {     // 约会
                        url: "/rendezvous",
                        views: {
                            'rendezvous-tab': {
                                templateUrl: "/wechat/views/rendezvous/index.html",
                                controller: 'rendezvous.index'
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
                $scope.upUserStorage = function (name, value, type) {
                    if (type == 'wu') {
                        eval('$scope.userInfo.' + name + ' = ' + value);
                    } else {
                        eval('$scope.userInfo.' + type + '.' + name + ' = ' + value);
                    }
                }

                // 以下为用户信息处理
                $scope.userInfo = [];
                var getUserStorage = function () {
                    $scope.userInfo.info = JSON.parse($scope.userInfo.info);
                    $scope.userInfo.identity_pic = JSON.parse($scope.userInfo.identity_pic);
                }
                var setUserInfoStorage = function () {
                    $scope.userInfo.info = JSON.stringify($scope.userInfo.info);
                    $scope.userInfo.identity_pic = JSON.stringify($scope.userInfo.identity_pic);
                    ar.setStorage('userInfo', $scope.userInfo);
                    getUserStorage();
                }

                // 设置用户信息跳转至资料页
                $scope.setUserStorage = function () {
                    setUserInfoStorage();
                    window.location.hash = '#/main/member/information';
                }

                // 设置用户信息不跳转
                $scope.getUserPrivacyStorage = function () {
                    setUserInfoStorage();
                }

                if ($scope.userInfo = ar.getStorage('userInfo')) {
                    getUserStorage();
                } else if (ar.getCookie('bhy_user_id')) {
                    api.list("/wap/user/get-user-info", []).success(function (res) {
                        $scope.userInfo = res.data;
                        ar.setStorage('userInfo', res.data);
                        getUserStorage();
                    });
                }

                // 用于想去的地方，去过的地方等
                $scope.getTravel = function (name, serId) {
                    if (serId != null) {
                        var arrSer = serId.split(',');
                        eval("$scope." + name + "_count = " + arrSer.length);
                        api.list('/wap/member/get-travel-list', {'area_id': serId}).success(function (res) {
                            eval("$scope." + name + " = " + JSON.stringify(res.data));
                        });
                    } else {
                        eval("$scope." + name + "_count = " + 0);
                    }
                }
                $scope.getConfig = function (name, serId) {
                    if (serId != null) {
                        var arrSer = serId.split(',');
                        eval("$scope." + name + "_count = " + arrSer.length);
                        api.list('/wap/member/get-config-list', {'config_id': serId}).success(function (res) {
                            eval("$scope." + name + " = " + JSON.stringify(res.data));
                        });
                    } else {
                        eval("$scope." + name + "_count = " + 0);
                    }
                }
                //$scope.userInfo = [{}];
            }])
    });
