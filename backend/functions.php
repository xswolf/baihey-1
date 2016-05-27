<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/26 0026
 * Time: 上午 10:42
 */

// 根据时间戳获取年龄
function getAge($timeStamp){

    $timeStamp = (int) $timeStamp;
    if (empty($timeStamp) && $timeStamp<1000) return;
    $birthday = date('Y-m-d' , $timeStamp);

    list($year,$month,$day) = explode("-",$birthday);
    $year_diff = date("Y") - $year;
    $month_diff = date("m") - $month;
    $day_diff  = date("d") - $day;
    if ($day_diff < 0 || $month_diff < 0)
        $year_diff--;
    return $year_diff;
    return 1;
}

function getSex($sex){
    return $sex == 1 ? '男' : '女';
}