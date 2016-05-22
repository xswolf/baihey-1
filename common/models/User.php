<?php
namespace common\models;

use Yii;
use yii\db\Query;
use yii\web\Session;

class User extends Base
{
    public $tablePrefix;

    public function init() {
        $this->tablePrefix = Yii::$app->db->tablePrefix;
    }

    /**
     * @return string 返回该AR类关联的数据表名
     */
    public static function tableName()
    {
        return 'user';
    }

    public function getUserById($id){
        $userTable = $this->tablePrefix.$this->tableName();
        $userInformationTable = $this->tablePrefix.'user_information';
        $row = (new Query)
            ->select('*')
            ->from($userTable)
            ->leftJoin($this->tablePrefix.'user_information',"$userTable.id = ".$userInformationTable.'user_id')
            ->where(['id' => $id])
            ->one();

        if ($row === false) {
            return null;
        }
        return $row;
    }

    public function addUser($userInfo){

    }

    public function delUser($id){

    }

    public function editUser($userInfo){

    }

    public function getUserByPhone($tel){

    }

    /**
     * 获取个人发布动态
     * @param $uid
     * @param $limit
     * @param $page
     * @return array
     */
    public function getDynamicList($uid , $page = 0 , $limit = 5){
        $loginUserId  = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        $offset = $page * $limit;
        $obj = (new Query())
            ->from($this->tablePrefix . "user_dynamic d")
            ->innerJoin($this->tablePrefix.'user_information i' , 'd.user_id=i.user_id' )
            ->innerJoin($this->tablePrefix.'user u' , 'd.user_id=u.id' )
            ->leftJoin($this->tablePrefix.'user_click c' , 'c.dynamic_id = d.id AND c.user_id ='.$loginUserId)
            ->limit($limit)
            ->offset($offset)
            ->select(["d.*","u.phone" ,"json_extract(i.auth , '$.identity_check') AS identity_check" ,"json_extract(i.info , '$.level') AS level" , "c.id as cid"])
            ->orderBy("d.create_time desc");
        if ($uid>0){
            return $obj->where(['u.id'=>$uid])->all();
        }else{
            return $obj->all();
        }
    }

    /**
     * 根据动态ID获取动态内容
     * @param $id
     * @return array
     */
    public function getDynamicById($id){
        $loginUserId  = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        return (new Query())
            ->from($this->tablePrefix . "user_dynamic d")
            ->innerJoin($this->tablePrefix.'user_information i' , 'd.user_id=i.user_id' )
            ->innerJoin($this->tablePrefix.'user u' , 'd.user_id=u.id' )
            ->leftJoin($this->tablePrefix.'user_click c' , 'c.dynamic_id = d.id AND c.user_id='.$loginUserId)
            ->where(['d.id'=>$id])
            ->select(["d.*","u.phone" ,"json_extract(i.auth , '$.identity_check') AS identity_check" ,"json_extract(i.info , '$.level') AS level" , "c.id as cid"])
            ->orderBy("d.create_time desc")
            ->all();
    }

    /**
     * 设置点赞
     * @param $dynamicId
     * @param $userId
     * @return bool
     * @throws \yii\db\Exception
     */
    public function setClickLike($dynamicId,$userId , $add){

        $tran = \Yii::$app->db->beginTransaction();
        $click = \common\models\Base::getInstance('user_click');
        $click->user_id = $userId;
        $click->dynamic_id = $dynamicId;
        $click->create_time = time();
        $clickFlag = $click->save();
        $dynamic = \common\models\Base::getInstance("user_dynamic")->findOne($dynamicId);
        $dynamic->like_num = $dynamic->like_num + $add;

        if ($clickFlag  && $dynamic->save()){
            $tran->commit();
            return true;
        }
        $tran->rollBack();
        return false;
    }

    /**
     * 取消点赞
     * @param $dynamicId
     * @param $userId
     * @param $add
     * @return bool
     * @throws \yii\db\Exception
     */
    public function cancelClickLike ( $dynamicId,$userId , $add ){

        $tran               = \Yii::$app->db->beginTransaction();
        $click              = \common\models\Base::getInstance('user_click')->findOne(['user_id'=>$userId , 'dynamic_id' =>$dynamicId]);
        $clickFlag          = $click->delete();
        $dynamic            = \common\models\Base::getInstance("user_dynamic")->findOne($dynamicId);
        $dynamic->like_num  = $dynamic->like_num + $add;
        if ($clickFlag  && $dynamic->save()){
            $tran->commit();
            return true;
        }
        $tran->rollBack();
        return false;
    }

