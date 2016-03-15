<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-backend',
    'basePath' => dirname(__DIR__),
    'controllerNamespace' => 'backend\controllers',
    'bootstrap' => ['log'],
    'modules' => [],
    'components' => [
        'user' => [
            'identityClass' => 'common\models\User',
            'enableAutoLogin' => true,
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
            'baseUrl' => '/admin',
        ],

        'authManager'=> [

            'class'=>'yii\rbac\DbManager',//认证类名称

            'defaultRoles'=>['guest'],//默认角色

            'itemTable' => 'bhy_auth_item',//认证项表名称

            'itemChildTable' => 'bhy_auth_item_child',//认证项父子关系

            'assignmentTable' => 'bhy_auth_assignment',//认证项赋权关系

        ],

        'view' => [
            'renderers' => [
                'html' => [
                    'class' => 'yii\smarty\ViewRenderer',
                    'cachePath' => '@runtime/Smarty/cache',
                    'compilePath' => '@runtime/Smarty/compile',
                    'options' => [
                        'left_delimiter' => '{',
                        'right_delimiter' => '}',
                    ],
                ],
            ],
        ]
    ],
    'homeUrl' => '/admin',
    'params' => $params,


];
