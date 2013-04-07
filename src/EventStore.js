(function() {
  var EventStore = function(options) {
    this.Log = options.Log;

    this.listeners = [];
    this.events = [];
  };

  EventStore.prototype.push = function(event) {
    this.Log.debug({ event: event }, "New event");
  };

  EventStore.prototype.registerListener =
    function(listener, name, types) {
    };

  module.exports = EventStore;
})();
