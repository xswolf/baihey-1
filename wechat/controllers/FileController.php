<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/16
 * Time: 17:03
 */

namespace wechat\controllers;


use common\models\UserPhoto;
use common\util\Cookie;
use common\util\File;

class FileController extends BaseController {

    /**
     * 文件上传
     */
    public function actionUpload() {
        $file = new File();
        $res  = $file->upload(__DIR__."/../../images/");
        $this->renderAjax($res);
    }

    /**
     * 相册上传+缩略图
     */
    public function actionThumbPhoto() {
        $user_id    = Cookie::getInstance()->getCookie('bhy_id');
        $file       = new File();
        $res        = $file->upload(__DIR__."/../../images/");
        $data       = $file->thumbPhoto($res);
        $id = UserPhoto::getInstance()->addPhoto($user_id, $data);
        if($id) {
            $data['id'] = $id;
        } else {
            $data = ['status' => -1, 'info' => '保存失败!~'];
        }
        $this->renderAjax($data);
    }
}