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
            'dsn' => 'mysql:host=114.80.78.241;dbname=bhy', // MySQL, MariaDB
            'username' => 'newbhy', //数据库用户名
            'password' => 'newbhy*2016', //数据库密码
            'charset' => 'utf8',
            'tablePrefix' => 'bhy_',   //加入前缀名称fc_

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
    ],



];

