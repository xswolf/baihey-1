/**
 * Created by Administrator on 2016/3/22.
 */

define(['app/module', 'app/directive/directiveApi'
    , 'app/service/serviceApi', 'config/area'
], function (module) {

    // 我
    module.controller("member.index", ['app.serviceApi', '$scope', '$ionicPopup', function (api, $scope, $ionicPopup) {

        // 退出登录
        $scope.loginOut = function () {
            api.save('/wap/member/login-out', {}).success(function (res) {
                // 跳转登录页
                ar.delCookie('bhy_u_sex');
                ar.delCookie('bhy_u_city');
                ar.delCookie('bhy_user_id');
                ar.delCookie('bhy_u_cityId');
                ar.delCookie('bhy_u_cityPid');
                localStorage.clear();
                location.href = '/wap/user/login';
            });
        }

        // 判断身份证是否认证通过
        api.list('/wap/member/photo-list', {type: 2, pageSize: 2}).success(function (res) {
            if (res.data.length) {
                $scope.honestyStatus = res.data[0].is_check;
            }
        });
        // 判断头像是否认证通过
        api.list('/wap/member/user-headpic', {}).success(function (res) {
            if (res.status) {
                $scope.headpicStatus = res.data.is_check;
            }
        });
        $scope.honesty = function (val) {
            return val & 1;
        }

        // 查询当前用户是否发过动态。
        $scope.discoveryNumber = 0;
        api.list('/wap/member/get-dynamic-list', {user_id: $scope.userInfo.id}).success(function (res) {
            if (res.status) {
                $scope.discoveryNumber = res.data.length;
            }
        });

    }]);

    // 资料首页
    module.controller("member.information", ['app.serviceApi', '$scope', '$ionicPopup', 'FileUploader', '$ionicLoading', '$ionicActionSheet', '$ionicModal','$ionicScrollDelegate','$filter', function (api, $scope, $ionicPopup, FileUploader, $ionicLoading, $ionicActionSheet, $ionicModal,$ionicScrollDelegate,$filter) {

        // 判断身份证是否认证通过
        api.list('/wap/member/photo-list', {type: 2, pageSize: 2}).success(function (res) {
            if (res.data.length) {
                $scope.honestyStatus = res.data[0].is_check;
            }
        });
        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/thumb-photo'
        });

        $scope.formData = [];
        $scope.imgList = [];
        api.list('/wap/member/photo-list', []).success(function (res) {
            $scope.imgList = res.data;
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        });

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
                    if ($scope.imgList.length < 1) { // 第一张上传相片默认设为头像
                        api.save('/wap/member/set-head', {
                            id: response.id,
                            thumb_path: response.thumb_path
                        }).success(function (res) {
                            $scope.imgList.push({id: response.id, thumb_path: response.thumb_path, is_head: 1});
                            $scope.userInfo.info.head_pic = response.thumb_path;
                            $scope.setUserStorage();
                        })
                    } else {
                        $scope.imgList.push({id: response.id, thumb_path: response.thumb_path, is_head: 0});
                    }
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

        // 点击img，功能
        $scope.moreImg = function (index) {
            var id = $scope.imgList[index].id;
            var img = $scope.imgList[index].thumb_path;
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '设为头像'}
                ],
                destructiveText: '删除',
                titleText: '操作照片',
                cancelText: '取消',
                destructiveButtonClicked: function () {  // 点击删除
                    var cpmform = ar.saveDataConfirm($ionicPopup, "是否确认删除该照片？")
                    cpmform.then(function (res) {
                        if (res) {
                            // 删除操作
                            api.save('/wap/member/del-photo', {'id': id}).success(function (res) {
                                $scope.imgList.splice(index, 1);
                                hideSheet();
                            });

                        } else {
                            hideSheet();
                        }
                    })

                },
                buttonClicked: function (i) {
                    // 设置头像
                    api.save('/wap/member/set-head', {id: id, thumb_path: img}).success(function (res) {
                        if (res.status < 1) {
                            ar.saveDataAlert($ionicPopup, res.msg);
                        } else {
                            for (var i in $scope.imgList) {
                                $scope.imgList[i].is_head = 0;
                            }
                            $scope.imgList[index].is_head = 1;
                            $scope.userInfo.info.head_pic = img;
                            $scope.setUserStorage();
                        }
                        hideSheet();
                    });
                    return true;
                }

            });

        }
        $scope.dynamicList = [];
        api.list('/wap/member/get-dynamic-list', {user_id: $scope.userInfo.id, page: 0}).success(function (res) {
            for (var i in res.data) {
                res.data[i].imgList = JSON.parse(res.data[i].pic);
                $scope.dynamicList.push(res.data[i]);
            }
        });
        $scope.getTravel('went_travel', $scope.userInfo.went_travel);// 我去过的地方
        $scope.getTravel('want_travel', $scope.userInfo.want_travel);// 我想去的地方
        $scope.getConfig('love_sport', $scope.userInfo.love_sport);// 喜欢的运动
        $scope.getConfig('want_film', $scope.userInfo.want_film);// 想看的电影
        $scope.getConfig('like_food', $scope.userInfo.like_food);// 喜欢的食物


        // 修改信息弹窗modal
        $scope.updateInfo = function (fieldName) {
            if (!fieldName)  return false;
            $ionicModal.fromTemplateUrl('/wechat/web/templates/' + fieldName + '.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.infoModal = modal;
                $scope.infoModal.show();
                ar.processData(fieldName,$scope,api,$ionicPopup,$filter,$ionicScrollDelegate);
            });
        }

        // 保存数据
        $scope.saveData = function (formData) {
            console.log(formData);
            api.save('url', formData).success(function (res) {
                $scope.closeModal();
            })
        }

        // 关闭modal
        $scope.closeModal = function () {
            $scope.infoModal.hide();
            $scope.infoModal.remove();
        }


    }
    ]);

    // 个人动态
    module.controller("member.discovery", ['app.serviceApi', '$scope', '$ionicPopup', '$location', '$ionicModal', '$ionicActionSheet', function (api, $scope, $ionicPopup, $location, $ionicModal, $ionicActionSheet) {
        $scope.formData = {};
        $scope.formData.auth = 1;
        $scope.discoveryList = [];
        $scope.pageSize = 5;

        api.list('/wap/member/get-dynamic-list', {
            user_id: $scope.userInfo.id,
            limit: 10000
        }).success(function (res) {  // 查询出所有动态
            if (res.data.length < 1) {
                return false;
            }
            for (var i in res.data) {
                res.data[i].imgList = JSON.parse(res.data[i].pic);
                res.data[i].real_name = res.data[i].real_name.replace(/\"/g, '');
                res.data[i].head_pic = res.data[i].head_pic.replace(/\"/g, '');
                res.data[i].level = res.data[i].level.replace(/\"/g, '');
                res.data[i].age = res.data[i].age.replace(/\"/g, '');
            }
            $scope.discoveryList = res.data;
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        });

        //用户已屏蔽的动态id，从localStorage获取
        $scope.display = ar.getStorage('display') ? ar.getStorage('display') : [];
        // 发现列表过滤条件：黑名单
        $scope.indexFilter = function (dis) {
            return $scope.display.indexOf(dis.id) == -1;
        }

        $scope.jump = function (url) {
            $location.url(url);
        }

        $scope.more = function (id, index) {
            $ionicActionSheet.show({
                buttons: [
                    {text: '删除'}
                ],
                titleText: '更多',
                cancelText: '取消',
                cancel: function () {
                },
                buttonClicked: function (i, btnObj) {
                    if (i == 0) {
                        $scope.display.push(id);
                        ar.setStorage('display', $scope.display);
                        // 改变状态 api.save
                        api.save('/wap/member/delete-dynamic', {id: id}).success(function (res) {
                            $scope.discoveryList.splice(index, 1);
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

        $scope.pageSize = 5;
        $scope.isMore = true;
        // 加载更多
        $scope.loadMore = function () {
            if ($scope.pageSize > $scope.discoveryList.length) {
                $scope.isMore = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.pageSize += 5;
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore;
        };


    }]);

    // 发布动态
    module.controller("member.discovery_add", ['app.serviceApi', '$scope', '$ionicPopup', '$location', '$ionicActionSheet', 'FileUploader', '$ionicLoading', function (api, $scope, $ionicPopup, $location, $ionicActionSheet, FileUploader, $ionicLoading) {
        var uploader = $scope.uploader = new FileUploader({  // 实例化上传图片插件
            url: '/wap/file/thumb'
        });
        $scope.reportData = {};
        $scope.formData = {};
        $scope.formData.auth = 1;

        $scope.imgList = [];

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
                    $scope.imgList.push({id: id + 1, thumb_path: response.thumb_path});
                } else {
                    ar.saveDataAlert($ionicPopup, '上传图片失败！');
                }
                ar.initPhotoSwipeFromDOM('.bhy-gallery');
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {  // 上传出错
                ar.saveDataAlert($ionicPopup, '上传图片出错！');
                $scope.hideLoading();  // 隐藏loading
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {  // 上传结束
                $scope.hideLoading();  // 隐藏loading
            };
        }

        // 发布动态
        $scope.saveData = function () {
            if (!ar.trim($scope.formData.content)) {
                ar.saveDataAlert($ionicPopup, '说点什么吧！可不要为难小的哦！');
                return false;
            }
            $ionicLoading.show({
                template: '发布中...'
            });
            var userInfo = ar.getStorage('userInfo');
            $scope.formData.name = JSON.parse(userInfo.info).real_name;
            $scope.formData.pic = JSON.stringify($scope.imgList);
            api.save('/wap/member/add-user-dynamic', $scope.formData).success(function (res) {
                ar.saveDataAlert($ionicPopup, res.msg);
                if (res.status) {
                    if ($location.$$search.tempUrl != '') {
                        $location.url($location.$$search.tempUrl);
                    } else {
                        $location.url('/discovery');
                    }
                } else {
                    window.location.reload();
                }
            }).finally(function () {
                $ionicLoading.hide();
            })
        }

    }]);


    // 关注的人
    module.controller("member.follow", ['app.serviceApi', '$scope', '$ionicPopup', '$ionicLoading', '$location', '$ionicActionSheet', function (api, $scope, $ionicPopup, $ionicLoading, $location, $ionicActionSheet) {
        $scope.followType = 'follow';
        $scope.followList = [];
        $scope.followedList = [];

        api.list('/wap/follow/follow-list', {type: 'follow'}).success(function (res) {
            for (var i in res.data) {
                res.data[i].info = JSON.parse(res.data[i].info);
                res.data[i].auth = JSON.parse(res.data[i].auth);
            }
            $scope.followList = res.data;
        });

        api.list('/wap/follow/follow-list', {type: 'followed'}).success(function (res) {
            for (var i in res.data) {
                res.data[i].info = JSON.parse(res.data[i].info);
                res.data[i].auth = JSON.parse(res.data[i].auth);
            }
            $scope.followedList = res.data;
        });

        // 取消关注
        $scope.delFollow = function (item, $index) {
            api.get('/wap/follow/del-follow', {
                user_id: ar.getCookie("bhy_user_id"),
                follow_id: item.user_id
            }).success(function (res) {
                if (res.data) {     // 成功
                    $scope.followList.splice($index, 1);
                } else {            // 失败
                    ar.saveDataAlert($ionicPopup, '取消关注失败');
                }
            })
        }

        // 切换，我关注的人，关注我的人
        $scope.switching = function (value) {
            $scope.followType = value;
        };

    }]);

    // 查看用户资料
    module.controller("member.user_info", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$ionicActionSheet', '$ionicLoading', '$location', 'dataFilter', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $ionicActionSheet, $ionicLoading, $location, dataFilter) {

        $scope.formData = [];
        var userInfo = ar.getStorage('userInfo');
        if (userInfo != null) {
            userInfo.info = JSON.parse(userInfo.info);
            userInfo.auth = JSON.parse(userInfo.auth);
        }
        // 用于想去的地方，去过的地方等
        var getTravel = function (name, serId) {
            if (serId != null && serId) {
                var arrSer = serId.split(',');
                eval("$scope." + name + "_count = " + arrSer.length);
                api.list('/wap/member/get-travel-list', {'area_id': serId}).success(function (res) {
                    eval("$scope." + name + " = " + JSON.stringify(res.data));
                });
            } else {
                eval("$scope." + name + "_count = " + 0);
            }
        }
        var getConfig = function (name, serId) {
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
        // 权限判断
        var is_privacy = function (val) {
            switch (val) {
                case '1':
                    return true;
                case '2':
                    return $scope.formData.followed == 1 ? true : false;
                case '3':
                    return $scope.otherUserInfo.info.level > 0 ? true : false;
                case '4':
                    return false;
                default :
                    return false;
            }
        }

        $scope.formData.userId = $location.$$search.userId;
        $scope.otherUserInfo = [];
        $scope.imgList = [];
        $scope.dynamicList = [];
        $scope.formData.isfollow = '2';

        api.list("/wap/member/user-info-page-by-id", {'id': $scope.formData.userId}).success(function (res) {
            if (res.status) {
                // 用户信息
                $scope.otherUserInfo = res.userInfo;
                $scope.otherUserInfo.info = JSON.parse($scope.otherUserInfo.info);
                $scope.otherUserInfo.auth = JSON.parse($scope.otherUserInfo.auth);
                // 用户相册
                $scope.imgList = res.userPhoto.length > 0 ? res.userPhoto : [];
                ar.initPhotoSwipeFromDOM('.bhy-gallery');
                // 用户动态
                if (res.dynamic) {
                    for (var i in res.dynamic) {
                        res.dynamic[i].imgList = JSON.parse(res.dynamic[i].pic);
                        $scope.dynamicList.push(res.dynamic[i]);
                    }
                }
                $scope.formData.isfollow = res.followStatus;// 关注状态
                $scope.formData.followed = res.followedStatus;// 被关注状态
                $scope.qqAuth = is_privacy($scope.otherUserInfo.privacy_qq);// qq权限
                $scope.perAuth = is_privacy($scope.otherUserInfo.privacy_per);// 个人动态权限
                $scope.wxAuth = is_privacy($scope.otherUserInfo.privacy_wechat);// 微信权限
                $scope.picAuth = is_privacy($scope.otherUserInfo.privacy_pic);// 相册权限
                $scope.otherUserInfo.went_travel ? getTravel('went_travel', $scope.otherUserInfo.went_travel) : true;// 我去过的地方
                $scope.otherUserInfo.want_travel ? getTravel('want_travel', $scope.otherUserInfo.want_travel) : true;// 我想去的地方
                $scope.otherUserInfo.love_sport ? getConfig('love_sport', $scope.otherUserInfo.love_sport) : true;// 喜欢的运动
                $scope.otherUserInfo.want_film ? getConfig('want_film', $scope.otherUserInfo.want_film) : true;// 想看的电影
                $scope.otherUserInfo.like_food ? getConfig('like_food', $scope.otherUserInfo.like_food) : true;// 喜欢的食物
            }

        });


        $scope.localChat = function () {
            window.location.hash = "#/chat1?id=" + $scope.otherUserInfo.id + "&head_pic=" + $scope.otherUserInfo.info.head_pic + "&real_name=" + $scope.otherUserInfo.info.real_name + "&sex=" + $scope.otherUserInfo.sex + "&age=" + $scope.otherUserInfo.info.age;
        }

        var followData = {};
        followData.user_id = ar.getCookie("bhy_user_id");
        followData.follow_id = $scope.formData.userId;
        // 未关注
        /*$scope.formData.follow = false;
         api.getStatus('/wap/follow/get-follow-status', followData).success(function (res) {
         if (res.data) {
         $scope.formData.follow = true;
         }
         });*/
        // 取消关注
        //$scope.cancelFollow = function () {
        //    api.save('/wap/follow/del-follow', followData).success(function (res) {
        //        if (res.data) {
        //            $scope.formData.isfollow = '2';
        //            // 成功，提示
        //            ar.saveDataAlert($ionicPopup, '取消关注成功');
        //        }
        //    });
        //}

        // 关注
        $scope.addFollow = function () {
            if (followData.user_id == followData.follow_id) {
                ar.saveDataAlert($ionicPopup, '您不能关注自己');
                return;
            }
            if (dataFilter.data.blacked.indexOf(followData.follow_id) != -1) {
                ar.saveDataAlert($ionicPopup, '您已被对方设置黑名单，关注失败');
                return;
            }
            api.save('/wap/follow/add-follow', followData).success(function (res) {
                if (res.data) {
                    document.getElementsByClassName('transition')[0].style.transition = 'all 0.5s';
                    document.getElementsByClassName('transition')[1].style.transition = 'all 0.5s';
                    $scope.formData.isfollow = '1';
                    // 成功，提示
                    ar.saveDataAlert($ionicPopup, '关注成功');
                }
            });
        }

    }]);

    // 隐私设置
    module.controller("member.privacy", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.$on('$ionicView.beforeEnter', function () {
            api.list('/wap/follow/get-sum-black', {}).success(function (res) {
                $scope.blackSum = res.data;
            });
        });
    }]);

    // 隐私设置-照片权限
    module.controller("member.privacy_pic", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.privacy_pic = $scope.userInfo.privacy_pic ? $scope.userInfo.privacy_pic : 1;

        // 已经离开本页面
        $scope.$on('$ionicView.afterLeave', function () {
            // 保存数据
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.privacy_pic = $scope.formData.privacy_pic;
                $scope.getUserPrivacyStorage('');
            });
        });
    }]);

    // 隐私设置-个人动态权限
    module.controller("member.privacy_per", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.privacy_per = $scope.userInfo.privacy_per ? $scope.userInfo.privacy_per : 1;

        // 已经离开本页面
        $scope.$on('$ionicView.afterLeave', function () {
            // 保存数据
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.privacy_per = $scope.formData.privacy_per;
                $scope.getUserPrivacyStorage('');
            });
        });
    }]);

    // 隐私设置-微信显示权限
    module.controller("member.privacy_wechat", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.privacy_wechat = $scope.userInfo.privacy_wechat ? $scope.userInfo.privacy_wechat : 1;

        // 已经离开本页面
        $scope.$on('$ionicView.afterLeave', function () {
            // 保存数据
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.privacy_wechat = $scope.formData.privacy_wechat;
                $scope.getUserPrivacyStorage('');
            });
        });
    }]);

    // 隐私设置-QQ显示权限
    module.controller("member.privacy_qq", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.formData = [];
        $scope.formData.privacy_qq = $scope.userInfo.privacy_qq ? $scope.userInfo.privacy_qq : 1;

        // 已经离开本页面
        $scope.$on('$ionicView.afterLeave', function () {
            // 保存数据
            api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                $scope.userInfo.privacy_qq = $scope.formData.privacy_qq;
                $scope.getUserPrivacyStorage('');
            });
        });
    }]);

    // 隐私设置-黑名单
    module.controller("member.privacy_black", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.followList = [];
        api.list('/wap/follow/black-list', {}).success(function (res) {
            $scope.followList = res.data;
            for (var i in $scope.followList) {
                $scope.followList[i].info = JSON.parse($scope.followList[i].info);
                $scope.followList[i].auth = JSON.parse($scope.followList[i].auth);
            }
        });

        // 解除黑名单
        $scope.removeItem = function ($index, item) {
            api.save('/wap/follow/del-black', {'id': item.id}).success(function (res) {
                $scope.followList.splice($index, 1);
            });
        }
    }]);

    // 账户安全
    module.controller("member.security", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

        $scope.formData = [];

    }]);

    // 账户安全-密码修改
    module.controller("member.security_pass", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.formData = [];
        // 保存
        $scope.saveData = function () {
            if ($scope.formData.pass == '') {
                ar.saveDataAlert($ionicPopup, '请填写旧密码');
                return false;
            }
            if ($scope.formData.new_pass1 == '' || $scope.formData.new_pass1.length < 6) {
                ar.saveDataAlert($ionicPopup, '密码长度必须大于6个字符');
                return false;
            }
            if ($scope.formData.new_pass1 != $scope.formData.new_pass1) {
                ar.saveDataAlert($ionicPopup, '新密码不一致');
                return false;
            }

            api.save('/wap/user/reset-password', $scope.formData).success(function (res) {
                if (res.data) {
                    ar.saveDataAlert($ionicPopup, '密码修改成功');
                    $scope.userInfo.reset_pass_time = parseInt(res.data);
                    $scope.getUserPrivacyStorage('#/member/security');
                } else {
                    ar.saveDataAlert($ionicPopup, '密码修改失败');
                }
            })

        }

    }]);

    // 账户安全-手机绑定
    module.controller("member.security_phone", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$interval', function (api, $scope, $timeout, $ionicPopup, $interval) {

        $scope.formData = {};
        $scope.codeTitle = '获取验证码';
        $scope.formData.phone = parseInt($scope.userInfo.phone);
        // 获取验证码
        $scope.getCode = function () {
            api.getMobileIsExist($scope.formData.phone).success(function (data) {
                if (!data.status) {
                    ar.saveDataAlert($ionicPopup, data.msg);
                } else {
                    var timeTitle = 60;
                    var timer = $interval(function () {
                        $scope.codeTitle = '重新获取(' + timeTitle + ')';
                    }, 1000, 60);
                    timer.then(function () {
                            $scope.codeTitle = '获取验证码';
                            $interval.cancel(timer);
                        }, function () {
                        },
                        function () {
                            timeTitle -= 1;
                        });
                    api.sendCodeMsg($scope.formData.phone).success(function (data) {     // 发送验证码
                        if (!data.status) {
                            ar.saveDataAlert($ionicPopup, '短信发送失败，请稍后重试。');
                        }
                    });
                }
            })
        }

        // 保存
        $scope.saveData = function () {
            api.getMobileIsExist($scope.formData.phone).success(function (data) {
                if (!data.status) {
                    ar.saveDataAlert($ionicPopup, data.msg);
                } else {
                    api.validateCode($scope.formData.code).success(function (res) {
                        if (!res.status) {
                            ar.saveDataAlert($ionicPopup, '验证码错误');
                            return false;
                        } else {
                            api.save('/wap/user/update-user-data', {phone: $scope.formData.phone}).success(function (res) {
                                if (res.data) {
                                    ar.saveDataAlert($ionicPopup, '手机绑定成功');
                                    $scope.userInfo.phone = $scope.formData.phone;
                                    $scope.getUserPrivacyStorage('#/member/security');
                                } else {
                                    ar.saveDataAlert($ionicPopup, '手机绑定失败');
                                }
                            })
                        }
                    })
                }
            });

        }

    }]);

    // 账户安全-更换手机-验证原手机
    module.controller("member.edit_phone", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$interval', '$location', function (api, $scope, $timeout, $ionicPopup, $interval, $location) {
        $scope.formData = {};
        $scope.codeTitle = '获取验证码'
        // 获取验证码
        $scope.getCode = function () {
            if ($scope.formData.phone != parseInt($scope.userInfo.phone)) {
                ar.saveDataAlert($ionicPopup, '旧手机号码错误！')
                return false;
            }
            var timeTitle = 60;
            var timer = $interval(function () {
                $scope.codeTitle = '重新获取(' + timeTitle + ')';
            }, 1000, 60);
            timer.then(function () {
                    $scope.codeTitle = '获取验证码';
                    $interval.cancel(timer);
                }, function () {
                },
                function () {
                    timeTitle -= 1;
                });
            api.sendCodeMsg($scope.userInfo.phone).success(function (data) {     // 发送验证码
                if (!data.status) {
                    ar.saveDataAlert($ionicPopup, '短信发送失败，请稍后重试。');
                }
            });
        }

        // 下一步
        $scope.next = function () {
            if ($scope.formData.phone != parseInt($scope.userInfo.phone)) {
                ar.saveDataAlert($ionicPopup, '旧手机号码错误！')
                return false;
            }
            api.validateCode($scope.formData.code).success(function (res) {
                if (!res.status) {
                    ar.saveDataAlert($ionicPopup, '验证码错误');
                    return false;
                } else {
                    $location.url('/member/edit_phone_new');
                }
            })
        }

    }]);

    // 账户安全-更换手机-绑定新手机
    module.controller("member.edit_phone_new", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$interval', '$location', function (api, $scope, $timeout, $ionicPopup, $interval, $location) {
        $scope.formData = {};
        $scope.codeTitle = '获取验证码'
        // 获取验证码
        $scope.getCode = function () {
            api.getMobileIsExist($scope.formData.phone).success(function (data) {
                if (!data.status) {
                    ar.saveDataAlert($ionicPopup, data.msg);
                } else {
                    var timeTitle = 60;
                    var timer = $interval(function () {
                        $scope.codeTitle = '重新获取(' + timeTitle + ')';
                    }, 1000, 60);
                    timer.then(function () {
                            $scope.codeTitle = '获取验证码';
                            $interval.cancel(timer);
                        }, function () {
                        },
                        function () {
                            timeTitle -= 1;
                        });
                    api.sendCodeMsg($scope.formData.phone).success(function (data) {     // 发送验证码
                        if (!data.status) {
                            ar.saveDataAlert($ionicPopup, '短信发送失败，请稍后重试。');
                        }
                    });
                }
            })
        }

        // 保存
        $scope.saveData = function () {
            api.getMobileIsExist($scope.formData.phone).success(function (data) {
                if (!data.status) {
                    ar.saveDataAlert($ionicPopup, data.msg);
                } else {
                    api.validateCode($scope.formData.code).success(function (res) {
                        if (!res.status) {
                            ar.saveDataAlert($ionicPopup, '验证码错误');
                            return false;
                        } else {
                            api.save('/wap/user/update-user-data', {phone: $scope.formData.phone}).success(function (res) {
                                if (res.data) {
                                    ar.saveDataAlert($ionicPopup, '绑定成功');
                                    $scope.userInfo.phone = $scope.formData.phone;
                                    $scope.getUserPrivacyStorage('#/member/security');
                                } else {
                                    ar.saveDataAlert($ionicPopup, '绑定失败');
                                }
                            })
                        }
                    })
                }
            });

        }

    }]);

