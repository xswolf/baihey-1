<?php
namespace wechat\controllers;

use common\models\Message;
use common\models\User;
use wechat\models\UserMessage;
use yii\web\Cookie;


/**
 * Message controller
 */
class MessageController extends BaseController
{

    public function init()
    {
        if(!$this->isLogin()) {
            return $this->redirect('/wap/user/login');
        }
    }

    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionIndex()
    {
        /*if(!$this->isLogin()) {
            return $this->redirect('/wap/user/login');
        }*/
        UserMessage::getInstance()->messageList($this->get);
        return $this->render();
    }

    public function actionChat()
    {
        if (!$this->isLogin()) {
//            $this->redirect("/wap/user/login");
        }

        $config = str_replace("\"", "'", json_encode(\Yii::$app->wechat->jsApiConfig([], false)));
        $this->assign('config', $config);
        $this->assign('id', \common\util\Cookie::getInstance()->getCookie('bhy_id'));
        return $this->render();
    }

    /**
     * 获取聊天消息
     */
    public function actionMessageHistory()
    {
        $sendId = \common\util\Cookie::getInstance()->getCookie('bhy_id');
        $list   = Message::getInstance()->getMessageHistory($sendId, \Yii::$app->request->get('id'));
        $this->renderAjax($list);
    }

    /**
     * 获取聊天列表
     */
    public function actionMessageList()
    {
        $list = UserMessage::getInstance()->messageList($this->get);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 获取最新别人发送给当前用户的聊天总数
     */
    public function actionGetMessageSum()
    {
        $list = UserMessage::getInstance()->messageSum();
        echo $list['sumSend'];
        //$this->renderAjax(['status=>1', 'data' => $list['sumSend']]);
    }

    /**
     * 修改聊天状态为已读
     */
    public function actionDel()
    {
        if (isset($this->get)) {
            $list = UserMessage::getInstance()->messageDel($this->get);
        } else {
            $list = 0;
        }
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 发送红包
     */
    public function actionSendBribery(){

        if (!$this->isLogin()) { // 未登录用户返回失败
            return $this->renderAjax(['status' => 0, 'message' => '用户未登录']);
        }
        $get = \Yii::$app->request->get();
        $sendId     = $get['sendId'];
        $receiveId  = $get['receiveId'];
        $money      = (float)$get['money'];
        $briMessage = isset($get['bri_message']) ? $get['bri_message'] : '';

        if (\common\util\Cookie::getInstance()->getCookie("bhy_id") != $sendId){
            // 非自己登陆的账号
            return $this->renderAjax(['status' => -1, 'message' => '非法请求']);
        }else if ($money<=0.01 || $money>200){
            // 发送金额不符合要求
            return $this->renderAjax(['status' => -2, 'message' => '非法请求']);
        }

        $userInfo = \wechat\models\User::getInstance()->getUserByName(\common\util\Cookie::getInstance()->getCookie( 'bhy_u_name' ));
        if ($userInfo['balance'] < $money){
            // 账户余额不够
            return $this->renderAjax(['status' => -3, 'message' => '余额不够']);
        }

        if ($id = UserMessage::getInstance()->sendBribery($sendId,$receiveId,$money,$briMessage)) {
            $this->renderAjax(['status' => 1, 'message' => $id]);
        } else {
            $this->renderAjax(['status' => 999, 'message' => '发送失败']);
        }


    }

}
