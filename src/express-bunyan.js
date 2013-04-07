var bunyan = require('bunyan');

module.exports.logger = function logger(log) {
  if (typeof (log) !== 'object')
    throw new TypeError('log (Object) required');

  this.log = log;

  var self = this;
  return function logger(req, res, next) {
    req.log = log;
    self.log.trace({req: bunyan.stdSerializers.req(req)}, 'HTTP request');
    next();
  };
};

module.exports.errorLogger = function(log) {
  if (typeof (log) !== 'object')
    throw new TypeError('log (Object) required');

  this.log = log;

  var self = this;
  return function logger(err, req, res, next) {
    if (err)
      self.log.warn({err: err}, 'Error in Express chain');
    next();
  };
};
