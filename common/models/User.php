<?php
namespace common\models;

use common\util\Cookie;
use Yii;
use yii\db\Query;

class User extends Base
{


    public function lists( $start , $limit ,$andWhere = []){

        $handle = (new Query())->from($this->tablePrefix.'user u')
            ->innerJoin($this->tablePrefix.'user_information i' , 'u.id=i.user_id')
            ->select("*")
            ->orderBy('id desc')
            ->offset($start)
            ->limit($limit);

        if (count($andWhere)>0){
            foreach ($andWhere as $v){
                $handle->andWhere($v);
            }
        }
        return $handle->all();
    }

    public function count($andWhere = []){
        $handle = (new Query())->from($this->tablePrefix.'user u')
            ->innerJoin($this->tablePrefix.'user_information i' , 'u.id=i.user_id')
            ->select("*");

        if (count($andWhere)>0){
            foreach ($andWhere as $v){
                $handle->andWhere($v);
            }
        }
        return $handle->count();
    }

    public function getUserById($id){
        $userTable = static::tableName();
        $userInformationTable = $this->tablePrefix.'user_information';
        $row = (new Query)
            ->select('*')
            ->from($userTable)
            ->leftJoin($this->tablePrefix.'user_information',"$userTable.id = ".$userInformationTable.'.user_id')
            ->where(['id' => $id])
            ->one();

        if ($row === false) {
            return null;
        }
        return $row;
    }

    /**
     * 新增用户
     * @param $data array()
     * @return string
     * @throws \yii\db\Exception
     */
    public function addUser($data){
        $db = $this->getDb();
        $transaction = $db->beginTransaction();// 启动事务

        // user表 数据处理
        if(isset($data['wx_id'])) {
            $dataUser['wx_id']      = $data['wx_id'];
            $dataUser['username']   = $data['username'];
            $dataUser['password']   = md5(md5($data['password']));
            $dataUser['login_type'] = $data['login_type'];
        } else {
            $dataUser['username']   = $data['phone'];
            $data['password']       = substr($data['phone'], -6);
            $dataUser['password']   = md5(md5($data['password']));
            $dataUser['phone']  = $data['phone'];

            isset($data['province']) ? $infoData['province'] = $data['province'] : true;
            isset($data['city']) ? $infoData['city'] = $data['city'] : true;
            isset($data['area']) ? $infoData['area'] = $data['area'] :true;
            isset($data['personalized']) ? $infoData['personalized'] = $data['personalized'] : true;
        }
        $time = YII_BEGIN_TIME;
        $dataUser['reg_time'] = $time;
        $dataUser['last_login_time'] = $time;
        $dataUser['reset_pass_time'] = $time;
        $dataUser['sex'] = $data['sex'];
        // userinformation表 数据处理
        // info
        $userInfo = $this->getDefaultInfo();
        if(isset($data['info'])) {
            $userInfo = array_merge($userInfo, $data['info']);
            unset($data['info']);
        }
        // 身份证照片
        $userAuth = $this->getDefaultAuth();
        if(isset($data['auth'])) {
            $userAuth = array_merge($userAuth, $data['auth']);
            unset($data['auth']);
        }

        $infoData['auth'] = json_encode($userAuth);
        $infoData['info'] = json_encode($userInfo);

        // user表 数据写入
        $user = $db->createCommand()
            ->insert($this->tableName(), $dataUser)
            ->execute();

        if ($user) {
            $id = $db->getLastInsertID();// 获取id
        }

        // user_information表 数据处理
        $infoData['user_id'] = $id;

        // user_information表 数据写入
        $info = $db->createCommand()
            ->insert('bhy_user_information', $infoData)
            ->execute();
        if ($user && $info) {
            $transaction->commit();
            // 写入用户日志表
            $log['user_id'] = $id;
            $log['type'] = 2;
            $log['time'] = $time;
            $this->userLog($log);
        } else {
            $transaction->rollBack();
        }

        return ['id' => $id, 'username' => $dataUser['username'], 'password' => $data['password']];
    }

