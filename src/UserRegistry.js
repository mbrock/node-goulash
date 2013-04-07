var _ = require('underscore');

module.exports = function(options) {
  var self = this;

  var Log = options.Log,
      EventStore = options.EventStore;

  var users = {};

  this.findOrCreateRedditUser = function(redditId, name, callback) {
    function isTheOne(user) {
      return user.credentials.redditId === redditId;
    }
    
    var user = _.find(_.values(this.users), isTheOne)
    
    if (user) {
      callback(user);
    } else {
      var aggregateId = _.uniqueId('user');
      var newUser = {
        aggregateId: aggregateId,
        userName: name,
        credentials: {
          redditId: redditId
        }
      };
      
      EventStore.push({
        eventType: 'user-registered',
        aggregateId: aggregateId,
        payload: newUser
      });
      
      users[aggregateId] = newUser;
      
      callback(newUser);
    }
  };

  EventStore.registerListener(function(event) {
    users[event.aggregateId] = {
      aggregateId: event.aggregateId,
      userName: event.payload.userName,
      credentials: event.payload.credentials
    };
  }, 'user-registry', ['user-registered']);
};
