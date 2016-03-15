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
            file_put_contents('./log.txt' , "gz\n" ,FILE_APPEND);

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
        file_put_contents('./log.txt' , $postStr."\n" ,FILE_APPEND);

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

//            $user = \Yii::$app->wechat->getMemberInfo($toUsername);

            $msgType    = "text";
            $content = "<a href='http://www.baihey.com/wap/chat/list'>well come to jia rui</a>";
            $resultStr  = sprintf( $textTpl , $fromUsername , $toUsername , $time , $msgType , $content );
            file_put_contents('./log.txt' , $resultStr ,FILE_APPEND);
            echo $resultStr;
        } else {
            echo "";
            exit;
        }
    }

    public function actionUser(){
    }
}