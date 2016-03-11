<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/11
 * Time: 14:16
 */

define( 'TOKEN' , 'cqbaihey' );
checkSignature();


function checkSignature() {
    $signature = $_GET["signature"];
    $timestamp = $_GET["timestamp"];
    $nonce     = $_GET["nonce"];
    $token     = TOKEN;
    $tmpArr    = [ $token , $timestamp , $nonce ];
    sort( $tmpArr , SORT_STRING );
    $tmpStr = implode( $tmpArr );
    $tmpStr = sha1( $tmpStr );

    if ( $tmpStr == $signature ) {
        return true;
    } else {
        return false;
    }
}