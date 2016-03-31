<?php
namespace wechat\models;
use yii\db\Query;

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

    public function validate($attributeNames = null, $clearErrors = true)
    {

    }

    /**
     * 新增/注册用户
     * @param $data
     * @return bool
     * @throws \yii\db\Exception
     */
    public function addUser($data) {
        $db = \Yii::$app->db;
        $data['password'] = md5(md5($data['pass']));
        $row = $db->createCommand()
            ->insert($this->tableName(), $data)
            ->execute();
        $id = $this->db->getLastInsertID();
        if(!$row) {
            return false;
        }
        return $id;
    }

    /**
     * 通过用户名返回用户信息
     * @param $name
     * @return array|bool|null
     */
    public function getUserByName($name) {
        $row = (new Query())
            ->select('*')
            ->from($this->tableName())
            ->where(['username'=>$name])
            ->one();

        if(!$row) {
            return null;
        }
        return $row;
    }

}