// 账户安全-微信绑定
    module.controller("member.security_wechat", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {
        $scope.formData = [];
        $scope.formData.wechat = $scope.userInfo.info.wechat;
        $scope.saveData = function () {
            alert($scope.formData.wechat);
            if (!$scope.formData.wechat) {
                if (confirm('检测到您还未填写微信号，确定放弃吗？')) {
                    $location.url('/member/security');  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.wechat = $scope.formData.wechat;
                    $scope.getUserPrivacyStorage('#/member/security');
                })
            }
        }
    }]);

    // 账户安全-QQ绑定
    module.controller("member.security_qq", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {
        $scope.formData = [];
        $scope.formData.qq = $scope.userInfo.info.qq;
        $scope.saveData = function () {
            if ($scope.formData.qq == '' || typeof($scope.formData.qq) == 'undefined') {
                if (confirm('检测到您还未填写QQ号，确定放弃吗？')) {
                    $location.url('/member/security');  //跳转
                } else {
                    return false;
                }
            } else {
                api.save('/wap/member/save-data', $scope.formData).success(function (res) {
                    // 保存
                    $scope.userInfo.info.qq = $scope.formData.qq;
                    $scope.getUserPrivacyStorage('#/member/security');
                })
            }
        }
    }]);

    // 诚信认证
    module.controller("member.honesty", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        if (ar.getCookie('bhy_user_id')) {
            api.list("/wap/user/get-user-info", []).success(function (res) {
                $scope.userInfo = res.data;
                ar.setStorage('userInfo', res.data);
                if ($scope.userInfo != null) {
                    $scope.userInfo.info = JSON.parse($scope.userInfo.info);
                    $scope.userInfo.auth = JSON.parse($scope.userInfo.auth);
                }
            });
        }

        api.list("/wap/member/honesty-photo", []).success(function (res) {
            $scope.sfzLength = res.sfz.length;
            $scope.marrLength = res.marr.length;
            $scope.eduLength = res.edu.length;
            $scope.housingLength = res.housing.length;
        });

        $scope.honesty = function (val) {
            return $scope.userInfo.honesty_value & val;
        }
    }]);

    // 诚信认证-身份认证
    module.controller("member.honesty_sfz", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', '$location', function (api, $scope, $timeout, $ionicPopup, FileUploader, $location) {
        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/thumb'
            //url: '/wap/file/thumb-photo?type=2'
        });

        api.list('/wap/member/photo-list', {type: 23, pageSize: 2}).success(function (res) {
            $scope.authList = res.data;
        });
        $scope.imgList = [];
        ar.initPhotoSwipeFromDOM('.bhy-gallery');

        $scope.formData = [];
        $scope.formData.real_name = $scope.userInfo.info.real_name;
        $scope.addNewImg = function (name) {
            $scope.uploaderImage(uploader, name);
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        }
        // 监听上传回传数据
        $scope.$on('thumb_path', function (event, name, data) {
            if (name == 'honesty1') {
                !$scope.authList[0] ? $scope.authList[0] = data : $scope.authList[0].thumb_path = data.thumb_path;
            } else {
                !$scope.authList[1] ? $scope.authList[1] = data : $scope.authList[1].thumb_path = data.thumb_path;
            }
        });

        // 保存
        $scope.saveData = function () {
            if (!$scope.authList[0]) {
                ar.saveDataAlert('请上传身份证正面照片');
                return false;
            }
            if (!$scope.authList[1]) {
                ar.saveDataAlert('请上传身份证反面照片');
                return false;
            }
            if (!$scope.formData.real_name) {
                ar.saveDataAlert('请填写您的真实姓名');
                return false;
            }

            // 保存图片
            $scope.authList[0].type = 2;
            $scope.authList[1].type = 3;
            api.save('/wap/member/save-photo', $scope.authList).success(function (res) {
                var formData = [];
                formData.identity = $scope.formData.real_name;
                // 保存数据
                api.save('/wap/member/save-data', formData).success(function (res) {
                    $scope.userInfo.info.real_name = $scope.formData.real_name;
                    $scope.getUserPrivacyStorage('#/member/honesty');
                });
            });
        }
    }]);

    // 诚信认证-婚姻认证
    module.controller("member.honesty_marr", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        api.list('/wap/member/photo-list', {type: 5, pageSize: 1}).success(function (res) {
            $scope.authList = res.data;
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        });
        $scope.imgList = [];
        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/auth-pictures?type=5'
        });

        $scope.addNewImg = function (name) {
            $scope.uploaderImage(uploader, name);
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        }
        // 监听上传回传数据
        $scope.$on('thumb_path', function (event, name, data) {
            !$scope.authList[0] ? $scope.authList[0] = data : $scope.authList[0].thumb_path = data.thumb_path;
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        });
    }]);

    // 诚信认证-学历认证
    module.controller("member.honesty_edu", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        api.list('/wap/member/photo-list', {type: 4, pageSize: 1}).success(function (res) {
            $scope.authList = res.data;
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        });
        $scope.imgList = [];

        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/auth-pictures?type=4'
        });

        $scope.addNewImg = function (name) {
            $scope.uploaderImage(uploader, name);
        }
        // 监听上传回传数据
        $scope.$on('thumb_path', function (event, name, data) {
            !$scope.authList[0] ? $scope.authList[0] = data : $scope.authList[0].thumb_path = data.thumb_path;
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        });
    }]);

    // 诚信认证-房产认证
    module.controller("member.honesty_housing", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', 'FileUploader', function (api, $scope, $timeout, $ionicPopup, FileUploader) {
        api.list('/wap/member/photo-list', {type: 6, pageSize: 1}).success(function (res) {
            $scope.authList = res.data;
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        });
        $scope.imgList = [];

        // 实例化上传图片插件
        var uploader = $scope.uploader = new FileUploader({
            url: '/wap/file/auth-pictures?type=6'
        });

        $scope.addNewImg = function (name) {
            $scope.uploaderImage(uploader, name);
        }
        // 监听上传回传数据
        $scope.$on('thumb_path', function (event, name, data) {
            !$scope.authList[0] ? $scope.authList[0] = data : $scope.authList[0].thumb_path = data.thumb_path;
            ar.initPhotoSwipeFromDOM('.bhy-gallery');
        });
    }]);

    // 开通VIP
    module.controller("member.vip", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$interval', '$location', function (api, $scope, $timeout, $ionicPopup, $interval, $location) {
        $scope.formData = [];

        $scope.formData.timer = '78时00分12秒';

        // 用户的ID
        $scope.userId = 1;

        // 商品列表
        api.save('/wap/charge/get-charge-goods-list', {type: 1}).success(function (res) {
            $scope.goodsList = res;
        });

        var tid = $interval(function () {
            var totalSec = getTotalSecond($scope.formData.timer) - 1;
            if (totalSec >= 0) {
                $scope.formData.timer = getNewSyTime(totalSec);
            } else {
                $interval.cancel(tid);
            }

        }, 1000);

        //根据剩余时间字符串计算出总秒数
        function getTotalSecond(timestr) {
            var reg = /\d+/g;
            var timenums = new Array();
            while ((r = reg.exec(timestr)) != null) {
                timenums.push(parseInt(r));
            }
            var second = 0, i = 0;
            if (timenums.length == 4) {
                second += timenums[0] * 24 * 3600;
                i = 1;
            }
            second += timenums[i] * 3600 + timenums[++i] * 60 + timenums[++i];
            return second;
        }

        //根据剩余秒数生成时间格式
        function getNewSyTime(sec) {
            var s = sec % 60;
            sec = (sec - s) / 60; //min
            var m = sec % 60;
            sec = (sec - m) / 60; //hour
            var h = sec % 24;
            var d = (sec - h) / 24;//day
            var syTimeStr = "";
            if (d > 0) {
                syTimeStr += d.toString() + "天";
            }

            syTimeStr += ("0" + h.toString()).substr(-2) + "时"
                + ("0" + m.toString()).substr(-2) + "分"
                + ("0" + s.toString()).substr(-2) + "秒";

            return syTimeStr;
        }

        // 生成订单并跳转支付
        $scope.createOrder = function (_goodsId) {
            api.save('/wap/charge/produce-order', {
                goodsId: _goodsId,
                user_id: ar.getCookie('bhy_user_id')
            }).success(function (res) {
                if (res.status < 1) {
                    ar.saveDataAlert($ionicPopup, res.msg);
                } else {
                    $location.url('/charge_index?orderId=' + res.data);
                }
            })
        }

    }]);


