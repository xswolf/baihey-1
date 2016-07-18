<?php
namespace wechat\models;

use common\models\Base;
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
    public function messageList($where = [], $user_id)
    {
        $pageSize             = 20;
        $where['pageNum']     = isset($where['pageNum']) ? $where['pageNum'] : 1;
        $offset               = ($where['pageNum'] - 1) * $pageSize;
        $userTable            = $this->getDb()->tablePrefix . $this->_user_table;
        $userInformationTable = $this->getDb()->tablePrefix . $this->_user_information_table;
        $sql                  = "SELECT u.username,u.sex,u.phone,i.info,i.auth,c.* FROM $userTable u INNER JOIN $userInformationTable i ON u.id=i.user_id
INNER JOIN
(
SELECT m.id,m.send_user_id,m.receive_user_id,message,m.create_time,STATUS,tmp.sumSend, m.send_user_id other FROM bhy_user_message  m INNER JOIN (
SELECT send_user_id,COUNT(send_user_id) sumSend,MAX(create_time) create_time FROM bhy_user_message WHERE receive_user_id = $user_id AND STATUS=2 GROUP BY send_user_id
)tmp ON m.send_user_id = tmp.send_user_id AND m.create_time = tmp.create_time
) c ON u.id=c.other GROUP BY c.other ORDER BY create_time DESC limit $offset,$pageSize";
        $result               = $this->getDb()->createCommand($sql)->queryAll();

        return $result;
    }

    /**
     * 获取聊天列表
     */
    public function chatList($userId){
        $sql = "SELECT
                  i.user_id,
                  json_extract (i.info, '$.real_name') as name,
                  a.create_time
                FROM
                  (SELECT
                    receive_user_id,
                    MAX(create_time) create_time
                  FROM
                    (SELECT
                      receive_user_id,
                      create_time
                    FROM
                      bhy_user_message
                    WHERE send_user_id = $userId
                    UNION
                    ALL
                    SELECT
                      send_user_id,
                      create_time
                    FROM
                      bhy_user_message
                    WHERE receive_user_id = $userId) ain
                  GROUP BY receive_user_id) a
                  INNER JOIN bhy_user_information i
                    ON a.receive_user_id = i.user_id
                GROUP BY receive_user_id ";
        $result = $this->getDb()->createCommand($sql)->queryAll();
        return $result;
    }

    /**
     * 获取最新消息总条数
     * @return array|bool
     */
    public function messageSum($user_id)
    {
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
    public function messageDel($where = [], $user_id)
    {
        $row = $this->updateAll(['status' => 1], ['receive_user_id' => $user_id, 'send_user_id' => $where['msgId']]);

        return $row;
    }

    /**
     * 发送红包
     * @param $sendId
     * @param $receiveId
     * @param $money
     * @param $bri_message
     * @return bool|string
     * @throws \Exception
     */
    public function sendBribery($sendId, $receiveId, $money, $bri_message)
    {
        $tran                   = \Yii::$app->db->beginTransaction();
        $model                  = Base::getInstance('user_bribery');
        $model->send_user_id    = $sendId;
        $model->receive_user_id = $receiveId;
        $model->money           = $money;
        $model->create_time     = time();
        $model->status          = 0;
        $model->bri_message     = $bri_message;
        if ($model->insert(true)) {
            $id = \Yii::$app->db->lastInsertID;
            if (User::getInstance()->changeBalance($sendId, $money)) {
                $tran->commit();
            }

            return $id;
        }

        $tran->rollBack();
        return false;
    }
}