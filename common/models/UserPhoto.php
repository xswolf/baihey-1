<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/9
 * Time: 10:33
 */

namespace common\models;

use Yii;
use yii\db\Query;

class UserPhoto extends Base
{

    /**
     * 新增相片
     * @param $user_id
     * @param $data array
     * @return bool
     * @throws \Exception
     */
    public function addPhoto($user_id, $data)
    {
        // 个人相册不得多于12张
        if (12 >= $this->find()->where(['user_id' => $user_id])->count('id')) {
            $this->user_id = $user_id;
            $this->pic_path = $data['pic_path'];
            $this->thumb_path = $data['thumb_path'];
            $this->create_time = $data['time'];
            $this->update_time = $data['time'];
            $this->insert(false);
            return $this->getDb()->getLastInsertID();
        } else {
            return false;
        }
    }

    /**
     * 获取相册列表
     * @param $user_id
     * @return $this|array
     */
    public function getPhotoList($user_id)
    {
        $result = (new Query())->select(['*'])
            ->where(['user_id' => $user_id])
            ->from(static::tableName())
            ->orderBy('is_head desc, update_time asc')
            ->limit(12);

        $result = $result->all();
        return $result;
    }

    /**
     * 删除相片
     * @param $where
     * @return int
     */
    public function delPhoto($where)
    {
        $row = $this->deleteAll(['id' => $where['id']]);
        return $row;
    }

    /**
     * 设置头像
     * @param $user_id
     * @param $where
     * @return int
     */
    public function setHeadPic($user_id, $where) {
        $this->updateAll(['is_head' => 0],['user_id' => $user_id, 'is_head' => 1]);
        $row = $this->updateAll(['is_head' => 1],['id' => $where['id']]);
        return $row;
    }
}