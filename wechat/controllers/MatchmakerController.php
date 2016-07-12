<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/6
 * Time: 19:45
 */

namespace wechat\controllers;


use common\models\AuthUser;

class MatchmakerController extends BaseController
{

    /**
     * 用户红娘列表
     */
    public function actionUserMatchmakerList()
    {
        $list = AuthUser::getInstance()->getUserMatchmaker($this->get);
        $this->renderAjax(['status' => 1, 'data' => $list]);
    }
}