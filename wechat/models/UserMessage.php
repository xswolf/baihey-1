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
    protected $_user_table             = 'user';

    /**
     * 查询消息列表
     * @param array $where
     * @return array
     */
    public function messageList($where = [])
    {

        $user_id              = Cookie::getInstance()->getCookie('bhy_id')->value;
        $pageSize             = 20;
        $where['pageNum']     = isset($where['pageNum']) ? $where['pageNum'] : 1;
        $offset               = ($where['pageNum'] - 1) * $pageSize;
        $userTable            = $this->getDb()->tablePrefix . $this->_user_table;
        $userInformationTable = $this->getDb()->tablePrefix . $this->_user_information_table;
        $sql                  = "SELECT u.username,u.sex,u.phone,i.info,i.identity_pic,c.* FROM $userTable u INNER JOIN $userInformationTable i ON u.id=i.user_id
INNER JOIN
(
SELECT m.id,m.send_user_id,m.receive_user_id,message,m.time,STATUS,tmp.sumSend, m.send_user_id other FROM bhy_user_message  m INNER JOIN (
SELECT send_user_id,COUNT(send_user_id) sumSend,MAX(TIME) TIME FROM bhy_user_message WHERE receive_user_id = $user_id AND STATUS=2 GROUP BY send_user_id
)tmp ON m.send_user_id = tmp.send_user_id AND m.time = tmp.time
) c ON u.id=c.other GROUP BY c.other ORDER BY time DESC limit $offset,$pageSize";
        $result               = $this->getDb()->createCommand($sql)->queryAll();

        return $result;
    }

    /**
     * 获取最新消息总条数
     * @return array|bool
     */
    public function messageSum()
    {
        $user_id   = Cookie::getInstance()->getCookie('bhy_id')->value;
        $condition = ['receive_user_id' => $user_id, 'status' => 2];
        $result    = (new Query())
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
        $row = $this->updateAll(['status' => 1], ['receive_user_id' => $user_id, 'send_user_id' => $where['msgId']]);
        //$row += $this->updateAll(['status' => 2], ['send_user_id' => $user_id, 'receive_user_id' => $where['msgId']]);

        return $row;
    }
}