<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/27 0027
 * Time: 下午 3:27
 */

namespace backend\controllers;



use common\models\Message;
use yii\db\Query;

class ChatController extends BaseController
{

    /**
     * 获取跟托聊天的人
     */
    protected function getChatList(){

        $tablePre = \Yii::$app->db->tablePrefix;
        $list = (new Query())->from($tablePre . "user_message m")
            ->innerJoin($tablePre . 'user u' , 'u.id = m .receive_user_id')
            ->innerJoin($tablePre . 'user_information i' , 'i.user_id=m.receive_user_id')
            ->where(['u.status' => 2])
            ->andWhere(['>' , 'receive_user_id' , 1])
            ->andWhere(['<=' , 'receive_user_id' , 15063])
            ->select("m.*,u.sex,i.info")
            ->groupBy("receive_user_id")
            ->all();
        return $list;
    }

    public function actionMsg(){
        $get = \Yii::$app->request;
        $rId = $get->get('rid');
        $sId = $get->get('sid');

        $table                    = 'user_message';


        $where = "receive_user_id={$rId} and send_user_id={$sId} and status=2";
        $handle = (new Query())->from(\Yii::$app->db->tablePrefix . 'user_message')->where( $where )
            ->orWhere("receive_user_id={$sId} and send_user_id={$rId}")
            ->select( '*' );
        $list = $handle->all();
//        \Yii::$app->db->createCommand("update ".\Yii::$app->db->tablePrefix."{$table} set status=1 where {$where}")->execute();

        return $this->renderAjax(['messageList' => $list ]);
    }

    public function actionIndex(){
        $this->layout = false;

        $chatList = $this->getChatList();


        $this->assign('chatList' , $chatList);
        return $this->render();
    }
}