<?php
namespace backend\models;
use yii\base\Model;
use yii\db\Connection;
use yii\db\Query;
use yii\di\Instance;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/2/22
 * Time: 16:31
 */
class User extends Model
{
    public $db = 'db';

    public $file;

    public $userTable = '{{%auth_user}}';

    protected $user = null;

    public function init()
    {
        parent::init();
        $this->db = \Yii::$app->db;
    }

    public function rules()
    {
        return [
                [['file'], 'file']
            ];
    }

    public function getUser(){
        return $this->user;
    }

    public function setUser($data){
        return $this->user = $data;
    }

    /**
     * 设置用户信息到session
     * @param $user
     */
    public function setUserSession($user) {
        \Yii::$app->session->set(USER_SESSION,$user);
    }

    /**
     * @return array|null
     * 获取列表
     */
    public function getList($where = [])
    {
        $authAssignmentTable = \Yii::$app->db->tablePrefix . 'auth_assignment';
        $authUserTable = \Yii::$app->db->tablePrefix . 'auth_user';
        if (isset($where['group'])) {
            $aaWhere = " AND aa.item_name='" . $where['group'] ."'";
            unset($where['group']);
        } else {
            $aaWhere = '';
        }
        $row = (new Query)
            ->select('*')
            ->from($authUserTable . ' AS au')
            ->innerJoin($authAssignmentTable . ' AS aa', "aa.user_id=au.id". $aaWhere)
            ->where($where)
            ->all();

        return $row;
    }

    /**
     * @param array $where
     * @return array|bool|null
     * 获取单条记录
     */
    public function getFindUser($where=[])
    {
        $row = (new Query)
            ->select('*')
            ->from($this->userTable)
            ->where($where)
            ->one($this->db);

        if ($row === false) {
            return null;
        }
        return $row;
    }

    /**
     * @param array $where
     * @param string $order
     * @param string $limit
     * @return $this|array|null
     * 获取用户列表
     */
    public function getListUser($where=[],$order='',$limit='') {
        if(!$limit) {
            $row = (new Query)
                ->select(['id', 'name', 'password', 'status', 'created_at', 'updated_at'])
                ->from($this->userTable)
                ->where($where)
                ->orderBy($order)
                ->all();
        } else {
            $row = (new Query)
                ->select(['id', 'name', 'password', 'status', 'created_at', 'updated_at'])
                ->from($this->userTable)
                ->where($where)
                ->orderBy($order)
                ->limit($limit);
        }
        if ($row === false) {
            return null;
        }
        return $row;
    }

    /**
     * @param $data
     * @return bool
     * @throws \yii\base\Exception
     * 新增用户
     */
    public function addUser($data) {
        $auth = \Yii::$app->authManager;
        $time = time();
        if(isset($data['file_upload'])) {
            unset($data['file_upload']);
        }
        $data['created_at'] = $time;
        $data['updated_at'] = $time;
        $data['password'] = md5(md5($data['password']));
        if(isset($data['role'])) {
            $role = $data['role'];
            unset($data['role']);
        } else {
            $role = false;
        }
        $this->db->createCommand()
            ->insert($this->userTable, $data)
            ->execute();
        $id = $this->db->getLastInsertID();
        if($id && $role) {
            foreach($role as $vo) {
                $auth->assign($auth->getRole($vo),$id);
            }
        }
        return true;
    }

    /**
     * @param $data
     * @return bool
     * @throws \yii\base\Exception
     * 编辑用户
     */
    public function editUser($data) {
        $auth = \Yii::$app->authManager;
        $time = time();
        if(isset($data['file_upload'])) {
            unset($data['file_upload']);
        }
        $data['updated_at'] = $time;
        if($data['password']) {
            $data['password'] = md5(md5($data['password']));
        } else {
            unset($data['password']);
        }

        $uid = $data['id'];
        if(isset($data['role'])) {
            $role = $data['role'];
            unset($data['role']);
        } else {
            $role = false;
        }
        $row = $this->db->createCommand()
            ->update($this->userTable, $data, ['id' => $data['id']])
            ->execute();

        $uidRole = $auth->getAssignments($uid);
        if(!empty($uidRole) && !$auth->revokeAll($uid)) {
            $this->__error('清除角色失败');
        }

        //重新分配角色
        if($row && !empty($role)) {
            foreach ($role as $v) {
                if (!$auth->assign($auth->getRole($v), $uid)) {
                    $this->__error('添加失败');
                }
            }
        }
        return true;
    }

    /**
     * 删除用户
     * @param $id
     * @return mixed
     */
    public function delUser($id) {
        //删除用户角色
        $auth = \Yii::$app->authManager;
        $uidRole = $auth->getAssignments($id);
        if(!empty($uidRole) && !$auth->revokeAll($id)) {
            $this->__error('清除角色失败');
        }

        // 删除用户
        $row = $this->db->createCommand()
            ->delete($this->userTable, ['id' => $id])
            ->execute();
        return $row;
    }

    /**
     * 更新用户数据
     * @param $data
     * @return mixed
     */
    public function updateAuthUser($data)
    {
        $id = $data['id'];
        $row = $this->db->createCommand()
            ->update($this->userTable, $data, ['id' => $id])
            ->execute();

        return $row;
    }

    /**
     * 设置值班
     * @param $id
     * @return mixed
     */
    public function setDuty($id)
    {
        $this->db->createCommand()
            ->update($this->userTable, ['duty' => 0])
            ->execute();
        $row = $this->db->createCommand()
            ->update($this->userTable, ['duty' => 1], ['id' => $id])
            ->execute();

        return $row;
    }
}