<?php
namespace wechat\controllers;

use common\models\ChargeConfig;
use common\models\ChargeGoods;
use common\models\ChargeOrder;
use common\models\ChargeType;

require_once('../../common/util/pay/wechat/lib/WxPay.Api.php');
require_once('../../common/util/pay/wechat/WxPay.JsApiPay.php');
require_once('../../common/util/pay/alipay/lib/alipay_submit.class.php');
require_once('../../common/util/pay/alipay/lib/alipay_notify.class.php');

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

    // 支付宝通知
    public function actionNotifyUrl()
    {
        //计算得出通知验证结果
        $alipayNotify = new \AlipayNotify(ChargeConfig::getInstance()->AlipayConfig);
        $verify_result = $alipayNotify->verifyNotify();

        if($verify_result) {//验证成功

            if($_POST['trade_status'] == 'TRADE_FINISHED') { //退款日期超过可退款期限后（如三个月可退款），支付宝系统发送该交易状态通知
                echo '退款';
            }
            else if ($_POST['trade_status'] == 'TRADE_SUCCESS') { //付款完成后，支付宝系统发送该交易状态通知
                if(ChargeOrder::getInstance()->setOrderStatus($_POST['out_trade_no'])){   // 设置订单状态
                    $baseUrl = urlencode('http://wechat.baihey.com/wap/site/main#/charge_order?orderId='.$_POST['out_trade_no'].'&payType=4');
                    Header("Location: $baseUrl");
                }else{
                    echo '设置订单状态失败';
                }
            }

            echo "success";		//请不要修改或删除

        }
        else {
            //验证失败
            echo "fail";
        }
    }

    public function actionAlipay(){
        $orderInfo = ChargeOrder::getInstance()->getOne($this->get['orderId']);
        $goods = ChargeGoods::getInstance()->getOne($orderInfo['charge_goods_id']);

        $parameter = array(
            "service"       => ChargeConfig::getInstance()->AlipayConfig['service'],
            "partner"       => ChargeConfig::getInstance()->AlipayConfig['partner'],
            "seller_id"     => ChargeConfig::getInstance()->AlipayConfig['partner'],
            "payment_type"	=> ChargeConfig::getInstance()->AlipayConfig['payment_type'],
            "notify_url"	=> ChargeConfig::getInstance()->AlipayConfig['notify_url'],
            "return_url"	=> ChargeConfig::getInstance()->AlipayConfig['return_url'],
            "_input_charset"	=> trim(strtolower(ChargeConfig::getInstance()->AlipayConfig['input_charset'])),
            "out_trade_no"	=> $orderInfo['order_id'],
            "subject"	=> '嘉瑞百合缘-【'.$goods['name'].'】',
            "total_fee"	=> $orderInfo['money'],
            "show_url"	=> 'http://wechat.baihey.com/wap/site/main#/main/member/vip',
            "body"	=> '',
            //其他业务参数根据在线开发文档，添加参数.文档地址:https://doc.open.alipay.com/doc2/detail.htm?spm=a219a.7629140.0.0.2Z6TSk&treeId=60&articleId=103693&docType=1

        );

        //建立请求
        $alipaySubmit = new \AlipaySubmit(ChargeConfig::getInstance()->AlipayConfig);
        $html_text = $alipaySubmit->buildRequestForm($parameter,"get", "确认");
        echo $html_text;
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