// 我的账户
    module.controller("member.account", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.find = true;
        $scope.showMoney = function () {
            $scope.find = false;
            $timeout(function () {
                $scope.loading = true;
                api.get('/wap/member/get-user-balance', {}).success(function (res) {
                    $scope.loading = false;
                    $scope.money = parseInt(res.data.balance);   // 用户当前余额
                })
            }, 800)
        }

        $scope.timestamp = new Date().getTime();  // 当前时间戳

        // 正在使用的服务(未到期)
        api.get('/wap/member/get-user-service-info', {}).success(function (res) {
            $scope.serviceInfo = res.data;
            $scope.serviceInfo.level = ar.cleanQuotes($scope.serviceInfo.level);
        })

    }]);

    // 充值余额
    module.controller("member.balance", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {
        $scope.formData = {};
        $scope.formData.customize = 10;
        $scope.pay = function () {
            if (!$scope.formData.money || $scope.formData.money < 1) {
                ar.saveDataAlert($ionicPopup, '选择充值金额异常，请刷新重试！');
                return false;
            }
            // 生成订单并跳转支付
            api.save('/wap/charge/produce-order', {
                goodsId: 8,
                money: $scope.formData.money
            }).success(function (res) {
                if (res.status < 1) {
                    ar.saveDataAlert($ionicPopup, res.msg);
                } else {
                    $location.url('/charge_index?orderId=' + res.data);
                }
            })
        }

        $scope.customizePay = function () {
            if (!$scope.formData.customize) {
                ar.saveDataAlert($ionicPopup, '请您输入充值金额！');
                return false;
            }
            if ($scope.formData.customize < 1 || $scope.formData.customize > 20000) {
                ar.saveDataAlert($ionicPopup, '单次最少充值1元，最多充值20000元。');
                return false;
            }
            // 生成订单并跳转支付
            api.save('/wap/charge/produce-order', {
                goodsId: 9,
                money: $scope.formData.customize
            }).success(function (res) {
                if (res.status < 1) {
                    ar.saveDataAlert($ionicPopup, res.msg);
                } else {
                    $location.url('/charge_index?orderId=' + res.data);
                }
            })
        }
    }]);
