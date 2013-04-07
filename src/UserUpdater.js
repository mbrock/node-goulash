(function() {
  var _ = require('underscore');

  var UserUpdater = function(options) {
    this.DomainUpdater = options.DomainUpdater;
  };

  UserUpdater.prototype.initialize = function() {
    this.DomainUpdater.register('UserCreated');
  };

  UserUpdater.prototype.handle = function(event) {
  };

  module.exports = UserUpdater;
})();
