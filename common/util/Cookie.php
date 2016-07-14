<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/5
 * Time: 14:09
 */

namespace common\util;


class Cookie {

    static $instance;

    /**
     * @return $this
     */
    public static function getInstance(){
        $class = get_called_class();
        if (!isset(self::$instance[$class])){
            $obj = new $class;
            self::$instance[$class] = $obj;
        }
        return self::$instance[$class];
    }

    public function setCookie($name , $value){
        $cookies = \Yii::$app->response->cookies;
        $cookies->add( new \yii\web\Cookie( [
            'name'   => $name ,
            'value'  => $value ,
            'expire' => time() + 30 * 24 * 3600
        ] ) );
        return true;
    }

    public function getCookie($name){
        $cookies = \Yii::$app->request->cookies;
        return $cookies->get($name);
    }

    public function delCookie($name){
        $cookies = \Yii::$app->response->cookies;

        $cookies->remove($name);
        return true;
    }

    public function checkCookie($name){
        $cookies = Yii::$app->request->cookies;

        if (isset($cookies[$name])){
            return true;
        }
        return false;
    }

    /**
     * 设置登录cookie
     * @param $user
     */
    public function setLoginCookie($user) {
        $this->setCookie('bhy_u_name', $user['username']);
        $this->setCookie('bhy_id', $user['id']);
        setcookie('bhy_user_id', $user['id'], time() + 3600 * 24 * 30, '/wap');
        setcookie('bhy_u_sex', $user['sex'], time() + 3600 * 24 * 30, '/wap');
    }

    /**
     * 删除登录cookie
     */
    public function delLoginCookie() {
        $this->delCookie('bhy_u_name');
        $this->delCookie('bhy_id');
        setcookie('bhy_user_id', '', time() - 3600 * 24 * 30, '/wap');
        setcookie('bhy_u_sex', '', time() - 3600 * 24 * 30, '/wap');
    }
}