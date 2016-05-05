<?php
namespace common\models;

use Yii;
use yii\db\Query;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/29
 * Time: 16:22
 */
class UserInformation extends Base
{

    /**
     * 保存数据（目前用于资料子页面）
     * @param $user_id
     * @param $where
     * @return bool
     */
    public function saveData($user_id, $where)
    {
        $row = false;
        if ($where && $this->findOne($user_id)) {

            switch (key($where)) {
                case 'personalized':
                    if($this->updateAll(['personalized' => $where['personalized']], ['user_id' => $user_id])) {
                        $row = true;
                    }
                    break;

                case 'occupation':
                    $_user_information_table = static::tableName();
                    $arr = explode('-', $where['occupation']);
                    $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.occupation','".$arr[0]."'), info = JSON_REPLACE(info,'$.children_occupation','".$arr[1]."') WHERE user_id={$user_id}";
                    if($this->getDb()->createCommand($sql)->query()){
                        $row = true;
                    }
                    break;

                default:
                    $_user_information_table = static::tableName();
                    $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.".key($where)."','".$where[key($where)]."') WHERE user_id={$user_id}";
                    if($this->getDb()->createCommand($sql)->query()){
                        $row = true;
                    }
                    break;
            }
        }

        return $row;

    }
}