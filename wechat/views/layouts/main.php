<!DOCTYPE html>
<html lang="zh-CN" manifest="/wechat/web/appcache">
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
    <!-- STYLESHEETS --><!--[if lt IE 9]>
    <script src="/backend/web/CloudAdmin/js/flot/excanvas.min.js"></script>
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script><![endif]-->
</head>
<script data-main="/wechat/web/js/app" src="/wechat/web/js/plugin/requirejs/require.js"></script>
<body>
<script>
//    if(location.hash == '#/main/index'){
//        addElement();
//        setTimeout(function(){
//            document.getElementById('welcome').className = 'animated fadeOut';
//            setTimeout(function(){
//                document.getElementById('welcome').className = 'animated fadeOut hide';
//            },1100)
//        },3000)
//    }
    function addElement() {
        var div = document.createElement("div");
        div.setAttribute("id", "welcome");
        document.body.appendChild(div);
    }
</script>
<!--[if lt IE 9]>
<script src="/wechat/web/js/plugin/h5/html5.js"></script>
<script src="/wechat/web/js/plugin/h5/excanvas.min.js"></script>
<script src="/wechat/web/js/plugin/h5/css3-mediaqueries.js"></script>
<![endif]-->
</body>
</html>
