<?php
namespace common\models;

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
     * 获取所有商品
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
    public function createOrder($data)
    {
        $order = $this->getInstance();
        $goods = ChargeGoods::getInstance()->getOne($data['goodsId']);
        $order['user_id'] = $data['user_id'];
        $order['order_id'] = ChargeOrder::getInstance()->createOrderId();
        $order['native_money'] = $goods['native_price'];
        $order['money'] = $goods['price'];
        $order['exchange_money'] = $goods['price'];
        $order['charge_goods_id'] = $data['goodsId'];
        $order['create_time'] = time();
        $order['create_date'] = date('Ymd');
        if ($order->save()) {
            return $order['order_id'];
        }
        return false;
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
            ->select('o.id,o.order_id,g.*');
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

        $row = $this->updateAll(['status' => $status], ['order_id' => $orderId]);

       /* if ($orderInfo['id'] == '-1') {   // 充值余额

            $money = User::getInstance()->changeBalance($orderInfo['uid'], -($orderInfo['money'] / 100));

        } else {  // 开通服务


        }*/
        if ($row) {
            $tran->commit();
            return true;
        }
        $tran->rollBack();
        return false;

    }


}
