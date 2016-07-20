<?php
namespace wechat\models;

use common\util\Cookie;
use yii\db\Query;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/10
 * Time: 10:21
 */
class User extends \common\models\User
{

    protected $user;
    protected $user_id;
    protected $_user_information_table = 'user_information';

    public static function tableName()
    {
        return \Yii::$app->db->tablePrefix . 'user';
    }

    /**
     * 用户登录
     * @param $userName
     * @param $password
     * @return bool
     */
    public function login($userName, $password)
    {
        $condition = [
            'username' => $userName,
            'password' => md5(md5($password)),
        ];
        $user = $this->findOne($condition) ? $this->findOne($condition) : $this->findOne(['id' => $userName, 'password' => md5(md5($password))]);

        return $user;
    }

    /**
     * 新增/注册用户
     * @param $data
     * @return bool
     * @throws \yii\db\Exception
     */
    public function addUser($data)
    {

        $db = $this->getDb();
        $transaction = $db->beginTransaction();// 启动事件

        // 数据处理
        $data['password'] = md5(md5($data['password']));
        $time = YII_BEGIN_TIME;
        $data['reg_time'] = $time;
        $data['last_login_time'] = $time;
        $data['reset_pass_time'] = $time;

        // user表 数据写入
        $user = $db->createCommand()
            ->insert($this->tableName(), $data)
            ->execute();

        if ($user) {
            $id = $db->getLastInsertID();// 获取id
        }

        // user_information表 数据处理
        $infoData['user_id'] = $id;
        $userInfo = [
            'age'                   => '',// 出生年月时间戳
            'level'                 => '',// vip等级
            'local'                 => '',// 当地地区（地区切换使用）
            'height'                => '',// 身高
            'head_pic'              => '',// 头像
            'real_name'             => '',// 真实姓名
            'identity_id'           => '',// 身份证号码
            'identity_address'      => '',// 身份证地址
            'is_marriage'           => '',// 婚姻状况
            'is_child'              => '',// 子女状况
            'education'             => '',// 学历
            'year_income'           => '',// 年收入
            'is_purchase'           => '',// 购房状况
            'is_car'                => '',// 购车状况
            'occupation'            => '',// 职业
            'children_occupation'   => '',// 子职业
            'zodiac'                => '',// 属相生肖
            'constellation'         => '',// 星座
            'mate'                  => '',// 对未来伴侣的期望
            'nation'                => '',// 民族
            'wechat'                => '',// 微信
            'qq'                    => '',// QQ
            'haunt_address'         => '',// 常出没地
            'work'                  => '',// 工作单位
            'blood'                 => '',// 血型
            'school'                => '',// 学校
            // 择偶标准
            'zo_age'                => '18-0',// 年龄
            'zo_height'             => '140-0',// 最小身高
            'zo_education'          => '',// 最小学历
            'zo_marriage'           => '',// 婚姻状况
            'zo_house'              => '',// 购房
            'zo_car'                => '',// 购车
            'zo_zodiac'             => '',// 属相
            'zo_constellation'      => '',// 星座
        ];
        // 身份证照片
        $userAuth = [
            'identity_pic1'     => '',// 身份证正面
            'identity_pic2'     => '',// 反面
            'identity_check'    => false,// 审核状态true通过，false未通过
            'identity_time'     => '',// 时间
            'marriage_pic1'     => '',// 离婚证正面
            'marriage_pic2'     => '',// 反面
            'marriage_check'    => false,// 审核状态true通过，false未通过
            'marriage_time'     => '',// 时间
            'education_pic1'    => '',// 学历学位证
            'education_pic2'    => '',// 毕业证
            'education_check'   => false,// 审核状态true通过，false未通过
            'education_time'    => '',// 时间
            'house_pic1'        => '',// 房产证正面
            'house_pic2'        => '',// 反面
            'house_check'       => false,// 审核状态true通过，false未通过
            'house_time'        => '',// 时间
        ];
        $infoData['auth'] = json_encode($userAuth);
        $infoData['info'] = json_encode($userInfo);
        $infoData['city'] = 1;

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

        return $id;
    }

