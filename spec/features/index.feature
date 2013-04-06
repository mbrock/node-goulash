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
