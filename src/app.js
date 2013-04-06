var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Hello!');
});

exports.goulash = {
  start: function(port, callback) {
    this.server = app.listen(port);
    callback();
  },

  stop: function(callback) {
    this.server.close();
    callback();
  }
};
