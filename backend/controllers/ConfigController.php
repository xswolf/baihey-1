<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/11 0011
 * Time: 下午 3:28
 */

namespace backend\controllers;


use yii\db\Query;

class ConfigController extends BaseController
{

    public function actionList(){

        $list = (new Query())->from(\Yii::$app->db->tablePrefix.'config')->select("*")->all();

        $this->assign('list' , $list);

        return $this->render();
    }
}