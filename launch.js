var conf = require('./src/conf.js'),
    goulash = require('./src/app.js').goulash;

goulash.start(conf.port, function() {});
