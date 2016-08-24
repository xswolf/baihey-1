<?php
namespace wechat\controllers;

use common\models\ChargeGoods;
use common\models\ChargeOrder;
use common\models\ChargeType;
use common\util\Cookie;

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

        $this->renderAjax(ChargeGoods::getInstance()->getAllList($this->get));
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
        $data = ChargeOrder::getInstance()->weiXinPay($this->get['orderId']);
        if(!$data){
            $this->redirect('http://wechat.baihey.com/wap/site/main#/member/vip');
            return;
        }
        $this->assign('param', $data['jsApiParameters']);
        $this->assign('orderId', $data['orderInfo']['order_id']);
        return $this->render();
    }


    // 支付宝通知
    public function actionNotifyUrl()
    {
        //计算得出通知验证结果

        $alipayNotify = new \AlipayNotify($this->alipayConfig());
        $verify_result = $alipayNotify->verifyNotify();

        if ($verify_result) {//验证成功

            if ($_REQUEST['trade_status'] == 'TRADE_FINISHED') { //退款日期超过可退款期限后（如三个月可退款），支付宝系统发送该交易状态通知
                echo '退款';
            } else if ($_REQUEST['trade_status'] == 'TRADE_SUCCESS') { //付款完成后，支付宝系统发送该交易状态通知
                if (ChargeOrder::getInstance()->setOrderStatus($_REQUEST['out_trade_no'])) {   // 设置订单状态
                    return $this->redirect('http://wechat.baihey.com/wap/site/main#/charge_order?orderId=' . $_REQUEST['out_trade_no'] . '&payType=4');
                } else {   // 设置订单状态失败
                    return $this->redirect('http://wechat.baihey.com/wap/site/main#/charge_order?orderId=' . $_REQUEST['out_trade_no'] . '&payType=4');
                }
            }else{          // 未付款
                return $this->redirect('http://wechat.baihey.com/wap/site/main#/charge_order?orderId=' . $_REQUEST['out_trade_no'] . '&payType=4');
            }

            echo "success";        //请不要修改或删除

        } else {
            //验证失败
            echo "fail";
            return $this->redirect('http://wechat.baihey.com/wap/site/main#/charge_order?orderId=' . $_REQUEST['out_trade_no'] . '&payType=4');
        }
    }

    public function actionAlipay()
    {
        $orderInfo = ChargeOrder::getInstance()->getOne($this->get['orderId']);
        $goods = ChargeGoods::getInstance()->getOne($orderInfo['charge_goods_id']);

        $parameter = array(
            "service" => $this->alipayConfig()['service'],
            "partner" => $this->alipayConfig()['partner'],
            "seller_id" => $this->alipayConfig()['partner'],
            "payment_type" => $this->alipayConfig()['payment_type'],
            "notify_url" => $this->alipayConfig()['notify_url'],
            "return_url" => $this->alipayConfig()['return_url'],
            "_input_charset" => trim(strtolower($this->alipayConfig()['input_charset'])),
            "out_trade_no" => $orderInfo['order_id'],
            "subject" => '嘉瑞百合缘-【' . $goods['name'] . '】',
            "total_fee" => $orderInfo['money'] / 100,
            "show_url" => $goods['id'] == '8' ? 'http://wechat.baihey.com/wap/site/main#/main/member/balance' : 'http://wechat.baihey.com/wap/site/main#/main/member/vip',
            "body" => '',
            //其他业务参数根据在线开发文档，添加参数.文档地址:https://doc.open.alipay.com/doc2/detail.htm?spm=a219a.7629140.0.0.2Z6TSk&treeId=60&articleId=103693&docType=1

        );

        //建立请求
        $alipaySubmit = new \AlipaySubmit($this->alipayConfig());
        $html_text = $alipaySubmit->buildRequestForm($parameter, "get", "确认");
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
        /*if (isset($this->get['flag_h'])){  // 微信发红包数据
            $data = [
                'goodsId'=>8,
                'user_id'=>Cookie::getInstance()->getCookie('bhy_id')->value,
                'money'=>$this->get['money'],
                'chargeTypeId'=>5
            ];
        }else{
            $data = $this->get;
        }*/
        $data = $this->get;
        if (isset($data['goodsId'])) {
            $userId = Cookie::getInstance()->getCookie('bhy_id')->value;
            if(!$userId){
                $this->renderAjax(['status' => -1, 'msg' => '用户未登录']);
            }
            if(isset($data['money'])){
                if(intval($data['money']) < 1 || intval($data['money']) > 20000){
                    $this->renderAjax(['status' => -2, 'msg' => '充值金额异常']);
                }
            }
            $orderId = ChargeOrder::getInstance()->createOrder($userId,$data);
            if ($orderId) {
                $this->renderAjax(['status' => 1, 'msg' => '下单成功', 'data' => $orderId]);
            } else {
                $this->renderAjax(['status' => 0, 'msg' => '下单失败']);
            }
        } else {
            $this->renderAjax(['status' => -2, 'msg' => '没有商品信息']);
        }

    }

    public function actionSetOrderStatus()
    {
        $this->renderAjax(['data' => ChargeOrder::getInstance()->setOrderStatus($this->get['orderId'])]);
    }

    public function actionSetChargeType(){
        $this->renderAjax(['status'=>ChargeOrder::getInstance()->setOrderChargeType($this->get['chargeTypeId'])]);
    }

    public function alipayConfig()
    {
        //合作身份者ID，签约账号，以2088开头由16位纯数字组成的字符串，查看地址：https://b.alipay.com/order/pidAndKey.htm
        $alipay_config['partner'] = '2088701919851801';

        //收款支付宝账号，以2088开头由16位纯数字组成的字符串，一般情况下收款账号就是签约账号
        $alipay_config['seller_id'] = $alipay_config['partner'];

        // MD5密钥，安全检验码，由数字和字母组成的32位字符串，查看地址：https://b.alipay.com/order/pidAndKey.htm
        $alipay_config['key'] = 'bmk976ad50xpl2yquc1rdw216a00enmv';
        // 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
        $alipay_config['notify_url'] = "http://wechat.baihey.com/wap/charge/notify-url";

        // 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
        $alipay_config['return_url'] = "http://wechat.baihey.com/wap/charge/notify-url";

        //签名方式
        $alipay_config['sign_type'] = strtoupper('MD5');

        //字符编码格式 目前支持utf-8
        $alipay_config['input_charset'] = strtolower('utf-8');

        //ca证书路径地址，用于curl中ssl校验
        //请保证cacert.pem文件在当前文件夹目录中
        $alipay_config['cacert'] = 'http://wechat.baihey.com/common/util/pay/alipay/cacert.pem';
        //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
        $alipay_config['transport'] = 'http';

        // 支付类型 ，无需修改
        $alipay_config['payment_type'] = "1";

        // 产品类型，无需修改
        $alipay_config['service'] = "alipay.wap.create.direct.pay.by.user";

        return $alipay_config;
    }

}