/**
 * Created by NSK. on 2016/4/5/0005.
 */
define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi'
], function (module) {

    // 发现
    module.controller("discovery.index", ['app.serviceApi', '$rootScope', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$location', '$filter', 'FileUploader', 'dataFilter', function (api, $rootScope, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $location, $filter, FileUploader, dataFilter) {
        requirejs(['amezeui', 'amezeui_ie8'], function (amezeui, amezeui_ie8) {
            amezeui.gallery.init();
            $scope.reportData = {};
            $scope.formData = {};
            $scope.formData.auth = 1;
            $scope.discoveryList = [];

            //用户已屏蔽的动态id，从localStorage获取
            $scope.display = ar.getStorage('display') ? ar.getStorage('display') : [];

            // 发现列表过滤条件：黑名单
            $scope.indexFilter = function (dis) {
                if (dis.auth == '2') {   // 用户设置该条动态为关注的人可见
                    return dataFilter.data.follow.indexOf(dis.user_id) != -1 && $scope.display.indexOf(dis.id) != -1;
                } else if (dis.auth == '3') {
                    return false;
                }
                return dataFilter.data.blacked.indexOf(dis.user_id) == -1 && $scope.display.indexOf(dis.id) == -1;
            }

            $scope.jump = function (url) {
                $location.url(url);
            }

            $scope.more = function (isUser, id, index) {
                var btnList = [
                    {text: '举报'},
                    {text: '屏蔽'}
                ];
                if (isUser) {   // 判断该条动态是否所属当前用户
                    btnList = [
                        {text: '删除'}
                    ];
                }

                $ionicActionSheet.show({
                    buttons: btnList,
                    titleText: '更多',
                    cancelText: '取消',
                    cancel: function () {
                    },
                    buttonClicked: function (index, btnObj) {
                        if (btnObj.text == '屏蔽') {
                            $scope.display.push(id);
                            ar.setStorage('display', $scope.display);
                            $scope.discoveryList.splice(index, 1);
                            // 将参数ID存入localStorage：display
                        }
                        if (btnObj.text == '举报') {
                            $location.url('/member/report?id=' + id + '&type=2&title=动态&tempUrl=' + $location.$$url);
                        }
                        if (btnObj.text == '删除') {
                            $scope.display.push(id);
                            ar.setStorage('display', $scope.display);
                            $scope.discoveryList.splice(index, 1);
                            // 改变状态 api.save
                            api.save('/wap/member/delete-dynamic', {id:id}).success(function (res) {

                            });
                        }
                        return true;
                    }
                });
            }

            // 点赞
            $scope.clickLike = function (dis) {
                var i = ar.getArrI($scope.discoveryList, 'id', dis.id);
                var add = 0;
                if ($scope.discoveryList[i].cid > 0) {
                    add = -1;
                    $scope.discoveryList[i].cid = -1;
                } else {
                    add = 1;
                    $scope.discoveryList[i].cid = 1;
                }
                $scope.discoveryList[i].like_num = parseInt($scope.discoveryList[i].like_num) + add;

                api.save('/wap/member/set-click-like', {dynamicId: dis.id, add: add}); // 请测试功能是否正常。

            }

            $scope.page = 0;
            $scope.isMore = true;
            // 加载更多
            $scope.loadMore = function () {
                api.list('/wap/member/get-dynamic-list', {
                    user_id: $location.$$search.userId,
                    page: $scope.page
                }).success(function (res) {  //  查询出所有动态，分页
                    if (!res.data) {
                        $scope.isMore = false;
                    }
                    for (var i in res.data) {
                        res.data[i].imgList = JSON.parse(res.data[i].pic);
                        res.data[i].head_pic = res.data[i].head_pic.replace(/\"/g, '');
                        res.data[i].level = res.data[i].level.replace(/\"/g, '');
                        res.data[i].age = res.data[i].age.replace(/\"/g, '');
                        $scope.discoveryList.push(res.data[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                $scope.page += 1;
            };

            // 是否还有更多
            $scope.moreDataCanBeLoaded = function () {
                return $scope.isMore;
            };

            $ionicModal.fromTemplateUrl('released.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.releasedModal = modal;
            });
            $scope.releasedOpen = function () {
                $scope.releasedModal.show();
            };
            $scope.releasedClose = function () {
                $scope.releasedModal.hide();
            };

            // 发布动态
            $scope.imgList = [];
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

            var id = 0;
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
                        $scope.imgList.push({id: id + 1, thumb_path: response.thumb_path});
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
                amezeui.gallery.init();
            }

            // 发布动态
            $scope.saveData = function () {
                var userInfo = ar.getStorage('userInfo');
                $scope.formData.name = JSON.parse(userInfo.info).real_name;
                $scope.formData.pic = JSON.stringify($scope.imgList);
                api.save('/wap/member/add-user-dynamic', $scope.formData).success(function (res) { // 保存数据到数据库，关闭modal，展现数据
                    if(res.status) {
                        res.data.imgList = JSON.parse(res.data.pic);
                        res.data.head_pic = res.data.head_pic.replace(/\"/g, '');
                        res.data.level = res.data.level.replace(/\"/g, '');
                        res.data.age = res.data.age.replace(/\"/g, '');
                        $scope.discoveryList.unshift(res.data);
                    }
                    ar.saveDataAlert($ionicPopup, res.msg);

                    $scope.releasedClose();    // 关闭modal
                    amezeui.gallery.init(); // 初始化相册插件
                })
            }


        });
    }]);

    // 发现-评论
    module.controller("discovery.single", ['app.serviceApi', '$scope', '$location', '$ionicActionSheet', '$ionicModal', '$ionicPopup', function (api, $scope, $location, $ionicActionSheet, $ionicModal, $ionicPopup) {
        requirejs(['amezeui', 'amezeui_ie8'], function (amezeui, amezeui_ie8) {
            amezeui.gallery.init(); // 初始化相册插件
            $scope.formData = {};
            $scope.jump = function (id) {
                if(id == $scope.userInfo.id) {
                    $location.url('/member/information');
                } else {
                    $location.url('/userInfo?userId=' + id);
                }

            }
            //用户已屏蔽的动态id，从localStorage获取
            $scope.display = ar.getStorage('display') ? ar.getStorage('display') : [];

            var userInfo = ar.getStorage('userInfo');
            var info = JSON.parse(userInfo.info);
            $scope.user_id = userInfo.id;
            api.list('/wap/member/get-dynamic', {id: $location.$$search.id}).success(function (res) {
                res.data.imgList = JSON.parse(res.data.pic);
                res.data.head_pic = res.data.head_pic.replace(/\"/g, '');
                res.data.level = res.data.level.replace(/\"/g, '');
                res.data.age = res.data.age.replace(/\"/g, '');
                $scope.dis = res.data;
                for (var i in res.data.comment) {
                    res.data.comment[i].headPic = res.data.comment[i].headPic.replace(/\"/g, '');
                    res.data.comment[i].name = res.data.comment[i].name.replace(/\"/g, '');
                    res.data.comment[i].age = res.data.comment[i].age.replace(/\"/g, '');
                }
                //$comment = ar.cleanQuotes(JSON.stringify(res.data.comment));
                //$scope.commentList = JSON.parse($comment);
                $scope.commentList = res.data.comment;
            })

            // 点赞
            $scope.clickLike = function (dis) {
                var add = 0;
                if ($scope.dis.cid > 0) {
                    add = -1;
                    $scope.dis.cid = -1;
                } else {
                    add = 1;
                    $scope.dis.cid = 1;
                }
                $scope.dis.like_num = parseInt($scope.dis.like_num) + add;
                api.save('/wap/member/set-click-like', {dynamicId: dis.id, add: add});
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
                api.save('/wap/member/add-comment', $scope.formData).success(function (res) {
                    if (res.data.id > 0) {
                        $scope.commentList.push({
                            id: res.data.id,
                            user_id: userInfo.id,
                            headPic: info.head_pic,
                            name: info.real_name,
                            private: $scope.user.private == 'true' ? 1 : 0,
                            create_time: res.data.create_time,
                            content: $scope.formData.content
                        });

                        $scope.dis.comment_num = parseInt($scope.dis.comment_num) + 1;
                        $scope.formData.content = ''; //重置输入框
                    }

                })
            }

            $scope.more = function (isUser, id) {
                var btnList = [
                    {text: '举报'},
                    {text: '屏蔽'}
                ];
                if (isUser) {   // 判断该条动态是否所属当前用户
                    btnList = [
                        {text: '删除'}
                    ];
                }

                $ionicActionSheet.show({
                    buttons: btnList,
                    titleText: '更多',
                    cancelText: '取消',
                    cancel: function () {
                    },
                    buttonClicked: function (index, btnObj) {
                        if (btnObj.text == '屏蔽') {
                            $scope.display.push(id);
                            ar.setStorage('display', $scope.display);
                            $location.url('/discovery');
                            // 将参数ID存入localStorage：display
                        }
                        if (btnObj.text == '举报') {
                            $location.url('/member/report?id=' + id + '&type=2&title=动态&tempUrl=' + $location.$$url);
                        }
                        if (btnObj.text == '删除') {
                            $scope.display.push(id);
                            ar.setStorage('display', $scope.display);
                            // 改变状态 api.save
                            api.save('/wap/member/delete-dynamic', {id:id}).success(function (res) {
                                $location.url('/discovery');
                            });
                        }

                        return true;
                    }
                });
            }

        })
    }]);


})
