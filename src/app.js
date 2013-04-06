var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Hello!');
});

exports.goulash = {
  start: function(port, callback) {
    app.listen(port);
    callback();
  }
};
