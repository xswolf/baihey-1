<?php
namespace common\models;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/22 0022
 * Time: 下午 2:07
 */
class UserRendezvous extends Base
{

    public static function tableName()
    {
        return "user_rendezvous";
    }

    /**
     * 发布约会
     * @param $data
     */
    public function release($data)
    {
        $this->theme           = $data['theme'];
        $this->title           = $data['title'];
        $this->content         = $data['content'];
        $this->sex             = $data['sex'];
        $this->destination     = $data['destination'];
        $this->create_time     = $data['create_time'];
        $this->rendezvous_time = $data['rendezvous_time'];
        $this->fee_des         = $data['fee_des'];
        $this->we_want         = $data['we_want'];
        $this->save();
    }
}
