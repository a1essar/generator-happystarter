'use strict';

var gulp = require('gulp'),
    gulpDebug = require('gulp-debug'),
    gulpChanged = require('gulp-changed'),
    gulpHtmlmin = require('gulp-htmlmin'),
    gulpHtmlhint = require('gulp-htmlhint'),
    gulpUtil = require('gulp-util'),
    gulpPlumber = require('gulp-plumber'),
    config = require('../config.json'),
    mustacheRender = require('../utils/mustache-render');

/* start task copy:templates */
gulp.task('copy:templates', function () {
    return gulp.src(config.paths.templates + '/**')
        .pipe(gulpChanged(config.paths.distTemplates))
        .pipe(gulpDebug({title: 'copy changed templates:'}))
        .pipe(gulp.dest(config.paths.distTemplates));
});
/* end task copy:templates */

/* start task: templates */
gulp.task('templates', function() {

    /* custom reporter function for gulpHtmlhint*/
    var reporter = function reporter(file) {
        var c = gulpUtil.colors,
            errorCount = file.htmlhint.errorCount,
            plural = errorCount === 1 ? '' : 's';

        gulpUtil.log(c.cyan(errorCount) + ' error' + plural + ' found in ' + c.magenta(file.path));

        file.htmlhint.messages.forEach(function(result) {
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

    gulp.src(config.paths.templates + '**.mustache')
        .pipe(gulpPlumber())
        .pipe(mustacheRender())
        .pipe(gulpDebug({title: 'render changed templates:'}))
        .pipe(gulpHtmlhint({
            'tagname-lowercase': true,
            'attr-lowercase': true,
            'attr-value-double-quotes': false,
            'attr-value-not-empty': false,
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
        .pipe(gulp.dest(config.paths.distTemplates));
});
/* end task: templates */
