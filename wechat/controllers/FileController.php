<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/16
 * Time: 17:03
 */

namespace wechat\controllers;


class FileController extends BaseController{

    public function actionUpload(){
        var_dump($_FILES);
    }
}