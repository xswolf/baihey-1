<?php
namespace wechat\controllers;
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
            $this->redirect("/wap/user/login");
        }
        $this->assign('id' , \common\util\Cookie::getInstance()->getCookie('bhy_id'));
        return $this->render();
    }

    /**
     * 获取聊天消息
     */
    public function actionMessageHistory() {
        $sendId                   = \common\util\Cookie::getInstance()->getCookie( 'bhy_id' );
        $messageModel             = \wechat\models\Base::getInstance( "user_message" );
        $where['receive_user_id'] = $this->get['id'];
        $where['send_user_id']    = $sendId;

        $where                    = $messageModel->processWhere( $where );
        $where                   .= "or receive_user_id={$sendId} and send_user_id={$this->get['id']}";
        $list                     = $messageModel->Query()->where($where)->select('*')->all();
        $this->renderAjax($list);
    }

}
