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
            isset($this->get['type']) ? $photo['type'] = $this->get['type'] :true;
            $photo['is_check'] = $user_id < 10000 ? 1 : 2;
            $photo['thumb_path'] = $data['thumb_path'];
            $photo['pic_path']   = $data['pic_path'];
            $photo['time']       = $data['time'];
            if($id = UserPhoto::getInstance()->addPhoto($user_id, $photo)) {
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
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
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
                $photo['type'] = $this->get['type'];
                $photo['thumb_path'] = $data['thumb_path'];
                $photo['pic_path']   = $data['pic_path'];
                $photo['time']       = $data['time'];
                if (!UserPhoto::getInstance()->addPhoto($user_id, $photo)) {
                    $data = ['status' => -1, 'info' => '保存失败!~'];
                }
            }
        }
        $this->renderAjax($data);
    }

    /**
     * 图片旋转
     */
    public function actionRotate(){

        $filename   = '/alidata/www/baihey'.\Yii::$app->request->get('filename');
        $oldName    = str_replace('thumb' , 'picture' , $filename);
        $degrees    = \Yii::$app->request->get('degrees');

        $ext = strtolower(strrchr($filename,'.'));
        if ($ext == 'jpg' || $ext == 'jpeg'){
            $method = 'jpeg';
        }elseif ($ext == 'gif'){
            $method = 'gif';
        }elseif ($ext == 'png'){
            $method = 'png';
        }elseif ($ext == 'bmp'){
            $method = 'wbmp';
        }

        $oldSource  = "imagecreatefrom".$method($oldName);
        $oldRotate  = imagerotate($oldSource, $degrees, 0);

        $source     = "imagecreatefrom".$method('/alidata/www/baihey'.$filename);
        $rotate     = imagerotate($source, $degrees, 0);

        if ("image".$method($rotate,$filename) && "image".$method($oldRotate,$oldName)){
            return $this->renderAjax(['status'=>1 , 'message' => '成功']);
        }
        return $this->renderAjax(['status'=>0 , 'message' => '失败']);

    }
}