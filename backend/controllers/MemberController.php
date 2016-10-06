<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/26 0026
 * Time: 上午 10:05
 */

namespace backend\controllers;


use backend\models\PairLog;
use backend\models\User as UserModel;
use common\models\Area;
use common\models\AuthUser;
use common\models\ChargeGoods;
use common\models\ChargeOrder;
use common\models\Message;
use common\models\User;
use common\models\UserDynamic;
use common\models\UserInformation;
use common\models\UserPhoto;
use wechat\models\Config;
use wechat\models\UserMessage;

class MemberController extends BaseController
{

    // 根据当前登录用户所属用户组显隐列表字段
    private function showColumnByUser()
    {
        $serviceFiled = ['intention', 'matchmaking',];
        $salesFiled = ['info.level', 'matchmaker',];
        if ($_SESSION['bhy_user']['role'] == 'admin') { //  管理员类型
            return [];
        } elseif (strpos($_SESSION['bhy_user']['role'], "销售红娘") > 0) {  // 销售红娘类型
            return $salesFiled;
        } elseif (strpos($_SESSION['bhy_user']['role'], "服务红娘") > 0) {  // 服务红娘类型
            return $serviceFiled;
        }

    }

    public function actionIndex()
    {
        if (isset($_SESSION['bhy_user'])){
            $serverUser = AuthUser::getInstance()->getUserByRole("服务红娘");
            $salesUser = AuthUser::getInstance()->getUserByRole("销售红娘", 'like');
            $column = $this->showColumnByUser();
            $this->assign('column', json_encode($column));
            $this->assign('admin', $_SESSION['bhy_user']);
            $this->assign('serverUser', $serverUser);
            $this->assign('salesUser', $salesUser);

            return $this->render();
        }

    }

    private function searchWhere(&$andWhere, $get)
    {
        foreach ($get as $k => $v) {
            if ($v == '' || !in_array($k, ['matchmaker', 'matchmaking', 'intention', 'constellation', 'zodiac', 'level', 'is_car', 'is_purchase', 'occupation', 'is_child', 'is_marriage', 'year_income', 'education', 'is_show', 'status', 'sex', 'age1', 'age2', 'height', 'province', 'city', 'area'])) continue;
            if ($k == 'age1') {
                $andWhere[] = ['>=', 'age', $v];
            } else if ($k == 'age2') {
                $andWhere[] = ['<=', 'age', $v];
            } else if (in_array($k, ['constellation', 'zodiac', 'level', 'is_car', 'is_purchase', 'occupation', 'is_child', 'is_marriage', 'year_income', 'height', 'education'])) {
                if ($k == 'level' && $v == "0") $v = '';
                $andWhere[] = ["=", "json_extract(info,'$.{$k}')", $v];
            } else {
                if ($k == 'status' && $v == 5) {
                    $andWhere[] = [">", 'user_id', 12493];
                    $v = 2;
                }
                $andWhere[] = ["=", $k, $v];
            }

            if ($k == 'intention' && strpos($this->user->getUser()['role'], "销售红娘") > 0) {
                $id = $this->user->getUser()['id'];
                $andWhere[] = ["=", "matchmaker", $id];
            }
        }
        return $andWhere;
    }

