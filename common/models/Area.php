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
     * 通过id字符串返回数据列表
     * @param $strId id字符串"1,2,5"
     * @return array
     */
    public function getTravelListById($strId)
    {
        $arrId = explode(',' ,$strId);
        $result = (new Query())->select(['*'])
            ->where(['in', 'id', $arrId])
            ->from(static::tableName())
            ->all();
        return $result;
    }

    /**
     * 去过的地方列表（type=2,3）
     * @return array
     */
    public function getWentTravelList($type = [2,3])
    {

        $result = (new Query())->select(['*'])
            ->where(['in', 'type', $type])
            ->from(static::tableName())
//            ->offset(($page-1)*10)
//            ->limit(10)
            ->all();
        return $result;
    }

    /**
     * 获取想去的地方列表（type=1）
     * @return array
     */
    public function getWantTravelList($province_id , $page = 1)
    {
        $result['local'] = (new Query())->select(['*'])
            ->where(['type' => 1, 'parentId' => $province_id])
            ->from(static::tableName())
//            ->offset(($page-1)*10)
//            ->limit(10)
            ->all();

        $result['province'] = (new Query())->select(['*'])
            ->where(['type' => 1])
            ->andWhere(['not in', 'parentId', [$province_id, 3635]])
            ->from(static::tableName())
//            ->offset(($page-1)*10)
//            ->limit(10)
            ->all();

        $result['foreign'] = (new Query())->select(['*'])
            ->where(['type' => 1, 'parentId' => 3635])
            ->from(static::tableName())
//            ->offset(($page-1)*10)
//            ->limit(10)
            ->all();

        return $result;
    }
}