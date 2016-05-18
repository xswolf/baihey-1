<?php
namespace common\models;

use common\util\Cookie;
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
        $offset = $page * $limit;
        $obj = (new Query())
            ->from($this->tablePrefix . "user_dynamic d")
            ->innerJoin($this->tablePrefix.'user_information i' , 'd.user_id=i.user_id' )
            ->innerJoin($this->tablePrefix.'user u' , 'd.user_id=u.id' )
            ->leftJoin($this->tablePrefix.'user_click c' , 'c.dynamic_id = d.id AND c.user_id=d.user_id')
            ->limit($limit)
            ->offset($offset)
            ->select(["d.*","u.phone" ,"json_extract(i.identity_pic , '$.is_check') AS identity_check" ,"json_extract(i.info , '$.level') AS level" , "c.id as cid"])
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

        return (new Query())
            ->from($this->tablePrefix . "user_dynamic d")
            ->innerJoin($this->tablePrefix.'user_information i' , 'd.user_id=i.user_id' )
            ->innerJoin($this->tablePrefix.'user u' , 'd.user_id=u.id' )
            ->leftJoin($this->tablePrefix.'user_click c' , 'c.dynamic_id = d.id AND c.user_id=d.user_id')
            ->where(['d.id'=>$id])
            ->select(["d.*","u.phone" ,"json_extract(i.identity_pic , '$.is_check') AS identity_check" ,"json_extract(i.info , '$.level') AS level" , "c.id as cid"])
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

}
