'use strict';

var gulp = require('gulp');
var gulpDebug = require('gulp-debug');
var gulpChanged = require('gulp-changed');
var gulpHtmlmin = require('gulp-htmlmin');
var gulpHtmlhint = require("gulp-htmlhint");
var gulpUtil = require('gulp-util');
var gulpPlumber = require('gulp-plumber');

var options = require('../config');

var mustacheRender = require('../utils/mustache-render');

/* start copy:templates */
gulp.task('copy:templates', function (callback) {
    return gulp.src(options.paths.templates)
        .pipe(gulpChanged(options.paths.dest.templates))
        .pipe(gulpDebug({title: 'copy changed templates:'}))
        .pipe(gulp.dest(options.paths.dest.templates));
});
/* end copy:templates */

/* start task: templates */
gulp.task('templates', function(){

    /* custom reporter function for gulpHtmlhint*/
    var reporter = function reporter(file){
        var c = gulpUtil.colors;

        var errorCount = file.htmlhint.errorCount;
        var plural = errorCount === 1 ? '' : 's';

        // Send a beep to the terminal so it bounces
        //process.stderr.write('\x07');

        gulpUtil.log(c.cyan(errorCount) + ' error' + plural + ' found in ' + c.magenta(file.path));

        file.htmlhint.messages.forEach(function(result){
            var message = result.error,
                line = message.line,
                col = message.col,
                detail = typeof message.line !== 'undefined' ?
                c.yellow('L' + line) + c.red(':') + c.yellow('C' + col) : c.yellow('GENERAL');

            gulpUtil.log(
                c.red('[') + detail + c.red(']') + c.yellow(' ' + message.message) + ' (' + message.rule.id + ')'
            );
        });
    };

    /* see all gulpHtmlmin options: https://github.com/kangax/html-minifier */
    /* see all gulpHtmlhint options: https://github.com/yaniswang/HTMLHint/wiki/Rules */

    gulp.src(options.paths.mustache)
        .pipe(gulpPlumber())

        .pipe(mustacheRender())

        .pipe(gulpDebug({title: 'render changed templates:'}))

        .pipe(gulpHtmlhint({
            'tagname-lowercase': true,
            'attr-lowercase': true,
            'attr-value-double-quotes': false,
            'attr-value-not-empty': true,
            'attr-no-duplication': true,
            'doctype-first': true,
            'tag-pair': true,
            'tag-self-close': true,
            'spec-char-escape': true,
            'id-unique': true,
            'src-not-empty': true
        }))
        .pipe(gulpHtmlhint.reporter(reporter))

        .pipe(gulpHtmlmin({collapseWhitespace: true}))

        .pipe(gulp.dest(options.paths.dest.mustache));
});
/* end task: templates */
