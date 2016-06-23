<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/23 0023
 * Time: 下午 3:40
 */

namespace backend\controllers;


use common\models\Cash;

class CashController extends BaseController
{

    // 提现列表
    public function actionIndex(){

        $status = \Yii::$app->request->get('status');
        $list = Cash::getInstance()->lists($status);
        $this->assign('list' , $list);
        return $this->render();
    }

    public function actionConfirm(){

        $id = \Yii::$app->request->post('id');
        $id = intval($id);
        $flag = Cash::getInstance()->confirm($id);
        $flag ? $this->renderAjax(['status'=>1,'message'=>'操作成功']) : $this->renderAjax(['status'=>0,'message'=>'操作失败']);
    }
}