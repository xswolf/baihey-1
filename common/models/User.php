<?php
namespace common\models;

use common\util\Cookie;
use Yii;
use yii\db\Query;
use yii\helpers\ArrayHelper;

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
        $list = $handle->all();
        return $list;
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
        $userTable            = $this->tablePrefix.'user';
        $userInformationTable = $this->tablePrefix . 'user_information';
        return (new Query)
            ->select('*')
            ->from($userTable)
            ->innerJoin($this->tablePrefix . 'user_information', "$userTable.id = " . $userInformationTable . '.user_id')
            ->where(['id' => $id])
            ->one();
    }

    public function getUser($where){

        $user = (new Query())->from($this->tablePrefix.'user u')
            ->innerJoin($this->tablePrefix . 'user_information i' , 'u.id=i.user_id')
            ->where($where)
            ->select("*")
            ->one();


        return $user;
    }

    /**
     * 新增用户
     * @param $data array()
     * @return string
     * @throws \yii\db\Exception
     */
    public function addUser($data)
    {
        $db          = $this->getDb();
        $transaction = $db->beginTransaction();// 启动事务
        // user表 数据处理
        if (isset($data['wx_id'])) {
            $dataUser['wx_id']      = $data['wx_id'];
            $dataUser['username']   = $data['username'];
            $dataUser['password']   = md5(md5($data['password']));
            $dataUser['login_type'] = $data['login_type'];
        } else {
            if(isset($data['id'])) {
                $dataUser['id'] = $data['id'];
                $dataUser['password'] = $data['password'];
            } else {
                $data['password'] = substr($data['phone'], -6);
                $dataUser['password'] = md5(md5($data['password']));
            }
            $dataUser['username'] = $data['phone'];
            $dataUser['phone']    = $data['phone'];

            if(isset($data['info']['age']) && !empty($data['info']['age'])) {
                $infoData['age'] = floor((time() - $data['info']['age'])/ 365 / 24 / 3600);
            }
            isset($data['province']) ? $infoData['province'] = $data['province'] : true;
            isset($data['city']) ? $infoData['city'] = $data['city'] : true;
            isset($data['area']) ? $infoData['area'] = $data['area'] : true;
            isset($data['personalized']) ? $infoData['personalized'] = $data['personalized'] : true;
            isset($data['privacy_pic']) ? $infoData['privacy_pic'] = $data['privacy_pic'] : true;
            isset($data['privacy_wechat']) ? $infoData['privacy_wechat'] = $data['privacy_wechat'] : true;
            isset($data['privacy_qq']) ? $infoData['privacy_qq'] = $data['privacy_qq'] : true;

            isset($data['went_travel']) ? $infoData['went_travel'] = implode(',', $data['went_travel']) : true;
            isset($data['want_travel']) ? $infoData['want_travel'] = implode(',', $data['want_travel']) : true;
            isset($data['like_food']) ? $infoData['like_food'] = implode(',', $data['like_food']) : true;
            isset($data['love_sport']) ? $infoData['love_sport'] = implode(',', $data['love_sport']) : true;
            isset($data['want_film']) ? $infoData['want_film'] = implode(',', $data['want_film']) : true;

            isset($data['username']) ? $dataUser['username'] = $data['username'] : true;
        }
        $time                        = YII_BEGIN_TIME;
        $dataUser['reg_time']        = $time;
        $dataUser['last_login_time'] = $time;
        $dataUser['reset_pass_time'] = $time;
        $dataUser['sex']             = $data['sex'];
        // userinformation表 数据处理
        // 值班红娘销售红娘
        if(isset($data['matchmaker'])) {
            $auth_user = new \backend\models\User();
            $admin = $auth_user->getFindUser(['duty' => 1]);
            $data['matchmaker'] = $admin['id'];
        }
        // info
        $userInfo = $this->getDefaultInfo();
        if (isset($data['info'])) {
            $userInfo = array_merge($userInfo, $data['info']);
            unset($data['info']);
        }
        $userInfo['real_name'] = trim($userInfo['real_name']);
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

        $id = $db->getLastInsertID();// 获取id
        // user_information表 数据处理
        $infoData['user_id'] = $id;

        // user_information表 数据写入
        $info = $db->createCommand()
            ->insert('bhy_user_information', $infoData)
            ->execute();
        if ($user && $info) {
            $transaction->commit();
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
            'head_pic' => '',// 头像 1
            'real_name' => '',// 真实姓名
            'identity_id' => '',// 身份证号码
            'identity_address' => '',// 身份证地址
            'is_marriage' => '',// 婚姻状况 1
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
            'zo_age' => '',// 年龄
            'zo_height' => '',// 最小身高
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
     * 登录日志
     * @param $user_id
     */
    public function loginLog($user_id)
    {
        $time = time();
        $this->getDb()->createCommand()
            ->update($this->tablePrefix.'user', ['id' => $user_id], ['last_login_time' =>$time]);
        $log['user_id'] = $user_id;
        $log['type'] = 1;
        $log['create_time'] = $time;
        $this->userLog($log);
    }

    /**
     * 用户操作日志
     */
    public function userLog($log)
    {

        $userLog              = \common\models\Base::getInstance('user_log');
        $userLog->user_id     = $log['user_id'];
        $userLog->type        = $log['type'];
        $userLog->create_time = $log['create_time'];
        $userLog->ip          = ip2long($_SERVER["REMOTE_ADDR"]);
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

    public function editUser($data)
    {
        $user       = $data['user'];
        $user['id'] = $data['user_id'];
        unset($data['user']);
        $userInfo = $data;
        if(isset($userInfo['info']['age']) && !empty($data['info']['age'])) {
            $userInfo['age'] = floor((time() - $userInfo['info']['age'])/ 365 / 24 / 3600);
        }
        if(isset($userInfo['info']['real_name']) && !empty($data['info']['real_name'])) {
            $userInfo['info']['real_name'] = trim($userInfo['info']['real_name']);
        }
        $oldUser = $this->getUserById($data['user_id']);
        $defaultInfo = json_decode($oldUser['info']);
        if(is_object($defaultInfo)) {
            $defaultInfo = (array)$defaultInfo;
        }
        //var_dump($defaultInfo);exit;
        $userInfo['info'] = json_encode(array_merge($defaultInfo, $userInfo['info']));
        $this->getDb()->createCommand()->update($this->tablePrefix . "user_information", $userInfo, ['user_id' => $data['user_id']])->execute();
        $this->getDb()->createCommand()->update($this->tablePrefix . "user", $user, ['id' => $data['user_id']])->execute();
        // 添加图片
        if(isset($data['cardFace_List'])) {
            User::getInstance()->insertUserPhoto($user['id'], $data);
        }
        return $user;
    }

    public function editUser1($data){
        return \Yii::$app->db->createCommand()
            ->update($this->tablePrefix . "user" , $data , ['id' => $data['id']])
            ->execute();
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

        $tran               = \Yii::$app->db->beginTransaction();
        $click              = \common\models\Base::getInstance('user_click');
        $click->user_id     = $userId;
        $click->dynamic_id  = $dynamicId;
        $click->create_time = time();
        $clickFlag          = $click->save();
        $dynamic            = \common\models\Base::getInstance("user_dynamic")->findOne($dynamicId);
        $dynamic->like_num  = $dynamic->like_num + $add;

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

        $tran              = \Yii::$app->db->beginTransaction();
        $click             = \common\models\Base::getInstance('user_click')->findOne(['user_id' => $userId, 'dynamic_id' => $dynamicId]);
        $clickFlag         = $click->delete();
        $dynamic           = \common\models\Base::getInstance("user_dynamic")->findOne($dynamicId);
        $dynamic->like_num = $dynamic->like_num + $add;
        if ($clickFlag && $dynamic->save()) {
            $tran->commit();
            return true;
        }
        $tran->rollBack();
        return false;
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
            ->innerJoin($this->tablePrefix . "user u", "u.id = i.user_id")
            ->leftJoin($this->tablePrefix . 'feedback f', 'f.feedback_id = c.user_id AND f.type = 1 AND f.status = 1')
            ->where(["dynamic_id" => $id])
            ->select(["c.*", "i.report_flag", "json_extract(i.info , '$.head_pic') as headPic", "json_extract(i.info , '$.age') as age", "u.sex", "json_extract(i.info , '$.real_name') as name", "f.id as fid"])
            ->orderBy('create_time asc')
            ->all();
    }

    /**
     * 添加评论
     * @param $data
     * @return bool
     */
    public function addComment($data)
    {

        $tran                 = \Yii::$app->db->beginTransaction();
        $comment              = \common\models\Base::getInstance("user_comment");
        $comment->user_id     = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        $comment->content     = $data['content'];
        $comment->dynamic_id  = $data['dynamicId'];
        $comment->private     = $data['private'];
        $comment->create_time = $data['create_time'];

        $flag                 = $comment->save();
        $id                   = Yii::$app->db->lastInsertID;
        $dynamic              = \common\models\Base::getInstance("user_dynamic")->findOne($data['dynamicId']);
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
        $whereField  = $flag == true ? 'receive_user_id' : 'send_user_id';
        $flagd       = $flag == true ? 1 : 2;
        $offset      = $page * $limit;
        $handle      = (new Query())
            ->from($this->tablePrefix . "user_bribery  b")
            ->innerJoin($this->tablePrefix . "user_information i", "b.{$joinOnField} = i.user_id")
            ->select(["b.*", "json_extract(i.info , '$.real_name') as realName, '$flagd' as flag , FROM_UNIXTIME(b.create_time , '%Y') as year"])
            ->limit($limit)
            ->offset($offset);
        $where       = ["b.{$whereField}" => $userId, 'status' => 1];
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
        $money               = intval($money);
        $userInfo            = $this->getUserById($user_id);
        $userInfo['balance'] = $userInfo['balance'] - $money;
        $db                  = $this->getDb();
        $balance             = $db->createCommand()
            ->update($this->tablePrefix.'user', ['balance' => $userInfo['balance']], ['id' => $user_id])
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
    public function changeMatureTime($user_id, $goods_id, $level = 0)
    {
        $goods    = ArrayHelper::toArray(ChargeGoods::getInstance()->findOne($goods_id));
        $userInfo = $this->getUserById($user_id);
        //  金额是否大于余额
        if ($goods['price'] > $userInfo['balance']) {
            return false;
        }
        $db          = $this->getDb();
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
        $level = $goods['level'];
        if($level != 0) {
            $sql = "UPDATE {$_user_information_table} SET info = JSON_REPLACE(info,'$.level','" . $level . "'), mature_time = " . $userInfo['mature_time'] . " WHERE user_id={$user_id}";
        } else {
            $sql = "UPDATE {$_user_information_table} SET mature_time = " . $userInfo['mature_time'] . " WHERE user_id={$user_id}";
        }
        $info                    = $db->createCommand($sql)->execute();

        if ($user && $info) {
            $transaction->commit();
            // 写入用户消费日志表
            $goods['receive_name'] = '嘉瑞百合缘';
            $goods['type']         = 1;
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
        $result           = (new Query())
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
        $result           = (new Query())
            ->from($_cash_card_table)
            ->select('*')
            ->where(['user_id' => $user_id, 'id' => $id])
            ->one();
        return $result;
    }

    public function addCashCard($user_id, $data)
    {
        $_cash_card_table    = $this->tablePrefix . 'cash_card';
        $data['create_time'] = time();
        $data['user_id']     = $user_id;
        $_cash_card          = $this->getInstance('cash_card');
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
        $_cash_card       = $this->getInstance($_cash_card_table);
        $card             = $_cash_card->findOne(['user_id' => $user_id, 'id' => $id]);
        $row              = false;
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
        $_cash_card_table    = $this->tablePrefix . 'cash';
        $data['create_time'] = time();
        $data['status']      = 2;
        $data['user_id']     = $user_id;

        $db          = $this->getDb();
        $transaction = $db->beginTransaction();// 启动事务

        // 减少余额
        $balance = $this->changeBalance($user_id, $data['money']);

        // 插入提现记录
        $row = $this->getDb()->createCommand()
            ->insert($_cash_card_table, $data)
            ->execute();
        $id  = \Yii::$app->db->lastInsertID;

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
        $cashTable     = $this->tablePrefix . 'cash';
        $cashCardTable = $this->tablePrefix . 'cash_card';
        if (isset($id)) {         // 根据提现记录ID查询单条记录
            $row = (new Query)
                ->select(['cash.id', 'card.user_name', 'cash.money', 'card.name', 'cash.create_time', 'cash.status', 'card.card_no'])
                ->from($cashTable . ' cash')
                ->leftJoin($cashCardTable . ' card', 'cash.cash_card_id = card.id')
                ->where(['cash.id' => $id])
                ->one();
            return $row;
        } else {
            if (!empty($user_id)) {      // 根据user_id查询所属用户全部提现记录
                $row = (new Query)
                    ->select(['cash.money','concat_ws(\'-\',card.name,card.card_no) as name','cash.create_time','cash.status','concat(\'提现\') as type'])
                    ->from($cashTable.' cash')
                    ->leftJoin($cashCardTable . ' card', 'cash.cash_card_id = card.id')
                    ->where(['cash.user_id' => $user_id])   //TODO cash.status = 1
                    ->all();
                return $row;
            } else {
                return false;
            }
        }
    }

    /**
     * 根据user_id获取用户发出的红包记录
     * @param $user_id
     * @return array|bool
     */
    public function getBriberyInfo($user_id)
    {
        $briberyTable     = $this->tablePrefix . 'user_bribery';
        $informationTable = $this->tablePrefix . 'user_information';
        if (isset($user_id)) {
            $row = (new Query)
                ->select(['b.money','json_extract (i.info, \'$.real_name\') AS name','b.create_time','b.status','concat(\'嘉瑞红包\') as type'])
                ->from($briberyTable.' b')
                ->leftJoin($informationTable . ' i', 'b.receive_user_id = i.user_id')
                ->where(['b.send_user_id' => $user_id])   //TODO b.status = 1
                ->all();
//            ->createCommand()->getRawSql();
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
        $userTable            = $this->tablePrefix.'user';
        $userInformationTable = $this->tablePrefix . 'user_information';
        $row = (new Query)
            ->select($propertyKey)
            ->from($userTable)
            ->leftJoin($this->tablePrefix . 'user_information', "$userTable.id = " . $userInformationTable . '.user_id')
            ->where(['id' => $user_id])
            ->one();

        if ($row === false) {
            return null;
        }
        return $row;
    }

    /**
     * 通过手机号返回用户信息
     * @param $phone
     * @return array|bool
     */
    public function getUserByPhone($phone)
    {
        return (new Query())->from($this->tablePrefix.'user')->select('*')->where(['phone' => $phone])->one();
    }

    /**
     * 修改user表用户信息
     * @param $user_id
     * @param $data
     * @return int
     * @throws \yii\db\Exception
     */
    public function editUserTableInfo($user_id, $data)
    {
        $_user_table = $this->tablePrefix.'user';
        $row = $this->getDb()->createCommand()
            ->update($_user_table, $data, ['id' => $user_id])
            ->execute();
        return $row;
    }

    /**
     * 获取用户登陆次数
     * @param $userId
     * @return int|string
     */
    public function getLoginTimes($userId){
       return (new Query())->from($this->tablePrefix.'user_log')->where(['user_id'=>$userId])->count();
    }

    /**
     * 获取用户缴费总额
     * @param $userId
     * @return mixed
     */
    public function getPayAll($userId){
        return (new Query())->from($this->tablePrefix.'charge_order')->where(['user_id'=>$userId])->sum("money");
    }

    /**
     * 删除用户
     * @param $id
     * @param $status
     * @return bool
     */
    public function delUser($id , $status = 4){
        return \Yii::$app->db->createCommand()
            ->update($this->tablePrefix.'user' , ['status'=>$status] , ['id'=>$id])
            ->execute();
    }

    public function editInfoZo($data)
    {
        $data['zo_occupation'] = isset($data['zo_occupation']) ? implode(',', $data['zo_occupation']) : '';
        $data['zo_marriage'] = isset($data['zo_marriage']) ? implode(',', $data['zo_marriage']) : '';
        $data['zo_zodiac'] = isset($data['zo_zodiac']) ? implode(',', $data['zo_zodiac']) : '';
        $data['zo_constellation'] = isset($data['zo_constellation']) ? implode(',', $data['zo_constellation']) : '';
        $data['zo_address'] = isset($data['zo_address']) ? implode(',', $data['zo_address']) : '';
        $data['zo_other'] = isset($data['zo_other']) ? $data['zo_other'] : '';
        return $data;
    }

    public function editInfoInfo($data)
    {
        $data['age'] = $data['age'] ? strtotime($data['age']) : '';
        $data['level'] = isset($data['level']) ? $data['level'] : '';
        $data['local'] = isset($data['local']) ? $data['local'] : '';
        $data['head_pic'] = isset($data['head_pic']) ? $data['head_pic'] : '';
        $data['mate'] = isset($data['mate']) ? $data['mate'] : '';
        $data['haunt_address'] = isset($data['haunt_address']) ? $data['haunt_address'] : '';
        $data['work'] = isset($data['work']) ? $data['work'] : '';
        $data['blood'] = isset($data['blood']) ? $data['blood'] : '';
        return $data;
    }

    // 图片处理
    public function insertUserPhoto($user_id, $data)
    {
        //UserPhoto::getInstance()->deleteAll(['user_id' => $user_id]);
        // 上传身份证
        !empty($data['cardFace_List']) ? $this->upPhoto($user_id, 2, $data['cardFace_List']) : true;
        !empty($data['cardBack_List']) ? $this->upPhoto($user_id, 3, $data['cardBack_List']) : true;
        // 上传学历
        !empty($data['eduList']) ? $this->upPhoto($user_id, 4, $data['eduList']) : true;
        // 上传房产证
        !empty($data['houseList']) ? $this->upPhoto($user_id, 6, $data['houseList']) : true;
        // 上传婚姻证明
        !empty($data['marrList']) ? $this->upPhoto($user_id, 5, $data['marrList']) : true;
        // 上传照片
        if(!empty($data['headPic']) && !empty($data['photosList'])) {
            $photo = explode(',', $data['photosList']);
            $photo = array_merge([$data['headPic']], $photo);
            $photo = array_unique($photo);
            $this->upPhoto($user_id, 1, $photo);
        }
        //exit;
    }

    // 图片上传
    public function upPhoto($user_id, $type, $data)
    {
        $photo = $type == 1 ? $data : explode(',', $data);
        foreach($photo as $k => $v) {
            $arr[$k]['pic_path'] = str_replace('thumb', 'picture', $v);
            $arr[$k]['thumb_path'] = $v;
            $arr[$k]['is_check'] = 1;
            $arr[$k]['time'] = time();
            $arr[$k]['type'] = $type;
            /*if($type != 1) {
                $arr[$k]['type'] = $type;
            } else {
                UserPhoto::getInstance()->addPhoto($user_id, $arr[$k]);
            }*/
        }
        // 上传照片
        UserPhoto::getInstance()->savePhoto($arr, $user_id);
        if($type != 1) {
            $user = (new Query())->select('*')->from($this->tablePrefix.'user_information')->where(['user_id' => $user_id])->one();

            // 修改用户认证值
            if (($type == 2 || $type == 3) && $card = UserPhoto::getInstance()->getPhotoList($user_id, 23)) {
                if(count($card) == 2 && !($user['honesty_value'] & 1)) {
                    $user['honesty_value'] = $user['honesty_value'] + 1;
                } elseif($user['honesty_value'] & 1) {
                    $user['honesty_value'] = $user['honesty_value'] - 1;
                }
                $userInfo['has_identify'] = 1;
            } elseif ($type == 4) {
                if(!($user['honesty_value'] & 4)) {
                    $user['honesty_value'] = $user['honesty_value'] + 4;
                }
            } elseif ($type == 5) {
                if(!($user['honesty_value'] & 2)) {
                    $user['honesty_value'] = $user['honesty_value'] + 2;
                }
            } elseif ($type == 6) {
                if(!($user['honesty_value'] & 8)) {
                    $user['honesty_value'] = $user['honesty_value'] + 8;
                }
            }
            $userInfo['honesty_value'] = $user['honesty_value'];
            // 修改认证值
            $this->getDb()->createCommand()
                ->update($this->tablePrefix.'user_information', $userInfo, ['user_id' => $user_id])
                ->execute();
            //UserInformation::getInstance()->updateUserInfo($user_id, ['honesty_value' => $user['honesty_value']]);
            //$this->getDb()->createCommand()->update($this->tablePrefix.'user_information', ['honesty_value' => $user['honesty_value']], ['user_id' => $user_id])->execute();
        }
    }

    /**
     * 认证
     * @param $data
     * @return bool
     */
    public function auth($data){
        if ($data['honesty_value'] == 1){
            $type = [2,3];
            $data['has_identify'] = 1;
        }else if ($data['honesty_value'] == 2){
            $type = 5;
        }else if ($data['honesty_value'] == 4) {
            $type = 4;
        }else if ($data['honesty_value'] == 8) {
            $type = 6;
        }
        $user = (new Query())->from($this->tablePrefix.'user_information')
            ->where(['user_id' => $data['user_id']])
            ->select('honesty_value')
            ->all();
        if (is_array($user) && count($user) ==1){
            if ($user[0]['honesty_value'] & $data['honesty_value']){
                $honesty_value = $user[0]['honesty_value'];
            }else{
                $honesty_value = $user[0]['honesty_value'] + $data['honesty_value'];
            }
        }else{
            return 0;
        }
        $data['honesty_value'] = $honesty_value;
        $tran = \Yii::$app->db->beginTransaction();
        $flag1 = \Yii::$app->db->createCommand()
            ->update($this->tablePrefix.'user_information' ,$data ,['user_id'=>$data['user_id']])
            ->execute();
        $flag2 = $this->editPhoto($type,$data);

        if ($flag1 >0 && $flag2 > 0 ){
            $tran->commit();
            return 1;
        }else{
            $tran->rollBack();
            return 0;
        }

    }

    public function editPhoto($type,$data , $check = 1){
        return \Yii::$app->db->createCommand()
            ->update($this->tablePrefix.'user_photo' ,['is_check'=>$check], ['user_id'=>$data['user_id'] , 'type'=>$type])
            ->execute();
    }
}
