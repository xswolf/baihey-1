<?php
   $view = Yii::$app->view;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <title>嘉瑞百合缘后台管理系统</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link href="/wechat/web/images/apple-touch-icon.png" rel="shortcut icon">
    <!-- STYLESHEETS --><!--[if lt IE 9]><script src="/backend/web/CloudAdmin/js/flot/excanvas.min.js"></script><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script><![endif]-->
    <link rel="stylesheet" type="text/css"  href="/backend/web/CloudAdmin/css/themes/default.css" id="skin-switcher" >
    <link rel="stylesheet" type="text/css" href="/backend/web/CloudAdmin/css/cloud-admin.css" >
    <link rel="stylesheet" type="text/css"  href="/backend/web/CloudAdmin/css/responsive.css" >
    <link rel="stylesheet" type="text/css" href="/backend/web/CloudAdmin/layer/skin/layer.css">
    <!----switch 插件---->
    <link rel="stylesheet" type="text/css" href="/backend/web/CloudAdmin/js/bootstrap-switch/bootstrap-switch.min.css" />
    <!-- css3动画 -->
    <link rel="stylesheet" type="text/css"  href="/backend/web/css/animate.css" >


    <link href="/backend/web/CloudAdmin/font-awesome/css/font-awesome.min.css" rel="stylesheet">

    <!-- DATE PICKER -->
    <link href="/backend/web/CloudAdmin/js/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <!-- FONTS -->
    <link href='http://fonts.useso.com/css?family=Open+Sans:300,400,600,700' rel='stylesheet' type='text/css'>

    <!-- DataTables -->
    <link rel="stylesheet" type="text/css"  href="/backend/web/css/site.css" >
    <link rel="stylesheet" type="text/css" href="/backend/web/css/jquery.dataTables.css" />
    <link rel="stylesheet" type="text/css" href="/backend/web/CloudAdmin/js/file_input/fileinput.min.css" />
    <link rel="stylesheet" type="text/css" href="/backend/web/CloudAdmin/js/select2/select2.min.css" />

    <!-- FORM -->
    <link href="/backend/web/CloudAdmin/js/uniform/css/uniform.default.min.css" rel="stylesheet">

    <!-- JQUERY -->
    <script src="/backend/web/CloudAdmin/js/jquery/jquery-2.0.3.min.js"></script>

