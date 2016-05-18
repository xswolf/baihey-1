<?php
namespace wechat\controllers;

use common\models\Area;
use common\models\User;
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
    public function actionWentTravelList()
    {
        $list = Area::getInstance()->getWentTravelList();
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 类型为2的地方列表
     */
    public function actionWantTravelList()
    {
        $province_id = $this->get['province_id'] ? $this->get['province_id'] : 1;// 默认重庆
        $list = Area::getInstance()->getWantTravelList($province_id);

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
    public function actionGetDynamicList(){

        isset($this->get['page']) ? $page = $this->get['page'] : $page = 0;
        isset($this->get['user_id']) ? $userId = $this->get['user_id'] : $userId = -1;
        if ($userId > 0){
            // 个人动态
            $list = User::getInstance()->getDynamicList($this->get['user_id'] , $page);

        }else{
            // 发现
            $list =[];

        }
        $this->renderAjax(['status=>1', 'data' => $list]);
    }

    /**
     * 设置点赞
     */
    public function actionSetClickLike(){
        if ($this->get['add'] == 1){
            $flag = User::getInstance()->setClickLike($this->get['dynamicId'],$this->get['user_id'] , $this->get['add']);

        }else{
            $flag = User::getInstance()->cancelClickLike($this->get['dynamicId'],$this->get['user_id'] , $this->get['add']);

        }
        $this->renderAjax(['status=>1', 'data' => $flag]);
    }

    /**
     * 发布个人动态
     */
    public function actionAddDynamic(){

        $user_id = \common\util\Cookie::getInstance()->getCookie('bhy_id')->value;
//        var_dump($user_id);exit;
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
        }else{
            $this->renderAjax(['status=>-1', 'data' => '发布失败']);
        }
    }
}