    /**
     * 获取userinformation的info字段默认值
     * @return array
     */
    public function getDefaultInfo()
    {
        return [
            'age'                   => '未知',// 出生年月时间戳 1
            'level'                 => '未知',// vip等级
            'local'                 => '未知',// 当地地区（地区切换使用）
            'height'                => '未知',// 身高 1
            'weight'                => '未知',// 体重
            'head_pic'              => '未知',// 头像 1
            'real_name'             => '未知',// 真实姓名
            'identity_id'           => '未知',// 身份证号码
            'identity_address'      => '未知',// 身份证地址
            'is_marriage'           => '1',// 婚姻状况 1
            'is_child'              => '未知',// 子女状况
            'education'             => '未知',// 学历 1
            'year_income'           => '未知',// 年收入
            'is_purchase'           => '未知',// 购房状况
            'is_car'                => '未知',// 购车状况
            'occupation'            => '未知',// 职业
            'children_occupation'   => '未知',// 子职业
            'zodiac'                => '未知',// 属相生肖
            'constellation'         => '未知',// 星座
            'mate'                  => '未知',// 对未来伴侣的期望
            'nation'                => '未知',// 民族
            'wechat'                => '未知',// 微信
            'qq'                    => '未知',// QQ
            'haunt_address'         => '未知',// 常出没地
            'work'                  => '未知',// 工作单位
            'blood'                 => '未知',// 血型
            'school'                => '未知',// 学校
            // 择偶标准
            'zo_age'                => '18-0',// 年龄
            'zo_height'             => '140-0',// 最小身高
            'zo_education'          => '未知',// 学历
            'zo_income'             => '未知',// 年收入
            'zo_weight'             => '未知',// 体重
            'zo_marriage'           => '未知',// 婚姻状况
            'zo_children'           => '未知',// 子女状况
            'zo_endowed'            => '未知',// 才貌要求
            'zo_occupation'         => '未知',// 职业
            'zo_house'              => '未知',// 购房
            'zo_car'                => '未知',// 购车
            'zo_zodiac'             => '未知',// 属相
            'zo_constellation'      => '未知',// 星座
            'zo_address'            => '未知',// 地区
            'zo_other'              => '未知',// 其他要求
        ];
    }

    /**
     * 获取userinformation的auth字段默认值
     * @return array
     */
    public function getDefaultAuth()
    {
        return [
            'identity_pic1'     => '未知',// 身份证正面
            'identity_pic2'     => '未知',// 反面
            'identity_check'    => false,// 审核状态true通过，false未通过
            'identity_time'     => '未知',// 时间
            'marriage_pic1'     => '未知',// 离婚证正面
            'marriage_pic2'     => '未知',// 反面
            'marriage_check'    => false,// 审核状态true通过，false未通过
            'marriage_time'     => '未知',// 时间
            'education_pic1'    => '未知',// 学历学位证
            'education_pic2'    => '未知',// 毕业证
            'education_check'   => false,// 审核状态true通过，false未通过
            'education_time'    => '未知',// 时间
            'house_pic1'        => '未知',// 房产证正面
            'house_pic2'        => '未知',// 反面
            'house_check'       => false,// 审核状态true通过，false未通过
            'house_time'        => '未知',// 时间
        ];
    }

    /**
     * 用户操作日志
     */
    public function userLog($log)
    {

        $userLog = \common\models\Base::getInstance('user_log');
        $userLog->user_id = $log['user_id'];
        $userLog->type = $log['type'];
        $userLog->create_time = $log['time'];
        $userLog->ip = ip2long($_SERVER["REMOTE_ADDR"]);
        return $userLog->insert(false);
    }

    /**
     * 验证手机是否存在
     * @param $phone
     * @return null|static
     */
    public function mobileIsExist($phone)
    {
        return $this->findOne(['phone' => $phone]);
    }

