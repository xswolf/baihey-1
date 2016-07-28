<?php
namespace common\models;

use common\util\Cookie;
use Yii;
use yii\db\Query;

class Cash extends Base
{


    public function lists($where = []){

        $handle = (new Query())->from($this->tablePrefix.'cash cash')
            ->innerJoin($this->tablePrefix.'cash_card card' , 'cash.cash_card_id=card.id')
            ->innerJoin($this->tablePrefix . 'user u', 'cash.user_id = u.id')
            ->leftJoin($this->tablePrefix . 'auth_user au', 'cash.admin_id = au.id')
            ->select("cash.*, card.user_name,card.card_no,card.name, au.name as admin_name");
            //->where(['status' => $status]);
        if (count($where) > 0) {
            foreach ($where as $v) {
                $handle->andWhere($v);
            }
        }
        return $handle->all();
    }

    /**
     * 确认打款
     * @param $id
     * @return bool
     */
    public function confirm($id){
        $admin = Yii::$app->session->get(USER_SESSION);
        $data['admin_id'] = $admin['id'];
        $data['end_time'] = time();
        $data['status'] = 1;
        return \Yii::$app->db->createCommand()
            ->update($this->tablePrefix.'cash' , $data , ['id' => $id])
            ->execute();
    }

}
