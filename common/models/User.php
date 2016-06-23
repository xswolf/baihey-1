<?php
namespace common\models;

use common\util\Cookie;
use Yii;
use yii\db\Query;

class User extends Base
{


    public function lists($start, $limit, $andWhere = [])
    {

        $handle = (new Query())->from($this->tablePrefix . 'user u')
            ->innerJoin($this->tablePrefix . 'user_information i', 'u.id=i.user_id')
            ->select("*")
            ->orderBy('id desc')
            ->offset($start)
            ->limit($limit);

        if (count($andWhere) > 0) {
            foreach ($andWhere as $v) {
                $handle->andWhere($v);
            }
        }
        return $handle->all();
    }

    public function count($andWhere = [])
    {
        $handle = (new Query())->from($this->tablePrefix . 'user u')
            ->innerJoin($this->tablePrefix . 'user_information i', 'u.id=i.user_id')
            ->select("*");

        if (count($andWhere) > 0) {
            foreach ($andWhere as $v) {
                $handle->andWhere($v);
            }
        }
        return $handle->count();
    }

    public function getUserById($id)
    {
        $userTable = static::tableName();
        $userInformationTable = $this->tablePrefix . 'user_information';
        $row = (new Query)
            ->select('*')
            ->from($userTable)
            ->leftJoin($this->tablePrefix . 'user_information', "$userTable.id = " . $userInformationTable . '.user_id')
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
    public function addUser($data)
    {
        $db = $this->getDb();
        $transaction = $db->beginTransaction();// 启动事务

        // user表 数据处理
        if (isset($data['wx_id'])) {
            $dataUser['wx_id'] = $data['wx_id'];
            $dataUser['username'] = $data['username'];
            $dataUser['password'] = md5(md5($data['password']));
            $dataUser['login_type'] = $data['login_type'];
        } else {
            $dataUser['username'] = $data['phone'];
            $data['password'] = substr($data['phone'], -6);
            $dataUser['password'] = md5(md5($data['password']));
            $dataUser['phone'] = $data['phone'];

            isset($data['province']) ? $infoData['province'] = $data['province'] : true;
            isset($data['city']) ? $infoData['city'] = $data['city'] : true;
            isset($data['area']) ? $infoData['area'] = $data['area'] : true;
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
        if (isset($data['info'])) {
            $userInfo = array_merge($userInfo, $data['info']);
            unset($data['info']);
        }
        // 身份证照片
        $userAuth = $this->getDefaultAuth();
        if (isset($data['auth'])) {
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
            $log['create_time'] = $time;
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
            'age' => '',// 出生年月时间戳 1
            'level' => '',// vip等级
            'local' => '',// 当地地区（地区切换使用）
            'height' => '',// 身高 1
            'weight' => '',// 体重
            'head_pic' => ' ',// 头像 1
            'real_name' => '',// 真实姓名
            'identity_id' => '',// 身份证号码
            'identity_address' => '',// 身份证地址
            'is_marriage' => '1',// 婚姻状况 1
            'is_child' => '',// 子女状况
            'education' => '',// 学历 1
            'year_income' => '',// 年收入
            'is_purchase' => '',// 购房状况
            'is_car' => '',// 购车状况
            'occupation' => '',// 职业
            'children_occupation' => '',// 子职业
            'zodiac' => '',// 属相生肖
            'constellation' => '',// 星座
            'mate' => '',// 对未来伴侣的期望
            'nation' => '',// 民族
            'wechat' => '',// 微信
            'qq' => '',// QQ
            'haunt_address' => '',// 常出没地
            'work' => '',// 工作单位
            'blood' => '',// 血型
            'school' => '',// 学校
            // 择偶标准
            'zo_age' => '18-0',// 年龄
            'zo_height' => '140-0',// 最小身高
            'zo_education' => '',// 学历
            'zo_income' => '',// 年收入
            'zo_weight' => '',// 体重
            'zo_marriage' => '',// 婚姻状况
            'zo_children' => '',// 子女状况
            'zo_endowed' => '',// 才貌要求
            'zo_occupation' => '',// 职业
            'zo_house' => '',// 购房
            'zo_car' => '',// 购车
            'zo_zodiac' => '',// 属相
            'zo_constellation' => '',// 星座
            'zo_address' => '',// 地区
            'zo_other' => '',// 其他要求
        ];
    }

    /**
     * 获取userinformation的auth字段默认值
     * @return array
     */
    public function getDefaultAuth()
    {
        return [
            'identity_pic1' => '',// 身份证正面
            'identity_pic2' => '',// 反面
            'identity_check' => false,// 审核状态true通过，false未通过
            'identity_time' => '',// 时间
            'marriage_pic1' => '',// 离婚证正面
            'marriage_pic2' => '',// 反面
            'marriage_check' => false,// 审核状态true通过，false未通过
            'marriage_time' => '',// 时间
            'education_pic1' => '',// 学历学位证
            'education_pic2' => '',// 毕业证
            'education_check' => false,// 审核状态true通过，false未通过
            'education_time' => '',// 时间
            'house_pic1' => '',// 房产证正面
            'house_pic2' => '',// 反面
            'house_check' => false,// 审核状态true通过，false未通过
            'house_time' => '',// 时间
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
        $userLog->create_time = $log['create_time'];
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

    public function delUser($id)
    {

    }

    public function editUser($data)
    {
        $user = $data['user'];
        $user['id'] = $data['user_id'];
        unset($data['user']);
        $userInfo = $data;

        $userInfo['info'] = json_encode(array_merge($this->getDefaultInfo(), $userInfo['zo'], $userInfo['info']));
        unset ($userInfo['zo']);
        \Yii::$app->db->createCommand()->update($this->tablePrefix . "user_information", $userInfo, ['user_id' => $data['user_id']])->execute();
        \Yii::$app->db->createCommand()->update($this->tablePrefix . "user", $user, ['id' => $data['user_id']])->execute();
    }

    public function getUserByPhone($tel)
    {

    }

    /**
     * 获取个人发布动态
     * @param $uid
     * @param $limit
     * @param $page
     * @return array
     */
    public function getDynamicList($uid, $page = 0, $limit = 5)
    {
        $loginUserId = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        $offset = $page * $limit;
        $obj = (new Query())
            ->from($this->tablePrefix . "user_dynamic d")
            ->innerJoin($this->tablePrefix . 'user_information i', 'd.user_id=i.user_id')
            ->innerJoin($this->tablePrefix . 'user u', 'd.user_id=u.id')
            ->leftJoin($this->tablePrefix . 'user_click c', 'c.dynamic_id = d.id AND c.user_id =' . $loginUserId)
            ->limit($limit)
            ->offset($offset)
            ->select(["d.*", "u.phone", "i.honesty_value", "json_extract(i.info , '$.level') AS level", "json_extract(i.info , '$.head_pic') AS head_pic", "c.id as cid"])
            ->orderBy("d.create_time desc");
        if ($uid > 0) {
            return $obj->where(['u.id' => $uid])->all();
        } else {
            return $obj->all();
        }
    }

    /**
     * 根据动态ID获取动态内容
     * @param $id
     * @return array
     */
    public function getDynamicById($id)
    {
        $loginUserId = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        return (new Query())
            ->from($this->tablePrefix . "user_dynamic d")
            ->innerJoin($this->tablePrefix . 'user_information i', 'd.user_id=i.user_id')
            ->innerJoin($this->tablePrefix . 'user u', 'd.user_id=u.id')
            ->leftJoin($this->tablePrefix . 'user_click c', 'c.dynamic_id = d.id AND c.user_id=' . $loginUserId)
            ->where(['d.id' => $id])
            ->select(["d.*", "u.phone", "i.honesty_value", "json_extract(i.info , '$.level') AS level", "json_extract(i.info , '$.head_pic') AS head_pic", "c.id as cid"])
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
    public function setClickLike($dynamicId, $userId, $add)
    {

        $tran = \Yii::$app->db->beginTransaction();
        $click = \common\models\Base::getInstance('user_click');
        $click->user_id = $userId;
        $click->dynamic_id = $dynamicId;
        $click->create_time = time();
        $clickFlag = $click->save();
        $dynamic = \common\models\Base::getInstance("user_dynamic")->findOne($dynamicId);
        $dynamic->like_num = $dynamic->like_num + $add;

        if ($clickFlag && $dynamic->save()) {
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
    public function cancelClickLike($dynamicId, $userId, $add)
    {

        $tran = \Yii::$app->db->beginTransaction();
        $click = \common\models\Base::getInstance('user_click')->findOne(['user_id' => $userId, 'dynamic_id' => $dynamicId]);
        $clickFlag = $click->delete();
        $dynamic = \common\models\Base::getInstance("user_dynamic")->findOne($dynamicId);
        $dynamic->like_num = $dynamic->like_num + $add;
        if ($clickFlag && $dynamic->save()) {
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
    public function addDynamic($data)
    {

        $dynamic = \common\models\Base::getInstance("user_dynamic");
        $dynamic->user_id = $data['user_id'];
        $dynamic->name = $data['name'];
        $dynamic->content = $data['content'];
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
    public function getCommentById($id)
    {

        return (new Query())
            ->from($this->tablePrefix . "user_comment c")
            ->innerJoin($this->tablePrefix . "user_information i", "i.user_id = c.user_id")
            ->where(["dynamic_id" => $id])
            ->select(["c.*", "json_extract(i.info , '$.head_pic') as headPic", "json_extract(i.info , '$.real_name') as name"])
            ->all();
    }

    /**
     * 添加评论
     * @param $data
     * @return bool
     */
    public function addComment($data)
    {

        $tran = \Yii::$app->db->beginTransaction();
        $comment = \common\models\Base::getInstance("user_comment");
        $comment->user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        $comment->content = $data['content'];
        $comment->dynamic_id = $data['dynamicId'];
        $comment->private = $data['private'];
        $comment->create_time = $data['create_time'];

        $flag = $comment->save();
        $id = Yii::$app->db->lastInsertID;
        $dynamic = \common\models\Base::getInstance("user_dynamic")->findOne($data['dynamicId']);
        $dynamic->comment_num = $dynamic->comment_num + 1;
        if ($flag && $dynamic->save()) {
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
    public function getFollowList()
    {

        return (new Query())->from($this->tablePrefix . "user_follow")
            ->where(['user_id' => \common\util\Cookie::getInstance()->getCookie('bhy_id')->value, 'status' => 1])
            ->select('follow_id')
            ->all();
    }

    /**
     * 获个人红包信息
     * @param $userId
     * @return array
     */
    public function briberyInfo($userId)
    {

        $handle = (new Query())
            ->from($this->tablePrefix . 'user u')
            ->leftJoin("(SELECT send_user_id , COUNT(*) AS sendBribery , sum(money) sendMoney FROM {$this->tablePrefix}user_bribery WHERE send_user_id={$userId} AND STATUS=1) send ", "send.send_user_id = u.id")
            ->leftJoin("(SELECT receive_user_id , COUNT(*) AS receiveBribery ,sum(money) recMoney FROM {$this->tablePrefix}user_bribery WHERE receive_user_id={$userId} AND STATUS=1) receive", "receive.receive_user_id = u.id")
            ->where(['u.id' => $userId])
            ->select("u.id,u.balance,send.sendBribery , receive.receiveBribery,sendMoney,recMoney");

        $data = $handle->all();
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
    public function getBriberyList($userId, $flag = true, $page = 0, $year = 0, $limit = 10000)
    {
        $joinOnField = $flag == true ? 'receive_user_id' : 'send_user_id';
        $whereField = $flag == true ? 'receive_user_id' : 'send_user_id';
        $flagd = $flag == true ? 1 : 2;
        $offset = $page * $limit;
        $handle = (new Query())
            ->from($this->tablePrefix . "user_bribery  b")
            ->innerJoin($this->tablePrefix . "user_information i", "b.{$joinOnField} = i.user_id")
            ->select(["b.*", "json_extract(i.info , '$.real_name') as realName, '$flagd' as flag , FROM_UNIXTIME(b.create_time , '%Y') as year"])
            ->limit($limit)
            ->offset($offset);
        $where = ["b.{$whereField}" => $userId, 'status' => 1];
        $handle->where($where);
        if ($year > 1) {
            $handle->andWhere([">=", "create_time", strtotime($year . "-01-01")]);
            $handle->andWhere(["<=", "create_time", strtotime($year . "-12-31 24:59:59")]);
        }

        return $handle->all();
    }

    /**
     * 修改余额
     * @param $user_id
     * @param $money
     * @return bool|int
     * @throws \yii\db\Exception
     */
    public function changeBalance($user_id, $money)
    {
        $money = intval($money);
        $userInfo = $this->getUserById($user_id);
        $userInfo['balance'] = $userInfo['balance'] - $money;
        $db = $this->getDb();
        $balance = $db->createCommand()
            ->update(static::tableName(), ['balance' => $userInfo['balance']], ['id' => $user_id])
            ->execute();
        return $balance;
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
        if ($goods['price'] > $userInfo['balance']) {
            return false;
        }
        $db = $this->getDb();
        $transaction = $db->beginTransaction();// 启动事务

        // 计算时间
        $time = $goods['value'] * 30 * 24 * 3600;// vip时间（月）
        if (1 == $goods['giveType'] && $goods['give'] > 0) {
            $time += $goods['give'] * 24 * 3600;// 赠送的时间（天）
        }

        // 修改余额
        $user = $this->changeBalance($user_id, $goods['price']);

        // 修改到期时间
        $_user_information_table = $this->tablePrefix . 'user_information';// 表名
        $userInfo['mature_time'] = YII_BEGIN_TIME > $userInfo['mature_time'] ? YII_BEGIN_TIME + $time : $userInfo['mature_time'] + $time;
        $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.level','" . $level . "'), mature_time = " . $userInfo['mature_time'] . " WHERE user_id={$user_id}";
        $info = $db->createCommand($sql)->execute();

        if ($user && $info) {
            $transaction->commit();
            // 写入用户消费日志表
            $goods['receive_name'] = '嘉瑞百合缘';
            $goods['type'] = 1;
            ConsumptionLog::getInstance()->addConsumptionLog($user_id, $goods);
            return true;
        } else {
            $transaction->rollBack();
            return false;
        }
    }

    /**
     * 获取用户银行卡
     * @param $user_id
     * @return array
     */
    public function getCashCardList($user_id)
    {
        $_cash_card_table = $this->tablePrefix . 'cash_card';
        $result = (new Query())
            ->from($_cash_card_table)
            ->select('*')
            ->where(['user_id' => $user_id])
            ->orderBy('create_time desc')
            ->all();
        return $result;
    }

    public function getCashCardById($user_id, $id)
    {
        $_cash_card_table = $this->tablePrefix . 'cash_card';
        $result = (new Query())
            ->from($_cash_card_table)
            ->select('*')
            ->where(['user_id' => $user_id, 'id' => $id])
            ->one();
        return $result;
    }

    public function addCashCard($user_id, $data)
    {
        $_cash_card_table = $this->tablePrefix . 'cash_card';
        $data['create_time'] = time();
        $data['user_id'] = $user_id;
        $_cash_card = $this->getInstance('cash_card');
        if ($_cash_card->findOne(['user_id' => $user_id, 'card_no' => $data['card_no']])) {
            return false;
        }
        $row = $this->getDb()->createCommand()
            ->insert($_cash_card_table, $data)
            ->execute();
        return $row;
    }

    public function delCard($user_id, $id)
    {
        $_cash_card_table = $this->tablePrefix . 'cash_card';
        $_cash_card = $this->getInstance($_cash_card_table);
        $card = $_cash_card->findOne(['user_id' => $user_id, 'id' => $id]);
        $row = false;
        if ($card) {
            $row = $_cash_card->deleteAll(['id' => $id]);
        }

        return $row;
    }

    /**
     * 提现
     * @param $data
     * @return int
     * @throws \yii\db\Exception
     */
    public function addCashInfo($user_id, $data)
    {
        $_cash_card_table = $this->tablePrefix . 'cash';
        $data['create_time'] = time();
        $data['status'] = 2;
        $data['user_id'] = $user_id;

        $db = $this->getDb();
        $transaction = $db->beginTransaction();// 启动事务

        // 减少余额
        $balance = $this->changeBalance($user_id, $data['money']);

        // 插入提现记录
        $row = $this->getDb()->createCommand()
            ->insert($_cash_card_table, $data)
            ->execute();
        $id = \Yii::$app->db->lastInsertID;

        if ($balance && $row) {
            $transaction->commit();
            return $id;
        } else {
            $transaction->rollBack();
            return false;
        }
    }

    /**
     * 根据用户ID或者记录ID获取提现记录
     * @param $id
     * @param null $user_id
     * @return array|bool
     */
    public function getCashInfo($id, $user_id = null)
    {
        $cashTable = $this->tablePrefix . 'cash';
        $cashCardTable = $this->tablePrefix . 'cash_card';
        if (isset($id)) {         // 根据提现记录ID查询单条记录
            $row = (new Query)
                ->select(['cash.id','card.user_name','cash.money','card.name','cash.create_time','cash.status','card.card_no'])
                ->from($cashTable.' cash')
                ->leftJoin($cashCardTable . ' card', 'cash.cash_card_id = card.id')
                ->where(['cash.id' => $id])
                ->one();
            return $row;
        } else {
            if(!empty($user_id)){      // 根据user_id查询所属用户全部提现记录
                $row = (new Query)
                    ->select(['1 as type','cash.money','card.name','card.card_no','cash.create_time','cash.status'])
                    ->from($cashTable.' cash')
                    ->leftJoin($cashCardTable . ' card', 'cash.cash_card_id = card.id')
                    ->where(['cash.user_id' => $user_id])
                    ->all();
                return $row;
            }else{
                return false;
            }
        }
    }

    /**
     * 根据user_id获取用户发出的红包记录
     * @param $user_id
     * @return array|bool
     */
    public function getBriberyInfo($user_id){
        $briberyTable = $this->tablePrefix . 'user_bribery';
        $informationTable = $this->tablePrefix . 'user_information';
        if(isset($user_id)){
            $row = (new Query)
                ->select(['2 as type','b.money','json_extract (i.info, \'$.real_name\') AS name','b.create_time','b.status'])
                ->from($briberyTable.' b')
                ->leftJoin($informationTable . ' i', 'b.receive_user_id = i.user_id')
                ->where(['b.send_user_id' => $user_id])
                ->all();
            return $row;
        }
        return false;
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


    /**
     * 根据用户ID、字段名称获取字段值
     * @param $user_id
     * @param $propertyKey
     * @return array|bool|null
     */
    public function getUserPropertyValue($user_id, $propertyKey)
    {
        $userTable = static::tableName();
        $userInformationTable = $this->tablePrefix . 'user_information';
        $row = (new Query)
            ->select("$propertyKey")
            ->from($userTable)
            ->leftJoin($this->tablePrefix . 'user_information', "$userTable.id = " . $userInformationTable . '.user_id')
            ->where(['id' => $user_id])
            ->one();

        if ($row === false) {
            return null;
        }
        return $row;
    }
}
