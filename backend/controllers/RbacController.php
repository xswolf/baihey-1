<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/18
 * Time: 16:42
 */

namespace backend\controllers;


use yii\base\Controller;
use yii\rbac\DbManager;
use yii\rbac\Role;
use yii\rbac\Item;

class RbacController extends BaseController {

    public function actionTest() {

    }

    /**
     * 创建权限
     *
     * @param $item
     */
    public function actionCreatePermission() {
        if ( \Yii::$app->request->post() ) {
            $auth = \Yii::$app->authManager;
            $name = \Yii::$app->request->post('name');
            $description = \Yii::$app->request->post('description');
            //判断是否存在
            if(!$auth->getPermission($name)) {
                $createPost = $auth->createPermission($name);
                $createPost->description = $description;
                $auth->add($createPost);
                $this->__success('添加成功', 'list-permission');
            } else {
                $this->__error('权限重复', 'list-permission');
            }
        }

        return $this->render('create-permission');
    }

    /**
     * 编辑权限
     * @return string
     */
    public function actionEditPermission()
    {
        $auth = \Yii::$app->authManager;
        if (\Yii::$app->request->post()){
            $item = \Yii::$app->request->post('item');
            $name = \Yii::$app->request->post('name');
            $description = \Yii::$app->request->post('description');
            //判断是否存在
            if(!$auth->getPermission($name)) {
                $editPost = $auth->createPermission($name);
                $editPost->description = $description;
                $auth->update($item, $editPost);
                $this->__success('更新成功', 'list-permission');
            } else {
                $this->__error('权限重复' , 'list-permission');
            }
        }
        if(\Yii::$app->request->get('item')) {
            $permission = $auth->getPermission(\Yii::$app->request->get('item'));
            return $this->render('edit-permission', [
                'name' => $permission->name,
                'description' => $permission->description
            ]);
        }
    }

    /**
     * 权限列表
     * @return string
     */
    public function actionListPermission() {
        $list = \Yii::$app->authManager->getPermissions();

        return $this->render('list-permission', ['list' => $list, 'test' => 'test']);
    }

    /**
     * 删除权限
     *
     */
    public function actionDeletePermission() {
        $name = \Yii::$app->request->get('name');
        $item = \Yii::$app->authManager->getPermission($name);
        \Yii::$app->authManager->remove($item);

        $this->__success('删除成功', 'list-permission');
    }

    /**
     * 创建角色
     *
     * @param $item
     */
    public function actionCreateRole() {
        if ( \Yii::$app->request->post() ) {
            $auth = \Yii::$app->authManager;
            $item = \Yii::$app->request->post('item');
            //判断是否存在
            if ( !$auth->getRole($item) ) {
                $createPost              = $auth->createRole($item);
                $createPost->description = '创建了 ' . $item . ' 角色';
                $auth->add( $createPost );
                $this->__success('添加成功', 'list-role');
            } else {
                $this->__error('角色重复', 'list-role');
            }

        }

        return $this->render('create-role');
    }

    /**
     * 编辑角色
     * @return string
     */
    public function actionEditRole() {
        if ( \Yii::$app->request->post() ) {
            $auth = \Yii::$app->authManager;
            $item = \Yii::$app->request->post('item');
            $name = \Yii::$app->request->post('name');
            //判断是否存在
            if ( ! $auth->getRole($name) ) {
                $object = $auth->createRole($item);
                $auth->update($name, $object);
                $this->__success('更新成功', 'list-role');
            } else {
                $this->__error('角色重复', 'list-role');
            }
        }

        return $this->render('edit-role', ['name' => \Yii::$app->request->get('item')]);
    }

    /**
     * 角色列表
     * @return string
     */
    public function actionListRole() {
        $list = \Yii::$app->authManager->getRoles();

        return $this->render('list-role', ['list' => $list]);
    }

