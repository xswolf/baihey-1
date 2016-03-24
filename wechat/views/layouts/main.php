<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <title>嘉瑞百合缘手机网站</title>
        <link href="/wechat/web/images/apple-touch-icon.png" rel="shortcut icon">
        <link href="/wechat/web/css/plugin/bootstrap/css/bootstrap.css" rel="stylesheet">
        <link href="/wechat/web/css/plugin/bootstrap/css/buttons.css" rel="stylesheet">
        <link href="/wechat/web/css/base.css" rel="stylesheet">
        <link href="/wechat/web/css/index.css" rel="stylesheet">
    </head>
    <script data-main="/wechat/web/js/app" src="/wechat/web/js/plugin/requirejs/require.js"></script>
    <script>
        require.config({
            urlArgs: "bust=v3"+Math.random(), // 清除缓存
            baseUrl: '/wechat/web/js/',
            paths: {
                jquery: 'plugin/jquery/jquery',
                angular: 'plugin/angular/angular.min',
                "angular-route": "plugin/angular/angular-route",
                bootstrap:'plugin/bootstrap/bootstrap.min'
            },
            shim:{
                angular:{
                    exports:"angular"
                },
                "angular-route":{
                    deps:['angular'],
                    exports:"angular-route"
                },
                jquery : {
                    exports:"jquery"
                }
            }
        });

    </script>

    <body>
        <div class="container bhy com_w_100 pr bds0">

            <?= $content ?>

        </div>
    </body>
</html>
