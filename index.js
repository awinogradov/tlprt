'use strict';

const fs = require('fs-extra');
const join = require('path').join;
const successSymbol = require('log-symbols').success;

const levelsPaths = require('./lib/paths');
const entitiesInfo = require('./lib/info');
const entitiesDeps = require('./lib/deps');
const ddsl = require('./lib/ddsl');
const css = require('./lib/css');

module.exports = function teleport(opts) {
    const paths = levelsPaths(opts);
    return entitiesInfo(paths, opts)
        .then(entitiesDeps(paths, opts))
        .then(ddsl(opts))
        .then(css(opts))
        .then(assets => {
            opts.json && fs.outputFileSync(
                join(opts.exportPath, `${opts.libName}.json`),
                JSON.stringify(assets, null, 2)
            );

            console.log(successSymbol, `${opts.libName} teleported successfully`);

            return assets;
        });
}
