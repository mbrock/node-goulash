var app = require('../../src/app.js').goulash;

module.exports = function() {
  this.Around(function(runFeature) {
    app.start(3000, function() {
      runFeature(function(callback) {
        app.stop(callback);
      });
    });
  });
};
