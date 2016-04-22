<!DOCTYPE html>
<html lang="zh-CN" >
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title><?php echo $this->context->title; ?></title>
    <link href="/wechat/web/images/apple-touch-icon.png" rel="shortcut icon">
    <link href="/wechat/web/css/plugin/ionic/ionic.min.css" rel="stylesheet">
    <link href="/wechat/web/css/base.css" rel="stylesheet">
    <link href="/wechat/web/css/index.css" rel="stylesheet">
    <link href="/wechat/web/css/android.css" rel="stylesheet">
</head>
<script data-main="/wechat/web/js/app" src="/wechat/web/js/plugin/requirejs/require.js"></script>
<body >
<div id="domLoading" class="domLoading">
    <span><img src="/wechat/web/images/domLoading.gif"></span>
</div>
<?= $content ?>
<div class="bar bar-footer bhy-footer com_w_100" ng-controller="footer">
    <ul id="footer">
        <li class="home" ng-click="switchMenu('/index')">
            <a href="/wap/site/main#/idex" class="page">
                <i class="fs24" ng-class="{true:'ion-ios-home cor21',false:'ion-ios-home-outline'}[menu=='/index']"></i>
                <p class="fs11" ng-class="{true:'cor21',false:''}[menu=='/index']">首页</p>
            </a>
        </li>
        <li class="msg" ng-click="switchMenu('/message')">
            <a ui-sref="message" class="page">
                <i class="fs24 pr" ng-class="{true:'ion-ios-chatbubble cor21',false:'ion-ios-chatbubble-outline'}[menu=='/message']" >
                    <?php
                        if (\common\util\Cookie::getInstance()->getCookie('bhy_u_name')) {
                            $sum = \wechat\models\UserMessage::getInstance()->messageSum();
                            if($sum['sumSend'] > 0) { ?>
                                <i class="msg-info-nb">
                                    <?php echo $sum['sumSend']; ?>
                                </i>
                    <?php }} ?>
                </i>
                <p class="fs11" ng-class="{true:'cor21',false:''}[menu=='/message']">消息</p>

            </a>
        </li>
        <li class="member" ng-click="switchMenu('/member_index')">
            <a ui-sref="member" class="page">
                <i class="fs24" ng-class="{true:'icon-bhy-user-online cor21',false:'icon-bhy-user-outline'}[menu=='/member_index']" ></i>
                <p class="fs11" ng-class="{true:'cor21',false:''}[menu=='/member_index']">我</p>
            </a>
        </li>
        <li class="discovery" ng-click="switchMenu('/discovery')">
            <a ui-sref="discovery" class="page">
                <i class="fs24" ng-class="{true:'ion-ios-eye cor21',false:'ion-ios-eye-outline'}[menu=='/discovery']"></i>
                <p class="fs11" ng-class="{true:'cor21',false:''}[menu=='/discovery']">发现</p>
            </a>
        </li>
        <li class="rende" ng-click="switchMenu('/rende')">
            <a href="/wap/rendezvous/index" class="page">
                <i class="fs24" ng-class="{true:'ion-ios-heart cor21',false:'ion-ios-heart-outline'}[menu=='/rende']"></i>
                <p class="fs11" ng-class="{true:'cor21',false:''}[menu=='/rende']">约会</p>
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
