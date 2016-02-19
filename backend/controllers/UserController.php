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

    public function actionLogin(){

        $this->layout = false;
        return $this->render('login');
    }

}