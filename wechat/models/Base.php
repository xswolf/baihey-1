<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/4
 * Time: 14:59
 */

namespace wechat\models;


use yii\db\Query;

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
     *$where = [
        'type'=>1,
        'name'=>['!=' =>'12'],
        'id'=>['in'=>['1',2,3]],
        'age'=>['>'=>12],
        'age1'=>['<'=>12],
        'age2'=>['>='=>12],
        'age3'=>['<='=>12],
        'age4'=>['between'=>[12,15]],
        'or'=>[
            'type'=>1,
            'name'=>['!=' =>'12'],
            'id'=>['in'=>['1',2,3]],
            'age'=>['>'=>12],
            'age1'=>['<'=>12],
            'age2'=>['>='=>12],
            'age3'=>['<='=>12],
            'age4'=>['between'=>[12,15]],
        ]
    ];
     * @param $where Array
     * @return $where String
     */
    public function processWhere($where , $str = 'and'){

        if (!is_array($where)){
            return $where;
        }
        $sqlWhere='';
        foreach ($where as $k=>$v){
            if (!is_array($v)){
                $sqlWhere .= " {$k} = '{$v}'  {$str} ";
            }else{

                if ($k == 'or'){
                    $res = $this->processWhere($v ,'or');
                    $sqlWhere .= ' (' . $res . ")";

                }else {

                    foreach ( $v as $subK => $subV ) {

                        switch ( $subK ) {
                            case '!=':
                                $sqlWhere .= " {$k} != '{$subV}'  {$str} ";
                                break;

                            case 'in':
                                $sqlWhere .= " {$k}  in (" . implode( "," , $subV ) . ")  {$str} ";
                                break;

                            case 'between':

                                $sqlWhere .= " {$k} between " . "'$subV[0]'" . ' and ' . "'$subV[1]'" . "  {$str} ";
                                break;

                            case 'or' :

                                break;

                            default:

                                $sqlWhere .= " {$k} {$subK} '{$subV}'  {$str} ";
                                break;

                        }

                    }
                }
            }
        }
        $lastPos = strrpos($sqlWhere , $str);
        $len = strlen($sqlWhere);

        if ($len - $lastPos <= 5){
            $sqlWhere = substr($sqlWhere , 0,$lastPos);
        }

        return $sqlWhere;
    }

    public function Query(){
        return (new Query())->from(\Yii::$app->db->tablePrefix.self::$_table);
    }


}