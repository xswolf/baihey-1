<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/18
 * Time: 16:42
 */

namespace backend\controllers;



class RbacController extends BaseController {

    public function actionTest() {

    }

    /**
     * 创建权限
     * @return string
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

        return $this->render();
    }

    /**
     * 编辑权限
     * @return string
     */
    public function actionEditPermission()
    {
        $auth = \Yii::$app->authManager;
        if (\Yii::$app->request->post()){
            $item = \Yii::$app->request->post('item');//旧
            $name = \Yii::$app->request->post('name');
            $description = \Yii::$app->request->post('description');
            //判断是否存在
            if($item == $name) {
                $editPost = $auth->createPermission($name);
                $editPost->description = $description;
                $auth->update($item, $editPost);
                $this->__success('更新成功', 'list-permission');
            } elseif(!$auth->getPermission($name)) {
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
            $this->assign('name',$permission->name);
            $this->assign('description',$permission->description);
            return $this->render();
        }
    }

    /**
     * 权限列表
     * @return string
     */
    public function actionListPermission() {
        $list = \Yii::$app->authManager->getPermissions();

        $this->assign('list',$list);
        $this->assign('test','test');
        return $this->render();
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
     * @return string
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

        return $this->render();
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
            if (!$auth->getRole($item)) {
                $object = $auth->createRole($item);
                $auth->update($name, $object);
                $this->__success('更新成功', 'list-role');
            } else {
                $this->__error('角色重复', 'list-role');
            }
        }
        $this->assign('name',\Yii::$app->request->get('item'));
        return $this->render();
    }

    /**
     * 角色列表
     * @return string
     */
    public function actionListRole() {
        $list = \Yii::$app->authManager->getRoles();
        $this->assign('list',$list);
        return $this->render();
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
     * @return string
     * @throws \yii\db\Exception
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
        $this->assign('name',$request->get('item'));
        $this->assign('list',$list);
        return $this->render();
    }

    /**
     * 给用户分配角色
     * @return string
     * @throws \yii\db\Exception
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

        $this->assign('name',$request->get('uid'));
        $this->assign('list',$list);
        return $this->render();
    }


    /**
     * 权限验证
     * @param \yii\base\Action $action
     * @return bool
     * @throws \yii\web\UnauthorizedHttpException
     */
    public function actionBeforeAction()
    {
        $action = explode('?',$_SERVER['REQUEST_URI']);
        var_dump($action[0]);
        exit;
        if(\Yii::$app->user->can($action)){
            return true;
        }else{
            throw new \yii\web\UnauthorizedHttpException('对不起，您现在还没获此操作的权限');
        }
    }


}