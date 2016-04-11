<?php
namespace wechat\controllers;

use common\util\Cookie;
use wechat\models\User;


/**
 * Site controller
 */
class SiteController extends BaseController
{


    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionIndex()
    {
        return $this->render();
    }

    /**
     * 首页列表页
     */
    public function actionUserList(){
        $where = [
            'type'=>1,
            'name'=>['!=' =>'12'],
            'id'=>['in'=>['1',2,3]],
            'age'=>['>'=>12],
            'age1'=>['<'=>12],
            'age2'=>['>='=>12],
            'or'=>[
                'type'=>1,
                'name'=>['!=' =>'12'],
                'age3'=>['<='=>12],
                'age4'=>['between'=>[12,15]],
            ],
            'age3'=>['<='=>12],
            'age4'=>['between'=>[12,15]],

        ];
        echo User::getInstance()->processWhere($where);
        exit;
        $list = User::getInstance()->userList();
        $this->renderAjax(['status=>1' , 'data'=>$list] );
    }




}
