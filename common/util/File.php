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
     * 文件上传
     * @param $dir
     * @return array
     */
    public function upload($dir)
    {
        $model = new UploadForm();
        if (!file_exists($dir)) {
            mkdir($dir, 0775);
        }
        if (!file_exists($dir . "upload/")) {
            mkdir($dir . "upload/", 0775);
        }
        if (!file_exists($dir . "upload/" . date('Ymd') . "/")) {
            mkdir($dir . "upload/" . date('Ymd') . '/', 0775);
        }

        if (\Yii::$app->request->isPost) {
            $model->file = UploadedFile::getInstanceByName("file");

            if ($model->validate()) {
                $date_time = date('Ymd');
                $time = time();
                $rand = rand(1, 100000000);
                $file_name = $dir . "upload/" . $date_time . '/' . $time . $rand . '.' . $model->file->extension;
                $model->file->saveAs($file_name, true);

                $return = array('status' => 1, 'info' => '上传成功', 'path' => "/images/upload/" . $date_time . '/' . $time . $rand . '.' . $model->file->extension, 'extension' => $model->file->extension, 'time' => $time);
                return $return;
            }
        }
        $return = array('status' => -1, 'info' => '上传失败!~');
        return $return;
    }

    /**
     * 缩略图相片
     * @param $data
     * @return array
     */
    public function thumbPhoto($data)
    {
        if ($data['status'] == 1) {
            $image      = new Image();
            $folder     = __DIR__ . "/../..";
            $date_time  = date('Ymd');
            $time       = time();
            $rand       = rand(1, 100000000);
            $url        = "/images/upload/" . $date_time . '/' . $time . $rand . '.' . $data['extension'];
            $image->open($folder . $data['path']);
            //另存固定宽度是240的压缩图片
            $image->thumb(240, 240, $image::IMAGE_THUMB_FIXED)->save($folder . $url);
            return ['status' => 1, 'info' => '上传成功', 'pic_path' => $data['path'], 'thumb_path' => $url, 'time' => $data['time']];
        }
        return ['status' => -1, 'info' => '压缩失败!~'];
    }
}