<?php
namespace common\charge;

use Yii;

/**
 * 订单类
 * Class ChargeOrder
 * @package common\models
 */
class ChargeOrder extends Base
{
    /**
     * @return string 返回该AR类关联的数据表名
     */
    public static function tableName()
    {
        return 'charge_order';
    }

    /**
     * 查询所有订单
     * @param string $status
     */
    public function getAllList($status = ''){
        $status = $status == "" ? 1 : $status;
        $this->findAll($status);
    }

    /**
     * 根据一个或多个条件查询一条记录
     * @param $condition
     */
    public function getOne($condition){
        $this->findOne($condition);
    }





}
