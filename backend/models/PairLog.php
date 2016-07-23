<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/7/22
 * Time: 16:16
 */

namespace backend\models;

use yii\base\Model;
use yii\db\Query;

class PairLog  extends Model
{
    public $db;
    public $pairLogTable;

    public function init()
    {
        parent::init();
        $this->db = \Yii::$app->db;
        $this->pairLogTable = \Yii::$app->db->tablePrefix.'pair_log';
    }

    /**
     * 获取数据
     * @param $where
     * @return array
     */
    public function getPairList($where)
    {
        if(isset($where['type'])) {
            $where['pl.type'] = $where['type'];
            unset($where['type']);
        }
        if(isset($where['status'])) {
            $where['pl.status'] = $where['status'];
            unset($where['status']);
        }
        $authUserTable = \Yii::$app->db->tablePrefix.'auth_user';
        $userInformationTable = \Yii::$app->db->tablePrefix.'user_information';
        $row = (new Query())
            ->select(['pl.*', 'au.name as admin_name', "json_extract(u.info , '$.real_name') as to_name", "json_extract(ui.info , '$.real_name') as form_name"])
            ->from($this->pairLogTable . ' pl')
            ->innerJoin($authUserTable . ' au', 'pl.admin_id=au.id')
            ->innerJoin($userInformationTable . ' u', 'pl.to_user_id=u.user_id')
            ->leftJoin($userInformationTable . ' ui', 'pl.from_user_id=ui.user_id')
            ->where($where)
            ->all();
        return $row;
    }

    public function addPair($data)
    {
        $this->db->createCommand()
            ->insert($this->pairLogTable,$data)
            ->execute();
        return $this->db->getLastInsertID();
    }
}