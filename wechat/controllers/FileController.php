<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/16
 * Time: 17:03
 */

namespace wechat\controllers;


use common\models\UserInformation;
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
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        $data = $this->thumb();
        // 保存数据
        if(1 == $data['status']) {
            isset($this->get['type']) ? $data['type'] = $this->get['type'] :true;
            if($id = UserPhoto::getInstance()->addPhoto($user_id, $data)) {
                $data['id'] = $id;
            } else {
                $data = ['status' => -1, 'info' => '保存失败!~'];
            }
        }
        $this->renderAjax($data);
    }

    public function thumb(){
        $file    = new File();
        $res     = $file->upload(__DIR__."/../../images/");// 原图上传
        return (1 == $res['status']) ? $file->thumbPhoto($res) : $res;// 原图压缩
    }

    /**
     * 相册上传+缩略图
     */
    public function actionThumb() {

        $data = $this->thumb();

        $this->renderAjax($data);
    }


    /**
     * 诚信认证图片上传
     */
    public function actionAuthPictures()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id');
        $data = $this->thumb();
        // 保存数据
        if(1 == $data['status']) {
            //删除旧图片
            if($photo = UserPhoto::getInstance()->getPhotoList($user_id, $this->get['type'])) {
                $thumb_path = __DIR__ . "/../.." . $photo[0]['thumb_path'];
                if (is_file($thumb_path) && unlink($thumb_path)) {
                    $pic_path = str_replace('thumb', 'picture', $thumb_path);
                    unlink($pic_path);
                }
                $photo[0]['thumb_path'] = $data['thumb_path'];
                $photo[0]['pic_path'] = $data['pic_path'];
                $photo[0]['update_time'] = $data['time'];
                if (!UserPhoto::getInstance()->savePhoto($photo, $user_id)) {
                    $data = ['status' => -1, 'info' => '保存失败!~'];
                }
            } else {
                $data['type'] = $this->get['type'];
                if (!UserPhoto::getInstance()->addPhoto($user_id, $data)) {
                    $data = ['status' => -1, 'info' => '保存失败!~'];
                }
            }
        }
        $this->renderAjax($data);
    }
}