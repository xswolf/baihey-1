<div class="box border green">
    <div class="box-title">
        <h4><i class="fa fa-bars"></i>Form states</h4>
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
    <div class="box-body big">
        <form class="form-horizontal" role="form">
            <div class="form-group">
                <label class="col-sm-3 control-label">Input focus</label>
                <div class="col-sm-9">
                    <input class="form-control" id="focusedInput" type="text" value="This is focused...">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">Field with tooltip on focus</label>
                <div class="col-sm-9">
                    <input type="text" name="regular" title="Tooltip on focus" class="form-control tip-focus">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">Field with tooltip on hover</label>
                <div class="col-sm-9">
                    <input type="text" name="regular" title="Tooltip on hover" class="form-control tip">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">images upload</label>
                <div class="col-sm-9">
<!--                    <input class="file_upload" type="file" multiple=true>-->
                    <input class="file_upload" type="file" name="UploadForm[file]" multiple data-preview-file-type="any" data-upload-url="/admin/file/upload">
                </div>
            </div>
            <div class="form-group has-success">
                <label class="col-sm-3 control-label">Input with success</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" id="inputSuccess">
                </div>
            </div>
            <div class="form-group has-warning">
                <label class="col-sm-3 control-label">Input with warning</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" id="inputWarning">
                </div>
            </div>
            <div class="form-group has-error">
                <label class="col-sm-3 control-label">Input with error</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" id="inputError">
                </div>
            </div>

            <div class="form-group has-error">
                <label class="col-sm-3 control-label"></label>
                <div class="col-sm-9">
                    <button type="submit" class="btn btn-success">Submit</button>
                </div>
            </div>

        </form>


    </div>
</div>