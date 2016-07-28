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
        $andWhere = [];
        if($this->get) {
            if (isset($this->get['id_phone_name']) && $this->get['id_phone_name'] != '') { // 电话、ID、姓名
                $id_phone_name = $this->get['id_phone_name'];
                if (is_numeric($id_phone_name)) {
                    if (strlen($id_phone_name . '') == 11) {
                        $andWhere[] = ["=", "u.phone", $id_phone_name];
                    } else {
                        $andWhere[] = ["=", "cash.user_id", $id_phone_name];
                    }
                } else {
                    $andWhere[] = ["like", "card.user_name", $id_phone_name];
                }
            }
            if ($this->get['status'] != ''){
                $andWhere[] = ['=' , 'cash.status' , $this->get['status']];
            }
        }
        //$status = \Yii::$app->request->get('status');
        $list = Cash::getInstance()->lists($andWhere);
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