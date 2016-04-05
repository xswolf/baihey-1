<?php
namespace wechat\controllers;

use wechat\models\User;

/**
 * 登录 控制层
 * Class UserController
 * @package wechat\controllers
 */
class UserController extends BaseController {

    public function beforeAction( $action ) {
        $this->layout = false;

        return parent::beforeAction( $action );
    }

    /**
     * 登录
     * @return string
     */
    public function actionLogin() {
        if ( \Yii::$app->request->get('username') && \Yii::$app->request->get('password') ) {
            if(User::getInstance()->login($this->get['username'], $this->get['password'])) {
                $this->renderAjax( [ 'status' => 1 , 'msg' => '登录成功' ] );
            } else {
                $this->renderAjax( [ 'status' => 0 , 'msg' => '登录失败' ] );
            }
        }

        return $this->render();
    }

    public function actionWelcome() {

        $this->weChatMember();
        return $this->render();
    }

    /**
     * 注册
     * @return string
     */
    public function actionRegister() {
        if ( \Yii::$app->request->get( 'mobile' ) ) {
            // 注册数据处理
            if ( \Yii::$app->request->get( 'log_code' ) == \Yii::$app->session->get( 'log_code' ) ) {
                $sex              = \Yii::$app->request->get( 'sex' );
                $data['sex']      = json_decode( $sex );
                $data['sex']      = $data['sex']->man ? 1 : 0;
                $data['username'] = \Yii::$app->request->get( 'mobile' );
                $data['password'] = substr( $data['username'] , - 6 );
                if ( User::getInstance()->addUser( $data ) ) {
                    \Yii::$app->messageApi->passwordMsg( $data['username'] , $data['password'] );
                    $this->renderAjax( [ 'status' => 1 , 'msg' => '注册成功' ] );
                } else {
                    $this->renderAjax( [ 'status' => 0 , 'msg' => '注册失败' ] );
                }
            } else {
                $this->renderAjax( [ 'status' => 0 , 'msg' => '验证码错误' ] );
            }
        }

        return $this->render();
    }

    public function actionForgetpass() {

        return $this->render();
    }

    public function actionSetpass() {

        if ( ! \Yii::$app->request->get( 'mobile' ) ) { //没有传入mobile参数，跳转至404页面
            $this->redirect( '/wap/site/error' );
        }

        return $this->render();
    }

    /**
     * 验证手机号是否存在
     * @return string
     */
    public function actionMobileIsExist() {
        if ( \Yii::$app->request->isGet ) {
            $data      = \Yii::$app->request->get();
            $userModel = new User();
            if ( $userModel->getUserByName( $data['mobile'] ) ) {
                $this->renderAjax( [ 'status' => 0 , 'msg' => '手机号码已存在' ] );
            } else {
                $this->renderAjax( [ 'status' => 1 , 'msg' => '该手机号可以注册' ] );
            }
        }
    }

    /**
     * 发送手机验证码
     */
    public function actionSendCodeMsg() {
        if ( \Yii::$app->request->isGet ) {
            $data = \Yii::$app->request->get();
            $this->renderAjax( [ 'status'   => \Yii::$app->messageApi->sendCode( $data['mobile'] ) ,
                                 'reg_code' => \Yii::$app->session->get( 'reg_code' )
            ] );
        }
    }

    /**
     * 验证客户端输入验证码是否与服务端一致
     */
    public function actionValidateCode() {
        if ( \Yii::$app->request->isGet ) {
            $data = \Yii::$app->request->get();
            $this->renderAjax( [ 'status' => \Yii::$app->messageApi->validataCode( $data['code'] ) ] );
        }
    }

}