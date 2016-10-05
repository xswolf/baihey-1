<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/26 0026
 * Time: 上午 10:42
 */

// 根据时间戳获取年龄
function getAge($timeStamp)
{

    $timeStamp = (int)$timeStamp;
    if (empty($timeStamp) && $timeStamp < 1000) return;
    $birthday = date('Y-m-d', $timeStamp);
    list($year, $month, $day) = explode("-", $birthday);
    $year_diff = date("Y") - $year;
    return $year_diff;
}

// 时间戳转日期
function timeStampToDate($timeStamp)
{
    if(empty($timeStamp) || $timeStamp < 1){
        return ' ';
    }
    return date('Y-m-d H:i:s', $timeStamp);
}

function getSex($sex)
{
    return $sex == 1 ? '男' : '女';
}

function getMarriage($marriage)
{
    if ($marriage == 1) {
        return '未婚';
    } elseif ($marriage == 2) {
        return '离异';

    } elseif ($marriage == 3) {
        return '丧偶';
    } else {
        return '未婚';
    }
}

//function manyMarriage($ids){
//    $arr = [
//        1=> '未婚',
//        2=> '离异',
//        3=> '丧偶',
//    ];
//    $idArr = explode("," , $ids);
//    $str = "";
//    foreach ($idArr as $k=>$v){
//        $str .= $arr[$v]. " ";
//    }
//    return $str;
//}

function getEducation($e)
{
    switch ($e) {
        case 1 :
            return '初中';
        case 2 :
            return '高中';

        case 3 :
            return '大专';

        case 4 :
            return '本科';

        case 5 :
            return '硕士';

        case 6 :
            return '博士及以上';

    }

}

function getLevel($l)
{
    switch ($l) {
        case 1 :
            return '<span class="text-warning">VIP</span>';
        case 2 :
            return '<span class="text-pink">贵宾</span>';
        case 3 :
            return '<span class="text-purple">钻石</span>';
        default:
            return '普通';
    }
}

function getIsNot($s)
{
    $value = $s == 0 ? '否' : '是';
    return $value;
}

function getTitleByOrderListStatus($status)
{
    $title = $status == 0 ? '待付款' : '<span class="text-danger">成功</span>';
    return $title;
}

function getTitleByOrderListValue($value)
{
    $title = $value == 0 ? '' : '(' . $value . '个月)';
    return $title;
}

function getName($name)
{
    return str_replace("\"", "", $name);
}

function getPathByThumb($thumb)
{
    return str_replace('thumb', 'picture', $thumb);
}

// 获取省市区
function getSSQ($s, $shi, $q)
{
    $list1 = \common\models\Area::getInstance()->getTravelListById($s);
    $list2 = \common\models\Area::getInstance()->getTravelListById($shi);
    $list3 = \common\models\Area::getInstance()->getTravelListById($q);
    $str = '';
    if (is_array($list1) && count($list1) > 0) {
        $str = $list1[0]['name'];
        if (is_array($list2) && count($list2) > 0) {
            $str .= '-' . $list2[0]['name'];
            if (is_array($list3) && count($list3) > 0) {
                $str .= '-' . $list3[0]['name'];
            }
        }
    }
    return $str;
}

function yearIncome($id)
{
    $arr = [
        1 => '3-5万',
        2 => '6-9万',
        3 => '10-15万',
        4 => '16-25万',
        5 => '100万'
    ];
    return isset($arr[$id]) ? $arr[$id] : '';
}

function blood($id)
{
    $arr = [
        1 => 'A型',
        2 => 'B型',
        3 => 'AB型',
        4 => 'O型',
        5 => 'RH型'
    ];
    return isset($arr[$id]) ? $arr[$id] : '';
}

//
function manySelect($ids, $func = 'getMarriage')
{
    $idArr = explode(",", $ids);
    $str = "";
    foreach ($idArr as $k => $v) {
        $str .= $func($v) . " ";
    }
    return $str;
}

function constellation($id)
{
    $arr = [
        1 => '水瓶座',
        2 => '双鱼座',
        3 => '白羊座',
        4 => '金牛座',
        5 => '双子座',
        6 => '巨蟹座',
        7 => '狮子座',
        8 => '处女座',
        9 => '天秤座',
        10 => '天蝎座',
        11 => '射手座',
        12 => '摩羯座'
    ];
    return isset($arr[$id]) ? $arr[$id] : '';
}

