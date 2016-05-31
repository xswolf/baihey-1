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
     * 发布约会
     */
    public function actionRelease(){
        $data = $this->get;
        $flag = UserRendezvous::getInstance()->release($data);
        $this->renderAjax(['status'=>1,'data'=>$flag]);
    }

    /**
     * 约会列表
     */
    public function actionList(){
        $list = UserRendezvous::getInstance()->lists($this->get);
        $this->renderAjax(['status'=>1 , 'data'=>$list]);
    }

    /**
     * 修改状态
     */
    public function actionUpdateStatus() {
        $list = UserRendezvous::getInstance()->updateStatus($this->get);
        $this->renderAjax(['status'=>1 , 'data'=>$list]);
    }

    /**
     * 获取约会信息
     */
    public function actionGetRendezvousInfo()
    {
        $list = UserRendezvous::getInstance()->getRendezvousInfo($this->get);
        $this->renderAjax(['status'=>1 , 'data'=>$list]);
    }
}
