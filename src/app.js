var express = require('express')
  , passport = require('passport')
  , crypto = require('crypto')
  , RedditStrategy = require('passport-reddit').Strategy;

passport.use(
  new RedditStrategy({
    clientID: process.env.REDDIT_KEY,
    clientSecret: process.env.REDDIT_SECRET,
    callbackURL: "http://goula.sh/auth/reddit/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      console.log("New token! " + accessToken);
      return done(null, profile);
    })
  }));

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
  app.use(app.router);
});

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
      successRedirect: '/start',
      failureRedirect: '/login'
    })(req, res, next);
  } else {
    next(new Error(403));
  }
});

app.get('/start', function(req, res) {
  console.log(req.user);
  res.send('Welcome ' + req.user.name + '!');
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
