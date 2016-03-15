<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/15
 * Time: 15:45
 */

namespace wechat\controllers;


class ServerController extends BaseController {

    /**
     * 微信服务器推送事件
     */
    public function actionEvent() {

        if ( ! isset( $_GET['echostr'] ) ) {
            // 关注
            $this->responseMsg();
        } else {
            // 验证服务器
            $this->validate();
        }
    }

    private function validate() {
        $echoStr = $_GET["echostr"];
        echo $echoStr;
    }

    private function responseMsg() {
        //get post data, May be due to the different environments
        $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];

        //extract post data
        if ( ! empty( $postStr ) ) {
            /* libxml_disable_entity_loader is to prevent XML eXternal Entity Injection,
               the best way is to check the validity of xml by yourself */
            libxml_disable_entity_loader( true );
            $postObj      = simplexml_load_string( $postStr , 'SimpleXMLElement' , LIBXML_NOCDATA );
            $fromUsername = $postObj->FromUserName;
            $toUsername   = $postObj->ToUserName;
            $time         = time();
            $textTpl      = "<xml>
							<ToUserName><![CDATA[%s]]></ToUserName>
							<FromUserName><![CDATA[%s]]></FromUserName>
							<CreateTime>%s</CreateTime>
							<MsgType><![CDATA[%s]]></MsgType>
							<Content><![CDATA[%s]]></Content>
							<FuncFlag>0</FuncFlag>
							</xml>";

//            $this->getWeChatUser($toUsername);


            $msgType    = "text";
            $contentStr = "Welcome to wechat world!";
            $resultStr  = sprintf( $textTpl , $fromUsername , $toUsername , $time , $msgType , $contentStr );
            file_put_contents('log.txt' , implode(',' , $resultStr));
            echo $resultStr;
        } else {
            echo "";
            exit;
        }
    }

    public function getWeChatUser($openId){
        $userInfo = \Yii::$app->wechat->getMemberInfo($openId);
        file_put_contents('log.txt' , implode(',' , $userInfo));
    }

    public function actionUser(){
        $openId = '';
        $userInfo = \Yii::$app->wechat->getMemberInfo($openId);
        var_dump($userInfo);
    }

}