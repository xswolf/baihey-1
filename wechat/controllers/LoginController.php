<?php
namespace wechat\controllers;

/**
 * 登录 控制层
 * Class ChargeController
 * @package wechat\controllers
 */
class LoginController extends BaseController{

    public function beforeAction($action)
    {
        $this->layout = false;
        return parent::beforeAction($action);
    }

    public function actionIndex(){
        return $this->render();
    }

    public function actionWelcome(){
        return $this->render();
    }

    public function actionRegister(){
        return $this->render();
    }


}