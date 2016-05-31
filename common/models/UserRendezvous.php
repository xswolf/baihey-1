<?php
namespace common\models;
use common\util\Cookie;
use common\util\Functions;
use yii\db\Query;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/22 0022
 * Time: 下午 2:07
 */
class UserRendezvous extends Base
{

    public static function tableName()
    {
        return \Yii::$app->db->tablePrefix."user_rendezvous";
    }

    /**
     * 发布约会
     * @param $data
     * @return bool
     */
    public function release($data)
    {
        if(isset($data['id']) && $row = $this->findOne($data['id'])) {
            $row->theme             = $data['theme'];
            $row->title             = $data['title'];
            $row->content           = $data['content'];
            $row->sex               = $data['sex'];
            $row->destination       = $data['destination'];
            $row->rendezvous_time   = is_numeric($data['rendezvous_time']) ? $data['rendezvous_time'] : 0;
            $row->fee_des           = $data['fee_des'];
            $row->we_want           = $data['we_want'];
            return $row->save();
        } else {
            $this->user_id       = Cookie::getInstance()->getCookie('bhy_id')->value;
            $this->create_time   = time();
            $this->theme             = $data['theme'];
            $this->title             = $data['title'];
            $this->content           = $data['content'];
            $this->sex               = $data['sex'];
            $this->destination       = $data['destination'];
            $this->rendezvous_time   = is_numeric($data['rendezvous_time']) ? $data['rendezvous_time'] : 0;
            $this->fee_des           = $data['fee_des'];
            $this->we_want           = $data['we_want'];
            return $this->save();
        }
    }

    /**
     * 查询约会列表
     * @param $where
     * @return array
     */
    public function lists($where){

        isset($where['user_id']) ? $condition['r.user_id'] = $where['user_id'] : $condition = $where;
        $pageNum = isset($where['pageNum']) ? $where['pageNum'] : 1;
        $pageSize = isset($where['pageSize']) ? $where['pageSize'] : 10;
        $offset = ($pageNum - 1) * $pageSize;
        $obj = (new Query())
            ->from($this->tablePrefix.'user_rendezvous r')
            ->innerJoin($this->tablePrefix.'user_information i', "i.user_id=r.user_id")
            ->leftJoin('(SELECT rendezvous_id,COUNT(id) count FROM '.$this->tablePrefix.'user_rendezvous_apply GROUP BY rendezvous_id) a', "a.rendezvous_id=r.id")
            ->select("*")
            ->orderBy('r.status asc, r.create_time desc')
            ->offset($offset)
            ->limit($pageSize);
        if (is_array($condition) && count($condition)>0){
            $obj->where($condition);
        }
        // 时间查询处理
        if(isset($where['date'])) {
            $arr = Functions::getInstance()->getTimeByMonth($where['date']);
            $obj->andWhere(['between', 'r.create_time', $arr[0], $arr[1]]);
        }
        $obj->andWhere(['in', 'r.status', [1,2,3]]);
        //echo $obj->createCommand()->getRawSql();exit;
        return $obj->all();
    }

    /**
     * 修改状态
     * @param $data['id','status']
     * @return bool
     */
    public function updateStatus($data)
    {
        $rendezvous = $this->findOne($data['id']);
        $rendezvous->status = $data['status'];
        return $rendezvous->save(false);
    }

    /**
     * 获取约会信息
     * @param $where
     * @return array|bool
     */
    public function getRendezvousInfo($where)
    {
        $obj = (new Query())
            ->from(static::tableName())
            ->select('*')
            ->where($where)
            ->one();
        return $obj;
    }

    /**
     * 我的约会申请人列表
     * @param $id
     * @return array
     */
    public function rendezvousApplyList($id)
    {
        $_user = $this->tablePrefix.'user';
        $_user_information = $this->tablePrefix.'user_information';
        $_user_rendezvous_apply = $this->tablePrefix.'user_rendezvous_apply';
        $obj = (new Query())
            ->from($_user_information.' i')
            ->select('*,a.phone mobile')
            ->leftJoin("$_user u", "u.id=i.user_id")
            ->leftJoin("$_user_rendezvous_apply a", "a.user_id=i.user_id")
            ->where(['a.rendezvous_id' => $id])
            ->orderBy('a.create_time desc')
            ->all();
        return $obj;
    }

    /**
     * 修改状态
     * @param $data['id','status']
     * @return bool
     */
    public function updateApplyStatus($data)
    {
        $apply = Base::getInstance('user_rendezvous_apply')->findOne($data['id']);
        $apply->status = $data['status'];
        return $apply->save(false);
    }

    /**
     * 我参与的约会列表
     * @param $where
     * @return array
     */
    public function applyLists($where){

        isset($where['user_id']) ? $condition['a.user_id'] = $where['user_id'] : $condition = $where;
        $pageNum = isset($where['pageNum']) ? $where['pageNum'] : 1;
        $pageSize = isset($where['pageSize']) ? $where['pageSize'] : 10;
        $offset = ($pageNum - 1) * $pageSize;
        $obj = (new Query())
            ->from($this->tablePrefix.'user_rendezvous_apply a')
            ->innerJoin(static::tableName().' r', "a.rendezvous_id=r.id")
            ->innerJoin($this->tablePrefix.'user_information i', "i.user_id=r.user_id")
            ->innerJoin($this->tablePrefix.'user u', "u.id=i.user_id")
            ->select("*,a.id apply_id,a.status apply_status")
            ->orderBy('r.status asc, r.create_time desc')
            ->offset($offset)
            ->limit($pageSize);
        if (is_array($condition) && count($condition)>0){
            $obj->where($condition);
        }
        // 时间查询处理
        if(isset($where['date'])) {
            $arr = Functions::getInstance()->getTimeByMonth($where['date']);
            $obj->andWhere(['between', 'r.create_time', $arr[0], $arr[1]]);
        }
        $obj->andWhere(['in', 'r.status', [1,2,3]]);
        //echo $obj->createCommand()->getRawSql();exit;
        return $obj->all();
    }

    /**
     * 删除约会申请
     * @param $data
     * @return false|int
     * @throws \Exception
     */
    public function deleteApply($data)
    {
        $apply = Base::getInstance('user_rendezvous_apply')->findOne($data['id']);
        return $apply->delete();
    }
}
