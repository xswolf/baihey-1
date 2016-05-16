<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/13
 * Time: 14:49
 */

namespace common\models;

use Yii;
use yii\db\Query;
class Area extends Base
{

    /**
     * 获取想去和去过的地方列表（type=1）
     * @return array
     */
    public function getAreaTravelList()
    {
        $result = (new Query())->select(['*'])
            ->where(['type' => 1])
            ->from(static::tableName())
            ->all();
        return $result;
    }
}