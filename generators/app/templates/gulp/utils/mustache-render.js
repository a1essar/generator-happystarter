'use strict';

var _ = require('underscore'),
    es = require('event-stream'),
    fs = require('fs'),
    path = require('path'),
    mustache = require('mustache'),
    gulpUtil = require('gulp-util'),

    mustacheRender;

mustacheRender = function mustacheRender(options) {
    var self,
        data = [],
        templates = {},
        views = {},
        partials = {};

    options = _.extend({
        extension: '.html',
        partials: {}
    }, options);

    function bufferContents(file) {
        if (file.isNull()) {
            return;
        }

        data.push(file);
    }

    function endStream() {
        if (!data) {
            return this.emit('end');
        }

        self = this;

        dataLoader();
    }

    function viewsLoader(name) {
        try {
            return require(name);
        } catch(err) {
            /*self.emit('error', new gulpUtil.PluginError('mustacheRender', err));*/
        }
    }

    function render() {
        partials = _.extend(partials, options.partials);

        /* Load base view and add to all views */

        var dataView = viewsLoader('../../src/client/scripts/js/views/data.js') || {};

        Object.keys(templates).forEach(function(key, i) {
            mustache.parse(templates[key]);
            var view = _.extend(views[key], dataView),
                content = mustache.render(templates[key], view, partials);

            data[i].contents = new Buffer(content);
            data[i].path = gulpUtil.replaceExtension(data[i].path, options.extension);

            self.emit('data', data[i]);

            if (i == data.length - 1) {
                self.emit('end');
            }
        });
    }

    function dataLoader() {
        var dataLength = data.length,
            dataIndex = 0;

        data.forEach(function(el, i) {
            var ext = path.extname(data[i].path),
                name = path.basename(data[i].path).replace(ext, ''),
                view,
                viewPath = '../../src/client/scripts/js/views/' + name + '.js';

            if (path.dirname(data[i].path).indexOf('partials') < 0) {
                view = viewsLoader(viewPath);

                if (!view) {
                    view = {};
                }

                views[name] = view;

                templates[name] = data[i].contents.toString('utf8');
            } else {
                partials[name] = data[i].contents.toString('utf8');
            }

            if (dataIndex === dataLength - 1) {
                render();
            }

            dataIndex++;
        });
    }

    return es.through(bufferContents, endStream);
};

module.exports = mustacheRender;
