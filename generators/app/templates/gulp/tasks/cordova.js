'use strict';

/**
 * first install the Cordova CLI
 * http://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface
 * */

var exec = require('child_process').exec;
var gulp = require('gulp');

/* start task: cordova:create */
gulp.task('cordova:create', function(callback) {
    exec('cordova create cordova com.example.simpleApp "simpleApp"', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});
/* end task: cordova:create */

/* start task: cordova:add */
gulp.task('cordova:add', function(callback) {
    exec('cd cordova && cordova platform add ios', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });

    exec('cd cordova && cordova platform add android', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});
/* end task: cordova:add */

/* start task: cordova:prepare */
gulp.task('cordova:prepare', function(callback) {
    exec('cd cordova && cordova prepare', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});
/* end task: cordova:prepare */

/* start task: cordova:build */
gulp.task('cordova:build', function(callback) {
    exec('cd cordova && cordova build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});
/* end task: cordova:build */