(function() {
  var _ = require('underscore');

  var EventStore = function(options) {
    this.Log = options.Log;

    this.listeners = [];
    this.events = [];
  };

  EventStore.prototype.push = function(event) {
    this.Log.debug({ event: event }, "New event");
    _.each(this.listeners, function(listener) {
      listener(event);
    });
  };

  EventStore.prototype.registerListener =
    function(listener, name, types) {
      this.listeners.push(makeFilteringListener());

      function makeFilteringListener() {
        if (types === undefined) {
          return listener;
        } else {
          return function(event) {
            if (_.contains(types, event.eventType)) {
              listener(event);
            }
          };
        }
      }
    };

  module.exports = EventStore;
})();
