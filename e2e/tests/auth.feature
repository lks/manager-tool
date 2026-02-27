Feature: Google Sign-In Authentication

  As a manager
  I want to sign in with my Google account
  So that I can land on the dashboard page

  Background:
    Given I am on the login page

  Scenario: Display login page with Google Sign-In button
    Then I should see the title "Manager Tool"
    And I should see "Your productivity toolbox"
    And I should see the "Sign in with Google" button

  Scenario: Redirect to Google OAuth when clicking sign-in button
    When I click the "Sign in with Google" button
    Then I should be redirected to Google OAuth

  Scenario: Redirect unauthenticated user to login when accessing dashboard
    Given I am not authenticated
    When I navigate to the dashboard page
    Then I should be redirected to the login page

  Scenario: Display Terms of Service notice
    Then I should see "By signing in, you agree to our Terms of Service"
