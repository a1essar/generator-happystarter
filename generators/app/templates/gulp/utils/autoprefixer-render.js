'use strict';

var autoprefixer = require('autoprefixer-core');
var es = require('event-stream');

var options = require('../config');

var autoprefixerRender = function autoprefixerRender() {
    function render(file, callback) {
        var content = file.contents.toString('utf8');
        var css = autoprefixer({ browsers: options.autoprefixerOptions }).process(content).css;

        file.contents = new Buffer(css);

        callback(null, file);
    }

    return es.map(render);
};

module.exports = autoprefixerRender;