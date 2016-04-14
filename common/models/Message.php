<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/14
 * Time: 11:35
 */

namespace common\models;


use common\util\Cookie;

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
        $messageModel             = \common\models\Base::getInstance( "user_message" );
        $where['receive_user_id'] = $receiveId;
        $where['send_user_id']    = $sendId;

        $where = $messageModel->processWhere( $where );
        $where .= "or receive_user_id={$sendId} and send_user_id={$receiveId}";
        $list = $messageModel->Query()->where( $where )->select( '*' )->all();

        return $list;
    }


    public function add( $sendId,$receiveId , $messageContent , $type = 1 ) {
        $this->send_user_id    = $sendId;
        $this->receive_user_id = $receiveId;
        $this->message         = $messageContent;
        $this->message_type    = $type;
        $this->time            = time();
        return $this->save(false);
    }
}