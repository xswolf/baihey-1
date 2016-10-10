<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/7/7 0007
 * Time: 上午 11:29
 */

namespace console\controllers;

use yii\console\Controller;
use yii\db\Query;

class ConsoleController extends Controller
{

    /**
     * 更新年龄  1月一次
     * @throws \yii\db\Exception
     */
    public function actionUpdateAge()
    {

        $m = date('n');
        $y = date('Y');

        $sql = "UPDATE bhy_user_information

SET age = IF ({$m} - DATE_FORMAT(DATE_ADD(FROM_UNIXTIME(0), INTERVAL json_extract(info,'$.age')+0 SECOND) , '%m') < 0 ,

                {$y} - DATE_FORMAT(DATE_ADD(FROM_UNIXTIME(0), INTERVAL json_extract(info,'$.age')+0 SECOND) , '%Y') -1 ,

                {$y} - DATE_FORMAT(DATE_ADD(FROM_UNIXTIME(0), INTERVAL json_extract(info,'$.age')+0 SECOND) , '%Y'))

                 WHERE json_extract(info,'$.age')  != fase AND json_extract(info,'$.age') != '' ";


        if (\Yii::$app->db->createCommand($sql)->execute()) {
            echo 'age is update';
        }

    }

    public function actionSendNews(){
        $db = \Yii::$app->db;
        $list = (new Query())->from($db->tablePrefix."user_message m")
            ->innerJoin($db->tablePrefix."user u" , "u.id=m.receive_user_id")
            ->where(["m.status" => 2 , "u.login_type" => 3 , "u.id"=>10000])
            ->select("u.wx_id")
            ->groupBy("u.id")
            ->all();

        foreach ($list as $v){
            $result = \Yii::$app->wechat->sendText($v['wx_id'] , "有会员给你发送消息，<a href='http://wechat.baihey.com/wap'>请查收</a>");
            var_dump($result);
        }

    }
}