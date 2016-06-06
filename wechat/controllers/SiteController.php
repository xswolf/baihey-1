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
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionMain()
    {
        return $this->render();
    }

    public function actionIndex()
    {
        echo 12312;exit;
       echo "<script>";
        echo "location.href='/wap/site/main#/main/index'";
       echo "</script>";
    }

    /**
     * 首页列表页
     */
    public function actionUserList(){
        $list = User::getInstance()->userList($this->get);
        $this->renderAjax(['status=>1' , 'data'=>$list] );
    }




}
