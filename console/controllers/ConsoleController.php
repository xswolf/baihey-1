<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/7/7 0007
 * Time: 上午 11:29
 */

namespace console\controllers;


use common\models\User;
use yii\console\Controller;

class ConsoleController extends Controller
{

    /**
     * 更新年龄  1月一次
     * @throws \yii\db\Exception
     */
    public function actionUpdateAge()
    {

        $m = date('n');
        $y = date('Y');

        $sql = "UPDATE bhy_user_information

SET age = IF ({$m} - DATE_FORMAT(DATE_ADD(FROM_UNIXTIME(0), INTERVAL json_extract(info,'$.age')+0 SECOND) , '%m') < 0 ,

                {$y} - DATE_FORMAT(DATE_ADD(FROM_UNIXTIME(0), INTERVAL json_extract(info,'$.age')+0 SECOND) , '%Y') -1 ,

                {$y} - DATE_FORMAT(DATE_ADD(FROM_UNIXTIME(0), INTERVAL json_extract(info,'$.age')+0 SECOND) , '%Y'))

                 WHERE json_extract(info,'$.age')  >0 AND json_extract(info,'$.age') != '' ";

        if (\Yii::$app->db->createCommand($sql)->execute()) {
            echo 'age is update';
        }


    }

    private function getDb($host, $username, $password, $pre = 'baihey')
    {
        $connection = new \yii\db\Connection([
            'dsn' => "mysql:host={$host};dbname={$pre}",
            'username' => $username,
            'password' => $password,
            'charset' => 'utf8',
        ]);
        $connection->open();
        return $connection;
    }

