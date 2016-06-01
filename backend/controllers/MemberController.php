<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/26 0026
 * Time: 上午 10:05
 */

namespace backend\controllers;


use common\models\User;

class MemberController extends BaseController
{

    public function actionIndex(){

        return $this->render();
    }

    public function actionSearch(){
        $start = \Yii::$app->request->get('iDisplayStart');
        $limit = \Yii::$app->request->get('iDisplayLength');
        $list = User::getInstance()->lists($start , $limit);
        foreach ($list as $k=>$v){
            $list[$k]['info'] = json_decode($v['info']);
            $list[$k]['auth'] = json_decode($v['auth']);
        }
        $data = [
            'draw' => \Yii::$app->request->get('sEcho'),
            'recordsTotal'=>User::getInstance()->count(),
            'recordsFiltered'=>User::getInstance()->count(),
            'data' => $list
        ];
        $this->renderAjax($data);
    }

    public function actionSave(){
        if($data = \Yii::$app->request->post()){
            if ($data['phone'] == '' || $data['info']['real_name'] == '') {
                return $this->__error('信息不全');
            }
            $data['username'] = $data['phone'];
            $photo = $data['thumb_path'];
            $data['info'] = array_merge($data['info'] , $data['zo']);
            unset($data['zo']);
            unset($data['thumb_path']);
//            var_dump($data);exit;
            $uid = \common\models\User::getInstance()->addUser($data);
            foreach( $photo as $k=>$v){
                $time = time();
                $pt['pic_path'] = $v;
                $pt['thumb_path'] = $v;
                $pt['create_time'] = $time;
                $pt['create_time'] = time();
                $pt['update_time'] = time();
                $pt['user_id'] = $uid;
                (new \common\models\UserPhoto)->addPhotoComment($pt);
            }
            if ($uid>0){
                return  $this->__success('添加成功');
            }else{
                return  $this->__error('添加失败');
            }
        }
        return $this->render();
    }

    public function actionInfo(){
        return $this->render();
    }


    public function actionOrder(){
        return $this->render();
    }
}