'use strict';

var mainBowerFiles = require('main-bower-files');
var _ = require('underscore');

var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var gulpCsso = require('gulp-csso');
var gulpCsslint = require('gulp-csslint');
var gulpCsscomb = require('gulp-csscomb');
var gulpDebug = require('gulp-debug');
var gulpIf = require('gulp-if');
var gulpFilter = require('gulp-filter');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpPlumber = require('gulp-plumber');
var gulpUtil = require('gulp-util');

var options = require('../config');

var lessRender = require('../utils/less-render');
var autoprefixerRender = require('../utils/autoprefixer-render');
var urlRebase = require('../utils/url-rebase');

/* start task: styles */
gulp.task('styles', function() {
    var vendors = mainBowerFiles({
        paths: './',
        filter: /.less$|.css$/
    });

    vendors = _.union(vendors, options.paths.styles);

    var stylesFilter = gulpFilter(function (file) {
        return !/bower_components/.test(file.path);
    });

    /* custom reporter for gulpCsslint*/
    var customReporter = function(file) {
        if(Object.keys(file.csslint.results[0].error.rule).length <= 0){
            return false;
        }

        var c = gulpUtil.colors;

        // Send a beep to the terminal so it bounces
        //process.stderr.write('\x07');

        var errorCount = file.csslint.errorCount;
        var plural = errorCount === 1 ? '' : 's';

        gulpUtil.log(c.cyan(errorCount)+' error'+plural+' found in '+c.magenta(file.path));

        file.csslint.results.forEach(function(result) {
            var message = result.error;

            gulpUtil.log(
                c.red('[') +
                (
                    typeof message.line !== 'undefined' ?
                    c.yellow( 'L' + message.line ) +
                    c.red(':') +
                    c.yellow( 'C' + message.col )
                        :
                        c.yellow('GENERAL')
                ) +
                c.red('] ') +
                message.message + ' ' + message.rule.desc + ' (' + message.rule.id + ')');
        });
    };

    return gulp.src(vendors)
        .pipe(gulpPlumber())

        .pipe(gulpSourcemaps.init())

        .pipe(gulpIf(/.less/, lessRender()))

        .pipe(stylesFilter)
        .pipe(gulpCsslint({
            'adjoining-classes': false,
            'box-model': false,
            'box-sizing': false,
            'compatible-vendor-prefixes': false,
            'empty-rules': true,
            'display-property-grouping': true,
            'duplicate-background-images': true,
            'duplicate-properties': true,
            'fallback-colors': false,
            'floats': false,
            'font-faces': false,
            'font-sizes': true,
            'gradients': false,
            'ids': true,
            'import': true,
            'important': false,
            'known-properties': false,
            'outline-none': false,
            'overqualified-elements': false,
            'qualified-headings': true,
            'regex-selectors': true,
            'shorthand': false,
            'star-property-hack': false,
            'text-indent': false,
            'underscore-property-hack': false,
            'unique-headings': false,
            'universal-selector': false,
            'unqualified-attributes': false,
            'vendor-prefix': false,
            'zero-units': true,
            'bulletproof-font-face': false
        }))
        .pipe(gulpCsslint.reporter(customReporter))
        .pipe(stylesFilter.restore())

        .pipe(urlRebase())
        .pipe(autoprefixerRender())
        .pipe(gulpCsso())

        .pipe(gulpConcat(options.paths.dest.styleFileName))

        .pipe(gulpSourcemaps.write('.'))

        .pipe(gulp.dest(options.paths.dest.styles))
        ;

    /* see all gulpCsslint options: https://github.com/CSSLint/csslint/wiki/Rules-by-ID */
});
/* end task: styles */

/* start task: csscomb */
gulp.task('csscomb', function() {
    return gulp.src(options.paths.styles, {base: './'})
        .pipe(gulpPlumber())

        .pipe(gulpCsscomb())

        .pipe(gulp.dest('./'))
        ;
});
/* end task: csscomb */
