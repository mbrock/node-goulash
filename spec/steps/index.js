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
};

module.exports = steps;