function zodiac($id)
{
    $arr = [
        1 => '鼠',
        2 => '牛',
        3 => '虎',
        4 => '兔',
        5 => '龙',
        6 => '蛇',
        7 => '马',
        8 => '羊',
        9 => '猴',
        10 => '鸡',
        11 => '狗',
        12 => '猪'
    ];
    return isset($arr[$id]) ? $arr[$id] : '';
}

function getBuy($id)
{
    $arr = [
        '1' => '已购',
        '2' => '未购',
    ];
    return isset($arr[$id]) ? $arr[$id] : '';
}

function getNation($id)
{
    $arr = [
        1 => '汉族',
        2 => '藏族',
        3 => '朝鲜族',
        4 => '蒙古族',
        5 => '回族',
        6 => '满族',
        7 => '维吾尔族',
        8 => '壮族',
        9 => '彝族',
        10 => '苗族',
        11 => '其他',
    ];
    return isset($arr[$id]) ? $arr[$id] : '';
}

function getChild($id)
{
    $arr = [
        1 => '无小孩',
        2 => '有小孩归自己',
        3 => '有小孩归对方',
    ];
    return isset($arr[$id]) ? $arr[$id] : '';
}

function getOccupation($id, $oid = '')
{
    $occupation = '[
        {
            "id": 1,
            "name": "销售",
            "icon": "01",
            "children": [
                {"id": 1, "name": "销售总监"},
                {"id": 2, "name": "销售经理"},
                {"id": 3, "name": "销售主管"},
                {"id": 4, "name": "销售专员"},
                {"id": 5, "name": "渠道/分销管理"},
                {"id": 6, "name": "渠道/分销专员"},
                {"id": 7, "name": "经销商"},
                {"id": 8, "name": "客户经理"},
                {"id": 9, "name": "客户代表"},
                {"id": 10, "name": "其他"}
            ]
        },
        {
            "id": 2,
            "name": "计算机/互联网",
            "icon": "03",
            "children": [
                {"id": 1, "name": "IT技术总监"},
                {"id": 2, "name": "IT技术经理"},
                {"id": 3, "name": "IT工程师"},
                {"id": 4, "name": "系统管理员"},
                {"id": 5, "name": "测试专员"},
                {"id": 6, "name": "运营管理"},
                {"id": 7, "name": "网页设计"},
                {"id": 8, "name": "网站编辑"},
                {"id": 9, "name": "网站产品经理"},
                {"id": 10, "name": "其他"}
            ]
        },
        {
            "id": 3,
            "name": "客户服务",
            "icon": "02",
            "children": [
                {"id": 1, "name": "客服经理"},
                {"id": 2, "name": "客服主管"},
                {"id": 3, "name": "客服专员"},
                {"id": 4, "name": "客服协调"},
                {"id": 5, "name": "客服技术支持"},
                {"id": 6, "name": "其他"}
            ]
        },
        {
            "id": 4,
            "name": "学生",
            "icon": "22",
            "children": [
                {"id": 1, "name": "大一"},
                {"id": 2, "name": "大二"},
                {"id": 3, "name": "大三"},
                {"id": 4, "name": "大四"},
                {"id": 5, "name": "读研"},
                {"id": 6, "name": "读博"},
                {"id": 7, "name": "其他"}
            ]
        },
        {
            "id": 5,
            "name": "通信/电子",
            "icon": "04",
            "children": [
                {"id": 1, "name": "通信技术"},
                {"id": 2, "name": "电子技术"},
                {"id": 3, "name": "其他"}
            ]
        },
        {
            "id": 6,
            "name": "生产/制造",
            "icon": "05",
            "children": [
                {"id": 1, "name": "工厂经理"},
                {"id": 2, "name": "工程师"},
                {"id": 3, "name": "项目主管"},
                {"id": 4, "name": "运营经理"},
                {"id": 5, "name": "运营主管"},
                {"id": 6, "name": "车间主任"},
                {"id": 7, "name": "物料管理"},
                {"id": 8, "name": "生产领班"},
                {"id": 9, "name": "操作工人"},
                {"id": 10, "name": "安全管理"},
                {"id": 11, "name": "其他"}
            ]
        },
        {
            "id": 7,
            "name": "物流/仓储",
            "icon": "06",
            "children": [
                {"id": 1, "name": "物流经理"},
                {"id": 2, "name": "物流主管"},
                {"id": 3, "name": "物流专员"},
                {"id": 4, "name": "仓库经理"},
                {"id": 5, "name": "仓库管理员"},
                {"id": 6, "name": "货运代理"},
                {"id": 7, "name": "集装箱业务"},
                {"id": 8, "name": "海关事物管理"},
                {"id": 9, "name": "报单员"},
                {"id": 10, "name": "快递员"},
                {"id": 11, "name": "其他"}
            ]
        },
        {
            "id": 8,
            "name": "商贸/采购",
            "icon": "07",
            "children": [
                {"id": 1, "name": "商务经理"},
                {"id": 2, "name": "商务专员"},
                {"id": 3, "name": "采购经理"},
                {"id": 4, "name": "采购专员"},
                {"id": 5, "name": "外贸经理"},
                {"id": 6, "name": "外贸专员"},
                {"id": 7, "name": "业务跟单"},
                {"id": 8, "name": "报关员"},
                {"id": 9, "name": "其他"}
            ]
        },
        {
            "id": 9,
            "name": "人事/行政",
            "icon": "08",
            "children": [
                {"id": 1, "name": "人事总监"},
                {"id": 2, "name": "人事经理"},
                {"id": 3, "name": "人事主管"},
                {"id": 4, "name": "人事专员"},
                {"id": 5, "name": "招聘经理"},
                {"id": 6, "name": "招聘专员"},
                {"id": 7, "name": "培训经理"},
                {"id": 8, "name": "培训专员"},
                {"id": 9, "name": "秘书"},
                {"id": 10, "name": "文员"},
                {"id": 11, "name": "后勤"},
                {"id": 12, "name": "其他"}
            ]
        },
        {
            "id": 10,
            "name": "高级管理",
            "icon": "09",
            "children": [
                {"id": 1, "name": "总经理"},
                {"id": 2, "name": "副总经理"},
                {"id": 3, "name": "合伙人"},
                {"id": 4, "name": "总监"},
                {"id": 5, "name": "经理"},
                {"id": 6, "name": "总裁助理"},
                {"id": 7, "name": "其他"}
            ]
        },
        {
            "id": 11,
            "name": "广告/市场",
            "icon": "10",
            "children": [
                {"id": 1, "name": "广告客户经理"},
                {"id": 2, "name": "广告客户专员"},
                {"id": 3, "name": "广告设计经理"},
                {"id": 4, "name": "广告设计专员"},
                {"id": 5, "name": "广告策划"},
                {"id": 6, "name": "市场营销经理"},
                {"id": 7, "name": "市场营销专员"},
                {"id": 8, "name": "市场策划"},
                {"id": 9, "name": "市场调研与分析"},
                {"id": 11, "name": "市场拓展"},
                {"id": 12, "name": "公关经理"},
                {"id": 13, "name": "公关专员"},
                {"id": 14, "name": "媒介经理"},
                {"id": 15, "name": "媒介专员"},
                {"id": 16, "name": "品牌经理"},
                {"id": 17, "name": "品牌专员"},
                {"id": 18, "name": "其他"}
            ]
        },
        {
            "id": 12,
            "name": "传媒/艺术",
            "icon": "11",
            "children": [
                {"id": 1, "name": "主编"},
                {"id": 2, "name": "编辑"},
                {"id": 3, "name": "作家"},
                {"id": 4, "name": "撰稿人"},
                {"id": 5, "name": "文案策划"},
                {"id": 6, "name": "出版发行"},
                {"id": 7, "name": "导演"},
                {"id": 8, "name": "记者"},
                {"id": 9, "name": "主持人"},
                {"id": 11, "name": "演员"},
                {"id": 12, "name": "模特"},
                {"id": 13, "name": "经纪人"},
                {"id": 14, "name": "摄影师"},
                {"id": 15, "name": "影视后期制作"},
                {"id": 16, "name": "设计师"},
                {"id": 17, "name": "画家"},
                {"id": 18, "name": "音乐家"},
                {"id": 19, "name": "舞蹈"},
                {"id": 20, "name": "其他"}
            ]
        },
        {
            "id": 13,
            "name": "交通运输",
            "icon": "12",
            "children": [
                {"id": 1, "name": "飞行员"},
                {"id": 2, "name": "空乘人员"},
                {"id": 3, "name": "地勤人员"},
                {"id": 4, "name": "列车司机"},
                {"id": 5, "name": "乘务员"},
                {"id": 6, "name": "船长"},
                {"id": 7, "name": "船员"},
                {"id": 8, "name": "司机"},
                {"id": 9, "name": "其他"}
            ]
        },
        {
            "id": 14,
            "name": "政府机构",
            "icon": "13",
            "children": [
                {"id": 1, "name": "部门领导"},
                {"id": 2, "name": "行政人员"},
                {"id": 3, "name": "法院"},
                {"id": 4, "name": "公安机关"},
                {"id": 5, "name": "军人"},
                {"id": 6, "name": "公务员"},
                {"id": 7, "name": "其他"}
            ]
        },
        {
            "id": 15,
            "name": "教育/科研",
            "icon": "13",
            "children": [
                {"id": 1, "name": "教授"},
                {"id": 2, "name": "讲师/助教"},
                {"id": 3, "name": "中学教师"},
                {"id": 4, "name": "小学教师"},
                {"id": 5, "name": "幼师"},
                {"id": 6, "name": "教务管理人员"},
                {"id": 7, "name": "职业技术教师"},
                {"id": 8, "name": "培训师"},
                {"id": 9, "name": "科研管理人员"},
                {"id": 10, "name": "科研人员"},
                {"id": 11, "name": "其他"}
            ]
        },
        {
            "id": 16,
            "name": "服务业",
            "icon": "14",
            "children": [
                {"id": 1, "name": "餐饮管理"},
                {"id": 2, "name": "厨师"},
                {"id": 3, "name": "餐厅服务员"},
                {"id": 4, "name": "酒店管理"},
                {"id": 5, "name": "大堂经理"},
                {"id": 6, "name": "酒店服务员"},
                {"id": 7, "name": "导游"},
                {"id": 8, "name": "美容师"},
                {"id": 9, "name": "健身教练"},
                {"id": 11, "name": "商场管理"},
                {"id": 12, "name": "零售店店长"},
                {"id": 13, "name": "店员"},
                {"id": 14, "name": "保安经理"},
                {"id": 15, "name": "保安人员"},
                {"id": 16, "name": "家政服务"},
                {"id": 17, "name": "其他"}
            ]
        },
        {
            "id": 17,
            "name": "建筑/房地产",
            "icon": "15",
            "children": [
                {"id": 1, "name": "建筑师"},
                {"id": 2, "name": "工程师"},
                {"id": 3, "name": "规划师"},
                {"id": 4, "name": "景观设计"},
                {"id": 5, "name": "房地产策划"},
                {"id": 6, "name": "房地产交易"},
                {"id": 7, "name": "物业管理"},
                {"id": 8, "name": "其他"}
            ]
        },
        {
            "id": 18,
            "name": "法律",
            "icon": "16",
            "children": [
                {"id": 1, "name": "律师"},
                {"id": 2, "name": "律师助理"},
                {"id": 3, "name": "法务经理"},
                {"id": 4, "name": "法务专员"},
                {"id": 5, "name": "知识产权专员"},
                {"id": 6, "name": "其他"}
            ]
        },
        {
            "id": 19,
            "name": "财会/审计",
            "icon": "17",
            "children": [
                {"id": 1, "name": "财务总监"},
                {"id": 2, "name": "财务经理"},
                {"id": 3, "name": "财务主管"},
                {"id": 4, "name": "会计"},
                {"id": 5, "name": "注册会计师"},
                {"id": 6, "name": "审计师"},
                {"id": 7, "name": "税务经理"},
                {"id": 8, "name": "税务专员"},
                {"id": 9, "name": "成本经理"},
                {"id": 10, "name": "其他"}
            ]
        },
        {
            "id": 20,
            "name": "生物/制药",
            "icon": "18",
            "children": [
                {"id": 1, "name": "生物工程"},
                {"id": 2, "name": "药品生产"},
                {"id": 3, "name": "临床研究"},
                {"id": 4, "name": "医疗器械"},
                {"id": 5, "name": "医药代表"},
                {"id": 6, "name": "化工工程师"},
                {"id": 7, "name": "其他"}
            ]
        },
        {
            "id": 21,
            "name": "医疗/护理",
            "icon": "19",
            "children": [
                {"id": 1, "name": "医疗管理"},
                {"id": 2, "name": "医生"},
                {"id": 3, "name": "心理医生"},
                {"id": 4, "name": "药剂师"},
                {"id": 5, "name": "护士"},
                {"id": 6, "name": "兽医"},
                {"id": 7, "name": "其他"}
            ]
        },
        {
            "id": 22,
            "name": "金融/银行/保险",
            "icon": "20",
            "children": [
                {"id": 1, "name": "投资"},
                {"id": 2, "name": "保险"},
                {"id": 3, "name": "金融"},
                {"id": 4, "name": "银行"},
                {"id": 5, "name": "证券"},
                {"id": 6, "name": "其他"}
            ]
        },
        {
            "id": 23,
            "name": "咨询/顾问",
            "icon": "21",
            "children": [
                {"id": 1, "name": "专业顾问"},
                {"id": 2, "name": "咨询经理"},
                {"id": 3, "name": "咨询师"},
                {"id": 4, "name": "培训师"},
                {"id": 5, "name": "其他"}
            ]
        }
    ]';
    $o = json_decode($occupation);
    $zy = '';
    foreach ($o as $k => $v) {
        if ($v->id == $id) {
            $zy = $v->name;
            foreach ($v->children as $c) {
                if ($c->id == $oid) {
                    $zy .= $c->name;
                    break;
                }
            }

            return $zy;
        }
    }
    return $zy;
}

