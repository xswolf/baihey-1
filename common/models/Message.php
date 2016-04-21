<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/14
 * Time: 11:35
 */

namespace common\models;



class Message extends Base {

    /**
     * @return string 返回该AR类关联的数据表名
     */
    public static function tableName() {
        return \Yii::$app->db->tablePrefix.'user_message';
    }

    /**
     * 获取聊天记录
     *
     * @param $sendId
     * @param $receiveId
     *
     * @return mixed
     */
    public function getMessageHistory( $sendId , $receiveId ) {
        $table                    = 'user_message';
        $messageModel             = \common\models\Base::getInstance( $table );

        $where = "receive_user_id={$sendId} and send_user_id={$receiveId} and status=2";
        $handle = $messageModel->Query()->where( $where )
            ->select( '*' );
        $list = $handle->all();
        \Yii::$app->db->createCommand("update bhy_{$table} set status=1 where {$where}")->execute();
        return $list;
    }


    /**
     * 添加聊天消息
     * @param $sendId
     * @param $receiveId
     * @param $messageContent
     * @param int $type
     * @param int $status
     *
     * @return bool
     * @throws \Exception
     */
    public function add( $sendId,$receiveId , $messageContent , $type = 1 ,$status) {
        $this->send_user_id    = $sendId;
        $this->receive_user_id = $receiveId;
        $this->message         = $messageContent;
        $this->message_type    = $type;
        $this->time            = time();
        $this->status          = $status;

        return $this->insert(true);
    }
}