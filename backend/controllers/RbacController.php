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

class RbacController extends Controller{

    /**
     * 添加角色
     */
    public function actionAddRole(){
        $role = new Role();
        $role->canSetProperty('name' , \Yii::$app->request->get('name'));
        $dbManager = new DbManager();
        if ( $dbManager->add($role) ){
            $this->render('_roleForm',['model'=>$role]);
        }else{
            die('程序异常');
        }
    }

    /**
     * 添加权限
     */
    public function actionAddItem(){
        $item = new Item();
        $item->canSetProperty('name' , \Yii::$app->request->get('name'));
        $dbManager = new DbManager();
        if ( $dbManager->add($item) ){
            $this->render('_itemForm',['model'=>$item]);
        }else{
            die('程序异常');
        }
    }

    /**
     * 权限归组。  一个角色所包含的权限
     * @param $parent
     * @param $child
     */
    public function actionAddItemChild($parent , $child){
        $dbManager = new DbManager();
        $parent = \Yii::$app->request->get('parent');
        $child = \Yii::$app->request->get('child');
        $dbManager->addChild($parent,$child);

    }

    /**
     * 设置用户所属角色组
     * @param $userId int
     * @param $itemName String
     */
    public function actionAssignment($userId , $itemName){

    }
}