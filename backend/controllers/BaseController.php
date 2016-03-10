<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/18
 * Time: 16:09
 */

namespace backend\controllers;

use yii\web\Controller;


class BaseController extends Controller
{

    public $enableCsrfValidation = false;

    public function auth($userId, $name)
    {


    }

    public function beforeAction($action)
    {
        if (!$this->isLogin()) {
            return $this->redirect("/admin/user/login");
        }
        return parent::beforeAction($action); // TODO: Change the autogenerated stub
    }

    /**
     * 判断是否登录
     * @return bool
     */
    public function isLogin()
    {

        return true;
    }

    /**
     * 成功跳转
     * @param $message
     * @param string $url
     * @return \yii\web\Response
     */
    public function __success($message, $url = "")
    {
        setcookie("alert_message", json_encode(['status' => 1, 'message' => $message]));
        if ($url == "") {
            $url = $_SERVER['HTTP_REFERER'];
        }
        return $this->redirect($url);
    }

    public function __error($message, $url = "")
    {
        setcookie("alert_message", json_encode(['status' => 0, 'message' => $message]));
        if ($url == "") {
            $url = $_SERVER['HTTP_REFERER'];
        }
        return $this->redirect($url);
    }


    public function render( $view='' , $params = [ ] ) {
        if ($view == '') $view = \Yii::$app->controller->action->id;
        $view = $view . ".html";
        return parent::render( $view , $params );
    }
}