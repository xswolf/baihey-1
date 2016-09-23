<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/14
 * Time: 16:51
 */

namespace backend\controllers;

use backend\models\User;
use yii\web\Controller;

class LoginController  extends Controller{

    public $enableCsrfValidation = false;

    public function actionIndex(){
        $this->layout = false;
        if(\Yii::$app->request->isAjax) {
            $user = new User();
            $data = \Yii::$app->request->post();
            $userInfo = $user->getFindUser(['name'=>$data['name']]);
            $pass = md5(md5($data['password']));
            \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;  //将响应数据转json格式
            if( !$userInfo || $userInfo['password'] != $pass) {             //验证用户登录信息
                return ['msg'=>'用户名或密码错误','status'=>0];
            } else {
                if($member = \common\models\User::getInstance()->getUserByPhone($userInfo['phone'])) {
                    $userInfo['member'] = $member;
                }
                $auth = \Yii::$app->authManager;
                $userRole = $auth->getAssignments($userInfo['id']);
                $role = "";
                foreach ($userRole as $k=>$v){
                    if ($k=='admin') {
                        $role="admin";
                        break;
                    }
                    $role .= ",". $k ;
                }
                $userInfo['role'] = $role;
                $user->setUserSession($userInfo);                           //设置Session
                return ['msg'=>'登录成功','status'=>1];
            }
        }
        return $this->render('index.html');
    }

    public function actionLogout() {
        \Yii::$app->session->remove(USER_SESSION);
        $this->redirect('index');
    }
}