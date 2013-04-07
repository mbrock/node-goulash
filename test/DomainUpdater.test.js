require('./common.js');

var Q = require('q');

describe('DomainUpdater', function() {
  var updater;

  beforeEach(function() {
    updater = new (require('../src/DomainUpdater.js'))({
    });
  });

  it('should not accept an event without type', function(done) {
    updater.update({ foo: 1 }).should.be.rejected.and.notify(done);
  });

  it('should not accept an event with unhandled type', function(done) {
    updater.update({ eventType: 'foo' }).should.be.rejected.and.notify(done);
  });

  it('should handle an event', function(done) {
    var event = { eventType: 'foo', x: 1 };

    updater.register('foo', function(e) {
      e.should.eql(event);
      done();
    });

    updater.update(event);
  });

  it('should not send an irrelevant event to a handler', function(done) {
    var event = { eventType: 'foo', x: 1 };
    var wasCalled = false;

    updater.register('bar', function(e) {
      wasCalled = true;
    });

    updater.update(event).then(function() {
      wasCalled.should.be.false;
    }).should.be.rejected.notify(done);
  });

  it('should send an event only to the relevant handler', function(done) {
    var event = { eventType: 'foo', x: 1 };
    var calls = [];

    updater.register('bar', function(e) {
      calls.push('bar');
    });

    updater.register('foo', function(e) {
      calls.push('foo');
    });

    updater.update(event).then(function() {
      calls.should.eql(['foo']);
    }).should.be.fulfilled.notify(done);
  });

  it("shouldn't accept double registration", function() {
    (function doubleRegister () {
      updater.register('foo', function() { });
      updater.register('foo', function() { });
    }).should.throw(/already registered/);
  });
});
