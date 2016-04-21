<?php
namespace wechat\models;

use common\util\Cookie;
use yii\db\Query;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/18
 * Time: 16:58
 */
class UserMessage extends \common\models\Base
{

    protected $_user_information_table = 'user_information';
    protected $_user_table = 'user';

    /**
     * 查询消息列表
     * @param array $where
     * @return array
     */
    public function messageList($where = [])
    {

        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        $pageSize = 20;
        $where['pageNum'] = isset($where['pageNum']) ? $where['pageNum'] : 1;
        $offset = ($where['pageNum'] - 1) * $pageSize;
        $condition = ['receive_user_id' => $user_id, 'status' => 2];
        $userTable = \Yii::$app->getDb()->tablePrefix . $this->_user_table;
        $userInformationTable = \Yii::$app->getDb()->tablePrefix . $this->_user_information_table;

        $result = (new Query())
            ->select(['m.*', 'count(m.send_user_id) sumSend', 'u.id other', 'u.username', 'u.sex', 'u.phone', 'i.info', 'i.identity_pic'])
            ->where($condition)
            ->from(static::tableName() . ' m')
            ->innerJoin($userTable . ' u', 'u.id=m.send_user_id')
            ->innerJoin($userInformationTable . ' i', 'i.user_id=m.send_user_id')
            ->groupBy('m.send_user_id')
            ->orderBy('m.time desc')
            ->limit($pageSize)
            ->offset($offset);
        //echo $result->createCommand()->getRawSql();exit;
        $result = $result->all();

        return $result;
    }

    public function messageSum() {
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        $condition = ['receive_user_id' => $user_id, 'status' => 2];
        $result = (new Query())
            ->select(['count(id) sumSend'])
            ->where($condition)
            ->from(static::tableName())
            ->one();

        return $result;
    }

    /**
     * 删除
     * @param array $where
     * @return int
     */
    public function messageDel($where = [])
    {

        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        $row = $this->updateAll(['status' => 2], ['receive_user_id' => $user_id, 'send_user_id' => $where['msgId']]);
        $row += $this->updateAll(['status' => 2], ['send_user_id' => $user_id, 'receive_user_id' => $where['msgId']]);

        return $row;
    }
}