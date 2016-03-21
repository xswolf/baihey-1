<?php
namespace common\models;

use Yii;

class ChargeGoods extends Base
{

    /**
     * @return string 返回该AR类关联的数据表名
     */
    public static function tableName()
    {
        return 'ChargeGoods';
    }

    /**
     * 获取所有 status=1 的商品数据
     * @return static[]
     */
    public function getAllList()
    {
        return $this->findAll(['status' => 1]);
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
