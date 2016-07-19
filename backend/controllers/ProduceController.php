<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/29 0029
 * Time: 上午 10:32
 */

namespace backend\controllers;


use common\models\ChargeGoods;
use common\models\Feedback;

class ProduceController extends BaseController
{

    public function actionIndex(){

        $list = ChargeGoods::getInstance()->getAllList('id != 8');
        $this->assign('list' , $list);
        return $this->render();
    }

    public function actionSave(){

        return $this->render();
    }

    public function actionDel(){

    }
}