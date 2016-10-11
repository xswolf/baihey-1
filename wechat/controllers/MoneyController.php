<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/10/11 0011
 * Time: 下午 2:11
 */

namespace wechat\controllers;


use yii\web\Controller;

class MoneyController extends Controller
{

    public function actionShowQrCode()
    {
        $params = [
            "action_name" => "QR_LIMIT_SCENE",
            "action_info" => "money",
            "scene_id" => 1,
            "scene_str" => 1
        ];

        $ticket = \Yii::$app->wechat->createQrCode($params);

        $qrCode = \Yii::$app->wechat->getQrCodeUrl($ticket['ticket']);

//        var_dump($ticket);
        var_dump($qrCode);

    }
}