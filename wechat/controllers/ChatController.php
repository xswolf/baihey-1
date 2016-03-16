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
        \Yii::$app->wechat->test();

        return $this->render();
    }

    public function actionChat(){

        return $this->render(['name' => \Yii::$app->request->get('name') ,
                              'sendName'=>\Yii::$app->request->get('sendName')] , '');
    }

    public function actionList(){

        return $this->render();
    }
}