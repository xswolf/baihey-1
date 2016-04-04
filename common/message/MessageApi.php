<?php

namespace common\message;
use yii\base\Component;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/31
 * Time: 16:54
 */
class MessageApi extends Component{

    /**
     * 发送初始密码短信
     * @param $phone
     * @param $password
     * @return mixed
     */
    public function passwordMsg($phone, $password) {
        $nr = '您好，恭喜注册成功！您的初始密码为：'.$password.'，请及时前往个人中心修改您的密码。【嘉瑞百合缘】';
        $nr = mb_convert_encoding($nr, "GB2312", "UTF-8");
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://www.106168.net/smsComputer/smsComputersend.asp?zh=cqjr&mm=55352177&hm='.$phone.'&nr='.$nr.'&dxlbid=15');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }

    public function sendCode($phone){
        $code = '333333';
        \Yii::$app->session->set('reg_code',$code);
        return true;
        $code = rand(100000,999999);
        $nr = '您好，本次验证码为：'.$code.'。【嘉瑞百合缘】';
        \Yii::$app->session->set('reg_code',$code);
        $nr = mb_convert_encoding($nr, "GB2312", "UTF-8");
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://www.106168.net/smsComputer/smsComputersend.asp?zh=cqjrhj&mm=666666&hm='.$phone.'&nr='.$nr.'&dxlbid=19');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $output = curl_exec($ch);
        curl_close($ch);
        if($output == '0'){
           return true;
        }
        return false;
    }

    public function validataCode($code){
        if(\Yii::$app->session->get('reg_code') && intval($code) == intval(\Yii::$app->session->get('reg_code'))){
            \Yii::$app->session->remove('reg_code');
            return true;
        }
        return false;
    }
}