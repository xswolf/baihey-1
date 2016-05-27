<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/26 0026
 * Time: 上午 10:05
 */

namespace backend\controllers;


use common\models\User;

class MemberController extends BaseController
{

    public function actionSearch(){

        $list = User::getInstance()->lists();
        $this->assign('list' , $list);
        return $this->render();
    }

    public function actionSave(){
        if(\Yii::$app->request->post('id')){

        }
        return $this->render();
    }
}