// 我的账户-消费记录
    module.controller("member.account_record", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

        $scope.recordList = [];
        api.get('/wap/member/get-record-list', {}).success(function (res) {
            if (res.status > 0) {
                $scope.recordList = res.data;
            }
        })

        $scope.pageSize = 1;
        $scope.isMore = true;

        // 加载更多
        $scope.loadMoreData = function () {
            if ($scope.pageSize > $scope.recordList.length) {
                $scope.isMore = false;
            }
            $scope.pageSize += 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore
        }

    }]);

// 我的账户-消费记录详情
    module.controller("member.account_record_info", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {
        $scope.item = angular.fromJson($location.$$search.item);
    }]);

// 我的账户-嘉瑞红包
    module.controller("member.account_bribery", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', '$filter', function (api, $scope, $timeout, $ionicPopup, $location, $filter) {
        $scope.tab = 1;  // 1:收到的红包，2：发出的红包

        $scope.yearList = [];   // 年份
        for (var i = 2016; i <= new Date().getFullYear(); i++) {
            $scope.yearList.push({id: i, name: i + '年'});
        }
        $scope.year = $scope.yearList[$scope.yearList.length - 1].id;

        $scope.briberyList = [];
        api.list('/wap/member/bribery-list', {flag: false, page: $scope.page}).success(function (res) {
            var data = ar.cleanQuotes(JSON.stringify(res.data))
            $scope.briberyList = $scope.briberyList.concat(JSON.parse(data));
        })
        api.list('/wap/member/bribery-list', {flag: true, page: $scope.page}).success(function (res) {
            var data = ar.cleanQuotes(JSON.stringify(res.data))
            $scope.briberyList = $scope.briberyList.concat(JSON.parse(data));
        })

        $scope.numAndmoney = {number: 0, money: 0.00};   // 发出的、收到的红包， 数量，总额
        for (var i in $scope.briberyList) {
            if ($scope.briberyList[i].flag == $scope.tab && $scope.briberyList[i].status == 1 && $scope.briberyList[i].year == $scope.year) {
                $scope.numAndmoney.number += 1;
                $scope.numAndmoney.money += $scope.briberyList[i].money;
            }
        }
        $scope.isMore = true;  // 是否还有更多
        $scope.pageSize = 5;   // 一次加载5条

        //加载更多
        $scope.loadMore = function () {
            if ($scope.pageSize > $scope.numAndmoney.number) {
                $scope.isMore = false;
            }
            $scope.pageSize += 5;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore;
        }

        // 切换
        $scope.showTab = function (value) {
            $scope.numAndmoney.number = 0;
            $scope.numAndmoney.money = 0;
            $scope.tab = value;
            for (var i in $scope.briberyList) {
                if ($scope.briberyList[i].flag == value && $scope.briberyList[i].status == 1 && $scope.briberyList[i].year == $scope.year) {
                    $scope.numAndmoney.number += 1;
                    $scope.numAndmoney.money += $scope.briberyList[i].money;
                }
            }
        }


    }]);

