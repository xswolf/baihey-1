<?php

namespace common\message;
use yii\base\Component;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/31
 * Time: 16:54
 */
class Message extends Component{

    /**
     * 注册短信接口
     * @param $phone
     * @param $password
     * @return mixed
     */
    public function passwordMessage($phone, $password) {
        echo 111111111;exit;
        $nr = '您好，恭喜注册成功！您的初始密码为：'.$password.'，请及时前往个人中心修改您的密码。【嘉瑞百合缘】';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://www.106168.net/smsComputer/smsComputersend.asp?zh=cqjr&mm=55352177&hm='.$phone.'&nr='.$nr.'&dxlbid=15');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }
}