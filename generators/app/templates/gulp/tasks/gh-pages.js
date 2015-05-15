'use strict';

var gulp = require('gulp');
var gulpGhPages = require('gulp-gh-pages');

/* start: gh-pages */
gulp.task('gh-pages', function () {
    return gulp.src('./dist/**/*')
        .pipe(gulpGhPages());
});
/* end: gh-pages */