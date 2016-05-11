<?php
namespace wechat\controllers;
use common\models\UserInformation;
use common\models\UserPhoto;


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
        $this->renderAjax(['status=>1' , 'data'=>$list] );
    }

    public function actionDelPhoto()
    {
        $list = UserPhoto::getInstance()->delPhoto($this->get);
        $this->renderAjax(['status=>1' , 'data'=>$list] );
    }

}
