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
            //$this->responseMsg();
            \Yii::$app->wechat->rassiveReply();
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

            $msgType    = "text";
            $content = "<a href='http://wechat.baihey.com/wap/chat/chat?name=1&sendName=12'>well come to jia rui</a>";
            $resultStr  = sprintf( $textTpl , $fromUsername , $toUsername , $time , $msgType , $content );

            if(\Yii::$app->wechat->getMemberInfo($postObj->FromUserName)){
                file_put_contents('./log.txt' , $postObj->FromUserName."\n" ,FILE_APPEND);
            }else{
                file_put_contents('./log.txt' , "chuxiancuowo\n" ,FILE_APPEND);
            }
            echo $resultStr;
            exit;
        } else {
            echo "";
            exit;
        }
    }

    public function actionUser(){
        $result = \Yii::$app->wechat->getMemberInfo("oEQpts_MMapxllPTfwRw0VfGeLSg");
        var_dump($result);
    }
}