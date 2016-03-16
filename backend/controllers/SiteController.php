<?php
namespace backend\controllers;

use Yii;

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
        return $this->render();
    }


    public function actionForm(){

        return $this->render();
    }
}
