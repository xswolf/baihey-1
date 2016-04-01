<?php
namespace common\util;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/1
 * Time: 13:50
 */
class Curl{

    public static $instance = null;

    /**
     * @return $this
     */
    public static function getInstance(){
        if (self::$instance == null){
            $class = get_called_class();
            $obj = new $class();
            self::$instance = $obj;
        }
        return self::$instance;
    }

    /**
     * @param $url
     * @param $data
     * @return mixed
     */
    public function curl_post($url , $data , $debug = false){

        $ch = curl_init ();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POST, 1 );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $data );
        $result = curl_exec ( $ch );
        curl_close ( $ch );
        if ($debug){
            echo "调用的URL是：".$url;
            echo $data;
        }
        return $result;
    }
}