// 我的账户-提现
    module.controller("member.account_withdraw", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$interval', '$ionicLoading', '$location', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $interval, $ionicLoading, $location) {

        $scope.formData = [];
        $scope.form = [];
        $scope.codeTitle = '获取验证码';

        api.get('/wap/member/get-user-balance', {}).success(function (res) {
            $scope.money = parseInt(res.data.balance) / 100;   // 用户当前余额
        })

        $scope.phone = $scope.userInfo.phone; // 用户绑定的手机号码

        $ionicModal.fromTemplateUrl('selectCardModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.showSelectCard = function () {
            $scope.modal.show();
        };

        $scope.selectedCard = function () {
            $scope.modal.hide();
        };

        api.list('/wap/member/cash-card-list').success(function (res) {
            $scope.cardList = res.data;
            $scope.formData.bank = $scope.cardList[0];
        });

        // 倒计时
        $scope.getCode = function () {
            if ($scope.form.phone != $scope.phone) {
                ar.saveDataAlert($ionicPopup, '输入的手机号码与绑定手机号码不符，请检查！');//+ $scope.phone.substring(0, 3) + "****" + $scope.phone.substring(7, 11)
                return false;
            }

            // 发送验证码
            api.sendCodeMsg($scope.form.phone).success(function (res) {
                if (!res) {
                    ar.saveDataAlert($ionicPopup, '获取验证码失败');
                }
            })

            var timeTitle = 60;
            var timer = $interval(function () {
                $scope.codeTitle = '重新获取(' + timeTitle + ')';
            }, 1000, 60);
            timer.then(function () {
                $scope.codeTitle = '获取验证码';
                $interval.cancel(timer);
            }, function () {
                ar.saveDataAlert($ionicPopup, '倒计时出错');
            }, function () {
                timeTitle -= 1;
            });
        }

        $scope.saveData = function () {

            $ionicLoading.show({template: '处理中...'});
            api.validateCode($scope.form.code).success(function (res) { // 比对验证码
                if (res.status) {
                    api.get('/wap/member/add-cash-info', {
                        money: $scope.formData.money,
                        cash_card_id: $scope.formData.bank.id
                    }).success(function (re) {
                        $ionicLoading.hide();
                        if (re.status > 0) {
                            $location.url('/member/account_withdraw_info?id=' + re.data);
                        } else {
                            ar.saveDataAlert($ionicPopup, re.msg);
                        }
                    })
                } else {
                    $ionicLoading.hide();
                    ar.saveDataAlert($ionicPopup, '验证码错误');
                    return;
                }
            })
        }

    }]);

