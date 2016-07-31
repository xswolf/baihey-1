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
        $data = $this->post;
        if($data['status'] != 3) {
            var_dump($this->post);
            if($data['type'] == 1) {
                $content = '你已被举报，被举报内容：诽谤谩骂；被举报时间：2016-7-31；审核情况：情况属实；处理结果：给予警告一次；如有疑问请拨打客服电话023-68800997。';
            } elseif($data['type'] == 2) {
                $content = '你已被举报，被举报内容：淫秽色情；被举报时间：2015-8-12；审核情况：情况属实；处理结果：资料卡标记；如有疑问请拨打客服电话023-68800997。';
            } elseif($data['type'] == 3) {
                $content = '你已被举报，被举报内容：违法行为；被举报时间：2016-6-15；审核情况：情况属实；处理结果：永久封禁；如有疑问请拨打客服电话023-68800997。';
            }

            // 此处处理发送给被举报人


            // 是否发送给举报人
            if(isset($data['ret']) && $data['ret'] == 'on') {
                echo '感谢您对本站文明建设的支持，经查证情况属实，我们已对该账号做出相应处理';
            }
        } else {
            // 是否发送给举报人
            if (isset($data['ret']) && $data['ret'] == 'on') {
                echo '感谢您对本站文明建设的支持，但因证据不足，暂时不予处理';
            }
        }
        var_dump($this->post);
        exit;
        $id = Feedback::getInstance()->auth($id, $data['status']);
        if ($id>0){
            $this->renderAjax(['status'=>1 , 'message'=>'成功']);
        }else{
            $this->renderAjax(['status'=>0 , 'message'=>'失败']);
        }

    }
}