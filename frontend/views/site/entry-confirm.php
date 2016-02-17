<?php
use yii\helpers\Html;

?>
<div>
    <p>您提交的信息</p>

    <ul>
        <li><span>姓名：</span><span><?= Html::encode($model->name) ?></span></li>
        <li><span>邮箱：</span><span><?= Html::encode($model->email) ?></span></li>
    </ul>

</div>