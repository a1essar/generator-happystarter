'use strict';

var gulp = require('gulp'),
    gulpGhPages = require('gulp-gh-pages'),
    config = require('../config.json');

/* start: gh-pages */
gulp.task('gh-pages', function () {
    return gulp.src('./dist/**/*')
        .pipe(gulpGhPages());
});
/* end: gh-pages */
