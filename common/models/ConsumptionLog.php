<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/20
 * Time: 19:46
 */

namespace common\models;


use yii\db\Query;

class ConsumptionLog extends Base
{

    /**
     * 消费日志
     * @param $user_id
     * @param $data
     * @return int
     * @throws \yii\db\Exception
     */
    public function addConsumptionLog($user_id, $data)
    {
        $log['title'] = $data['name'];
        $log['user_id'] = $user_id;
        $log['receive_name'] = $data['receive_name'];
        $log['goods_id'] = isset($data['goods_id']) ? $data['goods_id'] : 0;
        $log['status'] = isset($data['status']) ? $data['status'] : 1;
        $log['type'] = $data['type'];
        $log['money'] = $data['price'];
        $log['create_time'] = YII_BEGIN_TIME;
        $row = $this->getDb()->createCommand()
            ->insert($this->tablePrefix.'user_consumption_log',$log)
            ->execute();
        return $row;
    }

    /**
     * 获取用户消费记录列表
     * @param $user_id
     * @return array
     */
    public function getUserConsumptionLogList($user_id)
    {
        $_consumption_log_table = $this->tablePrefix.'user_consumption_log';
        $result = (new Query())
            ->from($_consumption_log_table)
            ->where(['user_id' => $user_id])
            ->select('*')
            ->leftJoin("(SELECT DATE_FORMAT(FROM_UNIXTIME(`create_time`),'%Y-%m') AS months, SUM(`money`) AS `amount` FROM ".$_consumption_log_table." GROUP BY `months`) AS b", "DATE_FORMAT(FROM_UNIXTIME(`create_time`),'%Y-%m')=b.months")
            ->orderBy('b.months desc')
            ->all();
        //echo $result->createCommand()->getRawSql();exit;

        return $result;
    }
}