// 权限验证
function authValidate($url)
{
    $auth = \Yii::$app->authManager;
    //$reAction = explode('.com',$_SERVER['HTTP_REFERER']);
    $userInfo = \Yii::$app->session->get(USER_SESSION);
    if ($userInfo['name'] == 'admin') return true;
    $uid = $userInfo['id'];
    $permissions = $auth->getPermissionsByUser($uid);

    foreach ($permissions as $vo) {
        if ($url == $vo->description) {
            return true;
        }
    }
    return false;
}

// 根据会员等级获取是否有查看手机号码权限
// 当前登录用户是否属于红娘用户组（多个）
// 根据会员等级和红娘等级判断查看手机号码权限
// 规则如下：
// 普通 = 分配给自己的会员
// 贵宾 = 分配给自己的会员、所有VIP、贵宾会员
// 钻石 = 分配给自己的会员、所有VIP、贵宾、钻石会员
function showPhoneByUserLevel($matchmaker, $matchmaking, $level){
    $admin = Yii::$app->session->get(USER_SESSION);
    if(!strpos($admin['role'],'admin') && ($matchmaking == $admin['id'] || $matchmaker == $admin['id'])) {
        return 1;
    }
    if(strpos($admin['role'],'admin') > -1){
        return 1;
    }
    if(strpos($admin['role'],'VIP服务红娘') > -1 || strpos($admin['role'],'VIP销售红娘') > -1){
        if($level <= 1) {
            return 1;
        } else {
            return 0;
        }
    }
    if(strpos($admin['role'],'贵宾服务红娘') > -1 || strpos($admin['role'],'贵宾销售红娘') > -1){
        if($level <= 2) {
            return 1;
        } else {
            return 0;
        }
    }
    if(strpos($admin['role'],'钻石服务红娘') > -1 || strpos($admin['role'],'钻石销售红娘') > -1){
        if($level <= 3) {
            return 1;
        } else {
            return 0;
        }
    }
    return 0;

}

function thumbToPicture($thumb){
    if($thumb){
        if(str_replace('thumb','picture',$thumb)){
            return str_replace('thumb','picture',$thumb);
        }
    }
    return $thumb;
}