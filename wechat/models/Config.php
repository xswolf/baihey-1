<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/13
 * Time: 15:57
 */

namespace wechat\models;

use yii\db\Query;
class Config  extends \common\models\Base
{

    public function getListByType($type)
    {
        $result = (new Query())->select(['*'])
            ->where(['type' => $type])
            ->from(static::tableName())
            ->all();
        return $result;
    }
}