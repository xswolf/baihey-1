<?php
namespace wechat\controllers;

use Yii;
use yii\web\Controller;

/**
 * Site controller
 */
class SiteController extends Controller
{


    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionIndex()
    {
        $wechat = \Yii::$app->wechat;

        var_dump($wechat->accessToken);
    }


}
