<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/16
 * Time: 17:03
 */

namespace wechat\controllers;


use common\util\File;
use common\util\Image;

class FileController extends BaseController {

    public function actionUpload() {
        $file = new File();
        $res  = $file->upload(__DIR__."/../../images/");
        $this->renderAjax($res);
    }

    // 相册上传
    public function actionThumbPhone($res) {
        $file = new File();
        $res  = $file->upload(__DIR__."/../../images/");
        $data = $file->thumbPhoto($res);
        $this->renderAjax($data);
    }
}