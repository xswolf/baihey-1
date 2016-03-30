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
        echo '<a href="http://mp.weixin.qq.com/s?__biz=MzAxMDI2NzY2NQ==&mid=204474690&idx=1&sn=c3e4cbc54d8587755ab620e8709f5a88#rd">dianjiguanzhu </a>';exit;
        /*\Yii::$app->wechat->aotures();

        $redis = \Yii::$app->redis;

        echo $redis->get('name');
        $redis->set('k','v');*/
        return $this->render();
    }

    public function actionChat(){
        $config = str_replace("\"" , "'" , json_encode(\Yii::$app->wechat->jsApiConfig([],false)));
        $config = addslashes($config);
        $this->assign('config' , $config);
        return $this->render(['name' => \Yii::$app->request->get('name') ,
                              'sendName'=>\Yii::$app->request->get('sendName')] , '');
    }

    public function actionConfig(){
        $config = str_replace("\"" , "'" , json_encode(\Yii::$app->wechat->jsApiConfig([],false)));
        $this->assign('config' , $config);

        $this->renderAjax();
    }


    public function actionRecord(){

        $this->assign('config' , json_encode(\Yii::$app->wechat->jsApiConfig([],false)));
        return $this->render();
    }

    public function actionList(){

        return $this->render();
    }

    public function actionAngular(){
        $this->assign('str','nsk');
        return $this->render();
    }

    public function actionMeizi(){
        $this->layout = false;
        return $this->render();
    }

    public function actionFocus(){

        return $this->render();
    }
}