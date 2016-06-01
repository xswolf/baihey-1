<?php
/**
 * Created by PhpStorm.
 * User=> Administrator
 * Date=> 2016/5/31 0031
 * Time=> 上午 11=>54
 */
namespace console\controllers;

use yii\console\Controller;
use backend\models\RndChinaName;

class NameController extends Controller
{

    public function birthExt($birth)
    {
        if (strstr($birth, '-') === false && strlen($birth) !== 8) {
            $birth = date("Y-m-d", $birth);
        }
        if (strlen($birth) === 8) {
            if (eregi('([0-9]{4})([0-9]{2})([0-9]{2})$', $birth, $bir))
                $birth = "{$bir[1]}-{$bir[2]}-{$bir[3]}";
        }
        if (strlen($birth) < 8) {
            return false;
        }
        $tmpstr = explode('-', $birth);
        if (count($tmpstr) !== 3) {
            return false;
        }
        $y      = (int)$tmpstr[0];
        $m      = (int)$tmpstr[1];
        $d      = (int)$tmpstr[2];
        $result = array();

        $xzdict = array('摩羯', '水瓶', '双鱼', '白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手');
        $zone   = array(1222, 122, 222, 321, 421, 522, 622, 722, 822, 922, 1022, 1122, 1222);
        if ((100 * $m + $d) >= $zone[0] || (100 * $m + $d) < $zone[1]) {
            $i = 0;
        } else {
            for ($i = 1; $i < 12; $i++) {
                if ((100 * $m + $d) >= $zone[$i] && (100 * $m + $d) < $zone[$i + 1]) {
                    break;
                }
            }
        }
        $result['xz'] = $i == 0 ? 12 : $i;
        $gzdict       = array(array('甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'), array('子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'));
        $i            = $y - 1900 + 36;
        $sxdict       = array('鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪');
        $result['sx'] = (($y - 4) % 12) + 1;
        return $result;
    }

    public function getLocal($id)
    {
        $area = [
            '3' => '渝中区',
            '4' => '大渡口区',
            '5' => '江北区',
            '6' => '南岸区',
            '7' => '北碚区',
            '8' => '渝北区',
            '9' => '巴南区',
            '10' => '长寿区',
            '11' => '双桥区',
            '12' => '沙坪坝区',
            '13' => '万盛区',
            '14' => '万州区',
            '15' => '涪陵区',
            '16' => '黔江区',
            '17' => '永川区',
            '18' => '合川区',
            '19' => '江津区',
            '20' => '九龙坡区',
            '21' => '南川区',
            '22' => '綦江县',
            '23' => '潼南县',
            '24' => '荣昌县',
            '25' => '璧山县',
            '26' => '大足县',
            '27' => '铜梁县',
            '28' => '梁平县',
            '29' => '开县',
            '30' => '忠县',
            '31' => '城口县',
            '32' => '垫江县',
            '33' => '武隆县',
            '34' => '丰都县',
            '35' => '奉节县',
            '36' => '云阳县',
            '37' => '巫溪县',
            '38' => '巫山县',
            '39' => '石柱土家族自治县',
            '40' => '秀山土家族苗族自治县',
            '41' => '酉阳土家族苗族自治县',
            '42' => '彭水苗族土家族自治县'
        ];
        return $area[$id];
    }

    public function getRand($num)
    {
        $rand = rand(1, 100);
        if ($rand < $num) {
            return 1;
        } else {
            return 2;
        }

    }

    public function getPhone($i)
    {
        $arr = [130, 131, 132, 155, 156, 186, 185, 134, 135, 136, 137, 138, 139, 150, 151, 152, 157, 158, 159, 182, 183, 188, 187, 133, 153, 180, 181, 189];
        if ($i<10){
            return $arr[rand(0, count($arr)-1)] . '88888000'  . $i;
        }else if($i>=10 && $i<100){
            return $arr[rand(0, count($arr)-1)] . '8888800'  . $i;
        }else if ( $i>=100 & $i<1000){
            return $arr[rand(0, count($arr)-1)] . '888880'  . $i;
        }else {
            return $arr[rand(0, count($arr)-1)] . '88888'  . $i;
        }
    }

