<?php
namespace wechat\controllers;

use common\util\AutoAddress;
use common\util\Cookie;
use common\util\Curl;
use wechat\models\Area;
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
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }

    /**
     * 获取的当前登录状态
     */
    public function actionGetLoginStatus()
    {
        if ($this->isLogin()) {
            return $this->renderAjax(['status' => 1, 'msg' => '已登录']);
        } else {
            return $this->renderAjax(['status' => 0, 'msg' => '未登录']);
        }
    }

    /**
     * 获取当前用户信息
     */
    public function actionGetUserInfo()
    {
        if ($this->isLogin()) {
            $id = (int)\Yii::$app->request->get('id');
            $userName = Cookie::getInstance()->getCookie('bhy_u_name');
            if (isset($id) && $id>0){
                $userInfo = User::getInstance()->getUserById($id);

            }else{
                $userInfo = User::getInstance()->getUserByName($userName);

            }
            return $this->renderAjax(['status' => 1, 'msg' => '成功', 'data' => $userInfo]);
        } else {
            return $this->renderAjax(['status' => 0, 'msg' => '失败']);
        }
    }

    /**
     * 登录
     * @return string
     */
    public function actionLogin()
    {

        // 判断是否自动登录
        if ($this->isLogin()) {
            return $this->redirect('/wap/site/main');
        }

        //判断是否点击提交
        if (\Yii::$app->request->get('username') && \Yii::$app->request->get('password')) {

            if ($data = User::getInstance()->login($this->get['username'], $this->get['password'])) {

                return $this->renderAjax(['status' => 1, 'msg' => '登录成功', 'data' => $data]);
            } else {
                return $this->renderAjax(['status' => 0, 'msg' => '登录失败', 'data' => $data]);
            }
        }

        return $this->render();
    }

    /**
     * 微信登录
     */
    public function actionWxLogin()
    {

        $appId = \Yii::$app->wechat->appId;
        $redirectUri = urlencode("http://wechat.baihey.com/wap/user/welcome");
        $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$appId}&redirect_uri={$redirectUri}&response_type=code&scope=snsapi_base&state=123#wechat_redirect";

        $this->redirect($url);
    }

    /**
     * 欢迎页面
     * @return string
     */
    public function actionWelcome()
    {
        $user = $this->weChatMember();

        // 地区是否存cookie，否则存
        if (!isset($_COOKIE['bhy_u_city']) && !isset($_COOKIE['bhy_u_cityId'])) {

            // 自动获取地区并存储cookie
            AutoAddress::getInstance()->autoAddress();
        }
        if (!isset($_COOKIE["bhy_u_name"]) && isset($user) && isset($user['username'])) {

            Cookie::getInstance()->setCookie('bhy_u_name', $user['username']);
            Cookie::getInstance()->setCookie('bhy_id', $user['id']);
            setcookie('bhy_user_id', $user['id'], YII_BEGIN_TIME + 3600 * 24 * 30, '/wap');
        }
        return $this->render();
    }

    /**
     * 注册
     * @return string
     */
    public function actionRegister()
    {
        // 判断是否提交注册
        if (\Yii::$app->request->get('mobile')) {

            // 验证码判断
            if (\Yii::$app->request->get('code') == \Yii::$app->session->get('reg_code')) {

                // 注册数据处理
                $sex = \Yii::$app->request->get('sex');
                $data['sex'] = json_decode($sex);
                $data['sex'] = $data['sex']->man ? 1 : 0;
                $data['username'] = \Yii::$app->request->get('mobile');
                $data['phone'] = $data['username'];
                $data['password'] = substr($data['username'], -6);

                // 验证手机号是否存在
                if (User::getInstance()->getUserByName($data['username'])) {
                    return $this->renderAjax(['status' => 0, 'msg' => '手机号已存在', 'data' => []]);
                }

                // 添加用户
                $userId = User::getInstance()->addUser($data);
                if ($userId) {
                    // 模拟登录
                    $data = User::getInstance()->login($data['username'], $data['password']);

                    // 发送默认密码
                    \Yii::$app->messageApi->passwordMsg($data['username'], $data['password']);

                    return $this->renderAjax(['status' => 1, 'msg' => '注册成功', 'data' => $data]);
                } else {
                    return $this->renderAjax(['status' => 0, 'msg' => '注册失败', 'data' => []]);
                }
            } else {
                return $this->renderAjax(['status' => 2, 'msg' => '验证码错误', 'data' => []]);
            }
        }

        return $this->render();
    }

    public function actionForgetpass()
    {

        return $this->render();
    }

    public function actionSetpass()
    {

        if (!\Yii::$app->request->get('mobile')) { //没有传入mobile参数，跳转至404页面
            $this->redirect('/wap/site/error');
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
            // 通过手机号查询用户信息
            if (User::getInstance()->mobileIsExist($this->get['mobile'])) {

                $this->renderAjax(['status' => 0, 'msg' => '手机号码已存在']);
            } else {

                $this->renderAjax(['status' => 1, 'msg' => '该手机号可以注册']);
            }
        }
    }

    /**
     * 发送手机验证码
     */
    public function actionSendCodeMsg()
    {
        if (\Yii::$app->request->isGet) {

            $data = \Yii::$app->request->get();
            $this->renderAjax(['status' => \Yii::$app->messageApi->sendCode($data['mobile']),
                'reg_code' => \Yii::$app->session->get('reg_code')
            ]);
        }
    }

    /**
     * 验证客户端输入验证码是否与服务端一致
     */
    public function actionValidateCode()
    {

        if (\Yii::$app->request->isGet) {

            $data = \Yii::$app->request->get();
            $this->renderAjax(['status' => \Yii::$app->messageApi->validataCode($data['code'])]);
        }
    }

    /**
     * 修改密码
     */
    public function actionResetPassword()
    {
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id');
        $list = User::getInstance()->resetPassword($user_id, $this->get);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 更新用户数据
     */
    public function actionUpdateUserData()
    {
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id');
        $list = User::getInstance()->updateUserData($user_id, $this->get);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

}