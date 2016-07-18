<!DOCTYPE html>
<!--<html lang="zh-CN" manifest="/wechat/web/appcache">-->
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <title><?php echo $this->context->title; ?></title>
    <link href="/wechat/web/images/apple-touch-icon.png" rel="shortcut icon">
    <link href="/wechat/web/css/plugin/ionic/ionic.min.css" rel="stylesheet">
    <link href="/wechat/web/css/base.css" rel="stylesheet">
    <link href="/wechat/web/css/index.css" rel="stylesheet">
    <link href="/wechat/web/css/android.css" rel="stylesheet">
    <link href="/wechat/web/css/plugin/animate/animate.css" rel="stylesheet">
    <link href="/wechat/web/css/newFontIcon160613.css" rel="stylesheet">
    <link href="/wechat/web/css/plugin/photoswipe/photoswipe.css" rel="stylesheet">
    <link href="/wechat/web/css/plugin/photoswipe/default-skin.css" rel="stylesheet">
    <script>
        function addElement() {
//            if (location.hash == '#/index' || location.hash == '#/wechat_redirect') {
                alert(location.hash);
                var div = document.createElement("div");
                div.setAttribute("id", "welcome");
                div.innerHTML = '<div class="loading"><img src="/wechat/web/images/domLoading.gif" /><p>加载中，请稍候</p></div>';
                document.body.appendChild(div);
//            }
        }
    </script>
    <!-- STYLESHEETS --><!--[if lt IE 9]>
    <script src="/backend/web/CloudAdmin/js/flot/excanvas.min.js"></script>
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script><![endif]-->
</head>
<!--<script src="//cdn.bootcss.com/ionic/1.2.4/js/ionic.bundle.min.js"></script>-->
<script data-main="/wechat/web/js/app" src="/wechat/web/js/plugin/requirejs/require.js"></script>
<!--<script data-main="/wechat/web/js/build" src="/wechat/web/js/plugin/requirejs/require.js"></script>-->
<body onload="addElement();" ng-controller="main">
<?= $content ?>
<!--[if lt IE 9]>
<script src="/wechat/web/js/plugin/h5/html5.js"></script>
<script src="/wechat/web/js/plugin/h5/excanvas.min.js"></script>
<script src="/wechat/web/js/plugin/h5/css3-mediaqueries.js"></script>
<![endif]-->
</body>

</html>
