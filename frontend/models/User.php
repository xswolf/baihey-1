<?php
namespace frontend\models;

use Yii;
use yii\db\ActiveRecord;

class User extends ActiveRecord{

    public function getAllList(){
        return User::find()->all();
    }

}