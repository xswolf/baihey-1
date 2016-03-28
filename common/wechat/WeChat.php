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
        var_dump(\Yii::$app);exit;
        $url = "https://api.weixin.qq.com/cgi-bin/get_current_autoreply_info?access_token=ACCESS_TOKEN";
        $html = file_get_contents($url);
        var_dump($html);
    }
}