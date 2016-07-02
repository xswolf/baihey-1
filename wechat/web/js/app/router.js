/**
 * Created by Administrator on 2016/3/22.
 */
define(["app/module", 'app/service/serviceApi'],
    function (module) {
        module.run(['$rootScope', '$state', '$timeout', 'app.serviceApi', '$ionicLoading', '$location', '$templateCache', function ($rootScope, $state, $timeout, api, $ionicLoading, $location, $templateCache) {

            var messageList = function () {
                api.list('/wap/message/message-list', []).success(function (res) {
                    $rootScope.messageList = ar.getStorage('messageList') ? ar.getStorage('messageList') : [];
                    var list = res.data;
                    for (var i in list) {
                        list[i].info = JSON.parse(list[i].info);
                        list[i].auth = JSON.parse(list[i].auth);
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

            var msgNumber = function (userId) {
                if (userId > 0) {
                    api.getMessageNumber().success(function (res) {
                        $rootScope.msgNumber = parseInt(res.data);
                    });
                } else {
                    $rootScope.msgNumber = 0;
                }
            }

            var userId = ar.getCookie('bhy_user_id')
            if (userId > 0 ) {
                messageList();
                msgNumber(userId);
                requirejs(['plugin/socket/socket.io.1.4.0'], function (socket) {

                    var skt = socket.connect("http://120.76.84.162:8088");

                    skt.on(userId, function (response) {
                        messageList();
                        msgNumber(userId);
                    })

                })
            }

            $rootScope.$on('$stateChangeStart', function (evt, next) {

                // 判断用户是否登陆
                if ($location.$$url != '/index') { // 首页和欢迎页不判断
                    api.getLoginStatus().success(function (res) {
                        if (!res.status) {
                            location.href = '/wap/user/login';
                            return false;
                        }
                    })
                }


            });
            // 页面开始加载
            $rootScope
                .$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams) {
                        if (toState.url != '/index') {
                            $ionicLoading.show();
                        }
                    });
            // 页面加载成功
            $rootScope
                .$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        $ionicLoading.hide();
                        $templateCache.removeAll();  // 清除模版缓存
                    });
        }]);
        return module.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", "$controllerProvider", function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $controllerProvider) {
                $ionicConfigProvider.templates.maxPrefetch(0);
                $stateProvider
                    .state('index', {   // 首页
                        url: "/index",
                        templateUrl: "/wechat/views/site/index.html",
                        controller: 'site.index',
                        resolve: {
                            dataFilter: function ($http) {
                                return $http({
                                    method: 'POST',
                                    url: '/wap/user/index-is-show-data',
                                    params: {}
                                });
                            }
                        }
                    })
                    .state('index_discovery', {   // 首页
                        url: "/index_discovery",
                        templateUrl: "/wechat/views/site/discovery.html",
                        controller: 'site.discovery',
                        resolve: {
                            dataFilter: function ($http) {
                                return $http({
                                    method: 'POST',
                                    url: '/wap/user/index-is-show-data',
                                    params: {}
                                });
                            }
                        }
                    })
                    .state('member', {   // 我
                        url: "/member",
                        templateUrl: "/wechat/views/member/index.html",
                        controller: 'member.index'
                    })
                    .state('member_children', {   // 我-子页
                        cache: false,
                        url: '/member/:tempName',
                        templateUrl: function ($stateParams) {
                            return "/wechat/views/member/" + $stateParams.tempName + ".html";
                        },
                        controllerProvider: function ($stateParams) {
                            return 'member.' + $stateParams.tempName;
                        }
                    })
                    .state('message', {  // 消息首页
                        cache: false,
                        url: "/message",
                        templateUrl: "/wechat/views/message/index.html",
                        controller: "message.index",
                        resolve: {
                            dataFilter: function ($http) {
                                return $http({
                                    method: 'POST',
                                    url: '/wap/user/index-is-show-data',
                                    params: {}
                                });
                            }
                        }
                    })
                    .state('userInfo', {  // 查看用户资料
                        cache: false,
                        url: "/userInfo",
                        templateUrl: "/wechat/views/site/user_info.html",
                        controller: "member.user_info",
                        resolve: {
                            dataFilter: function ($http) {
                                return $http({
                                    method: 'POST',
                                    url: '/wap/user/index-is-show-data',
                                    params: {}
                                });
                            }
                        }

                    })
                    /*.state('main.message_chat', { // 聊天页面
                     cache: false,
                     url: "/chat",
                     views: {
                     'message-tab': {
                     templateUrl: "/wechat/views/message/chat.html",
                     controller: 'message.chat'
                     }
                     },

                     onExit: function ($rootScope) {

                     var messageList = ar.getStorage("messageList");
                     if (messageList == null) messageList = [];
                     var flag = true;
                     var i = 0;

                     if (messageList != undefined && messageList != '') {
                     for (i in messageList) {
                     if (messageList[i].receive_user_id == $rootScope.receiveUserInfo.id || messageList[i].send_user_id == $rootScope.receiveUserInfo.id) {
                     if ($rootScope.historyListHide != undefined && $rootScope.historyListHide.length > 0) {

                     messageList[i].message = $rootScope.historyListHide[$rootScope.historyListHide.length - 1].message
                     }
                     flag = false;
                     }
                     }
                     }
                     if (flag) {
                     $rootScope.receiveUserInfo.info = JSON.parse($rootScope.receiveUserInfo.info);
                     $rootScope.receiveUserInfo.auth = JSON.parse($rootScope.receiveUserInfo.auth);
                     $rootScope.receiveUserInfo.receive_user_id = $rootScope.receiveUserInfo.id;
                     $rootScope.receiveUserInfo.other = $rootScope.receiveUserInfo.id;
                     $rootScope.receiveUserInfo.send_user_id = $rootScope.receiveUserInfo.send_user_id;
                     if ($rootScope.historyListHide != undefined && $rootScope.historyListHide.length > 0) {
                     $rootScope.receiveUserInfo.message = $rootScope.historyListHide[$rootScope.historyListHide.length - 1].message
                     }

                     messageList.push($rootScope.receiveUserInfo);
                     }
                     ar.setStorage('messageList', messageList);

                     }
                     })*/
                    .state('chat', { // 聊天页面
                        cache: false,
                        url: "/chat1",
                        templateUrl: "/wechat/views/message/chat1.html",
                        controller: 'message.chat1',
                        resolve: {
                            dataFilter: function ($http) {
                                return $http({
                                    method: 'POST',
                                    url: '/wap/user/index-is-show-data',
                                    params: {}
                                });
                            }
                        },
                        onExit: function ($rootScope) {

                            var messageList = ar.getStorage("messageList");
                            if (messageList == null) messageList = [];
                            var flag = true;
                            var i = 0;

                            if (messageList != undefined && messageList != '') {
                                for (i in messageList) {
                                    if (messageList[i].receive_user_id == $rootScope.receiveUserInfo.id || messageList[i].send_user_id == $rootScope.receiveUserInfo.id) {
                                        if ($rootScope.historyListHide != undefined && $rootScope.historyListHide.length > 0) {

                                            messageList[i].message = $rootScope.historyListHide[$rootScope.historyListHide.length - 1].message
                                        }
                                        $rootScope.msgNumber = $rootScope.msgNumber - messageList[i].sumSend;
                                        flag = false;
                                    }
                                }
                            }
                            if (flag) {
                                $rootScope.receiveUserInfo.info = JSON.parse($rootScope.receiveUserInfo.info);
                                $rootScope.receiveUserInfo.auth = JSON.parse($rootScope.receiveUserInfo.auth);
                                $rootScope.receiveUserInfo.receive_user_id = $rootScope.receiveUserInfo.id;
                                $rootScope.receiveUserInfo.other = $rootScope.receiveUserInfo.id;
                                $rootScope.receiveUserInfo.send_user_id = $rootScope.receiveUserInfo.send_user_id;
                                if ($rootScope.historyListHide != undefined && $rootScope.historyListHide.length > 0) {
                                    $rootScope.receiveUserInfo.message = $rootScope.historyListHide[$rootScope.historyListHide.length - 1].message
                                }

                                messageList.push($rootScope.receiveUserInfo);
                            }
                            $rootScope.messageList = messageList;

                            ar.setStorage('messageList', messageList);

                        }
                    })

                    .state('discovery', {       // 发现
                        cache: false,
                        url: "/discovery",
                        templateUrl: "/wechat/views/discovery/index.html",
                        controller: 'discovery.index',
                        resolve: {
                            dataFilter: function ($http) {
                                return $http({
                                    method: 'POST',
                                    url: '/wap/user/index-is-show-data',
                                    params: {}
                                });
                            }
                        }
                    })
                    .state('discovery_single', {       // 发现-评论
                        cache: false,
                        url: "/discovery_single",
                        templateUrl: "/wechat/views/discovery/single.html",
                        controller: 'discovery.single'
                    })
                    .state('rendezvous', {     // 约会
                        url: "/rendezvous",
                        templateUrl: "/wechat/views/rendezvous/index.html",
                        controller: 'rendezvous.index'
                    })
                    .state('rendezvous_add', {     // 约会-发布约会
                        url: "/rendezvous_add",
                        templateUrl: "/wechat/views/member/rendezvous_add.html",
                        controller: 'member.rendezvous_add'
                    })
                    .state('rendezvous_ask', {     // 约会-约TA
                        url: "/rendezvous_ask",
                        templateUrl: "/wechat/views/rendezvous/ask.html",
                        controller: 'rendezvous.ask'
                    })
                    .state('charge_order', {     // 支付-订单信息
                        url: "/charge_order",
                        templateUrl: "/wechat/views/charge/order.html",
                        controller: 'charge.order'
                    })
                    .state('charge', {     // 充值
                        url: "/charge_index",
                        templateUrl: "/wechat/views/charge/index.html",
                        controller: 'charge.index'
                    });
                $urlRouterProvider.otherwise("/index");
            }])
            .controller('main', ['$scope', '$location', 'app.serviceApi', '$ionicLoading', '$ionicPopup','$rootScope', function ($scope, $location, api, $ionicLoading, $ionicPopup,$rootScope) {
                $rootScope.$on('msgNumber' , function () {
                    $scope.msgNumber = $rootScope.msgNumber;
                })

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
                    if ($scope.userInfo != null) {
                        $scope.userInfo.info = JSON.parse($scope.userInfo.info);
                        $scope.userInfo.auth = JSON.parse($scope.userInfo.auth);
                    }
                }
                var setUserInfoStorage = function () {
                    if ($scope.userInfo != null) {
                        $scope.userInfo.info = JSON.stringify($scope.userInfo.info);
                        $scope.userInfo.auth = JSON.stringify($scope.userInfo.auth);
                    }
                    ar.setStorage('userInfo', $scope.userInfo);
                    getUserStorage();
                }

                // 拉黑等信息
                $scope.authDataFilter = [];
                api.list('/wap/user/index-is-show-data', []).success(function (res) {
                    $scope.authDataFilter = res.data;
                });

                // 设置用户信息跳转至资料页
                $scope.setUserStorage = function () {
                    setUserInfoStorage();
                    window.location.hash = '#/member/information';
                }

                // 设置用户信息不跳转
                $scope.getUserPrivacyStorage = function (url) {
                    setUserInfoStorage();
                    if (url != '' && typeof(url) != undefined) {
                        window.location.hash = url;
                    }
                }

                $scope.userInfo = ar.getStorage('userInfo');
                if ($scope.userInfo != 'undefined' && $scope.userInfo) {
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

                $scope.showLoading = function (progress) {
                    $ionicLoading.show({
                        template: '<p class="tac">上传中...</p><p class="tac">' + progress + '%</p>'
                    });
                };
                $scope.hideLoading = function () {
                    $ionicLoading.hide();
                }

                // 图片上传目前用于诚信认证（obj，str）
                $scope.uploaderImage = function (uploader, name) {
                    var e = document.getElementById(name);
                    var ev = document.createEvent("MouseEvents");
                    ev.initEvent("click", true, true);
                    e.dispatchEvent(ev);

                    uploader.filters.push({
                        name: 'file-type-Res',
                        fn: function (item) {
                            if (!ar.msg_file_res_img(item)) {   // 验证文件是否是图片格式
                                ar.saveDataAlert($ionicPopup, '只能上传图片类型的文件！');
                                return false;
                            }
                            return true;
                        }
                    });

                    uploader.onAfterAddingFile = function (fileItem) {  // 选择文件后
                        fileItem.upload();   // 上传
                    };
                    uploader.onProgressItem = function (fileItem, progress) {   //进度条
                        $scope.showLoading(progress);    // 显示loading
                    };
                    uploader.onSuccessItem = function (fileItem, response, status, headers) {  // 上传成功
                        if (response.status > 0) {
                            // 将返回数据广播至 子member.js
                            $scope.$broadcast('thumb_path', name, response);
                        } else {
                            ar.saveDataAlert($ionicPopup, response.info);
                        }
                    };
                    uploader.onErrorItem = function (fileItem, response, status, headers) {  // 上传出错
                        ar.saveDataAlert($ionicPopup, '上传图片出错！');
                        $scope.hideLoading();  // 隐藏loading
                    };
                    uploader.onCompleteItem = function (fileItem, response, status, headers) {  // 上传结束
                        $scope.hideLoading();  // 隐藏loading

                    };
                }

                // 身份证认证判断
                $scope.honesty = function (val) {
                    return 1 & val;
                }
                //$scope.userInfo = [{}];

            }])
    });
