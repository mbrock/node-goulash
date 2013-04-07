var zombie = require('zombie');
var app = require('../../src/app.js').goulash;
var conf = require('../../src/conf.js');

exports.World = function(callback) {
  this.browser = new zombie.Browser({
    maxWait: 10 * 1000
  });
  this.conf = conf;

  callback();
};
