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

class File {

    public function upload($dir){
        $model = new UploadForm();
        if (!file_exists($dir)){
            mkdir($dir , 0775);
        }
        if (!file_exists($dir."upload/")){
            mkdir($dir."upload/" , 0775);
        }
        if (!file_exists($dir."upload/".date('Ymd')."/")){
            mkdir($dir."upload/".date('Ymd').'/' , 0775);
        }

        if (\Yii::$app->request->isPost) {
            $model->file = UploadedFile::getInstanceByName("file");

            if ($model->validate()) {
                $date_time = date('Ymd');
                $time = time();
                $rand = rand(1,100000000);
                $file_name = $dir."upload/".$date_time.'/'. $time.$rand . '.' . $model->file->extension;
                $model->file->saveAs($file_name , true);

                $return  = array('status' => 1, 'info' => '上传成功' , 'path' => "/images/upload/".$date_time.'/'. $time.$rand . '.' . $model->file->extension);
                return $return;
            }
        }
        $return  = array('status' => -1, 'info' => '上传失败!~');
        return $return;
    }
}