(function() {
  var EventListener = function(options) {
    this.Log = options.Log;

    this.listeners = [];
    this.events = [];
  };

  EventListener.prototype.push = function(event) {
    this.Log.debug({ event: event }, "New event");
  };

  EventListener.prototype.registerListener =
    function(listener, name, types) {
    };

  module.exports = EventListener;
})();
