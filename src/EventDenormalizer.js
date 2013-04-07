(function() {
  var _ = require('underscore'),
      Q = require('q');

  var EventDenormalizer = function(options) {
    this.Log = options.Log;
    this.handlers = {};
  };

  EventDenormalizer.prototype.register = function(eventType, handler) {
    if (this.handlers[eventType]) {
      throw "Handler already registered for " + eventType;
    }

    this.handlers[eventType] = handler;
  };

  EventDenormalizer.prototype.update = function(event) {
    var deferred = Q.defer();
    
    if (event.eventType === undefined) {
      deferred.reject();
    } else {
      this.handleEvent(event, deferred);
    }

    return deferred.promise;
  };

  EventDenormalizer.prototype.handleEvent = function(event, deferred) {
    if (this.handlers[event.eventType] !== undefined) {
      this.handlers[event.eventType](event);
      deferred.resolve();
    } else {
      deferred.reject('no handler for ' + event.eventType);
    } 
  };

  module.exports = EventDenormalizer;
})();
