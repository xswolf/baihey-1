<?php
namespace wechat\controllers;

use common\util\pay\wechat\lib\WxPayApi;
use common\util\pay\wechat\JsApiPay;
use common\util\pay\wechat\lib\WxPayUnifiedOrder;
use wechat\models\ChargeGoods;
use wechat\models\ChargeOrder;
use wechat\models\ChargeType;

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
         $this->renderAjax(['status' => 1, 'data' => ChargeGoods::getInstance()->getList()]);
    }

    public function actionGetChargeGoodsById()
    {
        $this->renderAjax(['status' => 1, 'data' => ChargeGoods::getInstance()->getById($this->get['id'])]);
    }

    public function actionGetChargeTypeList()
    {
         $this->renderAjax(['status' => 1, 'data' => ChargeType::getInstance()->getList()]);
    }

    public function actionGetChargeTypeById()
    {
        $this->renderAjax(['status' => 1, 'data' => ChargeType::getInstance()->getById($this->get['id'])]);
    }

    public function actionCreateOrder(){

        //①、获取用户openid
        $tools = new JsApiPay();
        $openId = $tools->GetOpenid();

        //②、统一下单
        $input = new WxPayUnifiedOrder();
        $input->SetBody("嘉瑞百合缘VIP会员服务");
        $input->SetAttach("手机网站");
        $input->SetOut_trade_no(ChargeOrder::getInstance()->createOrderId());
        $input->SetTotal_fee("");
        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        $input->SetNotify_url("http://wechat.baihey.com/wap/Charge/notify-url");
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        $order = WxPayApi::unifiedOrder($input);
        printf_info($order);
        $jsApiParameters = $tools->GetJsApiParameters($order);
        $this->assign('param',$jsApiParameters);
        return $this->render();
//        $this->renderAjax(['status' => 1, 'data' => ChargeOrder::getInstance()->createOrder()]);
    }

    public function actionNotifyUrl()
    {
        $this->assign('gett',$this->get);
        $this->assign('postt',$this->post);
        return $this->render();
    }


}