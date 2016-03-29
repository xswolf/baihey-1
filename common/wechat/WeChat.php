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

    public function aotures() {
        $token = $this->getAccessToken();
        $url = "https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=$token";
        echo $url;
        $html = file_get_contents($url);
        var_dump($html);exit;
    }
}