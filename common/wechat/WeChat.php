<?php
namespace common\wechat;
use common\util\Curl;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/15
 * Time: 14:25
 */
class WeChat extends \callmez\wechat\sdk\Wechat {

    const MATERIAL_LIST = "https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=";

    /**
     * 素材
     *
     * @param $id
     */
    public function material( $id ) {
        $data      = [ 'media_id' => $id ];
        $data      = http_build_query( $data );
        $opts      = [
            'http' => [
                'method'  => "POST" ,
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n" . "Content-length:" . strlen( $data ) . "\r\n" . "Cookie: foo=bar\r\n" . "\r\n" ,
                'content' => $data ,
            ]
        ];
        $cxContext = stream_context_create( $opts );
        $url       = "https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=$this->token";
        $html      = file_get_contents( $url , false , $cxContext );
        var_dump( $html );
        exit;
    }

    /**
     * 获取素材列表
     * @throws \yii\web\HttpException
     */
    public function materialList() {
        $url             = self::MATERIAL_LIST . $this->getAccessToken();

        $param['type']   = 'news';
        $param['offset'] = 0;
        $param['count']  = 20;
        $paramJson = json_encode($param);
        $result = Curl::getInstance()->curl_post($url , $paramJson );
        $result = json_decode($result);
        print_r( $result );
    }

}