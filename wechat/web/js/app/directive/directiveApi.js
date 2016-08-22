/**
 * Created by Administrator on 2016/3/23.
 */
define(['app/module'], function (module) {

    module.directive("config", function () {
        return {
            restrict: "E",
            link: function ($scope, element) {
                console.log(element.html());
                //$scope.Chat.config =
            }
        }
    });

    module.directive('msdElastic', [
        '$timeout', '$window',
        function ($timeout, $window) {
            'use strict';
            return {
                require: 'ngModel',
                restrict: 'A, C',
                link: function (scope, element, attrs, ngModel) {

                    // cache a reference to the DOM element
                    var ta = element[0],
                        $ta = element;

                    // ensure the element is a textarea, and browser is capable
                    if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
                        return;
                    }

                    // set these properties before measuring dimensions
                    $ta.css({
                        'overflow': 'hidden',
                        'overflow-y': 'hidden',
                        'word-wrap': 'break-word'
                    });

                    // force text reflow
                    var text = ta.value;
                    ta.value = '';
                    ta.value = text;

                    var append = attrs.msdElastic ? attrs.msdElastic.replace(/\\n/g, '\n') : '',
                        $win = angular.element($window),
                        mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
                            'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
                            '-moz-box-sizing: content-box; box-sizing: content-box;' +
                            'min-height: 0 !important; height: 0 !important; padding: 0;' +
                            'word-wrap: break-word; border: 0;',
                        $mirror = angular.element('<textarea aria-hidden="true" tabindex="-1" ' +
                            'style="' + mirrorInitStyle + '"/>').data('elastic', true),
                        mirror = $mirror[0],
                        taStyle = getComputedStyle(ta),
                        resize = taStyle.getPropertyValue('resize'),
                        borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                            taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                            taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
                        boxOuter = !borderBox ? {width: 0, height: 0} : {
                            width: parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                            parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                            height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                            parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                        },
                        minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
                        heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
                        minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
                        maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
                        mirrored,
                        active,
                        copyStyle = ['font-family',
                            'font-size',
                            'font-weight',
                            'font-style',
                            'letter-spacing',
                            'line-height',
                            'text-transform',
                            'word-spacing',
                            'text-indent'];

                    // exit if elastic already applied (or is the mirror element)
                    if ($ta.data('elastic')) {
                        return;
                    }

                    // Opera returns max-height of -1 if not set
                    maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

                    // append mirror to the DOM
                    if (mirror.parentNode !== document.body) {
                        angular.element(document.body).append(mirror);
                    }

                    // set resize and apply elastic
                    $ta.css({
                        'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
                    }).data('elastic', true);

                    /*
                     * methods
                     */

                    function initMirror() {
                        var mirrorStyle = mirrorInitStyle;

                        mirrored = ta;
                        // copy the essential styles from the textarea to the mirror
                        taStyle = getComputedStyle(ta);
                        angular.forEach(copyStyle, function (val) {
                            mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
                        });
                        mirror.setAttribute('style', mirrorStyle);
                    }

                    function adjust() {
                        var taHeight,
                            taComputedStyleWidth,
                            mirrorHeight,
                            width,
                            overflow;

                        if (mirrored !== ta) {
                            initMirror();
                        }

                        // active flag prevents actions in function from calling adjust again
                        if (!active) {
                            active = true;

                            mirror.value = ta.value + append; // optional whitespace to improve animation
                            mirror.style.overflowY = ta.style.overflowY;

                            taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

                            taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

                            // ensure getComputedStyle has returned a readable 'used value' pixel width
                            if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
                                // update mirror width in case the textarea width has changed
                                width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                                mirror.style.width = width + 'px';
                            }

                            mirrorHeight = mirror.scrollHeight;

                            if (mirrorHeight > maxHeight) {
                                mirrorHeight = maxHeight;
                                overflow = 'scroll';
                            } else if (mirrorHeight < minHeight) {
                                mirrorHeight = minHeight;
                            }
                            mirrorHeight += boxOuter.height;
                            ta.style.overflowY = overflow || 'hidden';

                            if (taHeight !== mirrorHeight) {
                                scope.$emit('elastic:resize', $ta, taHeight, mirrorHeight);
                                ta.style.height = mirrorHeight + 'px';
                            }

                            scope.$emit('taResize', $ta);
                            // small delay to prevent an infinite loop
                            $timeout(function () {
                                active = false;
                            }, 1, false);

                        }
                    }

                    function forceAdjust() {
                        active = false;
                        adjust();
                    }

                    /*
                     * initialise
                     */

                    // listen
                    if ('onpropertychange' in ta && 'oninput' in ta) {
                        // IE9
                        ta['oninput'] = ta.onkeyup = adjust;
                    } else {
                        ta['oninput'] = adjust;
                    }

                    $win.bind('resize', forceAdjust);

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function (newValue) {
                        forceAdjust();
                    });

                    scope.$on('elastic:adjust', function () {
                        initMirror();
                        forceAdjust();
                    });

                    $timeout(adjust, 0, false);

                    /*
                     * destroy
                     */

                    scope.$on('$destroy', function () {
                        $mirror.remove();
                        $win.unbind('resize', forceAdjust);
                    });
                }
            };
        }
    ]);

    module.directive('resizeFootBar', ['$ionicScrollDelegate', function ($ionicScrollDelegate) {
        // Runs during compile
        return {
            replace: false,
            link: function (scope, iElm, iAttrs, controller) {
                scope.$on("taResize", function (e, ta) {
                    if (!ta) return;
                    var scroll = document.body.querySelector("#message-detail-content");
                    var scrollBar = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
                    // console.log(scroll);
                    var taHeight = ta[0].offsetHeight;
                    var newFooterHeight = taHeight + 10;
                    newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

                    iElm[0].style.height = newFooterHeight + 'px';
                    scroll.style.bottom = newFooterHeight + 'px';
                    scrollBar.scrollBottom();
                });
            }
        };
    }]);

    module.directive('showMulti', ['$animate', function ($animate) {
        return {
            replace: false,
            link: function (scope, iElm, iAttrs, controller) {
                var footerBar = iElm.parent().parent().parent('#msg_footer_bar');
                var multi = iElm.parent().parent().parent().next('#multi_con');
                iElm.bind('click', function () {
                    $animate.animate(footerBar, {
                        'bottom': multi[0].offsetHeight + 'px'
                    });
                    $animate.animate(multi, {
                        'bottom': '0'
                    });
                })
            }
        };
    }]);

    module.directive("timer", function ($interval) {
        //将用户界面的事件绑定到$scope上
        function link($scope, element, attributes) {
            //当timeout被定义时，它返回一个promise对象
            var timer = $interval(
                function () {
                    var NowTime = new Date();
                    var t = attributes.timer * 1000 - NowTime.getTime();
                    var d = Math.floor(t / 1000 / 60 / 60 / 24);
                    var h = Math.floor(t / 1000 / 60 / 60 % 24);
                    var m = Math.floor(t / 1000 / 60 % 60);
                    var s = Math.floor(t / 1000 % 60);
                    element.text(d + '天' + h + '时' + m + '分' + s + '秒');
                }, 1000);
            timer.then(
                function () {
                },
                function () {
                }
            );
            //当DOM元素从页面中被移除时，清除定时器
            $scope.$on(
                "$destroy",
                function (event) {
                    $interval.cancel(timer);
                }
            );
        }

        //返回指令的配置
        return ({
            link: link,
            scope: false
        });
    });

    module.directive('ionSticky', ['$ionicPosition', '$compile', '$timeout', function ($ionicPosition, $compile, $timeout) {
        return {
            restrict: 'A',
            require: '^$ionicScroll',
            link: function ($scope, $element, $attr, $ionicScroll) {
                var scroll = angular.element($ionicScroll.element);
                var clone;
                var cloneVal = function (original, to) {
                    var my_textareas = original.getElementsByTagName('textarea');
                    var result_textareas = to.getElementsByTagName('textarea');
                    var my_selects = original.getElementsByTagName('select');
                    var result_selects = to.getElementsByTagName('select');
                    for (var i = 0, l = my_textareas.length; i < l; ++i)
                        result_textareas[i].value = my_textareas[i].value;
                    for (var i = 0, l = my_selects.length; i < l; ++i)
                        result_selects[i].value = my_selects[i].value;
                };
                // creates the sticky divider clone and adds it to DOM
                var createStickyClone = function ($element) {
                    clone = $element.clone().css({
                        position: 'absolute',
                        top: $ionicPosition.position(scroll).top + "px", // put to top
                        left: 0,
                        right: 0
                    });
                    $attr.ionStickyClass = ($attr.ionStickyClass) ? $attr.ionStickyClass : 'assertive';
                    cloneVal($element[0], clone[0]);
                    clone[0].className += ' ' + $attr.ionStickyClass;

                    clone.removeAttr('ng-repeat-start').removeAttr('ng-if');

                    scroll.parent().append(clone);

                    // compile the clone so that anything in it is in Angular lifecycle.
                    $compile(clone)($scope);
                };

                var removeStickyClone = function () {
                    if (clone)
                        clone.remove();
                    clone = null;
                };

                $scope.$on("$destroy", function () {
                    // remove the clone and unbind the scroll listener
                    removeStickyClone();
                    angular.element($ionicScroll.element).off('scroll');
                });

                var lastActive;
                var minHeight = $attr.minHeight ? $attr.minHeight : 0;
                var updateSticky = ionic.throttle(function () {
                    //console.log(performance.now());
                    var active = null;
                    var dividers = [];
                    var tmp = $element[0].getElementsByClassName("item-divider");
                    for (var i = 0; i < tmp.length; ++i) dividers.push(angular.element(tmp[i]));
                    for (var i = 0; i < dividers.length; ++i) { // can be changed to binary search
                        if ($ionicPosition.offset(dividers[i]).top - dividers[i].prop('offsetHeight') - minHeight < 0) { // this equals to jquery outerHeight
                            if (i === dividers.length - 1 || $ionicPosition.offset(dividers[i + 1]).top -
                                (dividers[i].prop('offsetHeight') + dividers[i + 1].prop('offsetHeight')) - minHeight > 0) {
                                active = dividers[i][0];
                                break;
                            }
                        }
                    }

                    if (lastActive != active) {
                        removeStickyClone();
                        lastActive = active;
                        if (active != null)
                            createStickyClone(angular.element(active));
                    }
                    //console.log(performance.now());
                }, 200);
                scroll.on('scroll', function (event) {
                    updateSticky();
                });
            }
        }
    }]);

    // 点赞动画
    module.directive('clickLike', ['$animate', '$timeout', function ($animate, $timeout) {
        return function (scope, element, attrs) {
            element.on('click', function () {
                element.find('i').next().addClass('anm');
                $timeout(function () {
                    element.find('i').next().removeClass('anm');
                }, 400);
            });
        };
    }]);

    // 动态改变微信浏览器网页title - 聊天页
    module.directive('changeTitle', ['$timeout', function ($timeout) {
        return function (scope, element, attrs) {
            if(attrs.receiveId > 9999){
                changeTitle(attrs.changeTitle);
            }else{
                changeTitle(attrs.realName);
            }

            scope.$on('$ionicView.beforeLeave', function () {
                changeTitle('嘉瑞百合缘');
            })

            function changeTitle(title) {
                var body = document.body;
                document.title = title;
                var iframe = angular.element("<iframe style='display:none;' src='/favicon.ico'></iframe>");
                iframe.on('load', function () {
                    $timeout(function () {
                        iframe.off('load').remove();
                    }, 0);
                });
                angular.element(body).append(iframe);
            }

        };
    }]);

    module.directive('lazyload', function () {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attrs) {
                var img = new Image(); //创建一个Image对象，实现图片的预下载
                img.src = attrs.lazyload;
                if (img.complete) { // 如果图片已经存在于浏览器缓存
                    element.prop('src',img.src);
                    return; // 直接返回，不用再处理onload事件
                }
                img.onload = function () { //图片下载完毕
                    element.prop('src',img.src);
                };
            }
        };
    });

    module.directive("getImgSize", function () {
        return {
            restrict: "EA",
            link: function ($scope, element, attrs) {
                var _src = attrs.getImgSize.replace('thumb', 'picture');
                if (_src.split('.')[0].split('_')[2]) {
                    element.attr('data-size',_src.split('.')[0].split('_')[1] + 'x' + _src.split('.')[0].split('_')[2]);
                } else {
                    var img = new Image()
                    img.src = attrs.getImgSize;
                    if (img.complete) {
                        element.attr('data-size',img.width + 'x' + img.height);
                    } else {
                        img.onload = function () {
                            element.attr('data-size',img.width + 'x' + img.height);
                            img.onload = null; //避免重复加载
                        }
                    }
                }
            }
        }
    });

    module.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<img />',
            link: function(scope, element, attributes) {

                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var imgEle = element.find('img');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.src = event.target.result;
                    if (img.complete) {
                        imgEle.attr('src',event.target.result);
                    } else {
                        img.onload = function () {
                            imgEle.attr('src',event.target.result);
                            img.onload = null; //避免重复加载
                        }
                    }
                }
            }
        };
    }]);

})



