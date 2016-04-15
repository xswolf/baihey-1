<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/10
 * Time: 15:45
 */

namespace wechat\controllers;

use yii\db\Query;
class ChatController extends BaseController {

    public function actionIndex() {

        return $this->render();
    }

    public function actionChat() {
        $config = str_replace( "\"" , "'" , json_encode( \Yii::$app->wechat->jsApiConfig( [ ] , false ) ) );
        $config = addslashes( $config );
        $this->assign( 'config' , $config );

        return $this->render( [
            'name'     => \Yii::$app->request->get( 'name' ) ,
            'sendName' => \Yii::$app->request->get( 'sendName' )
        ] , '' );
    }

    public function actionConfig() {
//        $config = str_replace( "\"" , "'" , json_encode( \Yii::$app->wechat->jsApiConfig( [ ] , true ) ) );
        $config = json_encode( \Yii::$app->wechat->jsApiConfig( [ ] , true ) );
        $this->assign( 'config' , $config );

        $this->renderAjax();
    }


    public function actionRecord() {

        $this->assign( 'config' , json_encode( \Yii::$app->wechat->jsApiConfig( [ ] , false ) ) );

        return $this->render();
    }

    public function actionList() {

        return $this->render();
    }

    public function actionAngular() {
        $this->assign( 'str' , 'nsk' );

        return $this->render();
    }

    public function actionMeizi() {
        $this->layout = false;

        return $this->render();
    }

    public function actionFocus() {
        $result = (new Query())->select(['*'])
                               ->from("bhy_area")
            ->where(['parentId'=>0])
                               ->all();

        $result1 = (new Query())->select(['*'])
                               ->from("bhy_area")
                               ->where("LENGTH(relation) - LENGTH(REPLACE(relation,',',''))  = 1 ")
                               ->all();

        $result2 = (new Query())->select(['*'])
                               ->from("bhy_area")
                               ->where("LENGTH(relation) - LENGTH(REPLACE(relation,',',''))  = 2 ")
                               ->all();

        file_put_contents('city.js' , "var provines = ".json_encode($result).";", FILE_APPEND);
        file_put_contents('city.js' , "var city = ".json_encode($result1).";" , FILE_APPEND);
        file_put_contents('area.js' , "var area = ".json_encode($result2).";", FILE_APPEND);

    }


}