<?php
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
    <!-- STYLESHEETS --><!--[if lt IE 9]><script src="/admin/CloudAdmin/js/flot/excanvas.min.js"></script><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script><![endif]-->
    <link rel="stylesheet" type="text/css" href="/admin/CloudAdmin/css/cloud-admin.css" >
    <link rel="stylesheet" type="text/css"  href="/admin/CloudAdmin/css/themes/default.css" id="skin-switcher" >
    <link rel="stylesheet" type="text/css"  href="/admin/CloudAdmin/css/responsive.css" >

    <link href="/admin/CloudAdmin/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- DATE RANGE PICKER -->
    <link rel="stylesheet" type="text/css" href="/admin/CloudAdmin/js/bootstrap-daterangepicker/daterangepicker-bs3.css" />
    <!-- FONTS -->
    <link href='http://fonts.useso.com/css?family=Open+Sans:300,400,600,700' rel='stylesheet' type='text/css'>

    <link rel="stylesheet" type="text/css" href="/admin/CloudAdmin/js/datatables/media/css/jquery.dataTables.min.css" />
    <link rel="stylesheet" type="text/css" href="/admin/CloudAdmin/js/datatables/media/assets/css/datatables.min.css" />
    <link rel="stylesheet" type="text/css" href="/admin/CloudAdmin/js/datatables/extras/TableTools/media/css/TableTools.min.css" />
    <link rel="stylesheet" type="text/css" href="/admin/CloudAdmin/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="/admin/CloudAdmin/js/file_input/fileinput.min.css" />

