<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/11
 * Time: 14:16
 */

define('TOKEN' , 'cqbaihey');
traceHttp();


function traceHttp(){
    file_put_contents('log.txt' ,date().$_SERVER['REMOTE_ADDR']);
}