    public function actionSearch()
    {
        $request = \Yii::$app->request;
        $start = $request->get('iDisplayStart');
        $limit = $request->get('iDisplayLength');

        $andWhere = [];
        $id_phone_name = $request->get('id_phone_name');
        if ($request->get('id_phone_name') != '') { // 电话、ID、姓名
            if (is_numeric($id_phone_name)) {
                if (strlen($id_phone_name . '') == 11) {
                    $andWhere[] = ["=", "phone", $id_phone_name];
                } else {
                    $andWhere[] = ["=", "id", $id_phone_name];
                }
            } else {
                $andWhere[] = ["like", "json_extract(info,'$.real_name')", $id_phone_name];
            }

        } else {
            $this->searchWhere($andWhere, $request->get());
        }


        $list = User::getInstance()->lists($start, $limit, $andWhere);
        $count = User::getInstance()->count($andWhere);
        foreach ($list as $k => $v) {

            $list[$k]['info']                 = json_decode($v['info']);
            $list[$k]['info']->level          = getLevel($list[$k]['info']->level);
            $list[$k]['info']->is_marriage    = getMarriage($list[$k]['info']->is_marriage);
            $list[$k]['sex']                  = getSex($list[$k]['sex']);
        }

        $data = [
            'draw' => \Yii::$app->request->get('sEcho'),
            'recordsTotal' => $count,
            'recordsFiltered' => $count,
            'data' => $list
        ];
        $this->renderAjax($data, false);
    }

    /**
     * 判断手机号是否重复
     * @param $uid
     */
    public function actionIsExistPhone()
    {

        if (User::getInstance()->getUserByPhone(\Yii::$app->request->get('phone'))) {
            return $this->renderAjax(['status' => 1, 'message' => '手机号存在']);
        }
        return $this->renderAjax(['status' => 0, 'message' => '手机号不存在']);
    }

    public function actionSave()
    {
        if ($data = \Yii::$app->request->post()) {

//            var_dump($data);exit();
            if ($data['phone'] == '' || $data['info']['real_name'] == '') {
                return $this->__error('真实姓名、手机号码为必填项');
            }
            $data['zo'] = User::getInstance()->editInfoZo($data['zo']);
            $data['info'] = User::getInstance()->editInfoInfo($data['info']);
            $data['username'] = $data['phone'];
            $data['info'] = array_merge($data['info'], $data['zo']);
            $photo = $data;

            unset($data['zo']);
            unset($data['photosList']);
            unset($data['headPic']);
            unset($data['cardFace_List']);
            unset($data['cardBack_List']);
            unset($data['eduList']);
            unset($data['houseList']);
            unset($data['marrList']);
            $user = \common\models\User::getInstance()->addUser($data);
            //$user['id'] = 15087;
            // 添加图片
            User::getInstance()->insertUserPhoto($user['id'], $photo);
            if ($user['id'] > 0) {
                return $this->__success('添加成功');
                // 写入用户日志表
                $log['user_id'] = $user['id'];
                $log['type'] = 2;
                $log['create_time'] = time();
                User::getInstance()->userLog($log);
            } else {
                return $this->__error('添加失败');
            }
        }
        $this->assign('sport', Config::getInstance()->getListByType(1));
        $this->assign('movie', Config::getInstance()->getListByType(2));
        $this->assign('food', Config::getInstance()->getListByType(3));
        $this->assign('travel', Area::getInstance()->getWentTravelList());
        return $this->render();
    }

    // 修改会员资料
    public function actionEdit()
    {
        $request = \Yii::$app->request;
        $id = $request->get('id');
        if ($id < 1) {
            exit();
        }
        if ($postData = $request->post()) {
            $postData['info']['mate'] = trim($postData['info']['mate']);
            $postData['info']['mate'] = str_replace("\t", "", $postData['info']['mate']);
            $postData['user_id'] = $id;
            $postData['info']['age'] = strtotime($postData['info']['age']);

            $user = User::getInstance()->editUser($postData);
            if ($user['id'] > 0) {
                return $this->__success('修改成功');
            } else {
                return $this->__error('修改失败');
            }
        }
        $user = User::getInstance()->getUserById($id);
        $user['info'] = json_decode($user['info']);
        $user['auth'] = json_decode($user['auth']);

        $this->assign('id', $id);
        $this->assign('user', $user);
        $this->assign('sport', Config::getInstance()->getListByType(1));
        $this->assign('movie', Config::getInstance()->getListByType(2));
        $this->assign('food', Config::getInstance()->getListByType(3));
        $this->assign('travel', Area::getInstance()->getWentTravelList());

        $photoList = UserPhoto::getInstance()->getPhotoList($id, 0, 12);
        $photoList = json_encode($photoList);

        $this->assign('photoList', $photoList);


        return $this->render();
    }

