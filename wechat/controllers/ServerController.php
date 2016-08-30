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
        $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
        file_put_contents('./log.txt' , $postStr."\n" ,FILE_APPEND);
        if ( ! empty( $postStr ) ) {
            libxml_disable_entity_loader( true );
            $postObj      = simplexml_load_string( $postStr , 'SimpleXMLElement' , LIBXML_NOCDATA );
            $fromUsername = $postObj->FromUserName;
            $fromUsername = trim($fromUsername);
            $toUsername   = $postObj->ToUserName;

//            if('subscribe' != $postObj->Event){
//                echo '';exit;
//            }

//            $resultStr = \Yii::$app->wechat->responseText($fromUsername , $toUsername);
            $resultStr = \Yii::$app->wechat->responseNews($fromUsername , $toUsername);
//            $articles = [
//                'title' => 'Happy Day',
//                'description' => 'Is Really A Happy Day',
//                'url' => '',
//                'picurl' => ''
//             ];
//            $resultStr = \Yii::$app->wechat->sendNews($fromUsername , $articles);


            file_put_contents('./log.txt' , $resultStr."\n" ,FILE_APPEND);
            echo $resultStr;
            exit;

        } else {
            echo "";
            exit;
        }
    }

    public function actionTest(){
        $articles = [
            'title' => 'Happy Day',
            'description' => 'Is Really A Happy Day',
            'url' => '',
            'picurl' => ''
         ];

        if(\Yii::$app->wechat->sendNews("oEQpts_I-K1D4Iz5Irp5v5r1yU_o" , $articles)){
            echo "--";
        }else{
            echo "==";
        }

    }

    public function actionMaterial(){
        $result_1 = \Yii::$app->wechat->deleteMenu();

        $appId = \Yii::$app->wechat->appId;
        $redirectUri = urlencode("http://wechat.baihey.com/wap/site/href");

        $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$appId}&redirect_uri={$redirectUri}&response_type=code&scope=snsapi_base&state=tes#wechat_redirect";
        $result = \Yii::$app->wechat->createMenu([
            [
                'type' => 'view',
                'name' => '进入嘉瑞',
                'url' => $url
            ]
                ]
        );


        var_dump(\Yii::$app->wechat->getMenuList());

        var_dump($result_1);

        var_dump($result);
    }

    public function actionMaterialList(){
        \Yii::$app->wechat->materialList();
    }

}