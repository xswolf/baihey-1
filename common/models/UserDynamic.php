<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/30
 * Time: 10:49
 */

namespace common\models;


use yii\db\Query;

class UserDynamic extends Base
{

    /**
     * 发布动态
     * @param $data
     * @return bool
     */
    public function addDynamic($user_id, $data)
    {
        $data['user_id'] = $user_id;
        $data['pic'] = isset($data['pic']) ? $data['pic'] : '';
        if(!isset($data['content'])) {
            return false;
        }
        $data['address'] = isset($data['address']) ? $data['address'] : '';
        $data['create_time'] = time();
        $row = $this->getDb()->createCommand()
            ->insert($this->tablePrefix.'user_dynamic', $data)
            ->execute();

        return $this->getDb()->lastInsertID;
    }

    /**
     * 获取个人发布动态
     * @param $uid
     * @param $limit
     * @param $page
     * @return array
     */
    public function getDynamicList($uid, $page = 0, $limit = 5 , $loginUserId = -1)
    {
        $loginUserId = $loginUserId == -1 ? \common\util\Cookie::getInstance()->getCookie('bhy_id')->value : $loginUserId;
        $offset      = $page * $limit;
        $obj         = (new Query())
            ->from($this->tablePrefix . "user_dynamic d")
            ->innerJoin($this->tablePrefix . 'user_information i', 'd.user_id=i.user_id')
            ->innerJoin($this->tablePrefix . 'user u', 'd.user_id=u.id')
            ->leftJoin($this->tablePrefix . 'feedback f', 'f.feedback_id = d.id AND f.type = 2 AND f.status = 1')
            ->leftJoin($this->tablePrefix . 'user_click c', 'c.dynamic_id = d.id AND c.user_id =' . $loginUserId)
            ->leftJoin($this->tablePrefix . 'user_photo p', 'p.user_id = d.user_id AND p.is_head = 1 AND p.user_id =' . $loginUserId)
            ->limit($limit)
            ->offset($offset)
            ->select(["d.*", "u.phone", "i.honesty_value", "i.report_flag", "json_extract(i.info , '$.level') AS level", "json_extract(i.info , '$.head_pic') AS head_pic", "json_extract(i.info , '$.real_name') AS real_name", "json_extract(i.info , '$.age') AS age",'u.sex', 'p.thumb_path AS thumb_path', 'p.is_check AS head_status', "c.id as cid", "f.id as fid"])
            ->orderBy("f.id desc ,d.create_time desc");
        if ($uid > 0) {
            return $obj->where(['u.id' => $uid, 'd.status' => 1])->all();
        } else {
            return $obj->where(['d.status' => 1])->all();
        }
    }

    /**
     * 根据动态ID获取动态内容
     * @param $id
     * @return array
     */
    public function getDynamicById($id)
    {
        $loginUserId = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        return (new Query())
            ->from($this->tablePrefix . "user_dynamic d")
            ->innerJoin($this->tablePrefix . 'user_information i', 'd.user_id=i.user_id')
            ->innerJoin($this->tablePrefix . 'user u', 'd.user_id=u.id')
            ->leftJoin($this->tablePrefix . 'user_click c', 'c.dynamic_id = d.id AND c.user_id=' . $loginUserId)
            ->leftJoin($this->tablePrefix . 'user_photo p', 'p.user_id = d.user_id AND p.is_head = 1 AND p.user_id =' . $loginUserId)
            ->where(['d.id' => $id])
            ->select(["d.*", "u.phone", "i.honesty_value", "i.report_flag", "json_extract(i.info , '$.level') AS level", "json_extract(i.info , '$.head_pic') AS head_pic", "json_extract(i.info , '$.real_name') AS real_name", "json_extract(i.info , '$.age') AS age",'u.sex', 'p.thumb_path AS thumb_path', 'p.is_check AS head_status', "c.id as cid"])
            ->orderBy("d.create_time desc")
            ->one();
    }

    public function editDynamic($user_id, $id, $data)
    {
        $data['user_id'] = $user_id;
        $row = $this->getDb()->createCommand()
            ->update($this->tablePrefix.'user_dynamic', $data, ['id' => $id, 'user_id' => $user_id])
            ->execute();

        return $row;
    }

}