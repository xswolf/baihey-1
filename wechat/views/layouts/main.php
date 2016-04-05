<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <title>嘉瑞百合缘手机网站</title>
        <link href="/wechat/web/images/apple-touch-icon.png" rel="shortcut icon">
        <link href="/wechat/web/css/plugin/ionic/ionic.min.css" rel="stylesheet">
        <link href="/wechat/web/css/base.css" rel="stylesheet">
        <link href="/wechat/web/css/index.css" rel="stylesheet">

    </head>
    <script data-main="/wechat/web/js/app" src="/wechat/web/js/plugin/requirejs/require.js"></script>
    <body>

        <ion-content class="com_w_100">

            <?= $content ?>

        </ion-content>

        <div class="bar bar-footer bhy-footer">
            <ul id="footer">
                <li class="home">
                    <a href="/wap/site/index" class="page <?php echo \Yii::$app->controller->id == 'site' ? 'cur' : ''; ?>">
                        <i class="bhy_wap_menu home <?php echo \Yii::$app->controller->id == 'site' ? 'cur' : ''; ?>"></i>
                        <div>首页</div>
                    </a>
                </li>
                <li class="msg">
                    <a href="/wap/message/index" class="page <?php echo \Yii::$app->controller->id == 'message' ? 'cur' : ''; ?>">
                        <i class="bhy_wap_menu msg <?php echo \Yii::$app->controller->id == 'message' ? 'cur' : ''; ?>"></i>
                        <div>消息</div>
                    </a>
                </li>
                <li class="me">
                    <a href="/wap/member/index" class="page <?php echo \Yii::$app->controller->id == 'member' ? 'cur' : ''; ?>">
                        <i class="bhy_wap_menu me <?php echo \Yii::$app->controller->id == 'member' ? 'cur' : ''; ?>"></i>
                        <div>我</div>
                    </a>
                </li>
                <li class="discovery">
                    <a href="/wap/discovery/index" class="page <?php echo \Yii::$app->controller->id == 'discovery' ? 'cur' : ''; ?>">
                        <i class="bhy_wap_menu discovery <?php echo \Yii::$app->controller->id == 'discovery' ? 'cur' : ''; ?>"></i>
                        <div>发现</div>
                    </a>
                </li>
                <li class="rende">
                    <a href="/wap/rendezvous/index" class="page <?php echo \Yii::$app->controller->id == 'rendezvous' ? 'cur' : ''; ?>">
                      <i class="bhy_wap_menu rende <?php echo \Yii::$app->controller->id == 'rendezvous' ? 'cur' : ''; ?>"></i>
                      <div>约会</div>
                    </a>

                </li>

            </ul>
        </div>

    </body>
</html>
