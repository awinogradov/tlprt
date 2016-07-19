'use strict';

const walk = require('bem-walk');

/**
 * It will walk through bem levels and generate the list
 * of assets divided by bem-technology.
 *
 * @param paths - array of paths to bem levels
 * @return Promise
 */
module.exports = function info(paths, exportable) {
    const results = {};
    const levels = {};
    paths.forEach(path => {
        levels[path] = { scheme: 'nested' };
    });
    const config = { levels };

    function exportableTech(tech) {
        return exportable.techs.indexOf(tech) !== -1;
    }

    function exportableEntity(entity) {
        return exportable.entities.indexOf(entity) !== -1;
    }

    function updateResults(data) {
        const name = data.entity.block;
        const tech = data.tech;

        if(exportableTech(tech)) {
            if(!results[tech]) {
                results[tech] = {};
            }

            if(exportableEntity(name)) {
                if(!results[tech][name]) {
                    results[tech][name] = [];
                }
                results[tech][name].push(data.path);
            }
        }
    }

    return new Promise((resolve, reject) => {
        walk(paths, config)
            .on('data', updateResults)
            .on('end', () => resolve(results))
            .on('errpr', reject);
    });
};
