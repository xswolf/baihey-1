<?php
/**
 * Created by PhpStorm.
 * User: NSK.
 * Date: 2016/3/15/0015
 * Time: 18:18
 */

namespace common\models;


class Config {

    /**
     * 后台网站地图
     * @var array
     */
    public $adminSiteMap =[
        'adminSiteMap'=>[
            'rbac'=>[
                'create-empowerment'=>[
                    'name'=>'角色授权',
                    'url'=>'/admin/rbac/create-empowerment'
                ],
                'create-permission'=>[
                    'name'=>'添加权限',
                    'url'=>'/admin/rbac/create-empowerment'
                ],
                'create-role'=>[
                    'name'=>'添加角色',
                    'url'=>'/admin/rbac/create-role'
                ],
                'edit-permission'=>[
                    'name'=>'编辑权限',
                    'url'=>'/admin/rbac/edit-permission'
                ],
                'edit-role'=>[
                    'name'=>'编辑角色',
                    'url'=>'/admin/rbac/edit-role'
                ],
                'list-permission'=>[
                    'name'=>'权限列表',
                    'url'=>'/admin/rbac/list-permission'
                ],
                'list-role'=>[
                    'name'=>'角色列表',
                    'url'=>'/admin/rbac/list-role'
                ]
            ],
            'site'=>[
                'index'=>[
                    'name'=>'首页',
                    'url'=>'/admin/site'
                ]
            ],
            'user'=>[
                'create-user'=>[
                    'name'=>'创建用户',
                    'url'=>'/admin/user/create-user'
                ],
                'edit-user'=>[
                    'name'=>'修改用户',
                    'url'=>'/admin/user/edit-user'
                ],
                'list-user'=>[
                    'name'=>'用户列表',
                    'url'=>'/admin/user/list-user'
                ],
            ]
        ]
    ];


}