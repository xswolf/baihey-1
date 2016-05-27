<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/25 0025
 * Time: 下午 2:27
 */

namespace backend\controllers;


class RedisController extends BaseController
{

    public function actionSet(){

        \Yii::$app->redis->hmset('user_list1' , 'name' , "{id:1,name:'草拟嘛1'}" ,'sex' , 'n');
        \Yii::$app->redis->hmset('user_list1' , 'id:3' , "{id:3,name:'草拟嘛'}");

        print_r(\Yii::$app->redis->hmget('user_list1','sex' , 'n'));
    }
}