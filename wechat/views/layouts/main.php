<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <title><?php echo $this->context->title; ?></title>
        <link href="/wechat/web/images/apple-touch-icon.png" rel="shortcut icon">
        <link href="/wechat/web/css/plugin/ionic/ionic.min.css" rel="stylesheet">
        <link href="/wechat/web/css/base.css" rel="stylesheet">
        <link href="/wechat/web/css/index.css" rel="stylesheet">

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
                        <i class="fs24 <?php echo \Yii::$app->controller->id == 'message' ? 'ion-ios-chatbubble cor21' : 'ion-ios-chatbubble-outline'; ?>"></i>
                        <p class="fs11 <?php echo \Yii::$app->controller->id == 'message' ? 'cor21' : ''; ?>">消息</p>
                    </a>
                </li>
                <li class="me">
                    <a href="/wap/member/index" class="page">
                        <i class="fs24 <?php echo \Yii::$app->controller->id == 'member' ? 'ion-ios-person cor21' : 'ion-ios-person-outline'; ?>"></i>
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

    </body>
</html>
