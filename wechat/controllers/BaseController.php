<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/10
 * Time: 10:16
 */

namespace wechat\controllers;


use yii\web\Controller;

class BaseController extends Controller{

    public function beforeAction(  ) {

    }

    /**
     * 用户是否登录
     */
    public function isLogin(){

        $cookie = $this->getCookie(\Yii::$app->params['cookieName']);

        return $cookie;
    }

    /**
     * 获取cookie
     * @param $cookieName
     *
     * @return mixed
     */
    public function getCookie($cookieName){

        return $_COOKIE[$cookieName];
    }
}