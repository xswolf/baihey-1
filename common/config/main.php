<?php
return [
    'vendorPath' => dirname(dirname(__DIR__)) . '/vendor',
    'components' => [
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        // ...
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'mysql:host=120.76.84.162;dbname=bhy', // MySQL, MariaDB 线上
//            'dsn' => 'mysql:host=localhost;dbname=bhy', // MySQL, MariaDB 本地
            'username' => 'jrbaihe', //数据库用户名
            'password' => 'jrbh*2016', //数据库密码
            'charset' => 'utf8',
            'tablePrefix' => 'bhy_',   //加入前缀名称fc_
            'attributes' => [
                PDO::ATTR_PERSISTENT => false,
            ],
        ],

        'view' => [
            'renderers' => [
                'html' => [
                    'class' => 'yii\smarty\ViewRenderer',
                    'cachePath' => '@runtime/Smarty/cache',
                    'compilePath' => '@runtime/Smarty/compile',
                    'options' => [
                        'left_delimiter' => '{{',
                        'right_delimiter' => '}}',
                    ],
                ],
            ],
        ],
        'redis' => [
            'class' => 'yii\redis\Connection',
            'hostname' => '120.76.84.162',
            'port' => 6379,
            'database' => 0,
        ],
        'messageApi' => [
            'class' => 'common\message\MessageApi'
        ],
//        'request'=> [
//            'csrfParam' => 'jrbhy',
//            "cookieValidationKey"=>"jrbhy*cnmkey"
//        ]
    ],
    'bootstrap' => ['debug'],
    'modules' => [
        'debug' => 'yii\debug\Module',
    ]
];
