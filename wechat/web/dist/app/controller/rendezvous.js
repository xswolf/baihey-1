define(["app/module","app/directive/directiveApi","app/service/serviceApi"],function(e){e.controller("rendezvous.index",["app.serviceApi","$scope","$timeout","$ionicPopup","$ionicModal","$ionicActionSheet","$ionicLoading","$interval","$ionicScrollDelegate",function(e,a,o,t,n,i,r,s,c){a.formData=[],a.num=[],a.formData.pageNum=0,a.formData.pageSize=5,a.list=[],a.timerList=[],n.fromTemplateUrl("screenModal.html",{scope:a,animation:"slide-in-up"}).then(function(e){a.screenModal=e}),a.showScreenModal=function(){a.screenModal.show()},a.closeScreenModal=function(){a.screenModal.hide()},a.isMore=!0;a.loadMoreData=function(){a.formData.pageNum+=1,e.list("/wap/rendezvous/list",a.formData).success(function(e){e.data.length<1&&(a.isMore=!1);for(var o in e.data){var t=e.data[o].we_want.split(",");e.data[o].label=[],e.data[o].label=t,e.data[o].info=angular.fromJson(e.data[o].info),e.data[o].auth=angular.fromJson(e.data[o].auth),a.list.push(e.data[o])}a.$broadcast("scroll.infiniteScrollComplete")})},a.moreDataCanBeLoaded=function(){return a.isMore},a.screen=[],a.screen.theme="0",a.screen.fee_des="0",a.screen.sex=0,a.sexChange=function(e){a.screen.sex=e},a.saveScreen=function(){a.formData.theme=a.screen.theme,a.formData.fee_des=a.screen.fee_des,a.formData.sex=a.screen.sex,a.formData.pageNum=1,a.isMore=!0,e.list("/wap/rendezvous/list",a.formData).success(function(e){e.data.length<1&&(a.isMore=!1);for(var o in e.data){var t=e.data[o].we_want.split(",");e.data[o].label=[],e.data[o].label=t,e.data[o].info=angular.fromJson(e.data[o].info),e.data[o].auth=angular.fromJson(e.data[o].auth)}a.list=e.data}),a.screenModal.hide(),c.$getByHandle("mainScroll").scrollTop()}}]),e.controller("rendezvous.ask",["app.serviceApi","$scope","$timeout","$ionicPopup","$ionicModal","$ionicActionSheet","$ionicLoading","$ionicScrollDelegate","$interval","$location",function(e,a,o,t,n,i,r,s,c,l){function d(){return a.formData.mobile&&""!=a.formData.mobile?ar.validateMobile(a.formData.mobile)?!0:(ar.saveDataAlert(t,"手机号码格式有误"),!1):(ar.saveDataAlert(t,"请输入您的手机号码"),!1)}a.formData=[],a.formData.rendezvous_id=l.search().rendezvous_id,a.userInfo=[],a.userInfo=l.search(),a.codeTitle="获取验证码",a.isSend=!1;var u=s.$getByHandle("askScroll");window.addEventListener("native.keyboardshow",function(){u.scrollBottom()}),a.sendCode=function(){if(!d())return!1;e.sendCodeMsg(a.formData.mobile).success(function(e){return e.status?void 0:(ar.saveDataAlert(t,"短信发送失败，请稍后重试。"),!1)}),a.isSend=!0;var o=60,n=c(function(){o--,a.codeTitle=o+"重新获取"},1e3,o);n.then(function(){c.cancel(n),a.isSend=!1,a.codeTitle="获取验证码"})},a.save=function(){return d()?void e.validateCode(a.formData.code).success(function(n){n?e.save("/wap/rendezvous/add-apply",a.formData).success(function(e){e.status?(ar.saveDataAlert(t,"已向对方发送约会信息，请耐心等待对方回复"),window.location.hash="#/rendezvous",o(function(){l.url("/rendezvous")},800)):ar.saveDataAlert(t,"网络错误，请稍候重试！")}):ar.saveDataAlert(t,"验证码错误，请核对！")}):!1}}])});