// 我的账户-提现-提现状态提示
    module.controller("member.account_withdraw_info", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$interval', '$ionicLoading', '$location', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $interval, $ionicLoading, $location) {

        $ionicModal.fromTemplateUrl('statusModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.showStatus = function () {
            $scope.modal.show();
        };

        $scope.hideStatus = function () {
            $scope.modal.hide();
        };

        $scope.withdrawInfo = {};
        api.get('/wap/member/get-withdraw-info-by-id', {id: $location.$$search.id}).success(function (res) {
            $scope.withdrawInfo = res.data;
        })

    }]);

// 我的账户-我的银行卡
    module.controller("member.account_mycard", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        api.list('/wap/member/cash-card-list').success(function (res) {
            $scope.cardList = res.data;
        });

        $scope.delete = function (index, card) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确定删除？',
                template: false,
                cancelText: '点错了',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // 删除
                    api.save('/wap/member/del-card', {id: card.id}).success(function (res) {
                        if (res.status > 0) {
                            $scope.cardList.splice(index, 1);
                        } else {
                            ar.saveDataAlert($ionicPopup, res.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        }

    }]);

// 我的账户-银行卡详情
    module.controller("member.account_mycard_info", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {
        $scope.cardId = $location.$$search.id;  // 银行卡ID
        api.list('/wap/member/cash-card-by-id', {id: $scope.cardId}).success(function (res) {
            $scope.bankData = res.data;
        });

    }]);


//  我的银行卡-添加
    module.controller("member.account_add_card", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {
        $scope.formData = [];
        $scope.formData.user_name = $scope.userInfo.info.real_name;
        api.list('/wap/member/bank-list', {}).success(function (res) {
            $scope.bankData = res.data;
        });
        // 卡类型联动
        $scope.bankNameChain = function () {
            if (!$scope.formData.card_no) {
                ar.saveDataAlert($ionicPopup, '请输入银行卡号');
                return false;
            }
            if ($scope.formData.card_no.length == 19 || $scope.formData.card_no.length == 16) {
            } else {
                ar.saveDataAlert($ionicPopup, '请核对银行卡号是否正确');
                return false;
            }
            for (var i in $scope.bankData) {
                if ($scope.formData.card_no.indexOf($scope.bankData[i].bin) != -1) {
                    $scope.bankData[i].name.split('-');
                    $scope.formData.name = $scope.bankData[i].name.split('-')[0] + '-' + $scope.bankData[i].name.split('-')[2];
                    break;
                }
            }
        }

        $scope.saveData = function () {
            // 验证
            if (!$scope.formData.card_no) {
                ar.saveDataAlert($ionicPopup, '请输入银行卡号');
                return false;
            }

            if ($scope.formData.card_no.length == 19 || $scope.formData.card_no.length == 16) {
            } else {
                ar.saveDataAlert($ionicPopup, '请核对银行卡号是否正确');
                return false;
            }

            if (!$scope.formData.name) {
                ar.saveDataAlert($ionicPopup, '未自动补全卡类型，请核对您的银行卡号！');
                return false;
            }

            // 保存
            api.save('/wap/member/add-cash-card', $scope.formData).success(function (res) {
                if (res.status > 0) {
                    $location.url($location.$$search.tempUrl);
                } else {
                    ar.saveDataAlert($ionicPopup, res.msg);
                }
            })
        }
    }]);

// 我的约会
    module.controller("member.rendezvous", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

    }]);

// 我的约会-发布约会
    module.controller("member.rendezvous_add", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicModal', '$location', function (api, $scope, $timeout, $ionicPopup, $ionicModal, $location) {

        $scope.formData = [];
        if ($location.$$search.id) {
            api.list('/wap/rendezvous/get-rendezvous-info', {id: $location.search().id}).success(function (res) {
                $scope.formData = res.data;
                $scope.formData.theme = parseInt($scope.formData.theme);
            });
        }

        // 跳转-返回
        $scope.jump = function () {
            if ($location.$$search.tempUrl) {    // 因为只有2种情况，所以只需要判断是否有值
                $location.url('/rendezvous');
            } else {
                $location.url('/member/rendezvous');
            }
        }


        // 约会主题
        $ionicModal.fromTemplateUrl('themeModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.themeModal = modal;
        });
        $scope.openThemeModal = function () {
            $scope.themeModal.show();
        };
        $scope.closeThemeModal = function () {
            $scope.themeModal.hide();
        };

        // 约会标题
        $ionicModal.fromTemplateUrl('themeTitleModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.themeTitleModal = modal;
        });
        $scope.openThemeTitleModal = function () {
            $scope.themeTitleModal.show();
        };
        $scope.closeThemeTitleModal = function () {
            $scope.themeTitleModal.hide();
        };

        // 性别限制
        $ionicModal.fromTemplateUrl('sexModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.sexModal = modal;
        });
        $scope.openSexModal = function () {
            $scope.sexModal.show();
        };
        $scope.closeSexModal = function () {
            $scope.sexModal.hide();
        };

        // 我的出发地
        $ionicModal.fromTemplateUrl('fromModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.fromModal = modal;
        });
        $scope.openFromModal = function () {
            $scope.fromModal.show();
        };
        $scope.closeFromModal = function () {
            $scope.fromModal.hide();
        };


        // 目的地
        $ionicModal.fromTemplateUrl('destinationModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.destinationModal = modal;
        });
        $scope.openDestinationModal = function () {
            $scope.destinationModal.show();
        };
        $scope.closeDestinationModal = function () {
            $scope.destinationModal.hide();
        };

        // 约会时间
        $ionicModal.fromTemplateUrl('dateModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.dateModal = modal;
        });
        $scope.openDateModal = function () {
            $scope.dateModal.show();
        };
        $scope.closeDateModal = function () {
            $scope.dateModal.hide();
        };

        // 费用说明
        $ionicModal.fromTemplateUrl('moneyModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.moneyModal = modal;
        });
        $scope.openMoneyModal = function () {
            $scope.moneyModal.show();
        };
        $scope.closeMoneyModal = function () {
            $scope.moneyModal.hide();
        };

        // 对约伴的要求
        $ionicModal.fromTemplateUrl('requirementModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.requirementModal = modal;
        });
        $scope.openRequirementModal = function () {
            $scope.requirementModal.show();
        };
        $scope.closeRequirementModal = function () {
            $scope.requirementModal.hide();
        };

        // 默认选项
        $scope.formData.sex = "0";

        $scope.formData.themeList = [
            {id: 1, title: '娱乐'},
            {id: 2, title: '美食'},
            {id: 3, title: '旅游'},
            {id: 4, title: '运动健身'},
            {id: -1, title: '其他'},
        ]

        // 保存，发布
        $scope.saveData = function () {
            //$scope.formData.rendezvous_time = ar.currentDate;
            $scope.formData.rendezvous_time = 1475475000;
            if (!$scope.formData.theme) {
                ar.saveDataAlert($ionicPopup, '请选择约会主题');
                return false;
            }
            if (!$scope.formData.title) {
                ar.saveDataAlert($ionicPopup, '请填写约会标题');
                return false;
            }

            if (!$scope.formData.destination) {
                ar.saveDataAlert($ionicPopup, '请填写目的地');
                return false;
            }
            if (!$scope.formData.rendezvous_time) {
                ar.saveDataAlert($ionicPopup, '请填写出发时间');
                return false;
            }
            if (!$scope.formData.fee_des) {
                ar.saveDataAlert($ionicPopup, '请选择费用说明');
                return false;
            }

            api.save('/wap/rendezvous/release', $scope.formData).success(function (res) {
                if (res.data) {
                    ar.saveDataAlert($ionicPopup, '发布成功！');
                    $location.url('/member/rendezvous_put');
                }
            })
        }

    }]);

// 我的约会-发布约会-约会主题
    module.controller("member.rendezvous_theme", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.selTheme = function () {

            $scope.closeThemeModal();
        }

    }]);

// 我的约会-发布约会-约会标题
    module.controller("member.rendezvous_themeTitle", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.save = function () {
            $scope.closeThemeTitleModal();
            console.info($scope.formData.themeTitle, $scope.formData.content);
        }

    }]);

// 我的约会-发布约会-性别限制
    module.controller("member.rendezvous_sex", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.selSex = function () {
            $scope.closeSexModal();
            console.log($scope.formData.sex);
        }
    }]);

// 我的约会-发布约会-我的出发地
    module.controller("member.rendezvous_from", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.saveFrom = function () {
            $scope.closeFromModal();
            console.log($scope.formData.from);
        }
    }]);

// 我的约会-发布约会-目的地
    module.controller("member.rendezvous_destination", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.saveDestination = function () {
            $scope.closeDestinationModal();
            console.log($scope.formData.destination);
        }
    }]);

