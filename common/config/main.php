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
            'dsn' => 'mysql:host=localhost;dbname=jm', // MySQL, MariaDB
            'username' => 'root', //数据库用户名
            'password' => '', //数据库密码
            'charset' => 'utf8',
        ],
    ],



];
