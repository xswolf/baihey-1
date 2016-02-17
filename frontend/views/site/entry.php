<?php
use yii\helpers\Html;
use yii\widgets\ActiveForm;
?>
<?php $form = ActiveForm::begin();?>
<label>姓名：</label><?= $form->field($model,'name') ?>
<label>邮箱：</label><?= $form->field($model,'email') ?>

<div class="form-group">
   <?= Html::submitButton('Submit',['class'=>'btn btn-primary']) ?>
</div>

<?php ActiveForm::end(); ?>
