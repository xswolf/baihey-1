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
        'seller_id' => '2088701919851801',
        'service'=>'alipay.wap.create.direct.pay.by.user',
        'payment_type' => '1',
        'notify_url' => 'http://wehcat.baihey.com/wap/charge/notify-url',
        'return_url' => 'http://wehcat.baihey.com/wap/charge/notify-url',
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


}