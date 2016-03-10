<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/10
 * Time: 10:21
 */
class User extends \yii\db\ActiveRecord{

    protected $user;

    /**
     * @param $username
     * @param $password
     *
     * @return bool
     */
    public function login($username,$password){

        return true;
    }


}