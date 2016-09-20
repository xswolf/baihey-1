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
     * @param $head_pic
     * @return bool
     * @throws \Exception
     */
    public function addPhoto($user_id, $data, $head_pic = '')
    {
        // 个人相册不得多于12张
        $type = isset($data['type']) ? $data['type'] : 1;
        $sum = $this->find()->where(['user_id' => $user_id, 'type' => $type])->count('id');
        $count = isset($data['type']) ? 2 : 12;
        if ($count >= $sum) {
            $data['user_id'] = $user_id;
            $data['create_time'] = $data['time'];
            $data['update_time'] = $data['time'];
            unset($data['time']);
            if (!empty($head_pic)) {
                $data['is_head'] = 1;
                UserInformation::getInstance()->updateUserInfo($user_id, ['head_pic' => $data['thumb_path']]);
            }
            $this->getDb()->createCommand()
                ->insert($this->tablePrefix . 'user_photo', $data)
                ->execute();
            if (isset($data['type']) && ($data['type'] == 2 || $data['type'] == 3)) {
                $this->getDb()->createCommand()
                    ->update($this->tablePrefix . 'user_information', ['has_identify' => 1], ['user_id' => $user_id])
                    ->execute();
            }

            return $this->getDb()->getLastInsertID();
        } else {
            return false;
        }
    }

    public function addPhotoComment($data)
    {
        $this->getDb()->createCommand()
            ->insert($this->tablePrefix . 'user_photo', $data)
            ->execute();
    }

    /**
     * 获取相册列表
     * @param $user_id
     * @param int $type
     * @param int $pageSize
     * @return $this|array
     */
    public function getPhotoList($user_id, $type = 1, $pageSize = 12, $check = '')
    {
        if ($type == 23) {
            $where = ['and', 'user_id=' . $user_id, ['in', 'type', [2, 3]]];
        } elseif ($type == 0) {
            $where = ['user_id' => $user_id];
        } else {
            $where = ['user_id' => $user_id, 'type' => $type];
        }
        $result = (new Query())->select(['*'])
            ->where($where)
            ->from($this->tablePrefix . 'user_photo')
            ->orderBy('is_head desc, update_time asc')
            ->limit($pageSize);
        $result = $result->all();
        return $result;
    }

    /**
     * 保存图片(目前用于诚信认证)
     * @param $where |array二维数组
     * @return bool
     * @throws \yii\db\Exception
     */
    public function savePhoto($where, $user_id, $photoType, $headPic = '')
    {
        // 删除原有身份证
        if ($photoType == 23) {
            $this->getDb()->createCommand("delete from {$this->tablePrefix}user_photo where user_id={$user_id} and (type=2 or type=3)")
                ->execute();
        } else {
            $this->getDb()->createCommand()
                ->delete($this->tablePrefix . 'user_photo', ['user_id' => $user_id, 'type' => $photoType])
                ->execute();
        }
        $time = time();
        $ist = false;
        foreach ($where as $k => $v) {
            // 新增
            $data = [
                'user_id' => $user_id,
                'pic_path' => $v['pic_path'],
                'thumb_path' => $v['thumb_path'],
                'create_time' => $time,
                'update_time' => $time,
                'is_head' => 0,
                'type' => $v['type']
            ];
            if (isset($v['is_check'])) {
                $data['is_check'] = $v['is_check'];
            }
            if (!empty($headPic) && $headPic == $data['thumb_path']) {
                $data['is_head'] = 1;
                UserInformation::getInstance()->updateUserInfo($user_id, ['head_pic' => $data['thumb_path']]);
            }
            if ($v['type'] == 2 || $v['type'] == 3) {
                $this->getDb()->createCommand()
                    ->update($this->tablePrefix . 'user_information', ['has_identify' => 1], ['user_id' => $user_id])
                    ->execute();
            }
            $ist = $this->getDb()->createCommand()
                ->insert($this->tablePrefix . 'user_photo', $data)
                ->execute();
        }
        return $ist;
    }

    /**
     * 删除相片
     * @param $where
     * @param $userId
     * @return int
     */
    public function delPhoto($where, $userId)
    {
        $photo = $this->findOne($where);
        // 删除旧图片
        $thumb_path = __DIR__ . "/../.." . $photo->thumb_path;
        if (is_file($thumb_path) && unlink($thumb_path)) {
            $pic_path = str_replace('thumb', 'picture', $thumb_path);
            unlink($pic_path);
        }

        // 删除数据
        $_user_information_table = $this->tablePrefix . 'user_information';
        if ($photo->is_head == 1) {
            $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.head_pic','') WHERE user_id={$userId}";
            $this->getDb()->createCommand($sql)->execute();
        }
        $row = $this->deleteAll(['id' => $where['id']]);
        return $row;
    }

    /**
     * 设置头像
     * @param $user_id
     * @param $where
     * @return int
     */
    public function setHeadPic($user_id, $where)
    {
        //var_dump($where);exit;
        $this->getDb()->createCommand()
            ->update($this->tablePrefix . 'user_photo', ['is_head' => 0], ['user_id' => $user_id, 'is_head' => 1])
            ->execute();
        $row = $this->getDb()->createCommand()
            ->update($this->tablePrefix . 'user_photo', ['is_head' => 1], ['id' => $where['id']])
            ->execute();
        return $row ? UserInformation::getInstance()->updateUserInfo($user_id, ['head_pic' => $where['thumb_path']]) : false;
    }

    /**
     * 获取用户上传的照片
     * @param int $isCheck 2：未审核 1：审核通过 0：不通过
     * @param int $type 1:照片 2：身份证，3：学历证 ， 4：离婚证 5房产证
     * @return array
     */
    public function lists($isCheck = 2, $type = 1)
    {
        $type = $type == 2 ? [2, 3] : $type;
        $handle = (new Query())->from($this->tablePrefix . 'user_photo u')
            ->innerJoin($this->tablePrefix . 'user_information i', 'u.user_id=i.user_id')
            ->where(['is_check' => $isCheck, 'type' => $type])
            ->limit(1000)
            ->orderBy("u.create_time")
            ->select(['u.id', 'u.user_id', 'u.type', 'u.thumb_path', 'u.create_time', 'is_check', 'is_head', "json_extract(i.info , '$.real_name') as real_name"]);
        if ($isCheck != '') {
            $handle->andWhere(['is_check' => $isCheck]);
        }
        //echo $handle->createCommand()->getRawSql();exit;
        return $handle->all();
    }

    /**
     * 审核照片
     * @param $id
     * @param $status
     * @return int
     * @throws \yii\db\Exception
     */
    public function auth($id, $status)
    {
        $ids = explode(",", $id);

        $handle = $this->getDb()->createCommand()
            ->update($this->tablePrefix . 'user_photo', ['is_check' => $status], ['id' => $ids]);
        $r = $handle->execute();
        return $r;
    }

    public function userHeadpic($user_id)
    {
        $result = (new Query())
            ->select('*')
            ->from($this->tablePrefix . 'user_photo')
            ->where(['user_id' => $user_id, 'is_head' => 1, 'type' => 1])
            ->one();
        return $result;
    }
}