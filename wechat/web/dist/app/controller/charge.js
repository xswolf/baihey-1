define(["app/module","app/directive/directiveApi","app/service/serviceApi"],function(e){e.controller("charge.index",["app.serviceApi","$rootScope","$scope","$timeout","$ionicPopup","$ionicModal","$ionicActionSheet","$ionicLoading","$location",function(e,o,r,i,a,c,p,t,n){r.formData=[],r.orderId=n.$$search.orderId,e.get("/wap/charge/get-order",{id:r.orderId}).success(function(e){r.goods=e[0]}),r.iswx=ar.isWeChat(),r.iswx?r.formData.payType="5":r.formData.payType="4",r.pay=function(){e.get("/wap/charge/set-charge-type",{chargeTypeId:r.formData.payType}).success(function(e){e.status&&("5"==r.formData.payType?window.location.href="/wap/charge/pay?orderId="+r.orderId:window.location.href="/wap/charge/alipay?orderId="+r.orderId)})},r.jump=function(){n.url(n.$$search.tempUrl)}}]),e.controller("charge.order",["app.serviceApi","$rootScope","$scope","$timeout","$ionicPopup","$ionicModal","$ionicActionSheet","$ionicLoading","$location",function(e,o,r,i,a,c,p,t,n){r.payType=n.$$search.payType,e.save("/wap/charge/get-order",{id:n.$$search.orderId}).success(function(e){r.orderInfo=e[0]})}])});