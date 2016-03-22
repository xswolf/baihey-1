<htm>
    <head>
        <title>this is main</title>
    </head>
    <script data-main="/wechat/web/js/app" src="/wechat/web/js/plugin/requirejs/require.js"></script>
    <script>
        require.config({
            urlArgs: "bust=v3"+Math.random(), // 清除缓存
            baseUrl: '/wechat/web/js/',
            paths: {
                jquery: 'plugin/jquery/jquery',
                angular: 'plugin/angular/angular.min',
                "angular-route":"plugin/angular/angular-route",
                bootstrap:'bootstrap'
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
    <?= $content ?>
    </body>
</htm>
