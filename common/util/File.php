<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/20
 * Time: 12:56
 */

namespace common\util;


use common\models\UploadForm;
use yii\web\UploadedFile;

class File
{

    /**
     * 获取图片路径（无后缀名）
     * @param $dir
     * @return string
     */
    public function getImagePath($dir)
    {
        $date_time = date('Ymd');
        if (!file_exists($dir)) {
            mkdir($dir, 0775);
        }
        if (!file_exists($dir . "upload/")) {
            mkdir($dir . "upload/", 0775);
        }
        // 原图文件夹
        if (!file_exists($dir . "upload/picture/")) {
            mkdir($dir . "upload/picture/", 0775);
        }
        if (!file_exists($dir . "upload/picture/" . $date_time . "/")) {
            mkdir($dir . "upload/picture/" . $date_time . '/', 0775);
        }
        // 缩略图文件夹
        if (!file_exists($dir . "upload/thumb/")) {
            mkdir($dir . "upload/thumb/", 0775);
        }
        if (!file_exists($dir . "upload/thumb/" . $date_time . "/")) {
            mkdir($dir . "upload/thumb/" . $date_time . '/', 0775);
        }
        $time = time();
        $rand = rand(1, 100000000);
        return $dir . "upload/picture/" . $date_time . '/' . $time . $rand;
    }

    /**
     * 文件上传
     * @param $dir
     * @return array
     */
    public function upload($dir)
    {
        $model = new UploadForm();
        $date_time = date('Ymd');
        if (!file_exists($dir)) {
            mkdir($dir, 0775);
        }
        if (!file_exists($dir . "upload/")) {
            mkdir($dir . "upload/", 0775);
        }
        // 原图文件夹
        if (!file_exists($dir . "upload/picture/")) {
            mkdir($dir . "upload/picture/", 0775);
        }
        if (!file_exists($dir . "upload/picture/" . $date_time . "/")) {
            mkdir($dir . "upload/picture/" . $date_time . '/', 0775);
        }
        // 缩略图文件夹
        if (!file_exists($dir . "upload/thumb/")) {
            mkdir($dir . "upload/thumb/", 0775);
        }
        if (!file_exists($dir . "upload/thumb/" . $date_time . "/")) {
            mkdir($dir . "upload/thumb/" . $date_time . '/', 0775);
        }

        if (\Yii::$app->request->isPost) {
            $model->file = UploadedFile::getInstanceByName("file");
            $fileTypes = array('jpg', 'jpeg', 'gif', 'png', 'bmp'); // File extensions
            if ($model->validate() && in_array($model->file->extension, $fileTypes)) {
                $time = time();
                $rand = rand(1, 100000000);
                $file_name = $dir . "upload/picture/" . $date_time . '/' . $time . $rand . '.' . $model->file->extension;
                $model->file->saveAs($file_name, true);
                $fileInfo = getimagesize($file_name);

                if (rename($file_name, $dir . "upload/picture/" . $date_time . '/' . $time . $rand . '_' . $fileInfo[0] . '_' . $fileInfo[1] . '.' . $model->file->extension)) {
                    return array('status' => 1, 'info' => '上传成功', 'path' => $date_time . '/' . $time . $rand . '_' . $fileInfo[0] . '_' . $fileInfo[1] . '.' . $model->file->extension, 'extension' => $model->file->extension, 'time' => $time);
                }
            }
        }
        return array('status' => -1, 'info' => '上传失败!~');
    }

    /**
     * 缩略图相片
     * @param $data
     * @return array
     */
    public function thumbPhoto($data)
    {
        $image = new Image();
        $folder = __DIR__ . "/../..";
        $url = "/images/upload/thumb/" . $data['path'];
        $image->open($folder . "/images/upload/picture/" . $data['path']);
        //另存固定宽度是200的压缩图片
        $image->thumb(200, 200, $image::IMAGE_THUMB_FIXED)->save($folder . $url);

        return ['status' => 1, 'info' => '上传成功', 'pic_path' => "/images/upload/picture/" . $data['path'], 'thumb_path' => $url, 'time' => $data['time']];
    }

    /**
     * 后台压缩图片处理
     * @param $tempFile 原文件
     * @param $extension 后缀名
     */
    public function backThumbImage($tempFile, $extension)
    {
        $imagePath = $this->getImagePath(__DIR__."/../../images/");
        $targetFile = $imagePath . '.' . $extension;
        // 上传图片
        if(move_uploaded_file($tempFile, $targetFile)) {
            $fileInfo = getimagesize($targetFile);

            // 重命名加上图片长宽
            $picturePath = $imagePath . '_' . $fileInfo[0] . '_' . $fileInfo[1] . '.' . $extension;
            if (rename($targetFile, $picturePath)) {
                // 固定压缩图片长宽200
                $image = new Image();
                $thumbPath = str_replace('picture', 'thumb', $picturePath);
                $image->open($picturePath);
                $image->thumb(200, 200, $image::IMAGE_THUMB_FIXED)->save($thumbPath);
            }
        }
        $thumbArr = explode('/../..', $thumbPath);
        echo $thumbArr[1];// 返回压缩图片路径
    }
}