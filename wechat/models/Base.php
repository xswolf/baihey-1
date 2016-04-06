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
    static $_table = false;


    public static function tableName(){
        if (self::$_table){
            return \Yii::$app->getDb()->tablePrefix.self::$_table;
        }
        parent::tableName();
    }

    /**
     * @param $tableName
     * @return $this
     */
    public static function getInstance($tableName = ""){

        if ($tableName != "") self::$_table = $tableName;
        $class = get_called_class();

        if (!isset(self::$instance[$class])){
            self::$instance[$class.$tableName]  = new  $class();
        }
        return self::$instance[$class.$tableName];
    }




}