'use strict';

(function (name, context, definition) {
    /*eslint-disable */
    if (typeof define === 'function' && define.amd) {
        define(['text!../../../json/data.json'], definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        var fs = require('fs'),
            view = fs.readFileSync('src/client/json/data.json', 'utf8');
        module.exports = definition(view);
    } else {
        var r = new XMLHttpRequest(),
            view;
        r.open('GET', '/json/data.json', true);
        r.onreadystatechange = function () {
            if (r.readyState !== 4 || r.status !== 200) {
                return;
            }

            view = r.responseText;
            context[name] = definition(view);
        };
        r.send();
    }
    /*eslint-enable */
})('data', this, function(view) {
    var getSitemap;
    view = JSON.parse(view) || {};

    getSitemap = function getSitemap() {
        var links = {};

        Object.keys(view.sitemap).forEach(function(key, i) {
            links[view.sitemap[i].name] = view.sitemap[i];
        });

        return links;
    };

    view.getSitemap = getSitemap;

    return view;
});
