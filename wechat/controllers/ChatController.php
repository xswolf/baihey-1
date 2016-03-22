<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/10
 * Time: 15:45
 */

namespace wechat\controllers;



class ChatController extends BaseController{

    public function actionIndex(){
        /*\Yii::$app->wechat->test();

        $redis = \Yii::$app->redis;

        echo $redis->get('name');
        $redis->set('k','v');*/
        return $this->render();
    }

    public function actionChat(){

        $this->assign('config' , json_encode(\Yii::$app->wechat->jsApiConfig() , true));
        return $this->render(['name' => \Yii::$app->request->get('name') ,
                              'sendName'=>\Yii::$app->request->get('sendName')] , '');
    }


    public function actionRecord(){
        $this->assign('config' , json_encode(\Yii::$app->wechat->jsApiConfig() , true));
        return $this->render();
    }

    public function actionList(){

        return $this->render();
    }

    public function actionAngular(){
        $this->assign('str','nsk');
        return $this->render();
    }


}