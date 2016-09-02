define(["app/module","app/directive/directiveApi","app/service/serviceApi","app/filter/filterApi","config/city","config/occupation"],function(e){e.controller("site.index",["app.serviceApi","$rootScope","$scope","$timeout","$ionicPopup","$ionicModal","$ionicActionSheet","$ionicLoading","$ionicBackdrop","$ionicScrollDelegate","$location","dataFilter",function(e,a,t,o,i,r,n,s,c,d,l,u){t.$on("$ionicView.beforeEnter",function(){ar.getStorage("userInfo")&&ar.getStorage("userInfo").user_id==ar.getCookie("bhy_user_id")&&(t.userInfo=ar.getStorage("userInfo"),t.userInfo.info=JSON.parse(t.userInfo.info),t.userInfo.auth=JSON.parse(t.userInfo.auth))}),t.searchForm={age:"18-28",pageNum:1,pageSize:6,sex:0},t.userId=ar.getCookie("bhy_user_id")?ar.getCookie("bhy_user_id"):0;var h=function(){t.searchForm={},t.whereForm={},t.searchForm.pageNum=1,t.userId>0&&0==t.userInfo.sex?(t.searchForm.sex=1,t.whereForm.sex=1):(t.searchForm.sex=0,t.whereForm.sex=0)};h(),t.userList=[],u.data.honestyStatus.length&&(t.honestyStatus=u.data.honestyStatus[0].is_check),u.data.headpicStatus&&(t.headpicStatus=u.data.headpicStatus.is_check),t.honesty=function(e){return 1&e},t.pageLast=!0,t.checkPhone=function(e){t.userInfo.phone?window.location.hash=e:window.location.hash="#/member/security_phone"},t.dataLoading=!1,t.indexFilter=function(e){return t.userId>0&&t.userInfo?e.id!=t.userInfo.id&&-1==u.data.blacked.indexOf(e.id):1},r.fromTemplateUrl("MoreSearchModal.html",{scope:t,animation:"slide-in-up"}).then(function(e){t.moreSearchModal=e}),t.moreSearchOk=function(){t.dataLoading=!0,t.userList=[],t.moreSearchModal.hide(),t.whereForm.id&&(t.searchForm=[],t.searchForm.id=t.whereForm.id,t.whereForm=[],t.whereForm.id=t.searchForm.id),t.searchForm=t.whereForm,t.searchForm.pageNum=1,t.loadMore("search")},t.search=function(){t.buttonsItem=[{text:"只看女"},{text:"只看男"},{text:"高级搜索"}];var e=n.show({buttons:t.buttonsItem,titleText:"搜索",cancelText:"取消",buttonClicked:function(a){t.pageLast=!0,1==a&&(t.userList=[],h(),t.whereForm=[],t.searchForm.sex=1,t.whereForm.sex=1,t.dataLoading=!0,t.loadMore("search")),0==a&&(t.userList=[],h(),t.whereForm=[],t.searchForm.sex=0,t.whereForm.sex=0,t.dataLoading=!0,t.loadMore("search")),2==a&&t.moreSearchModal.show()&&d.$getByHandle("searchScroll").scrollTop(),e()}})},t.doRefresh=function(){var a=t.searchForm;a.pageSize=t.userList.length,a.pageNum=1,t.dataLoading=!0,e.list("/wap/site/user-list",a).success(function(e){for(var a in e.data)e.data[a].info=JSON.parse(e.data[a].info),e.data[a].auth=JSON.parse(e.data[a].auth);t.userList=e.data,t.dataLoading=!1,t.searchForm.pageNum+=1})["finally"](function(){t.$broadcast("scroll.refreshComplete")})},t.loadMore=function(a){try{t.dataLoading=!0,e.list("/wap/site/user-list",t.searchForm).success(function(e){e.data.length<6&&(t.pageLast=!1);for(var o in e.data)e.data[o].info=JSON.parse(e.data[o].info),e.data[o].auth=JSON.parse(e.data[o].auth);t.userList=t.userList.concat(e.data),t.dataLoading=!1,t.searchForm.pageNum+=1,"search"==a&&d.$getByHandle("mainScroll").scrollTop()}).error(function(){o(function(){t.$broadcast("scroll.infiniteScrollComplete")},800)})["finally"](function(){o(function(){t.$broadcast("scroll.infiniteScrollComplete")},800)})}catch(i){o(function(){t.$broadcast("scroll.infiniteScrollComplete")},800)}},t.moreDataCanBeLoaded=function(){return t.pageLast};for(var m=[],p=[],f=18;99>=f;f++)p.push(f),99>f&&m.push(f);t.settingsAge={theme:"mobiscroll",lang:"zh",rows:5,wheels:[[{circular:!1,data:m,label:"最低年龄"},{circular:!1,data:p,label:"最高年龄"}]],showLabel:!0,minWidth:130,validate:function(e,a){var t,o=e.values,i=[];for(t=0;t<p.length;++t)p[t]<=o[0]&&i.push(p[t]);return{disabled:[[],i]}},formatValue:function(e){return e[0]+"-"+e[1]},parseValue:function(e){return e?(console.log(e),e.replace(/\s/gi,"").split("-")):[18,22]}};for(var g=[],y=[],f=140;260>=f;f++)y.push(f),260>f&&g.push(f);t.settingsHeight={theme:"mobiscroll",lang:"zh",rows:5,wheels:[[{circular:!1,data:g,label:"最低身高(厘米)"},{circular:!1,data:y,label:"最高身高(厘米)"}]],showLabel:!0,minWidth:130,validate:function(e,a){var t,o=e.values,i=[];for(t=0;t<y.length;++t)y[t]<=o[0]&&i.push(y[t]);return{disabled:[[],i]}},formatValue:function(e){return e[0]+"-"+e[1]},parseValue:function(e){return e?e.replace(/\s/gi,"").split("-"):[160,180]}},t.salary=config_infoData.salary,t.house=config_infoData.house,t.marriage=config_infoData.marriage,t.education=config_infoData.education,t.children=config_infoData.children,t.house=config_infoData.house,t.car=config_infoData.car,t.zodiac=config_infoData.zodiac,t.constellation=config_infoData.constellation,t.nation=config_infoData.nation,t.occupations=occupation,t.sexChange=function(e){t.whereForm.sex=e},t.moreText="展开",t.more=!1,t.moreToggle=function(){d.$getByHandle("searchScroll").resize(),t.more=!t.more,t.more?t.moreText="收起":t.moreText="展开"},document.getElementById("welcome")&&(document.getElementById("welcome").className="animated fadeOut",setTimeout(function(){document.body.removeChild(document.getElementById("welcome"))},1100))}]),e.controller("site.discovery",["app.serviceApi","$scope","$timeout","$ionicPopup","$ionicModal","$ionicActionSheet","$ionicLoading","$ionicBackdrop","$ionicScrollDelegate","$location","dataFilter",function(e,a,t,o,i,r,n,s,c,d,l){a.discoveryList=[],a.user=[],a.isMore=!0,a.pageSize=5,a.user_id=d.$$search.userId,e.get("/wap/member/get-dynamic-list",{user_id:a.user_id,limit:1e4}).success(function(e){for(var t in e.data)e.data[t].imgList=JSON.parse(e.data[t].pic),e.data[t].real_name=e.data[t].real_name.replace(/\"/g,""),e.data[t].head_pic=e.data[t].head_pic.replace(/\"/g,""),e.data[t].level=e.data[t].level.replace(/\"/g,""),e.data[t].age=e.data[t].age.replace(/\"/g,"");a.discoveryList=e.data,a.user.user_id=e.data[0].user_id,a.user.username=e.data[0].real_name,a.user.age=e.data[0].age,a.user.sex=e.data[0].sex,ar.initPhotoSwipeFromDOM(".bhy-gallery",a,o)}),a.jump=function(e){d.url(e)},a.display=ar.getStorage("display")?ar.getStorage("display"):[],a.indexFilter=function(e){return e.fid>0?!1:"2"==e.auth?-1!=l.data.follow.indexOf(e.user_id)&&-1==a.display.indexOf(e.id):"4"==e.auth?!1:-1==a.display.indexOf(e.id)},a.clickLike=function(t){var o=ar.getArrI(a.discoveryList,"id",t.id),i=0;a.discoveryList[o].cid>0?(i=-1,a.discoveryList[o].cid=-1):(i=1,a.discoveryList[o].cid=1),a.discoveryList[o].like_num=parseInt(a.discoveryList[o].like_num)+i,e.save("/wap/member/set-click-like",{dynamicId:t.id,add:i})},a.more=function(t,o,i){var n=[{text:"举报"},{text:"屏蔽"}];t&&(n=[{text:"删除"}]),r.show({buttons:n,titleText:"更多",cancelText:"取消",cancel:function(){},buttonClicked:function(t,i){return"屏蔽"==i.text&&(a.display.push(o),ar.setStorage("display",a.display)),"举报"==i.text&&d.url("/member/report?id="+o+"&type=2&title=动态&tempUrl="+d.$$url),"删除"==i.text&&(a.display.push(o),ar.setStorage("display",a.display),e.save("/wap/member/delete-dynamic",{id:o}).success(function(e){d.url("/discovery")})),!0}})},a.loadMore=function(){e.get("/wap/member/get-dynamic-list",{user_id:a.user_id,limit:1e4}).success(function(e){a.pageSize>e.data.length&&(a.isMore=!1),a.pageSize+=5,ar.initPhotoSwipeFromDOM(".bhy-gallery",a,o)})["finally"](function(){a.$broadcast("scroll.infiniteScrollComplete")})},a.moreDataCanBeLoaded=function(){return a.isMore}}]),e.controller("site.error",["app.serviceApi","$scope","$timeout","$ionicPopup","$ionicModal","$location",function(e,a,t,o,i,r){}])});