    public function actionOldToNew()
    {
        error_reporting(11);
        $sql = "SELECT
                  mobile,
                  i.`password`,
                  1 AS login_type,
                  IF (u.`sex` = 2, 0, 1) AS sex,
                  i.`create_time`,
                  u.`mobile`,
                  1 AS is_show,
                  1 AS status,
                  p.addr as sheng,
                  c.`addr` as shi,
                  cy.`addr` as qu,
                  nowaddress,
                  grade,
                  birthday,
                  fullname,
                  height,
                  cards,
                  cardaddress,
                  marrage,
                  childstatus,
                  education,
                  annual,
                  ishouse,
                  iscar,
                  nation,
                  atlas,
                  cardpics,
                  IF(grade >= 3, 1, 0) AS service_status,
                  1 AS has_identify
                FROM
                  bhy_usermember u
                  INNER JOIN bhy_information i
                    ON u.id = i.`mid`
                  INNER JOIN bhy_province p
                    ON u.`nowprovince` = p.id
                  INNER JOIN bhy_city c
                    ON c.id = u.`nowcity`
                  INNER JOIN bhy_county cy
                    ON cy.id = u.`nowcounty`  where mobile is not null";

        $oldDb  = $this->getDb('114.80.78.241', 'newbhy', 'bhy63797900');
        $newDb  = $this->getDb('120.76.84.162', 'jrbaihe', 'jrbh*2016', 'bhy');
        $result = $oldDb->createCommand($sql)->queryAll();
        foreach ($result as $k => $v) {
            if ($v['mobile'] == '' || $v['mobile'] == null || strlen($v['mobile']) != 11 ) continue;
            $sheng = $newDb->createCommand("SELECT * FROM bhy_area WHERE NAME='{$v['sheng']}' and relation='0'")->queryOne();
            $shi   = $newDb->createCommand("SELECT * FROM bhy_area WHERE NAME='{$v['shi']}' and relation='0,{$sheng['id']}'")->queryOne();
            $qu    = $newDb->createCommand("SELECT * FROM bhy_area WHERE NAME='{$v['qu']}' and relation='0,{$sheng['id']},{$shi['id']}'")->queryOne();

//            var_dump($sheng);
//            var_dump($shi);
//            var_dump($qu);exit;
            $pic =  [];
            $identify = [];
            if ($v['atlas'] != '' || $v['atlas'] != null) {
                if (substr($v['atlas'], -1) == ","){
                    $v['atlas'] = substr($v['atlas'] , 0 , -1);
                }
                $v['atlas'] = str_replace(",,",",",$v['atlas']);
                echo "select path ,create_time from bhy_picture where id in ({$v['atlas']}) \n";
                $pic = $oldDb->createCommand("select path ,create_time from bhy_picture where id in ({$v['atlas']})")->queryAll();
            }
            if ($v['cardpics'] != '' || $v['cardpics'] != null) {
                if (substr($v['cardpics'], -1) == ","){
                    $v['cardpics'] = substr($v['cardpics'] , 0 , -1);
                }
                $v['cardpics'] = str_replace(",,",",",$v['cardpics']);
                echo "select path ,create_time from bhy_picture where id in ({$v['cardpics']}) \n";
                $identify = $oldDb->createCommand("select path ,create_time from bhy_picture where id in ({$v['cardpics']})")->queryAll();
            }

            $data = [
                'username' => $v['mobile'],
                'password' => $v['password'],
                'login_type' => $v['login_type'],
                'sex' => $v['sex'],
                'reg_time' => intval($v['create_time'])<0?0:$v['create_time'],
                'phone' => $v['mobile'],
                'is_show' => $v['is_show'],
                'status' => $v['status'],
            ];
            $newDb->createCommand()->insert('bhy_user', $data)->execute();
            $lastId = $newDb->lastInsertID;

            if ($v['grade'] == 2) {
                $level      = 1;
                $matureTime = strtotime("2017-08-02");
            } elseif ($v['grade'] == 3) {
                $level      = 2;
                $matureTime = strtotime("2018-08-02");
            } elseif ($v['grade'] == 4) {
                $level      = 2;
                $matureTime = strtotime("2018-08-02");
            } elseif ($v['grade'] == 5) {
                $level      = 3;
                $matureTime = strtotime("2018-08-02");
            } else {
                $level      = '';
                $matureTime = 0;
            }

            if ($v['marrage'] == 127) {
                $marrage = 1;
            } else if ($v['marrage'] == 128) {
                $marrage = 2;
            } else if ($v['marrage'] == 129) {
                $marrage = 3;
            } else if ($v['marrage'] == 466) {
                $marrage = 1;
            } else {
                $marrage = 1;
            }

            if ($v['childstatus'] == 132) {
                $child = 1;
            } elseif ($v['childstatus'] == 133) {
                $child = 2;
            } elseif ($v['childstatus'] == 134) {
                $child = 3;
            } elseif ($v['childstatus'] == 135) {
                $child = 3;
            }

            if ($v['education'] <= 117) {
                $ed = 2;
            } elseif ($v['education'] > 177 && $v['education'] < 120) {
                $ed = 3;
            } elseif ($v['education'] >= 120 && $v['education'] <= 121) {
                $ed = 4;
            } else {
                $ed = 5;
            }

            if ($v['annual'] <= 189) {
                $annual = 1;
            } elseif ($v['education'] >= 190 && $v['education'] <= 191) {
                $annual = 2;
            } elseif ($v['education'] = 401) {
                $annual = 3;
            } elseif ($v['education'] >= 402 && $v['education'] <= 403) {
                $annual = 4;
            } else {
                $annual = 5;
            }
            $sr = $this->birthExt($v['birthday']);

            $info                     = User::getInstance()->getDefaultInfo();
            $info['age']              = strtotime($v['birthday']);
            $info['level']            = $level;
            $info['height']           = $v['height'];
            $info['real_name']        = $v['fullname'];
            $info['identity_id']      = $v['cards'];
            $info['identity_address'] = $v['cardaddress'];
            $info['is_marriage']      = $marrage;
            $info['is_child']         = $child;
            $info['education']        = $ed;
            $info['year_income']      = $annual;
            $info['is_purchase']      = $v['ishouse'] == 197 ? 1 : 0;
            $info['is_car']           = $v['iscar'] == 193 ? 1 : 0;
            $info['zodiac']           = $sr['sx'];
            $info['constellation']    = $sr['xz'];
            $info['nation']           = $v['nation'] == 59 ? 1 : 11;

            $dataInfo = [
                'user_id' => $lastId,
                'info' => json_encode($info),
                'province' => $sheng['id'],
                'city' => $shi['id'],
                'area' => $qu['id'],
                'address' => $v['cardaddress'],
                'mature_time' => $matureTime,
                'service_status' => $v['service_status'],
                'has_identify' => '1'
            ];

            foreach ($pic as $kk=>$vv){
                $path = str_replace("Picture" , 'picture' , $vv['path']);
                $thumb = str_replace("picture" , 'thumb' , $path);
                $picData = [
                    'pic_path'=> $path,
                    'thumb_path'=> $thumb,
                    'create_time'=> $vv['create_time'],
                    'user_id'=> $lastId,
                    "is_check"=>1,
                    "is_head"=>$kk == 0 ? 1 : 0,
                    'update_time'=>0,
                    'type'=>1
                ];
                if ($kk == 0){
                    $info['head_pic']         = $thumb;
                }
                $newDb->createCommand()->insert('bhy_user_photo' , $picData)->execute();
            }

            foreach ($identify as $ik=>$iv){
                $path = str_replace("Picture" , 'picture' , $iv['path']);
                $thumb = str_replace("picture" , 'thumb' , $path);
                $identifyData = [
                    'pic_path'=> $path,
                    'thumb_path'=> $thumb,
                    'create_time'=> $iv['create_time'],
                    'user_id'=> $lastId,
                    "is_check"=>1,
                    "is_head"=>$ik == 0,
                    'update_time'=>0,
                    'type'=>2
                ];
                $newDb->createCommand()->insert('bhy_user_photo' , $identifyData)->execute();
            }
            $newDb->createCommand()->insert('bhy_user_information', $dataInfo)->execute();

        }

    }

    public function birthExt($birth)
    {
        if (strstr($birth, '-') === false && strlen($birth) !== 8) {
            $birth = @date("Y-m-d", $birth);
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
}