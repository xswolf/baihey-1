<?php
namespace wechat\controllers;

use common\models\ChargeGoods;
use common\models\ChargeOrder;
use common\models\ChargeType;

require_once('../../common/util/pay/wechat/lib/WxPay.Api.php');
require_once('../../common/util/pay/wechat/WxPay.JsApiPay.php');

/**
 * 充值/支付 控制层
 * Class ChargeController
 * @package wechat\controllers
 */
class ChargeController extends BaseController
{

    public function actionIndex()
    {
        return $this->render();
    }

    public function actionGetChargeGoodsList()
    {

        $this->renderAjax(ChargeGoods::getInstance()->getAllList());
    }

    public function actionGetChargeGoodsById()
    {
        $this->renderAjax(ChargeGoods::getInstance()->getOne($this->get['id']));
    }

    public function actionGetChargeTypeList()
    {
        $this->renderAjax(ChargeType::getInstance()->getAllList());
    }

    public function actionGetChargeTypeById()
    {
        $this->renderAjax(ChargeType::getInstance()->getOne($this->get['id']));
    }

    public function actionGetChargeOrderById()
    {
        $this->renderAjax(ChargeOrder::getInstance()->getOne($this->get['id']));
    }

    public function actionGetOrder()
    {
        $this->renderAjax(ChargeOrder::getInstance()->getOrderInfo($this->get['id']));
    }

    public function actionTransfer(){
        if(isset($_GET['code'])){
            $url = 'http://wechat.baihey.com/wap/site/main#/main/charge_pay?code='.$_GET['code'].'&orderId='.$_GET['orderId'];
            Header("Location: $url");
        }
    }

    public function actionPay()
    {
        if(!isset($_GET['s'])){
            $this->actionTransfer();
        }
            //①、获取用户openid
            $tools = new \JsApiPay();
            $openId = $tools->GetOpenid($this->get['orderId']);
            //②、统一下单
            $orderInfo = ChargeOrder::getInstance()->getOne($this->get['orderId']);
            $goods = ChargeGoods::getInstance()->getOne($orderInfo['charge_goods_id']);
            $input = new \WxPayUnifiedOrder();
            $input->SetBody("嘉瑞百合缘-【" . $goods['name'] . "】");
            $input->SetAttach("手机网站");
            $input->SetOut_trade_no($this->get['orderId']);
            $input->SetTotal_fee((string)$orderInfo['money']);
            $input->SetTime_start(date("YmdHis"));
            $input->SetTime_expire(date("YmdHis", time() + 600));
            $input->SetNotify_url("http://wechat.baihey.com/wap/Charge/notify-url");
            $input->SetTrade_type("JSAPI");
            $input->SetOpenid($openId);
            $order = \WxPayApi::unifiedOrder($input);
            $jsApiParameters = $tools->GetJsApiParameters($order);
            $this->renderAjax(['data'=>$jsApiParameters]);
    }

    public function actionNotifyUrl()
    {
        $this->assign('gett', $this->get);
        $this->assign('postt', $this->post);
        return $this->render();
    }

    public function actionProduceOrder()
    {
        if (isset($this->get['goodsId'])) {
            $orderId = ChargeOrder::getInstance()->createOrder($this->get);
            if ($orderId) {
                $this->renderAjax(['status' => 1, 'msg' => '下单成功', 'data' => $orderId]);
            } else {
                $this->renderAjax(['status' => 0, 'msg' => '下单失败']);
            }
        } else {
            $this->renderAjax(['status' => 0, 'msg' => '没有商品信息']);
        }


    }

    public function setOrderStatus()
    {
        $this->renderAjax(ChargeOrder::getInstance()->setOrderStatus($this->get['orderId']));
    }


}