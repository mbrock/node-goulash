require('./common.js');

var Q = require('q');

describe('EventDenormalizer', function() {
  var ED;

  beforeEach(function() {
    ED = new (require('../src/EventDenormalizer.js'))({
    });
  });

  it('should not accept an event without type', function(done) {
    ED.update({ foo: 1 }).should.be.rejected.and.notify(done);
  });

  it('should not accept an event with unhandled type', function(done) {
    ED.update({ eventType: 'foo' }).should.be.rejected.and.notify(done);
  });

  it('should handle an event', function(done) {
    var event = { eventType: 'foo', x: 1 };

    ED.register('foo', function(e) {
      e.should.eql(event);
      done();
    });

    ED.update(event);
  });

  it('should not send an irrelevant event to a handler', function(done) {
    var event = { eventType: 'foo', x: 1 };
    var wasCalled = false;

    ED.register('bar', function(e) {
      wasCalled = true;
    });

    ED.update(event).then(function() {
      wasCalled.should.be.false;
    }).should.be.rejected.notify(done);
  });

  it('should send an event only to the relevant handler', function(done) {
    var event = { eventType: 'foo', x: 1 };
    var calls = [];

    ED.register('bar', function(e) {
      calls.push('bar');
    });

    ED.register('foo', function(e) {
      calls.push('foo');
    });

    ED.update(event).then(function() {
      calls.should.eql(['foo']);
    }).should.be.fulfilled.notify(done);
  });

  it("shouldn't accept double registration", function() {
    (function doubleRegister () {
      ED.register('foo', function() { });
      ED.register('foo', function() { });
    }).should.throw(/already registered/);
  });
});
