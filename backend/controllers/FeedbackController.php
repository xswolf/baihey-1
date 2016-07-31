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
        $where = [];
        $orWhere = [];
        if($this->get) {
            if (isset($this->get['id_phone_name']) && $this->get['id_phone_name'] != '') { // 电话、ID、姓名
                $id_phone_name = $this->get['id_phone_name'];
                if (is_numeric($id_phone_name)) {
                    if (strlen($id_phone_name . '') == 11) {
                        $orWhere[] = ["=", "u.phone", $id_phone_name];
                        $orWhere[] = ["=", "uf.phone", $id_phone_name];
                    } else {
                        $orWhere[] = ["=", "f.user_id", $id_phone_name];
                        $orWhere[] = ["=", "f.feedback_id", $id_phone_name];
                    }
                } else {
                    $orWhere[] = ["like", "f.user_name", $id_phone_name];
                    $orWhere[] = ["like", "f.feedback_name", $id_phone_name];
                }
            }
            if ($this->get['status'] != ''){
                $where = ['f.status' => $this->get['status']];
            }
        }
        $list = Feedback::getInstance()->lists($where, $orWhere);
        $this->assign('list' , $list);
        return $this->render();
    }

    public function actionAuth()
    {
        $id = \Yii::$app->request->get('id');
        if($this->post['status'] != 3) {
            var_dump($this->post);
        }
        exit;
        $id = Feedback::getInstance()->auth($id, $this->post['status']);
        if ($id>0){
            $this->renderAjax(['status'=>1 , 'message'=>'成功']);
        }else{
            $this->renderAjax(['status'=>0 , 'message'=>'失败']);
        }

    }
}