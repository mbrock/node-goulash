var steps = function() {
  this.World = require('../support/world.js').World;
  this.Hooks = require('../support/hooks.js');
  this.Hooks();

  this.Given(/^the server is started$/, function(callback) {
    this.goulash.start(callback);
  });
  
  this.When(/^I visit the root URL$/, function(callback) {
    this.browser.visit('http://localhost:3000/', callback);
  });
  
  this.Then(/^I should get an OK HTTP response$/, function(callback) {
    if (this.browser.success) {
      callback();
    } else {
      callback.fail();
    }
  });

  this.Then(/^I should see a link "([^"]*)"$/, function(text, callback) {
    if (this.browser.link(text) !== undefined) {
      callback();
    } else {
      callback.fail();
    }
  });

  this.When(/^I click "([^"]*)"$/, function(text, callback) {
    this.browser.clickLink(text, callback);
  });
  
  this.Then(
    "I should be redirected to Reddit's login page",
    function(callback) {
      if (this.browser.location.href.match(/reddit/)) {
        if (this.browser.query('input')) {
          callback();
        } else {
          callback.fail(new Error("No input field on reddit login"));
        }
      } else {
        callback.fail(new Error("Wrong URL: " + this.browser.location));
      }
    });

  this.When(/^I enter valid reddit credentials$/, function(callback) {
    var browser = this.browser;
    browser
      .fill('user', this.conf.test.reddit.username)
      .fill('passwd', this.conf.test.reddit.password)
      .pressButton('login', function() {
        console.log(browser.html());
        browser.pressButton('authorize', callback);
      });
  });

  this.Then(/^I should return to Goulash$/, function(callback) {
    if (this.browser.location.href === this.conf.baseUrl + 'start') {
      callback();
    } else {
      callback.fail(new Error("Ended up at " + this.browser.location));
    }
  });
};

module.exports = steps;
