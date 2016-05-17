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

    protected $_user_information_table = 'user_information';
    protected $_user_table = 'user';

    /**
     * 根据类型$type获取关注列表或被关注列表
     * @param $type follow关注列表，followed被关注列表
     * @param $user_id
     * @param $where
     * @return $this|array
     */
    public function getFollowList($type, $user_id, $where)
    {
        $infoTable  = $this->getDb()->tablePrefix . $this->_user_information_table;
        $userTable  = $this->getDb()->tablePrefix . $this->_user_table;
        $pageSize   = isset($where['pageSize']) ? $where['pageSize'] : 6;
        $pageNum    = isset($where['pageNum']) ? $where['pageNum'] : 1;
        $offset     = ($pageNum - 1) * $pageSize;
        if($type == 'follow') {
            $condition = ['user_id' => $user_id, 'status' => 1];
            $join = 'f.follow_id = i.user_id';
        } else {
            $condition = ['follow_id' => $user_id, 'status' => 1];
            $join = 'f.user_id = i.user_id';
        }
        $result = (new Query())->select(['f.*', 'u.id other', 'u.sex', 'i.*'])
            ->where($condition)
            ->from(static::tableName() . ' f')
            ->innerJoin($infoTable . ' i', $join)
            ->innerJoin($userTable . ' u', 'i.user_id = u.id')
            ->orderBy('create_time desc')
            ->limit($pageSize)
            ->offset($offset);

        //echo $result->createCommand()->getRawSql();
        $result = $result->all();
        return $result;
    }

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
        if(isset($where['user_id'])) {
            $row = (new Query())
                ->select(['status'])
                ->where($where)
                ->from(static::tableName())
                ->one();
            return $row;
        } else {
            return false;
        }
    }

    /**
     * 新增关注
     * @param $where
     * @return bool
     * @throws \Exception
     */
    public function addFollow($where)
    {
        if(!$this->findOne($where)) {
            $this->user_id = $where['user_id'];
            $this->follow_id = $where['follow_id'];
            $this->create_time = YII_BEGIN_TIME;
            $this->status = 1;
            return $this->insert(false);
        } else {
            return false;
        }

    }

    /**
     * 取消关注
     * @param $where
     * @return bool
     * @throws \Exception
     */
    public function delFollow($where)
    {
        $follow = $this->findOne($where);
        var_dump($follow);exit;
        $follow->status = 2;
        return $follow->save(false);
    }

    /**
     * 拉黑
     * @param $where
     * @return bool
     * @throws \Exception
     */
    public function blackFollow($where)
    {
        $follow = $this->findOne($where);
        $follow->status = 0;
        return $follow->save(false);
    }

}