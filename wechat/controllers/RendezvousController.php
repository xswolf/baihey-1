<?php
namespace wechat\controllers;
use common\models\UserRendezvous;


/**
 * Site controller
 */
class RendezvousController extends BaseController
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
     *
     */
    public function actionRelease(){
        $data = $this->get;
        $flag = UserRendezvous::getInstance()->release($data);
        $this->renderAjax(['status'=>1,'data'=>$flag]);
    }
}