    public function delUser($id){

    }

    public function editUser($data){
        $user = $data['user'];
        $user['id']  = $data['user_id'];
        unset($data['user']);
        $userInfo = $data;

        $userInfo['info']  = json_encode(array_merge($this->getDefaultInfo(),$userInfo['zo'] , $userInfo['info']));
        unset ($userInfo['zo']);
        \Yii::$app->db->createCommand()->update($this->tablePrefix."user_information", $userInfo ,['user_id'=>$data['user_id']])->execute();
        \Yii::$app->db->createCommand()->update($this->tablePrefix."user", $user  , ['id'=>$data['user_id']])->execute();
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
            ->select(["d.*","u.phone" ,"json_extract(i.auth , '$.identity_check') AS identity_check" ,"json_extract(i.info , '$.level') AS level" ,"json_extract(i.info , '$.head_pic') AS head_pic" , "c.id as cid"])
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

    /**
     * 修改余额
     * @param $user_id
     * @param $money
     * @return int
     * @throws \yii\db\Exception
     */
    public function changeBalance($user_id, $money)
    {
        $user = $this->findOne($user_id);
        $user->balance = $user->balance - $money;
        return $user->save();
    }

    /**
     * 开通服务（修改余额，到期时间，等级）
     * @param $user_id
     * @param $goods_id
     * @param int $level
     * @return bool
     * @throws \yii\db\Exception
     */
    public function changeMatureTime($user_id, $goods_id, $level = 1)
    {
        $goods = ChargeGoods::getInstance()->findOne($goods_id);
        $userInfo = $this->getUserById($user_id);
        //  金额是否大于余额
        if($goods['price'] > $userInfo['balance']) {
            return false;
        }
        $db = $this->getDb();
        $transaction = $db->beginTransaction();// 启动事务
        // 计算时间
        $time = $goods['value'] * 30 * 24 * 3600;// vip时间（月）
        if(1 == $goods['giveType'] && $goods['give'] > 0) {
            $time += $goods['give'] * 24 * 3600;// 赠送的时间（天）
        }
        // 修改余额
        $userInfo['balance'] = $userInfo['balance'] - $goods['price'];
        $user = $db->createCommand()
            ->update(static::tableName(),['balance' => $userInfo['balance']],['id' => $user_id])
            ->execute();

        // 修改到期时间
        $_user_information_table = $this->tablePrefix.'user_information';// 表名
        $userInfo['mature_time'] = YII_BEGIN_TIME > $userInfo['mature_time'] ? YII_BEGIN_TIME + $time : $userInfo['mature_time'] + $time;
        $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.level','".$level."'), mature_time = ".$userInfo['mature_time']." WHERE user_id={$user_id}";
        $info = $db->createCommand($sql)->execute();

        if($user && $info) {
            $transaction->commit();
            // 写入用户消费日志表
            $this->userConsumptionLog($user_id, $goods_id);
            return true;
        } else {
            $transaction->rollBack();
            return false;
        }
    }


    /**
     * 消费日志
     * @param $user_id
     * @param $goods_id
     * @return int
     * @throws \yii\db\Exception
     */
    public function userConsumptionLog($user_id, $goods_id)
    {
        $log['user_id'] = $user_id;
        $log['goods_id'] = $goods_id;
        $log['create_time'] = YII_BEGIN_TIME;
        $row = $this->getDb()->createCommand()
            ->insert($this->tablePrefix.'user_consumption_log',$log)
            ->execute();
        return $row;
    }

    /**
     * 退出登录
     * @return bool
     */
    public function loginOut()
    {
        Cookie::getInstance()->getCookie('bhy_id') ? Cookie::getInstance()->delCookie('bhy_id') : true;
        Cookie::getInstance()->getCookie('bhy_u_name') ? Cookie::getInstance()->delCookie('bhy_u_name') : true;
        return true;
    }
}
