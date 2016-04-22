<?php
namespace common\models;

use Yii;
use yii\db\Query;

class User extends Base
{
    public $tablePrefix;

    public function init() {
        $this->tablePrefix = Yii::$app->db->tablePrefix;
    }

    /**
     * @return string 返回该AR类关联的数据表名
     */
    public static function tableName()
    {
        return 'user';
    }

    public function getUserById($id){
        $userTable = $this->tablePrefix.$this->tableName();
        $userInformationTable = $this->tablePrefix.'user_information';
        $row = (new Query)
            ->select('*')
            ->from($userTable)
            ->leftJoin($this->tablePrefix.'user_information',"$userTable.id = ".$userInformationTable.'user_id')
            ->where(['id' => $id])
            ->one();

        if ($row === false) {
            return null;
        }
        return $row;
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
