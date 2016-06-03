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
    public function autoAddress($cityName)
    {
        $cityName = str_replace("市", "", $cityName);
        if ($info = Area::getInstance()->getCityByName($cityName)) {
            // 浏览器使用地区cookie
            setcookie('bhy_u_city', json_encode($info['name']), YII_BEGIN_TIME + 3600 * 24 * 30, '/wap');
            setcookie('bhy_u_cityId', $info['id'], YII_BEGIN_TIME + 3600 * 24 * 30, '/wap');
            setcookie('bhy_u_cityPid', $info['parentId'], YII_BEGIN_TIME + 3600 * 24 * 30, '/wap');
        }

    }
}