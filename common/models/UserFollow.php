<?php
namespace common\models;


use Yii;
use yii\db\Query;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/27
 * Time: 15:00
 */
class UserFollow extends Base
{

    /**
     * 获取关注我的总数
     * @return array|bool
     */
    public function getSumFollow($user_id)
    {
        $condition = [
            'follow_id' => $user_id,
            'status'    => 1
        ];
        $row = (new Query())
            ->select(['count(id) sumFollow'])
            ->where($condition)
            ->from(static::tableName())
            ->one();
        return $row;
    }

    /**
     * 获取关注状态
     * @param $where
     * @return array|bool
     */
    public function getFollowStatus($where)
    {
        $row = (new Query())
            ->select(['status'])
            ->where($where)
            ->from(static::tableName())
            ->one();
        return $row;
    }

    /**
     * 新增关注
     * @param $where
     * @return bool
     * @throws \Exception
     */
    public function addFollow($where)
    {
        if(!$this->getFollowStatus($where)) {
            $follow = $this->getInstance();
            $follow->user_id = $where['user_id'];
            $follow->follow_id = $where['follow_id'];
            $follow->time = YII_BEGIN_TIME;
            $follow->status = 1;
            return $follow->insert(false);
        } else {
            return false;
        }

    }

}