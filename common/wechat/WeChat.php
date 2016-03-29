<?php
namespace common\wechat;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/15
 * Time: 14:25
 */
class WeChat extends \callmez\wechat\sdk\Wechat{

    public function test(){
        echo 123;
    }

    public function getAccToken() {
        var_dump(\Yii::$app->wechat->getAccessToken);
        /*$accessToken = \Yii::$app->wechat->getAccessToken();
        var_dump($accessToken);*/exit;
        return $accessToken['access_token'];
    }

    public function aotures() {
        $token = $this->getAccToken();
        $url = "https://api.weixin.qq.com/cgi-bin/get_current_autoreply_info?access_token=$token";
        echo $url;
        $html = file_get_contents($url);
        var_dump($html);exit;
    }
}