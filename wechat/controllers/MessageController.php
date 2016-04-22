<?php
namespace wechat\controllers;

use common\models\Message;
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
        $list = Message::getInstance()->getMessageHistory($sendId, $this->get['id']);
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
        if(isset($this->get)) {
            $list = UserMessage::getInstance()->messageDel($this->get);
        } else {
            $list = 0;
        }
        $this->renderAjax(['status=>1', 'data' => $list]);
    }
}
