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

    public function getAccessToken() {
        $appid = \Yii::$app->wechat->appId;
        $secret = \Yii::$app->wechat->appSecret;
        $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$secret";
        $html = file_get_contents($url);
        $accessToken = json_decode($html,true);
        return $accessToken['access_token'];
    }

    public function aotures() {
        $token = $this->getAccessToken();
        $url = "https://api.weixin.qq.com/cgi-bin/get_current_autoreply_info?access_token=$token";
        echo $url;
        $html = file_get_contents($url);
        var_dump($html);exit;
    }
}