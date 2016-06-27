<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/27
 * Time: 18:07
 */

namespace common\models;


class Feedback extends Base
{
    public function addFeedback($user_id, $data)
    {
        $data['user_id'] = $user_id;
        $data['creat_time'] = time();
        $row = $this->getDb()->createCommand()
            ->insert(static::tableName(), $data)
            ->execute();
        return $row;
    }
}