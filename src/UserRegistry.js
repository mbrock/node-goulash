(function() {
  var _ = require('underscore');
  
  var UserRegistry = function(options) {
    this.Log = options.Log;
    this.EventStore = options.EventStore;
    
    this.users = {};

    this.EventStore.registerListener(function(event) {
      users[event.aggregateId] = {
        aggregateId: event.aggregateId,
        userName: event.payload.userName,
        credentials: event.payload.credentials
      };
    }.bind(this), 'user-registry', ['user-registered']);
  };
  
  UserRegistry.prototype.findOrCreateRedditUser = 
    function(redditId, name, callback) {
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
        
        this.EventStore.push({
          eventType: 'user-registered',
          aggregateId: aggregateId,
          payload: newUser
        });
        
        this.users[aggregateId] = newUser;
        
        callback(newUser);
      }
    };

  module.exports = UserRegistry;
})();
