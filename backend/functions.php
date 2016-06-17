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
//    $month_diff = date("m") - $month;
//    $day_diff  = date("d") - $day;
//    if ($day_diff < 0 || $month_diff < 0)
//        $year_diff--;
    return $year_diff;
}

function getSex($sex){
    return $sex == 1 ? '男' : '女';
}

function getMarriage($marriage){
    if ($marriage == 1){
        return '未婚';
    }elseif ($marriage == 2){
        return '离异';

    }elseif ($marriage ==3){
        return '丧偶';
    }else{
        return '未婚';
    }
}

//{id: 1, name: '初中'},
//{id: 2, name: '高中'},
//{id: 3, name: '大专'},
//{id: 4, name: '本科'},
//{id: 5, name: '硕士'},
//{id: 6, name: '博士及以上'}
function getEducation($e){
    switch ($e){
        case 1 :
            return '初中';
        case 2 :
            return '高中';

        case 3 :
            return '大专';

        case 4 :
            return '本科';

        case 5 :
            return '硕士';

        case 6 :
            return '博士及以上';

    }

}

function getLevel($l){
    switch ($l) {
        case 1 :
            return 'VIP';
        case 2 :
            return '贵宾';
        case 3 :
            return '钻石';
    }
}

function getIsNot($s){
    $value = $s == 0 ? '否' : '是';
    return $value;
}

function getTitleByOrderListStatus($status){
    $title = $status == 0 ? '待付款' : '<span class="text-danger">成功</span>';
    return $title;
}

function getTitleByOrderListValue($value){
    $title = $value == 0 ? '' : '('.$value.'个月)';
    return $title;
}

function getName($name){
    return str_replace("\"" , "" , $name);
}

function getPathByThumb($thumb){
    return str_replace('thumb','picture',$thumb);
}