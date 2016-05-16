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

    /**
     * 通过类型获取列表
     * @param $type
     * @return array
     */
    public function getListByType($type)
    {
        $result = (new Query())->select(['*'])
            ->where(['type' => $type])
            ->from(static::tableName())
            ->all();
        return $result;
    }

    /**
     * 通过id字符串返回数据列表
     * @param $strId id字符串"1,2,5"
     * @return array
     */
    public function getListById($strId)
    {
        $arrId = explode(',' ,$strId);
        $result = (new Query())->select(['*'])
            ->where(['in', 'id', $arrId])
            ->from(static::tableName())
            ->all();
        return $result;
    }
}