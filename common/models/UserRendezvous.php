<?php
namespace common\models;
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
        $this->theme           = $data['theme'];
        $this->title           = $data['title'];
        $this->content         = $data['content'];
        $this->sex             = $data['sex'];
        $this->destination     = $data['destination'];
        $this->create_time     = time();
        $this->rendezvous_time = $data['rendezvous_time'];
        $this->fee_des         = $data['fee_des'];
        $this->we_want         = $data['we_want'];
        $this->user_id         = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        return $this->save();
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
            ->offset($offset)
            ->limit($pageSize);
        if (is_array($condition) && count($condition)>0){
            $obj->where($condition);
        }
        // 时间查询处理
        if(isset($where['date'])) {
            $arr = Functions::getInstance()->getTimeByMonth($where['date']);
            $obj->andWhere(['between', 'create_time', $arr[0], $arr[1]]);
        }
        //echo $obj->createCommand()->getRawSql();exit;
        return $obj->all();

    }

}
