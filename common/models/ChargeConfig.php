<?php
/**
 * Created by PhpStorm.
 * User: NSK.
 * Date: 2016/3/23/0023
 * Time: 11:33
 */
namespace common\models;


class ChargeConfig extends Base
{

    /**
     * 支付宝
     * @var array
     */
    public $AlipayConfig = [
        'partner' => '2088701919851801',
        'key' => 'np84w319xyg4r1p9uo69tiexwqhmy3w3',
        'seller_email' => '1045834146@qq.com',
        'notify_url' => 'http://www.baihey.com/Charge/Charge/notify?action=Alipay',
        'return_url' => 'http://www.baihey.com/Charge/Charge/notify?action=Alipay',
        'defaultbank' => 'CMB',
        'bank' => [
            [                  //招商银行
                'CODE' => 'CMB',
                'LOGURL' => '/wap/images/banks_icon/bank1.jpg'
            ],
            [                 //交通银行
                'CODE' => 'COMM',
                'LOGURL' => '/wap/images/banks_icon/bank2.jpg'
            ],
            [                 //兴业银行
                'CODE' => 'CIB',
                'LOGURL' => '/wap/images/banks_icon/bank3.jpg'
            ],
            [                 //工商银行
                'CODE' => 'ICBC',
                'LOGURL' => '/wap/images/banks_icon/bank4.jpg'
            ],
            [                 //上海浦东发展银行
                'CODE' => 'SPDB',
                'LOGURL' => '/wap/images/banks_icon/bank5.jpg'
            ],
            [                 //中国银行
                'CODE' => 'BOC',
                'LOGURL' => '/wap/images/banks_icon/bank6.jpg'
            ],
            [                 //建设银行
                'CODE' => 'CCB',
                'LOGURL' => '/wap/images/banks_icon/bank7.jpg'
            ],
            [                 //民生银行
                'CODE' => 'CMBC',
                'LOGURL' => '/wap/images/banks_icon/bank8.jpg'
            ],
            [                 //农业银行
                'CODE' => 'ABC',
                'LOGURL' => '/wap/images/banks_icon/bank9.jpg'
            ],
            [                 //广发银行
                'CODE' => 'GDB',
                'LOGURL' => '/wap/images/banks_icon/bank10.jpg'
            ],
            [                 //光大银行
                'CODE' => 'CEB',
                'LOGURL' => '/wap/images/banks_icon/bank11.jpg'
            ],
            [                 //中信银行
                'CODE' => 'CITIC',
                'LOGURL' => '/wap/images/banks_icon/bank12.jpg'
            ],
            [                 //北京银行
                'CODE' => 'BJBANK',
                'LOGURL' => '/wap/images/banks_icon/bank13.jpg'
            ],
            [                 //邮政储蓄银行
                'CODE' => 'PSBC',
                'LOGURL' => '/wap/images/banks_icon/bank14.jpg'
            ],
            [                 //杭州银行
                'CODE' => 'HZCB',
                'LOGURL' => '/wap/images/banks_icon/bank15.jpg'
            ],
            [                 //平安银行
                'CODE' => 'SPABANK',
                'LOGURL' => '/wap/images/banks_icon/bank16.jpg'
            ]
        ]
    ];

    /**
     * 手机网站支付宝
     * @var array
     */
    public $MobileAlipayConfig = [
        'partner' => '2088701919851801',
        'key' => 'np84w319xyg4r1p9uo69tiexwqhmy3w3',
        'seller_id' => '2088701919851801',
        'notify_url' => 'http://www.baihey.com/Charge/Charge/notify?action=MobileAlipay',
        'return_url' => 'http://www.baihey.com/Charge/Charge/notify?action=MobileAlipay',
        'defaultbank' => 'CMB',
        'bank' => [
            'CMB' => [                  //招商银行
                'CODE' => 'CMB',
                'LOGURL' => '/wap/images/banks_icon/bank1.jpg'
            ],
            'COMM' => [                 //交通银行
                'CODE' => 'COMM',
                'LOGURL' => '/wap/images/banks_icon/bank2.jpg'
            ],
            'CIB' => [                 //兴业银行
                'CODE' => 'CIB',
                'LOGURL' => '/wap/images/banks_icon/bank3.jpg'
            ],
            'ICBC' => [                 //工商银行
                'CODE' => 'ICBC',
                'LOGURL' => '/wap/images/banks_icon/bank4.jpg'
            ],
            'SPDB' => [                 //上海浦东发展银行
                'CODE' => 'SPDB',
                'LOGURL' => '/wap/images/banks_icon/bank5.jpg'
            ],
            'BOC' => [                 //中国银行
                'CODE' => 'BOC',
                'LOGURL' => '/wap/images/banks_icon/bank6.jpg'
            ],
            'CCB' => [                 //建设银行
                'CODE' => 'CCB',
                'LOGURL' => '/wap/images/banks_icon/bank7.jpg'
            ],
            'CMBC' => [                 //民生银行
                'CODE' => 'CMBC',
                'LOGURL' => '/wap/images/banks_icon/bank8.jpg'
            ],
            'ABC' => [                 //农业银行
                'CODE' => 'ABC',
                'LOGURL' => '/wap/images/banks_icon/bank9.jpg'
            ],
            'GDB' => [                 //广发银行
                'CODE' => 'GDB',
                'LOGURL' => '/wap/images/banks_icon/bank10.jpg'
            ],
            'CEB' => [                 //光大银行
                'CODE' => 'CEB',
                'LOGURL' => '/wap/images/banks_icon/bank11.jpg'
            ],
            'CITIC' => [                 //中信银行
                'CODE' => 'CITIC',
                'LOGURL' => '/wap/images/banks_icon/bank12.jpg'
            ],
            'BJBANK' => [                 //北京银行
                'CODE' => 'BJBANK',
                'LOGURL' => '/wap/images/banks_icon/bank13.jpg'
            ],
            'PSBC' => [                 //邮政储蓄银行
                'CODE' => 'PSBC',
                'LOGURL' => '/wap/images/banks_icon/bank14.jpg'
            ],
            'HZCB' => [                 //杭州银行
                'CODE' => 'HZCB',
                'LOGURL' => '/wap/images/banks_icon/bank15.jpg'
            ],
            'SPABANK' => [                 //平安银行
                'CODE' => 'SPABANK',
                'LOGURL' => '/wap/images/banks_icon/bank16.jpg'
            ]
        ]
    ];

    /**
     * 手机网站银联支付
     * @var array
     */
    public $MobileUnionpay = [
        'merId' => '802500072770502',
        'version' => '5.0.0',
        'encoding' => 'utf-8',
        'txnType' => '01',
        'txnSubType' => '01',
        'bizType' => '000201',
        'frontUrl' =>  'http://192.168.0.120/Charge/Charge/notify',
        'backUrl' => 'http://192.168.0.120/Charge/Charge/notify',
        'signMethod' => '01',
        'channelType' => '08',
        'accessType' => '0',
        'currencyCode' => '156'
    ];




}