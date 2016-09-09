<?php
namespace wechat\controllers;

use common\util\Cookie;
use wechat\models\User;

session_start();
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

    public function actionHref(){
        // 微信按钮带code放到session里面，以便主动登陆
        $_SESSION['code'] = \Yii::$app->request->get( 'code' );
        echo '<script>';
        echo 'location.href="http://wechat.baihey.com/wap/site/main#/index"';
        echo '</script>';
        exit;
    }

    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionMain()
    {
        // 判断是否微信跳转过来
        if (isset($_SESSION['code'])){
            $_GET['code'] = $_SESSION['code'];
            $_SESSION['code'] = null;
        }

        $result = User::getInstance()->indexIsShowData(Cookie::getInstance()->getCookie('bhy_id'));

        setcookie('indexIsShowData' , json_encode($result));

        if($user_id = Cookie::getInstance()->getCookie('bhy_id') && !isset($_GET['code'])) {
            $user = User::getInstance()->getUserById($user_id);
        } else {
            $user = $this->weChatMember();
        }

        if($user['status'] > 2) {
            Cookie::getInstance()->delLoginCookie();
            if($user['wx_id']) {
                setcookie('wx_login', 'out', time() + 3600 * 24 * 30, '/wap');
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
