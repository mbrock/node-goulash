require('./common.js');

var Q = require('q');

describe('UserUpdater', function() {
  var DomainUpdater;
  var UserUpdater;
  var UserRepository;

  beforeEach(function() {
    DomainUpdater = {
      register: function() { }
    };

    UserRepository = {
    };

    UserUpdater = new (require('../src/UserUpdater.js'))({
      DomainUpdater: DomainUpdater,
      UserRepository: UserRepository
    });
  });

  it('should listen to UserCreated', function(done) {
    DomainUpdater.register = function(type, handler) {
      type.should.eql('UserCreated');
      done();
    };

    UserUpdater.initialize();
  });

  it('should handle a UserCreated event', function(done) {
    UserUpdater.initialize();
    UserUpdater.handle({
      eventType: 'UserCreated',
      aggregateId: '123'
    });
    done();
  });
});
