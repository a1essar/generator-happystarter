'use strict';

var gulp = require('gulp');
var gulpExec = require('gulp-exec');
var gulpPlumber = require('gulp-plumber');

var options = require('../config');

/* start task: test */
gulp.task('test', function() {
    var execOptions = {
        continueOnError: false, // default = false, true means don't emit error event
        pipeStdout: true, // default = false, true means stdout is written to file.contents
        customTemplatingThing: "" // content passed to gulpUtil.template()
    };

    var reportOptions = {
        err: true, // default = true, false means don't write err
        stderr: true, // default = true, false means don't write stderr
        stdout: true // default = true, false means don't write stdout
    };

    return gulp.src(options.paths.test)
        .pipe(gulpPlumber())
        .pipe(gulpExec('node ./node_modules/mocha-phantomjs/bin/mocha-phantomjs ' + options.paths.test, execOptions))
        .pipe(gulpExec.reporter(reportOptions));
});
/* end task: test */