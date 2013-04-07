require('./common.js');

var Q = require('q');

describe('EventStore', function() {
  var EventStore;

  beforeEach(function() {
    EventStore = new (require('../src/EventStore.js'))({
      Log: { debug: function() {} }
    });
  });

  it('should send an event to a registered listener', function(done) {
    EventStore.registerListener(f, 'f');
    EventStore.push({ x: 1 });

    function f(event) {
      event.should.eql({ x: 1});
      done();
    }
  });

  it('should send an event to two registered listeners', function(done) {
    var a = Q.defer(), b = Q.defer();

    EventStore.registerListener(f, 'f');
    EventStore.registerListener(g, 'g');
    EventStore.push({ x: 1 });

    function f(event) { a.resolve(event); };
    function g(event) { b.resolve(event); };

    Q.all([
      a.promise.should.become({ x: 1 }),
      b.promise.should.become({ x: 1 })
    ]).should.notify(done);
  });

  it('should not send an unwanted event', function(done) {
    var a = 0;

    EventStore.registerListener(f, 'f', ['foo']);
    EventStore.push({ eventType: 'bar' });

    function f(event) { a++; };

    setTimeout(function() {
      a.should.eql(0);
      done();
    }, 50);
  });

  it('should send a wanted event', function(done) {
    var a = Q.defer();

    EventStore.registerListener(f, 'f', ['foo']);
    EventStore.push({ eventType: 'foo' });

    function f(event) { a.resolve(event) };

    a.promise.should.eventually.eql({ eventType: 'foo' }).notify(done);
  });    
});
