<?php
namespace common\models;

use common\util\Cookie;
use Yii;
use yii\db\Query;

class Cash extends Base
{


    public function lists( $status = 2){

        $handle = (new Query())->from($this->tablePrefix.'cash cash')
            ->innerJoin($this->tablePrefix.'cash_card card' , 'cash.cash_card_id=card.id')
            ->select("cash.*, card.user_name,card.card_no,card.name")
            ->where(['status' => $status]);

        return $handle->all();
    }

    /**
     * 确认打款
     * @param $id
     * @return bool
     */
    public function confirm($id){

        return \Yii::$app->db->createCommand()
            ->update($this->tablePrefix.'cash' , ['status' => 1] , ['id' => $id])
            ->execute();
    }

}
