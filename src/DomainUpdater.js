(function() {
  var _ = require('underscore'),
      Q = require('q');

  var DomainUpdater = function(options) {
    this.Log = options.Log;
    this.updaters = {};
  };

  DomainUpdater.prototype.register = function(eventType, updater) {
    if (this.updaters[eventType]) {
      throw "Updater already registered for " + eventType;
    }

    this.updaters[eventType] = updater;
  };

  DomainUpdater.prototype.update = function(event) {
    var deferred = Q.defer();
    
    if (event.eventType === undefined) {
      deferred.reject();
    } else {
      this.handleEvent(event, deferred);
    }

    return deferred.promise;
  };

  DomainUpdater.prototype.handleEvent = function(event, deferred) {
    if (this.updaters[event.eventType] !== undefined) {
      this.updaters[event.eventType](event);
      deferred.resolve();
    } else {
      deferred.reject('no updater for ' + event.eventType);
    } 
  };

  module.exports = DomainUpdater;
})();
