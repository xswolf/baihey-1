<?php
namespace common\models;

use common\models\User;
use Yii;
use yii\db\Query;

/**
 * 订单类
 * Class ChargeOrder
 * @package common\models
 */
class ChargeOrder extends Base
{

    /**
     * 获取所有订单
     * @return static[]
     */
    public function getAllList()
    {
        return (new Query())->from($this->tablePrefix . 'charge_order')
            ->select('*')
            ->all();
    }

    /**
     * 根据订单ID查询订单信息
     * @param $orderId ID
     * @return null|static
     */
    public function getOne($orderId)
    {
        return (new Query())->from($this->tablePrefix . 'charge_order')
            ->where('order_id=' . $orderId)
            ->select('*')
            ->one();
    }


    /**
     * 生成订单号
     * @return string
     */
    public function createOrderId()
    {
        return date('Ymd') . substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);;
    }

    /**
     * 创建订单
     * @param $data
     * @return mixed
     */
    public function createOrder($user_id,$data)
    {

        $order = $this->getInstance();
        $goods = ChargeGoods::getInstance()->getOne($data['goodsId']);
        $order['user_id'] = $user_id;
        $order['order_id'] = ChargeOrder::getInstance()->createOrderId();
        $order['native_money'] = $goods['native_price'];
        if ($data['goodsId'] == 8 || $data['goodsId'] == 9) {
            $order['money'] = $data['money'] * 100;
        } else {
            $order['money'] = $goods['price'];
        }
        $order['exchange_money'] = $goods['price'];
        $order['charge_goods_id'] = $data['goodsId'];
        if (isset($data['chargeTypeId'])) {
            $order['charge_type_id'] = $data['chargeTypeId'];
        }
        if (isset($data['authorId'])) {
            $order['authorid'] = $data['authorId'];
        }
        $order['create_time'] = time();
        $order['create_date'] = date('Ymd');
        if ($order->save()) {
            return $order['order_id'];
        }
        return false;
    }

    /**
     * @param $orderId
     * 发起微信支付
     */
    public function weiXinPay($orderId){
        //①、获取用户openid
        $tools = new \JsApiPay();
        $openId = $tools->GetOpenid();
        //②、统一下单
        $orderInfo = ChargeOrder::getInstance()->getOne($orderId);
        $goods = ChargeGoods::getInstance()->getOne($orderInfo['charge_goods_id']);
        $input = new \WxPayUnifiedOrder();
        $input->SetBody("嘉瑞百合缘-【" . $goods['name'] . "】");
        $input->SetAttach("手机网站");
        $input->SetOut_trade_no($orderInfo['orderId']);
        $input->SetTotal_fee((string)$orderInfo['money']);
        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        $input->SetNotify_url("http://wechat.baihey.com/wap/charge/notify-url");
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        $order = \WxPayApi::unifiedOrder($input);
        $jsApiParameters = $tools->GetJsApiParameters($order);
        return ['orderInfo'=>$orderInfo , 'jsApiParameters' => $jsApiParameters];
    }

    /**
     * 根据订单号获取商品信息
     * @param $orderId
     * @return array
     */
    public function getOrderInfo($orderId)
    {
        $obj = (new Query())->from($this->tablePrefix . 'charge_order o')
            ->innerJoin($this->tablePrefix . 'charge_goods g', 'o.charge_goods_id = g.id')
            ->where(['o.order_id' => $orderId])
            ->select('o.id,o.order_id,o.status,o.create_time,o.money,o.charge_goods_id,g.name,g.value,g.price,g.native_price,g.img');
//          echo $obj->createCommand()->getRawSql();
        return $obj->all();
    }

    /**
     * 设置订单状态
     * @param $orderId
     * @param int $status
     * @return bool
     */
    public function setOrderStatus($orderId, $status = 1)
    {
        $orderInfo = $this->getInstance()->getOne($orderId);  // 订单信息
        if ($orderInfo['status'] == 1) return true;        // 异常情况，不予处理，订单已经成功
        $tran = \Yii::$app->db->beginTransaction();

        $row = $this->updateAll(['status' => $status, 'finsh_time' => time()], ['order_id' => $orderId]);  // 修改订单状态

        $bal = User::getInstance()->changeBalance($orderInfo['user_id'], -$orderInfo['money']);  // 充值余额

        if ($orderInfo['charge_goods_id'] != 8) {
            $mat = User::getInstance()->changeMatureTime($orderInfo['user_id'], $orderInfo['charge_goods_id']);  // 开通服务
        } else {
            $mat = true;
        }

        if ($row && $bal && $mat) {
            $tran->commit();  // 提交
            return true;
        }
        $tran->rollBack();   // 回滚
        return false;
    }

    // 修改充值方式
    public function setOrderChargeType($typeId)
    {
        return $this->updateAll(['charge_type_id' => $typeId]);
    }


    // 后台订单列表
    public function getOrderAllInfo()
    {
        $obj = (new Query())->from($this->tablePrefix . 'charge_order o')
            ->innerJoin($this->tablePrefix . 'charge_goods g', 'o.charge_goods_id = g.id')
            ->innerJoin($this->tablePrefix . 'user_information i', 'o.user_id = i.user_id')
            ->innerJoin($this->tablePrefix . 'charge_type t', 'o.charge_type_id = t.id')
            ->where([])
            ->select(["o.order_id", "i.user_id", "json_extract(i.info , '$.real_name') AS real_name", "g.name AS goodsName", "o.money", "t.name AS typeName", "o.authorid", "o.create_time AS time", "o.status","g.value"])
            ->orderBy("time desc");
//          echo $obj->createCommand()->getRawSql();exit();
        return $obj->all();
    }

}