    public function actionInfo()
    {
        $userId = \Yii::$app->request->get('id');
        $user = User::getInstance()->getUserById($userId);
        $user['info'] = json_decode($user['info']);
        $user['auth'] = json_decode($user['auth']);
        // 获取登陆次数
        $loginTime = User::getInstance()->getLoginTimes($userId);
        $moneyAll = User::getInstance()->getPayAll($userId);
        // 获取红娘名称
        $userModel = new UserModel();
        $matchmaker = $userModel->getFindUser(['id' => $user['matchmaker']]);
        $matchmaking = $userModel->getFindUser(['id' => $user['matchmaking']]);

        $this->assign('user', $user);
        $this->assign('loginTime', $loginTime);
        $this->assign('moneyAll', $moneyAll);
        $this->assign('matchmaker', $matchmaker['name']);
        $this->assign('matchmaking', $matchmaking['name']);
        $this->assign('photoList', UserPhoto::getInstance()->getPhotoList(\Yii::$app->request->get('id')));

        // 消息
        $messageList = UserMessage::getInstance()->chatList($userId);
        foreach ($messageList as $k => $v) {
            $messageList[$k]['info'] = json_decode($messageList[$k]['info']);
        }
        $this->assign('messageList', $messageList);
        // 动态
        $dynamicList = UserDynamic::getInstance()->getDynamicList($userId, 0, 1000, -2);
        $this->assign('dynamicList', $dynamicList);
        // 认证
        $identify = UserPhoto::getInstance()->getPhotoList($userId, [2, 3, 4, 5, 6]);
        $identifyType = [];
        foreach ($identify as $k => $v) {
            if ($v['is_check'] == '0') {
                unset($identify[$k]);
                continue;
            }
            $identifyType[$v['type']][] = $v;
        }
        $this->assign('identify', $identify);
        $this->assign('identifyType', $identifyType);
        // 红娘列表
        $adminUserList = AuthUser::getInstance()->getUserByRole(['普通服务红娘', 'VIP服务红娘', '贵宾服务红娘', '钻石服务红娘']);
        $this->assign('adminUserList', $adminUserList);
        // 配对记录
        $pairLogList = \common\models\PairLog::getInstance()->getPairLog($userId);
//        var_dump($pairLogList);exit();
        $this->assign('pairLogList', $pairLogList);
        return $this->render();
    }

    /**
     * 用户消息列表
     * @return string
     */
    public function actionMessage()
    {
        $this->layout = false;
        $sendUserId = \Yii::$app->request->get('send_user_id');
        $receiveUserId = \Yii::$app->request->get('receive_user_id');
        $list = Message::getInstance()->getMessageList($sendUserId, $receiveUserId);
        $this->assign('sendName', \Yii::$app->request->get('send_name'));
        $this->assign('receiveName', \Yii::$app->request->get('receive_name'));
        $this->assign('sendUserId', $sendUserId);
        $this->assign('list', $list);
        return $this->render();
    }

    /**
     * 开关资料，黑名单，重置密码
     */
    public function actionSwitch()
    {
        $field = \Yii::$app->request->post('field');
        if ($field == 'is_show') { // 资料开关
            $fieldValue = \Yii::$app->request->post($field) == 'true' ? 1 : 0;
        } else if ($field == 'password') {
            $fieldValue = md5(md5('123456'));
        } else {
            $fieldValue = \Yii::$app->request->post($field);
        }
        $data = [
            'id' => \Yii::$app->request->post('user_id'),
            $field => $fieldValue,
        ];
        if ($flag = User::getInstance()->editUser1($data)) {
            $this->renderAjax(['status' => 1, 'message' => '操作成功', 'data' => $flag]);
        } else {
            $this->renderAjax(['status' => 0, 'message' => '操作失败', 'data' => $flag]);
        }
    }

