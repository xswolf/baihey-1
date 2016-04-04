<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/4
 * Time: 14:59
 */

namespace wechat\models;


class Base extends \yii\db\ActiveRecord{

    static $instance;

    /**
     * @return $this
     */
    public static function getInstance(){
        $class = get_called_class();

        if (!isset(self::$instance[$class])){
            self::$instance[$class]  = new  $class();
        }
        return self::$instance[$class];
    }
}