</head>
<body>
<!-- HEADER -->
<header class="navbar clearfix navbar-fixed-top" id="header">
    <div class="container">
        <div class="navbar-brand">
            <!-- COMPANY LOGO -->
            <a href="index.html">
                <img src="/admin/CloudAdmin/img/logo/logo.png" alt="Cloud Admin Logo" class="img-responsive" height="30" width="120">
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
                    <i class="fa fa-cog"></i>
                    <span class="name">主题设置</span>
                    <i class="fa fa-angle-down"></i>
                </a>
                <ul class="dropdown-menu skins">
                    <li class="dropdown-title">
                        <span><i class="fa fa-leaf"></i> Theme Skins</span>
                    </li>
                    <li><a href="#" data-skin="default">Subtle (default)</a></li>
                    <li><a href="#" data-skin="night">Night</a></li>
                    <li><a href="#" data-skin="earth">Earth</a></li>
                    <li><a href="#" data-skin="utopia">Utopia</a></li>
                    <li><a href="#" data-skin="nature">Nature</a></li>
                    <li><a href="#" data-skin="graphite">Graphite</a></li>
                </ul>
            </li>
        </ul>
        <!-- /NAVBAR LEFT -->
        <!-- BEGIN TOP NAVIGATION MENU -->
        <ul class="nav navbar-nav pull-right">
            <!-- BEGIN USER LOGIN DROPDOWN -->
            <li class="dropdown user" id="header-user">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <img alt="" src="/admin/CloudAdmin/img/avatars/avatar3.jpg" />
                    <span class="username">admin</span>
                    <i class="fa fa-angle-down"></i>
                </a>
                <ul class="dropdown-menu">
                    <li><a href="#"><i class="fa fa-cog"></i> 账户设置</a></li>
                    <li><a href="login.html"><i class="fa fa-power-off"></i> 退出</a></li>
                </ul>
            </li>
            <!-- END USER LOGIN DROPDOWN -->
        </ul>
        <!-- END TOP NAVIGATION MENU -->
    </div>

    <!-- TEAM STATUS -->
    <div class="container team-status" id="team-status">
        <div id="scrollbar">
            <div class="handle">
            </div>
        </div>
        <div id="teamslider">
            <ul class="team-list">
                <li class="current">
                    <a href="javascript:void(0);">
				  <span class="image">
					  <img src="/admin/CloudAdmin/img/avatars/avatar3.jpg" alt="" />
				  </span>
				  <span class="title">
					You
				  </span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-success" style="width: 35%">
                                <span class="sr-only">35% Complete (success)</span>
                            </div>
                            <div class="progress-bar progress-bar-warning" style="width: 20%">
                                <span class="sr-only">20% Complete (warning)</span>
                            </div>
                            <div class="progress-bar progress-bar-danger" style="width: 10%">
                                <span class="sr-only">10% Complete (danger)</span>
                            </div>
                        </div>
					<span class="status">
						<div class="field">
                            <span class="badge badge-green">6</span> completed
                            <span class="pull-right fa fa-check"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-orange">3</span> in-progress
                            <span class="pull-right fa fa-adjust"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-red">1</span> pending
                            <span class="pull-right fa fa-list-ul"></span>
                        </div>
				    </span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);">
				  <span class="image">
					  <img src="/admin/CloudAdmin/img/avatars/avatar1.jpg" alt="" />
				  </span>
				  <span class="title">
					Max Doe
				  </span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-success" style="width: 15%">
                                <span class="sr-only">35% Complete (success)</span>
                            </div>
                            <div class="progress-bar progress-bar-warning" style="width: 40%">
                                <span class="sr-only">20% Complete (warning)</span>
                            </div>
                            <div class="progress-bar progress-bar-danger" style="width: 20%">
                                <span class="sr-only">10% Complete (danger)</span>
                            </div>
                        </div>
					<span class="status">
						<div class="field">
                            <span class="badge badge-green">2</span> completed
                            <span class="pull-right fa fa-check"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-orange">8</span> in-progress
                            <span class="pull-right fa fa-adjust"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-red">4</span> pending
                            <span class="pull-right fa fa-list-ul"></span>
                        </div>
				    </span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);">
				  <span class="image">
					  <img src="/admin/CloudAdmin/img/avatars/avatar2.jpg" alt="" />
				  </span>
				  <span class="title">
					Jane Doe
				  </span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-success" style="width: 65%">
                                <span class="sr-only">35% Complete (success)</span>
                            </div>
                            <div class="progress-bar progress-bar-warning" style="width: 10%">
                                <span class="sr-only">20% Complete (warning)</span>
                            </div>
                            <div class="progress-bar progress-bar-danger" style="width: 15%">
                                <span class="sr-only">10% Complete (danger)</span>
                            </div>
                        </div>
					<span class="status">
						<div class="field">
                            <span class="badge badge-green">10</span> completed
                            <span class="pull-right fa fa-check"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-orange">3</span> in-progress
                            <span class="pull-right fa fa-adjust"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-red">4</span> pending
                            <span class="pull-right fa fa-list-ul"></span>
                        </div>
				    </span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);">
				  <span class="image">
					  <img src="/admin/CloudAdmin/img/avatars/avatar4.jpg" alt="" />
				  </span>
				  <span class="title">
					Ellie Doe
				  </span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-success" style="width: 5%">
                                <span class="sr-only">35% Complete (success)</span>
                            </div>
                            <div class="progress-bar progress-bar-warning" style="width: 48%">
                                <span class="sr-only">20% Complete (warning)</span>
                            </div>
                            <div class="progress-bar progress-bar-danger" style="width: 27%">
                                <span class="sr-only">10% Complete (danger)</span>
                            </div>
                        </div>
					<span class="status">
						<div class="field">
                            <span class="badge badge-green">1</span> completed
                            <span class="pull-right fa fa-check"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-orange">6</span> in-progress
                            <span class="pull-right fa fa-adjust"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-red">2</span> pending
                            <span class="pull-right fa fa-list-ul"></span>
                        </div>
				    </span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);">
				  <span class="image">
					  <img src="/admin/CloudAdmin/img/avatars/avatar5.jpg" alt="" />
				  </span>
				  <span class="title">
					Lisa Doe
				  </span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-success" style="width: 21%">
                                <span class="sr-only">35% Complete (success)</span>
                            </div>
                            <div class="progress-bar progress-bar-warning" style="width: 20%">
                                <span class="sr-only">20% Complete (warning)</span>
                            </div>
                            <div class="progress-bar progress-bar-danger" style="width: 40%">
                                <span class="sr-only">10% Complete (danger)</span>
                            </div>
                        </div>
					<span class="status">
						<div class="field">
                            <span class="badge badge-green">4</span> completed
                            <span class="pull-right fa fa-check"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-orange">5</span> in-progress
                            <span class="pull-right fa fa-adjust"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-red">9</span> pending
                            <span class="pull-right fa fa-list-ul"></span>
                        </div>
				    </span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);">
				  <span class="image">
					  <img src="/admin/CloudAdmin/img/avatars/avatar6.jpg" alt="" />
				  </span>
				  <span class="title">
					Kelly Doe
				  </span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-success" style="width: 45%">
                                <span class="sr-only">35% Complete (success)</span>
                            </div>
                            <div class="progress-bar progress-bar-warning" style="width: 21%">
                                <span class="sr-only">20% Complete (warning)</span>
                            </div>
                            <div class="progress-bar progress-bar-danger" style="width: 10%">
                                <span class="sr-only">10% Complete (danger)</span>
                            </div>
                        </div>
					<span class="status">
						<div class="field">
                            <span class="badge badge-green">6</span> completed
                            <span class="pull-right fa fa-check"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-orange">3</span> in-progress
                            <span class="pull-right fa fa-adjust"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-red">1</span> pending
                            <span class="pull-right fa fa-list-ul"></span>
                        </div>
				    </span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);">
				  <span class="image">
					  <img src="/admin/CloudAdmin/img/avatars/avatar7.jpg" alt="" />
				  </span>
				  <span class="title">
					Jessy Doe
				  </span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-success" style="width: 7%">
                                <span class="sr-only">35% Complete (success)</span>
                            </div>
                            <div class="progress-bar progress-bar-warning" style="width: 30%">
                                <span class="sr-only">20% Complete (warning)</span>
                            </div>
                            <div class="progress-bar progress-bar-danger" style="width: 10%">
                                <span class="sr-only">10% Complete (danger)</span>
                            </div>
                        </div>
					<span class="status">
						<div class="field">
                            <span class="badge badge-green">1</span> completed
                            <span class="pull-right fa fa-check"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-orange">6</span> in-progress
                            <span class="pull-right fa fa-adjust"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-red">2</span> pending
                            <span class="pull-right fa fa-list-ul"></span>
                        </div>
				    </span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);">
				  <span class="image">
					  <img src="/admin/CloudAdmin/img/avatars/avatar8.jpg" alt="" />
				  </span>
				  <span class="title">
					Debby Doe
				  </span>
                        <div class="progress">
                            <div class="progress-bar progress-bar-success" style="width: 70%">
                                <span class="sr-only">35% Complete (success)</span>
                            </div>
                            <div class="progress-bar progress-bar-warning" style="width: 20%">
                                <span class="sr-only">20% Complete (warning)</span>
                            </div>
                            <div class="progress-bar progress-bar-danger" style="width: 5%">
                                <span class="sr-only">10% Complete (danger)</span>
                            </div>
                        </div>
					<span class="status">
						<div class="field">
                            <span class="badge badge-green">13</span> completed
                            <span class="pull-right fa fa-check"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-orange">7</span> in-progress
                            <span class="pull-right fa fa-adjust"></span>
                        </div>
						<div class="field">
                            <span class="badge badge-red">1</span> pending
                            <span class="pull-right fa fa-list-ul"></span>
                        </div>
				    </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <!-- /TEAM STATUS -->
