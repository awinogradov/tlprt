'use strict';

const fs = require('fs-extra');
const join = require('path').join;
const ddsl = require('xjst-ddsl');

const tech = 'ddsl.js';

/**
 * @param files - list of paths to bemhtml stuff
 * @return Promise
 */
module.exports = function generateDdsl(exportable) {
    return (entities) => {
        return new Promise((resolve, reject) => {
            const files = entities['bemhtml.js'];
            let paths = [];

            Object.keys(files).forEach(
                blockName => paths = paths.concat(files[blockName])
            );

            const exceptRegExp = new RegExp(
                exportable.except.map(entity => `${entity}.bemhtml.js}`).join('|')
            );
            paths = paths.filter(p => !exceptRegExp.test(p));

            const templates = paths.reduce((prev, cur) => {
                prev += fs.readFileSync(cur, 'utf-8');
                return prev;
            }, '');

            entities.combined[tech] = join(
                opts.exportPath, `${exportable.libName}.${tech}`
            );
            fs.outputFileSync(entities.combined[tech], ddsl.generate(templates));

            resolve(entities);
        });
    };
};
