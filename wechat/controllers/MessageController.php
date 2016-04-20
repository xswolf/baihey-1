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
