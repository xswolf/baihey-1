define(["app/module","app/service/serviceApi"],function(module){return module.run(["$rootScope","$state","$timeout","app.serviceApi","$ionicLoading","$location","$templateCache",function(e,r,o,t,s,i,n){function a(){e.newFollow=!1,e.newFollowNumber=0,t.get("/wap/follow/is-new-follow",{user_id:c}).success(function(r){e.newFollow=r.status,e.newFollowNumber=r.data}),e.newDiscovery=0,t.get("/wap/member/comment-num",{}).success(function(r){var o=ar.getStorage("discoverySum");r.data>o&&(e.newDiscovery=r.data-o)})}var c=ar.getCookie("bhy_user_id"),l=function(){t.list("/wap/message/message-list",[]).success(function(r){var o=ar.getStorage("messageList-"+c)?ar.getStorage("messageList-"+c):[],t=r.data;for(var s in t){t[s].info=JSON.parse(t[s].info),t[s].auth=JSON.parse(t[s].auth),t[s].order_time=parseInt(t[s].create_time);var i=!0;for(var n in o)if(o[n].send_user_id==t[s].send_user_id){o[n]=t[s],i=!1;break}i&&o.push(t[s])}e.messageList=o,ar.setStorage("messageList-"+c,o);var a=0;for(var s in o)parseInt(o[s].sumSend)>0&&(a+=parseInt(o[s].sumSend));e.msgNumber=a})};c>0&&requirejs(["plugin/socket/socket.io.1.4.0"],function(e){var r=e.connect("http://120.76.84.162:8088");r.on(c,function(e){l()})}),e.$on("$stateChangeStart",function(e,r,i,n,c){if("/index"!=r.url&&"/error"!=r.url)if(s.show(),void 0===sessionStorage.loginStatus)t.getLoginStatus().success(function(e){return sessionStorage.loginStatus=e.status,e.status?void 0:(location.href="/wap/user/login",!1)});else if(!sessionStorage.loginStatus)return location.href="/wap/user/login",!1;var u=function(){l(),a()};o(u,500),sessionStorage.flag=!0}),e.$on("$stateChangeSuccess",function(e,r,o,t,i){s.hide()})}]),module.config(["$stateProvider","$urlRouterProvider","$ionicConfigProvider","$controllerProvider",function(e,r,o,t){o.templates.maxPrefetch(0),e.state("index",{url:"/index",templateUrl:"/wechat/views/site/index.html",controller:"site.index",resolve:{dataFilter:function(e){return e({method:"POST",url:"/wap/user/index-is-show-data",params:{}})}}}).state("index_discovery",{url:"/index_discovery",templateUrl:"/wechat/views/site/discovery.html",controller:"site.discovery",resolve:{dataFilter:function(e){return e({method:"POST",url:"/wap/user/index-is-show-data",params:{}})}}}).state("error",{url:"/error",templateUrl:"/wechat/views/site/error.html",controller:"site.error"}).state("member",{cache:!1,url:"/member",templateUrl:"/wechat/views/member/index.html",controller:"member.index"}).state("member_children",{cache:!1,url:"/member/:tempName",templateUrl:function(e){return"/wechat/views/member/"+e.tempName+".html"},controllerProvider:function(e){return"member."+e.tempName}}).state("message",{cache:!0,url:"/message",templateUrl:"/wechat/views/message/index.html",controller:"message.index",resolve:{dataFilter:function(e){return e({method:"POST",url:"/wap/user/index-is-show-data",params:{}})}}}).state("userInfo",{cache:!1,url:"/userInfo",templateUrl:"/wechat/views/site/user_info.html",controller:"member.user_info",resolve:{dataFilter:function(e){return e({method:"POST",url:"/wap/user/index-is-show-data",params:{}})}}}).state("adminInfo",{cache:!1,url:"/admin_info",templateUrl:"/wechat/views/site/admin_info.html",controller:"member.admin_info",resolve:{dataFilter:function(e){return e({method:"POST",url:"/wap/user/index-is-show-data",params:{}})}}}).state("chat",{cache:!0,url:"/chat1/:id",templateUrl:"/wechat/views/message/chat1.html",controller:"message.chat1",resolve:{dataFilter:function(e){return e({method:"POST",url:"/wap/user/index-is-show-data",params:{}})}},onExit:function(e){var r=ar.getStorage("messageList-"+ar.getCookie("bhy_user_id"));null==r&&(r=[]);var o=!0,t=0;if(void 0!=r&&""!=r)for(t in r)(r[t].receive_user_id==e.receiveUserInfo.id||r[t].send_user_id==e.receiveUserInfo.id)&&(void 0!=e.historyListHide&&e.historyListHide.length>0&&(r[t].message!=e.historyListHide[e.historyListHide.length-1].message&&(r[t].order_time=ar.timeStamp()),r[t].message=e.historyListHide[e.historyListHide.length-1].message),r[t].sumSend=0,r[t].status=1,o=!1);o&&e.historyListHide.length>0&&(e.receiveUserInfo.info=JSON.parse(e.receiveUserInfo.info),e.receiveUserInfo.auth=JSON.parse(e.receiveUserInfo.auth),e.receiveUserInfo.receive_user_id=ar.getCookie("bhy_user_id"),e.receiveUserInfo.other=e.receiveUserInfo.id,e.receiveUserInfo.order_time=ar.timeStamp(),e.receiveUserInfo.send_user_id=e.receiveUserInfo.id,void 0!=e.historyListHide&&e.historyListHide.length>0&&(e.receiveUserInfo.message=e.historyListHide[e.historyListHide.length-1].message),r.push(e.receiveUserInfo)),e.messageList=r,ar.setStorage("messageList-"+ar.getCookie("bhy_user_id"),r)}}).state("discovery",{url:"/discovery",templateUrl:"/wechat/views/discovery/index.html",controller:"discovery.index",resolve:{dataFilter:function(e){return e({method:"POST",url:"/wap/user/index-is-show-data",params:{}})}}}).state("discovery_message",{url:"/discovery_message",templateUrl:"/wechat/views/discovery/message.html",controller:"discovery.message"}).state("discovery_single",{cache:!1,url:"/discovery_single",templateUrl:"/wechat/views/discovery/single.html",controller:"discovery.single"}).state("rendezvous",{url:"/rendezvous",templateUrl:"/wechat/views/rendezvous/index.html",controller:"rendezvous.index"}).state("rendezvous_add",{url:"/rendezvous_add",templateUrl:"/wechat/views/member/rendezvous_add.html",controller:"member.rendezvous_add"}).state("rendezvous_ask",{url:"/rendezvous_ask",templateUrl:"/wechat/views/rendezvous/ask.html",controller:"rendezvous.ask"}).state("charge_order",{cache:!1,url:"/charge_order",templateUrl:"/wechat/views/charge/order.html",controller:"charge.order"}).state("charge",{cache:!1,url:"/charge_index",templateUrl:"/wechat/views/charge/index.html",controller:"charge.index"}),r.otherwise("/error")}]).controller("main",["$scope","$location","app.serviceApi","$ionicLoading","$ionicPopup","$rootScope",function($scope,$location,api,$ionicLoading,$ionicPopup,$rootScope){$rootScope.$on("msgNumber",function(){$scope.msgNumber=$rootScope.msgNumber}),$rootScope.$on("newFollow",function(){$scope.newFollow=$rootScope.newFollow}),$rootScope.$on("newFollowNumber",function(){$scope.newFollowNumber=$rootScope.newFollowNumber}),$rootScope.$on("newDiscovery",function(){$scope.newDiscovery=$rootScope.newDiscovery}),$scope.upUserStorage=function(name,value,type){"wu"==type?eval("$scope.userInfo."+name+" = "+value):eval("$scope.userInfo."+type+"."+name+" = "+value)},$scope.userInfo={};var getUserStorage=function(){$scope.userInfo&&($scope.userInfo.info=JSON.parse($scope.userInfo.info),$scope.userInfo.auth=JSON.parse($scope.userInfo.auth))},setUserInfoStorage=function(){ar.setStorage("userInfo",$scope.userInfo),getUserStorage()};$scope.setUserStorage=function(){setUserInfoStorage(),window.location.hash="#/member/information"},$scope.getUserPrivacyStorage=function(e){setUserInfoStorage(),""!=e&&void 0!=typeof e&&(window.location.hash=e)},ar.getCookie("bhy_user_id")?(api.list("/wap/member/honesty-photo",[]).success(function(e){$scope.sfzCheck=e.sfz,$scope.marrCheck=e.marr,$scope.eduCheck=e.edu,$scope.housingCheck=e.housing}),api.list("/wap/user/get-user-info",{}).success(function(e){$scope.userInfo=e.data,setUserInfoStorage()})):("out"==ar.getCookie("wx_login")&&(ar.saveDataAlert($ionicPopup,"您的账号异常，已经被限制登录！"),ar.delCookie("wx_login")),ar.setStorage("userInfo",null),$location.url("/index")),$scope.getTravel=function(name,serId){if(null!=serId){var arrSer=serId.split(",");eval("$scope."+name+"_count = "+arrSer.length),api.list("/wap/member/get-travel-list",{area_id:serId}).success(function(res){eval("$scope."+name+" = "+JSON.stringify(res.data))})}else eval("$scope."+name+"_count = 0")},$scope.getConfig=function(name,serId){if(null!=serId){var arrSer=serId.split(",");eval("$scope."+name+"_count = "+arrSer.length),api.list("/wap/member/get-config-list",{config_id:serId}).success(function(res){eval("$scope."+name+" = "+JSON.stringify(res.data))})}else eval("$scope."+name+"_count = 0")},$scope.showLoading=function(e){$ionicLoading.show({template:'<p class="tac">上传中...</p><p class="tac">'+e+"%</p>"})},$scope.hideLoading=function(){$ionicLoading.hide()},$scope.uploaderImage=function(e,r){var o=document.getElementById(r),t=document.createEvent("MouseEvents");t.initEvent("click",!0,!0),o.dispatchEvent(t),e.filters.push({name:"file-type-Res",fn:function(e){return ar.msg_file_res_img(e)?!0:(ar.saveDataAlert($ionicPopup,"只能上传图片类型的文件！"),!1)}}),e.filters.push({name:"file-size-Res",fn:function(e){return e.size>8388608?(ar.saveDataAlert($ionicPopup,"请选择小于8MB的图片！"),!1):!0}}),e.onAfterAddingFile=function(e){e.upload()},e.onProgressItem=function(e,r){$scope.showLoading(r)},e.onSuccessItem=function(e,o,t,s){o.status>0?$scope.$broadcast("thumb_path",r,o):ar.saveDataAlert($ionicPopup,o.info)},e.onErrorItem=function(e,r,o,t){ar.saveDataAlert($ionicPopup,"上传图片出错！"),$scope.hideLoading()},e.onCompleteItem=function(e,r,o,t){$scope.hideLoading()}},$scope.honesty=function(e){return 1&e}}])});