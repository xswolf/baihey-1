<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/26 0026
 * Time: 上午 10:05
 */

namespace backend\controllers;


use common\models\ChargeGoods;
use common\models\ChargeOrder;
use common\models\User;
use common\models\UserPhoto;

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
        if ($request->get('ages') >= 18){
            $andWhere[] = [">=" ,"age", $request->get('ages')];
        }
        if ($request->get('agee') >=18){
            $andWhere[] = ["<=" ,"age", $request->get('agee')];
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
            $postData['user_id'] = $request->get('id');
            $postData['info']['age'] = strtotime($postData['info']['age']);
            User::getInstance()->editUser($postData);
        }
        $user = User::getInstance()->getUserById($id);
        $user['info'] = json_decode($user['info']);
        $user['auth'] = json_decode($user['auth']);
//        var_dump($user);exit;
        $this->assign('user' , $user);
        return $this->render();
    }

    public function actionInfo()
    {
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
           $orderId = ChargeOrder::getInstance()->createOrder(\Yii::$app->request->post()); // 创建订单
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
}