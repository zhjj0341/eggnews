'use strict';
const moment = require('moment');

module.exports = {
  relativeTime(time) {
    return moment(new Date(time * 1000)).fromNow();
  },
  domain(url) {
    return url && url.split('/')[2];
  },
};

