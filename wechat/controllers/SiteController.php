<?php
namespace wechat\controllers;


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
        return $this->render();
//        $user = new User();
//        $user->login('a','b');
    }


}
