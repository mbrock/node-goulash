var express = require('express')
  , passport = require('passport')
  , crypto = require('crypto')
  , RedditStrategy = require('passport-reddit').Strategy
  , _ = require('underscore')
  , Bunyan = require('bunyan')
  , expressBunyan = require('./express-bunyan.js');

var log = new Bunyan({ 
  name: "goulash",
  serializers: {
    req: Bunyan.stdSerializers.req
  },
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    },
    {
      path: 'goulash.log',
      level: 'trace'
    }
  ]
});

passport.use(
  new RedditStrategy({
    clientID: process.env.REDDIT_KEY,
    clientSecret: process.env.REDDIT_SECRET,
    callbackURL: "http://goula.sh/auth/reddit/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    log.trace({
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile
    }, "Reddit authorization callback");

    UserRegistry.findOrCreateRedditUser(
      profile.id, profile.name, function(user) {
        done(null, user);
      }
    );
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
                                
var app = express();

app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'top secret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(expressBunyan.logger(log));
  app.use(expressBunyan.errorLogger(log));
  app.use(app.router);
});

var EventStore = {
  listeners: [],
  events: []
};

EventStore.push = function(event) {
  log.debug({ event: event }, "New event");
  this.events.push(event);
};

EventStore.registerListener = function(listener, name, eventTypes) {
  function makeFilteringListener() {
    return function(event) {
      if (_.contains(eventTypes, event.eventType)) {
        listener(event);
      }
    };
  }

  if (eventTypes !== undefined) {
    this.registerListener(makeFilteringListener());
  } else {
    this.listeners.push(listener);
  }

  log.trace({
    listenerName: name,
    eventTypes: eventTypes
  }, "Event listener registered");
};

var UserRegistry = {
  users: {}
};

UserRegistry.findOrCreateRedditUser = function(redditId, name, callback) {
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

    this.users[aggregateId] = newUser;

    callback(newUser);
  }
};

EventStore.registerListener(function(event) {
  UserRegistry.users[event.aggregateId] = {
    aggregateId: event.aggregateId,
    userName: event.payload.userName,
    credentials: event.payload.credentials
  };
}, 'user-registry', ['user-registered']);

app.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/start');
  } else {
    res.send('<a href="/auth/reddit">Login through Reddit</a>');
  }
});

app.get('/auth/reddit', function(req, res, next) {
  req.session.state = crypto.randomBytes(32).toString('hex');
  passport.authenticate('reddit', {
    state: req.session.state
  })(req, res, next);
});

app.get('/auth/reddit/callback', function(req, res, next) {
  if (req.query.state === req.session.state) {
    passport.authenticate('reddit', {
      successRedirect: '/auth/done',
      failureRedirect: '/'
    })(req, res, next);
  } else {
    next(new Error(403));
  }
});

app.get('/auth/done', function(req, res) {
  log.debug({ req: req }, "Authorization complete");
  res.redirect('/start');
});

app.get('/start', function(req, res) {
  res.send('Welcome ' + JSON.stringify(req.user) + '!');
});

exports.goulash = {
  start: function(port, callback) {
    this.server = app.listen(port);
    log.info({ port: port }, "Goulash started");
    callback();
  },

  stop: function(callback) {
    this.server.close();
    log.info("Goulash stopped");
    callback();
  }
};
