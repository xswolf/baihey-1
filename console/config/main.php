<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-console',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'console\controllers',
    'components' => [
        'log' => [
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'wechat' => [
            'class' => 'common\wechat\WeChat',
            'appId' => 'wx787f8071dd1e1dac',
            'appSecret' => '9eaeecaffdea0d9af4dcf20265e736bd',
            //            'appId' => 'wxd7e0ddc236831e27', // 测试
            //            'appSecret' => 'e457c991b0fbe7adcec7ed4e6468e20d', // 测试
            'token' => 'jrbhy'
        ],
    ],
    'params' => $params,
];
