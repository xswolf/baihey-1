/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    // 发现
    module.controller("discovery.index", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading) {

        $scope.discoveryList = [
            {
                id: 1, name: '张小姐', time: '17:40', content: '地方公司空间的花费撕开对方会告诉你不过就是不爽', imgList: [
                {src: '/wechat/web/images/test/1.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/3.jpg',w:200,h:200}
            ], browseNumber: 2544, commentNumber: 525, likeNumber: 89,address:'重庆',showAddress:0
            },
            {
                id: 2, name: '郭先生', time: '13:12', content: '地岁的威尔二万人订单', imgList: [
                {src: '/wechat/web/images/test/3.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/7.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/6.jpg',w:200,h:200}
            ], browseNumber: 2544, commentNumber: 525, likeNumber: 89,address:'重庆',showAddress:0
            },
            {
                id: 3, name: '毛女士', time: '12:40', content: '对方扫扫地', imgList: [
                {src: '/wechat/web/images/test/8.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {srcsrcsrc: '/wechat/web/images/test/5.jpg',w:200,h:200}
            ], browseNumber: 2544, commentNumber: 525, likeNumber: 89,address:'重庆',showAddress:1
            },
            {
                id: 4, name: '邱小姐', time: '11:43', content: '到访台湾台湾人体验围绕太阳勿扰', imgList: [
                {srcsrc: '/wechat/web/images/test/7.jpg',w:200,h:200},
                {srcsrc: '/wechat/web/images/test/3.jpg',w:200,h:200},
                {srcsrc: '/wechat/web/images/test/1.jpg',w:200,h:200}
            ], browseNumber: 2544, commentNumber: 525, likeNumber: 89,address:'重庆',showAddress:1
            },
            {
                id: 5, name: '隋小姐', time: '10:15', content: '年翻跟斗风格飞过海对方', imgList: [
                {src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/3.jpg',w:200,h:200},
                {src: '/wechat/web/images/test/4.jpg',w:200,h:200}
            ], browseNumber: 2544, commentNumber: 525, likeNumber: 89,address:'重庆',showAddress:0
            },
        ]


        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function(imgList,index){
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top:0,bottom:0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe( pswpElement, photoswipe_ui, imgList, options);
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

        // 加载更多
        $scope.loadMore = function () {

            $scope.$broadcast('scroll.infiniteScrollComplete');
            //api.get('url').success(function(res) {

            $scope.discoveryList.push({
                id: 5, name: '隋小姐', time: '10:15', content: '年翻跟斗风格飞过海对方', imgList: [
                    {id: 1, url: '/wechat/web/images/test/2.jpg'},
                    {id: 2, url: '/wechat/web/images/test/3.jpg'},
                    {id: 3, url: '/wechat/web/images/test/4.jpg'}
                ], browseNumber: 2544, commentNumber: 525, likeNumber: 89
            });

            $scope.$broadcast('scroll.infiniteScrollComplete');
            //});
        };
        $scope.$on('$stateChangeSuccess', function () {
            $scope.loadMore();
        });

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return true;
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



        // url参数，用户ID
        $scope.userId = $stateParams.userId;

        $scope.dis =
            {
                id: 1, name: '张小姐', time: '17:40', content: '地方公司空间的花费撕开对方会告诉你不过就是不爽', imgList: [
                { src: '/wechat/web/images/test/1.jpg',w:200,h:200},
                { src: '/wechat/web/images/test/2.jpg',w:200,h:200},
                { src: '/wechat/web/images/test/3.jpg',w:200,h:200}
            ], browseNumber: 2544, commentNumber: 525, likeNumber: 89
            }

        // 图片放大查看插件
        requirejs(['photoswipe', 'photoswipe_ui'], function (photoswipe, photoswipe_ui) {

            $scope.showImgList = function(imgList,index){
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    index: index
                };
                options.mainClass = 'pswp--minimal--dark';
                options.barsSize = {top:0,bottom:0};
                options.captionEl = false;
                options.fullscreenEl = false;
                options.shareEl = false;
                options.bgOpacity = 0.85;
                options.tapToClose = true;
                options.tapToToggleControls = false;

                var gallery = new photoswipe( pswpElement, photoswipe_ui, imgList, options);
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

        $scope.commentList=[
            {id:1,headPic:'/wechat/web/images/test/8.jpg',name:'谢先生',time:'15-05-11 17:15',content:'照片很漂亮！'},
            {id:2,headPic:'/wechat/web/images/test/7.jpg',name:'李先生',time:'15-05-11 15:05',content:'顶！'},
            {id:3,headPic:'/wechat/web/images/test/6.jpg',name:'张先生',time:'15-05-11 13:38',content:'支持！'},
            {id:4,headPic:'/wechat/web/images/test/5.jpg',name:'刘女士',time:'15-05-11 17:15',content:'法规和儿童'},
            {id:5,headPic:'/wechat/web/images/test/4.jpg',name:'陈小姐',time:'15-05-11 17:15',content:'打过去喂喂喂'},
            {id:6,headPic:'/wechat/web/images/test/3.jpg',name:'郭先生',time:'15-05-11 17:15',content:'相册vdefgewrgewr！'},
            {id:7,headPic:'/wechat/web/images/test/2.jpg',name:'谭先生',time:'15-05-11 17:15',content:'但若全额威风威风'},
            {id:8,headPic:'/wechat/web/images/test/1.jpg',name:'张小姐',time:'15-05-11 17:15',content:'丰田和热火太'}
        ]

        $scope.user.private = false;
        $scope.checkPrivate = function(){
            $scope.user.private = !$scope.user.private;
        }


    }]);


    // 发现-发布动态
    module.controller("discovery.released", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$stateParams','FileUploader', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $stateParams,FileUploader) {

        $scope.imgList = [];
        $scope.formData = [];

        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/thumb-photo'
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
                if(response.status > 0){
                    $scope.imgList.push({id: response.id, thumb_path: response.thumb_path});
                }else{
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
        $scope.deleteImg = function(index){
            var id = $scope.imgList[index].id;

            $scope.imgList.splice(index, 1);
        }

        // 获取地址
        //api.getUserAddress('url',param).success(function(res){
        //    $scope.address = res;
        //})
        $scope.address= '重庆'

        // 发布
        $scope.saveData = function(){
            console.log($scope.formData);
            // 保存数据

            $scope.closeModal();    // 发布后关闭modal并立即展现
            $scope.discoveryList.push();   // 展现数据
        }


    }]);
})
