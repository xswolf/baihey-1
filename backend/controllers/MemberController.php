<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/26 0026
 * Time: 上午 10:05
 */

namespace backend\controllers;


use common\models\User;

class MemberController extends BaseController
{

    public function actionSearch(){

        $list = User::getInstance()->lists();
        $this->assign('list' , $list);
        return $this->render();
    }

    public function actionSave(){
        if($data = \Yii::$app->request->post()){
            if ($data['phone'] == '' || $data['info']['real_name'] == '') {
                return $this->__error('信息不全');
            }
            $data['username'] = $data['phone'];
            $uid = \common\models\User::getInstance()->addUser($data);
            if ($uid>0){
                return  $this->__success('添加成功');
            }else{
                return  $this->__error('添加失败');
            }
        }
        return $this->render();
    }

    public function actionInfo(){
        return $this->render();
    }
}