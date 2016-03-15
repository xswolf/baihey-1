<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/2/19
 * Time: 11:15
 */

namespace backend\controllers;


use backend\models\User;

class UserController extends BaseController
{
    public $enableCsrfValidation = false;

    /**
     * @return string
     * 用户列表
     */
    public function actionListUser() {
        $user = new User();
        $list = $user->getList();

        $this->assign('list',$list);
        return $this->render();
    }

    /**
     * @return string
     * 添加用户
     */
    public function actionCreateUser() {
        $auth = \Yii::$app->authManager;
        $list = $auth->getRoles();

        //提交处理
        if (\Yii::$app->request->post()) {
            $request = \Yii::$app->request;
            $userModel = new User();
            //判断用户名是否存在并添加用户分配角色
            if(!$userModel->getFindUser(['name'=>$request->post('name')]) && $userModel->addUser($request->post())) {
                $this->__success('添加成功', 'list-user');
            } else {
                $this->__error('添加失败');
            }
        }

        $this->assign('list',$list);
        return $this->render();
    }

    /**
     * @return string
     * 编辑用户
     */
    public function actionEditUser() {
        $auth = \Yii::$app->authManager;
        $request = \Yii::$app->request;
        $userModel = new User();
        $user = $userModel->getFindUser(['id' => $request->get('id')]);
        $userRole = $auth->getAssignments($request->get('id'));
        $roleList = $auth->getRoles();

        //用户已有角色处理
        $list = array();
        foreach($roleList as $key => $val) {
            if(!empty($userRole) && array_key_exists($key,$userRole)) {
                $list[$key] = 1;
            } else {
                $list[$key] = 0;
            }
        }

        if($request->post()) {
            if ($userModel->editUser($request->post())) {
                $this->__success('更新成功', 'list-user');
            } else {
                $this->__error('更新失败');
            }
        }

        $this->assign('user',$user);
        $this->assign('list',$list);
        return $this->render();
    }

    /**
     * @param null $id
     * 删除用户
     */
    public function actionDeleteUser($id = null) {
        $userModel = new User();
        if($userModel->delUser($id)) {
            $this->__success('删除成功', 'list-user');
        } else {
            $this->__error('删除失败');
        }
    }
}