<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/27
 * Time: 18:07
 */

namespace common\models;


use yii\db\Query;

class Feedback extends Base
{
    // 新增举报
    public function addFeedback($user_id, $data)
    {
        $data['user_id'] = $user_id;
        $data['creat_time'] = time();
        $row = $this->getDb()->createCommand()
            ->insert(static::tableName(), $data)
            ->execute();
        return $row;
    }

    public function lists($status){
        return  (new Query())->from($this->tablePrefix . 'feedback')
            ->where(['status'=>$status])
            ->select("*")
            ->all();
    }

    public function auth($id , $status){

        return \Yii::$app->db->createCommand()
            ->update($this->tablePrefix.'feedback',['status'=>$status] , ['id'=>$id])
            ->execute();
    }
}