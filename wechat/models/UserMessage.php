<?php
namespace wechat\models;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/18
 * Time: 16:58
 */


class UserMessage extends \common\models\Base
{
    public function messageList($where = []) {

        $pageSize = 20;
        $where['pageNum'] = isset($where['pageNum']) ? $where['pageNum'] : 1;
        $offset = ($where['pageNum'] - 1) * $pageSize;

        $db = $this->getDb();
        $row = $db->createCommand("
SELECT * FROM bhy_user u INNER JOIN bhy_user_information i ON u.id=i.user_id

INNER JOIN

(
SELECT m.send_user_id,m.receive_user_id,message,m.time,STATUS , m.send_user_id other FROM bhy_user_message  m INNER JOIN (

SELECT send_user_id,MAX(TIME) TIME FROM bhy_user_message WHERE receive_user_id = 1 AND STATUS=2 GROUP BY send_user_id

)tmp ON m.send_user_id = tmp.send_user_id AND m.time = tmp.time

UNION ALL

SELECT m.send_user_id,m.receive_user_id,message,m.time,STATUS , m.receive_user_id other FROM bhy_user_message  m INNER JOIN (

SELECT receive_user_id,MAX(TIME) TIME FROM bhy_user_message WHERE send_user_id = 1 AND status != -1 GROUP BY receive_user_id

)tmp ON m.receive_user_id = tmp.receive_user_id AND m.time = tmp.time

) c ON u.id=c.other GROUP BY c.other ORDER BY time DESC limit $offset,$pageSize
")->queryAll();
        var_dump($row);exit;

        return $row;
    }
}