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
            $createPost = $auth->createPermission($item);
            $createPost->description = '创建了 ' . $item . ' 许可';
            $auth->add($createPost);
            $this->__success("添加成功" , "list-permission");
        }
        return $this->render("create-permission");
    }

    public function actionListPermission(){

        $list = \Yii::$app->authManager->getPermissions();


        return $this->render('list-permission' , [
            "list" => $list
        ]);
    }

    /**
     * 创建角色
     * @param $item
     */
    public function actionCreateRole($item)
    {
        $auth = \Yii::$app->authManager;

        $role = $auth->createRole($item);
        $role->description = '创建了 ' . $item . ' 角色';
        $auth->add($role);
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