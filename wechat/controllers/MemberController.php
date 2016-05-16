<?php
namespace wechat\controllers;

use common\models\Area;
use common\models\UserInformation;
use common\models\UserPhoto;
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
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id');

        $list = UserPhoto::getInstance()->getPhotoList($user_id);
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
     * 设置头像
     */
    public function actionSetHead()
    {
        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id');
        $list = UserPhoto::getInstance()->setHeadPic($user_id, $this->get);
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 类型为1的地方列表
     */
    public function actionAreaTravelList()
    {
        $list = Area::getInstance()->getAreaTravelList();
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

}
