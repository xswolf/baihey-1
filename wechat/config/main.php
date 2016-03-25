<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    //require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php')
//    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-wechat',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'wechat\controllers',
    'components' => [

        'wechat' => [
            'class' => 'common\wechat\WeChat',
            'appId' => 'wx787f8071dd1e1dac',
            'appSecret' => 'd5517695e5b9e5c2b3e119affe8302ad',
            'token' => 'jrbhy'
        ],

        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
            ],
        ],
        'request' => [
            'baseUrl' => '/',

        ],
        'view' => [
            'renderers' => [
                'html' => [
                    'class' => 'yii\smarty\ViewRenderer',
                    'cachePath' => '@runtime/Smarty/cache',
                    'compilePath' => '@runtime/Smarty/compile',
                    'options' => [
                        'left_delimiter' => '{!',
                        'right_delimiter' => '}',
                    ],
                ],
            ],
        ],
    ],
    'homeUrl' => '/',
    'params' => $params,

];
