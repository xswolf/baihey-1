define(["app/module","app/directive/directiveApi","app/service/serviceApi"],function(e){e.controller("discovery.index",["app.serviceApi","$rootScope","$scope","$timeout","$ionicPopup","$ionicModal","$ionicActionSheet","$ionicLoading","$location","$filter","FileUploader","dataFilter",function(e,a,i,t,r,o,n,d,s,c,l,m){i.reportData={},i.formData={},i.formData.auth=1,i.discoveryList=[],i.display=ar.getStorage("display")?ar.getStorage("display"):[],i.indexFilter=function(e){return e.user_id==i.userInfo.user_id?!0:e.fid>0?!1:"2"==e.auth?-1!=m.data.follow.indexOf(e.user_id)&&-1==i.display.indexOf(e.id):"4"==e.auth?!1:-1==m.data.blacked.indexOf(e.user_id)&&-1==i.display.indexOf(e.id)},i.jump=function(e,a,t){"userInfo"==t&&(a>=1e4?a==i.userInfo.user_id?s.url("/member/information"):s.url("/userInfo?userId="+a):a==i.userInfo.user_id?s.url("/member/admin_information"):s.url("/admin_info?userId="+a)),"single"==t&&s.url("/discovery_single?id="+e)},i.more=function(a,t,r){if(t.user_id>=1e4)var o=[{text:"举报"},{text:"屏蔽"}];else var o=[{text:"屏蔽"}];a&&(o=[{text:"删除"}]),n.show({buttons:o,titleText:"更多",cancelText:"取消",cancel:function(){},buttonClicked:function(a,o){return"屏蔽"==o.text&&(t.moreLoading=!0,i.display.push(t.id),ar.setStorage("display",i.display),i.discoveryList.splice(r,1),t.moreLoading=!1),"举报"==o.text&&s.url("/member/report?id="+t.id+"&userName="+t.real_name+"&type=2&title=动态&tempUrl="+s.$$url),"删除"==o.text&&(t.moreLoading=!0,e.save("/wap/member/delete-dynamic",{id:t.id}).success(function(e){i.display.push(t.id),ar.setStorage("display",i.display),i.discoveryList.splice(r,1),t.moreLoading=!1})),!0}})},i.clickLike=function(a){var t=ar.getArrI(i.discoveryList,"id",a.id),r=0;i.discoveryList[t].cid>0?(r=-1,i.discoveryList[t].cid=-1):(r=1,i.discoveryList[t].cid=1),i.discoveryList[t].like_num=parseInt(i.discoveryList[t].like_num)+r,e.save("/wap/member/set-click-like",{dynamicId:a.id,add:r})},i.page=0,i.isMore=!0,i.loadMore=function(){e.list("/wap/member/get-dynamic-list",{user_id:s.$$search.userId,page:i.page}).success(function(e){e.data.length<1&&(i.isMore=!1);for(var a in e.data)e.data[a].imgList=JSON.parse(e.data[a].pic),e.data[a].real_name=e.data[a].real_name.replace(/\"/g,""),e.data[a].head_pic=e.data[a].head_pic.replace(/\"/g,""),e.data[a].level=e.data[a].level.replace(/\"/g,""),e.data[a].age=e.data[a].age.replace(/\"/g,""),i.discoveryList.push(e.data[a]);i.page+=1,ar.initPhotoSwipeFromDOM(".bhy-gallery",i,r)})["finally"](function(){t(function(){i.$broadcast("scroll.infiniteScrollComplete")},800)})},i.doRefresh=function(){var a={};a.limit=i.discoveryList.length,e.list("/wap/member/get-dynamic-list?timestamp="+(new Date).getTime(),a).success(function(e){i.discoveryList=[];for(var a in e.data)e.data[a].imgList=JSON.parse(e.data[a].pic),e.data[a].real_name=e.data[a].real_name.replace(/\"/g,""),e.data[a].head_pic=e.data[a].head_pic.replace(/\"/g,""),e.data[a].level=e.data[a].level.replace(/\"/g,""),e.data[a].age=e.data[a].age.replace(/\"/g,""),i.discoveryList.push(e.data[a]);ar.initPhotoSwipeFromDOM(".bhy-gallery",i,r)})["finally"](function(){t(function(){i.$broadcast("scroll.refreshComplete")},800)})},i.moreDataCanBeLoaded=function(){return i.isMore},a.$on("reload",function(e,a){a&&i.doRefresh()})}]),e.controller("discovery.single",["app.serviceApi","$scope","$location","$ionicActionSheet","$ionicModal","$ionicPopup","$ionicScrollDelegate","$timeout",function(e,a,i,t,r,o,n,d){a.formData={},a.formData["private"]=!1,a.isMore=!0,a.pageSize=20,a.commentList=[],a.isShowCommentList=!0,a.jump=function(e){e>=1e4?e==a.userInfo.id?i.url("/member/information"):i.url("/userInfo?userId="+e):e==a.userInfo.id?i.url("/member/admin_information"):i.url("/admin_info?userId="+e)},a.display=ar.getStorage("display")?ar.getStorage("display"):[],a.showComment=function(){a.isShowCommentList=!a.isShowCommentList,n.$getByHandle("discoveryMain").resize()};var s=ar.getStorage("userInfo"),c=JSON.parse(s.info);a.user_id=s.id,e.list("/wap/member/get-dynamic",{id:i.$$search.id}).success(function(e){e.data.imgList=JSON.parse(e.data.pic),e.data.real_name=e.data.real_name.replace(/\"/g,""),e.data.head_pic=e.data.head_pic.replace(/\"/g,""),e.data.level=e.data.level.replace(/\"/g,""),e.data.age=e.data.age.replace(/\"/g,""),a.dis=e.data;for(var i in e.data.comment)e.data.comment[i].headPic=e.data.comment[i].headPic.replace(/\"/g,""),e.data.comment[i].name=e.data.comment[i].name.replace(/\"/g,""),e.data.comment[i].age=e.data.comment[i].age.replace(/\"/g,"");a.commentList=e.data.comment,ar.initPhotoSwipeFromDOM(".bhy-gallery",a,o)}),a.clickLike=function(i){var t=0;a.dis.cid>0?(t=-1,a.dis.cid=-1):(t=1,a.dis.cid=1),a.dis.like_num=parseInt(a.dis.like_num)+t,e.save("/wap/member/set-click-like",{dynamicId:i.id,add:t})},a.checkPrivate=function(){a.formData["private"]=!a.formData["private"],a.formData["private"]&&ar.saveDataAlert(o,"私密评论将只有您和该条动态发布者可见此条评论。")},a.sendComment=function(){a.formData.dynamicId=i.$$search.id,e.save("/wap/member/add-comment",a.formData).success(function(e){e.data.id>0&&(a.commentList.push({id:e.data.id,user_id:s.id,headPic:c.head_pic,name:c.real_name,"private":"true"==a.formData["private"]?1:0,create_time:e.data.create_time,content:a.formData.content,age:a.userInfo.info.age,sex:a.userInfo.sex}),a.dis.comment_num=parseInt(a.dis.comment_num)+1,a.formData.content="",n.scrollBottom(!0))})},a.more=function(r,o){if(o.user_id>=1e4)var n=[{text:"举报"},{text:"屏蔽"}];else var n=[{text:"屏蔽"}];r&&(n=[{text:"删除"}]),t.show({buttons:n,titleText:"更多",cancelText:"取消",cancel:function(){},buttonClicked:function(t,r){return"屏蔽"==r.text&&(a.display.push(o.id),ar.setStorage("display",a.display),i.url("/discovery")),"举报"==r.text&&i.url("/member/report?id="+o.id+"&type=2&title=动态&tempUrl="+i.$$url),"删除"==r.text&&(a.display.push(o.id),ar.setStorage("display",a.display),e.save("/wap/member/delete-dynamic",{id:o.id}).success(function(e){i.url("/discovery")})),!0}})},a.loadMore=function(){e.list("/wap/member/get-dynamic",{id:i.$$search.id}).success(function(e){a.pageSize>e.commentCount&&(a.isMore=!1),a.pageSize+=20})["finally"](function(){d(function(){a.$broadcast("scroll.infiniteScrollComplete")},800)})},a.moreDataCanBeLoaded=function(){return a.isMore}}]),e.controller("discovery.message",["app.serviceApi","$scope","$location","$ionicActionSheet","$ionicModal","$ionicPopup","$ionicScrollDelegate",function(e,a,i,t,r,o,n){var d="";d=ar.getStorage("discoveryTime")?ar.getStorage("discoveryTime"):"",a.disList=[],e.get("/wap/member/comment-list",{create_time:d}).success(function(e){if(e.status){for(var i in e.data)e.data[i].info=JSON.parse(e.data[i].info),e.data[i].pic=JSON.parse(e.data[i].pic);a.disList=e.data}}),ar.setStorage("discoveryTime",ar.timeStamp()),e.get("/wap/member/comment-num",{}).success(function(e){a.discoverySum=e.data,ar.setStorage("discoverySum",e.data)}),a.loadData=function(){e.get("/wap/member/comment-list",{create_time:""}).success(function(e){if(e.status){for(var i in e.data)e.data[i].info=JSON.parse(e.data[i].info),e.data[i].pic=JSON.parse(e.data[i].pic);a.disList=e.data}})}}])});