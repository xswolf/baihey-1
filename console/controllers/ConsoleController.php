<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/7/7 0007
 * Time: 上午 11:29
 */

namespace console\controllers;


use yii\console\Controller;

class ConsoleController extends Controller
{

    /**
     * 更新年龄  1月一次
     * @throws \yii\db\Exception
     */
    public function actionUpdateAge(){

        $m = date('n');
        $y = date('Y');

        $sql = "UPDATE bhy_user_information

SET age = IF ({$m} - DATE_FORMAT(DATE_ADD(FROM_UNIXTIME(0), INTERVAL json_extract(info,'$.age')+0 SECOND) , '%m') < 0 ,

                {$y} - DATE_FORMAT(DATE_ADD(FROM_UNIXTIME(0), INTERVAL json_extract(info,'$.age')+0 SECOND) , '%Y') -1 ,

                {$y} - DATE_FORMAT(DATE_ADD(FROM_UNIXTIME(0), INTERVAL json_extract(info,'$.age')+0 SECOND) , '%Y')) ";

        if (\Yii::$app->db->createCommand($sql)->execute()) {
            echo 'age is update';
        }


    }
}