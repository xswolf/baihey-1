<?php
namespace wechat\controllers;

use common\util\Cookie;


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
    public function actionIndex()
    {
        $cc = Cookie::getInstance()->getCookie('bhy_u_name');
        return $this->render();
    }



}
