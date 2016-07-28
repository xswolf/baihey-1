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
        $data['create_time'] = time();
        $row = $this->getDb()->createCommand()
            ->insert($this->tablePrefix.'feedback', $data)
            ->execute();
        return $row;
    }

    public function lists($where = [], $orWhere = []){
        $row = (new Query())->from($this->tablePrefix . 'feedback f')
            ->innerJoin($this->tablePrefix . 'user u', 'f.user_id = u.id')
            ->innerJoin($this->tablePrefix . 'user uf', 'f.feedback_id = uf.id')
            ->select("f.*");
        if (count($orWhere) > 0) {
            foreach ($orWhere as $v) {
                $row->orWhere($v);
            }
        }
        $row->andWhere($where);
        //echo $row->createCommand()->getRawSql();exit;
        return $row->all();
    }

    public function auth($id , $status){

        return \Yii::$app->db->createCommand()
            ->update($this->tablePrefix.'feedback',['status'=>$status] , ['id'=>$id])
            ->execute();
    }
}