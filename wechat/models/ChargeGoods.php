<?php
namespace wechat\models;

use common\models\Base;
use common\util\Cookie;
use yii\db\Query;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/18
 * Time: 16:58
 */
class ChargeGoods extends \common\models\Base
{
    public function getList()
    {
        return (new Query())
            ->select(['*'])
            ->where(['status' => 1])
            ->from(static::tableName())
            ->all();
    }

    public function getById($id)
    {
        if (isset($id)) {
            $row = (new Query())
                ->select(['*'])
                ->where(['id' => $id])
                ->from(static::tableName())
                ->one();
            return $row;
        } else {
            return false;
        }
    }
}