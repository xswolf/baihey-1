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

        //extract post data
        if ( ! empty( $postStr ) ) {
            /* libxml_disable_entity_loader is to prevent XML eXternal Entity Injection,
               the best way is to check the validity of xml by yourself */
            libxml_disable_entity_loader( true );
            $postObj      = simplexml_load_string( $postStr , 'SimpleXMLElement' , LIBXML_NOCDATA );
            $fromUsername = $postObj->FromUserName;
            $fromUsername = trim($fromUsername);
            $toUsername   = $postObj->ToUserName;


            $resultStr = \Yii::$app->wechat->responseNews($fromUsername , $toUsername);
//            $resultStr = \Yii::$app->wechat->responseText($fromUsername , $toUsername);

            \Yii::$app->wechat->createMenu([
                                   [
                                        'type' => 'click',
                                        'name' => '今日歌曲',
                                        'key' => 'V1001_TODAY_MUSIC'
                                   ],
                                   [
                                        'type' => 'view',
                                        'name' => '搜索',
                                        'url' => 'http://wechat.baihey.com'
                                   ]
                              ]);

            $userInfo = \Yii::$app->wechat->getMemberInfo($fromUsername);
            if(is_array($userInfo) && count($userInfo) > 0){
                file_put_contents('./log.txt' , $fromUsername."\n" ,FILE_APPEND);
            }else{
                file_put_contents('./log.txt' ,"chuxiancuowu\n" ,FILE_APPEND);
            }
            echo $resultStr;
            file_put_contents('./log.txt' , $resultStr."\n" ,FILE_APPEND);
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