    /**
     * 删除角色
     *
     */
    public function actionDeleteRole() {
        $db = \Yii::$app->db;
        $auth = \Yii::$app->authManager;
        $name = \Yii::$app->request->get('name');
        $item = $auth->getRole($name);
        $transaction = $db->beginTransaction();
        //清除原有权限
        if(!$auth->removeChildren($item)) {
            $transaction->rollBack();
            $this->__error('清除权限失败');
        }
        if(!$auth->remove($item)) {
            $transaction->rollBack();
            $this->__error('删除失败');
        }
        \Yii::$app->authManager->remove($item);
        $transaction->commit();
        $this->__success('删除成功', 'list-role');
    }

    /**
     * 给角色分配权限
     *
     * @param $items
     */
    public function actionCreateEmpowerment() {
        $request = \Yii::$app->request;
        $auth = \Yii::$app->authManager;

        //角色已有权限处理
        $info = $auth->getChildren($request->get('item'));
        $permissionsList = $auth->getPermissions();
        $list = array();
        foreach($permissionsList as $key => $val) {
            if(!empty($info) && array_key_exists($key,$info)) {
                $list[$key] = 1;
            } else {
                $list[$key] = 0;
            }
        }

        //提交处理
        if ( $request->post() ) {
            $parent      = $request->post('parent');
            $children    = $request->post('child');
            $db          = \Yii::$app->db;
            $parentChild = $auth->getChildren($parent);
            $transaction = $db->beginTransaction();
            //清除原有权限
            if(!empty($parentChild) && !$auth->removeChildren($auth->getRole($parent))) {
                $transaction->rollBack();
                $this->__error('清除权限失败');
            }

            //重新授权
            if(!empty($children)) {
                foreach ($children as $v) {
                    if (!$auth->addChild($auth->getRole($parent), $auth->getPermission($v))) {
                        $transaction->rollBack();
                        $this->__error('添加失败');
                    }
                }
            }
            $transaction->commit();
            $this->__success('添加成功', 'list-role');
        }

        return $this->render( 'create-empowerment', ['name' => $request->get('item'), 'list' => $list]);
    }

    /**
     * 给用户分配角色
     *
     * @param $item
     */
    public function actionAssign() {
        $request = \Yii::$app->request;
        $auth = \Yii::$app->authManager;

        //用户已有角色处理
        $info = $auth->getAssignments($request->get('uid'));
        $roleList = $auth->getRoles();
        $list = array();
        foreach($roleList as $key => $val) {
            if(!empty($info) && array_key_exists($key,$info)) {
                $list[$key] = 1;
            } else {
                $list[$key] = 0;
            }
        }

        //提交处理
        if ( $request->post() ) {
            $db = \Yii::$app->db;
            $uid = $request->post('uid');
            $role = $request->post('role');
            $uidRole = $auth->getAssignments($uid);
            $transaction = $db->beginTransaction();
            //清除原有角色
            if(!empty($uidRole) && !$auth->revokeAll($uid)) {
                $transaction->rollBack();
                $this->__error('清除角色失败');
            }

            //重新分配角色
            if(!empty($role)) {
                foreach ($role as $v) {
                    if (!$auth->assign($auth->getRole($v), $uid)) {
                        $transaction->rollBack();
                        $this->__error('添加失败');
                    }
                }
            }
            $transaction->commit();
            $this->__success('添加成功', 'assign');
        }

        return $this->render( 'assign', ['name' => $request->get('uid'), 'list' => $list]);
    }


    /**
     * 权限验证
     *
     * @param \yii\base\Action $action
     *
     * @return bool
     * @throws \yii\web\UnauthorizedHttpException
     */
    //    public function beforeAction($action)
    //    {
    //        $action = \Yii::$app->controller->action->id;
    //        if(\Yii::$app->user->can($action)){
    //            return true;
    //        }else{
    //            throw new \yii\web\UnauthorizedHttpException('对不起，您现在还没获此操作的权限');
    //        }
    //    }


}