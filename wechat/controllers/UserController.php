<?php
namespace wechat\controllers;

use common\util\Cookie;
use wechat\models\User;

/**
 * 登录 控制层
 * Class UserController
 * @package wechat\controllers
 */
class UserController extends BaseController {

    public function beforeAction( $action ) {
        $this->layout = false;
        $this->enableCsrfValidation = false;
        return parent::beforeAction( $action );
    }

    /**
     * 登录
     * @return string
     */
    public function actionLogin() {

        // 判断是否自动登录
        if($this->isLogin()) { return $this->redirect('/wap/site');}

        //判断是否点击提交
        if ( \Yii::$app->request->get('username') && \Yii::$app->request->get('password') ) {

            if(User::getInstance()->login($this->get['username'], $this->get['password'])) {

                // 设置COOKIE
                Cookie::getInstance()->setCookie( 'bhy_u_name' , $this->get['username'] );
                return $this->renderAjax( [ 'status' => 1 , 'msg' => '登录成功' ] );

            } else {

                return $this->renderAjax( [ 'status' => 0 , 'msg' => '登录失败' ] );
            }
        }

        return $this->render();
    }

    /**
     * 微信登录
     */
    public function actionWxLogin(){

        $appId = \Yii::$app->wechat->appId;
        $redirectUri = urlencode("http://wechat.baihey.com/wap/user/welcome");
        $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$appId}&redirect_uri={$redirectUri}&response_type=code&scope=snsapi_base&state=123#wechat_redirect";

        $this->redirect($url);
    }

    /**
     * 欢迎页面
     * @return string
     */
    public function actionWelcome() {

        $user = $this->weChatMember();
        if(!isset($_COOKIE["bhy_u_name"]) && isset($user) && isset($user['username'])) {

            Cookie::getInstance()->setCookie('bhy_u_name' , $user['username']);

        }
        return $this->render();
    }

    /**
     * 注册
     * @return string
     */
    public function actionRegister() {

        // 判断是否提交注册
        if ( \Yii::$app->request->get( 'mobile' ) ) {

            // 验证码判断
            if ( \Yii::$app->request->get( 'code' ) == \Yii::$app->session->get( 'reg_code' ) ) {
                // 注册数据处理
                $sex              = \Yii::$app->request->get( 'sex' );
                $data['sex']      = json_decode( $sex );
                $data['sex']      = $data['sex']->man ? 1 : 0;
                $data['username'] = \Yii::$app->request->get( 'mobile' );
                $data['password'] = substr( $data['username'] , - 6 );
                // 添加用户
                if ( User::getInstance()->addUser( $data ) ) {

                    // 发送默认密码
                    \Yii::$app->messageApi->passwordMsg( $data['username'] , $data['password'] );

                    // 设置cookie
                    Cookie::getInstance()->setCookie('bhy_u_name', $data['username']);

                    return $this->renderAjax( [ 'status' => 1 , 'msg' => '注册成功' ] );
                } else {

                    return $this->renderAjax( [ 'status' => 0 , 'msg' => '注册失败' ] );
                }
            } else {

                return $this->renderAjax( [ 'status' => 2 , 'msg' => '验证码错误' ] );
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
            // 通过手机号查询用户信息
            if ( User::getInstance()->getUserByName( $data['mobile'] ) ) {

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