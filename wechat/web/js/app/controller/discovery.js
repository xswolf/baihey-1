/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    // 发现
    module.controller("discovery.index", ['app.serviceApi', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$location', '$filter', function (api, $rootScope, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $location, $filter) {

        var userInfo = ar.getStorage('userInfo');
        console.log($location.$$search);
        if ($location.$$search.userId) {
            // 显示个人
            $scope.title = $location.$$search.real_name ? $filter('sex')($location.$$search.real_name,$location.$$search.sex,$location.$$search.age) + '的个人动态' : $location.$$search.userId + '的个人动态';
            //$scope.title = JSON.parse(userInfo['info']).real_name + '的个人动态';
            $rootScope.hideTabs = true;
        } else {
            // 显示所有
            $scope.title = '发现';
            $rootScope.hideTabs = false;
        }

        // 返回
        $scope.jump = function () {
            $rootScope.hideTabs = false;
            $location.path($location.$$search.tempUrl.replace(/~2F/g, "/"));
        }

        $scope.discoveryList = [];

        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function (imgList, index) {
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top: 0, bottom: 0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe(pswpElement, photoswipe_ui, imgList, options);
                gallery.init();
            }

        })

        $scope.user = [];

        // 点赞
        $scope.clickLike = function (id) {
            var i = ar.getArrI($scope.discoveryList , 'id' , id);
            var add = 0;
            if ($scope.discoveryList[i].cid > 0) {
                add = -1;
                $scope.discoveryList[i].cid  = -1;
            } else {
                add = 1;
                $scope.discoveryList[i].cid  = 1;
            }

            $scope.discoveryList[i].like_num =  parseInt($scope.discoveryList[i].like_num) + add;
            api.save('/wap/member/set-click-like' , {dynamicId:id , user_id: userInfo['id'] , add:add});
        }

        $scope.page = 0;
        $scope.morePage = true;
        // 加载更多
        $scope.loadMore = function () {

            api.list('/wap/member/get-dynamic-list' , {user_id:$location.$$search.userId , page:$scope.page}).success(function (res) {
                if (res.data == ''){
                    $scope.morePage = false;
                }
                for (var i in res.data){
                    res.data[i].imgList = JSON.parse(res.data[i].pic);
                    res.data[i].head_pic = res.data[i].head_pic.replace(/\"/g, '');
                    $scope.discoveryList.push(res.data[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            })
            $scope.page += 1;
        };

        api.list('/wap/member/get-follow').success(function (res) {
            $scope.followList = res.data;
        })
        // 判断该动态是否可以见 userId发动态用户的ID
        $scope.display = function (auth , userId) {
            if(auth == 1){ // 全部可见
                return true;
            }
            if (auth == 2 && ar.getArrI($scope.followList , "follow_id" , userId)){ // 关注的人可见
                return true;
            }
            if (auth == 3 && userId == userInfo.id){ // 自己可以见
                return true;
            }
            return false;
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.morePage;
        };

        $ionicModal.fromTemplateUrl('released.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.released = function () {
            $scope.openModal();
        }

    }]);

    // 发现-个人
    module.controller("discovery.single", ['app.serviceApi', '$scope', '$location', function (api, $scope, $location) {

        $scope.jump = function () {
            window.history.go(-1);
        }
        var userInfo = ar.getStorage('userInfo');
        var info = JSON.parse(userInfo.info);
        $scope.user_id = userInfo.id;
        api.list('/wap/member/get-dynamic' , {id:$location.$$search.id}).success(function (res) {
            res.data.imgList = JSON.parse(res.data.pic);
            $scope.dis = res.data;
            $comment = ar.cleanQuotes(JSON.stringify(res.data.comment));
            $scope.commentList = JSON.parse($comment);
            //console.log($scope.dis);
        })

        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function (imgList, index) {
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top: 0, bottom: 0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe(pswpElement, photoswipe_ui, imgList, options);
                gallery.init();
            }


        })

        // 点赞
        $scope.clickLike = function (id) {
            var add = 0;
            if ($scope.dis.cid > 0) {
                add = -1;
                $scope.dis.cid  = -1;
            } else {
                add = 1;
                $scope.dis.cid  = 1;
            }

            $scope.dis.like_num =  parseInt($scope.dis.like_num) + add;
            api.save('/wap/member/set-click-like' , {dynamicId:id , user_id: userInfo['id'] , add:add});
        }
        $scope.user = [];
        $scope.user.private = false;
        $scope.checkPrivate = function () {
            $scope.user.private = !$scope.user.private;
        }

        // 发表评论
        $scope.sendComment = function () {
            $scope.formData.private = $scope.user.private;
            $scope.formData.dynamicId = $location.$$search.id;
            api.save('/wap/member/add-comment' , $scope.formData).success(function (res) {
                if (res.data.id>0) {
                    $scope.commentList.push({
                        id: res.data.id,
                        user_id: userInfo.id,
                        headPic: info.head_pic,
                        name: info.real_name,
                        private:$scope.user.private=='true' ? 1 : 0,
                        create_time: res.data.create_time,
                        content: $scope.formData.content
                    });

                    $scope.dis.comment_num = parseInt($scope.dis.comment_num) + 1;
                    $scope.formData.content = ''; //重置输入框
                }

            })
        }

    }]);


    // 发现-发布动态
    module.controller("discovery.released", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, FileUploader) {

        $scope.imgList = [];
        $scope.formData = [];
        var id = 0;
        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/thumb'
        });

        $scope.showLoading = function (progress) {
            $ionicLoading.show({
                template: '<p class="tac">上传中...</p><p class="tac">' + progress + '%</p>'
            });
        };

        $scope.hideLoading = function () {
            $ionicLoading.hide();
        }

        $scope.addNewImg = function () {
            var e = document.getElementById("pic_fileInput");
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
                    $scope.imgList.push({id: id, thumb_path: response.thumb_path});
                    id++;
                } else {
                    ar.saveDataAlert($ionicPopup, '上传图片失败！');
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

        // 删除图片
        $scope.deleteImg = function (index) {
            var id = $scope.imgList[index].id;

            $scope.imgList.splice(index, 1);
        }

        $scope.formData.auth = 1;  // 默认完全公开

        // 获取地址
        //api.getUserAddress('url',param).success(function(res){
        //    $scope.address = res;
        //})
        $scope.address = '重庆'



        // 发布
        $scope.saveData = function () {
            var userInfo = ar.getStorage('userInfo');
            $scope.formData.name = JSON.parse(userInfo.info).real_name;
            $scope.formData.pic = JSON.stringify($scope.imgList);
            $scope.formData.showAddress ? $scope.formData.address = $scope.address : $scope.formData.address = '';

            // 保存数据
            api.save('/wap/member/add-dynamic' , $scope.formData).success(function (res) {
                $scope.closeModal();    // 发布后关闭modal并立即展现
                res.data.imgList = JSON.parse(res.data.pic);
                $scope.discoveryList.splice(0, 0, res.data);
                console.log($scope.discoveryList);
            })

        }


    }]);
})