</head>
<body>
<!-- HEADER -->
<header class="navbar clearfix navbar-fixed-top" id="header">
    <div class="container">
        <div class="navbar-brand">
            <!-- COMPANY LOGO -->
            <a href="/admin">
                <img src="/backend/web/CloudAdmin/img/logo/jrbhy.png" alt="嘉瑞百合缘" class="img-responsive" height="30" width="120">
            </a>
            <!-- /COMPANY LOGO -->
            <!-- TEAM STATUS FOR MOBILE -->
            <div class="visible-xs">
                <a href="#" class="team-status-toggle switcher btn dropdown-toggle">
                    <i class="fa fa-users"></i>
                </a>
            </div>
            <!-- /TEAM STATUS FOR MOBILE -->
            <!-- SIDEBAR COLLAPSE -->
            <div id="sidebar-collapse" class="sidebar-collapse btn">
                <i class="fa fa-bars"
                   data-icon1="fa fa-bars"
                   data-icon2="fa fa-bars" ></i>
            </div>
            <!-- /SIDEBAR COLLAPSE -->
        </div>
        <!-- NAVBAR LEFT -->
        <ul class="nav navbar-nav pull-left hidden-xs" id="navbar-left">

            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-lock"></i>
                    <span class="name">主题设置</span>
                    <i class="fa fa-angle-down"></i>
                </a>
                <ul class="dropdown-menu skins">
                    <li class="dropdown-title">
                        <span><i class="fa fa-leaf"></i>主题皮肤</span>
                    </li>
                    <li><a href="#" data-skin="default">微妙 (默认)</a></li>
                    <li><a href="#" data-skin="night">夜晚</a></li>
                    <li><a href="#" data-skin="earth">地球</a></li>
                    <li><a href="#" data-skin="utopia">乌托邦</a></li>
                    <li><a href="#" data-skin="nature">自然</a></li>
                    <li><a href="#" data-skin="graphite">石墨</a></li>
                </ul>
            </li>
        </ul>
        <!-- /NAVBAR LEFT -->
        <!-- BEGIN TOP NAVIGATION MENU -->
        <ul class="nav navbar-nav pull-right">
            <!-- BEGIN USER LOGIN DROPDOWN -->
            <li class="dropdown" id="header-notification">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-bell"></i>
                    <span class="badge">2</span>
                </a>
                <ul class="dropdown-menu notification">
                    <li class="dropdown-title">
                        <span><i class="fa fa-bell"></i> 2 个待办事项</span>
                    </li>
                    <li>
                        <a href="#">
                            <span class="label label-success"><i class="fa fa-user"></i></span>
									<span class="body">
										<span class="message">5 条会员资料审核请求 </span>
										<span class="time">
											<i class="fa fa-clock-o"></i>
											<span>刚刚</span>
										</span>
									</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span class="label label-primary"><i class="fa fa-picture-o"></i></span>
									<span class="body">
										<span class="message">有新的会员照片上传</span>
										<span class="time">
											<i class="fa fa-clock-o"></i>
											<span>19 分钟前</span>
										</span>
									</span>
                        </a>
                    </li>
                    <li class="footer">
                        <a href="#">现在去处理 <i class="fa fa-arrow-circle-right"></i></a>
                    </li>
                </ul>
            </li>
            <li class="dropdown" id="header-message">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-envelope"></i>
                    <span class="badge">3</span>
                </a>
                <ul class="dropdown-menu inbox">
                    <li class="dropdown-title">
                        <span><i class="fa fa-envelope-o"></i> 3 条站内信</span>
                    </li>
                    <li>
                        <a href="#">
                            <img src="/backend/web/CloudAdmin/img/avatars/avatar2.jpg" alt="" />
									<span class="body">
										<span class="from">江北 张三红娘</span>
										<span class="message">
										这个星期轮到我值班，请管理员调整...
										</span>
										<span class="time">
											<i class="fa fa-clock-o"></i>
											<span>刚刚</span>
										</span>
									</span>

                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <img src="/backend/web/CloudAdmin/img/avatars/avatar1.jpg" alt="" />
									<span class="body">
										<span class="from">渝中 李四红娘</span>
										<span class="message">
										刚刚上传了一个会员资料（王武），请尽快审核。
										</span>
										<span class="time">
											<i class="fa fa-clock-o"></i>
											<span>15 分钟前</span>
										</span>
									</span>

                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <img src="/backend/web/CloudAdmin/img/avatars/avatar8.jpg" alt="" />
									<span class="body">
										<span class="from">北碚 陈香红娘</span>
										<span class="message">
										刚刚上传了一个会员资料（李倩），麻烦尽快审核。
										</span>
										<span class="time">
											<i class="fa fa-clock-o"></i>
											<span>2 小时前</span>
										</span>
									</span>

                        </a>
                    </li>
                    <li class="footer">
                        <a href="#">现在去查看 <i class="fa fa-arrow-circle-right"></i></a>
                    </li>
                </ul>
            </li>
            <li class="dropdown user" id="header-user">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <img alt="" src="/backend/web/CloudAdmin/img/avatars/avatar9.jpg" />
                    <span class="username"><?php echo $view->params['user']['name'] ?></span>
                    <i class="fa fa-angle-down"></i>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a href="#">
                            <i class="fa fa-user"></i>
                           个人账户
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fa fa-lock"></i>
                            修改密码
                        </a>
                    </li>
                    <li>
                        <a href="/admin/login/logout">
                            <i class="fa fa-power-off"></i>
                            退出
                        </a>
                    </li>
                </ul>

            </li>
            <!-- END USER LOGIN DROPDOWN -->
        </ul>
        <!-- END TOP NAVIGATION MENU -->
    </div>

</header>
<!--/HEADER -->

