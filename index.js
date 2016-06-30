'use strict';

const fs = require('fs-extra');
const join = require('path').join;

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
            fs.outputFileSync(
                join(process.cwd(), './.teleport/index.json'),
                JSON.stringify(assets, null, 2)
            );

            console.log(`${opts.libName} teleported successfully`);

            return assets;
        });
}
