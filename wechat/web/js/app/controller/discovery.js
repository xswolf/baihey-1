/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    // 发现
    module.controller("discovery.index", ['app.serviceApi', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$location','$state','$stateParams', function (api, $rootScope, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $location,$state,$stateParams) {

        $state.reload();
        var userInfo = ar.getStorage('userInfo');
        console.log(userInfo)
        if ($location.$$search.userId) {
            // 显示个人
            $scope.title = JSON.parse(userInfo['info']).real_name + '的个人动态';
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

            api.list('/wap/member/get-dynamic-list' , {user_id:$stateParams.userId , page:$scope.page}).success(function (res) {
                if (res.data == ''){
                    $scope.morePage = false;
                }
                for (var i in res.data){
                    res.data[i].imgList = JSON.parse(res.data[i].pic);
                    $scope.discoveryList.push(res.data[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            })
            $scope.page += 1;
        };

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
    module.controller("discovery.single", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$stateParams', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $stateParams) {

        $scope.jump = function () {
            window.history.go(-1);
        }

        // url参数，用户ID
        $scope.userId = $stateParams.userId;

        $scope.dis =
        {
            id: 1, name: '张小姐', time: '17:40', content: '地方公司空间的花费撕开对方会告诉你不过就是不爽', imgList: [
            {src: '/wechat/web/images/test/1.jpg', w: 200, h: 200},
            {src: '/wechat/web/images/test/2.jpg', w: 200, h: 200},
            {src: '/wechat/web/images/test/3.jpg', w: 200, h: 200}
        ], browseNumber: 2544, commentNumber: 525, likeNumber: 89
        }

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
        $scope.user.userLike = false;

        // 点赞
        $scope.clickLike = function (likeNumber) {
            if (!$scope.user.userLike) {
                $scope.user.userLike = true;
                likeNumber += 1;  // 点赞数 +1
            } else {
                $scope.user.userLike = false;
            }
        }

        $scope.commentList = [
            {id: 1, headPic: '/wechat/web/images/test/8.jpg', name: '谢先生', time: '15-05-11 17:15', content: '照片很漂亮！'},
            {id: 2, headPic: '/wechat/web/images/test/7.jpg', name: '李先生', time: '15-05-11 15:05', content: '顶！'},
            {id: 3, headPic: '/wechat/web/images/test/6.jpg', name: '张先生', time: '15-05-11 13:38', content: '支持！'},
            {id: 4, headPic: '/wechat/web/images/test/5.jpg', name: '刘女士', time: '15-05-11 17:15', content: '法规和儿童'},
            {id: 5, headPic: '/wechat/web/images/test/4.jpg', name: '陈小姐', time: '15-05-11 17:15', content: '打过去喂喂喂'},
            {
                id: 6,
                headPic: '/wechat/web/images/test/3.jpg',
                name: '郭先生',
                time: '15-05-11 17:15',
                content: '相册vdefgewrgewr！'
            },
            {id: 7, headPic: '/wechat/web/images/test/2.jpg', name: '谭先生', time: '15-05-11 17:15', content: '但若全额威风威风'},
            {id: 8, headPic: '/wechat/web/images/test/1.jpg', name: '张小姐', time: '15-05-11 17:15', content: '丰田和热火太'}
        ]

        $scope.user.private = false;
        $scope.checkPrivate = function () {
            $scope.user.private = !$scope.user.private;
        }


    }]);


    // 发现-发布动态
    module.controller("discovery.released", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$stateParams', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $stateParams, FileUploader) {

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
                        $ionicPopup.alert({title: '只能上传图片类型的文件！'});
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
                    $ionicPopup.alert({title: '上传图片失败！'});
                }
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {  // 上传出错
                $ionicPopup.alert({title: '上传图片出错！'});
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
            console.log($scope.formData);
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