<!-- PAGE -->
<section id="page">
    <!-- SIDEBAR -->
    <div id="sidebar" class="sidebar sidebar-fixed">
        <div class="sidebar-menu nav-collapse">

            <!-- 左侧菜单 -->
            <ul>
                <li class="has-sub">
                    <a href="/admin/site" data-menu="1">
                        <i class="fa fa-tachometer fa-fw"></i> <span class="menu-text">主页</span>
                        <span class="selected"></span>
                    </a>
                </li>

                <li class="has-sub">
                    <a href="javascript:;" class="" data-menu="2">
                        <i class="fa fa-file-text fa-fw"></i> <span class="menu-text">功能</span>
                        <span class="arrow"></span>
                    </a>
                    <ul class="sub">
                        <li class="has-sub-sub"><a data-menu="1" class="" href="javascript:;"><span class="sub-menu-text">功能 1</span></a></li>
                        <li class="has-sub-sub"><a data-menu="2" class=""  href="javascript:;"><span class="sub-menu-text">功能 2</span></a></li>
                    </ul>
                </li>
                <li class="has-sub" >
                    <a href="javascript:;" class="" data-menu="3">
                        <i class="fa fa-file-text fa-fw"></i> <span class="menu-text">权限管理</span>
                        <span class="arrow"></span>
                    </a>
                    <ul class="sub">
                        <li class="has-sub-sub"><a data-menu="3" class="" href="/admin/rbac/list-permission"><span class="sub-menu-text">权限列表</span></a></li>
                        <li class="has-sub-sub"><a data-menu="4" class="" href="/admin/rbac/list-role"><span class="sub-menu-text">角色列表</span></a></li>
                    </ul>
                </li>
                <li class="has-sub">
                    <a href="javascript:;" class="" data-menu="4">
                        <i class="fa fa-file-text fa-fw"></i> <span class="menu-text">用户管理</span>
                        <span class="arrow"></span>
                    </a>
                    <ul class="sub">
                        <li class="has-sub-sub"><a data-menu="5" class="has-sub-sub"  href="/admin/user/list-user"><span class="sub-menu-text">用户列表</span></a></li>
                    </ul>
                </li>
                <li class="has-sub">
                    <a href="javascript:;" class="" data-menu="5">
                        <i class="fa fa-file-text fa-fw"></i> <span class="menu-text">配置</span>
                        <span class="arrow"></span>
                    </a>
                    <ul class="sub">
                        <li class="has-sub-sub"><a data-menu="5" class="has-sub-sub"  href="/admin/config/list"><span class="sub-menu-text">基础配置</span></a></li>
                    </ul>
                </li>
                <li class="has-sub">
                    <a href="javascript:;" class="" data-menu="6">
                        <i class="fa fa-file-text fa-fw"></i> <span class="menu-text">综合管理</span>
                        <span class="arrow"></span>
                    </a>
                    <ul class="sub">
                        <li class="has-sub-sub"><a data-menu="7" class="has-sub-sub"  href="/admin/member/index"><span class="sub-menu-text">会员查找</span></a></li>
                        <li class="has-sub-sub"><a data-menu="8" class="has-sub-sub"  href="/admin/member/photo?is_check=2&type=1"><span class="sub-menu-text">照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片</span></a></li>
                        <li class="has-sub-sub"><a data-menu="9" class="has-sub-sub"  href="/admin/member/order"><span class="sub-menu-text">订单列表</span></a></li>
                        <li class="has-sub-sub"><a data-menu="10" class="has-sub-sub"  href="/admin/cash/index?status=2"><span class="sub-menu-text">提现管理</span></a></li>
                        <li class="has-sub-sub"><a data-menu="11" class="has-sub-sub"  href="/admin/chat/index"><span class="sub-menu-text">聊天管理</span></a></li>
                        <li class="has-sub-sub"><a data-menu="12" class="has-sub-sub"  href="/admin/feedback/index?status=2"><span class="sub-menu-text">举报管理</span></a></li>
                    </ul>
                </li>

            </ul>
            <!-- /左侧菜单 -->
        </div>
    </div>
    <!-- /SIDEBAR -->
    <div id="main-content">
        <div class="container">
            <div class="row">
                <div id="content" class="col-lg-12">
                    <!-- PAGE HEADER-->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="page-header">


                            </div>
                        </div>
                    </div>
                    <!-- /PAGE HEADER -->
                    <div class="container">
                        <div class="alert alert-block alert-success fade in" style="display: none;">
                            <a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>
                            <p><h4><i class="fa fa-heart"></i> <span>操作成功</span></h4> </p>
                        </div>
                        <div class="alert alert-block alert-danger fade in" style="display: none;">
                            <a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>
                            <h4><i class="fa fa-times"></i> <span>操作失败</span></h4>
                            <p></p>

                        </div>

                        <?= $content ?>
                    </div>
                </div><!-- /CONTENT-->

            </div>
        </div>
    </div>
