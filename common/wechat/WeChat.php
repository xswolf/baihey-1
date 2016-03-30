<?php
namespace common\wechat;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/15
 * Time: 14:25
 */
class WeChat extends \callmez\wechat\sdk\Wechat {


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
}