    public function actionOrder()
    {
        $andWhere = [];
        if ($this->get) {
            if ($this->get['id_phone_name'] != '') { // 电话、ID、姓名
                $id_phone_name = $this->get['id_phone_name'];
                if (is_numeric($id_phone_name)) {
                    if (strlen($id_phone_name . '') == 11) {
                        $andWhere[] = ["=", "u.phone", $id_phone_name];
                    } else {
                        $andWhere[] = ["=", "o.user_id", $id_phone_name];
                    }
                } else {
                    $andWhere[] = ["like", "json_extract(info,'$.real_name')", $id_phone_name];
                }
            }
            if ($this->get['startDate'] != '') {
                $andWhere[] = ['>=', 'o.create_time', strtotime($this->get['startDate'])];
            }
            if ($this->get['endDate'] != '') {
                $andWhere[] = ['<=', 'o.create_time', strtotime($this->get['endDate'])];
            }
            if ($this->get['status'] != '') {
                $andWhere[] = ['=', 'o.status', $this->get['status']];
            }
            //var_dump($this->get);exit;
        }
        $vo = ChargeOrder::getInstance()->getOrderAllInfo($andWhere);
        $this->assign('list', $vo);
        return $this->render();
    }

    public function actionCharge()
    {
        if (\Yii::$app->request->post()) {
            $orderId = ChargeOrder::getInstance()->createOrder(\Yii::$app->request->post('user_id'), \Yii::$app->request->post()); // 创建订单
            $result = ChargeOrder::getInstance()->setOrderStatus($orderId);
            $this->renderAjax(['status' => $result]);
            exit();
        }

        $goods = ChargeGoods::getInstance()->getAllList(['status' => 1]);
        $this->assign('goods', $goods);
        return $this->render();
    }

    public function actionGetUserById()
    {
        $this->renderAjax(User::getInstance()->getUserById(\Yii::$app->request->get('id')));
    }

    /**
     * 获取用户相册
     */
    public function actionGetPic()
    {
        $list = UserPhoto::getInstance()->getPhotoList(\Yii::$app->request->get('id'));
        $this->renderAjax(['status' => 1, 'data' => $list]);
    }

    public function actionUpPic()
    {
        $data['thumb_path'] = \Yii::$app->request->get('thumb_path');
        $data['pic_path'] = \Yii::$app->request->get('pic_path');
        $data['time'] = time();
        $result = UserPhoto::getInstance()->addPhoto(\Yii::$app->request->get('id'), $data);

        $this->renderAjax(['status' => $result]);
    }

    public function actionSetHead()
    {
        $userId = \Yii::$app->request->get('user_id');
        $data['id'] = \Yii::$app->request->get('id');
        $data['thumb_path'] = \Yii::$app->request->get('thumb_path');
        $list = UserPhoto::getInstance()->setHeadPic($userId, $data);
        $this->renderAjax(['status' => 1, 'data' => $list]);
    }

    /**
     * 照片列表
     * @return string
     */
    public function actionPhoto()
    {

        $isCheck = \Yii::$app->request->get('is_check');
        $type = \Yii::$app->request->get('type');
        if ($isCheck == '')
            $isCheck = 2;
        $list = UserPhoto::getInstance()->lists($isCheck, $type);
        if (\Yii::$app->request->isAjax) {
            return $this->renderAjax(['status' => 1, 'data' => $list]);
        }
        $this->assign('list', $list);
        return $this->render();
    }

    /**
     * 审核照片
     */
    public function actionAuthPhoto()
    {

        $data = \Yii::$app->request->get();
        $flag = UserPhoto::getInstance()->auth($data['id'], $data['status']);
        if ($flag > 0) {
            $this->renderAjax(['status' => 1, 'message' => '操作成功', 'data' => $flag]);
        } else {
            $this->renderAjax(['status' => 0, 'message' => '操作失败', 'data' => $flag]);
        }
    }

