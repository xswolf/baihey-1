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
class User extends \common\models\Base
{

    protected $user;
    protected $user_id;
    protected $_user_information_table = 'user_information';

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
            'password' => md5(md5($password))
        ];
        if ($user = $this->findOne($condition)) {
            $time = YII_BEGIN_TIME;
            $user->last_login_time = $time;
            $user->save(false);
            // 写入用户日志表
            $log['user_id'] = $user->id;
            $log['type'] = 1;
            $log['time'] = $time;
            $this->userLog($log);

            // 设置cookie
            Cookie::getInstance()->setCookie('bhy_u_name', $user['username']);
            Cookie::getInstance()->setCookie('bhy_id', $user['id']);
            setcookie('bhy_u_sex', $user['sex'], $time + 3600 * 24 * 30, '/wap');
            return $user;
        }

        return false;
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
            'head_pic' => '未知',
            'real_name' => '未知',
            'identity_id' => '未知',
            'age' => '未知',
            'height' => '未知',
            'level' => '未知',
            'is_marriage' => '未知',
        ];
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
            ->from(static::tableName() . ' u')
            ->innerJoin($joinTable . ' i', "u.id=i.user_id")
            ->where(['username' => $name])
            ->one();

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

        $userLog = Base::getInstance('user_log');
        $userLog->user_id = $log['user_id'];
        $userLog->type = $log['type'];
        $userLog->time = $log['time'];
        $userLog->ip = ip2long($_SERVER["REMOTE_ADDR"]);
        return $userLog->insert(false);
    }

    /**
     * 获取用户列表
     * @return array
     */
    public function userList($where = [])
    {
        $pageSize = 3;
        // 查询条件处理
        $where = $this->getUserListWhere($where, $pageSize);
        $offset = $where['offset'];

        $condition = $this->processWhere($where['where']);
        $joinTable = \Yii::$app->getDb()->tablePrefix . $this->_user_information_table;

        $result = (new Query())->select(['*'])
            ->where($condition)
            ->from(static::tableName() . ' u')
            ->innerJoin($joinTable . ' i', "u.id=i.user_id")
            ->limit($pageSize)
            ->offset($offset);

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
            $data['where']['id'] = $where['id'];
        } else {

            foreach ($where as $key => $val) {

                switch ($key) {
                    case 'sex':
                        if (is_numeric($val)) {
                            $data['where']['sex'] = $val;
                        }
                        break;

                    case 'pageNum':
                        $data['offset'] = ($val - 1) * $pageSize;
                        break;

                    case 'age':
                        if (is_numeric($val)) {
                            $age = $this->getTimestampByAge($val);
                            $data['where']["json_extract(info,'$.age')"] = ['>=', $age];
                        } else {

                            $age = explode('-', $val);
                            $age1 = $this->getTimestampByAge($age[0]);
                            $age2 = $this->getTimestampByAge($age[1]);
                            $data['where']["json_extract(info,'$.age')"] = ['between' => [$age2, $age1]];
                        }
                        break;

                    case 'height':
                        $data['where']["json_extract(info,'$.height')"] = $this->getRangeWhere($val);
                        break;

                    case 'year_income':
                        $data['where']["json_extract(info,'$.year_income')"] = $this->getRangeWhere($val);
                        break;

                    default:
                        $data['where']["json_extract(info,'$." . $key . "')"] = $val;
                        break;
                }
            }
        }
        $data['where']["json_extract(info,'$.head_pic')"] = ['!=' => '未知'];

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
     * @param $name
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
}