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
use common\util\Image;

class FileController extends BaseController
{

    /**
     * 文件上传
     */
    public function actionUpload()
    {
        $file = new File();
        $res = $file->upload(__DIR__ . "/../../images/");
        $this->renderAjax($res);
    }

    /**
     * 相册上传+缩略图
     */
    public function actionThumbPhoto()
    {
        $user_id = Cookie::getInstance()->getCookie('bhy_id')->value;
        $data = $this->thumb();
        // 保存数据
        if (1 == $data['status']) {
            isset($this->get['type']) ? $photo['type'] = $this->get['type'] : true;
            $photo['is_check'] = $user_id < 10000 ? 1 : 2;
            $photo['thumb_path'] = $data['thumb_path'];
            $photo['pic_path'] = $data['pic_path'];
            $photo['time'] = $data['time'];
            if ($id = UserPhoto::getInstance()->addPhoto($user_id, $photo)) {
                $data['id'] = $id;
            } else {
                $data = ['status' => -1, 'info' => '保存失败!~'];
            }
        }
        $this->renderAjax($data);
    }

    public function thumb()
    {
        $file = new File();
        $res = $file->upload(__DIR__ . "/../../images/");// 原图上传
        return (1 == $res['status']) ? $file->thumbPhoto($res) : $res;// 原图压缩
    }

    public function actionClientThumb()
    {
        $input = file_get_contents("php://input");
        $post = json_decode($input, true);
        $img = base64_decode($post['base64']);
        $file = new File();
        $imagePath = $file->getImagePath(__DIR__ . "/../../images/");

        $time = time();
        $fileName = $imagePath . ".jpg";
        ob_start();
        file_put_contents($fileName, $img);
        ob_flush();

        $fileInfo = getimagesize($fileName);
        $picInfo = $file->pictureRatio($fileInfo[0], $fileInfo[1]);

        $path = substr($imagePath, strpos($imagePath, "picture/") + 8);
        if (rename($fileName, $imagePath . '_' . $picInfo[0] . '_' . $picInfo[1] . '.jpg')) {
            $res = array('status' => 1, 'info' => '上传成功', 'path' => $path . '_' . $picInfo[0] . '_' . $picInfo[1] . '.jpg', 'extension' => 'jpg', 'time' => $time);
            ob_flush();
            $file->thumbPhoto($res);
        }

        $this->renderAjax(['status' => 1]);
    }

    /**
     * 相册上传+缩略图
     */
    public function actionThumb()
    {

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
        if (1 == $data['status']) {
            //删除旧图片
            if ($photo = UserPhoto::getInstance()->getPhotoList($user_id, $this->get['type'])) {
                $thumb_path = __DIR__ . "/../.." . $photo[0]['thumb_path'];
                if (is_file($thumb_path) && unlink($thumb_path)) {
                    $pic_path = str_replace('thumb', 'picture', $thumb_path);
                    unlink($pic_path);
                }
                $photo[0]['thumb_path'] = $data['thumb_path'];
                $photo[0]['pic_path'] = $data['pic_path'];
                $photo[0]['update_time'] = $data['time'];
                $photo[0]['is_check'] = 2;
                if (!UserPhoto::getInstance()->savePhoto($photo, $user_id,$photo[0]['type'])) {
                    $data = ['status' => -1, 'info' => '保存失败!~'];
                }
            } else {
                $photo['type'] = $this->get['type'];
                $photo['thumb_path'] = $data['thumb_path'];
                $photo['pic_path'] = $data['pic_path'];
                $photo['time'] = $data['time'];
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
    public function actionRotate()
    {

        $filename = '/alidata/www/baihey' . \Yii::$app->request->get('filename');
        $oldName = str_replace('thumb', 'picture', $filename);

        if ($this->imgturn($filename , 1) && $this->imgturn($oldName , 1)){
            return $this->renderAjax(['status' => 1, 'message' => '成功']);
        }
        return $this->renderAjax(['status' => 0, 'message' => '失败']);

        $degrees = \Yii::$app->request->get('degrees');

        $ext = strtolower(strrchr($filename, '.'));
        $method = 'jpeg';
        if ($ext == 'jpg' || $ext == 'jpeg') {
            $method = 'jpeg';
        } elseif ($ext == 'gif') {
            $method = 'gif';
        } elseif ($ext == 'png') {
            $method = 'png';
        } elseif ($ext == 'bmp') {
            $method = 'wbmp';
        }

        $createMethod = "imagecreatefrom" . $method;
        $imgMethod = "image" . $method;
        $oldSource = $createMethod($oldName);
        $oldRotate = imagerotate($oldSource, $degrees, 0);

        $source = $createMethod($filename);
        $rotate = imagerotate($source, $degrees, 0);

        if ($imgMethod($rotate, $filename) && $imgMethod($oldRotate, $oldName)) {
            return $this->renderAjax(['status' => 1, 'message' => '成功']);
        }
        return $this->renderAjax(['status' => 0, 'message' => '失败']);

    }

    protected function imgturn($src,$direction=1)
    {
        $ext = pathinfo($src)['extension'];
        switch ($ext) {
            case 'gif':
                $img = imagecreatefromgif($src);
                break;
            case 'jpg':
            case 'jpeg':
                $img = imagecreatefromjpeg($src);
                break;
            case 'png':
                $img = imagecreatefrompng($src);
                break;
            default:
                die('图片格式错误!');
                break;
        }
        $width = imagesx($img);
        $height = imagesy($img);
        $img2 = imagecreatetruecolor($height,$width);
        //顺时针旋转90度
        if($direction==1)
        {
            for ($x = 0; $x < $width; $x++) {
                for($y=0;$y<$height;$y++) {
                    imagecopy($img2, $img, $height-1-$y,$x, $x, $y, 1, 1);
                }
            }
        }else if($direction==2) {
            //逆时针旋转90度
            for ($x = 0; $x < $height; $x++) {
                for($y=0;$y<$width;$y++) {
                    imagecopy($img2, $img, $x, $y, $width-1-$y, $x, 1, 1);
                }
            }
        }
        switch ($ext) {
            case 'jpg':
            case "jpeg":
                imagejpeg($img2, $src, 100);
                break;

            case "gif":
                imagegif($img2, $src, 100);
                break;

            case "png":
                imagepng($img2, $src, 100);
                break;

            default:
                die('图片格式错误!');
                break;
        }
        imagedestroy($img);
        imagedestroy($img2);
        return true;
    }

}