    public function getRandRet($arr){

        $rand = rand(1,100);

        $index = '';
        foreach ($arr['gl'] as $k => $v){
            if ($rand <= $v){
                $index = $k ;
                break;
            }

        }
        return $arr['val'][$index][rand(0,count($arr['val'][$index])-1)];

    }

    public function getSg(){
        return $this->getRandRet([
            'gl'=>[
                20,80,100
            ],
            'val'=>[
                [155,156,157,158],
                [159,160,161,162,163,164,165],
                [166,167,168,169,170,171]
            ]
        ]);
    }

    public function getLevel(){
        return $this->getRandRet([
            'gl'=>[
                10,40,100
            ],
            'val'=>[
                [3],
                [2],
                [1]
            ]
        ]);
    }

    public function processData($i)
    {
        $rnd                         = new RndChinaName(); // 姓名
        $realName                    = $rnd->getName();
        $age                         = rand(18, 23); // 年龄
        $age_time                    = strtotime("-$age year"); // 年龄时间戳
        $age_time                    = rand(strtotime(date('Y' , $age_time)."-01-01") , strtotime(date('Y' , $age_time)."-12-31") );
        $constellation               = $this->birthExt($age_time); // 星座
        $area                        = rand(3, 42); // 区
        $local                       = $this->getLocal($area); // 区域 例：渝中区
        $dataUser['username']        = $this->getPhone($i); // 用户名，取电话
        $dataUser['phone']           = $dataUser['username']; // 电话
        $dataUser['password']        = md5(md5('jrbhynb')); // 密码固定
        $dataUser['sex']             = 0; // 性别
        $dataUser['login_type']      = 1; // 登陆类型，电话
        $dataUser['reg_time']        = rand(1420041600, 1464671367); // 注册时间
        $dataUser['last_login_time'] = rand(1451577600, 1464671367); // 最后登陆时间

        $dataInfo['info']            = json_encode([
            "qq" => "49978785",
            "age" => $age_time,
            "mate" => "", // 对未来伴侣的期望
            "work" => "", // 工作单位
            "blood" => rand(1, 5),
            "level" => $this->getLevel(), // 会员等级
            "local" => $local,
            "height" => $this->getSg(),
            "is_car" => $this->getRand(20), // 概率购车
            "nation" => $this->getRand(90) == 1 ? 1 : rand(2, 11),
            "school" => "",
            "wechat" => "",
            "zo_age" => "20-35",
            "zo_car" => "",
            "zodiac" => $constellation['sx'],
            "head_pic" => "/images/jrbhy_header.jpg",
            "is_child" => "1",
            "zo_house" => $this->getRand(50) == 2 ? 0 : 1,
            "education" => "",
            "real_name" => $realName,
            "zo_height" => "",
            "zo_zodiac" => "",
            "occupation" => "",
            "identity_id" => "未知",
            "is_marriage" => "1",
            "is_purchase" => $this->getRand(90), //是否购房
            "year_income" => "未知",
            "zo_marriage" => "1",
            "zo_education" => "",
            "constellation" => $constellation['xz'], // 星座
            "haunt_address" => "",
            "identity_address" => "未知",
            "zo_constellation" => "",
            "children_occupation" => ""
        ]);
        $dataInfo['auth']            = json_encode([
            "house_pic1" => "未知",
            "house_pic2" => "未知",
            "house_time" => "未知",
            "house_check" => false,
            "identity_pic1" => "未知",
            "identity_pic2" => "未知",
            "identity_time" => "未知",
            "marriage_pic1" => "未知",
            "marriage_pic2" => "未知",
            "marriage_time" => "未知",
            "education_pic1" => "未知",
            "education_pic2" => "未知",
            "education_time" => "未知",
            "identity_check" => true,
            "marriage_check" => false,
            "education_check" => false
        ]);
        $dataInfo['province']        = 1;
        $dataInfo['city']            = 2;
        $dataInfo['area']            = $area;
        $dataInfo['address']         = '';

        \Yii::$app->db->createCommand()
            ->insert("bhy_user" , $dataUser)
            ->execute();

        $dataInfo['user_id']         = \Yii::$app->db->lastInsertID;
        \Yii::$app->db->createCommand()
            ->insert("bhy_user_information" , $dataInfo)
        ->execute();
        echo $i."\n";
    }

    public function actionRun(){
        for ($i = 0 ;$i<2000; $i++){
            $this->processData($i);
        }
    }
}