<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/29 0029
 * Time: 上午 10:32
 */

namespace backend\controllers;


use common\models\Feedback;

class FeedbackController extends BaseController
{

    public function actionIndex(){
        $andWhere = [];
        if($this->get) {
            if (isset($this->get['id_phone_name']) && $this->get['id_phone_name'] != '') { // 电话、ID、姓名
                $id_phone_name = $this->get['id_phone_name'];
                if (is_numeric($id_phone_name)) {
                    if (strlen($id_phone_name . '') == 11) {
                        $andWhere[] = ["=", "u.phone", $id_phone_name];
                    } else {
                        $andWhere[] = ["=", "f.feedback_id", $id_phone_name];
                    }
                } else {
                    $andWhere[] = ["like", "f.feedback_name", $id_phone_name];
                }
            }
            if ($this->get['status'] != ''){
                $andWhere[] = ['=' , 'f.status' , $this->get['status']];
            }
        }
        $list = Feedback::getInstance()->lists($andWhere);
        $this->assign('list' , $list);
        return $this->render();
    }

    public function actionAuth(){

        $id     = \Yii::$app->request->get('id');
        $status = \Yii::$app->request->get('status');
        $id     = Feedback::getInstance()->auth($id, $status);

        if ($id>0){
            $this->renderAjax(['status'=>1 , 'message'=>'成功']);
        }else{
            $this->renderAjax(['status'=>0 , 'message'=>'失败']);
        }

    }
}