<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/7/25 0025
 * Time: 上午 9:17
 */

namespace common\models;


use yii\db\Query;

class PairLog extends Base
{


    public function getPairLog($userId){

        $list =  (new Query())->from($this->tablePrefix.'pair_log p')
            ->innerJoin($this->tablePrefix.'auth_user a' , 'p.admin_id = a.id')
            ->innerJoin($this->tablePrefix.'user_information info1' , 'p.from_user_id = info1.user_id')
            ->innerJoin($this->tablePrefix.'user_information info2' , 'p.to_user_id = info2.user_id')
            ->where(['from_user_id'=>$userId])
            ->select("p.id,info1.user_id as user_id1,info2.user_id as user_id2,a.name,p.create_time ,info1.info as info1,info2.info as info2,p.content,p.status")
            ->all();
        foreach($list as $k=>$v){
            $list[$k]['info1'] = json_decode($v['info1']);
            $list[$k]['info2'] = json_decode($v['info2']);
        }
        return $list;
    }
}