    /**
     * 通过用户名返回用户信息
     * @param $name
     * @return array|bool|null
     */
    public function getUserByName($name)
    {
        $joinTable = \Yii::$app->getDb()->tablePrefix . $this->_user_information_table;
        $row = (new Query())
            ->select('*')
            ->from($this->tablePrefix.'user' . ' u')
            ->innerJoin($joinTable . ' i', "u.id=i.user_id")
            ->where(['u.username' => $name]);

        //echo $row->createCommand()->getRawSql();exit;
        $row = $row->one();

        if (!$row) {
            return null;
        }
        return $row;
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

    public function getUserById($id)
    {
        $joinTable = \Yii::$app->getDb()->tablePrefix . $this->_user_information_table;
        $row = (new Query())
            ->select('*')
            ->from($this->tablePrefix.'user' . ' u')
            ->innerJoin($joinTable . ' i', "u.id=i.user_id")
            ->where(['u.id' => $id]);

        //echo $row->createCommand()->getRawSql();exit;
        $row = $row->one();

        if (!$row) {
            return null;
        }

        return $row;
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
     * 获取用户列表
     * @return array
     */
    public function userList($where = [])
    {
        $pageSize = isset($where['pageSize']) ? $where['pageSize'] : 6;
        if (isset($where['cityName'])) {
            setcookie('bhy_u_city', json_encode($where['cityName']), YII_BEGIN_TIME + 3600 * 24 * 30, '/wap');
            setcookie('bhy_u_cityId', $where['city'], YII_BEGIN_TIME + 3600 * 24 * 30, '/wap');
            unset($where['cityName']);
        }
        unset($where['pageSize']);
        // 查询条件处理
        $where = $this->getUserListWhere($where, $pageSize);
        $offset = $where['offset'];

        $condition = $this->processWhere($where['where']);
        $joinTable = \Yii::$app->getDb()->tablePrefix . $this->_user_information_table;

        $result = (new Query())->select(['*'])
            ->where($condition)
            ->from($this->tablePrefix.'user' . ' u')
            ->innerJoin($joinTable . ' i', "u.id=i.user_id")
            ->orderBy('u.id desc, u.last_login_time desc')
            ->limit($pageSize)
            ->offset($offset);
        if(!isset($where['where']['u.id'])) {
            $result->
            innerJoin($this->tablePrefix . 'user_photo p', "u.id=p.user_id and p.is_check=1 and p.is_head=1 and p.type=1");
        }

        //echo $result->createCommand()->getRawSql();
        $result = $result->all();
        return $result;
    }

    /**
     * 获取userlist条件
     * @param $where
     * @param int $pageSize
     * @return mixed
     */
    public function getUserListWhere($where, $pageSize = 10)
    {
        $where['pageNum'] = isset($where['pageNum']) ? $where['pageNum'] : 1;

        if (isset($where['id']) && is_numeric($where['id'])) {

            $data['offset'] = ($where['pageNum'] - 1) * $pageSize;
            $data['where']['u.id'] = $where['id'];
        } else {

            foreach ($where as $key => $val) {

                switch ($key) {
                    case 'city':
                    case 'sex' :
                        if (is_numeric($val)) {
                            $data['where'][$key] = $val;
                        }
                        break;

                    case 'pageNum':
                        $data['offset'] = ($val - 1) * $pageSize;
                        break;

                    case 'age':
                        if (is_numeric($val)) {
                            if ($val != 0) {
                                //$age = $this->getTimestampByAge($val);
                                //$data['where']["json_extract(info,'$.age')"] = ['>=', $age];
                                $data['where']['age'] = ['>=', $val];
                            }
                        } else {
                            $age = explode('-', $val);
                            //$age1 = $this->getTimestampByAge($age[0]);
                            //$age2 = $this->getTimestampByAge($age[1]);
                            //$data['where']["json_extract(info,'$.age')"] = ['between' => [$age2, $age1]];
                            $data['where']['age'] = ['between' => [$age[0], $age[1]]];
                        }
                        break;

                    case 'height':
                        if ($val != 0) {
                            $data['where']["json_extract(info,'$.height')"] = $this->getRangeWhere($val);
                        }
                        break;

                    default:
                        if ($val != 0) {
                            $data['where']["json_extract(info,'$." . $key . "')"] = $val;
                        }
                        break;
                }
            }
            $data['where']["json_extract(info,'$.head_pic')"] = ['!=' => ''];
        }
        $data['where']['is_show'] = 1;
        $data['where']['status'] = ['between' => [1, 2]];

        return $data;
    }

    /**
     * 获取年龄生日时间戳
     * @param $age
     * @return int
     */
    public function getTimestampByAge($age)
    {

        $time = time();
        $year = date('Y', $time) - $age;
        $date = date('-m-d');
        $ageTimestamp = strtotime($year . $date);
        //$date = date('Y-m-d',$ageTimestamp);
        return $ageTimestamp;
    }

    /**
     * 获得范围条件
     * @param $data
     * @return array
     */
    public function getRangeWhere($data)
    {
        if (is_numeric($data)) {

            $where = ['>=', $data];
        } else {

            $data = explode('-', $data);
            $where = ['between' => [$data[0], $data[1]]];
        }
        return $where;
    }

    /**
     * 更新用户数据
     * @param $user_id
     * @param $data
     * @return bool|int
     * @throws \yii\db\Exception
     */
    public function updateUserData($user_id, $data)
    {
        $row = false;
        if ($data && $this->findOne($user_id)) {
            $_user_table = $this->tablePrefix.'user';// 表名
            switch (key($data)) {
                case 'phone':
                case 'sex':
                    $sql = "UPDATE {$_user_table} SET ".key($data)." = ".$data[key($data)]." WHERE id={$user_id}";
                    break;
                default:
                    $sql = "UPDATE {$_user_table} SET ".key($data)." = '".$data[key($data)]."' WHERE id={$user_id}";
                    break;
            }

            $row = $this->getDb()->createCommand($sql)->execute();
        }
        return $row;
    }

    /**
     * 打开红包
     * @param $briberyId
     * @return int
     * @throws \yii\db\Exception
     */
    public function openBribery($briberyId)
    {
        $tran = \Yii::$app->db->beginTransaction();
        $bribery = UserBribery::findOne($briberyId);
        if ($bribery->status == 1) return -1; // 红包已经领取

        $bribery->status = 1;
        if ($bribery->save() && $this->changeBalance($bribery->receive_user_id, -$bribery->money)) {
            $tran->commit();
            return 1;
        }
        $tran->rollBack();
        return 0;
    }

    public function resetPassword($user_id, $where)
    {
        if($user = $this->findOne(['id' => $user_id,'password' => md5(md5($where['pass']))])) {
            $time = YII_BEGIN_TIME;
            $user->password = md5(md5($where['new_pass1']));
            $user->reset_pass_time = $time;
            if($user->save(false)) {
                return $time;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}