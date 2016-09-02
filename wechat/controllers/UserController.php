<?php
namespace wechat\controllers;

use common\models\UserFollow;
use common\models\UserPhoto;
use common\util\AutoAddress;
use common\util\Cookie;
use common\util\Verify;
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
        $this->layout               = false;
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
            $id == "" ? $id = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value : '';
            $userInfo = User::getInstance()->getUserById($id);
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


        $token = \Yii::$app->request->get('token');
        $id    = \Yii::$app->request->get('id');
        if ($token && $id && $token == md5($id . 'jzBhY2016-jr' . \Yii::$app->request->get('time'))) {
            \common\models\User::getInstance()->loginOut();
            //            if ($user = User::getInstance()->getUserByPhone($id)){
            if ($user = User::getInstance()->getUserById($id)) {
                Cookie::getInstance()->setLoginCookie($user);
                return $this->redirect('/wap/site/main#/message');
            }
        }

        // 判断是否自动登录
        if ($this->isLogin()) {
            return $this->redirect('/wap');
        }

        //判断是否点击提交
        if (\Yii::$app->request->get('username') && \Yii::$app->request->get('password')) {
            if ($user = User::getInstance()->login($this->get['username'], $this->get['password'])) {

                if ($user['status'] < 3) {
                    $data = \common\models\User::getInstance()->getUserById($user['id']);
                    // 用户登录日志
                    \common\models\User::getInstance()->loginLog($user['id']);
                    // 设置登录cookie
                    Cookie::getInstance()->setLoginCookie($user);
                    return $this->renderAjax(['status' => 1, 'msg' => '登录成功', 'data' => $data]);
                } else {
                    // 删除登录cookie
                    Cookie::getInstance()->delLoginCookie();
                    return $this->renderAjax(['status' => 0, 'msg' => '您的账号异常，已经被限制登录！', 'data' => []]);
                }
            } else {
                return $this->renderAjax(['status' => 0, 'msg' => '账号或密码错误', 'data' => []]);
            }
        }

        return $this->render();
    }

    public function actionCheckCode()
    {
        $Verify = new Verify();
        return $Verify->check($this->get['verify_code']);
    }

    public function actionGetVerify()
    {
        $config = array(
            'fontSize' => 30,    // 验证码字体大小
            'length' => 4,     // 验证码位数
            'useNoise' => false, // 关闭验证码杂点
        );

        $Verify = new Verify($config);
        $Verify->entry();
    }

    /**
     * 微信登录
     */
    public function actionWxLogin()
    {

        $appId       = \Yii::$app->wechat->appId;
        $redirectUri = urlencode("http://wechat.baihey.com/wap/user/welcome");
        $url         = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$appId}&redirect_uri={$redirectUri}&response_type=code&scope=snsapi_base&state=123#wechat_redirect";

        $this->redirect($url);
    }

    /**
     * 欢迎页面
     * @return string
     */
    public function actionWelcome()
    {
        $user = $this->weChatMember();
        /*$url = 'http://wechat.baihey.com/wap';
        header("Cache-Control: no-cache");
        header("Pragma: no-cache");
        header("Location:$url");*/
        if (!isset($_COOKIE["bhy_u_name"]) && isset($user) && $user['status'] < 3) {

            // 登录日志
            \common\models\User::getInstance()->loginLog($user['id']);
            // 设置登录cookie
            Cookie::getInstance()->setLoginCookie($user);
        } elseif (isset($_COOKIE["bhy_u_name"]) && $user && $user['status'] > 2) {
            // 删除登录cookie
            Cookie::getInstance()->delLoginCookie();
        }
        //        echo "<script>location.href='".$url."'</script>";
        return $this->render();
    }

    public function actionGetLocation()
    {

        $url      = 'http://api.map.baidu.com/geocoder/v2/?coordtype=wgs84ll&output=json&ak=Zh7mCxOxCyteqEhmCZtKPmhG&pois=0&location=' . \Yii::$app->request->get('lat') . ',' . \Yii::$app->request->get('lng');
        $result   = file_get_contents($url);
        $result   = json_decode($result);
        $cityName = $result->result->addressComponent->city;
        AutoAddress::getInstance()->autoAddress($cityName);
        exit();
    }

    /**
     * 注册
     * @return string
     */
    public function actionRegister()
    {
        session_start();
        $args = \Yii::$app->request->get();

        // 微信授权
        if (isset($args['code'])) {
            $wechatMember           = \Yii::$app->wechat->getMemberByCode($args['code']);
            $_SESSION['code_wx_id'] = $wechatMember['openid'];
            $_SESSION['qdid']       = $args['qdid'];
        }


        // 判断是否提交注册
        if (\Yii::$app->request->get('mobile')) {

            // 验证码判断
            //            if ($this->get['code'] == \Yii::$app->session->get('reg_code')) {

            // 注册数据处理
            $data['phone'] = $this->get['mobile'];
            $data['sex']   = $this->get['sex'];
            $data['wx_id'] = isset($_SESSION['code_wx_id']) ? $_SESSION['code_wx_id'] : "";
            // 设置是否是红娘推荐
            isset($_SESSION['qdid']) ? $data['matchmaker'] = $_SESSION['qdid'] : "";

            // 验证手机号是否存在
            if (\common\models\User::getInstance()->mobileIsExist($data['phone'])) {
                return $this->renderAjax(['status' => 0, 'msg' => '手机号已存在！~', 'data' => []]);
            }

            if (isset($_SESSION['code_wx_id']) && \common\models\User::getInstance()->wxIsExist($_SESSION['code_wx_id'])) {
                return $this->renderAjax(['status' => 0, 'msg' => '微信已存在', 'data' => []]);
            }

            // 添加用户
            $userInfo = \common\models\User::getInstance()->addUser($data);
            if ($userInfo) {
                // 写入用户日志表
                $log['user_id']     = $userInfo['id'];
                $log['type']        = 2;
                $log['create_time'] = time();
                \common\models\User::getInstance()->userLog($log);
                // 模拟登录
                $data = \common\models\User::getInstance()->getUserById($userInfo['id']);
                // 登录日志
                \common\models\User::getInstance()->loginLog($userInfo['id']);
                // 设置登录cookie
                Cookie::getInstance()->setLoginCookie($data);

                // 发送默认密码
                //                    \Yii::$app->messageApi->passwordMsg($userInfo['username'], $userInfo['password']);

                return $this->renderAjax(['status' => 1, 'msg' => '注册成功', 'data' => $data]);
            } else {
                return $this->renderAjax(['status' => 0, 'msg' => '注册失败', 'data' => []]);
            }
            //            } else {
            //                return $this->renderAjax(['status' => 2, 'msg' => '验证码错误', 'data' => []]);
            //            }
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

                $this->renderAjax(['status' => 0, 'msg' => '该手机号码已存在']);
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

            $get = \Yii::$app->request->get();
            if (\Yii::$app->messageApi->sendCode($get['mobile'])) {
                $this->renderAjax(['status' => 1]);
            } else {
                $this->renderAjax(['status' => 0, 'msg' => '发送验证码失败！']);
            }

        }
    }

    /**
     * 验证客户端输入验证码是否与服务端一致
     */
    public function actionValidateCode()
    {

//        return $this->renderAjax(['status' => 1]); // TODO 测试
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
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        $list    = User::getInstance()->resetPassword($user_id, $this->get);
        $this->renderAjax(['status' => 1, 'data' => $list]);
    }

    /**
     * 找回密码
     */
    public function actionForgotPassword()
    {
        $user                    = \common\models\User::getInstance()->getUserByPhone($this->get['phone']);
        $data['password']        = md5(md5($this->get['password']));
        $data['reset_pass_time'] = time();
        if ($list = \common\models\User::getInstance()->editUserTableInfo($user['id'], $data)) {
            $this->renderAjax(['status' => 1, 'data' => $list, 'msg' => '修改成功']);
        } else {
            $this->renderAjax(['status' => 0, 'data' => [], 'msg' => '修改失败']);
        }
    }

    /**
     * 更新用户数据
     */
    public function actionUpdateUserData()
    {
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        $list    = User::getInstance()->updateUserData($user_id, $this->get);
        $this->renderAjax(['status' => 1, 'data' => $list]);
    }

    /**
     * 首页是否显示数据
     */
    public function actionIndexIsShowData()
    {
        if ($user_id = Cookie::getInstance()->getCookie('bhy_id')) {
            $blacked     = UserFollow::getInstance()->getFollowList('blacked', $user_id);
            $follow      = UserFollow::getInstance()->getFollowList('followed', $user_id);
            $blackedList = [];
            $followList  = [];
            foreach ($blacked as $k => $v) {
                $blackedList[] = $v['user_id'];
            }
            foreach ($follow as $k => $v) {
                $followList[] = $v['user_id'];
            }
            $honestyStatus = UserPhoto::getInstance()->getPhotoList($user_id, 2, 2);
            $headpicStatus = UserPhoto::getInstance()->userHeadpic($user_id);
            $this->renderAjax(['status' => 1, 'blacked' => $blackedList, 'follow' => $followList, 'honestyStatus' => $honestyStatus, 'headpicStatus' => $headpicStatus]);
        } else {
            $this->renderAjax(['status' => 1, 'blacked' => [], 'follow' => [], 'honestyStatus' => [], 'headpicStatus' => []]);
        }

    }

}