<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/26 0026
 * Time: 上午 10:05
 */

namespace backend\controllers;


use common\models\Area;
use common\models\ChargeGoods;
use common\models\ChargeOrder;
use common\models\User;
use common\models\UserPhoto;
use wechat\models\Config;

class MemberController extends BaseController
{

    public function actionIndex()
    {

        return $this->render();
    }

    public function actionSearch()
    {
        $request = \Yii::$app->request;
        $start = $request->get('iDisplayStart');
        $limit = $request->get('iDisplayLength');

        $andWhere = [];
        $id_phone_name = $request->get('id_phone_name');
        if ($request->get('id_phone_name') != ''){
            if (is_numeric($id_phone_name)){
                if (strlen($id_phone_name.'') == 11){
                    $andWhere[] = ["=" ,"phone", $id_phone_name];
                }else{
                    $andWhere[] = ["=" ,"id", $id_phone_name];
                }
            }else{
                $andWhere[] = ["like" ,"json_extract(info,'$.real_name')", $id_phone_name];
            }

        }
        if ($request->get('is_show') != ''){
            $andWhere[] = ["=" ,"is_show", $request->get('is_show')];
        }
        if ($request->get('status') != ''){
            $andWhere[] = ["=","status",$request->get('status')];
        }


        $list  = User::getInstance()->lists($start, $limit ,$andWhere);
        $count = User::getInstance()->count($andWhere);
        foreach ($list as $k => $v) {

            $list[$k]['info']                 = json_decode($v['info']);
            $list[$k]['auth']                 = json_decode($v['auth']);
            $list[$k]['info']->level          = getLevel($list[$k]['info']->level);
            $list[$k]['info']->is_marriage    = getMarriage($list[$k]['info']->is_marriage);
            $list[$k]['sex']                  = getSex($list[$k]['sex']);
            $list[$k]['service_status']       = getIsNot($list[$k]['service_status']);
            $list[$k]['is_auth']              = getIsNot($list[$k]['is_auth']);
            $list[$k]['is_sign']              = getIsNot($list[$k]['is_sign']);
            $list[$k]['auth']->identity_check = getIsNot($list[$k]['auth']->identity_check);
        }

        $data = [
            'draw'              => \Yii::$app->request->get('sEcho'),
            'recordsTotal'      => $count,
            'recordsFiltered'   => $count,
            'data'              => $list
        ];
        $this->renderAjax($data);
    }

    public function actionSave()
    {
        if ($data = \Yii::$app->request->post()) {
            if ($data['phone'] == '' || $data['info']['real_name'] == '') {
                return $this->__error('信息不全');
            }
            $data['username'] = $data['phone'];
            $photo            = $data['thumb_path'];
            $data['info']     = array_merge($data['info'], $data['zo']);
            unset($data['zo']);
            unset($data['thumb_path']);
            //            var_dump($data);exit;
            $uid = \common\models\User::getInstance()->addUser($data);
            foreach ($photo as $k => $v) {
                $time              = time();
                $pt['pic_path']    = $v;
                $pt['thumb_path']  = $v;
                $pt['create_time'] = $time;
                $pt['create_time'] = time();
                $pt['update_time'] = time();
                $pt['user_id']     = $uid;
                (new \common\models\UserPhoto)->addPhotoComment($pt);
            }
            if ($uid > 0) {
                return $this->__success('添加成功');
            } else {
                return $this->__error('添加失败');
            }
        }
        return $this->render();
    }

