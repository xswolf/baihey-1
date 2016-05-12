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
     * 更新用户数据（目前用于资料子页面）
     * @param $user_id
     * @param $data array
     * @return bool
     */
    public function updateUserInfo($user_id, $data)
    {
        $row = false;
        if ($data && $this->findOne($user_id)) {
            $_user_information_table = static::tableName();// 表名

            switch (key($data)) {
                case 'personalized':// 个性签名
                    $sql = "UPDATE {$_user_information_table} SET personalized = {$data['personalized']} WHERE user_id={$user_id}";
                    break;

                case 'occupation':// 职业
                    $arr = explode('-', $data['occupation']);
                    $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.occupation','".$arr[0]."'), info = JSON_REPLACE(info,'$.children_occupation','".$arr[1]."') WHERE user_id={$user_id}";
                    break;

                case 'address':// 地区
                    $arr = explode('-', $data['address']);
                    $arr[2] = $arr[2] ? $arr[2] : 0;
                    $arr[1] = $arr[1] ? $arr[1] : 0;
                    $sql = "UPDATE {$_user_information_table} SET province = {$arr[0]}, city = {$arr[1]}, area = {$arr[2]},info = JSON_REPLACE(info,'$.local','".$arr[3]."')  WHERE user_id={$user_id}";
                    break;

                case 'age':// 年龄
                    $arr = explode('-', $data['age']);
                    $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.age','".$arr[0]."'), info = JSON_REPLACE(info,'$.zodiac','".$arr[1]."'), info = JSON_REPLACE(info,'$.constellation','".$arr[2]."') WHERE user_id={$user_id}";
                    break;

                default:
                    $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.".key($data)."','".$data[key($data)]."') WHERE user_id={$user_id}";
                    break;
            }

            $row = $this->getDb()->createCommand($sql)->execute();
        }

        return $row;
    }
}