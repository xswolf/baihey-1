<?php
namespace backend\models;
use yii\base\Model;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/2/22
 * Time: 16:31
 */
class UploadForm extends Model
{
    public $file;

    public function rules()
    {
        return [
                [['file'], 'file']
            ];
    }



}