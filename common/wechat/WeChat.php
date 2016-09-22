<?php
namespace common\wechat;

use common\util\Curl;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/15
 * Time: 14:25
 */
class WeChat extends \callmez\wechat\sdk\Wechat
{

    const MATERIAL_LIST = "https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=";
    const MATERIAL_SEND = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=";
    const OAUTH_TOKEN   = "/sns/oauth2/access_token";
    // 发红包接口
    const OAUTH_PACK = "https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack";
    const MCH_ID     = 1244137602;

    /**
     * 发送红包
     * @param $args
     * @return bool
     */
    public function sendPack($args)
    {
        $data = [
            'mch_billno'=> $args['order_id'],
            'mch_id'=> static::MCH_ID,
            'wxappid'=> $this->appId,
            'send_name'=> 'hello',
            're_openid'=> $args['openid'],
            'total_amount'=> $args['total_amount'],
            'total_num'=> 1,
            'wishing'=> 'hello',
            'client_ip'=> '120.76.84.162',
            'act_name'=> 'hello',
            'remark'=> 'hello',
            'scene_id'=> 'PRODUCT_2',
            'nonce_str'=> 1234561, //\Yii::$app->getSecurity()->generateRandomString(16),
        ];
        ksort($data);
        $str = http_build_query($data)."&key=" . $this->appSecret;
        $sign = strtoupper(md5($str));

        $xmlData = "<xml>
                    <act_name>{$data['act_name']}</act_name>
                    <client_ip>{$data['client_ip']}</client_ip>
                    <mch_billno>{$args['order_id']}</mch_billno>
                    <mch_id>" . static::MCH_ID . "</mch_id>
                    <nonce_str>" . $data['nonce_str'] . "</nonce_str>
                    <scene_id>{$data['scene_id']}</scene_id>
                    <send_name>{$data['send_name']}</send_name>
                    <re_openid>{$args['openid']}</re_openid>
                    <remark>{$data['remark']}</remark>
                    <total_amount>{$args['total_amount']}</total_amount>
                    <total_num>1</total_num>
                    <wishing>{$data['wishing']}</wishing>
                    <wxappid>{$this->appId}</wxappid>
                    <sign>{$sign}</sign>
                  </xml>";

        echo $sign."\n";
        echo $str."\n";
        echo $xmlData;

        $ch = curl_init();
        //超时时间
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch, CURLOPT_URL, static::OAUTH_PACK);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);


        //默认格式为PEM，可以注释
        curl_setopt($ch, CURLOPT_SSLCERTTYPE, 'PEM');

        curl_setopt($ch, CURLOPT_SSLCERT, getcwd() . '/pem/apiclient_cert.pem');
        curl_setopt($ch, CURLOPT_SSLKEY, getcwd() . '/pem/apiclient_key.pem');
        curl_setopt($ch, CURLOPT_CAINFO, getcwd() . '/pem/rootca.pem');


        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlData);
        $data = curl_exec($ch);
        if ($data) {
            curl_close($ch);
            return $data;
        } else {
            $error = curl_errno($ch);
            echo "call faild, errorCode:$error\n";
            curl_close($ch);
            return false;
        }
    }

    /**
     * 素材
     *
     * @param $id
     */
    public function material($id)
    {
        $data      = ['media_id' => $id];
        $data      = http_build_query($data);
        $opts      = [
            'http' => [
                'method' => "POST",
                'header' => "Content-type: application/x-www-form-urlencoded\r\n" . "Content-length:" . strlen($data) . "\r\n" . "Cookie: foo=bar\r\n" . "\r\n",
                'content' => $data,
            ]
        ];
        $cxContext = stream_context_create($opts);
        $url       = "https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=$this->token";
        $html      = file_get_contents($url, false, $cxContext);
        var_dump($html);
        exit;
    }

    /**
     * 获取素材列表
     * @throws \yii\web\HttpException
     */
    public function materialList()
    {
        $url = self::MATERIAL_LIST . $this->getAccessToken();

        $param['type']   = 'news';
        $param['offset'] = 0;
        $param['count']  = 20;
        $paramJson       = json_encode($param);
        $result          = Curl::getInstance()->curl_post($url, $paramJson);
        $result          = json_decode($result);
        //        var_dump($result);
        return $result;

    }

    public function responseNews($fromUserName, $toUserName)
    {


        $tpl       = "<xml>
						<ToUserName><![CDATA[%s]]></ToUserName>
						<FromUserName><![CDATA[%s]]></FromUserName>
						<CreateTime>%s</CreateTime>
						<MsgType><![CDATA[%s]]></MsgType>
						<ArticleCount>1</ArticleCount>
						<Articles>
								<item>
								<Title><![CDATA[%s]]></Title>
								<Description><![CDATA[%s]]></Description>
								<PicUrl><![CDATA[%s]]></PicUrl>
								<Url><![CDATA[%s]]></Url>
								</item>
						</Articles>
						</xml> ";
        $msgType   = 'news';
        $resultStr = sprintf($tpl, $fromUserName, $toUserName, time(), $msgType, '关于嘉瑞百合缘', '重庆嘉瑞婚介有限责任公司是一家实名制相亲平台，有严格的身份审核程序，所有会员均需进行身份证认证。', 'https://mmbiz.qlogo.cn/mmbiz_jpg/hD1GpvgKwC6Vbw35ibCXgac9fMdFdjkq9VpmJvYIVG315UEEQhuCAJGHlHVwVHjYEmSDhrAhWribAXibMibyicNOicRw/0?wx_fmt=jpeg', 'http://mp.weixin.qq.com/s?__biz=MzAxMDI2NzY2NQ==&mid=2451958352&idx=1&sn=e855c5a3a52799be378dc25f7d3963cc&scene=0#wechat_redirect');

        return $resultStr;
    }

    public function responseImage($toUserName, $fromUserName)
    {
        $newTpl    = "<xml>
        <ToUserName><![CDATA[%s]]></ToUserName>
        <FromUserName><![CDATA[%s]]></FromUserName>
        <CreateTime>%s</CreateTime>
        <MsgType><![CDATA[image]]></MsgType>
        <Image>
        <MediaId><![CDATA[%s]]></MediaId>
        </Image>
        <FuncFlag>0</FuncFlag>
        </xml>";
        $resultStr = sprintf($newTpl, $toUserName, $fromUserName, time(), 'UcYjTEWj_yXuX86RCsA1JXIwJ25RHX6I28PW7u73chs');
        return $resultStr;
    }

    public function responseText($fromUsername, $toUsername)
    {
        $textTpl   = "<xml>
                        <ToUserName><![CDATA[%s]]></ToUserName>
                        <FromUserName><![CDATA[%s]]></FromUserName>
                        <CreateTime>%s</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[%s]]></Content>
                        <FuncFlag>0</FuncFlag>
                        </xml>";
        $content   = "<a href='http://wechat.baihey.com/wap/site/main#/index'>欢迎进入嘉瑞</a>";
        $resultStr = sprintf($textTpl, $fromUsername, $toUsername, time(), $content);
        return $resultStr;
    }

    /**
     * @param $code 网页授权返回CODE
     *
     * @return array|bool 微信用户信息
     */
    public function getMemberByCode($code)
    {

        $result = $this->httpGet(self::OAUTH_TOKEN . "?appid={$this->appId}&secret={$this->appSecret}&code={$code}&grant_type=authorization_code");
        if (isset($result['openid'])) {
            $member = \Yii::$app->wechat->getMemberInfo($result['openid']);
        } else {
            exit;
        }

        return $member;
    }

}