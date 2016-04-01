<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/15
 * Time: 15:45
 * 微信自动回复累
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
        file_put_contents('./log.txt' , $postStr."\n" ,FILE_APPEND);

        file_put_contents('./log.txt' , json_encode($_GET)."\n" ,FILE_APPEND);
        //extract post data
        if ( ! empty( $postStr ) ) {
            /* libxml_disable_entity_loader is to prevent XML eXternal Entity Injection,
               the best way is to check the validity of xml by yourself */
            libxml_disable_entity_loader( true );
            $postObj      = simplexml_load_string( $postStr , 'SimpleXMLElement' , LIBXML_NOCDATA );
            $fromUsername = $postObj->FromUserName;
            $fromUsername = trim($fromUsername);
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
            $userInfo = \Yii::$app->wechat->getMemberInfo($fromUsername);
            if(is_array($userInfo) && count($userInfo) > 0){
                file_put_contents('./log.txt' , $fromUsername."\n" ,FILE_APPEND);
            }else{
                file_put_contents('./log.txt' ,"chuxiancuowu\n" ,FILE_APPEND);
            }
            echo $resultStr;

            \Yii::$app->wechat->sendMaterial($fromUsername , "TtSb9HO50njLDfRLrBEM_NKXrzVpIgfX9DYtwftdrGQ");

            exit;
        } else {
            echo "";
            exit;
        }
    }

    public function actionMaterial(){
//        $material = \Yii::$app->wechat->materialList();
        \Yii::$app->wechat->sendMaterial("oEQpts_MMapxllPTfwRw0VfGeLSg" , "TtSb9HO50njLDfRLrBEM_NKXrzVpIgfX9DYtwftdrGQ");
//        var_dump($material);
    }

}