// 我的约会-发布约会-出发时间
    module.controller("member.rendezvous_date", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.saveDate = function () {
            $scope.closeDateModal();
            console.log($scope.formData.rendezvous_time);
        }
    }]);

// 我的约会-发布约会-费用说明
    module.controller("member.rendezvous_money", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {
        $scope.selMoney = function () {
            $scope.closeMoneyModal();
            console.log($scope.formData.fee_des);
        }
    }]);

// 我的约会-发布约会-对约伴的要求
    module.controller("member.rendezvous_requirement", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.userSex = 0;  // 用户性别 默认女0

        $scope.labelList = config_infoData.label;

        $scope.lab = [];

        $scope.nothing = false;  // 不限


        // 添加标签
        $scope.addLabel = function (value) {
            if ($scope.lab.indexOf(value) == -1) {  // 标签不存在才允许添加
                $scope.lab.push(value);
            }
            if (value == '不限') {
                $scope.lab = [];
                $scope.lab.push(value);
                $scope.nothing = true;
            }
        }

        // 删除标签
        $scope.removeLabel = function (index, value) {
            if (value == '不限') {
                $scope.nothing = false;
            }
            $scope.lab.splice(index, 1);
        }

        $scope.saveRequirement = function () {
            $scope.closeRequirementModal();
            $scope.formData.we_want = $scope.lab.join(',');
            console.log($scope.formData.we_want);
        }
    }]);


// 我的约会-我发布的约会
    module.controller("member.rendezvous_put", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$ionicActionSheet', '$location', '$ionicScrollDelegate', function (api, $scope, $timeout, $ionicPopup, $ionicActionSheet, $location, $ionicScrollDelegate) {

        $scope.formData = [];
        $scope.dateList = [];
        $scope.putList = [];
        $scope.formData.pageNum = 0;
        // 获取我发布的约会列表
        var getPutList = function (date, pageNum) {
            var formData = [];
            formData.user_id = ar.getCookie('bhy_user_id');
            formData.pageNum = pageNum + 1;
            formData.date = date;
            $scope.formData.date = date;
            $scope.formData.pageNum = pageNum + 1;
            api.list('/wap/rendezvous/list', formData).success(function (res) {
                res.data.length < 10 ? $scope.isMore = false : $scope.isMore = true;
                for (var i in res.data) {
                    var label = res.data[i].we_want.split(',');
                    res.data[i].label = [];
                    res.data[i].label = label;
                    $scope.putList.push(res.data[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        // 修改约会状态
        var upStatus = function (id, status) {
            var formData = [];
            formData.id = id;
            formData.status = status;
            api.save('/wap/rendezvous/update-status', formData).success(function (res) {
            });
        }
        // 只能查看最近半年的数据
        for (var i = 0; i < 6; i++) {
            var dt = new Date();
            dt.setMonth(dt.getMonth() - i);
            var _title = dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月';
            var _time = dt.getFullYear() + '-' + (dt.getMonth() + 1);
            $scope.dateList.push({title: _title, value: dt.toLocaleString(), time: _time});
        }
        $scope.dateTitle = $scope.dateList[0].title; // 默认当前月
        var arr = $scope.dateList[0].time.split('-');
        $scope.formData.year = arr[0];
        $scope.formData.month = arr[1] < 10 ? '0' + arr[1] : arr[1];
        $scope.datePicker = false;
        $scope.showDate = function () {
            $scope.datePicker = !$scope.datePicker;
        }

        // 选择日期改变样式、并查询数据
        $scope.seletedDate = function (title, time) {
            $scope.dateTitle = title;
            var arr = time.split('-');
            $scope.formData.year = arr[0];
            $scope.formData.month = arr[1] < 10 ? '0' + arr[1] : arr[1];
            getPutList(time, 0);
            $scope.putList = []; // 根据日期查询的数据
            $scope.datePicker = false;
        }

        $scope.isMore = true;

        // 加载更多
        $scope.loadMore = function () {
            getPutList($scope.formData.date, $scope.formData.pageNum);
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore;
        }

        // 操作
        $scope.showhandle = function (id, itemIndex) {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '关闭'},
                    {text: '修改'}
                ],
                destructiveText: '删除',
                titleText: '操作',
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                destructiveButtonClicked: function () {
                    var confirmPopup = $ionicPopup.confirm({
                        title: '确定删除此条记录？删除后不可恢复。',
                        template: false,
                        cancelText: '点错了',
                        okText: '确定'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            // 删除
                            upStatus($scope.putList[itemIndex].id, 0);
                            $scope.putList.splice(itemIndex, 1);
                            hideSheet();
                        } else {
                            return false;
                        }
                    });
                },
                buttonClicked: function (index) {
                    if (index == 0) {  // 关闭约会
                        $scope.putList[itemIndex].status = "3";
                        upStatus($scope.putList[itemIndex].r_id, 3);
                        hideSheet();
                    }
                    if (index == 1) { // 修改
                        $location.url('/member/rendezvous_add?id=' + $scope.putList[itemIndex].r_id);
                    }
                }
            });
        }

        // 跳转-参与的人
        $scope.involved = function (id, theme, title) {
            $location.url('/member/rendezvous_involved?id=' + id + '&theme=' + theme + '&title=' + title);
        }

        $scope.openTxt = false;
        // 展开全文
        $scope.openText = function ($event) {
            $event.stopPropagation();
            $scope.openTxt = true;
        }


    }]);

// 我的约会-我参与的约会
    module.controller("member.rendezvous_part", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', function (api, $scope, $timeout, $ionicPopup) {

        $scope.formData = [];
        $scope.partList = [];
        $scope.formData.pageNum = 0;
        var getPutList = function (pageNum) {
            var formData = [];
            formData.user_id = ar.getCookie('bhy_user_id');
            formData.pageNum = pageNum + 1;
            $scope.formData.pageNum = pageNum + 1;
            api.list('/wap/rendezvous/apply-list', formData).success(function (res) {
                res.data.length < 10 ? $scope.isMore = false : $scope.isMore = true;
                for (var i in res.data) {
                    var label = res.data[i].we_want.split(',');
                    res.data[i].label = [];
                    res.data[i].label = label;
                    res.data[i].info = JSON.parse(res.data[i].info);
                    res.data[i].auth = JSON.parse(res.data[i].auth);
                    $scope.partList.push(res.data[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        $scope.isMore = true;

        // 加载更多
        $scope.loadMore = function () {
            getPutList($scope.formData.pageNum);
        }

        // 是否还有更多
        $scope.moreDataCanBeLoaded = function () {
            return $scope.isMore;
        }

        $scope.delPart = function (id, itemIndex) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确定删除此条记录？删除后将不显示在对方参与列表。',
                template: false,
                cancelText: '点错了',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // 删除
                    api.save('/wap/rendezvous/delete-apply', {id: id}).success(function (res) {
                        $scope.partList.splice(itemIndex, 1);
                    });
                } else {
                    return false;
                }
            });
        }

        $scope.openTxt = false;
        // 展开全文
        $scope.openText = function ($event) {
            $event.stopPropagation();
            $scope.openTxt = true;
        }

        $scope.acceptAlert = function (phone) {
            if (phone == null || typeof(phone) == undefined) {
                ar.saveDataAlert($ionicPopup, '请等待TA联系');
            } else {
                ar.saveDataAlert($ionicPopup, 'TA的手机号码：' + phone);
            }
        }

    }]);

// 我的约会-参与的人
    module.controller("member.rendezvous_involved", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

        $scope.partList = [];
        $scope.rendzvous = [];
        $scope.involvedList = [];
        $scope.rendzvous.id = $location.$$search.id;
        $scope.rendzvous.title = $location.$$search.title;
        $scope.rendzvous.theme = $location.$$search.theme;

        api.list('/wap/rendezvous/rendezvous-apply-list', {id: $location.$$search.id}).success(function (res) {
            $scope.involvedList = res.data;
            for (var i in res.data) {
                $scope.involvedList[i].info = JSON.parse(res.data[i].info);
                $scope.involvedList[i].auth = JSON.parse(res.data[i].auth);
            }
        });

        $scope.isAccept = false;
        $scope.isIgnore = false;
        // 接受
        $scope.accept = function (id, itemIndex) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确定接受吗？',
                template: false,
                cancelText: '点错了',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // 确定
                    var formData = [];
                    formData.id = id;
                    formData.status = 1;
                    api.save('/wap/rendezvous/update-apply-status', formData).success(function (res) {
                        $scope.involvedList[itemIndex].status = 1;
                    });
                    $scope.isAccept = true;
                } else {
                    return false;
                }
            });
        }

        // 忽略
        $scope.ignore = function (id, itemIndex) {
            var confirmPopup = $ionicPopup.confirm({
                title: '确定忽略吗？',
                template: false,
                cancelText: '点错了',
                okText: '确定'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // 确定
                    var formData = [];
                    formData.id = id;
                    formData.status = 2;
                    api.save('/wap/rendezvous/update-apply-status', formData).success(function (res) {
                        $scope.involvedList[itemIndex].status = 2;
                    });
                    $scope.isIgnore = true;
                } else {
                    return false;
                }
            });
        }


    }]);

