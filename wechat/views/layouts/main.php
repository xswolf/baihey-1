<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title><?php echo $this->context->title; ?></title>
    <link href="/wechat/web/images/apple-touch-icon.png" rel="shortcut icon">
    <link href="/wechat/web/css/plugin/ionic/ionic.min.css" rel="stylesheet">
    <link href="/wechat/web/css/base.css" rel="stylesheet">
    <link href="/wechat/web/css/index.less" rel="stylesheet">
    <link href="/wechat/web/css/android.css" rel="stylesheet">
    <script>
        var _PageHeight = document.documentElement.clientHeight,

            _PageWidth = document.documentElement.clientWidth;

        // 计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
        var _LoadingTop = _PageHeight > 28 ? (_PageHeight - 28) / 2 : 0,

            _LoadingLeft = _PageWidth > 28 ? (_PageWidth - 28) / 2 : 0;

        // 在页面未加载完毕之前显示的loading Html自定义内容
//        var _LoadingHtml = '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background-color: rgba(255, 255, 255, 0.1);opacity:1;filter:alpha(opacity=100);z-index:10000;"><div style="position: absolute; cursor1: wait; left: ' + _LoadingLeft + 'px; top:' + _LoadingTop + 'px; width: auto; height: 28px;' +
//            '"><img src="/wechat/web/images/domLoading.gif"></div></div>';
//
//
//        document.write(_LoadingHtml);
//
//        // 监听加载状态改变
//        document.onreadystatechange = completeLoading;
//
//        // 加载状态为complete时移除loading效果
//        function completeLoading() {
//
//            if (document.readyState == "complete") {
//
//                var loadingMask = document.getElementById('loadingDiv');
//
//                loadingMask.parentNode.removeChild(loadingMask);
//
//            }
//        }


    </script>
</head>
<script data-main="/wechat/web/js/app" src="/wechat/web/js/plugin/requirejs/require.js"></script>
<body>
<?= $content ?>
<div class="bar bar-footer bhy-footer com_w_100">
    <ul id="footer">
        <li class="home">
            <a href="/wap/site/index" class="page">
                <i class="fs24 <?php echo \Yii::$app->controller->id == 'site' ? 'ion-ios-home cor21' : 'ion-ios-home-outline'; ?>"></i>
                <p class="fs11 <?php echo \Yii::$app->controller->id == 'site' ? 'cor21' : ''; ?>">首页</p>
            </a>
        </li>
        <li class="msg">
            <a href="/wap/message/index" class="page">
                <i class="fs24 pr  <?php echo \Yii::$app->controller->id == 'message' ? 'ion-ios-chatbubble cor21' : 'ion-ios-chatbubble-outline'; ?>"><i
                        class="msg-info-nb">5</i></i>
                <p class="fs11 <?php echo \Yii::$app->controller->id == 'message' ? 'cor21' : ''; ?>">消息</p>

            </a>
        </li>
        <li class="me">
            <a href="/wap/member/index" class="page">
                <i class="fs24 <?php echo \Yii::$app->controller->id == 'member' ? 'icon-bhy-user-online cor21' : 'icon-bhy-user-outline'; ?>"></i>
                <p class="fs11 <?php echo \Yii::$app->controller->id == 'member' ? 'cor21' : ''; ?>">我</p>
            </a>
        </li>
        <li class="discovery">
            <a href="/wap/discovery/index" class="page">
                <i class="fs24 <?php echo \Yii::$app->controller->id == 'discovery' ? 'ion-ios-eye cor21' : 'ion-ios-eye-outline'; ?>"></i>
                <p class="fs11 <?php echo \Yii::$app->controller->id == 'discovery' ? 'cor21' : ''; ?>">发现</p>
            </a>
        </li>
        <li class="rende">
            <a href="/wap/rendezvous/index" class="page">
                <i class="fs24 <?php echo \Yii::$app->controller->id == 'rendezvous' ? 'ion-ios-heart cor21' : 'ion-ios-heart-outline'; ?>"></i>
                <p class="fs11 <?php echo \Yii::$app->controller->id == 'rendezvous' ? 'cor21' : ''; ?>">约会</p>
            </a>

        </li>

    </ul>
</div>
<!--[if lt IE 9]>
<script src="/wechat/web/js/plugin/h5/html5.js"></script>
<script src="/wechat/web/js/plugin/h5/excanvas.min.js"></script>
<script src="/wechat/web/js/plugin/h5/css3-mediaqueries.js"></script>
<![endif]-->
</body>
</html>
