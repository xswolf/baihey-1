<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/2/19
 * Time: 11:15
 */

namespace backend\controllers;


use yii\web\Controller;

class UserController extends Controller
{
    public $enableCsrfValidation = false;

    public function actionLogin(){

        $this->layout = false;

        if ($_POST){

            return $this->redirect("/admin/");
        }

        return $this->render('login');
    }

}