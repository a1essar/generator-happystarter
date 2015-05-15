'use strict';

var less = require('less');
var es = require('event-stream');
var path = require('path');

var lessRender = function lessRender() {
    var data = [];
    var content = new Buffer(0);
    var markerStart = '/*start file*/';
    var markerStartRegex = /(\/\*start file\*\/)/g;
    var markerEnd = '/*end file*/';
    var markerEndRegex = /(\/\*end file\*\/)/g;

    function bufferContents(file){
        if (file.isNull()) {
            return;
        }

        data.push(file);

        if (content.length !== 0) {
            content = Buffer.concat([content, new Buffer(0)]);
        }

        content = Buffer.concat([content, new Buffer(markerStart + '/* ' + path.basename(file.history) + ' */' + file.contents + markerEnd)]);
    }

    function endStream(){
        if (!data) {
            return this.emit('end');
        }

        var _this = this;

        less.render(content.toString('utf8'), {
            compress: false,
            paths: [],
            sourceMap: false
        }).then(
            function(output) {
                var css = output.css;
                var markerStartIndex = [];
                var markerEndIndex = [];

                css.replace(markerStartRegex, function (a, b, index) {
                    markerStartIndex.push(index);
                });

                css.replace(markerEndRegex, function (a, b, index) {
                    markerEndIndex.push(index);
                });

                for(var i = 0; i <= data.length - 1; i++){
                    var cssPart = css.substring(markerStartIndex[i] + markerStart.length, markerEndIndex[i]);

                    data[i].contents = new Buffer(cssPart);
                    _this.emit('data', data[i]);

                    if(i == data.length - 1){
                        _this.emit('end');
                    }
                }
            },
            function(error) {
                console.log(error);
            }
        );
    }

    return es.through(bufferContents, endStream);
};

module.exports = lessRender;