</header>
<!--/HEADER -->

<!-- PAGE -->
<section id="page">
    <!-- SIDEBAR -->
    <div id="sidebar" class="sidebar sidebar-fixed">
        <div class="sidebar-menu nav-collapse">
            <div class="divide-20"></div>
            <!-- SEARCH BAR -->
<!--            <div id="search-bar">-->
<!--                <input class="search" type="text" placeholder="Search"><i class="fa fa-search search-icon"></i>-->
<!--            </div>-->
            <!-- /SEARCH BAR -->

            <!-- SIDEBAR MENU -->
            <ul>
                <li>
                    <a href="/admin/site/">
                        <i class="fa fa-tachometer fa-fw"></i> <span class="menu-text">主页</span>
                        <span class="selected"></span>
                    </a>
                </li>

                <li class="has-sub">
                    <a href="javascript:;" class="">
                        <i class="fa fa-file-text fa-fw"></i> <span class="menu-text">功能</span>
                        <span class="arrow"></span>
                    </a>
                    <ul class="sub">
                        <li><a class="" href="login.html"><span class="sub-menu-text">Login & Register Option 1</span></a></li><li><a class="" href="login_bg.html"><span class="sub-menu-text">Login & Register Option 2</span></a></li>

                    </ul>
                </li>

                <li class="has-sub">
                    <a href="javascript:;" class="">
                        <i class="fa fa-file-text fa-fw"></i> <span class="menu-text">RBAC权限</span>
                        <span class="arrow"></span>
                    </a>
                    <ul class="sub">
                        <li><a class="" href="/admin/rbac/list-permission"><span class="sub-menu-text">权限列表</span></a></li>
                        <li><a class="" href="/admin/rbac/list-role"><span class="sub-menu-text">角色列表</span></a></li>
                    </ul>
                </li>

                <li class="has-sub">
                    <a href="javascript:;" class="">
                        <i class="fa fa-file-text fa-fw"></i> <span class="menu-text">用户管理</span>
                        <span class="arrow"></span>
                    </a>
                    <ul class="sub">
                        <li><a class="" href="/admin/user/list-user"><span class="sub-menu-text">用户列表</span></a></li>
                    </ul>
                </li>

            </ul>
            <!-- /SIDEBAR MENU -->
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
                                <!-- STYLER -->

                                <!-- /STYLER -->
                                <!-- BREADCRUMBS -->
                                <ul class="breadcrumb">
                                    <li>
                                        <i class="fa fa-home"></i>
                                        <a href="index.html">Home</a>
                                    </li>
                                    <li>
                                        <a href="#">Layouts</a>
                                    </li>
                                    <li>Fixed Header & Sidebar</li>
                                </ul>
                                <!-- /BREADCRUMBS -->
                                <div class="clearfix">
                                    <h3 class="content-title pull-left">Fixed Header & Sidebar</h3>
                                </div>
                                <div class="description">Fixed Header & Sidebar Layout</div>
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
<!-- JQUERY -->
<script src="/admin/CloudAdmin/js/jquery/jquery-2.0.3.min.js"></script>
<!-- JQUERY VALIDATE -->
<script src="/admin/CloudAdmin/js/jquery-validate/jquery.validate.min.js"></script>
<!-- JQUERY UI-->
<script src="/admin/CloudAdmin/js/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js"></script>
<!-- BOOTSTRAP -->
<script src="/admin/CloudAdmin/bootstrap/js/bootstrap.min.js"></script>


