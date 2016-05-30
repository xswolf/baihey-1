<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/27
 * Time: 17:41
 */

namespace common\util;


class Functions {

    static $instance;

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
     * 返回本月时间戳段
     * @param $date
     * @return array
     */
    public function getTimeByMonth($date)
    {
        $arr = explode('-', $date);
        $startTime = strtotime($date);// 当前月起始时间戳
        if($arr[1] == 12) {
            $arr[0] = $arr[0] + 1;
            $arr[1] = 1;
        } else {
            $arr[1] = $arr[1] + 1;
        }
        $endTime = strtotime($arr[0].'-'.$arr[1]) -1;// 当前月结束时间戳
        return [$startTime, $endTime];
    }
}