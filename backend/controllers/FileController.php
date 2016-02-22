<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/2/22
 * Time: 16:22
 */

namespace backend\controllers;


use backend\models\UploadForm;
use yii\web\Controller;
use yii\web\UploadedFile;

class FileController extends Controller
{
    public $enableCsrfValidation = false;

    public function actionUpload(){
        $model = new UploadForm();
        $dir   = "../../frontend/web/images/";

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
            $model->file = UploadedFile::getInstance($model, 'file');
            if ($model->validate()) {

                $file_name = $dir."upload/".date('Ymd').'/'. time().rand(1,100000000) . '.' . $model->file->extension;
                $model->file->saveAs($file_name);
                $return  = array('status' => 1, 'info' => '上传成功' , 'path' => $file_name);
                echo json_encode($return);
                exit;
            }
        }
        $return  = array('status' => -1, 'info' => '上传失败');
        echo json_encode($return);

    }
}