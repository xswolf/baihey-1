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
    public function actionChatList(){

        $tablePre = \Yii::$app->db->tablePrefix;
        $list = (new Query())->from($tablePre . "user_message m")
            ->innerJoin($tablePre . 'user u' , 'u.id = m .receive_user_id')
            ->innerJoin($tablePre . 'user_information i' , 'i.user_id=m.receive_user_id')
            ->where(['m.status' => 2])
            ->andWhere(['>' , 'receive_user_id' ,10000])
            ->andWhere(['<=' , 'receive_user_id' , 12493])
            ->select("m.*,u.sex,i.info")
            ->groupBy("receive_user_id")
            ->all();
        return $this->renderAjax(['status'=>1 , 'data'=>$list]);
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
        \Yii::$app->view->renderers['html']['options']['left_delimiter']  ="{!";
        \Yii::$app->view->renderers['html']['options']['right_delimiter'] = "}";
        $this->layout = false;
        return $this->render();
    }

    /**
     * 获取虚拟会员列表
     * @return string|void
     */
    public function actionFictitiousList(){

        $list = (new Query())->from(\Yii::$app->db->tablePrefix.'user_information i')
            ->innerJoin(\Yii::$app->db->tablePrefix.'user u' , 'i.user_id=u.id')
            ->where([">=" , "user_id" , 10000])
            ->andWhere(["<=" , "user_id" , 12493])
            ->offset(0)
            ->limit(500)
            ->all();
        return $this->renderAjax(['status'=>1 , 'data'=>$list]);
    }
}