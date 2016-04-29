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

    public function saveData($user_id, $where)
    {
        if ($where) {
            $userInformation = $this->findOne($user_id);
            switch (key($where)) {
                case 'personalized':
                    $userInformation->personalized = $where['personalized'];
                    break;
            }
            return $userInformation->save(false);
        }
        return false;

    }
}