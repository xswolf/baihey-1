<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/16
 * Time: 17:03
 */

namespace wechat\controllers;


use common\util\File;

class FileController extends BaseController {

    public function actionUpload() {
        $file = new File();
        $res  = $file->upload(__DIR__."/../../images/");
        $this->renderAjax($res);
    }
}