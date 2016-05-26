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

    public function actionPay()
    {
        //①、获取用户openid
        $tools = new \JsApiPay();
        $openId = $tools->GetOpenid();
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
        $input->SetNotify_url("http://wechat.baihey.com/wap/charge/notify-url");
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        $order = \WxPayApi::unifiedOrder($input);
        $jsApiParameters = $tools->GetJsApiParameters($order);
        $this->assign('param', $jsApiParameters);
        $this->assign('orderId', $orderInfo['order_id']);
        return $this->render();
    }

    public function actionNotifyUrl()
    {
        // TODO 放弃吧孩子，微信是不会通知你的
    }

    // 微信查询订单
    public function actionOrderQuery()
    {
        if (isset($_REQUEST["out_trade_no"]) && $_REQUEST["out_trade_no"] != "") {
            $out_trade_no = $_REQUEST["out_trade_no"];
            $input = new \WxPayOrderQuery();
            $input->SetOut_trade_no($out_trade_no);
            $result = \WxPayApi::orderQuery($input);
            $this->renderAjax($result);
        } else {
            $this->renderAjax('没有订单号你叫我怎么查？');
        }
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

    public function actionSetOrderStatus()
    {
        $this->renderAjax(['data'=>ChargeOrder::getInstance()->setOrderStatus($this->get['orderId'])]);
    }


}