/**
 * Created by NSK. on 2016/4/28/0028.
 */
var config_infoData = {
    'height': config_heightLink(140),

    'marriage': [
        {id: 1, name: '未婚'},
        {id: 2, name: '离异'},
        {id: 3, name: '丧偶'}
    ],

    'education': [
        {id: 1, name: '初中'},
        {id: 2, name: '高中'},
        {id: 3, name: '大专'},
        {id: 4, name: '本科'},
        {id: 5, name: '硕士'},
        {id: 6, name: '博士'}
    ],

    'zodiac': [
        {id: 1, name: '鼠'},
        {id: 2, name: '牛'},
        {id: 3, name: '虎'},
        {id: 4, name: '兔'},
        {id: 5, name: '龙'},
        {id: 6, name: '蛇'},
        {id: 7, name: '马'},
        {id: 8, name: '羊'},
        {id: 9, name: '猴'},
        {id: 10, name: '鸡'},
        {id: 11, name: '狗'},
        {id: 12, name: '猪'}
    ],

    'constellation': [
        {id: 1, name: '水瓶座'},
        {id: 2, name: '双鱼座'},
        {id: 3, name: '白羊座'},
        {id: 4, name: '金牛座'},
        {id: 5, name: '双子座'},
        {id: 6, name: '巨蟹座'},
        {id: 7, name: '狮子座'},
        {id: 8, name: '处女座'},
        {id: 9, name: '天秤座'},
        {id: 10, name: '天蝎座'},
        {id: 11, name: '射手座'},
        {id: 12, name: '摩羯座'}
    ],

    'occupation': [
        {
            id: 1,
            name: '销售',
            icon: '01',
            children: [
                {id: 1, name: '销售总监'},
                {id: 2, name: '销售经理'},
                {id: 3, name: '销售主管'},
                {id: 4, name: '销售专员'},
                {id: 5, name: '渠道/分销管理'},
                {id: 6, name: '渠道/分销专员'},
                {id: 7, name: '经销商'},
                {id: 8, name: '客户经理'},
                {id: 9, name: '客户代表'},
                {id: 10, name: '其他'},
            ]
        },
        {
            id: 2,
            name: '计算机/互联网',
            icon: '03',
            children: [
                {id: 1, name: 'IT技术总监'},
                {id: 2, name: 'IT技术经理'},
                {id: 3, name: 'IT工程师'},
                {id: 4, name: '系统管理员'},
                {id: 5, name: '测试专员'},
                {id: 6, name: '运营管理'},
                {id: 7, name: '网页设计'},
                {id: 8, name: '网站编辑'},
                {id: 9, name: '网站产品经理'},
                {id: 10, name: '其他'},
            ]
        },
        {
            id: 3,
            name: '客户服务',
            icon: '02',
            children: [
                {id: 1, name: '客服经理'},
                {id: 2, name: '客服主管'},
                {id: 3, name: '客服专员'},
                {id: 4, name: '客服协调'},
                {id: 5, name: '客服技术支持'},
                {id: 6, name: '其他'},
            ]
        },
        {
            id: 4,
            name: '学生',
            icon: '22',
            children: [
                {id: 1, name: '大一'},
                {id: 2, name: '大二'},
                {id: 3, name: '大三'},
                {id: 4, name: '大四'},
                {id: 5, name: '读研'},
                {id: 6, name: '读博'},
                {id: 7, name: '其他'},
            ]
        },
        {
            id: 5,
            name: '通信/电子',
            icon: '04',
            children: [
                {id: 1, name: '通信技术'},
                {id: 2, name: '电子技术'},
                {id: 3, name: '其他'},
            ]
        },
        {
            id: 6,
            name: '生产/制造',
            icon: '05',
            children: [
                {id: 1, name: '工厂经理'},
                {id: 2, name: '工程师'},
                {id: 3, name: '项目主管'},
                {id: 4, name: '运营经理'},
                {id: 5, name: '运营主管'},
                {id: 6, name: '车间主任'},
                {id: 7, name: '物料管理'},
                {id: 8, name: '生产领班'},
                {id: 9, name: '操作工人'},
                {id: 10, name: '安全管理'},
                {id: 11, name: '其他'},
            ]
        },
        {
            id: 7,
            name: '物流/仓储',
            icon: '06',
            children: [
                {id: 1, name: '物流经理'},
                {id: 2, name: '物流主管'},
                {id: 3, name: '物流专员'},
                {id: 4, name: '仓库经理'},
                {id: 5, name: '仓库管理员'},
                {id: 6, name: '货运代理'},
                {id: 7, name: '集装箱业务'},
                {id: 8, name: '海关事物管理'},
                {id: 9, name: '报单员'},
                {id: 10, name: '快递员'},
                {id: 11, name: '其他'},
            ]
        },
        {
            id: 8,
            name: '商贸/采购',
            icon: '07',
            children: [
                {id: 1, name: '商务经理'},
                {id: 2, name: '商务专员'},
                {id: 3, name: '采购经理'},
                {id: 4, name: '采购专员'},
                {id: 5, name: '外贸经理'},
                {id: 6, name: '外贸专员'},
                {id: 7, name: '业务跟单'},
                {id: 8, name: '报关员'},
                {id: 9, name: '其他'},
            ]
        },
        {
            id: 9,
            name: '人事/行政',
            icon: '08',
            children: [
                {id: 1, name: '人事总监'},
                {id: 2, name: '人事经理'},
                {id: 3, name: '人事主管'},
                {id: 4, name: '人事专员'},
                {id: 5, name: '招聘经理'},
                {id: 6, name: '招聘专员'},
                {id: 7, name: '培训经理'},
                {id: 8, name: '培训专员'},
                {id: 9, name: '秘书'},
                {id: 10, name: '文员'},
                {id: 11, name: '后勤'},
                {id: 12, name: '其他'},
            ]
        },
        {
            id: 10,
            name: '高级管理',
            icon: '09',
            children: [
                {id: 1, name: '总经理'},
                {id: 2, name: '副总经理'},
                {id: 3, name: '合伙人'},
                {id: 4, name: '总监'},
                {id: 5, name: '经理'},
                {id: 6, name: '总裁助理'},
                {id: 7, name: '其他'},
            ]
        },
        {
            id: 11,
            name: '广告/市场',
            icon: '10',
            children: [
                {id: 1, name: '广告客户经理'},
                {id: 2, name: '广告客户专员'},
                {id: 3, name: '广告设计经理'},
                {id: 4, name: '广告设计专员'},
                {id: 5, name: '广告策划'},
                {id: 6, name: '市场营销经理'},
                {id: 7, name: '市场营销专员'},
                {id: 8, name: '市场策划'},
                {id: 9, name: '市场调研与分析'},
                {id: 11, name: '市场拓展'},
                {id: 12, name: '公关经理'},
                {id: 13, name: '公关专员'},
                {id: 14, name: '媒介经理'},
                {id: 15, name: '媒介专员'},
                {id: 16, name: '品牌经理'},
                {id: 17, name: '品牌专员'},
                {id: 18, name: '其他'},
            ]
        },
        {
            id: 12,
            name: '传媒/艺术',
            icon: '11',
            children: [
                {id: 1, name: '主编'},
                {id: 2, name: '编辑'},
                {id: 3, name: '作家'},
                {id: 4, name: '撰稿人'},
                {id: 5, name: '文案策划'},
                {id: 6, name: '出版发行'},
                {id: 7, name: '导演'},
                {id: 8, name: '记者'},
                {id: 9, name: '主持人'},
                {id: 11, name: '演员'},
                {id: 12, name: '模特'},
                {id: 13, name: '经纪人'},
                {id: 14, name: '摄影师'},
                {id: 15, name: '影视后期制作'},
                {id: 16, name: '设计师'},
                {id: 17, name: '画家'},
                {id: 18, name: '音乐家'},
                {id: 19, name: '舞蹈'},
                {id: 20, name: '其他'},
            ]
        },
        {
            id: 13,
            name: '交通运输',
            icon: '12',
            children: [
                {id: 1, name: '飞行员'},
                {id: 2, name: '空乘人员'},
                {id: 3, name: '地勤人员'},
                {id: 4, name: '列车司机'},
                {id: 5, name: '乘务员'},
                {id: 6, name: '船长'},
                {id: 7, name: '船员'},
                {id: 8, name: '司机'},
                {id: 9, name: '其他'},
            ]
        },
        {
            id: 14,
            name: '政府机构',
            icon: '13',
            children: [
                {id: 1, name: '部门领导'},
                {id: 2, name: '行政人员'},
                {id: 3, name: '法院'},
                {id: 4, name: '公安机关'},
                {id: 5, name: '军人'},
                {id: 6, name: '公务员'},
                {id: 7, name: '其他'},
            ]
        },
        {
            id: 15,
            name: '教育/科研',
            icon: '13',
            children: [
                {id: 1, name: '教授'},
                {id: 2, name: '讲师/助教'},
                {id: 3, name: '中学教师'},
                {id: 4, name: '小学教师'},
                {id: 5, name: '幼师'},
                {id: 6, name: '教务管理人员'},
                {id: 7, name: '职业技术教师'},
                {id: 8, name: '培训师'},
                {id: 9, name: '科研管理人员'},
                {id: 10, name: '科研人员'},
                {id: 11, name: '其他'},
            ]
        },
        {
            id: 16,
            name: '服务业',
            icon: '14',
            children: [
                {id: 1, name: '餐饮管理'},
                {id: 2, name: '厨师'},
                {id: 3, name: '餐厅服务员'},
                {id: 4, name: '酒店管理'},
                {id: 5, name: '大堂经理'},
                {id: 6, name: '酒店服务员'},
                {id: 7, name: '导游'},
                {id: 8, name: '美容师'},
                {id: 9, name: '健身教练'},
                {id: 11, name: '商场管理'},
                {id: 12, name: '零售店店长'},
                {id: 13, name: '店员'},
                {id: 14, name: '保安经理'},
                {id: 15, name: '保安人员'},
                {id: 16, name: '家政服务'},
                {id: 17, name: '其他'},
            ]
        },
        {
            id: 17,
            name: '建筑/房地产',
            icon: '15',
            children: [
                {id: 1, name: '建筑师'},
                {id: 2, name: '工程师'},
                {id: 3, name: '规划师'},
                {id: 4, name: '景观设计'},
                {id: 5, name: '房地产策划'},
                {id: 6, name: '房地产交易'},
                {id: 7, name: '物业管理'},
                {id: 8, name: '其他'},
            ]
        },
        {
            id: 18,
            name: '法律',
            icon: '16',
            children: [
                {id: 1, name: '律师'},
                {id: 2, name: '律师助理'},
                {id: 3, name: '法务经理'},
                {id: 4, name: '法务专员'},
                {id: 5, name: '知识产权专员'},
                {id: 6, name: '其他'},
            ]
        },
        {
            id: 19,
            name: '财会/审计',
            icon: '17',
            children: [
                {id: 1, name: '财务总监'},
                {id: 2, name: '财务经理'},
                {id: 3, name: '财务主管'},
                {id: 4, name: '会计'},
                {id: 5, name: '注册会计师'},
                {id: 6, name: '审计师'},
                {id: 7, name: '税务经理'},
                {id: 8, name: '税务专员'},
                {id: 9, name: '成本经理'},
                {id: 10, name: '其他'},
            ]
        },
        {
            id: 20,
            name: '生物/制药',
            icon: '18',
            children: [
                {id: 1, name: '生物工程'},
                {id: 2, name: '药品生产'},
                {id: 3, name: '临床研究'},
                {id: 4, name: '医疗器械'},
                {id: 5, name: '医药代表'},
                {id: 6, name: '化工工程师'},
                {id: 7, name: '其他'},
            ]
        },
        {
            id: 21,
            name: '医疗/护理',
            icon: '19',
            children: [
                {id: 1, name: '医疗管理'},
                {id: 2, name: '医生'},
                {id: 3, name: '心理医生'},
                {id: 4, name: '药剂师'},
                {id: 5, name: '护士'},
                {id: 6, name: '兽医'},
                {id: 7, name: '其他'},
            ]
        },
        {
            id: 22,
            name: '金融/银行/保险',
            icon: '20',
            children: [
                {id: 1, name: '投资'},
                {id: 2, name: '保险'},
                {id: 3, name: '金融'},
                {id: 4, name: '银行'},
                {id: 5, name: '证券'},
                {id: 6, name: '其他'},
            ]
        },
        {
            id: 23,
            name: '咨询/顾问',
            icon: '21',
            children: [
                {id: 1, name: '专业顾问'},
                {id: 2, name: '咨询经理'},
                {id: 3, name: '咨询师'},
                {id: 4, name: '培训师'},
                {id: 5, name: '其他'},
            ]
        },
    ],
    'nation': [
        {id: 1, name: '汉族'},
        {id: 2, name: '藏族'},
        {id: 3, name: '朝鲜族'},
        {id: 4, name: '蒙古族'},
        {id: 5, name: '回族'},
        {id: 6, name: '满族'},
        {id: 7, name: '维吾尔族'},
        {id: 8, name: '壮族'},
        {id: 9, name: '彝族'},
        {id: 10, name: '苗族'},
        {id: 11, name: '其他'}
    ],
    'salary': [
        {id: 1, name: '3-5万'},
        {id: 2, name: '6-9万'},
        {id: 3, name: '10-15万'},
        {id: 4, name: '16-25万'},
        {id: 5, name: '100万以上'}
    ],
    'house': [
        {id: 1, name: '已购房'},
        {id: 2, name: '未购房'}
    ],
    'car': [
        {id: 1, name: '已购车'},
        {id: 2, name: '未购车'}
    ],
    'blood': [
        {id: 1, name: 'A型'},
        {id: 2, name: 'B型'},
        {id: 3, name: 'AB型'},
        {id: 4, name: 'O型'},
        {id: 5, name: 'RH型'}
    ],
    'children': [
        {id: 1, name: '无小孩'},
        {id: 2, name: '有小孩归自己'},
        {id: 3, name: '有小孩归对方'}
    ],

    'feedback': [
        '诽谤辱骂',
        '淫秽色情',
        '血腥暴力',
        '垃圾广告',
        '欺骗（酒托、话费托等骗取行为）',
        '违法行为（涉毒、暴恐、违禁品等）',
        '冒用他人照片',
        '资料不真实'
    ],
    'label': {
        'man': [
            {name: '颜值高',hot:1},
            {name: '白富美',hot:0},
            {name: '逗逼',hot:1},
            {name: '御姐',hot:0},
            {name: '萝莉',hot:0},
            {name: '土豪',hot:0},
            {name: '女神',hot:0},
            {name: '吃货',hot:1},
            {name: '自来熟',hot:1},
            {name: '御宅族',hot:0},
            {name: '不限',hot:0}
        ],
        'woman':[
            {name:'高富帅',hot:0},
            {name:'长腿欧巴',hot:1},
            {name:'型男',hot:0},
            {name:'大叔',hot:0},
            {name:'土豪',hot:0},
            {name:'男神',hot:1},
            {name:'吃货',hot:0},
            {name:'小鲜肉',hot:1},
            {name:'逗逼',hot:1},
            {name:'自来熟',hot:1},
            {name:'御宅族',hot:0},
            {name:'暖男',hot:1},
            {name:'小公举',hot:0},
            {name:'不限',hot:0}
        ]
    },
    sports:[
        {}
    ]

};

function config_heightLink(min) {
    var data = [];
    for (var i = min; i <= 260; i++) {
        data.push({
            'id': i,
            'name': i + '厘米'
        })
    }
    return data;
}
