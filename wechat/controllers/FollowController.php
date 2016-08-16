<?php
namespace wechat\controllers;

use common\models\User;
use common\util\Cookie;
use common\models\UserFollow;
use yii\db\Query;


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
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        $type = $this->get['type'];
        if (empty($type)) {
            $type = 'follow';
        }
        $data = UserFollow::getInstance()->getFollowList($type, $user_id, $this->get);
        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }

    /**
     * 黑名单列表
     */
    public function actionBlackList()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        $data = UserFollow::getInstance()->getFollowList('black', $user_id, $this->get);

        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }

    /**
     * 被拉黑名单列表
     */
    public function actionBlackedList()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id') ? Cookie::getInstance()->getCookie('bhy_id') : 0;
        if (!$user_id) {
            return $this->renderAjax(['status' => 0, 'data' => [], 'msg' => '用户未登录']);
        }
        if ($data = UserFollow::getInstance()->getFollowList('blacked', $user_id, $this->get)) {
            return $this->renderAjax(['status' => 1, 'data' => $data, 'msg' => '获取数据成功']);
        } else {
            return $this->renderAjax(['status' => 0, 'data' => [], 'msg' => '获取数据失败']);
        }
    }

    /**
     * 获取关注我的总数
     */
    public function actionGetSumFollow()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        $data = UserFollow::getInstance()->getSumFollow('followed', $user_id);

        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }

    /**
     * 获取拉黑的总数
     */
    public function actionGetSumBlack()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        $data = UserFollow::getInstance()->getSumFollow('black', $user_id);

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

    /**
     * 取消拉黑
     */
    public function actionDelBlack()
    {
        $data = UserFollow::getInstance()->delBlack($this->get);

        return $this->renderAjax(['status' => 1, 'data' => $data]);
    }

    /**
     * 是否有新关注用户
     * @return string|void
     */
    public function actionIsNewFollow(){
        $res = UserFollow::getInstance()->getNewFollow($this->get['user_id']);
        if ($res['num'] > 0 ){
            return $this->renderAjax(['status' => 1,'data'=>$res['num'], 'message' => '有新关注用户']);
        }
        return $this->renderAjax(['status' => 0,'data'=>$res['num'], 'message' => '无新关注用户']);

    }

    /**
     * 设置已看状态
     * @return string|void
     */
    public function actionSetChecked(){

        if (UserFollow::getInstance()->setFollowChecked($this->get['user_id'])){
            return $this->renderAjax(['status' => 1, 'message' => '设置成功']);
        }
        return $this->renderAjax(['status' => 0, 'message' => '设置失败']);
    }
}