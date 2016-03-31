<?php
namespace wechat\controllers;
use wechat\models\User;

/**
 * 登录 控制层
 * Class ChargeController
 * @package wechat\controllers
 */
class UserController extends BaseController{

    public function beforeAction($action)
    {
        $this->layout = false;
        return parent::beforeAction($action);
    }

    public function actionLogin(){
        return $this->render();
    }

    public function actionWelcome(){
        return $this->render();
    }

    public function actionRegister(){
        if(\Yii::$app->request->post()) {
            $userModel = new User();
            $data['username'] = \Yii::$app->request->post('username');
            $data['password'] = rand(100000, 999999);
            if($userModel->addUser($data)) {
                \Yii::$app->message->passwordMessage(13452398854,123456);
                return $this->renderAjax(11111);
            } else {
                return $this->renderAjax(11111);
            }
        }

        return $this->render();
    }

    /**
     * 验证手机号是否存在
     * @return string
     */
    public function actionMobileIsExist() {
        $username = \Yii::$app->request->get('mobile');
        $userModel = new User();
        // 将响应数据转json格式
        //\Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        if($userModel->getUserByName($username)) {
            //return ['status'=>0,'该手机号已存在'];
            return 0;
        } else {
           //return ['status'=>1,'msg'=>'手机号可用'];
            return 1;
        }
    }

}