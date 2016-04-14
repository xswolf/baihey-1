<?php
namespace wechat\controllers;
use common\models\Message;
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

        return $this->render();
    }

    public function actionChat()
    {
        //$this->layout = false;
        if (!$this->isLogin()){
//            $this->redirect("/wap/user/login");
        }
        $this->assign('id' , \common\util\Cookie::getInstance()->getCookie('bhy_id'));
        return $this->render();
    }

    /**
     * 获取聊天消息
     */
    public function actionMessageHistory() {
        $sendId  = \common\util\Cookie::getInstance()->getCookie( 'bhy_id' );
        $list    = Message::getInstance()->getMessageHistory($sendId , $this->get['id']);
        $this->renderAjax($list);
    }

}
