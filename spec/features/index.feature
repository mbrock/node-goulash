Feature: Index page
  As a user of Goulash
  I want to access the index page
  So that I can have fun

  Scenario: Accessing the root URL
    When I visit the root URL
    Then I should get an OK HTTP response

  Scenario: Seeing a link to reddit login
    When I visit the root URL
    Then I should see a link "Login through Reddit"

  Scenario: Clicking reddit login link
    When I visit the root URL
    And I click "Login through Reddit"
    Then I should be redirected to Reddit's login page

  Scenario: Logging in through reddit
    When I visit the root URL
    And I click "Login through Reddit"
    And I enter valid reddit credentials
    Then I should return to Goulash
