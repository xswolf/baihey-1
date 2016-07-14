<?php
namespace wechat\controllers;

use common\util\Cookie;
use wechat\models\User;


/**
 * Site controller
 */
class SiteController extends BaseController
{

    /**
     * 错误处理
     */
    public function actionError()
    {
        if($error=\Yii::$app->errorHandler)
        {
            return $this->render([],'error');
        }
    }

    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionMain()
    {
        if($user_id = Cookie::getInstance()->getCookie('bhy_id')) {
            $user = User::getInstance()->findOne(['id' => $user_id]);
        } else {
            $user = $this->weChatMember();
            /*if (!isset($_COOKIE["bhy_u_name"]) && $user && $user['status'] < 3) {
                // 登录日志
                \common\models\User::getInstance()->loginLog($user['id']);
                // 设置登录cookie
                Cookie::getInstance()->setLoginCookie($user);
            } elseif (isset($_COOKIE["bhy_u_name"]) && $user && $user['status'] > 2) {
                // 删除登录cookie
                Cookie::getInstance()->delLoginCookie();
            }*/
        }

        if($user['status'] > 2) {
            Cookie::getInstance()->delLoginCookie();
            if($user['wx_id']) {
                setcookie('wx_login', false, time() + 3600 * 24 * 30, '/wap');
            }
        }
        return $this->render();
    }

    public function actionIndex()
    {
       echo "<script>";
        echo "window.location.href='/wap/site/main#/index'";
       echo "</script>";
    }

    /**
     * 首页列表页
     */
    public function actionUserList(){
        $list = User::getInstance()->userList($this->get);
        $this->renderAjax(['status' => 1, 'data'=>$list] );
    }




}
