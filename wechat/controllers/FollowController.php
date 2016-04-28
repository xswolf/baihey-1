<?php
namespace wechat\controllers;

use common\util\Cookie;
use common\models\UserFollow;


/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/27
 * Time: 14:55
 */
class FollowController extends BaseController
{

    /**
     * 关注列表
     */
    public function actionFollowList()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        $data = UserFollow::getInstance()->getFollowList('follow', $user_id, $this->get);

        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }

    /**
     * 被关注列表
     */
    public function actionFollowedList()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        $data = UserFollow::getInstance()->getFollowList('followed', $user_id, $this->get);

        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }

    /**
     * 获取关注我的总数
     */
    public function actionGetSumFollow()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        $data = UserFollow::getInstance()->getSumFollow($user_id);

        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }

    /**
     * 获取关注状态
     */
    public function actionGetFollowStatus()
    {
        $data = UserFollow::getInstance()->getFollowStatus($this->get);

        return $this->renderAjax(['status' => 1, 'data' => $data['status']]);
    }

    /**
     * 添加关注
     */
    public function actionAddFollow()
    {
        $data = UserFollow::getInstance()->addFollow($this->get);

        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }

    /**
     * 取消关注
     */
    public function actionDelFollow()
    {
        $data = UserFollow::getInstance()->delFollow($this->get);

        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }

    /**
     * 拉黑
     */
    public function actionBlackFollow()
    {
        $data = UserFollow::getInstance()->blackFollow($this->get);

        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }
}