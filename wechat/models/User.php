<?php
namespace wechat\models;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/10
 * Time: 10:21
 */
class User extends \yii\db\ActiveRecord{

    protected $user;

    /**
     * @return string 返回该AR类关联的数据表名
     */
    public static function tableName()
    {
        return 'bhy_user';
    }

    /**
     * @param $username
     * @param $password
     *
     * @return bool
     */
    public function login($username,$password){

        $condition = [];
        if ($user = $this->findOne($condition)){
            return $user;
        }

        return false;
    }


}