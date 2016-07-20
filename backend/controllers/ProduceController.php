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

    public function actionIndex()
    {

        $list = ChargeGoods::getInstance()->getAllList('id != 8');
        $this->assign('list', $list);
        return $this->render();
    }

    public function actionSave()
    {
        if(isset($this->get['id']) && $id = $this->get['id']) {
            $good = ChargeGoods::getInstance()->getOne($id);
            $good['price'] = $good['price'] / 100;
            $good['native_price'] = $good['native_price'] / 100;
        } else {
            $good = [];
        }

        if ($postData = $this->post) {
            $postData['price'] = $postData['price'] * 100;
            $postData['native_price'] = $postData['native_price'] * 100;
            if(isset($id)) {
                if (ChargeGoods::getInstance()->editGoods($id, $postData)) {
                    return $this->__success('修改成功');
                } else {
                    return $this->__error('修改失败');
                }
            } else {
                if (ChargeGoods::getInstance()->addGoods($postData)) {
                    return $this->__success('添加成功');
                } else {
                    return $this->__error('添加失败');
                }
            }
        }
        //var_dump($good);exit;/wechat/web/images/member/vip-1.png
        $this->assign('good', $good);
        return $this->render();
    }

    // 修改good状态
    public function actionChangeStatus()
    {
        if(ChargeGoods::getInstance()->editGoods($this->post['id'], ['status' => $this->post['status']])) {
            $this->renderAjax(['status' => 1, 'msg' => '修改成功']);
        } else {
            $this->renderAjax(['status' => 0, 'msg' => '修改失败']);
        }
    }

    // 删除good
    public function actionDelGoods()
    {
        if(ChargeGoods::getInstance()->delGoods($this->post['id'])) {
            $this->renderAjax(['status' => 1, 'msg' => '删除成功']);
        } else {
            $this->renderAjax(['status' => 0, 'msg' => '删除失败']);
        }
    }
}