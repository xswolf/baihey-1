<!--过滤表单-->
<div class="box border green">
    <div class="box-body small">
        <div class="row">
            <div class="col-xs-2">
                <input type="text" class="form-control j-dt-filter" data-col="name:name" placeholder="Rendering engine">
            </div>
            <div class="col-xs-3">
                <input type="text" class="form-control j-dt-filter" data-col="level:name" placeholder="Browser">
            </div>
        </div>
    </div>
</div>
<!--表格-->
<div class="row">
    <div class="col-md-12">
        <!-- BOX -->
        <div class="box border green">
            <div class="box-title">
                <h4><i class="fa fa-table"></i>表格demo</h4>
                <div class="tools hidden-xs">
                    <a href="#box-config" data-toggle="modal" class="config">
                        <i class="fa fa-cog"></i>
                    </a>
                    <a href="javascript:;" class="reload">
                        <i class="fa fa-refresh"></i>
                    </a>
                    <a href="javascript:;" class="collapse">
                        <i class="fa fa-chevron-up"></i>
                    </a>
                    <a href="javascript:;" class="remove">
                        <i class="fa fa-times"></i>
                    </a>
                </div>
            </div>
            <div class="box-body">
                <table cellpadding="0" cellspacing="0" border="0" class="j-datatables table table-striped table-bordered table-hover">
                    <thead>
                    <tr>
                        <th data-name="name">Rendering engine</th>
                        <th class="hidden-xs">操作</th>
                    </tr>
                    </thead>
                    <tbody>

                    <?php
                     foreach($list as $v){
                         ?>
                        <tr class="gradeX">
                             <td><?php echo $v->name; ?></td>
                             <td><a>编辑</a></td>
                        </tr>
                     <?php
                     }
                    ?>


                </table>
            </div>
        </div>
    </div>
</div>


