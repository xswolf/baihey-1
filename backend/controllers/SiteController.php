<?php
namespace backend\controllers;

use common\models\User;
use Yii;

use common\models\LoginForm;

/**
 * Site controller
 */
class SiteController extends BaseController
{
    public $enableCsrfValidation = false;

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }

    public function actionIndex()
    {
        return $this->render('index');
    }


    public function actionForm(){

        return $this->render('form');
    }
}
