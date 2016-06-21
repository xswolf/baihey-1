<?php
namespace wechat\controllers;

use common\models\Area;
use common\models\Bank;
use common\models\ConsumptionLog;
use common\models\User;
use common\models\UserFollow;
use common\models\UserInformation;
use common\models\UserPhoto;
use common\util\Cookie;
use wechat\models\Config;


/**
 * Site controller
 */
class MemberController extends BaseController
{


    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionIndex()
    {

        return $this->render();
    }

    public function actionInformation()
    {

        return $this->render();
    }

    /**
     * 保存用户数据
     */
    public function actionSaveData()
    {
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id');

        UserInformation::getInstance()->updateUserInfo($user_id, $this->get);
    }

    /**
     * 相册列表
     */
    public function actionPhotoList()
    {
        $user_id = isset($this->get['user_id']) ? $this->get['user_id'] : \common\util\Cookie::getInstance()->getCookie('bhy_id');
        $type = isset($this->get['type']) ? $this->get['type'] : 1;
        $pageSize = isset($this->get['pageSize']) ? $this->get['pageSize'] : 12;

        $list = UserPhoto::getInstance()->getPhotoList($user_id, $type, $pageSize);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 删除相片
     */
    public function actionDelPhoto()
    {
        $list = UserPhoto::getInstance()->delPhoto($this->get);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 保存图片(目前用于诚信认证)
     */
    public function actionSavePhoto()
    {
        $list = UserPhoto::getInstance()->savePhoto($this->get);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 设置头像
     */
    public function actionSetHead()
    {
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id');
        $list = UserPhoto::getInstance()->setHeadPic($user_id, $this->get);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 类型为2,3的地方列表
     */
    public function actionWentTravelList()
    {
        $this->renderAjax(['status=>1', 'data' => Area::getInstance()->getWentTravelList()]);
    }

    /**
     * 类型为2的地方列表
     */
    public function actionWantTravelList()
    {
        $pageIndex = $this->get['pageIndex'];
        $province_id = $this->get['province_id'] ? $this->get['province_id'] : 1;// 默认重庆
        $list = Area::getInstance()->getWantTravelList($province_id , $pageIndex);

        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 运动，电影，美食之一列表
     */
    public function actionConfigList()
    {
        $list = Config::getInstance()->getListByType($this->get['type']);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 获取去过的地方或者想去的地方的地区列表
     */
    public function actionGetTravelList()
    {
        $list = Area::getInstance()->getTravelListById($this->get['area_id']);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 获取去过的地方或者想去的地方的地区列表
     */
    public function actionGetConfigList()
    {
        $list = Config::getInstance()->getListById($this->get['config_id']);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 获取发过的个人动态
     */
    public function actionGetDynamicList()
    {
        isset($this->get['page']) ? $page = $this->get['page'] : $page = 0;
        isset($this->get['user_id']) ? $userId = $this->get['user_id'] : $userId = -1;

        $list = User::getInstance()->getDynamicList($userId, $page);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 获取user_info页面所需信息
     */
    public function actionUserInfoPageById()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        // 获取用户信息
        $userInfo = User::getInstance()->getUserById($this->get['id']);
        // 获取用户相册
        $userPhoto = UserPhoto::getInstance()->getPhotoList($this->get['id']);
        // 获取用户动态
        $dynamic = User::getInstance()->getDynamicList($this->get['id']);
        // 获取关注状态
        $followStatus = UserFollow::getInstance()->getFollowStatus(['user_id' => $user_id, 'follow_id' => $this->get['id']]);
        $followStatus = $followStatus ? $followStatus['status'] : false;
        // 获取被关注状态
        $followedStatus = UserFollow::getInstance()->getFollowStatus(['user_id' => $this->get['id'], 'follow_id' => $user_id]);
        $followedStatus = $followedStatus ? $followedStatus['status'] : false;

        if($userInfo) {
            $this->renderAjax(['status'=>1, 'userInfo' => $userInfo, 'userPhoto' => $userPhoto, 'dynamic' => $dynamic, 'followStatus' => $followStatus, 'followedStatus' => $followedStatus, 'msg' => 'user_info页面获取信息成功']);
        } else {
            $this->renderAjax(['status'=>0, 'userInfo' => $userInfo, 'userPhoto' => $userPhoto, 'dynamic' => $dynamic, 'followStatus' => $followStatus, 'followedStatus' => $followedStatus, 'msg' => 'user_info页面获取信息失败']);
        }
    }

    /**
     * 设置点赞
     */
    public function actionSetClickLike()
    {
        if ($this->get['add'] == 1) {
            $flag = User::getInstance()->setClickLike($this->get['dynamicId'], $this->get['user_id'], $this->get['add']);

        } else {
            $flag = User::getInstance()->cancelClickLike($this->get['dynamicId'], $this->get['user_id'], $this->get['add']);

        }
        $this->renderAjax(['status=>1', 'data' => $flag]);
    }

    /**
     * 发布个人动态
     */
    public function actionAddDynamic()
    {

        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;

        $data['user_id'] = $user_id;
        $data['auth'] = $this->get['auth'];
        $data['address'] = $this->get['address'];
        $data['name'] = $this->get['name'];
        $data['pic'] = isset($this->get['pic']) ? $this->get['pic'] : '';
        $data['content'] = isset($this->get['content']) ? $this->get['content'] : '';
        $flag = User::getInstance()->addDynamic($data);
        if ($flag > 0) {
            $data = User::getInstance()->getDynamicById(\Yii::$app->db->lastInsertID);
            $this->renderAjax(['status=>1', 'data' => $data[0]]);
        } else {
            $this->renderAjax(['status=>-1', 'data' => '发布失败']);
        }
    }

    /**
     * 获取单条动态内容
     */
    public function actionGetDynamic()
    {

        $data = User::getInstance()->getDynamicById($this->get['id']);
        $data[0]['comment'] = User::getInstance()->getCommentById($this->get['id']);
        $this->renderAjax(['status=>1', 'data' => $data[0]]);
    }

    /**
     * 获取动态评论内容
     */
    public function actionGetComment()
    {

        $list = User::getInstance()->getCommentById($this->get['id']);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 发布评论
     */
    public function actionAddComment()
    {

        $data['content'] = $this->get['content'];
        $data['private'] = $this->get['private'] == 'true' ? 1 : 0;
        $data['dynamicId'] = $this->get['dynamicId'];
        $data['create_time'] = time();
        $id = User::getInstance()->addComment($data);
        $this->renderAjax(['status=>1', 'data' => ['id' => $id, 'create_time' => $data['create_time']]]);
    }

    /**
     * 获取关注列表
     */
    public function actionGetFollow()
    {

        $list = User::getInstance()->getFollowList();
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 获取红包信息
     */
    public function actionBriberyInfo()
    {
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        $data = User::getInstance()->briberyInfo($user_id);
        $this->renderAjax(['status=>1', 'data' => $data]);
    }

    /**
     * 获取发送或收到的红包列表
     */
    public function actionBriberyList()
    {

        isset($this->get['page']) ? $page = $this->get['page'] : $page = 0;
        $flag = $this->get['flag'] == 'true' ? true : false;
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
        $year = isset($this->get['year']) ?  $this->get['year'] : 0;
        $data = User::getInstance()->getBriberyList($user_id, $flag, $page , $year);
        $this->renderAjax(['status=>1', 'data' => $data]);
    }

    public function actionConsumptionList()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        if($data = ConsumptionLog::getInstance()->getUserConsumptionLogList($user_id)) {
            $this->renderAjax(['status=>1', 'data' => $data, 'msg' => '获取数据成功']);
        } else {
            $this->renderAjax(['status=>0', 'data' => $data, 'msg' => '获取数据失败']);
        }
    }

    /**
     * 获取用户银行卡列表
     */
    public function actionCashCardList()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        if($data = User::getInstance()->getCashCardList($user_id)) {
            $this->renderAjax(['status=>1', 'data' => $data, 'msg' => '获取数据成功']);
        } else {
            $this->renderAjax(['status=>0', 'data' => $data, 'msg' => '获取数据失败']);
        }
    }

    /**
     * 删除银行卡
     */
    public function actionDelCard()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        if($data = User::getInstance()->delCard($user_id, $this->get['id'])) {
            $this->renderAjax(['status=>1', 'data' => $data, 'msg' => '删除数据成功']);
        } else {
            $this->renderAjax(['status=>0', 'data' => $data, 'msg' => '删除数据失败']);
        }
    }

    /**
     * 添加银行卡
     */
    public function actionAddCashCard()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        if($data = User::getInstance()->addCashCard($user_id, $this->get)) {
            $this->renderAjax(['status=>1', 'data' => $data, 'msg' => '添加银行卡成功']);
        } else {
            $this->renderAjax(['status=>0', 'data' => $data, 'msg' => '添加银行卡失败']);
        }
    }

    /**
     * 获取单张银行卡信息
     */
    public function actionCashCardById()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        if($data = User::getInstance()->getCashCardById($user_id, $this->get['id'])) {
            $this->renderAjax(['status=>1', 'data' => $data, 'msg' => '获取数据成功']);
        } else {
            $this->renderAjax(['status=>0', 'data' => $data, 'msg' => '获取数据失败']);
        }
    }

    /**
     * 银行卡列表
     */
    public function actionBankList()
    {
        if($data = Bank::getInstance()->bankList()) {
            $this->renderAjax(['status=>1', 'data' => $data, 'msg' => '删除数据成功']);
        } else {
            $this->renderAjax(['status=>0', 'data' => $data, 'msg' => '删除数据失败']);
        }
    }

    /**
     * 退出登录
     */
    public function actionLoginOut()
    {
        $data = User::getInstance()->loginOut();
        $this->renderAjax(['status=>1', 'data' => $data]);
    }
}
