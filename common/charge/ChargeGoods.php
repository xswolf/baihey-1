<?php
namespace common\charge;

use Yii;

/**
 * 商品类
 * Class ChargeGoods
 * @package common\models
 */
class ChargeGoods extends Base
{

    /**
     * @return string 返回该AR类关联的数据表名
     */
    public static function tableName()
    {
        return 'charge_goods';
    }

    /**
     * 获取所有商品
     * @param string $status
     * @return static[]
     */
    public function getAllList($status = "")
    {
        $status = $status == "" ? 1 : $status;
        return $this->findAll(['status' => $status]);
    }

    /**
     * 根据一个或多个条件查询一条记录
     * @param $condition ID 或 数组
     * @return null|static
     */
    public function getOne($condition)
    {
        return $this->findOne($condition);
    }


    /**
     * 根据条件查询商品
     * @param $condition
     * @return static[]
     */
    public function getListByCondition($condition)
    {
        return $this->findAll($condition);
    }

}
