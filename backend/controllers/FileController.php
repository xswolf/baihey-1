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
use common\util\File;

class FileController extends Controller
{
    public $enableCsrfValidation = false;

    public function actionUpload()
    {
        $model = new UploadForm();
        $dir = "../../frontend/web/images/";

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
            $model->file = UploadedFile::getInstance($model, 'file');
            if ($model->validate()) {
                $date_time = date('Ymd');
                $time = time();
                $rand = rand(1, 100000000);
                $file_name = $dir . "upload/" . $date_time . '/' . $time . $rand . '.' . $model->file->extension;
                $model->file->saveAs($file_name);

                $real_file_name = "/images/" . "upload/" . $date_time . '/' . $time . $rand . '.' . $model->file->extension;

                $return = array('status' => 1, 'info' => '上传成功', 'path' => $real_file_name);
                echo json_encode($return);
                exit;
            }
        }
        $return = array('status' => -1, 'info' => '上传失败!~');
        echo json_encode($return);

    }

    /**
     * 相册上传+缩略图
     */
    public function actionUploadImg()
    {
        if (!empty($_FILES)) {
            $file = new File();
            $res = $file->upload(__DIR__ . "/../../images/");// 原图上传
            $data = (1 == $res['status']) ? $file->thumbPhoto($res) : $res;// 原图压缩

            echo '1';
        }

//        $targetFolder = '/images';
//        if (!empty($_FILES)) {
//            $tempFile = $_FILES['Filedata']['tmp_name'];
//            $targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;
//            $targetFile = rtrim($targetPath, '/') . '/' . $_FILES['Filedata']['name'];
//            // Validate the file type
//            $fileTypes = array('jpg', 'jpeg', 'gif', 'png', 'bmp'); // File extensions
//            $fileParts = pathinfo($_FILES['Filedata']['name']);
//
//            if (in_array($fileParts['extension'], $fileTypes)) {
//                move_uploaded_file($tempFile, $targetFile);
//            } else {
//                echo 'Invalid file type.';
//            }
//        }
    }
}