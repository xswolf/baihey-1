<?php
namespace wechat\models;

use common\models\Base;
use common\util\Cookie;
use yii\db\Query;


/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/18
 * Time: 16:58
 */
class ChargeOrder extends \common\models\Base
{
    /**
     * 生成订单号
     * @return string
     */
    public function createOrderId(){
        return date('Ymd').substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8);;
    }

    /**
     * 创建订单
     */
    public function createOrder() {

    }

    /**
     * 根据订单号获取订单信息
     * @param $orderId
     * @return mixed
     */
    public function findOrderByOrderId($orderId) {

    }

    /**
     * 设置订单状态
     * @param $orderId
     * @param int $status
     * @return bool
     */
    public function setOrderStatus($orderId, $status = 1) {
        $orderInfo = $this->findOrderByOrderId($orderId);  // 订单信息
        if ($orderInfo['status'] == 1) return true;        // 异常情况，不予处理，订单已经成功
        $userInfo = UsermemberModel::instance()->findById($orderInfo['uid']); // 获取用户基本信息
        $m        = M($this->_table);
        $m->startTrans();   //开启事务
        $sta = $m->where('order_id='.$orderId)->setField('status', $status);         // 设置订单状态
        $goods = ChargeGoodsModel::instance()->findById($orderInfo['charge_goods_id']);

        if ($goods['type'] == 'jyb') {         // 嘉缘币
            $ret  = UsermemberModel::instance()->addJyb($userInfo['id'], $this->getJybByGoodsType($goods, $userInfo['id'], $orderInfo['money']));
            $give = true;
        } elseif ($goods['type'] == 'time') {   // 包月服务
            $ret  = UsermemberModel::instance()->addMemberTime($userInfo['id'],$goods, $this->getMemberTimeGoodsType($goods, $orderInfo['id']));
            $give = UsermemberModel::instance()->addJyb($userInfo['id'], $this->getJybByGoodsType($goods, $userInfo['id']));
        }else{                  //vip
            $ret  = UsermemberModel::instance()->addMemberTime($userInfo['id'],$goods, $this->getMemberTimeGoodsType($goods, $orderInfo['id']));
            $give = UsermemberModel::instance()->addJyb($userInfo['id'], $this->getJybByGoodsType($goods, $userInfo['id']));
        }
        if ($sta && $ret && $give) {    // 提交事务
            $m->where('order_id='.$orderId)->setField('finsh_time', time());
            $m->commit();
            return true;
        }
        $m->rollback();   //回滚
        return false;
    }

    /**
     * 获取支付汇率
     * @param $money  充值金额
     * @param $typeId 支付类型
     * @return mixed
     */
    public function getExchange($money, $typeId) {
        $chargeType = ChargeTypeModel::instance()->findById($typeId);
        return $money * $chargeType['exchange'];
    }
}