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

        return parent::tableName();
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


    /**
     *
     * @param $where Array
     * @return $where String
     */
    public function processWhere($where){
        $where = [
               'type'=>1,
               'name'=>['!=' =>'name'],
                'id'=>['in'=>['1',2,3]],
                'age'=>['>',12],
                'age1'=>['<',12],
                'age2'=>['>=',12],
                'age3'=>['<=',12],
                'age3'=>['between',[12,15]],
              ];

        return $where;
    }


}