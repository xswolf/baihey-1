<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/9
 * Time: 10:33
 */

namespace common\models;

use Yii;
class UserPhoto extends Base{

    /**
     * 新增相片
     * @param $user_id
     * @param $data array
     * @return bool
     * @throws \Exception
     */
    public function addPhoto($user_id, $data) {
        // 个人相册不得多于12张
        if(12 >= $this->find(['user_id' => $user_id])->count('id')) {
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
}