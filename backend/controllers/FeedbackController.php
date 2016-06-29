<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/29 0029
 * Time: 上午 10:32
 */

namespace backend\controllers;


use common\models\Feedback;

class FeedbackController extends BaseController
{

    public function actionIndex(){

        $list = Feedback::getInstance()->lists(\Yii::$app->request->get('status'));
        $this->assign('list' , $list);
        return $this->render();
    }

    public function actionAuth(){

        $id     = \Yii::$app->request->get('id');
        $status = \Yii::$app->request->get('status');
        $id     = Feedback::getInstance()->auth($id, $status);

        if ($id>0){
            $this->renderAjax(['status'=>1 , 'message'=>'成功']);
        }else{
            $this->renderAjax(['status'=>0 , 'message'=>'失败']);
        }

    }
}