<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/6
 * Time: 19:48
 */

namespace common\models;


use yii\db\Query;

class AuthUser extends Base
{

    /**
     * 获取用户红娘
     * @param $where
     * @return array
     */
    public function getUserMatchmaker($where)
    {
        $arr = explode('-', $where['matchmaker']);
        $row = (new Query())->select('*')
            ->from(static::tableName())
            ->where(['in', 'id', $arr])
            ->all();

        return $row;
    }
}