Feature: Index page
  As a user of Goulash
  I want to access the index page
  So that I can have fun

  Scenario: Accessing the root URL
    When I visit the root URL
    Then I should get an OK HTTP response

  Scenario: Logging in through reddit
    When I visit the root URL
    Then I should see a link "Login through Reddit"
    When I click "Login through Reddit"
    Then I should be redirected to Reddit's login page
    And I enter valid reddit credentials
    Then I should return to Goulash
