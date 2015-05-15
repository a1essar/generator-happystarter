'use strict';

var del = require('del'),
    runSequence = require('run-sequence'),
    vinylPaths = require('vinyl-paths'),
    requireDir = require('require-dir'),
    browserSync = require('browser-sync'),
    gulp = require('gulp'),
    gulpChanged = require('gulp-changed'),
    options = require('./gulp/config.json'),
    tasks = requireDir('./gulp/tasks');


gulp.task('go', function() {

});

gulp.task('default', ['go']);
