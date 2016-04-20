<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/20
 * Time: 16:10
 */

namespace common\util;

use wechat\models\Area;

class AutoAddress
{
    static $instance;

    /**
     * @return $this
     */
    public static function getInstance()
    {
        $class = get_called_class();
        if (!isset(self::$instance[$class])) {
            $obj = new $class;
            self::$instance[$class] = $obj;
        }
        return self::$instance[$class];
    }

    /**
     * 自动获取地区并存储cookie
     */
    public function autoAddress()
    {
        $html = Curl::getInstance()->curl_get('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=' . $_SERVER['REMOTE_ADDR'], '');
        if ($html != -2) {
            $jsonData = explode("=", $html);
            $jsonAddress = substr($jsonData[1], 0, -1);
            $jsonAddress = json_decode($jsonAddress);
            $city = $jsonAddress->city;
            if ($info = Area::getInstance()->getCityByName($city)) {
                // 浏览器使用地区cookie
                setcookie('bhy_u_city', json_encode($info['name']), YII_BEGIN_TIME + 3600 * 24 * 30, '/wap');
                setcookie('bhy_u_cityId', $info['id'], YII_BEGIN_TIME + 3600 * 24 * 30, '/wap');
                setcookie('bhy_u_cityPid', $info['parentId'], YII_BEGIN_TIME + 3600 * 24 * 30, '/wap');
            }
        }
    }
}