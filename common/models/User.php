<?php
namespace common\models;

use Yii;

class User extends Base
{
    /**
     * @return string 返回该AR类关联的数据表名
     */
    public static function tableName()
    {
        return 'user';
    }

    public function getUserById($id){

    }

    public function addUser($userInfo){

    }

    public function delUser($id){

    }

    public function editUser($userInfo){

    }

    public function getUserByPhone($tel){

    }
}
