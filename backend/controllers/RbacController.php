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

class RbacController extends BaseController{

    public function actionTest(){

    }
    /**
     * 创建权限
     * @param $item
     */
    public function actionCreatePermission()
    {
        if (\Yii::$app->request->post()){
            $auth = \Yii::$app->authManager;
            $item = \Yii::$app->request->post("item");
            //判断是否存在
            if(!$auth->getPermission($item)) {
                $createPost = $auth->createPermission($item);
                $createPost->description = '创建了 ' . $item . ' 许可';
                $auth->add($createPost);
                $this->__success("添加成功" , "list-permission");
            } else {
                $this->__error("权限重复" , "list-permission");
            }
        }
        return $this->render("create-permission");
    }

    /**
     * 编辑权限
     * @return string
     */
    public function actionEditPermission()
    {
        if (\Yii::$app->request->post()){
            $auth = \Yii::$app->authManager;
            $item = \Yii::$app->request->post("item");
            $name = \Yii::$app->request->post("name");
            //判断是否存在
            if(!$auth->getPermission($name)) {
                $object = $auth->createPermission($item);
                $auth->update($name, $object);
                $this->__success("更新成功", "list-permission");
            } else {
                $this->__error("权限重复", "list-permission");
            }
        }
        return $this->render('edit-permission',[
            'name' => \Yii::$app->request->get('item')
        ]);
    }

    /**
     * 权限列表
     * @return string
     */
    public function actionListPermission(){
        $list = \Yii::$app->authManager->getPermissions();

        return $this->render('list-permission' , [
            "list" => $list,
            "test" => 'test'
        ]);
    }

    /**
     * 删除权限
     *
     */
    public function actionDeletePermission(){
        $name = \Yii::$app->request->get('name');
        $item = \Yii::$app->authManager->getPermission($name);
        \Yii::$app->authManager->remove($item);

        $this->__success("删除成功" , "list-permission");
    }

    /**
     * 创建角色
     * @param $item
     */
    public function actionCreateRole()
    {
        if (\Yii::$app->request->post()){
            $auth = \Yii::$app->authManager;
            $item = \Yii::$app->request->post("item");
            //判断是否存在
            if(!$auth->getRole($item)) {
                $createPost = $auth->createRole($item);
                $createPost->description = '创建了 ' . $item . ' 角色';
                $auth->add($createPost);
                $this->__success("添加成功" , "list-role");
            } else {
                $this->__error("角色重复" , "list-role");
            }

        }
        return $this->render("create-role");
    }

    /**
     * 编辑角色
     * @return string
     */
    public function actionEditRole()
    {
        if (\Yii::$app->request->post()){
            $auth = \Yii::$app->authManager;
            $item = \Yii::$app->request->post("item");
            $name = \Yii::$app->request->post("name");
            //判断是否存在
            if(!$auth->getRole($name)) {
                $object = $auth->createRole($item);
                $auth->update($name, $object);
                $this->__success("更新成功", "list-role");
            } else {
                $this->__error("角色重复", "list-role");
            }
        }
        return $this->render('edit-role',[
            'name' => \Yii::$app->request->get('item')
        ]);
    }

    /**
     * 角色列表
     * @return string
     */
    public function actionListRole(){
        $list = \Yii::$app->authManager->getRoles();

        return $this->render('list-role' , [
            'list' => $list
        ]);
    }

    /**
     * 删除角色
     *
     */
    public function actionDeleteRole(){
        $name = \Yii::$app->request->get('name');
        $item = \Yii::$app->authManager->getRole($name);
        \Yii::$app->authManager->remove($item);

        $this->__success("删除成功" , "list-role");
    }

    /**
     * 给角色分配权限
     * @param $items
     */

    static public function createEmpowerment($items)
    {
        $auth = \Yii::$app->authManager;

        $parent = $auth->createRole($items['name']);
        $child = $auth->createPermission($items['description']);

        $auth->addChild($parent, $child);
    }

    /**
     * 给用户分配角色
     * @param $item
     */

    static public function assign($item)
    {
        $auth = \Yii::$app->authManager;
        $reader = $auth->createRole($item['name']);
        $auth->assign($reader, $item['description']);
    }


    /**
     * 权限验证
     * @param \yii\base\Action $action
     * @return bool
     * @throws \yii\web\UnauthorizedHttpException
     */
//    public function beforeAction($action)
//    {
//        $action = Yii::$app->controller->action->id;
//        if(\Yii::$app->user->can($action)){
//            return true;
//        }else{
//            throw new \yii\web\UnauthorizedHttpException('对不起，您现在还没获此操作的权限');
//        }
//    }






}