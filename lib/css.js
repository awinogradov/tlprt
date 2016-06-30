'use strict';

const fs = require('fs-extra');
const join = require('path').join;

const tech = 'css';

module.exports = function generateCss(exportable) {
    return (entities) => {
        return new Promise((resolve, reject) => {
            const files = entities[tech];
            let paths = [];
            let ddsl = {};

            Object.keys(files).forEach(
                blockName => paths = paths.concat(files[blockName])
            );

            const exceptRegExp = new RegExp(
                exportable.except.map(entity => `${entity}.${tech}`).join('|')
            );
            paths = paths.filter(p => !exceptRegExp.test(p));

            const styles = paths.reduce((prev, cur) => {
                prev += fs.readFileSync(cur, 'utf-8');
                return prev;
            }, '');

            entities.combined[tech] = join(
                exportable.exportPath, `${exportable.libName}.${tech}`
            );
            fs.outputFileSync(
                entities.combined[tech],
                styles
            );

            resolve(entities);
        });
    };
};