    /**
     * 发布动态
     * @param $data
     * @return bool
     */
    public function addDynamic($data){

        $dynamic = \common\models\Base::getInstance("user_dynamic");
        $dynamic->user_id = $data['user_id'];
        $dynamic->name = $data['name'];
        $dynamic->content= $data['content'];
        $dynamic->pic = $data['pic'];
        $dynamic->auth = $data['auth'];
        $dynamic->address = $data['address'];
        $dynamic->create_time = time();
        return $dynamic->save();
    }

    /**
     * 获取动态评论
     * @param $id
     * @return array
     */
    public function getCommentById($id){

        return (new Query())
            ->from($this->tablePrefix."user_comment c")
            ->innerJoin($this->tablePrefix . "user_information i" , "i.user_id = c.user_id")
            ->where(["dynamic_id" => $id])
            ->select(["c.*" , "json_extract(i.info , '$.head_pic') as headPic" , "json_extract(i.info , '$.real_name') as name"])
            ->all();
    }

    /**
     * 添加评论
     * @param $data
     * @return bool
     */
    public function addComment($data){

        $tran               = \Yii::$app->db->beginTransaction();
        $comment = \common\models\Base::getInstance("user_comment");
        $comment->user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        $comment->content= $data['content'];
        $comment->dynamic_id = $data['dynamicId'];
        $comment->private = $data['private'];
        $comment->create_time = $data['create_time'];

        $flag =  $comment->save();
        $id = Yii::$app->db->lastInsertID;
        $dynamic            = \common\models\Base::getInstance("user_dynamic")->findOne($data['dynamicId']);
        $dynamic->comment_num  = $dynamic->comment_num + 1;
        if ($flag  && $dynamic->save()){
            $tran->commit();
            return $id;
        }
        $tran->rollBack();
        return false;
    }

    /**
     * 获取关注的人
     * @return array
     */
    public function getFollowList(){

        return (new Query())->from($this->tablePrefix."user_follow")
            ->where(['user_id'=>\common\util\Cookie::getInstance()->getCookie('bhy_id')->value ,'status'=>1])
            ->select('follow_id')
            ->all();
    }

    /**
     * 获个人红包信息
     * @param $userId
     * @return array
     */
    public function briberyInfo($userId){

        $data =  (new Query())
            ->from($this->tablePrefix.'user u')
            ->innerJoin("(SELECT send_user_id , COUNT(*) AS sendBribery , sum(money) sendMoney FROM {$this->tablePrefix}user_bribery WHERE send_user_id=12 AND STATUS=1) send ","send.send_user_id = u.id")
            ->innerJoin("(SELECT receive_user_id , COUNT(*) AS receiveBribery ,sum(money) recMoney FROM {$this->tablePrefix}user_bribery WHERE receive_user_id=12 AND STATUS=1) receive" , "receive.receive_user_id = u.id")
            ->where(['u.id'=>$userId])
            ->select("u.id,u.balance,send.sendBribery , receive.receiveBribery,sendMoney,recMoney")
            ->all();
        return $data[0];
    }

    /**
     * 获取发送的红包或收到的红包，flag=true 收到的红包
     * @param $userId
     * @param bool $flag
     * @param int $page
     * @param int $limit
     * @return array
     */
    public function getBriberyList($userId , $flag = true,$page = 0 , $limit = 5){
        $joinOnField = $flag == true ? 'receive_user_id':'send_user_id';
        $whereField = $flag == true ? 'receive_user_id':'send_user_id';
        $offset = $page * $limit;
        return (new Query())
            ->from($this->tablePrefix."user_bribery  b")
            ->innerJoin($this->tablePrefix."user_information i" , "b.{$joinOnField} = i.user_id")
            ->where(["b.{$whereField}"=>$userId])
            ->select(["b.*","json_extract(i.info , '$.real_name') as realName"])
            ->limit($limit)
            ->offset($offset)
            ->all();
    }
}