// 我的专属红娘
    module.controller("member.matchmaker", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', '$filter', function (api, $scope, $timeout, $ionicPopup, $location, $filter) {

        $scope.userName = $filter('sex')($scope.userInfo.info.real_name, $scope.userInfo.sex, $scope.userInfo.info.age);
        $scope.matchmakerList = [];
        var formData = [];
        api.list("/wap/user/get-user-info", []).success(function (res) {
            $scope.userInfo = res.data;
            ar.setStorage('userInfo', res.data);
            if ($scope.userInfo != null) {
                $scope.userInfo.info = JSON.parse($scope.userInfo.info);
                $scope.userInfo.auth = JSON.parse($scope.userInfo.auth);
            }
            if ($scope.userInfo.matchmaking) {
                $scope.title = '服务红娘';
                $scope.showTitle = '专属红娘';
                $scope.showMatchmaker = true;
                formData.matchmaker = $scope.userInfo.matchmaking + '-' + $scope.userInfo.matchmaker;
            } else if ($scope.userInfo.matchmaker) {
                $scope.showMatchmaker = true;
                $scope.title = '专属红娘';
                formData.matchmaker = $scope.userInfo.matchmaker;
            } else {
                $scope.showMatchmaker = false;
                $scope.title = '值班红娘';
                formData.matchmaker = 0;
            }
            api.list('/wap/matchmaker/user-matchmaker-list', formData).success(function (res) {
                $scope.matchmakerList = res.data;
                if (formData.matchmaker == 0 && $scope.matchmakerList.length > 1) {
                    $scope.matchmakerList = [];
                    $scope.matchmakerList[0] = res.data[0];
                }
            });
        });

        $scope.getMatchmakerList = function () {
            if ($scope.title == '服务红娘') {
                $scope.title = '专属红娘';
                $scope.showTitle = '服务红娘';
                $scope.matchmakerList.reverse();
            } else {
                $scope.title = '服务红娘';
                $scope.showTitle = '专属红娘';
                $scope.matchmakerList.reverse();
            }
        }

        $scope.showPhone = function () {
            $scope.phone = $scope.matchmakerList[0].landline ? $scope.matchmakerList[0].landline : $scope.matchmakerList[0].phone;
            ar.saveDataAlert($ionicPopup, '电话：' + $scope.phone);
        }

    }]);

// 专属红娘资料
    module.controller("member.matchmaker_info", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

        $scope.matchmakerList = [];
        var formData = [];
        formData.matchmaker = $location.$$search.job;
        api.list('/wap/matchmaker/user-matchmaker-list', formData).success(function (res) {
            $scope.matchmakerList = res.data;
        });

        if ($scope.userInfo.matchmaking == formData.matchmaker) {
            $scope.title = '服务红娘';
        } else if ($scope.userInfo.matchmaker == formData.matchmaker) {
            $scope.title = '专属红娘';
        } else {
            $scope.title = '值班红娘';
        }

    }]);

// 红娘服务的四大优势
    module.controller("member.matchmaker_service", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

// 关于嘉瑞
    module.controller("member.about", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

// 帮助中心
    module.controller("member.help", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

    module.controller("member.help_notice", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

    module.controller("member.help_appointment", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

    module.controller("member.help_protocol", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

    }]);

// 举报
    module.controller("member.report", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', function (api, $scope, $timeout, $ionicPopup, $location) {

        $scope.title = $location.$$search.title;  // 标题
        $scope.reportData = [];
        var formData = [];
        $scope.report = function () {
            if (!$scope.reportData.item) {
                ar.saveDataAlert($ionicPopup, '请选择举报内容');
                return false;
            }
            formData.feedback_id = $location.$$search.id;
            formData.content = $scope.reportData.item;
            formData.type = $location.$$search.type;
            api.save('/wap/member/add-feedback', formData).success(function (res) {   //TODO 保存数据
                if (res.status == 1) {
                    ar.saveDataAlert($ionicPopup, '您的举报信息我们已受理，我们会尽快核实情况并将处理结果反馈给您，谢谢您对我们的支持！');
                    $location.url($location.$$search.tempUrl);
                }
                if (res.status == -1) {
                    ar.saveDataAlert($ionicPopup, '情况核实中，请勿重复提交！');
                    $location.url($location.$$search.tempUrl);
                }
                if (res.status == 0) {
                    ar.saveDataAlert($ionicPopup, '举报失败，请刷新重试！');
                }
            })
        }

    }]);

// 用户资料-隐私设置
    module.controller("member.settings", ['app.serviceApi', '$scope', '$timeout', '$ionicPopup', '$location', '$ionicActionSheet', function (api, $scope, $timeout, $ionicPopup, $location, $ionicActionSheet) {
        $scope.formData = {};
        var followData = [];
        followData.user_id = ar.getCookie("bhy_user_id");
        followData.follow_id = $location.$$search.userId;

        api.list("/wap/follow/get-follow-status", followData).success(function (res) {
            if (res.status) {
                if (res.data == 0) {
                    $scope.formData.pullBlack = true;
                    $scope.formData.follow = false;
                } else if (res.data == 1) {
                    $scope.formData.follow = true;
                    $scope.formData.pullBlack = false;
                }
            }
        });
        // 举报
        $scope.report = function () {
            if (followData.user_id == followData.follow_id) {
                ar.saveDataAlert($ionicPopup, '您不能举报自己');
                return;
            }
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '诽谤辱骂'},
                    {text: '淫秽色情'},
                    {text: '血腥暴力'},
                    {text: '垃圾广告'},
                    {text: '<p class="lh24 mb0">欺骗</p><p class="fs12 lh24 cor4 mb0">（酒托、话费托等骗取行为）</p>'},
                    {text: '<p class="lh24 mb0">违法行为</p><p class="fs12 lh24 cor4 mb0">（涉毒、暴恐、违禁品等）</p>'},
                    {text: '冒用他人照片'},
                    {text: '资料不真实'}
                ],
                titleText: '举报',
                cancelText: '取消',
                buttonClicked: function (index) {
                    api.save('/wap/member/add-feedback', {
                        content: config_infoData.feedback[index],
                        feedback_id: followData.follow_id
                    }).success(function (res) {
                        hideSheet();
                        if (res.status) {
                            ar.saveDataAlert($ionicPopup, '举报成功，工作人员会尽快核实情况。');
                        } else {
                            ar.saveDataAlert($ionicPopup, '举报失败，请刷新重试！');
                        }
                    })
                }
            });
        }

        // 取消关注
        $scope.delFollow = function () {
            api.get('/wap/follow/del-follow', followData).success(function (res) {
                if (res.status) {     // 成功
                    $scope.formData.follow = false;
                } else {            // 失败
                    ar.saveDataAlert($ionicPopup, '取消关注失败');
                }
            })
        }

        // 拉黑
        $scope.pullTheBlack = function () {
            if ($scope.formData.pullBlack) {
                if (followData.user_id == followData.follow_id) {
                    ar.saveDataAlert($ionicPopup, '您不能拉黑自己');
                    $scope.formData.pullBlack = false;
                    return;
                }
                var confirm = ar.saveDataConfirm($ionicPopup, '确定将对方拉黑吗？拉黑后在“个人-隐私设置-黑名单”中解除。');
                confirm.then(function (r) {
                    if (r) {  // 确定拉黑
                        api.save('/wap/follow/black-follow', followData).success(function (res) {
                            if (res.status) {
                                $scope.formData.pullBlack = true;
                                ar.saveDataAlert($ionicPopup, '已将对方列入黑名单，如需解除请至“个人-隐私设置-黑名单”中解除。');
                                return true;
                            } else {
                                ar.saveDataAlert($ionicPopup, '操作失败，请刷新重试！');
                                return false;
                            }
                        })
                    } else {
                        $scope.formData.pullBlack = false;
                        return false;
                    }
                })
            } else {
                $scope.delFollow();
                console.log('取消拉黑');
            }
        }
    }]);

    return module;
})


