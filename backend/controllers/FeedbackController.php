<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/29 0029
 * Time: 上午 10:32
 */

namespace backend\controllers;


use common\models\Feedback;
use common\models\User;
use common\models\UserInformation;
use wechat\models\UserMessage;

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
        $data = $this->post;
        if($data['status'] != 3) {
            $date = date('Y-m-d', $data['vo']['create_time']);
            if($data['type'] == 1) {
                $msg['message'] = '你已被举报，被举报内容：'.$data['vo']['content'].'；被举报时间：'.$date.'；审核情况：情况属实；处理结果：给予警告一次；如有疑问请拨打客服电话023-68800997。';
            } elseif($data['type'] == 2) {
                UserInformation::getInstance()->updateUserInfo($data['vo']['feedback_id'], ['report_flag' => 1]);
                $msg['message'] = '你已被举报，被举报内容：'.$data['vo']['content'].'；被举报时间：'.$date.'；审核情况：情况属实；处理结果：资料卡标记；如有疑问请拨打客服电话023-68800997。';
            } elseif($data['type'] == 3) {
                UserInformation::getInstance()->updateUserInfo($data['vo']['feedback_id'], ['report_flag' => 1]);
                User::getInstance()->editUserTableInfo($data['vo']['feedback_id'], ['status' => 3]);
                $msg['message'] = '你已被举报，被举报内容：'.$data['vo']['content'].'；被举报时间：'.$date.'；审核情况：情况属实；处理结果：永久封禁；如有疑问请拨打客服电话023-68800997。';
            }

            // 此处处理发送给被举报人
            $msg['send_user_id'] = isset($_SESSION[USER_SESSION]['member']) ? $_SESSION[USER_SESSION]['member']['id'] : 1;
            $msg['receive_user_id'] = $data['vo']['feedback_id'];
            UserMessage::getInstance()->addMessage($msg);

            // 是否发送给举报人
            if(isset($data['ret']) && $data['ret'] == 'on') {
                $retMsg['send_user_id'] = isset($_SESSION[USER_SESSION]['member']) ? $_SESSION[USER_SESSION]['member']['id'] : 1;
                $retMsg['receive_user_id'] = $data['vo']['user_id'];
                $retMsg['message'] = '感谢您对本网站文明建设的支持，经查证情况属实，我们已对该账号做出相应处理';
                UserMessage::getInstance()->addMessage($retMsg);
            }
        } else {
            // 是否发送给举报人
            if (isset($data['ret']) && $data['ret'] == 'on') {
                $retMsg['send_user_id'] = isset($_SESSION[USER_SESSION]['member']) ? $_SESSION[USER_SESSION]['member']['id'] : 1;
                $retMsg['receive_user_id'] = $data['vo']['user_id'];
                $retMsg['message'] = '感谢您对本网站文明建设的支持，但因证据不足，暂时不予处理';
                UserMessage::getInstance()->addMessage($retMsg);
            }
        }

        if (Feedback::getInstance()->auth($data['id'], $data['status'])){
            $this->renderAjax(['status'=>1 , 'message'=>'成功']);
        }else{
            $this->renderAjax(['status'=>0 , 'message'=>'失败']);
        }

    }
}