'use strict';

module.exports = function getLevelsPaths(exportable) {
    let levelsPaths = [];
    exportable.platforms.forEach(platform => {
        let platformLevels = exportable.levels[platform].map(level => (level.path));
        levelsPaths = [].concat(levelsPaths, platformLevels);
    });
    return levelsPaths;
}
