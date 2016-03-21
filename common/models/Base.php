<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/21
 * Time: 14:18
 */

namespace common\models;


use yii\db\ActiveRecord;

class Base extends ActiveRecord{

    protected static $instance;

    /**
     * @return mixed
     */
    public static function instance(){
        $callClass = get_called_class();
        if (!isset(self::$instance[$callClass])){
            $obj = new $callClass();
            self::$instance[$callClass] = $obj;
        }
        return self::$instance[$callClass];

    }
}