</section>
<!-- system modal start -->
<div id="ycf-alert" class="modal">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                <h5 class="modal-title"><i class="fa fa-exclamation-circle"></i> [Title]</h5>
            </div>
            <div class="modal-body small">
                <p>[Message]</p>
            </div>
            <div class="modal-footer" >
                <button type="button" class="btn btn-primary ok" data-dismiss="modal">[BtnOk]</button>
                <button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>
            </div>
        </div>
    </div>
</div>
<!-- system modal end -->
<!--/PAGE -->
<!-- JAVASCRIPTS -->
<!-- Placed at the end of the document so the pages load faster -->

<!-- JQUERY VALIDATE -->
<script src="/backend/web/CloudAdmin/js/jquery-validate/jquery.validate.min.js"></script>
<!-- JQUERY UI-->
<script src="/backend/web/CloudAdmin/js/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js"></script>
<script src="/backend/web/CloudAdmin/js/jQuery-BlockUI/jquery.blockUI.min.js"></script>
<!-- BOOTSTRAP -->
<script src="/backend/web/CloudAdmin/bootstrap/js/bootstrap.min.js"></script>

<!-- DATA TABLES -->
<script src="/backend/web/CloudAdmin/js/datatables/media/js/jquery.dataTables.min.js"></script>
<script src="/backend/web/js/dataTables.bootstrap.js"></script>

<!-- DATE PICKER -->
<script src="/backend/web/CloudAdmin/js/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js"></script>
<script src="/backend/web/CloudAdmin/js/bootstrap-datetimepicker/locales/bootstrap-datetimepicker.zh-CN.js"></script>

<!-- SLIMSCROLL -->
<script type="text/javascript" src="/backend/web/CloudAdmin/js/jQuery-slimScroll-1.3.0/jquery.slimscroll.min.js"></script><script type="text/javascript" src="/backend/web/CloudAdmin/js/jQuery-slimScroll-1.3.0/slimScrollHorizontal.min.js"></script>
<!-- COOKIE -->
<script type="text/javascript" src="/backend/web/CloudAdmin/js/jQuery-Cookie/jquery.cookie.min.js"></script>
<script type="text/javascript" src="/backend/web/CloudAdmin/js/file_input/fileinput.min.js"></script>
<script type="text/javascript" src="/backend/web/CloudAdmin/js/bootstrap-alert/alert.js"></script>

<!-- FORM -->
<script type="text/javascript" src="/backend/web/CloudAdmin/js/select2/select2.min.js"></script>
<script src="/backend/web/CloudAdmin/js/uniform/jquery.uniform.min.js"></script>

<script type="text/javascript" src="/backend/web/CloudAdmin/js/dropzone/dropzone.min.js"></script>

<!-- layer -->
<script src="/backend/web/CloudAdmin/layer/layer.js"></script>
<!-- BOOTSTRAP SWITCH -->
<script type="text/javascript" src="/backend/web/CloudAdmin/js/bootstrap-switch/bootstrap-switch.min.js"></script>
<!-- CUSTOM SCRIPT -->
<script src="/backend/web/js/dataTableQuery.js"></script>
<script src="/backend/web/js/app.js"></script>
<!-- TIMEAGO -->
<script type="text/javascript" src="/backend/web/CloudAdmin/js/timeago/jquery.timeago.min.js"></script>

<script src="/backend/web/CloudAdmin/js/script.js"></script>
<script>

    jQuery(document).ready(function() {
        App.init(); //Initialise plugins and elements

    });

</script>
<!-- /JAVASCRIPTS -->
</body>
</html>