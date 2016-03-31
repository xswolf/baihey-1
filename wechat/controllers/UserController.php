<?php
namespace wechat\controllers;

/**
 * 登录 控制层
 * Class ChargeController
 * @package wechat\controllers
 */
class UserController extends BaseController{

    public function beforeAction($action)
    {
        $this->layout = false;
        return parent::beforeAction($action);
    }

    public function actionLogin(){
        return $this->render();
    }

    public function actionWelcome(){
        return $this->render();
    }

    public function actionRegister(){
        return $this->render();
    }


}