    /**
     * 审核用户
     */
    public function actionAuth()
    {
        $data = \Yii::$app->request->post();
        if ($flag = User::getInstance()->auth($data)) {
            $this->renderAjax(['status' => 1, 'message' => '操作成功', 'data' => $flag]);
        } else {
            $this->renderAjax(['status' => 0, 'message' => '操作失败', 'data' => $flag]);
        }

    }

    /**
     * 分配服务红娘
     */
    public function actionAssignMatchmaking(){
        $data = \Yii::$app->request->post();
        if(!isset($data['user'])){
            $data['user'] = '';
        }
        if(!isset($data['info'])){
            $data['info'] = [];
        }

        if($flag = User::getInstance()->editUser($data)){
            $this->renderAjax(['status' => 1, 'message' => '分配成功', 'data' => $flag]);
        }else{
            $this->renderAjax(['status' => 0, 'message' => '分配失败', 'data' => $flag]);
        }

    }

    /**
     * 发送系统消息
     */
    public function actionSysMsg()
    {
        $userId = \Yii::$app->request->post('user_id');
        $type = \Yii::$app->request->post('type');
        $content = \Yii::$app->request->post('content');
        if ($type == '2,3') $type = explode(',', $type);
        if (isset($type) && $type != '') { // 相册发消息
            User::getInstance()->editPhoto($type, ['user_id' => $userId], 0);
        }
        if ($flag = (new Message())->add(1, $userId, $content, 1, 2)) {
            $this->renderAjax(['status' => 1, 'message' => '操作成功', 'data' => $flag]);

        } else {
            $this->renderAjax(['status' => 0, 'message' => '操作失败', 'data' => $flag]);

        }
    }

    public function actionChat()
    {
        return $this->render();
    }

    public function actionDel()
    {
        $id = \Yii::$app->request->post('id');
        if (User::getInstance()->delUser($id)) {
            $this->renderAjax(['status' => 1, 'message' => '成功']);
        } else {
            $this->renderAjax(['status' => 0, 'message' => '失败']);
        }
    }

    // 获取用户信息
    public function actionGetUser()
    {
        if ($data = User::getInstance()->getUserById($this->post['user_id'])) {
            $this->renderAjax(['status' => 1, 'data' => $data, 'message' => '成功']);
        } else {
            $this->renderAjax(['status' => 0, 'data' => [], 'message' => '失败']);
        }
    }

    // 回访记录配对记录
    public function actionPairList()
    {
        $pairLog = new PairLog();
        if ($data = $pairLog->getPairList($this->post)) {
            $this->renderAjax(['status' => 1, 'data' => $data, 'message' => '成功']);
        } else {
            $this->renderAjax(['status' => 0, 'data' => [], 'message' => '失败']);
        }
    }

    // 新增回访或配对记录
    public function actionAddPair()
    {
        $pairLog = new PairLog();
        $data = $this->post;
        $data['create_time'] = time();
        $data['update_time'] = time();
        if (isset($data['intention']) && $data['intention'] != 2) {
            UserInformation::getInstance()->updateUserInfo($data['to_user_id'], ['intention' => $data['intention']]);
        }
        if (isset($data['intention'])){
            unset($data['intention']);
        }
        if ($data['id'] = $pairLog->addPair($data)) {
            $this->renderAjax(['status' => 1, 'data' => $data, 'message' => '成功']);
        } else {
            $this->renderAjax(['status' => 0, 'data' => [], 'message' => '失败']);
        }
    }

    // 删除动态
    public function actionDeleteDynamic()
    {
        $data = $this->post;
        if ($result = UserDynamic::getInstance()->deleteDynamic($data['id'])) {
            $this->renderAjax(['status' => 1, 'data' => $result, 'msg' => '删除成功']);
        } else {
            $this->renderAjax(['status' => 0, 'data' => [], 'msg' => '删除失败']);
        }
    }

}