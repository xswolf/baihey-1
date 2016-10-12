<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/10/12 0012
 * Time: 下午 4:38
 */

namespace common\models;


use yii\db\Query;

class UserActive extends Base
{
    public function findRecord($wx_id){

        return (new Query())->from($this->tablePrefix.'user_active')
            ->where(['wx_id' => $wx_id])
            ->select("*")
            ->one();
    }


    /**
     * 随机红包
     * @return int
     */
    protected function RandMoney(){

        $odo = rand(1,10);
        if ($odo > 2){
            return rand(100,500);
        }else{
            return rand(501,1000);
        }
    }

    /**
     * 发送红包
     */
    public function sendMoney($wx_id){

        if (!$this->findRecord($wx_id)){
            $data['wx_id'] = $wx_id;
            $data['money'] = $this->randMoney();
            \Yii::$app->db->createCommand()
                ->insert($this->tablePrefix."user_active", $data)
                ->execute();

            $args = [
                'order_id'=> \Yii::$app->db->lastInsertID,
                'openid'=> $wx_id,
                'total_amount'=>$data['money']
            ];

            return \Yii::$app->wechat->sendPack($args);
        }else{
            return false;
        }
    }
}