    // 修改会员资料
    public function actionEdit(){
        $request = \Yii::$app->request;
        $id = $request->get('id');
        if ($id < 1 ){
            exit();
        }
        if ($postData = $request->post()){
//            var_dump($postData);exit;
            $postData['zo']['other'] = trim($postData['zo']['zo_other']);
            $postData['zo']['other'] = str_replace("\t" , "" , $postData['zo']['other']);
            $postData['user_id'] = $id;

            $postData['info']['age'] = strtotime($postData['info']['age']);

            User::getInstance()->editUser($postData);
        }
        $user = User::getInstance()->getUserById($id);
        $user['info'] = json_decode($user['info']);
        $user['auth'] = json_decode($user['auth']);

        $this->assign('id' , $id);
        $this->assign('user' , $user);
        $this->assign('sport' , Config::getInstance()->getListByType(1));
        $this->assign('movie' , Config::getInstance()->getListByType(2));
        $this->assign('food' , Config::getInstance()->getListByType(3));
        $this->assign('travel' , Area::getInstance()->getWentTravelList());

        $list = UserPhoto::getInstance()->lists('' , '2,3,4,5,6');
        $this->assign('list' , $list);


        return $this->render();
    }

    public function actionInfo()
    {
        $userId = \Yii::$app->request->get('id');
        $user   = User::getInstance()->getUserById($userId);
        $user['info'] = json_decode($user['info']);
        $user['auth'] = json_decode($user['auth']);
        $this->assign('user' , $user);
        $this->assign('photoList' , UserPhoto::getInstance()->getPhotoList(\Yii::$app->request->get('id')));
//        var_dump($user);exit;
        return $this->render();
    }


    public function actionOrder()
    {
        $vo = ChargeOrder::getInstance()->getOrderAllInfo();
        $this->assign('list',$vo);
        return $this->render();
    }

    public function actionCharge(){
        if(\Yii::$app->request->post()){
           $orderId = ChargeOrder::getInstance()->createOrder(\Yii::$app->request->post('user_id'), \Yii::$app->request->post()); // 创建订单
           $result = ChargeOrder::getInstance()->setOrderStatus($orderId);
           $this->renderAjax(['status'=>$result]);exit();
        }

        $goods = ChargeGoods::getInstance()->getAllList(['status'=>1]);
        $this->assign('goods',$goods);
        return $this->render();
    }

    public function actionGetUserById(){
        $this->renderAjax(User::getInstance()->getUserById(\Yii::$app->request->get('id')));
    }

    /**
     * 获取用户相册
     */
    public function actionGetPic(){
        $list = UserPhoto::getInstance()->getPhotoList(\Yii::$app->request->get('id'));
        $this->renderAjax(['status'=>1,'data'=>$list]);
    }

    public function actionUpPic(){
        $data['thumb_path'] = \Yii::$app->request->get('thumb_path');
        $data['pic_path'] = \Yii::$app->request->get('pic_path');
        $data['time'] = time();
        $result = UserPhoto::getInstance()->addPhoto(\Yii::$app->request->get('id') , $data);

        $this->renderAjax(['status'=>$result]);
    }

    public function actionSetHead(){
        $userId = \Yii::$app->request->get('user_id');
        $data['id'] = \Yii::$app->request->get('id');
        $data['thumb_path'] = \Yii::$app->request->get('thumb_path');
        $list = UserPhoto::getInstance()->setHeadPic($userId, $data);
        $this->renderAjax(['status' => 1, 'data' => $list]);
    }

    /**
     * 照片列表
     * @return string
     */
    public function actionPhoto(){

        $isCheck = \Yii::$app->request->get('is_check');
        $type = \Yii::$app->request->get('type');
        if ($isCheck == '') $isCheck = 2;
        $list = UserPhoto::getInstance()->lists($isCheck , $type);
        if (\Yii::$app->request->isAjax){
            return $this->renderAjax(['status'=>1 , 'data'=>$list]);
        }
        $this->assign('list' , $list);
        return $this->render();
    }

    /**
     * 审核照片
     */
    public function actionAuthPhoto(){

        $data = \Yii::$app->request->get();
        $flag = UserPhoto::getInstance()->auth($data['id'] , $data['status']);
        if ($flag > 0) {
            $this->renderAjax(['status' => 1, 'message'=>'操作成功' , 'data' => $flag]);
        }else{
            $this->renderAjax(['status' => 0, 'message'=>'操作失败' , 'data' => $flag]);
        }
    }

    public function actionChat(){
        return $this->render();
    }

}