module.exports = function(options) {
  var Log = options.Log;

  var listeners = [];
  var events = [];

  this.push = function(event) {
    Log.debug({ event: event }, "New event");
  };

  this.registerListener = function(listener, name, types) {
  }
};
