var zombie = require('zombie');
var app = require('../../src/app.js').goulash;

exports.World = function(callback) {
  this.browser = new zombie.Browser();

  callback();
};
