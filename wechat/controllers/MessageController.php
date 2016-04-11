<?php
namespace wechat\controllers;


/**
 * Message controller
 */
class MessageController extends BaseController
{


    /**
     * Displays homepage.
     *
     * @return mixed
     */
    public function actionIndex()
    {

        return $this->render();
    }

    public function actionChat()
    {
        //$this->layout = false;

        return $this->render();
    }


}
