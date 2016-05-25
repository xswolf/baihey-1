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
     * @param string $status
     * @return static[]
     */
    public function getAllList($status = "")
    {
        $status = $status == "" ? 1 : $status;
        return (new Query())->from($this->tablePrefix.'charge_goods')
                     ->select('*')
                     ->where('status='.$status)
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

}
