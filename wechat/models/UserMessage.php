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
    /**
     * 查询消息列表
     * @param array $where
     * @return array
     */
    public function messageList($where = [])
    {

        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        $pageSize = 20;
        $where['pageNum'] = isset($where['pageNum']) ? $where['pageNum'] : 1;
        $offset = ($where['pageNum'] - 1) * $pageSize;

        $db = $this->getDb();
        $row = $db->createCommand("
SELECT u.username,u.sex,u.phone,i.info,i.identity_pic,c.* FROM bhy_user u INNER JOIN bhy_user_information i ON u.id=i.user_id

INNER JOIN

(
SELECT m.id,m.send_user_id,m.receive_user_id,message,m.time,STATUS,tmp.sum_send, m.send_user_id other FROM bhy_user_message  m INNER JOIN (

SELECT send_user_id,COUNT(send_user_id) sum_send,MAX(TIME) TIME FROM bhy_user_message WHERE receive_user_id = $user_id AND STATUS=2 GROUP BY send_user_id

)tmp ON m.send_user_id = tmp.send_user_id AND m.time = tmp.time

UNION ALL

SELECT m.id,m.send_user_id,m.receive_user_id,message,m.time,STATUS,tmp.sum_send, m.receive_user_id other FROM bhy_user_message  m INNER JOIN (

SELECT receive_user_id,COUNT(send_user_id) sum_send,MAX(TIME) TIME FROM bhy_user_message WHERE send_user_id = $user_id AND status != -1 GROUP BY receive_user_id

)tmp ON m.receive_user_id = tmp.receive_user_id AND m.time = tmp.time

) c ON u.id=c.other GROUP BY c.other ORDER BY time DESC limit $offset,$pageSize
")->queryAll();
        //var_dump($row);exit;

        return $row;
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