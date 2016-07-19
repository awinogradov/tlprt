'use strict';

const path = require('path');
const bemDeps = require('@bem/deps');
const toArray = require('stream-to-array');
const bemNaming = require('bem-naming');
const fs = require('fs');
const _ = require('lodash');

module.exports = function getDeps(levels, exportable) {
    return (info) => {
        return new Promise((resolve, reject) => {
            toArray(bemDeps.load({ levels }), (err, relations) => {
                if(err) {
                    reject(err);
                    return;
                }

                const possibleDeps = exportable.entities.map(block => ({
                    block,
                    deps: bemDeps.resolve([{ block }], relations).entities,
                }));

                const livelyDeps = matchOnFs(possibleDeps, levels, exportable, info);

                let extendedDeps = _.merge(livelyDeps, info);
                let combined = {};
                Object.keys(extendedDeps).forEach(tech => {
                    combined[tech] = [];
                    Object.keys(extendedDeps[tech]).forEach(entity => {
                        extendedDeps[tech][entity] = _.uniq(extendedDeps[tech][entity]);
                        combined[tech] = [].concat(extendedDeps[tech][entity]);
                    });
                    combined[tech] = _.uniq(combined[tech]);
                });
                extendedDeps.combined = combined;

                resolve(extendedDeps);
            });
        });
    };
};

function generateBemPath(dep, tech) {
    let path = `${dep.block}/`;
    const filename = `${bemNaming.stringify(dep)}.${tech}`;

    if(bemNaming.isBlock(dep)) {
        path = `${path}${filename}`;
    }

    if(bemNaming.isElem(dep)) {
        path = `${path}__${dep.elem}/${filename}`;
    }

    if(bemNaming.isBlockMod(dep)) {
        path = `${path}_${dep.modName}/${filename}`;
    }

    if(bemNaming.isElemMod(dep)) {
        path = `${path}__${dep.elem}/_${dep.modName}/${filename}`;
    }

    return path;
}

function matchOnFs(deps, levels, exportable, info) {
    var results = {};
    var tmpResults = [];

    exportable.techs.forEach(tech => {
        results[tech] = {};

        deps.forEach(depData => {
            tmpResults = depData.deps.map(dep => generateBemPath(dep, tech));
            tmpResults = tmpResults.reduce((acc, paths) => acc.concat(paths), []);

            var allPossiblePaths = [];
            levels.forEach(level => {
                allPossiblePaths = allPossiblePaths.concat(
                    tmpResults.map(r => path.join(level, r))
                );
            });

            results[tech][depData.block] = allPossiblePaths.filter(fs.existsSync);
        });
    });

    return results;
}
