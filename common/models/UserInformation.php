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
                case 'personalized'     :// 个性签名
                case 'went_travel'      :// 去过的地方
                case 'want_travel'      :// 想去的地方
                case 'love_sport'       :// 喜欢的运动
                case 'want_film'        :// 想看的电影
                case 'like_food'        :// 喜欢的美食
                case 'privacy_pic'      :// 照片权限
                case 'privacy_per'      :// 动态权限
                case 'privacy_wechat'   :// 微信显示
                case 'privacy_qq'       :// QQ显示
                    $sql = "UPDATE {$_user_information_table} SET ".key($data)." = '".$data[key($data)]."' WHERE user_id={$user_id}";
                    break;

                case 'auth':// 诚信认证
                    $arr = explode('_', $data['auth'], 3);
                    $sql = "UPDATE {$_user_information_table} SET auth = JSON_REPLACE(auth,'$.".$arr[0].'_'.$arr[1]."','".$arr[2]."'), auth = JSON_REPLACE(auth,'$.".$arr[0].'_time'."','".YII_BEGIN_TIME."'), auth = JSON_REPLACE(auth,'$.".$arr[0].'_check'."','".false."') WHERE user_id={$user_id}";
                    break;

                case 'identity':// 身份证认证
                    $arr = explode('_', $data['identity']);
                    $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.".'real_name'."','".$arr[0]."'), info = JSON_REPLACE(info,'$.".'identity_id'."','".$arr[1]."'), info = JSON_REPLACE(info,'$.".'identity_address'."','".$arr[2]."') WHERE user_id={$user_id}";
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
                    $arr[0] = (int)$arr[0];
                    $arr[1] = (int)$arr[1];
                    $arr[2] = (int)$arr[2];
                    $arr[3] = (int)$arr[3];
                    $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.age','".$arr[0]."'), info = JSON_REPLACE(info,'$.zodiac','".$arr[1]."'), info = JSON_REPLACE(info,'$.constellation','".$arr[2]."'), age = {$arr[3]} WHERE user_id={$user_id}";
                    break;

                default:
                    $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.".key($data)."','".$data[key($data)]."') WHERE user_id={$user_id}";
                    break;
            }

            $row = $this->getDb()->createCommand($sql)->execute();
        }

        return $row;
    }

    public function getAuthImgPath($user_id, $name)
    {
        $select = "json_extract(auth,'$.".$name."') $name";
        $row = (new Query())
            ->select([$select])
            ->from(static::tableName())
            ->where(['user_id' => $user_id]);
        //echo $row->createCommand()->getRawSql();exit;
        $row = $row->one();

        if (!$row) {
            return null;
        }
        return $row;
    }
}