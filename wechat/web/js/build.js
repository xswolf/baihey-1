/**
 * Created by Administrator on 2016/3/29.
 */
({
    appDir:'./',
    baseUrl:"./",
    dir:"../dist",
    removeCombined:true,
    findNestedDependencies: true,
    paths: {
        angular: 'plugin/angular/angular.min',
        angular_animate: 'plugin/angular/angular-animate.min',
        angular_sanitize: 'plugin/angular/angular-sanitize.min',
        angular_ui_router: 'plugin/angular/angular-ui-router.min',
        angular_upload: 'plugin/angular/angular-file-upload.min',
        ionic:'plugin/ionic/ionic.min',
        ionic_angular:'plugin/ionic/ionic-angular.min',
        comm: 'comm',
        mobiscroll: 'plugin/mobiscroll/mobiscroll.custom-3.0.0-beta.min',
        photoswipe:'plugin/photoswipe/photoswipe.min',
        photoswipe_ui:'plugin/photoswipe/photoswipe-ui-default.min',
        klass:'plugin/photoswipe/klass.min',
        info_data: 'config/infoData',
        ionic_gallery:'plugin/ionic/ion-gallery.min',
        ng_cordova:'plugin/cordova/ng-cordova.min',
        cordova:'plugin/cordova/cordova',
        filterApi:'app/filter/filterApi'
    },

    modules: [
        {
            name: 'app',
            exclude: [
                'angular',
                'ionic',
                'angular_animate',
                //'angular_sanitize',
                'angular_ui_router',
                'angular_upload',
                'ionic_angular',
                'mobiscroll',
                'photoswipe',
                'photoswipe_ui',
                //'info_data',
                'ionic_gallery',
                'filterApi',


                //'config/city',
                'config/occupation',
                'config/area',
                //'comm',
                'app/router',

            ]
        },
    ],

    fileExclusionRegExp: /^(r|build)\.js$/,

    shim: {
        angular:{
            exports:"angular"
        },
        "angular-route":{
            deps:['angular'],
            exports:"angular-route"
        }
    },
    //name: "app.js",
})