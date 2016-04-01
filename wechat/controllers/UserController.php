<?php
namespace wechat\controllers;

use wechat\models\User;

/**
 * 登录 控制层
 * Class UserController
 * @package wechat\controllers
 */
class UserController extends BaseController
{

    public function beforeAction($action)
    {
        $this->layout = false;
        return parent::beforeAction($action);
    }

    public function actionLogin()
    {
        return $this->render();
    }

    public function actionWelcome()
    {
        return $this->render();
    }

    public function actionRegister()
    {
        if(\Yii::$app->request->isPost) {
            $userModel = new User();
            $data = \Yii::$app->request->post();
            if($userModel->addUser($data)) {
                \Yii::$app->messageApi->passwordMsg(15084410950,substr($data['mobile'],-6));
                $this->renderAjax(['status'=>1,'msg'=>'注册成功']);
            } else {
                $this->renderAjax(['status'=>0,'msg'=>'注册失败']);
            }
        }

        return $this->render();
    }

    /**
     * 验证手机号是否存在
     * @return string
     */
    public function actionMobileIsExist()
    {
        if (\Yii::$app->request->isGet) {
            $data = \Yii::$app->request->get();
            $userModel = new User();
            if($userModel->getMobileExist($data['mobile'])){
                $this->renderAjax(['status' => 0, 'msg' => '手机号码已存在']);
            }else{
                $this->renderAjax(['status' => 1, 'msg' => '该手机号可以注册']);
            }
        }
    }

    public function actionSendCodeMsg(){
        if (\Yii::$app->request->isGet) {
            $data = \Yii::$app->request->get();
            $this->renderAjax(['status'=>\Yii::$app->messageApi->sendCode($data['mobile'])]);
        }
    }

    public function actionValidateCode(){
        if (\Yii::$app->request->isGet) {
            $data = \Yii::$app->request->get();
            $this->renderAjax(['status'=>\Yii::$app->messageApi->validataCode($data['code'])]);
        }
    }

}