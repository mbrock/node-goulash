Feature: Index page
  As a user of Goulash
  I want to access the index page
  So that I can have fun

  Scenario: 200 OK on the root URL
    Given the server is started
    When I visit the root URL
    Then I should get an OK HTTP response
