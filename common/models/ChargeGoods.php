<?php
namespace common\models;

use Yii;
use yii\db\Query;

/**
 * 商品类
 * Class ChargeGoods
 * @package common\models
 */
class ChargeGoods extends Base
{

    /**
     * 获取所有商品
     * @param $where
     * @return array
     */
    public function getAllList($where = [])
    {
        return (new Query())->from($this->tablePrefix.'charge_goods')
                     ->select('*')
                     ->where($where)
                     ->all();
    }

    /**
     * 查询一条记录
     * @param $id ID
     * @return null|static
     */
    public function getOne($id)
    {
        return (new Query())->from($this->tablePrefix.'charge_goods')
                            ->where('id='.$id)
                            ->select('*')
                            ->one();
    }

    /**
     * 新增goods
     * @param $data
     * @return int
     * @throws \yii\db\Exception
     */
    public function addGoods($data)
    {
        $row = $this->getDb()->createCommand()
            ->insert($this->tablePrefix.'charge_goods', $data)
            ->execute();

        return $row;
    }

    /**
     * 修改goods
     * @param $id
     * @param $data
     * @return int
     * @throws \yii\db\Exception
     */
    public function editGoods($id, $data)
    {
        $row = $this->getDb()->createCommand()
            ->update($this->tablePrefix.'charge_goods', $data, ['id' => $id])
            ->execute();

        return $row;
    }
}
