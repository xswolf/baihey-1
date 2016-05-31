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

    /**
     * 我的约会申请人列表
     */
    public function actionRendezvousApplyList()
    {
        $list = UserRendezvous::getInstance()->rendezvousApplyList($this->get['id']);
        $this->renderAjax(['status'=>1 , 'data'=>$list]);
    }

    /**
     * 修改约会申请人状态
     */
    public function actionUpdateApplyStatus()
    {
        $list = UserRendezvous::getInstance()->updateApplyStatus($this->get);
        $this->renderAjax(['status'=>1 , 'data'=>$list]);
    }

    /**
     * 我参与的约会列表
     */
    public function actionApplyList()
    {
        $list = UserRendezvous::getInstance()->applyLists($this->get);
        $this->renderAjax(['status'=>1 , 'data'=>$list]);
    }

    /**
     * 删除约会申请
     */
    public function actionDeleteApply()
    {
        $list = UserRendezvous::getInstance()->deleteApply($this->get);
        $this->renderAjax(['status'=>1 , 'data'=>$list]);
    }
}
