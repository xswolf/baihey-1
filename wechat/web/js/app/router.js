/**
 * Created by Administrator on 2016/3/22.
 */
define(["app/module", 'app/service/serviceApi'],
    function (module) {
        module.run(['$rootScope', '$state', '$timeout', 'app.serviceApi', '$ionicLoading', function ($rootScope, $state, $timeout, api, $ionicLoading) {
            var userId = ar.getCookie('bhy_user_id');
            var messageList = function () {
                api.list('/wap/message/message-list', []).success(function (res) {
                    var storageList = ar.getStorage('messageList-'+userId) ? ar.getStorage('messageList-'+userId) : [];
                    var list = res.data;
                    for (var i in list) {
                        list[i].info = JSON.parse(list[i].info);
                        list[i].auth = JSON.parse(list[i].auth);
                        list[i].order_time = parseInt(list[i].create_time); // ar.timeStamp();  // 消息时间
                        var flag = true;

                        for (var j in storageList) {  // 相同消息合并
                            if (storageList[j].send_user_id == list[i].send_user_id) {
                                storageList[j] = list[i];
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            storageList.push(list[i]);
                        }
                    }
                    $rootScope.messageList = storageList;
                    ar.setStorage('messageList-'+userId, storageList)
                    // 计算总共有多少条消息
                    var num = 0;
                    for(var i in storageList){
                        if (parseInt(storageList[i].sumSend) > 0){
                            num += parseInt(storageList[i].sumSend);
                        }
                    }
                    $rootScope.msgNumber = num;
                });
            }
            $rootScope.dataFilter = JSON.parse(ar.getCookie("indexIsShowData"));

            if (userId > 0) {
                requirejs(['plugin/socket/socket.io.1.4.0'], function (socket) {

                    var indexIsShowData = function () {
                        api.list("/wap/user/index-is-show-data",{}).success(function (res) {
                            $rootScope.dataFilter = res;
                        });
                    }
                    var skt = socket.connect("http://120.76.84.162:8088");

                    skt.on(userId, function (response) {
                        // 两人对聊时不需要执行messageList
                        if(!($state.current.url == '/chat1/:id' &&　$state.params.id == response.send_user_id )){
                            messageList();
                        }
                        indexIsShowData();
                    })
                })
            }
            // 页面开始加载
            $rootScope
                .$on('$stateChangeStart',
                    function (event, toState) {
                        if (toState.url != '/index' && toState.url != '/error') {
                            $ionicLoading.show();
                            if (sessionStorage.loginStatus === undefined) {
                                api.getLoginStatus().success(function (res) {
                                    sessionStorage.loginStatus = res.status;
                                    if (!res.status) {
                                        location.href = '/wap/user/login';
                                        return false;
                                    }
                                })
                            }else if(!sessionStorage.loginStatus) {
                                location.href = '/wap/user/login';
                                return false;
                            }
                        }

                        var together = function () {
                            messageList();
                            mainIntercept();
                        }
                        $timeout(together, 500);

                    });
            // 页面加载成功
            $rootScope
                .$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        $ionicLoading.hide();
                        //$templateCache.removeAll(); // test1清除模版缓存
                    });

            // 相关监听
            function mainIntercept() {

                // 监听是否有新的用户关注自己
                $rootScope.newFollow = false;
                $rootScope.newFollowNumber = 0;
                api.get('/wap/follow/is-new-follow', {user_id: userId}).success(function (res) {
                    $rootScope.newFollow = res.status;
                    $rootScope.newFollowNumber = res.data;
                })

                // 获取评论总数
                $rootScope.newDiscovery = 0;
                api.get('/wap/member/comment-num', {}).success(function (res) {
                    var discoverySum = ar.getStorage('discoverySum');
                    if (res.data > discoverySum) {
                        $rootScope.newDiscovery = res.data - discoverySum;
                    }
                })
            }
        }]);
        return module.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", "$controllerProvider", function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
                $ionicConfigProvider.templates.maxPrefetch(0);
                $stateProvider
                    .state('index', {   // 首页
                        url: "/index",
                        templateUrl: "/wechat/views/site/index.html",
                        controller: 'site.index'
                    })
                    .state('index_discovery', {   // 查看他人动态
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
                    .state('error', {   // 首页
                        url: "/error",
                        templateUrl: "/wechat/views/site/error.html",
                        controller: 'site.error'
                    })
                    .state('member', {   // 我
                        cache:false,
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
                        cache: true,
                        url: "/message",
                        templateUrl: "/wechat/views/message/index.html",
                        controller: "message.index"
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
                    .state('adminInfo', {  // 查看官方号资料
                        cache: false,
                        url: "/admin_info",
                        templateUrl: "/wechat/views/site/admin_info.html",
                        controller: "member.admin_info",
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
                    .state('chat', { // 聊天页面
                        cache:true,
                        url: "/chat1/:id",
                        templateUrl: "/wechat/views/message/chat1.html",
                        controller: 'message.chat1',

                        onExit: function ($rootScope) {

                            var messageList = ar.getStorage('messageList-' + ar.getCookie('bhy_user_id'));
                            if (messageList == null) messageList = [];
                            var flag = true;

                            if (messageList != undefined && messageList != '') {
                                for (var i in messageList) {
                                    if (messageList[i].receive_user_id == $rootScope.receiveUserInfo.id || messageList[i].send_user_id == $rootScope.receiveUserInfo.id) {
                                        if ($rootScope.historyListHide != undefined && $rootScope.historyListHide.length > 0) {
                                            if (messageList[i].message != $rootScope.historyListHide[$rootScope.historyListHide.length - 1].message) {
                                                messageList[i].order_time = ar.timeStamp();
                                            }
                                            messageList[i].message = $rootScope.historyListHide[$rootScope.historyListHide.length - 1].message
                                        }
                                        messageList[i].sumSend = 0;
                                        messageList[i].status = 1;

                                        flag = false;
                                        break;
                                    }
                                }
                            }


                            if (flag && $rootScope.historyListHide.length > 0) { // 有聊天信息，且没有加入storage
                                $rootScope.receiveUserInfo.info = JSON.parse($rootScope.receiveUserInfo.info);
                                $rootScope.receiveUserInfo.auth = JSON.parse($rootScope.receiveUserInfo.auth);
                                $rootScope.receiveUserInfo.receive_user_id = ar.getCookie('bhy_user_id');
                                $rootScope.receiveUserInfo.other = $rootScope.receiveUserInfo.id;
                                $rootScope.receiveUserInfo.order_time = ar.timeStamp();
                                $rootScope.receiveUserInfo.send_user_id = $rootScope.receiveUserInfo.id
                                if ($rootScope.historyListHide != undefined && $rootScope.historyListHide.length > 0) {
                                    $rootScope.receiveUserInfo.message = $rootScope.historyListHide[$rootScope.historyListHide.length - 1].message
                                }

                                messageList.push($rootScope.receiveUserInfo);
                            }
                            $rootScope.messageList = messageList;

                            ar.setStorage('messageList-' + ar.getCookie('bhy_user_id'), messageList);

                        }
                    })

                    .state('discovery', {       // 发现
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
                    .state('discovery_message', {       // 发现
                        url: "/discovery_message",
                        templateUrl: "/wechat/views/discovery/message.html",
                        controller: 'discovery.message'
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
                        cache:false,
                        url: "/charge_order",
                        templateUrl: "/wechat/views/charge/order.html",
                        controller: 'charge.order'
                    })
                    .state('charge', {     // 充值
                        cache:false,
                        url: "/charge_index",
                        templateUrl: "/wechat/views/charge/index.html",
                        controller: 'charge.index'
                    });
                $urlRouterProvider.otherwise("/error");
            }])
            .controller('main', ['$scope', '$location', 'app.serviceApi', '$ionicLoading', '$ionicPopup', '$rootScope', function ($scope, $location, api, $ionicLoading, $ionicPopup, $rootScope) {

                $rootScope.$on('msgNumber', function () {
                    $scope.msgNumber = $rootScope.msgNumber;
                })

                $rootScope.$on('newFollow', function () {
                    $scope.newFollow = $rootScope.newFollow;
                })

                $rootScope.$on('newFollowNumber', function () {
                    $scope.newFollowNumber = $rootScope.newFollowNumber;
                })

                $rootScope.$on('newDiscovery', function () {
                    $scope.newDiscovery = $rootScope.newDiscovery;
                })

                $scope.upUserStorage = function (name, value, type) {
                    if (type == 'wu') {
                        eval('$scope.userInfo.' + name + ' = ' + value);
                    } else {
                        eval('$scope.userInfo.' + type + '.' + name + ' = ' + value);
                    }
                }

                // 以下为用户信息处理
                $scope.userInfo = {};

                var getUserStorage = function () {
                    if ($scope.userInfo) {
                        $scope.userInfo.info = JSON.parse($scope.userInfo.info);
                        $scope.userInfo.auth = JSON.parse($scope.userInfo.auth);
                    }
                }
                var setUserInfoStorage = function () {

                    ar.setStorage('userInfo', $scope.userInfo);
                    getUserStorage();
                }

                /*// 拉黑等信息
                 $scope.authDataFilter = authData() ? authData() : [];
                 function authData(){
                 var data = [];
                 api.list('/wap/user/index-is-show-data', []).success(function (res) {
                 data = res.data;
                 });
                 return data;
                 }*/


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

                if (ar.getCookie('bhy_user_id')) {
                    // 身份证认证
                    api.list("/wap/member/honesty-photo", []).success(function (res) {
                        $scope.sfzCheck = res.sfz;
                        $scope.marrCheck = res.marr;
                        $scope.eduCheck = res.edu;
                        $scope.housingCheck = res.housing;
                    });

                    api.list("/wap/user/get-user-info", {}).success(function (res) {
                            $scope.userInfo = res.data;
                            setUserInfoStorage();
                    });

                } else {
                    if (ar.getCookie('wx_login') == 'out') {
                        ar.saveDataAlert($ionicPopup, '您的账号异常，已经被限制登录！');
                        ar.delCookie('wx_login');
                    }
                    ar.setStorage('userInfo', null);
                    $location.url('/index');
                    //location.href = '/wap/user/login';
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

                    uploader.filters.push({
                        name: 'file-size-Res',
                        fn: function (item) {
                            if (item.size > 8388608) {
                                ar.saveDataAlert($ionicPopup, '请选择小于8MB的图片！')
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
