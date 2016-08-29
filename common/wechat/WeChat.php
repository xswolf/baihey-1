<?php
namespace common\wechat;

use common\util\Curl;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/15
 * Time: 14:25
 */
class WeChat extends \callmez\wechat\sdk\Wechat {

    const MATERIAL_LIST = "https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=";
    const MATERIAL_SEND = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=";
    const OAUTH_TOKEN = "/sns/oauth2/access_token";
    /**
     * 素材
     *
     * @param $id
     */
    public function material( $id ) {
        $data      = [ 'media_id' => $id ];
        $data      = http_build_query( $data );
        $opts      = [
            'http' => [
                'method'  => "POST" ,
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n" . "Content-length:" . strlen( $data ) . "\r\n" . "Cookie: foo=bar\r\n" . "\r\n" ,
                'content' => $data ,
            ]
        ];
        $cxContext = stream_context_create( $opts );
        $url       = "https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=$this->token";
        $html      = file_get_contents( $url , false , $cxContext );
        var_dump( $html );
        exit;
    }

    /**
     * 获取素材列表
     * @throws \yii\web\HttpException
     */
    public function materialList() {
        $url = self::MATERIAL_LIST . $this->getAccessToken();

        $param['type']   = 'news';
        $param['offset'] = 0;
        $param['count']  = 20;
        $paramJson       = json_encode( $param );
        $result          = Curl::getInstance()->curl_post( $url , $paramJson );
        $result          = json_decode( $result );
        var_dump($result);
        return $result;

    }

    public function responseNews( $fromUserName,$toUserName ) {
        $newTpl = "<xml>
                    <ToUserName><![CDATA[%s]]></ToUserName>
                    <FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime>
                    <MsgType><![CDATA[news]]></MsgType>
                    <ArticleCount>1</ArticleCount>
                    <Articles>
                    <item>
                    <Title><![CDATA[%s]]></Title>
                    <Description><![CDATA[%s]]></Description>
                    <PicUrl><![CDATA[%s]]></PicUrl>
                    <Url><![CDATA[%s]]></Url>
                    </item>
                    </Articles>
                   </xml>";
        $resultStr = sprintf($newTpl,$toUserName,$fromUserName,time(),'wel','join','....','....');
        return $resultStr;
    }

    public function responseImage($toUserName,$fromUserName){
        $newTpl = "<xml>
        <ToUserName><![CDATA[%s]]></ToUserName>
        <FromUserName><![CDATA[%s]]></FromUserName>
        <CreateTime>%s</CreateTime>
        <MsgType><![CDATA[image]]></MsgType>
        <Image>
        <MediaId><![CDATA[%s]]></MediaId>
        </Image>
        <FuncFlag>0</FuncFlag>
        </xml>";
        $resultStr = sprintf($newTpl,$toUserName,$fromUserName,time(),'UcYjTEWj_yXuX86RCsA1JXIwJ25RHX6I28PW7u73chs');
        return $resultStr;
    }

    public function responseText($fromUsername,$toUsername){
        $textTpl      = "<xml>
                        <ToUserName><![CDATA[%s]]></ToUserName>
                        <FromUserName><![CDATA[%s]]></FromUserName>
                        <CreateTime>%s</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[%s]]></Content>
                        <FuncFlag>0</FuncFlag>
                        </xml>";
        $content = "<a href='http://wechat.baihey.com/wap/site/main#/index'>欢迎进入嘉瑞</a>";
        $resultStr  = sprintf( $textTpl , $fromUsername , $toUsername , time() , $content );
        return $resultStr;
    }

    /**
     * @param $code 网页授权返回CODE
     *
     * @return array|bool 微信用户信息
     */
    public function getMemberByCode($code){

        $result = $this->httpGet(self::OAUTH_TOKEN."?appid={$this->appId}&secret={$this->appSecret}&code={$code}&grant_type=authorization_code");
        if (isset($result['openid'])){
            $member = \Yii::$app->wechat->getMemberInfo($result['openid']);
        }else{
            var_dump($result);
            echo "<br>".$code;
            exit;
        }

        return $member;
    }

}