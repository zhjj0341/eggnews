const path = require('path');
// config/plugin.js
exports.nunjucks = {
    enable: true,
    package: 'egg-view-nunjucks'
};

exports.ua = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-ua'),
};