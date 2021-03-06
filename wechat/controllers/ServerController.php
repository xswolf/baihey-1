<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/15
 * Time: 15:45
 * 微信自动回复累
 */

namespace wechat\controllers;


use common\models\UserActive;

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
            $fromUsername = trim($postObj->FromUserName);

            if ($postObj->Event == 'SCAN' && $postObj->Ticket == 'gQFq8ToAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL1dFZ0NFUHptMk9xaDJCTlBJMlRWAAIE_oP8VwMEAAAAAA==') {
//                echo \Yii::$app->wechat->sendText($fromUsername,"");

                UserActive::getInstance()->sendMoney($fromUsername);
                exit;
            }elseif ('subscribe' == $postObj->Event){
                $this->process($fromUsername);
                exit;
            }else{
                echo '';
                exit;
            }

        } else {
            echo "";
            exit;
        }
    }

    protected function process($fromUsername){
        /***********************客服消息****************************/
        $articles = [
            [
                'title' => '嘉瑞百合缘微站上线啦！',
                'description' => '全新界面，简易操作，实名认证，安全放心！',
                'url' => 'http://mp.weixin.qq.com/s?__biz=MzAxMDI2NzY2NQ==&mid=304474733&idx=1&sn=e2b09f2496883d0a15d1e4dd9a6a1a47&chksm=0c83b7133bf43e050bfee9c787ecf4d6a312e314e2fdd579cd60a6a73e3e6854c4c2a929353e&mpshare=1&scene=1&srcid=1012zMg7WQkn9IcDEkgkxd2l&from=singlemessage&isappinstalled=0#wechat_redirect',
                'picurl' => 'https://mmbiz.qlogo.cn/mmbiz_jpg/hD1GpvgKwC7odZymQsyZ6MsxkBEB0X0s16k5ApWOYfHCXXUlsda4DwmicuuFEH6iaZCia5ZKnwet0vdUoxZ89I5Wg/0?wx_fmt=jpeg'
            ]
        ];
        $resultStr = \Yii::$app->wechat->sendNews($fromUsername , $articles);
        /***********************客服消息****************************/

        file_put_contents('./log.txt' , $resultStr."\n" ,FILE_APPEND);
        echo $resultStr;
    }

    public function actionTest(){
        $articles = [
            [
            'title' => 'Happy Day',
            'description' => 'Is Really A Happy Day',
            'url' => '',
            'picurl' => ''
            ]
         ];

        if(\Yii::$app->wechat->sendNews("oEQpts_I-K1D4Iz5Irp5v5r1yU_o" , $articles)){

        }else{

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

    public function actionReq(){
        $appId = \Yii::$app->wechat->appId;
        $redirectUri = urlencode("http://wechat.baihey.com/wap/user/register?qdid=10000");

        $url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$appId}&redirect_uri={$redirectUri}&response_type=code&scope=snsapi_userinfo&state=tes#wechat_redirect";
        echo $url;
    }

    public function actionMaterialList(){
        \Yii::$app->wechat->materialList();
    }




    public function actionSend(){
        $args = [
            'order_id'=>888888,
            'openid'=>'oEQpts29-N6dZxylb8NWwszca_rk',
            'total_amount'=>$this->randMoney()
        ];

        $data = \Yii::$app->wechat->sendPack($args);
        print_r($data);
    }
}