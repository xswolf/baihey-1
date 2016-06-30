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
     * @param $type follow关注列表，followed被关注列表，black拉黑列表，blacked被拉黑列表
     * @param $user_id
     * @param $where
     * @return $this|array
     */
    public function getFollowList($type, $user_id, $where = [])
    {
        $infoTable  = $this->getDb()->tablePrefix . $this->_user_information_table;
        $userTable  = $this->getDb()->tablePrefix . $this->_user_table;
        $pageSize   = isset($where['pageSize']) ? $where['pageSize'] : 20;
        $pageNum    = isset($where['pageNum']) ? $where['pageNum'] : 1;
        $offset     = ($pageNum - 1) * $pageSize;
        if($type == 'follow') {// 关注
            $condition = ['f.user_id' => $user_id, 'status' => 1];
            $join = 'f.follow_id = i.user_id';
        } elseif($type == 'followed') {// 被关注
            $condition = ['follow_id' => $user_id, 'status' => 1];
            $join = 'f.user_id = i.user_id';
        } elseif($type == 'black') {// 黑名单
            $condition = ['f.user_id' => $user_id, 'status' => 0];
            $join = 'f.follow_id = i.user_id';
        } elseif($type == 'blacked') {// 被拉黑名单
            $condition = ['f.follow_id' => $user_id, 'status' => 0];
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

//        echo $result->createCommand()->getRawSql();
        $result = $result->all();
        return $result;
    }

    /**
     * 获取关注我的总数
     * @param $type
     * @param $user_id
     * @return int|string
     */
    public function getSumFollow($type, $user_id)
    {
        if($type == 'follow') {// 关注
            $condition = ['user_id' => $user_id, 'status' => 1];
        } elseif($type == 'followed') {// 被关注
            $condition = ['follow_id' => $user_id, 'status' => 1];
        } elseif($type == 'black') {// 黑名单
            $condition = ['user_id' => $user_id, 'status' => 0];
        }
        return $this->find()->where($condition)->count('id');
    }

    /**
     * 获取关注状态
     * @param $where ['user_id','follow_id']
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
     * @param $where ['user_id','follow_id']
     * @return bool
     * @throws \Exception
     */
    public function addFollow($where)
    {
        // 查看对方是否拉黑
        if($status = $this->getFollowStatus(['user_id' => $where['follow_id'], 'follow_id' => $where['user_id'], 'status' => 0])) {
            return false;
        }
        if($follow = $this->findOne($where)) {
            $follow->status = 1;
            $follow->update_time = YII_BEGIN_TIME;
            return $follow->save(false);
        } else {
            $time = YII_BEGIN_TIME;
            $this->user_id = $where['user_id'];
            $this->follow_id = $where['follow_id'];
            $this->create_time = $time;
            $this->update_time = $time;
            $this->status = 1;
            return $this->insert(false);
        }

    }

    /**
     * 取消关注
     * @param $where ['user_id','follow_id']
     * @return bool
     * @throws \Exception
     */
    public function delFollow($where)
    {
        $follow = $this->findOne($where);
        $follow->status = 2;
        $follow->update_time = YII_BEGIN_TIME;
        return $follow->save(false);
    }

    /**
     * 拉黑
     * @param $where ['user_id','follow_id']
     * @return bool
     * @throws \Exception
     */
    public function blackFollow($where)
    {
        if(!$follow = $this->findOne($where)) {
            $follow = $this;
            $follow->user_id = $where['user_id'];
            $follow->follow_id = $where['follow_id'];
            $follow->create_time = YII_BEGIN_TIME;
        }
        $follow->update_time = YII_BEGIN_TIME;
        $follow->status = 0;
        $row = $follow->save(false);
        // 删除对方关注
        if($followed = $this->findOne(['user_id' => $where['follow_id'], 'follow_id' => $where['user_id']])) {
            $followed->update_time = YII_BEGIN_TIME;
            $followed->status = 3;
            $followed->save(false);
        }
        return $row;
    }

    /**
     * 取消拉黑
     * @param $where ['user_id','follow_id']
     * @return bool
     */
    public function delBlack($where)
    {
        $follow = $this->findOne($where);
        $follow->status = 3;
        $follow->update_time = YII_BEGIN_TIME;
        return $follow->save(false);
    }

}