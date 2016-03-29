/**
 * Created by Administrator on 2016/3/29.
 */
({
    baseUrl:"./",
    paths: {
        jquery: 'plugin/jquery/jquery',
        angular: 'plugin/angular/angular.min',
        "angular-route": "plugin/angular/angular-route",
        bootstrap:'plugin/bootstrap/bootstrap.min'
    },
    shim: {
        angular:{
            exports:"angular"
        },
        "angular-route":{
            deps:['angular'],
            exports:"angular-route"
        },
        jquery : {
            exports:"jquery"
        }
    },
    name: "app.js",
    out: "build.js"
})