<!-- DATA TABLES -->
<script type="text/javascript" src="/admin/CloudAdmin/js/datatables/media/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="/admin/CloudAdmin/js/datatables/media/assets/js/datatables.min.js"></script>
<script type="text/javascript" src="/admin/CloudAdmin/js/datatables/extras/TableTools/media/js/TableTools.min.js"></script>
<script type="text/javascript" src="/admin/CloudAdmin/js/datatables/extras/TableTools/media/js/ZeroClipboard.min.js"></script>

<!-- DATE RANGE PICKER -->
<script src="/admin/CloudAdmin/js/bootstrap-daterangepicker/moment.min.js"></script>

<script src="/admin/CloudAdmin/js/bootstrap-daterangepicker/daterangepicker.min.js"></script>
<!-- SLIMSCROLL -->
<script type="text/javascript" src="/admin/CloudAdmin/js/jQuery-slimScroll-1.3.0/jquery.slimscroll.min.js"></script><script type="text/javascript" src="/admin/CloudAdmin/js/jQuery-slimScroll-1.3.0/slimScrollHorizontal.min.js"></script>
<!-- COOKIE -->
<script type="text/javascript" src="/admin/CloudAdmin/js/jQuery-Cookie/jquery.cookie.min.js"></script>
<script type="text/javascript" src="/admin/CloudAdmin/js/file_input/fileinput.min.js"></script>
<script type="text/javascript" src="/admin/CloudAdmin/js/bootstrap-alert/alert.js"></script>
<!-- CUSTOM SCRIPT -->
<script src="/admin/js/dataTableQuery.js"></script>
<script src="/admin/js/app.js"></script>
<script src="/admin/CloudAdmin/js/script.js"></script>
<script>

    jQuery(document).ready(function() {
        App.setPage("fixed_header_sidebar");  //Set current page
        App.init(); //Initialise plugins and elements

    });



</script>
<!-- /JAVASCRIPTS -->
</body>
</html>