<?php
namespace wechat\models;

use yii\db\Query;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/10
 * Time: 10:21
 */
class User extends Base
{

    protected $user;


    /**
     * @param $username
     * @param $password
     *
     * @return bool
     */
    public function login($username, $password)
    {

        $condition = [
            'username' => $username,
            'password' => md5(md5($password))
        ];
        if ($user = $this->findOne($condition)) {
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
    public function addUser($data)
    {

        $db = \Yii::$app->db;
        $data['password'] = md5(md5($data['password']));

        // user表 数据写入
        $row = $db->createCommand()
            ->insert($this->tableName(), $data)
            ->execute();

        // 获取uid
        $id = $this->db->getLastInsertID();
        if (!$row) {
            return false;
        }

        // user_information表 数据处理
        $infoData['user_id'] = $id;
        $userInfo = [
            'real_name'     => '未知',
            'identity_id'   => '未知',
            'age'           => '未知',
            'height'        => '未知',
            'level'         => '未知',
            'is_marriage'   => '未知',
        ];
        $infoData['info'] = json_encode($userInfo);

        // user_information表 数据写入
        $db->createCommand()
            ->insert('bhy_user_information', $infoData)
            ->execute();

        return $id;
    }

    /**
     * 通过用户名返回用户信息
     * @param $name
     * @return array|bool|null
     */
    public function getUserByName($name)
    {
        $row = (new Query())
            ->select('*')
            ->from($this->tableName())
            ->where(['username' => $name])
            ->one();

        if (!$row) {
            return null;
        }

        return $row;
    }

    /**
     * 示例
     */
    public function add(){

        $result = Base::getInstance('user_information')->findOne(['user_id'=>123]);

        var_dump($result);
    }
}